import { FaCode } from "react-icons/fa";
import SelectOption from "../SelectOption";
import { useState } from "react";
import { type SelectChangeEvent } from "@mui/material";
import type { SelectItemsList } from "../../types/types";

function RawJsonRpcRequest() {
    const [method, setMethod] = useState<string>("");
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

            <div className="flex flex-col w-full">
                <SelectOption label="method" value={method} onChange={handleMethodChange} itemsList={itemsList} />
            </div>
        </div>
    );
}

export default RawJsonRpcRequest;
