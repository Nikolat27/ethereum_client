import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { type SelectChangeEvent } from "@mui/material";
import type { SelectItemsList, SelectItem } from "../types/types";

interface Props {
    label: string;
    value: string;
    onChange: (event: SelectChangeEvent) => void;
    itemsList: SelectItemsList;
}

function SelectOption({ label = "Network", value, onChange, itemsList }: Props) {
    return (
        <FormControl fullWidth className="gap-4 flex flex-row">
            <InputLabel
                id="demo-simple-select-label"
                sx={{
                    color: "#aaa",
                    "&.Mui-focused": {
                        color: "#aaa",
                    },
                }}
            >
                {label}
            </InputLabel>
            <Select
                sx={{
                    color: "#D1D5DB",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB", // default
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB", // hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D1D5DB", // focused
                    },
                    "& .MuiSelect-icon": {
                        color: "#D1D5DB",
                    },
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label={label}
                onChange={onChange}
            >
                {itemsList.map((item: SelectItem) => (
                    <MenuItem value={item.value} className="text-white">
                        {item.text}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default SelectOption;
