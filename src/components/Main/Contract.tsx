import { FaFileContract } from "react-icons/fa6";

function ContractInteraction() {
    return (
        <div className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600">
            <div className="flex flex-row items-center gap-x-2 mb-6">
                <FaFileContract size={21} className="text-[#3B82F6]" />
                <span className="text-white font-medium text-lg">Transaction Builder</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-8 w-full"></div>
        </div>
    );
}

export default ContractInteraction;
