import { Modal, Box, TextField, Button } from "@mui/material";

interface ImportPrivateKeyModalProps {
    open: boolean;
    onClose: () => void;
    privateKeyInput: string;
    onPrivateKeyChange: (value: string) => void;
    onImport: () => void;
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

const TEXT_FIELD_STYLES = {
    mb: 3,
    "& .MuiInputBase-input": { color: "#D1D5DB" },
    "& .MuiInputLabel-root": { color: "#D1D5DB" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#D1D5DB" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#D1D5DB" },
        "&:hover fieldset": { borderColor: "#D1D5DB" },
        "&.Mui-focused fieldset": { borderColor: "#D1D5DB" },
    },
};

function ImportPrivateKeyModal({
    open,
    onClose,
    privateKeyInput,
    onPrivateKeyChange,
    onImport,
}: ImportPrivateKeyModalProps) {
    const handleCancel = () => {
        onPrivateKeyChange("");
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={MODAL_STYLE}>
                <h2 className="text-white text-xl font-medium mb-4">
                    Import Private Key
                </h2>

                <TextField
                    fullWidth
                    label="Private Key"
                    variant="outlined"
                    value={privateKeyInput}
                    onChange={(e) => onPrivateKeyChange(e.target.value)}
                    placeholder="0x..."
                    type="password"
                    sx={TEXT_FIELD_STYLES}
                />

                <div className="flex gap-3">
                    <Button
                        variant="contained"
                        onClick={onImport}
                        sx={{ flex: 1, bgcolor: "#2563eb", "&:hover": { bgcolor: "#1d4ed8" } }}
                    >
                        Import
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{ flex: 1, color: "#D1D5DB", borderColor: "#D1D5DB" }}
                    >
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default ImportPrivateKeyModal;
