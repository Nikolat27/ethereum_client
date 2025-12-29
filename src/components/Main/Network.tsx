import { useState } from "react";
import { FaServer } from "react-icons/fa6";
import { type SelectChangeEvent } from "@mui/material";
import { IoClipboardSharp } from "react-icons/io5";
import CustomTextField from "../CustomTextField";
import SelectOption from "../SelectOption";
import type { SelectItemsList } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";

function NetworkConfiguration() {
    const [network, setNetwork] = useState<string>("ethereum_mainnet");
    const [chainId, setChainId] = useState<string>("1");
    const [rpcUrl, setRpcUrl] = useState<string>("");
    const [connect, setConnect] = useState<boolean>(false);

    function handleNetworkChange(event: SelectChangeEvent) {
        setNetwork(event.target.value as string);
    }

    async function copyRpcUrlToClipboard() {
        await navigator.clipboard.writeText(rpcUrl);

        toast.success("Copied in your clipboard", {
            duration: 1000,
            position: 'top-right',
        });
    }

    function toggleConnection(value: boolean) {
        setConnect(value);
    }

    const itemsList: SelectItemsList = [
        { text: "Ethereum Mainnet", value: "ethereum_mainnet" },
        { text: "Sepolia Testnet", value: "sepolia_testnet" },
    ];

    return (
        <>
            <Toaster />

            <div className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600">
                <div className="flex flex-row items-center gap-x-2 mb-6">
                    <FaServer className="text-[#3B82F6]" />
                    <span className="text-white font-medium text-lg">RPC Endpoint</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <SelectOption
                        label="Network"
                        value={network}
                        onChange={handleNetworkChange}
                        itemsList={itemsList}
                    />

                    <CustomTextField value={chainId} onChange={setChainId} label="Chain Id" placeholder="Chain Id" />
                </div>
                <div className="flex flex-row gap-3 items-center justify-center">
                    <CustomTextField
                        value={rpcUrl}
                        onChange={setRpcUrl}
                        label="RPC URL"
                        placeholder="https://eth-mainnet.g.alchemy.com/v2/<api-key>"
                    />
                    <div
                        onClick={copyRpcUrlToClipboard}
                        className="cursor-pointer w-10 h-10 rounded-full bg-gray-500
                        flex items-center justify-center"
                    >
                        <IoClipboardSharp size={21} className="text-white" />
                    </div>
                </div>
                <div className="flex items-center justify-center w-full">
                    <button
                        onClick={() => toggleConnection(!connect)}
                        className="cursor-pointer transition-color duration-300 w-38 h-10 rounded-3xl
                      hover:bg-green-700 bg-green-600 py-1 px-2 
                        text-center text-white font-medium"
                        type="submit"
                    >
                        {connect ? "Connected" : "Connect"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default NetworkConfiguration;
