import { useState } from "react";
import { FaCode, FaCopy, FaPlay } from "react-icons/fa";
import SelectOption from "../CustomSelectOption";
import { type SelectChangeEvent } from "@mui/material";
import type { SelectItemsList } from "../../types/types";
import { ethService } from "../../services/provider";
import toast, { Toaster } from "react-hot-toast";

function RawJsonRpcRequest() {
    const sectionId = "json-rpc-section";
    const [method, setMethod] = useState<string>("eth_blockNumber");
    const [parameters, setParameters] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const itemsList: SelectItemsList = [
        { text: "eth_blockNumber - Get latest block number", value: "eth_blockNumber" },
        { text: "eth_gasPrice - Get current gas price", value: "eth_gasPrice" },
        { text: "eth_getBalance - Get account balance", value: "eth_getBalance" },
        { text: "eth_getTransactionCount - Get transaction count", value: "eth_getTransactionCount" },
        { text: "eth_getTransactionByHash - Get transaction by hash", value: "eth_getTransactionByHash" },
        { text: "eth_getBlockByNumber - Get block by number", value: "eth_getBlockByNumber" },
        { text: "eth_call - Execute contract call", value: "eth_call" },
        { text: "eth_estimateGas - Estimate gas for transaction", value: "eth_estimateGas" },
        { text: "eth_getCode - Get contract code", value: "eth_getCode" },
        { text: "net_version - Get network ID", value: "net_version" },
    ];

    function handleMethodChange(event: SelectChangeEvent) {
        const selectedMethod = event.target.value;
        setMethod(selectedMethod);
        setResponse("");

        // Set example parameters based on method
        switch (selectedMethod) {
            case "eth_getBalance":
                setParameters('["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "latest"]');
                break;
            case "eth_getTransactionCount":
                setParameters('["0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", "latest"]');
                break;
            case "eth_getTransactionByHash":
                setParameters('["0x..."]');
                break;
            case "eth_getBlockByNumber":
                setParameters('["latest", true]');
                break;
            case "eth_call":
                setParameters('[{"to":"0x...","data":"0x..."}, "latest"]');
                break;
            case "eth_estimateGas":
                setParameters('[{"to":"0x...","value":"0x0"}]');
                break;
            case "eth_getCode":
                setParameters('["0x...", "latest"]');
                break;
            case "eth_blockNumber":
            case "eth_gasPrice":
            case "net_version":
                setParameters("[]");
                break;
            default:
                setParameters("[]");
        }
    }

    async function executeRequest() {
        if (!method) {
            toast.error("Please select a method", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        setIsLoading(true);
        setResponse("");

        try {
            // Parse parameters
            let params = [];
            if (parameters.trim()) {
                try {
                    params = JSON.parse(parameters);
                    if (!Array.isArray(params)) {
                        throw new Error("Parameters must be a JSON array");
                    }
                } catch (parseError: any) {
                    toast.error("Invalid JSON in parameters: " + parseError.message, {
                        duration: 3000,
                        position: "top-right",
                    });
                    setIsLoading(false);
                    return;
                }
            }

            // Execute RPC call
            const provider = ethService["client"];
            const result = await provider.send(method, params);

            // Specific parsers for different RPC methods
            function parseBlockNumber(value: string): string {
                try {
                    const decimalValue = BigInt(value);
                    return `${value} (${decimalValue.toString()})`;
                } catch {
                    return value;
                }
            }

            function parseBalance(value: string): string {
                try {
                    const decimalValue = BigInt(value);
                    const ethValue = Number(decimalValue) / 1e18;

                    if (!isFinite(ethValue) || isNaN(ethValue)) {
                        return `Invalid balance (raw: ${value})`;
                    }

                    const formattedEth = ethValue.toLocaleString('en-US', {
                        minimumFractionDigits: 6,
                        maximumFractionDigits: 6
                    });
                    return `${formattedEth} ETH`;
                } catch {
                    return value;
                }
            }

            function parseGasPrice(value: string): string {
                try {
                    const decimalValue = BigInt(value);
                    const gweiValue = Number(decimalValue) / 1e9;

                    const formattedGwei = gweiValue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    return `${formattedGwei} Gwei`;
                } catch {
                    return value;
                }
            }

            function parseGenericHex(value: string): string {
                try {
                    const decimalValue = BigInt(value);

                    return `${value} ${decimalValue.toString()}`;
                } catch {
                    return value;
                }
            }

            // Main parser that routes to appropriate handler
            function parseResponse(obj: any, methodName: string): any {
                if (typeof obj === 'string' && obj.startsWith('0x')) {
                    switch (methodName) {
                        case 'eth_blockNumber':
                            return parseBlockNumber(obj);
                        case 'eth_getBalance':
                            return parseBalance(obj);
                        case 'eth_gasPrice':
                            return parseGasPrice(obj);
                        default:
                            return parseGenericHex(obj);
                    }
                } else if (Array.isArray(obj)) {
                    return obj.map(item => parseResponse(item, methodName));
                } else if (obj !== null && typeof obj === 'object') {
                    const newObj: any = {};
                    for (const key in obj) {
                        newObj[key] = parseResponse(obj[key], methodName);
                    }
                    return newObj;
                }
                return obj;
            }

            setResponse(result);

            toast.success("Request executed successfully!", {
                duration: 2000,
                position: "top-right",
            });
        } catch (error: any) {
            const errorMessage = error.message || "Failed to execute request";
            setResponse(JSON.stringify({ error: errorMessage }, null, 2));

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
                    <FaCode size={21} className="text-[#3B82F6]" />
                    <span className="text-white font-medium text-lg"> Raw JSON-RPC Request </span>
                </div>

                <div className="flex flex-col w-full gap-6">
                    <SelectOption label="method" value={method} onChange={handleMethodChange} itemsList={itemsList} />
                    <span className="text-gray-400">Parameters (JSON Array):</span>
                    <textarea
                        value={parameters}
                        onChange={(e) => setParameters(e.target.value)}
                        aria-label="Parameters (JSON Array)"
                        rows={5}
                        placeholder='[{"inputs":[],"name":"totalSupply",...}]'
                        className="border border-white text-gray-300 rounded-lg placeholder:text-gray-300 p-4
                    focus:outline-none focus:ring-1
                    focus:ring-gray-400
                    focus:border-gray-400"
                        name=""
                        id=""
                    ></textarea>

                    <div
                        onClick={executeRequest}
                        className={`flex flex-row items-center self-center justify-center w-full sm:w-56 h-15
                  bg-[#2563eb] text-white rounded-lg gap-4 select-none
                  transition-colors duration-200 hover:bg-blue-700 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        <FaPlay />
                        <span className="font-medium">{isLoading ? "Executing..." : "Execute Request"}</span>
                    </div>
                    <div className="flex flex-col p-4 gap-2 w-full items-start justify-start bg-[#1f2937]
                    border border-gray-500 text-gray-400 h-auto rounded-lg max-h-96 overflow-auto">
                        <div className="flex flex-row items-center justify-between w-full">
                            <span className="font-medium">Response: </span>
                            {response && (
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(response);
                                        toast.success("Response copied to clipboard!", {
                                            duration: 2000,
                                            position: "top-right",
                                        });
                                    }}
                                    className="flex flex-row items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors duration-200"
                                >
                                    <FaCopy size={14} />
                                    <span>Copy</span>
                                </button>
                            )}
                        </div>
                        {response ? (
                            <pre className="text-gray-200 font-medium text-lg w-full overflow-x-auto">{response}</pre>
                        ) : (
                            <p className="text-gray-500">No response yet. Select a method and execute the request.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default RawJsonRpcRequest;
