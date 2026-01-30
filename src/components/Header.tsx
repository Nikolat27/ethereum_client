import { FaEthereum } from "react-icons/fa6";
import { IoDocumentSharp } from "react-icons/io5";
import { IoSettings, IoRefresh } from "react-icons/io5";
import { useState, useEffect } from "react";
import TemporaryDrawer from "./Drawer";
import { ethService } from "../services/provider";

function Header() {
    const [networkName, setNetworkName] = useState<string>("Checking...");
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // Initialize and listen for changes
    useEffect(() => {
        updateNetworkStatus();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "rpcUrl") {
                updateNetworkStatus();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Update network status
    const updateNetworkStatus = async () => {
        try {
            setNetworkName("Checking...");
            setIsConnected(false);

            const currentRpcUrl = ethService.getCurrentRpcUrl();

            // Check if RPC URL is configured by user
            if (!currentRpcUrl || currentRpcUrl === "http://localhost:8545") {
                setNetworkName("No RPC URL configured");
                setIsConnected(false);
                return;
            }

            // Only test connection if user has configured a custom RPC URL
            const connectionSuccess = await ethService.testConnection();
            setIsConnected(connectionSuccess);

            if (connectionSuccess) {
                setNetworkName(ethService.getNetworkName());
            } else {
                setNetworkName("Disconnected");
            }
        } catch (error) {
            console.error("Network status update failed:", error);
            setNetworkName("Connection Failed");
            setIsConnected(false);
        }
    };

    return (
        <header className="flex flex-row w-full h-14 bg-[#1f2937] sticky px-2 sm:px-4 mx-auto top-0 border-b border-gray-700 items-center gap-x-2 sm:gap-x-4 justify-start z-50">
            <div className="flex flex-row w-auto gap-x-2 h-auto px-2 sm:px-3 border-r border-r-gray-600 items-center justify-center">
                <FaEthereum color="white" size={24} className="sm:w-8 sm:h-8" />
                <h1 className="text-white font-medium text-lg sm:text-xl xs:block">Ethereum Client</h1>
            </div>

            {/* Compact network status for mobile */}
            <div className="py-1 px-2 rounded-lg flex flex-row gap-x-1 sm:gap-x-2 items-center justify-center h-auto bg-[#111827]">
                <button
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                    title={isConnected ? 'Connected' : 'Disconnected - Click refresh to retry'}
                ></button>
                <span className={`${!isConnected ? 'text-red-400' : 'text-gray-300'} text-xs sm:text-sm truncate max-w-25 sm:max-w-none`}>
                    {networkName}
                </span>
                <button
                    onClick={updateNetworkStatus}
                    className="ml-1 sm:ml-2 text-gray-400 hover:text-white transition-colors"
                    title="Refresh network status"
                >
                    <IoRefresh size={14} className="sm:w-4 sm:h-4" />
                </button>
            </div>

            <div className="flex flex-row w-auto ml-auto text-white gap-x-2">
                {/* <div className="cursor-pointer sm:flex hidden flex-row bg-gray-500 py-1 px-2 rounded-lg gap-x-2 items-center justify-center">
                    <IoDocumentSharp size={21} />
                    <span>Docs</span>
                </div>
                <div className="cursor-pointer sm:flex hidden flex-row bg-gray-500 py-1 px-2 rounded-lg gap-x-2 items-center justify-center">
                    <IoSettings size={21} />
                    <span>Settings</span>
                </div> */}
                <TemporaryDrawer />
            </div>
        </header>
    );
}

export default Header;
