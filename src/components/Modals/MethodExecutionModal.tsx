import { Modal, Box, TextField, Button } from "@mui/material";
import { AiFillRead } from "react-icons/ai";
import { RiPencilFill } from "react-icons/ri";

interface MethodInput {
    name: string;
    type: string;
}

interface SelectedMethod {
    name: string;
    inputs: MethodInput[];
    stateMutability: string;
    isWrite: boolean;
}

interface MethodExecutionModalProps {
    open: boolean;
    onClose: () => void;
    selectedMethod: SelectedMethod | null;
    methodParams: string[];
    methodResult: string;
    isExecuting: boolean;
    onUpdateParam: (index: number, value: string) => void;
    onExecute: () => void;
}

const MODAL_STYLE = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    maxWidth: "90%",
    bgcolor: "#1f2937",
    border: "1px solid #4b5563",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: "80vh",
    overflow: "auto",
};

const TEXT_FIELD_STYLES = {
    "& .MuiInputBase-input": { color: "#D1D5DB" },
    "& .MuiInputLabel-root": { color: "#D1D5DB" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#D1D5DB" },
    "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#D1D5DB" },
        "&:hover fieldset": { borderColor: "#D1D5DB" },
        "&.Mui-focused fieldset": { borderColor: "#D1D5DB" },
    },
};

function MethodExecutionModal({
    open,
    onClose,
    selectedMethod,
    methodParams,
    methodResult,
    isExecuting,
    onUpdateParam,
    onExecute,
}: MethodExecutionModalProps) {
    if (!selectedMethod) return null;

    const isWriteMethod = selectedMethod.isWrite;
    const hasParameters = selectedMethod.inputs.length > 0;

    const getButtonLabel = () => {
        if (isExecuting) return "Executing...";
        return isWriteMethod ? "Send Transaction" : "Call";
    };

    const getButtonColor = () => {
        return isWriteMethod ? "#2563eb" : "#16a34a";
    };

    const getButtonHoverColor = () => {
        return isWriteMethod ? "#1d4ed8" : "#15803d";
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={MODAL_STYLE}>
                <h2 className="text-white text-xl font-medium mb-4 flex items-center gap-2">
                    {isWriteMethod ? (
                        <RiPencilFill className="text-blue-400" size={24} />
                    ) : (
                        <AiFillRead className="text-green-400" size={24} />
                    )}
                    {selectedMethod.name}
                    <span className="text-sm text-gray-400">
                        ({selectedMethod.stateMutability})
                    </span>
                </h2>

                {hasParameters ? (
                    <div className="flex flex-col gap-3 mb-4">
                        <span className="text-gray-400 text-sm">Parameters:</span>
                        {selectedMethod.inputs.map((input, index) => (
                            <TextField
                                key={index}
                                fullWidth
                                label={`${input.name || `param${index}`} (${input.type})`}
                                variant="outlined"
                                value={methodParams[index]}
                                onChange={(e) => onUpdateParam(index, e.target.value)}
                                placeholder={input.type}
                                sx={TEXT_FIELD_STYLES}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm mb-4">No parameters required</p>
                )}

                {methodResult && (
                    <div className="bg-[#111827] p-4 rounded-lg mb-4 max-h-60 overflow-auto">
                        <span className="text-gray-400 text-sm block mb-2">Result:</span>
                        <pre className="text-green-400 text-sm">{methodResult}</pre>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        variant="contained"
                        onClick={onExecute}
                        disabled={isExecuting}
                        sx={{
                            flex: 1,
                            bgcolor: getButtonColor(),
                            "&:hover": { bgcolor: getButtonHoverColor() },
                            "&:disabled": { bgcolor: "#4b5563" },
                        }}
                    >
                        {getButtonLabel()}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ flex: 1, color: "#D1D5DB", borderColor: "#D1D5DB" }}
                    >
                        Close
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default MethodExecutionModal;
