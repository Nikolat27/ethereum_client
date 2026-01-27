import { useState, useEffect } from "react";
import { FaServer } from "react-icons/fa6";
import { type SelectChangeEvent } from "@mui/material";
import { IoClipboardSharp } from "react-icons/io5";
import CustomTextField from "../CustomTextField";
import SelectOption from "../CustomSelectOption";
import type { SelectItemsList } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import { JsonRpcProvider } from "ethers";
import { ethService } from "../../services/provider";

function NetworkConfiguration() {
    const sectionId = "network-section";

    // State management
    const [network, setNetwork] = useState<string>("ethereum_mainnet");
    const [chainId, setChainId] = useState<string>("1");
    const [rpcUrl, setRpcUrl] = useState<string>("");
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // Network options
    const networkOptions: SelectItemsList = [
        { text: "Ethereum Mainnet", value: "ethereum_mainnet" },
        { text: "Sepolia Testnet", value: "sepolia_testnet" },
        { text: "Custom RPC", value: "custom" },
    ];

    const quickRpcUrls = [
        { name: "Alchemy Demo", url: "https://eth-mainnet.g.alchemy.com/v2/demo" },
        { name: "Infura Demo", url: "https://mainnet.infura.io/v3/YOUR-PROJECT-ID" },
        { name: "Local Node", url: "http://localhost:8545" },
    ];

    // Initialize component
    useEffect(() => {
        const savedRpcUrl = ethService.getCurrentRpcUrl();

        // Only auto-connect if user has previously configured a custom RPC URL
        if (savedRpcUrl && savedRpcUrl !== "http://localhost:8545") {
            setRpcUrl(savedRpcUrl);
            // Don't auto-test connection on startup - let user initiate it
            setIsConnected(false);
        } else {
            // No saved URL or using default - show default but don't connect
            setRpcUrl("https://eth-mainnet.g.alchemy.com/v2/demo");
            setIsConnected(false);
        }
    }, []);

    // Handle network selection
    const handleNetworkChange = (event: SelectChangeEvent) => {
        const selectedNetwork = event.target.value as string;
        setNetwork(selectedNetwork);
        setIsConnected(false);

        switch (selectedNetwork) {
            case "ethereum_mainnet":
                setRpcUrl("https://eth-mainnet.g.alchemy.com/v2/demo");
                setChainId("1");
                break;
            case "sepolia_testnet":
                setRpcUrl("https://eth-sepolia.g.alchemy.com/v2/demo");
                setChainId("11155111");
                break;
            default:
                setRpcUrl("");
                setChainId("");
        }
    };

    // Test RPC connection
    const testConnection = async (urlToTest: string): Promise<boolean> => {
        if (!urlToTest.trim()) {
            toast.error("Please enter an RPC URL", { duration: 2000, position: "top-right" });
            return false;
        }

        try {
            setIsConnecting(true);

            const provider = new JsonRpcProvider(urlToTest);
            await Promise.race([
                provider.getBlockNumber(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Connection timeout")), 5000)
                )
            ]);

            setIsConnected(true);
            toast.success("RPC connection successful!", { duration: 2000, position: "top-right" });
            return true;
        } catch (error: any) {
            setIsConnected(false);
            toast.error(`Connection failed: ${error.message}`, { duration: 3000, position: "top-right" });
            return false;
        } finally {
            setIsConnecting(false);
        }
    };

    // Handle connect action
    const handleConnect = async () => {
        const success = await testConnection(rpcUrl);
        if (success) {
            ethService.setProvider(rpcUrl);

            try {
                const provider = new JsonRpcProvider(rpcUrl);
                const network = await provider.getNetwork();
                setChainId(network.chainId.toString());
                toast.success(`Connected to chain ${network.chainId}`, { duration: 2000, position: "top-right" });
            } catch (error) {
                console.warn("Could not detect chain ID:", error);
            }
        }
    };

    // Handle disconnect action
    const handleDisconnect = () => {
        localStorage.removeItem("rpcUrl");
        setRpcUrl("");
        setIsConnected(false);
        setChainId("");
        ethService.setProvider("http://localhost:8545");
        toast.success("Disconnected successfully", { duration: 2000, position: "top-right" });
    };

    // Copy RPC URL to clipboard
    const copyRpcUrlToClipboard = async () => {
        await navigator.clipboard.writeText(rpcUrl);
        toast.success("Copied to clipboard", { duration: 1000, position: "top-right" });
    };

    return (
        <>
            <Toaster />
            <div id={sectionId} className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600">
                <div className="flex flex-row items-center gap-x-2 mb-6">
                    <FaServer className="text-[#3B82F6]" />
                    <span className="text-white font-medium text-lg">RPC Endpoint</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <SelectOption label="Network" value={network} onChange={handleNetworkChange} itemsList={networkOptions} />
                    <CustomTextField value={chainId} onChange={setChainId} label="Chain Id" placeholder="Chain Id" />
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="text-gray-400 text-sm self-center mr-2">Quick Connect:</span>
                    {quickRpcUrls.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                setRpcUrl(item.url);
                                setNetwork("custom");
                                setChainId("");
                                setIsConnected(false);
                            }}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                            type="button"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>

                <div className="flex flex-row gap-3 items-center justify-center">
                    <div className="flex-1">
                        <CustomTextField
                            value={rpcUrl}
                            onChange={setRpcUrl}
                            label="RPC URL"
                            placeholder="https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY"
                        />
                        <div className="mt-1 text-xs text-gray-400">
                            Examples: Alchemy, Infura, QuickNode, or local node (http://localhost:8545)
                        </div>
                    </div>
                    <div
                        onClick={copyRpcUrlToClipboard}
                        className="cursor-pointer w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center hover:bg-gray-600 transition-colors"
                        title="Copy RPC URL to clipboard"
                    >
                        <IoClipboardSharp size={21} className="text-white" />
                    </div>
                </div>

                <div className="flex items-center justify-center w-full gap-3">
                    <button
                        onClick={handleConnect}
                        disabled={isConnecting || !rpcUrl.trim()}
                        className={`cursor-pointer transition-color duration-300 w-38 h-10 rounded-3xl py-1 px-4 text-center text-white font-medium
                            ${isConnecting ? 'bg-yellow-600 cursor-not-allowed' :
                              isConnected ? 'bg-green-600 hover:bg-green-700' :
                              'bg-blue-600 hover:bg-blue-700'}`}
                        type="button"
                    >
                        {isConnecting ? "Testing..." : isConnected ? "Connected ✓" : "Test Connection"}
                    </button>

                    {isConnected && (
                        <button
                            onClick={handleDisconnect}
                            className="cursor-pointer transition-color duration-300 w-32 h-10 rounded-3xl bg-red-600 hover:bg-red-700 py-1 px-4 text-center text-white font-medium"
                            type="button"
                        >
                            Disconnect
                        </button>
                    )}

                    {/* {isConnected && (
                        <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-green-400 border border-green-600">
                            ✓ Connected
                        </div>
                    )} */}
                </div>
            </div>
        </>
    );
}

export default NetworkConfiguration;
