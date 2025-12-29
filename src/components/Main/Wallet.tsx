import { FaWallet } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoKey } from "react-icons/io5";
import { TiSortAlphabetically } from "react-icons/ti";
import { IoClipboardSharp } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";

function WalletManagement() {
    async function copyRpcUrlToClipboard(address: string) {
        await navigator.clipboard.writeText(address);

        toast.success("Copied in your clipboard", {
            duration: 1000,
            position: "top-right",
        });
    }

    return (
        <>
            <Toaster />
            <div className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600">
                <div className="flex flex-row items-center gap-x-2 mb-6">
                    <FaWallet className="text-[#3B82F6]" />
                    <span className="text-white font-medium text-lg">Wallet Management</span>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-4">
                    <div
                        className="flex flex-1 flex-row items-center justify-center font-medium
                     text-white bg-[#2563eb] min-h-13 gap-x-2 py-1 px-2 rounded-lg cursor-pointer
                     transition-colors duration-200 hover:bg-blue-700"
                    >
                        <FiPlus size={22} />
                        <span>Generate</span>
                    </div>
                    <div
                        className="flex flex-1 flex-row items-center justify-center font-medium
                     text-white bg-[#374151] min-h-13 gap-x-2 py-1 px-2 rounded-lg cursor-pointer
                     transition-colors duration-200 hover:bg-gray-500"
                    >
                        <IoKey size={22} />
                        <span>Import Key</span>
                    </div>
                    <div
                        className="flex flex-1 flex-row items-center justify-center font-medium
                     text-white bg-[#374151] min-h-13 gap-x-2 py-1 px-2 rounded-lg cursor-pointer
                     transition-colors duration-200 hover:bg-gray-500"
                    >
                        <TiSortAlphabetically size={23} />
                        <span>Import Phrase</span>
                    </div>
                </div>

                <div
                    className="flex flex-col font-medium w-full h-auto bg-[#111827] p-6 gap-3
                  text-gray-300 rounded-lg"
                >
                    <span>Wallet 1</span>
                    <div className="flex flex-col bg-[#1f2937] p-4 rounded-lg gap-2">
                        <span>Address</span>
                        <div className="flex flex-row w-full items-center gap-2">
                            <p className="lg:flex hidden">0xdeaf7c4a7f3b8c9e1d2a3b4c5d6e7f8a9b0c1d2e</p>
                            <p className="lg:hidden flex">0xdeaadsfasdf...sda0c1d2e</p>
                            <div
                                className="cursor-pointer w-10 h-10 rounded-full bg-gray-500
                                flex items-center justify-center ml-auto mr-2"
                            >
                                <IoClipboardSharp
                                    onClick={() => copyRpcUrlToClipboard("0xdeaf7c4a7f3b8c9e1d2a3b4c5d6e7f8a9b0c1d2e")}
                                    size={21}
                                    className="text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-[#1f2937] p-4 rounded-lg gap-2">
                        <span>Balance</span>
                        <p className="text-green-500">0.0162 ETH</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WalletManagement;
