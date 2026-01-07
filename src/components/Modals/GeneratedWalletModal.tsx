import { Modal, Box, Button } from "@mui/material";
import { IoClipboardSharp } from "react-icons/io5";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

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
}: GeneratedWalletModalProps) {
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
                    <button onClick={onToggleVisibility} className="text-gray-400 hover:text-white">
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
        <Modal open={open} onClose={onClose}>
            <Box sx={MODAL_STYLE}>
                <h2 className="text-white text-xl font-medium mb-4">
                    Wallet Generated Successfully!
                </h2>

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
                            your wallet.
                        </p>
                    </div>

                    <Button
                        variant="contained"
                        onClick={onClose}
                        sx={{ bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
                    >
                        Close
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default GeneratedWalletModal;
