import { Modal, Box, Button } from "@mui/material";
import { IoClipboardSharp } from "react-icons/io5";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import ConfirmCloseModal from "./ConfirmCloseModal";
import { useState } from "react";

interface GeneratedWalletModalProps {
    open: boolean;
    onClose: () => void;
    privateKey: string;
    mnemonic: string;
    showPrivateKey: boolean;
    showMnemonic: boolean;
    onTogglePrivateKey: () => void;
    onToggleMnemonic: () => void;
    onCopyToClipboard: (text: string, label: string) => void;
    onResetVisibility: () => void;
}

const MODAL_STYLE = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxWidth: "90%",
    bgcolor: "#1f2937",
    border: "1px solid #4b5563",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const HIDDEN_PRIVATE_KEY = "••••••••••••••••••••••••••••••••";
const HIDDEN_MNEMONIC = "•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••";

function GeneratedWalletModal({
    open,
    onClose,
    privateKey,
    mnemonic,
    showPrivateKey,
    showMnemonic,
    onTogglePrivateKey,
    onToggleMnemonic,
    onCopyToClipboard,
    onResetVisibility,
}: GeneratedWalletModalProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleCloseAttempt = () => {
        console.log('Close attempt triggered');
        console.log('showPrivateKey:', showPrivateKey, 'showMnemonic:', showMnemonic);
        console.log('FORCING confirmation modal - always show regardless of visibility');

        // ALWAYS show confirmation modal when closing wallet modal
        console.log('SHOWING CONFIRMATION MODAL (forced)');
        setShowConfirmModal(true);
    };

    const handleConfirmedClose = () => {
        setShowConfirmModal(false);
        // Reset visibility states before closing
        if (onResetVisibility) {
            onResetVisibility();
        }
        onClose();
    };
    const renderSecretField = (
        label: string,
        value: string,
        hiddenValue: string,
        isVisible: boolean,
        onToggleVisibility: () => void
    ) => (
        <div className="bg-[#111827] p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{label}</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            console.log(`Toggling visibility for ${label}`);
                            console.log(`${label} current visibility:`, isVisible);
                            onToggleVisibility();
                        }}
                        className="text-gray-400 hover:text-white"
                    >
                        {isVisible ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                    <button onClick={() => onCopyToClipboard(value, label)} className="text-gray-400 hover:text-white">
                        <IoClipboardSharp size={20} />
                    </button>
                </div>
            </div>
            <p className="text-white break-all text-sm">
                {isVisible ? value : hiddenValue}
            </p>
        </div>
    );

    return (
        <>
            <Modal
                open={open}
                onClose={(_, reason) => {
                    console.log('Modal onClose called with reason:', reason);
                    if (reason === 'backdropClick') {
                        handleCloseAttempt();
                    }
                }}
            >
                <Box sx={MODAL_STYLE}>
                    <h2 className="text-white text-xl font-medium mb-4">
                        Wallet Generated Successfully!
                    </h2>

                    <div className="bg-blue-900/20 border border-blue-600 p-3 rounded-lg mb-4">
                        <p className="text-blue-400 text-sm">
                            ℹ️ This wallet works only for EVM-based blockchains (Ethereum, Arbitrum, BSC, etc.)
                            and is NOT compatible with Bitcoin, TRX, or other non-EVM chains.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {renderSecretField(
                            "Private Key",
                            privateKey,
                            HIDDEN_PRIVATE_KEY,
                            showPrivateKey,
                            onTogglePrivateKey
                        )}

                        {mnemonic && renderSecretField(
                            "Mnemonic Phrase",
                            mnemonic,
                            HIDDEN_MNEMONIC,
                            showMnemonic,
                            onToggleMnemonic
                        )}

                        <div className="bg-yellow-900/20 border border-yellow-600 p-3 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ Save your private key and mnemonic phrase securely. You'll need them to recover
                                your wallet. These will only be shown once!
                            </p>
                        </div>

                        <Button
                            variant="contained"
                            onClick={handleCloseAttempt}
                            sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
                        >
                            Close
                        </Button>
                    </div>
                </Box>
            </Modal>

            <ConfirmCloseModal
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmedClose}
            />
        </>
    );
}

export default GeneratedWalletModal;
