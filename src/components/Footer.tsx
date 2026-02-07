import { FaGithub, FaEthereum } from "react-icons/fa";

function Footer() {
    return (
        <footer className="w-full py-6 px-4 bg-[#111827] border-t border-gray-700">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">Source code:</span>
                        <a
                            href="https://github.com/nikolat27/ethereum_client"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
                        >
                            <FaGithub className="text-lg group-hover:scale-110 transition-transform" />
                            <span className="font-mono">ethereum_client</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">Made by</span>
                        <a
                            href="https://github.com/nikolat27"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
                        >
                            <FaGithub className="text-lg group-hover:scale-110 transition-transform" />
                            <span className="font-mono">@nikolat27</span>
                            <FaEthereum className="text-yellow-500 text-lg group-hover:animate-pulse" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
