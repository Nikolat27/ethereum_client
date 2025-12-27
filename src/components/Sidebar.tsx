import { FaNetworkWired } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { FaFileContract } from "react-icons/fa6";
import { BiSolidWrench } from "react-icons/bi";

function Sidebar() {
    const tabActiveStyle: string = "text-[#60A5FA] bg-[#111827]";
    const tabNotActiveStyle: string = "text-[#D1D5DB]";

    return (
        <aside
            className="h-full hidden sm:flex w-56 bg-[#1f2937] border-r border-gray-600
             flex-col items-center justify-start px-4 pt-8 gap-y-3"
        >
            <div
                className={`${tabActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <FaNetworkWired size={21} />
                <span className="font-medium">Network</span>
            </div>
            <div
                className={`${tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <FaWallet size={21} />
                <span className="font-medium">Wallet</span>
            </div>
            <div
                className={`${tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <GrTransaction size={21} />
                <span className="font-medium">Transaction</span>
            </div>
            <div
                className={`${tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <FaFileContract size={21} />
                <span className="font-medium">Contract</span>
            </div>
            <div
                className={`${tabNotActiveStyle}
                transition-colors duration-200 hover:bg-gray-700
                w-[98%] flex flex-row cursor-pointer
                items-center justify-start gap-x-3 py-2 px-3 rounded-lg`}
            >
                <BiSolidWrench size={21} />
                <span className="font-medium">Utilities</span>
            </div>
        </aside>
    );
}

export default Sidebar;
