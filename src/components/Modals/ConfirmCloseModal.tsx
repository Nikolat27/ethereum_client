import { Modal, Box, Button } from "@mui/material";

interface ConfirmCloseModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const MODAL_STYLE = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxWidth: "90%",
    bgcolor: "#1f2937",
    border: "1px solid #4b5563",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

function ConfirmCloseModal({ open, onClose, onConfirm }: ConfirmCloseModalProps) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={MODAL_STYLE}>
                <h2 className="text-white text-xl font-medium mb-4">
                    Warning
                </h2>

                <div className="mb-6">
                    <p className="text-gray-300 mb-4">
                        If you close this window, you will not be able to view your private key
                        and mnemonic phrase again.
                    </p>
                    <p className="text-gray-300">
                        Make sure you have saved them securely before closing.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{
                            color: "#9CA3AF",
                            borderColor: "#9CA3AF",
                            "&:hover": {
                                borderColor: "#6B7280",
                                backgroundColor: "rgba(255,255,255,0.05)"
                            }
                        }}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onConfirm}
                        sx={{
                            bgcolor: "#EF4444",
                            "&:hover": { bgcolor: "#DC2626" },
                            flex: 1
                        }}
                    >
                        Close Anyway
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default ConfirmCloseModal;
