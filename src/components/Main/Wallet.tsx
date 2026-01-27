import { useState, useEffect } from "react";
import { FaWallet } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoKey } from "react-icons/io5";
import { TiSortAlphabetically } from "react-icons/ti";
import { IoClipboardSharp } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { signerService } from "../../services/signer";
import { ethService } from "../../services/provider";
import { useWallet } from "../../contexts/WalletContext";
import ImportPrivateKeyModal from "../Modals/ImportPrivateKeyModal";
import ImportMnemonicModal from "../Modals/ImportMnemonicModal";
import GeneratedWalletModal from "../Modals/GeneratedWalletModal";

function WalletManagement() {
    const sectionId = "wallet-section";
    const { wallet, walletAddress, balance, setWallet, setWalletAddress, setBalance } = useWallet();
    const [privateKey, setPrivateKey] = useState<string>("");
    const [mnemonic, setMnemonic] = useState<string>("");

    // Modal states
    const [importKeyModalOpen, setImportKeyModalOpen] = useState(false);
    const [importPhraseModalOpen, setImportPhraseModalOpen] = useState(false);
    const [generatedWalletModalOpen, setGeneratedWalletModalOpen] = useState(false);

    // Input states
    const [importPrivateKeyInput, setImportPrivateKeyInput] = useState("");
    const [importMnemonicInput, setImportMnemonicInput] = useState("");

    // Visibility states
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [showMnemonic, setShowMnemonic] = useState(false);

    // Debug logging for visibility states
    useEffect(() => {
        console.log('Wallet: Visibility states updated - showPrivateKey:', showPrivateKey, 'showMnemonic:', showMnemonic);
    }, [showPrivateKey, showMnemonic]);

    async function generateWallet() {
        try {
            const newWallet = signerService.newWallet();
            const address = await newWallet.getAddress();

            setWallet(newWallet);
            setWalletAddress(address);

            // Get private key and mnemonic if available
            if ("privateKey" in newWallet) {
                setPrivateKey((newWallet as any).privateKey);
            }
            if ("mnemonic" in newWallet && (newWallet as any).mnemonic) {
                setMnemonic((newWallet as any).mnemonic.phrase);
            }

            await updateBalance(address);
            console.log('Wallet: Opening generated wallet modal');
            // Reset visibility states when opening modal
            setShowPrivateKey(false);
            setShowMnemonic(false);
            setGeneratedWalletModalOpen(true);

            toast.success("Wallet generated successfully!", {
                duration: 2000,
                position: "top-right",
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to generate wallet", {
                duration: 3000,
                position: "top-right",
            });
        }
    }

    async function importFromPrivateKey() {
        try {
            if (!importPrivateKeyInput.trim()) {
                toast.error("Please enter a private key", {
                    duration: 2000,
                    position: "top-right",
                });
                return;
            }

            const importedWallet = signerService.importWallet(importPrivateKeyInput.trim(), "private-key");
            const address = await importedWallet.getAddress();

            setWallet(importedWallet);
            setWalletAddress(address);
            setPrivateKey(importPrivateKeyInput.trim());
            setMnemonic("");

            await updateBalance(address);
            setImportKeyModalOpen(false);
            setImportPrivateKeyInput("");

            toast.success("Wallet imported successfully!", {
                duration: 2000,
                position: "top-right",
            });
        } catch (error: any) {
            toast.error(error.message || "Invalid private key", {
                duration: 3000,
                position: "top-right",
            });
        }
    }

    async function importFromMnemonic() {
        try {
            if (!importMnemonicInput.trim()) {
                toast.error("Please enter a mnemonic phrase", {
                    duration: 2000,
                    position: "top-right",
                });
                return;
            }

            const importedWallet = signerService.importWallet(importMnemonicInput.trim(), "mnemonic");
            const address = await importedWallet.getAddress();

            setWallet(importedWallet);
            setWalletAddress(address);
            setMnemonic(importMnemonicInput.trim());

            if ("privateKey" in importedWallet) {
                setPrivateKey((importedWallet as any).privateKey);
            }

            await updateBalance(address);
            setImportPhraseModalOpen(false);
            setImportMnemonicInput("");

            toast.success("Wallet imported successfully!", {
                duration: 2000,
                position: "top-right",
            });
        } catch (error: any) {
            toast.error(error.message || "Invalid mnemonic phrase", {
                duration: 3000,
                position: "top-right",
            });
        }
    }

    async function updateBalance(address: string) {
        try {
            // Only try to fetch balance if we have a valid RPC URL
            const currentRpcUrl = ethService.getCurrentRpcUrl();
            if (!currentRpcUrl || currentRpcUrl === "http://localhost:8545") {
                console.log("Skipping balance update - no valid RPC URL");
                setBalance("0.0");
                return;
            }

            const balanceWei = await ethService.getBalance(address);
            const balanceEth = (Number(balanceWei) / 1e18).toFixed(4);
            setBalance(balanceEth);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
            // Don't spam requests on failure
            setBalance("0.0");
        }
    }
    async function copyToClipboard(text: string, label: string) {
        await navigator.clipboard.writeText(text);

        toast.success(`${label} copied to clipboard`, {
            duration: 1000,
            position: "top-right",
        });
    }

    return (
        <>
            <Toaster />
            <div
                id={sectionId}
                className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600"
            >
                <div className="flex flex-row items-center gap-x-2 mb-6">
                    <FaWallet className="text-[#3B82F6]" />
                    <span className="text-white font-medium text-lg">Wallet Management</span>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-4">
                    <div
                        onClick={generateWallet}
                        className="flex flex-1 flex-row items-center justify-center font-medium
                     text-white bg-[#2563eb] min-h-13 gap-x-2 py-1 px-2 rounded-lg cursor-pointer
                     transition-colors duration-200 hover:bg-blue-700"
                    >
                        <FiPlus size={22} />
                        <span>Generate</span>
                    </div>
                    <div
                        onClick={() => setImportKeyModalOpen(true)}
                        className="flex flex-1 flex-row items-center justify-center font-medium
                     text-white bg-[#374151] min-h-13 gap-x-2 py-1 px-2 rounded-lg cursor-pointer
                     transition-colors duration-200 hover:bg-gray-500"
                    >
                        <IoKey size={22} />
                        <span>Import Key</span>
                    </div>
                    <div
                        onClick={() => setImportPhraseModalOpen(true)}
                        className="flex flex-1 flex-row items-center justify-center font-medium
                     text-white bg-[#374151] min-h-13 gap-x-2 py-1 px-2 rounded-lg cursor-pointer
                     transition-colors duration-200 hover:bg-gray-500"
                    >
                        <TiSortAlphabetically size={23} />
                        <span>Import Phrase</span>
                    </div>
                </div>

                <div
                    className="flex flex-col font-medium w-full h-auto bg-[#111827] p-6 gap-3
                  text-gray-300 rounded-lg"
                >
                    {wallet ? (
                        <>
                            <span>Active Wallet</span>
                            <div className="flex flex-col bg-[#1f2937] p-4 rounded-lg gap-2">
                                <span>Address</span>
                                <div className="flex flex-row w-full items-center gap-2">
                                    <p className="lg:flex hidden break-all">{walletAddress}</p>
                                    <p className="lg:hidden flex">
                                        {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                                    </p>
                                    <div
                                        onClick={() => copyToClipboard(walletAddress, "Address")}
                                        className="cursor-pointer w-10 h-10 rounded-full bg-gray-500
                                        flex items-center justify-center ml-auto mr-2"
                                    >
                                        <IoClipboardSharp size={21} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col bg-[#1f2937] p-4 rounded-lg gap-2">
                                <span>Balance</span>
                                <p className="text-green-500">{balance} ETH</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <FaWallet size={40} className="text-gray-500" />
                            <span className="text-gray-500">No wallet connected</span>
                            <span className="text-gray-600 text-sm text-center">
                                Generate or import a wallet to get started
                            </span>
                        </div>
                    )}
                </div>

                <ImportPrivateKeyModal
                    open={importKeyModalOpen}
                    onClose={() => setImportKeyModalOpen(false)}
                    privateKeyInput={importPrivateKeyInput}
                    onPrivateKeyChange={setImportPrivateKeyInput}
                    onImport={importFromPrivateKey}
                />

                <ImportMnemonicModal
                    open={importPhraseModalOpen}
                    onClose={() => setImportPhraseModalOpen(false)}
                    mnemonicInput={importMnemonicInput}
                    onMnemonicChange={setImportMnemonicInput}
                    onImport={importFromMnemonic}
                />

                <GeneratedWalletModal
                    open={generatedWalletModalOpen}
                    onClose={() => {
                        console.log('Wallet: Closing modal');
                        setGeneratedWalletModalOpen(false);
                    }}
                    privateKey={privateKey}
                    mnemonic={mnemonic}
                    showPrivateKey={showPrivateKey}
                    showMnemonic={showMnemonic}
                    onTogglePrivateKey={() => {
                        console.log('Wallet: Toggling private key from', showPrivateKey, 'to', !showPrivateKey);
                        setShowPrivateKey(!showPrivateKey);
                    }}
                    onToggleMnemonic={() => {
                        console.log('Wallet: Toggling mnemonic from', showMnemonic, 'to', !showMnemonic);
                        setShowMnemonic(!showMnemonic);
                    }}
                    onCopyToClipboard={copyToClipboard}
                    onResetVisibility={() => {
                        console.log('Wallet: Resetting visibility states');
                        setShowPrivateKey(false);
                        setShowMnemonic(false);
                    }}
                />
            </div>
        </>
    );
}

export default WalletManagement;
