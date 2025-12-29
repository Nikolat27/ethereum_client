import { useState } from "react";
import { HiMiniWrench } from "react-icons/hi2";
import CustomTextField from "../CustomTextField";

function Utilities() {
    const [wei, setWei] = useState<string>("");
    const [gwei, setGwei] = useState<string>("");
    const [ether, setEther] = useState<string>("");

    const [address, setAddress] = useState<string>("");

    return (
        <div className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600">
            <div className="flex flex-row items-center gap-x-2 mb-6">
                <HiMiniWrench size={21} className="text-[#3B82F6]" />
                <span className="text-white font-medium text-lg">Utilities</span>
            </div>

            <div
                className="flex flex-col w-full h-auto p-6 items-start justify-center border
              border-gray-500 rounded-lg bg-[#111827] gap-5"
            >
                <span className="text-white font-medium">Unit Converter</span>
                <div className="flex flex-col sm:flex-row w-full gap-4">
                    <CustomTextField label="wei" placeholder="100000000" value={wei} onChange={setWei} />
                    <CustomTextField label="gwei" placeholder="1000" value={gwei} onChange={setGwei} />
                    <CustomTextField label="ether" placeholder="1" value={ether} onChange={setEther} />
                </div>
            </div>
            <div
                className="flex flex-col w-full h-auto p-6 items-start justify-center border
              border-gray-500 rounded-lg bg-[#111827] gap-5"
            >
                <span className="text-white font-medium">Address tools</span>
                <div className="flex flex-col w-full gap-4 items-center justify-center">
                    <CustomTextField label="address" placeholder="0x..." value={address} onChange={setAddress} />
                    <button
                        className="w-full sm:w-60 h-auto py-4 px-6 text-center text-white hover:bg-gray-600
                      bg-[#374151] font-medium rounded-lg cursor-pointer transition-colors duration-200"
                    >
                        Validate Address
                    </button>
                    <button
                        className="w-full sm:min-w-60 sm:w-auto h-auto py-4 px-6 text-center text-white hover:bg-gray-600
                      bg-[#374151] font-medium rounded-lg cursor-pointer transition-colors duration-200"
                    >
                        Convert to Checksum
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Utilities;
