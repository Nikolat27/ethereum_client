import { TextField } from "@mui/material";

interface Props {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

function CustomTextField({ label = "label", placeholder = "placeholder", value, onChange }: Props) {
    return (
        <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            label={label}
            variant="outlined"
            fullWidth
            placeholder={placeholder}
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
