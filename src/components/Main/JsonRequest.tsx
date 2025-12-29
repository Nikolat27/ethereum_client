import { useState } from "react";
import { FaCode } from "react-icons/fa";
import SelectOption from "../SelectOption";
import { type SelectChangeEvent } from "@mui/material";
import type { SelectItemsList } from "../../types/types";
import { FaPlay } from "react-icons/fa";

function RawJsonRpcRequest() {
    const [method, setMethod] = useState<string>("");
    const [parameters, setParameters] = useState<string>("");
    const itemsList: SelectItemsList = [];

    function handleMethodChange(event: SelectChangeEvent) {
        setMethod(event.target.value);
    }

    return (
        <div className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600">
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
                    className="flex flex-row items-center self-center justify-center w-full sm:w-56 h-15
                  bg-[#2563eb] text-white rounded-lg gap-4 select-none cursor-pointer
                  transition-colors duration-200 hover:bg-blue-700"
                >
                    <FaPlay />
                    <span className="font-medium">Execute Request</span>
                </div>
                <div
                    className="flex flex-col p-4 gap-2 w-full items-start justify-start bg-[#1f2937]
                    border border-gray-500 text-gray-400 h-auto rounded-lg"
                >
                    <span>Response: </span>
                    <p className="text-gray-200">No response yet</p>
                </div>
            </div>
        </div>
    );
}

export default RawJsonRpcRequest;
