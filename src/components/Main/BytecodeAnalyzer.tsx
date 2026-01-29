import { useState } from "react";
import { FaCode, FaCopy, FaFileCode } from "react-icons/fa";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";

function BytecodeAnalyzer() {
    const sectionId = "bytecode-analyzer-section";
    const [bytecode, setBytecode] = useState<string>("");
    const [abi, setAbi] = useState<string>("");
    const [decodedData, setDecodedData] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function validateBytecode(code: string): boolean {
        // Clean the bytecode by removing whitespace and line breaks
        const cleanedCode = code.replace(/\s+/g, '').trim();
        return cleanedCode.startsWith("0x") && /^[0-9a-fA-F]*$/.test(cleanedCode.slice(2));
    }

    function validateAbi(abiString: string): boolean {
        try {
            JSON.parse(abiString);
            return true;
        } catch {
            return false;
        }
    }

    async function analyzeBytecode() {
        if (!bytecode.trim()) {
            toast.error("Please enter bytecode", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        // Clean the bytecode input
        const cleanedBytecode = bytecode.replace(/\s+/g, '').trim();

        if (!validateBytecode(cleanedBytecode)) {
            toast.error("Invalid bytecode format. Must start with 0x and contain only hex characters", {
                duration: 3000,
                position: "top-right",
            });
            return;
        }

        if (abi.trim() && !validateAbi(abi)) {
            toast.error("Invalid ABI JSON format", {
                duration: 3000,
                position: "top-right",
            });
            return;
        }

        setIsLoading(true);
        setDecodedData("");

        try {
            // Use cleaned bytecode for analysis
            const analysis: any = {
                bytecodeLength: cleanedBytecode.length,
                bytecodeSize: (cleanedBytecode.length - 2) / 2, // -2 for "0x" prefix
                hasConstructor: cleanedBytecode.includes("6080604052"), // Common constructor pattern
            };

            // If ABI is provided, try to decode more information
            if (abi.trim()) {
                try {
                    const parsedAbi = JSON.parse(abi);

                    analysis.functions = [];
                    analysis.events = [];

                    // Extract function and event signatures
                    parsedAbi.forEach((item: any) => {
                        if (item.type === "function") {
                            analysis.functions.push({
                                name: item.name,
                                inputs: item.inputs?.map((input: any) => `${input.type} ${input.name}`) || [],
                                outputs: item.outputs?.map((output: any) => `${output.type} ${output.name}`) || [],
                                stateMutability: item.stateMutability
                            });
                        } else if (item.type === "event") {
                            analysis.events.push({
                                name: item.name,
                                inputs: item.inputs?.map((input: any) => `${input.type} ${input.name}${input.indexed ? " (indexed)" : ""}`) || []
                            });
                        }
                    });
                } catch (abiError) {
                    analysis.abiError = "Could not parse ABI: " + (abiError as Error).message;
                }
            }

            const formattedAnalysis = JSON.stringify(analysis, null, 2);
            setDecodedData(formattedAnalysis);
            // Update the input with cleaned bytecode
            setBytecode(cleanedBytecode);

            toast.success("Bytecode analyzed successfully!", {
                duration: 2000,
                position: "top-right",
            });
        } catch (error: any) {
            const errorMessage = error.message || "Failed to analyze bytecode";
            setDecodedData(JSON.stringify({ error: errorMessage }, null, 2));

            toast.error(errorMessage, {
                duration: 3000,
                position: "top-right",
            });
        } finally {
            setIsLoading(false);
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
                    <FaFileCode size={21} className="text-[#3B82F6]" />
                    <span className="text-white font-medium text-lg"> Smart Contract Bytecode Analyzer </span>
                </div>

                <div className="flex flex-col w-full gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="text-gray-400">Contract Bytecode:</span>
                        <textarea
                            value={bytecode}
                            onChange={(e) => setBytecode(e.target.value)}
                            placeholder="0x..."
                            rows={6}
                            className="border border-white text-gray-300 rounded-lg placeholder:text-gray-300 p-4
                        focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400
                        font-mono text-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-gray-400">Contract ABI (Optional):</span>
                        <textarea
                            value={abi}
                            onChange={(e) => setAbi(e.target.value)}
                            placeholder='[{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'
                            rows={8}
                            className="border border-white text-gray-300 rounded-lg placeholder:text-gray-300 p-4
                        focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400
                        font-mono text-sm"
                        />
                    </div>

                    <div
                        onClick={analyzeBytecode}
                        className={`flex flex-row items-center self-center justify-center w-full sm:w-56 h-15
                    bg-[#2563eb] text-white rounded-lg gap-4 select-none
                    transition-colors duration-200 hover:bg-blue-700 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
                    >
                        <FaCode />
                        <span className="font-medium">{isLoading ? "Analyzing..." : "Analyze Bytecode"}</span>
                    </div>

                    {decodedData && (
                        <div className="flex flex-col p-4 gap-2 w-full items-start justify-start bg-[#1f2937]
                    border border-gray-500 text-gray-400 h-auto rounded-lg max-h-96 overflow-auto">
                            <div className="flex flex-row items-center justify-between w-full">
                                <span className="font-medium">Analysis Results: </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(decodedData);
                                        toast.success("Analysis copied to clipboard!", {
                                            duration: 2000,
                                            position: "top-right",
                                        });
                                    }}
                                    className="flex flex-row items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors duration-200"
                                >
                                    <FaCopy size={14} />
                                    <span>Copy</span>
                                </button>
                            </div>
                            <pre className="text-gray-200 text-md w-full overflow-x-auto">{decodedData}</pre>
                        </div>
                    )}

                    {!decodedData && (
                        <div className="flex flex-col p-4 gap-2 w-full items-start justify-start bg-[#1f2937]
                        border border-gray-500 text-gray-400 h-auto rounded-lg">
                            <p className="text-gray-500">
                                Enter contract bytecode and optionally ABI to analyze the contract structure.
                                The analyzer will provide information about functions, events, and contract size.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default BytecodeAnalyzer;
