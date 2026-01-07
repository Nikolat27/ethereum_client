import { useState } from "react";
import { FaFileContract } from "react-icons/fa6";
import CustomTextField from "../CustomTextField";
import { AiFillRead } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";
import { ethService } from "../../services/provider";
import { Contract, Interface } from "ethers";
import { useWallet } from "../../contexts/WalletContext";
import toast, { Toaster } from "react-hot-toast";
import MethodExecutionModal from "../Modals/MethodExecutionModal";

function ContractInteraction() {
    const sectionId = "contract-section";
    const { wallet } = useWallet();
    const [address, setAddress] = useState<string>("");
    const [ABI, setABI] = useState<string>("");
    const [contract, setContract] = useState<Contract | null>(null);
    const [readMethods, setReadMethods] = useState<any[]>([]);
    const [writeMethods, setWriteMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Modal states
    const [methodModalOpen, setMethodModalOpen] = useState<boolean>(false);
    const [selectedMethod, setSelectedMethod] = useState<any>(null);
    const [methodParams, setMethodParams] = useState<string[]>([]);
    const [methodResult, setMethodResult] = useState<string>("");
    const [isExecuting, setIsExecuting] = useState<boolean>(false);

    async function loadContract() {
        if (!address.trim()) {
            toast.error("Please enter a contract address", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        if (!ABI.trim()) {
            toast.error("Please enter contract ABI", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        setIsLoading(true);
        try {
            // Parse ABI
            const parsedABI = JSON.parse(ABI);
            const iface = new Interface(parsedABI);

            // Create contract instance
            const provider = ethService["client"];
            const contractInstance = new Contract(address, parsedABI, provider);

            setContract(contractInstance);

            // Separate read and write methods
            const reads: any[] = [];
            const writes: any[] = [];

            iface.fragments.forEach((fragment: any) => {
                if (fragment.type === "function") {
                    const method = {
                        name: fragment.name,
                        inputs: fragment.inputs,
                        outputs: fragment.outputs,
                        stateMutability: fragment.stateMutability,
                    };

                    if (fragment.stateMutability === "view" || fragment.stateMutability === "pure") {
                        reads.push(method);
                    } else {
                        writes.push(method);
                    }
                }
            });

            setReadMethods(reads);
            setWriteMethods(writes);

            toast.success(`Contract loaded! ${reads.length} read methods, ${writes.length} write methods`, {
                duration: 3000,
                position: "top-right",
            });
        } catch (error: any) {
            console.error("Load contract error:", error);
            toast.error(error.message || "Failed to load contract", {
                duration: 3000,
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
        }
    }

    function openMethodModal(method: any, isWrite: boolean) {
        setSelectedMethod({ ...method, isWrite });
        setMethodParams(new Array(method.inputs.length).fill(""));
        setMethodResult("");
        setMethodModalOpen(true);
    }

    function updateParam(index: number, value: string) {
        const newParams = [...methodParams];
        newParams[index] = value;
        setMethodParams(newParams);
    }

    async function executeMethod() {
        if (!contract || !selectedMethod) return;

        if (selectedMethod.isWrite && !wallet) {
            toast.error("Please connect a wallet to execute write methods", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        setIsExecuting(true);
        setMethodResult("");

        try {
            // Parse parameters
            const parsedParams = methodParams.map((param, index) => {
                const inputType = selectedMethod.inputs[index].type;

                // Handle empty strings
                if (!param.trim()) {
                    if (inputType.includes("int")) return "0";
                    if (inputType === "bool") return false;
                    if (inputType === "address") return "0x0000000000000000000000000000000000000000";
                    return param;
                }

                // Try to parse JSON for complex types
                if (inputType.includes("[") || inputType === "tuple") {
                    try {
                        return JSON.parse(param);
                    } catch {
                        return param;
                    }
                }

                return param;
            });

            if (selectedMethod.isWrite) {
                // Write method - needs wallet
                const contractWithSigner = contract.connect(wallet!);
                const tx = await (contractWithSigner as any)[selectedMethod.name](...parsedParams);

                toast.loading("Transaction sent, waiting for confirmation...", {
                    duration: 2000,
                    position: "top-right",
                });

                const receipt = await tx.wait();

                setMethodResult(
                    JSON.stringify(
                        {
                            transactionHash: receipt.hash,
                            blockNumber: receipt.blockNumber,
                            gasUsed: receipt.gasUsed.toString(),
                            status: receipt.status === 1 ? "Success" : "Failed",
                        },
                        null,
                        2
                    )
                );

                toast.success("Transaction confirmed!", {
                    duration: 3000,
                    position: "top-right",
                });
            } else {
                // Read method
                const result = await contract[selectedMethod.name](...parsedParams);

                // Format result
                let formattedResult;
                if (typeof result === "object" && result !== null) {
                    formattedResult = JSON.stringify(
                        result,
                        (key, value) => (typeof value === "bigint" ? value.toString() : value),
                        2
                    );
                } else if (typeof result === "bigint") {
                    formattedResult = result.toString();
                } else {
                    formattedResult = String(result);
                }

                setMethodResult(formattedResult);

                toast.success("Method executed successfully!", {
                    duration: 2000,
                    position: "top-right",
                });
            }
        } catch (error: any) {
            console.error("Execute method error:", error);
            const errorMessage = error.message || "Failed to execute method";
            setMethodResult(JSON.stringify({ error: errorMessage }, null, 2));

            toast.error(errorMessage, {
                duration: 3000,
                position: "top-right",
            });
        } finally {
            setIsExecuting(false);
        }
    }

    return (
        <>
            <Toaster />
            <div
                id={sectionId}
                className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600"
            >
                <div className="flex flex-row items-center gap-x-2 mb-6">
                    <FaFileContract size={21} className="text-[#3B82F6]" />
                    <span className="text-white font-medium text-lg">Contract Interaction</span>
                </div>

                <div className="flex flex-col items-center justify-center gap-8 w-full">
                    <div className="flex flex-row items-center w-full gap-2">
                        <CustomTextField
                            label="Contract Address"
                            placeholder="0x..."
                            value={address}
                            onChange={setAddress}
                        />
                        <button
                            onClick={loadContract}
                            disabled={isLoading}
                            className={`cursor-pointer h-10 px-4 py-2 bg-[#2563eb] text-white font-medium
                        rounded-lg text-center transition-colors duration-200 hover:bg-blue-700 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        >
                            {isLoading ? "Loading..." : "Load"}
                        </button>
                    </div>
                    <CustomTextField
                        label="ABI"
                        placeholder='[{"inputs":[],"name":"totalSupply",...}]'
                        value={ABI}
                        onChange={setABI}
                    />
                    <div className="flex flex-row w-full gap-4 text-white font-medium">
                        <div
                            onClick={() => contract && readMethods.length > 0 && toast("Select a read method below")}
                            className={`flex flex-1 h-13 flex-row bg-[#374151] rounded-lg
                        items-center justify-center gap-2 transition-all
                        duration-300 hover:bg-gray-500 ${
                            !contract || readMethods.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                        >
                            <AiFillRead size={23} />
                            <span>Read Methods ({readMethods.length})</span>
                        </div>
                        <div
                            onClick={() => contract && writeMethods.length > 0 && toast("Select a write method below")}
                            className={`flex flex-1 h-13 flex-row bg-[#374151] rounded-lg
                        items-center justify-center gap-2 transition-all
                        duration-300 hover:bg-gray-500 ${
                            !contract || writeMethods.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                        >
                            <RiPencilFill size={23} />
                            <span>Write Methods ({writeMethods.length})</span>
                        </div>
                    </div>
                    <div
                        className="flex w-full items-start justify-start bg-[#1f2937]
                    border border-gray-500 text-gray-400 font-medium rounded-lg p-4 flex-col gap-3"
                    >
                        {!contract ? (
                            <span className="w-full text-center py-4">Load a contract to view available methods</span>
                        ) : (
                            <>
                                {readMethods.length > 0 && (
                                    <div className="w-full">
                                        <h3 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                                            <AiFillRead size={20} />
                                            Read Methods (View)
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {readMethods.map((method, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => openMethodModal(method, false)}
                                                    className="bg-[#374151] hover:bg-gray-500 text-white p-3 rounded-lg
                                                text-left transition-colors duration-200 text-sm"
                                                >
                                                    <span className="font-medium">{method.name}</span>
                                                    <span className="text-gray-400 text-xs block mt-1">
                                                        ({method.inputs.length} params)
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {writeMethods.length > 0 && (
                                    <div className="w-full mt-4">
                                        <h3 className="text-blue-400 font-medium mb-3 flex items-center gap-2">
                                            <RiPencilFill size={20} />
                                            Write Methods (Payable/Non-payable)
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {writeMethods.map((method, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => openMethodModal(method, true)}
                                                    className="bg-[#2563eb] hover:bg-blue-700 text-white p-3 rounded-lg
                                                text-left transition-colors duration-200 text-sm"
                                                >
                                                    <span className="font-medium">{method.name}</span>
                                                    <span className="text-gray-200 text-xs block mt-1">
                                                        ({method.inputs.length} params)
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {readMethods.length === 0 && writeMethods.length === 0 && (
                                    <span className="w-full text-center py-4">No methods found in contract ABI</span>
                                )}
                            </>
                        )}
                    </div>

                    <MethodExecutionModal
                        open={methodModalOpen}
                        onClose={() => {
                            setMethodModalOpen(false);
                            setMethodResult("");
                        }}
                        selectedMethod={selectedMethod}
                        methodParams={methodParams}
                        methodResult={methodResult}
                        isExecuting={isExecuting}
                        onUpdateParam={updateParam}
                        onExecute={executeMethod}
                    />
                </div>
            </div>
        </>
    );
}

export default ContractInteraction;
