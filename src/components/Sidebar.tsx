import { FaNetworkWired } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { FaFileContract } from "react-icons/fa6";
import { BiSolidWrench } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { RxCross1 } from "react-icons/rx";
import { IoCopyOutline } from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import toast from "react-hot-toast";
import { ethService } from "../services/provider";

function Sidebar() {
    const [activeTab, setActiveTab] = useState<string>("network");
    const { wallet, walletAddress, balance, setBalance } = useWallet();
    const isWalletConnected = wallet !== null;
    const tabActiveStyle: string = "text-[#60A5FA] bg-[#111827]";
    const tabNotActiveStyle: string = "text-[#D1D5DB]";

    const scrollToSection = (sectionId: string, tabName: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            setActiveTab(tabName);
            // Get the scrollable container (the main content area)
            const scrollContainer = element.closest(".overflow-y-auto");
            if (scrollContainer) {
                const elementTop = element.offsetTop;
                scrollContainer.scrollTo({
                    top: elementTop - 80,
                    behavior: "smooth",
                });
            }
        }
    };

    const copyAddressToClipboard = async () => {
        if (walletAddress) {
            try {
                await navigator.clipboard.writeText(walletAddress);
                toast.success("Address copied to clipboard", {
                    duration: 1500,
                    position: "top-right",
                });
            } catch (_error) {
                toast.error("Failed to copy address", {
                    duration: 2000,
                    position: "top-right",
                });
            }
        }
    };

    const refreshBalance = async () => {
        if (!walletAddress) return;

        try {
            const currentRpcUrl = ethService.getCurrentRpcUrl();
            if (!currentRpcUrl || currentRpcUrl === "http://localhost:8545") {
                toast.error("No valid RPC URL configured", {
                    duration: 2000,
                    position: "top-right",
                });
                return;
            }

            const balanceWei = await ethService.getBalance(walletAddress);
            const balanceEth = (Number(balanceWei) / 1e18).toFixed(4);
            setBalance(balanceEth);

            toast.success("Balance refreshed!", {
                duration: 1500,
                position: "top-right",
            });
        } catch (_error) {
            console.error("Failed to refresh balance");
            toast.error("Failed to refresh balance", {
                duration: 2000,
                position: "top-right",
            });
        }
    };

    return (
        <aside
            className="h-full hidden sm:flex w-56 bg-[#1f2937] border-r border-gray-600
            flex-col items-center justify-start px-4 pt-8 gap-y-3"
        >
            <div
                onClick={() => scrollToSection("network-section", "network")}
                className={`${activeTab === "network" ? tabActiveStyle : tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <FaNetworkWired size={21} />
                <span className="font-medium">Network</span>
            </div>
            <div
                onClick={() => scrollToSection("wallet-section", "wallet")}
                className={`${activeTab === "wallet" ? tabActiveStyle : tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <FaWallet size={21} />
                <span className="font-medium">Wallet</span>
            </div>
            <div
                onClick={() => scrollToSection("transaction-section", "transaction")}
                className={`${activeTab === "transaction" ? tabActiveStyle : tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <GrTransaction size={21} />
                <span className="font-medium">Transaction</span>
            </div>
            <div
                onClick={() => scrollToSection("contract-section", "contract")}
                className={`${activeTab === "contract" ? tabActiveStyle : tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <FaFileContract size={21} />
                <span className="font-medium">Contract</span>
            </div>
            <div
                onClick={() => scrollToSection("utilities-section", "utilities")}
                className={`${activeTab === "utilities" ? tabActiveStyle : tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <BiSolidWrench size={21} />
                <span className="font-medium">Utilities</span>
            </div>

            <div
                className="w-full h-auto p-3 flex flex-col items-start justify-start
              bg-[#111827] rounded-lg gap-1 border border-gray-500 mt-auto mb-8"
            >
                <div className="flex flex-row w-full gap-2 items-center justify-center">
                    <span className="text-gray-400 font-medium text-[13px]">
                        {isWalletConnected ? "ACTIVE WALLET" : "NO WALLET"}
                    </span>
                    {isWalletConnected ? (
                        <button className="text-center text-green-500 w-5 h-5 bg-white rounded-full ml-auto">
                            <TiTick className="ml-0.5" />
                        </button>
                    ) : (
                        <button className="text-center text-red-500 w-5 h-5 bg-white rounded-full ml-auto">
                            <RxCross1 className="ml-0.5" />
                        </button>
                    )}
                </div>
                {isWalletConnected ? (
                    <>
                        <div className="flex flex-row items-center gap-2 w-full">
                            <span className="text-gray-400 text-sm truncate flex-1">
                                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                            </span>
                            <button
                                onClick={copyAddressToClipboard}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Copy address to clipboard"
                            >
                                <IoCopyOutline size={16} />
                            </button>
                        </div>
                        <div className="flex flex-row items-center gap-2 mt-2">
                            <span className="text-gray-400 text-sm">{balance} ETH</span>
                            {isWalletConnected && (
                                <button
                                    onClick={refreshBalance}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Refresh balance"
                                >
                                    <MdRefresh size={16} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <span className="text-gray-500 text-sm mt-2">Connect a wallet to get started</span>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
