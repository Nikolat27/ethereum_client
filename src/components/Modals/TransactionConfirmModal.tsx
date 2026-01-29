import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { FaEthereum, FaGasPump, FaSignature } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface TransactionConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    transactionDetails: {
        to: string;
        value: string;
        gasLimit: string;
        gasPrice: string;
        data: string;
        estimatedFee: string;
        totalCost: string;
    };
}

export default function TransactionConfirmModal({
    open,
    onClose,
    onConfirm,
    transactionDetails,
}: TransactionConfirmModalProps) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            await onConfirm();
            onClose();
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: "#1f2937",
                    color: "white",
                    borderRadius: "8px",
                    border: "1px solid #4b5563",
                },
            }}
        >
            <DialogTitle
                style={{
                    backgroundColor: "#111827",
                    borderBottom: "1px solid #4b5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                }}
            >
                <div className="flex items-center gap-2">
                    <FaSignature className="text-[#3B82F6]" size={20} />
                    <span className="text-white font-medium text-lg">Confirm Transaction</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                    disabled={isConfirming}
                >
                    <IoMdClose size={24} />
                </button>
            </DialogTitle>

            <DialogContent style={{ padding: "24px" }}>
                <div className="flex flex-col gap-4">
                    {/* Warning Banner */}
                    <div className="flex flex-row w-full gap-2 text-yellow-400 bg-[#302e30] border border-yellow-500 rounded-lg p-3">
                        <span className="font-medium">⚠️ Security Warning</span>
                        <span className="text-sm">
                            This transaction is irreversible. Please verify all details carefully before signing.
                        </span>
                    </div>

                    {/* Transaction Details */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2 p-3 bg-[#111827] rounded-lg border border-gray-600">
                            <span className="text-gray-400 text-sm font-medium">Recipient Address</span>
                            <div className="break-all text-white font-mono text-sm bg-gray-900 p-2 rounded">
                                {transactionDetails.to}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2 p-3 bg-[#111827] rounded-lg border border-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaEthereum className="text-[#3B82F6]" size={16} />
                                    <span className="text-gray-400 text-sm font-medium">Amount</span>
                                </div>
                                <span className="text-white font-medium">
                                    {transactionDetails.value} ETH
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 p-3 bg-[#111827] rounded-lg border border-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaGasPump className="text-[#3B82F6]" size={16} />
                                    <span className="text-gray-400 text-sm font-medium">Gas Limit</span>
                                </div>
                                <span className="text-white font-medium">
                                    {transactionDetails.gasLimit}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2 p-3 bg-[#111827] rounded-lg border border-gray-600">
                                <span className="text-gray-400 text-sm font-medium">Gas Price</span>
                                <span className="text-white font-medium">
                                    {transactionDetails.gasPrice} Gwei
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 p-3 bg-[#111827] rounded-lg border border-gray-600">
                                <span className="text-gray-400 text-sm font-medium">Estimated Fee</span>
                                <span className="text-white font-medium">
                                    {transactionDetails.estimatedFee} ETH
                                </span>
                            </div>
                        </div>

                        {transactionDetails.data !== "0x" && (
                            <div className="flex flex-col gap-2 p-3 bg-[#111827] rounded-lg border border-gray-600">
                                <span className="text-gray-400 text-sm font-medium">Data</span>
                                <div className="break-all text-white font-mono text-sm bg-gray-900 p-2 rounded max-h-24 overflow-auto">
                                    {transactionDetails.data}
                                </div>
                            </div>
                        )}

                        {/* Total Cost Highlight */}
                        <div className="flex flex-col gap-2 p-4 bg-gradient-to-r from-[#111827] to-[#1f2937] rounded-lg border-2 border-[#3B82F6]">
                            <span className="text-gray-300 text-sm font-medium">Total Cost</span>
                            <span className="text-[#3B82F6] text-xl font-bold">
                                {transactionDetails.totalCost} ETH
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>

            <DialogActions
                style={{
                    padding: "16px 24px",
                    backgroundColor: "#111827",
                    borderTop: "1px solid #4b5563",
                }}
            >
                <Button
                    onClick={onClose}
                    disabled={isConfirming}
                    style={{
                        color: "white",
                        borderColor: "#6b7280",
                        padding: "8px 16px",
                        textTransform: "none",
                        fontWeight: 500,
                    }}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    style={{
                        backgroundColor: isConfirming ? "#374151" : "#2563eb",
                        color: "white",
                        padding: "8px 24px",
                        textTransform: "none",
                        fontWeight: 600,
                        minWidth: "120px",
                    }}
                    variant="contained"
                >
                    {isConfirming ? "Signing..." : "Sign & Send"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
