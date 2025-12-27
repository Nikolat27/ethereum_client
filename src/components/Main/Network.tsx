import { useState } from "react";
import { FaServer } from "react-icons/fa6";
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material";
import { TextField } from "@mui/material";
import { IoClipboardSharp } from "react-icons/io5";

function NetworkConfiguration() {
    const [network, setNetwork] = useState<string>("Ethereum Mainnet");
    const [chainId, setChainId] = useState<string>("1");
    const [rpcUrl, setRpcUrl] = useState<string>("");

    function handleNetworkChange(event: SelectChangeEvent) {
        setNetwork(event.target.value as string);
    }

    async function copyRpcUrlToClipboard() {
        await navigator.clipboard.writeText(rpcUrl);
        console.log("copied successfully");
    }

    return (
        <div className="flex flex-col p-4 gap-y-4 rounded-lg bg-[#1f2937]">
            <div className="flex flex-row gap-x-2">
                <FaServer className="text-[#3B82F6]" />
                <span className="text-white font-medium">RPC Endpoint</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
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
                        Network
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
                        value={network}
                        label="Network"
                        onChange={handleNetworkChange}
                    >
                        <MenuItem value={"Ethereum Mainnet"} className="text-white">
                            Ethereum Mainnet
                        </MenuItem>
                        <MenuItem value={"Sepolia Testnet"}>Sepolia Testnet</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    value={chainId}
                    onChange={(e) => setChainId(e.target.value)}
                    label="Chain Id"
                    variant="outlined"
                    fullWidth
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
            </div>
            <div className="flex flex-row gap-3 items-center justify-center">
                <TextField
                    label="RPC URL"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setRpcUrl(e.target.value)}
                    value={rpcUrl}
                    placeholder="https://eth-mainnet.g.alchemy.com/v2/<api-key>"
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
                <div
                    onClick={copyRpcUrlToClipboard}
                    className="cursor-pointer w-10 h-10 rounded-full bg-gray-500
                    flex items-center justify-center"
                >
                    <IoClipboardSharp size={21} className="text-white" />
                </div>
            </div>
        </div>
    );
}

export default NetworkConfiguration;
