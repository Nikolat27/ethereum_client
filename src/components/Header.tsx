import { FaEthereum } from "react-icons/fa6";
import { IoDocumentSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import TemporaryDrawer from "./Drawer";

function Header() {
    return (
        <header
            className="flex flex-row w-full h-14 bg-[#1f2937] sticky px-4 mx-auto
            top-0 border-b border-gray-700 items-center gap-x-4 justify-start"
        >
            <div className="flex flex-row w-auto gap-x-2 h-auto px-3 border-r border-r-gray-600">
                <FaEthereum color="white" size={30} />
                <span className="text-white font-medium text-xl">EVM Explorer</span>
            </div>
            <div
                className="py-1 px-4 rounded-lg flex flex-row gap-x-2
                items-center justify-center h-auto w-auto bg-[#111827]"
            >
                <button className="w-2 h-2 rounded-full bg-green-500"></button>
                <span className="text-gray-300">Ethereum Mainnet</span>
            </div>

            <div className="flex flex-row w-auto ml-auto text-white gap-x-2">
                <div
                    className="cursor-pointer sm:flex hidden flex-row bg-gray-500 py-1 px-2 rounded-lg
                    gap-x-2 items-center justify-center"
                >
                    <IoDocumentSharp size={21} />
                    <span>Docs</span>
                </div>
                <div
                    className="cursor-pointer sm:flex hidden flex-row bg-gray-500 py-1 px-2 rounded-lg
                    gap-x-2 items-center justify-center"
                >
                    <IoMdSettings size={21} />
                    <span>Settings</span>
                </div>

                
                <TemporaryDrawer />
            </div>
        </header>
    );
}

export default Header;
