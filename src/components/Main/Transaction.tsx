import { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import CustomTextField from "../CustomTextField";
import { IoIosCalculator } from "react-icons/io";
import { FaSignature } from "react-icons/fa";
import { useWallet } from "../../contexts/WalletContext";
import { ethService } from "../../services/provider";
import { WalletService } from "../../services/wallet";
import toast, { Toaster } from "react-hot-toast";
import { parseEther, formatUnits } from "ethers";

function TransactionBuilder() {
    const sectionId = "transaction-section";
    const { wallet, walletAddress } = useWallet();

    const [to, setTo] = useState<string>("");
    const [txValue, setTxValue] = useState<string>("");
    const [gasLimit, setGasLimit] = useState<string>("");
    const [gasPrice, setGasPrice] = useState<string>("");
    const [data, setData] = useState<string>("0x");

    const [estimatedFee, setEstimatedFee] = useState<string>("0.0");
    const [isEstimating, setIsEstimating] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    async function estimateGas() {
        if (!wallet) {
            toast.error("Please connect a wallet first", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        if (!to || !txValue) {
            toast.error("Please fill in To address and Value", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        try {
            setIsEstimating(true);

            const tx = {
                to,
                value: parseEther(txValue),
                data: data || "0x",
            };

            // Estimate gas
            const estimatedGasLimit = await ethService.estimateGas(tx);
            setGasLimit(estimatedGasLimit.toString());

            // Get current gas price
            const feeData = await ethService.getFeeData();
            const currentGasPrice = feeData.gasPrice || BigInt(0);
            const gasPriceGwei = formatUnits(currentGasPrice, "gwei");
            setGasPrice(gasPriceGwei);

            // Calculate estimated fee
            const fee = estimatedGasLimit * currentGasPrice;
            const feeEth = formatUnits(fee, "ether");
            setEstimatedFee(feeEth);

            toast.success("Gas estimated successfully!", {
                duration: 2000,
                position: "top-right",
            });
        } catch (error: any) {
            console.error("Gas estimation error:", error);
            toast.error(error.message || "Failed to estimate gas", {
                duration: 3000,
                position: "top-right",
            });
        } finally {
            setIsEstimating(false);
        }
    }

    async function signAndSendTransaction() {
        if (!wallet) {
            toast.error("Please connect a wallet first", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        if (!to || !txValue) {
            toast.error("Please fill in To address and Value", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        if (!gasLimit || !gasPrice) {
            toast.error("Please estimate gas first", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        try {
            setIsSending(true);
            const walletService = new WalletService(wallet);

            const tx = {
                to,
                value: parseEther(txValue),
                gasLimit: BigInt(gasLimit),
                gasPrice: parseEther(gasPrice).toString(),
                data: data || "0x",
            };

            toast.loading("Signing and sending transaction...", {
                duration: 2000,
                position: "top-right",
            });

            const txResponse = await walletService.sendTransaction(tx, ethService["client"]);

            toast.success(
                <div className="flex flex-col gap-1">
                    <span className="font-medium">Transaction sent!</span>
                    <span className="text-xs">
                        Hash: {txResponse.hash.slice(0, 10)}...{txResponse.hash.slice(-8)}
                    </span>
                </div>,
                {
                    duration: 5000,
                    position: "top-right",
                }
            );

            // Reset form
            setTo("");
            setTxValue("");
            setGasLimit("");
            setGasPrice("");
            setData("0x");
            setEstimatedFee("0.0");
        } catch (error: any) {
            console.error("Transaction error:", error);
            toast.error(error.message || "Failed to send transaction", {
                duration: 3000,
                position: "top-right",
            });
        } finally {
            setIsSending(false);
        }
    }

    const calculateTotalCost = () => {
        try {
            if (!txValue || !estimatedFee) return "0.0";
            const total = parseFloat(txValue) + parseFloat(estimatedFee);
            return total.toFixed(6);
        } catch {
            return "0.0";
        }
    };

    return (
        <>
            <Toaster />
            <div
                id={sectionId}
                className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600"
            >
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
                        <CustomTextField value={to} onChange={setTo} label="To" placeholder="0x..." />
                    </div>
                    <div className="flex flex-row items-center justify-center w-full gap-2">
                        <CustomTextField value={txValue} onChange={setTxValue} label="Value (ETH)" placeholder="0.1" />
                        <CustomTextField
                            value={gasLimit}
                            onChange={setGasLimit}
                            label="Gas Limit"
                            placeholder="21000"
                        />
                        <CustomTextField
                            value={gasPrice}
                            onChange={setGasPrice}
                            label="Gas Price (Gwei)"
                            placeholder="20"
                        />
                    </div>
                    <CustomTextField value={data} onChange={setData} label="Data (ETH)" placeholder="0x..." />
                    <div className="flex flex-col w-full gap-2 text-gray-400 border p-5 rounded-lg">
                        <div className="flex flex-row w-full gap-2">
                            <span>Estimated Fee</span>
                            <span className="text-white ml-auto mr-2">{estimatedFee} ETH</span>
                        </div>
                        <div className="flex flex-row w-full gap-2">
                            <span>Total Cost</span>
                            <span className="text-green-500 ml-auto mr-2">{calculateTotalCost()} ETH</span>
                        </div>
                    </div>
                    <div className="flex flex-row w-full text-white font-medium gap-4">
                        <div
                            onClick={estimateGas}
                            className={`flex flex-1 h-13 flex-row bg-[#374151] rounded-lg
                        items-center justify-center gap-2 transition-all
                        duration-300 hover:bg-gray-500 ${
                            isEstimating || !wallet ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                        >
                            <IoIosCalculator size={23} />
                            <span>{isEstimating ? "Estimating..." : "Estimate Gas"}</span>
                        </div>
                        <div
                            onClick={signAndSendTransaction}
                            className={`flex flex-1 h-13 flex-row bg-[#2563eb] rounded-lg
                        items-center justify-center gap-2 transition-all
                        duration-300 hover:bg-blue-700 ${
                            isSending || !wallet || !gasLimit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                        >
                            <FaSignature size={23} />
                            <span>{isSending ? "Sending..." : "Sign & Send"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TransactionBuilder;
