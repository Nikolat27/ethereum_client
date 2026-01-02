import { TextField } from "@mui/material";

interface Props {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function CustomTextField({ label = "label", placeholder = "placeholder", value, onChange, disabled = false }: Props) {
    return (
        <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            label={label}
            variant="outlined"
            fullWidth
            placeholder={placeholder}
            disabled={disabled}
            sx={{
                "& .MuiInputBase-input": {
                    color: "#D1D5DB", // input text
                },
                "& .MuiInputLabel-root": {
                    color: "#D1D5DB", // label
                },
                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#D1D5DB", // label when focused
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#D1D5DB", // default border
                    },
                    "&:hover fieldset": {
                        borderColor: "#D1D5DB", // hover
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#D1D5DB", // focused
                    },
                },
            }}
        />
    );
}

export default CustomTextField;
