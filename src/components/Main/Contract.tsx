import { useState } from "react";
import { FaFileContract } from "react-icons/fa6";
import CustomTextField from "../CustomTextField";
import { AiFillRead } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";

function ContractInteraction() {
    const [address, setAddress] = useState<string>("");
    const [ABI, setABI] = useState<string>("");

    return (
        <div className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600">
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
                        className="cursor-pointer h-10 px-4 py-2 bg-[#2563eb] text-white font-medium
                        rounded-lg text-center transition-colors duration-200 hover:bg-blue-700"
                    >
                        Load
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
                        className="flex flex-1 h-13 flex-row bg-[#374151] rounded-lg
                        items-center justify-center cursor-pointer gap-2 transition-all
                        duration-300 hover:bg-gray-500"
                    >
                        <AiFillRead size={23} />
                        <span>Read Methods</span>
                    </div>
                    <div
                        className="flex flex-1 h-13 flex-row bg-[#374151] rounded-lg
                        items-center justify-center cursor-pointer gap-2 transition-all
                        duration-300 hover:bg-gray-500"
                    >
                        <RiPencilFill size={23} />
                        <span>Write Methods</span>
                    </div>
                </div>
                <div
                    className="flex w-full items-center justify-center bg-[#1f2937]
                    border border-gray-500 text-gray-400 font-medium h-21.5 rounded-lg"
                >
                    Load a contract to view available methods
                </div>
            </div>
        </div>
    );
}

export default ContractInteraction;
