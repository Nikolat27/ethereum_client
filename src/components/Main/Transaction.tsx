import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import CustomTextField from "../CustomTextField";
import { IoIosCalculator } from "react-icons/io";
import { FaSignature } from "react-icons/fa";

function TransactionBuilder() {
    const sectionId = "transaction-section";
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");

    const [txValue, setTxValue] = useState<string>("");
    const [gasLimit, setGasLimit] = useState<string>("");
    const [gasPrice, setGasPrice] = useState<string>("");

    const [data, setData] = useState<string>("");

    return (
        <div id={sectionId} className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600">
            <div className="flex flex-row items-center gap-x-2 mb-6">
                <FaTelegramPlane size={21} className="text-[#3B82F6]" />
                <span className="text-white font-medium text-lg">Transaction Builder</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 w-full">
                <div
                    className="flex flex-row w-full gap-2 text-yellow-400 bg-[#302e30]
                    border border-yellow-500 rounded-lg h-14 items-center p-3"
                >
                    <IoIosWarning size={23} />
                    <span>Always verify transaction details before signing. This action is irreversible.</span>
                </div>

                <div className="flex flex-row items-center justify-center w-full gap-2">
                    <CustomTextField value={from} onChange={setFrom} label="From" placeholder="0x0x00" />
                    <CustomTextField value={to} onChange={setTo} label="To" placeholder="0x0x0x00" />
                </div>
                <div className="flex flex-row items-center justify-center w-full gap-2">
                    <CustomTextField value={txValue} onChange={setTxValue} label="Value (ETH)" placeholder="0x0x00" />
                    <CustomTextField value={gasLimit} onChange={setGasLimit} label="Gas Limit" placeholder="0x0x0x00" />
                    <CustomTextField
                        value={gasPrice}
                        onChange={setGasPrice}
                        label="Gas Price (Gwei)"
                        placeholder="0x0x0x00"
                    />
                </div>
                <CustomTextField value={data} onChange={setData} label="Data (ETH)" placeholder="0x..." />
                <div className="flex flex-col w-full gap-2 text-gray-400 border p-5 rounded-lg">
                    <div className="flex flex-row w-full gap-2">
                        <span>Estimated Fee</span>
                        <span className="text-white ml-auto mr-2">0.00002525 ETH</span>
                    </div>
                    <div className="flex flex-row w-full gap-2">
                        <span>Total Cost</span>
                        <span className="text-green-500 ml-auto mr-2">0.00002525 ETH</span>
                    </div>
                </div>
                <div className="flex flex-row w-full text-white font-medium gap-4">
                    <div
                        className="flex flex-1 h-13 flex-row bg-[#374151] rounded-lg
                        items-center justify-center cursor-pointer gap-2 transition-all
                        duration-300 hover:bg-gray-500"
                    >
                        <IoIosCalculator size={23} />
                        <span>Estimate Gas</span>
                    </div>
                    <div
                        className="flex flex-1 h-13 flex-row bg-[#2563eb] rounded-lg
                        items-center justify-center cursor-pointer gap-2 transition-all
                        duration-300 hover:bg-blue-700"
                    >
                        <FaSignature size={23} />
                        <span>Sign & Send</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionBuilder;
