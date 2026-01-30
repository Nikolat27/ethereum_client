import { useState, useEffect } from "react";
import { HiMiniWrench } from "react-icons/hi2";
import CustomTextField from "../CustomTextField";
import { privateKeyToAddress } from "../../utils/converters";
import { isAddress, getAddress } from "ethers";
import toast, { Toaster } from "react-hot-toast";

function Utilities() {
    const sectionId = "utilities-section";
    const [wei, setWei] = useState<string>("");
    const [gwei, setGwei] = useState<string>("");
    const [ether, setEther] = useState<string>("");
    const [lastChanged, setLastChanged] = useState<"wei" | "gwei" | "ether" | null>(null);

    const [address, setAddress] = useState<string>("");
    const [validationResult, setValidationResult] = useState<string>("");

    const [privateKey, setPrivateKey] = useState<string>("");
    const [convertedAddress, setConvertedAddress] = useState<string>("");

    // Calculate derived values
    const calculateValues = () => {
        if (!lastChanged) return { gwei: "", ether: "" };

        try {
            if (lastChanged === "wei" && wei) {
                const weiValue = BigInt(wei);
                const gweiValue = Number(weiValue) / 1e9;
                const etherValue = Number(weiValue) / 1e18;
                return { gwei: gweiValue.toString(), ether: etherValue.toString() };
            } else if (lastChanged === "gwei" && gwei) {
                const gweiValue = parseFloat(gwei);
                const weiValue = BigInt(Math.floor(gweiValue * 1e9));
                const etherValue = gweiValue / 1e9;
                return { wei: weiValue.toString(), ether: etherValue.toString() };
            } else if (lastChanged === "ether" && ether) {
                const etherValue = parseFloat(ether);
                const weiValue = BigInt(Math.floor(etherValue * 1e18));
                const gweiValue = etherValue * 1e9;
                return { wei: weiValue.toString(), gwei: gweiValue.toString() };
            }
        } catch (_error) {
            // Invalid input, ignore
        }
        return {};
    };

    const derivedValues = calculateValues();

    useEffect(() => {
        if (derivedValues.gwei !== undefined) setGwei(derivedValues.gwei);
        if (derivedValues.ether !== undefined) setEther(derivedValues.ether);
        if (derivedValues.wei !== undefined) setWei(derivedValues.wei);
    }, [derivedValues]);

    const handleWeiChange = (value: string) => {
        setWei(value);
        setLastChanged("wei");
    };

    const handleGweiChange = (value: string) => {
        setGwei(value);
        setLastChanged("gwei");
    };

    const handleEtherChange = (value: string) => {
        setEther(value);
        setLastChanged("ether");
    };

    const validateAddress = () => {
        if (!address.trim()) {
            toast.error("Please enter an address", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        const isValid = isAddress(address);
        if (isValid) {
            setValidationResult("✓ Valid Ethereum address");
            toast.success("Valid address!", {
                duration: 2000,
                position: "top-right",
            });
        } else {
            setValidationResult("✗ Invalid Ethereum address");
            toast.error("Invalid address!", {
                duration: 2000,
                position: "top-right",
            });
        }
    };

    const convertToChecksum = () => {
        if (!address.trim()) {
            toast.error("Please enter an address", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        try {
            let addressToConvert = address.trim();

            // Add 0x prefix if missing
            if (!addressToConvert.startsWith('0x')) {
                addressToConvert = '0x' + addressToConvert;
            }

            if (isAddress(addressToConvert)) {
                // Convert to checksum address using ethers.getAddress()
                const checksumAddress = getAddress(addressToConvert);

                // Only update and show success if the address actually changed
                if (checksumAddress !== address) {
                    setAddress(checksumAddress);
                    toast.success("Address converted to checksum format", {
                        duration: 2000,
                        position: "top-right",
                    });
                } else {
                    toast.success("Address is already in checksum format", {
                        duration: 2000,
                        position: "top-right",
                    });
                }
            } else {
                toast.error("Invalid address format", {
                    duration: 2000,
                    position: "top-right",
                });
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to convert address", {
                duration: 2000,
                position: "top-right",
            });
        }
    };

    const convertPrivateKeyToAddress = () => {
        if (!privateKey.trim()) {
            toast.error("Please enter a private key", {
                duration: 2000,
                position: "top-right",
            });
            return;
        }

        try {
            const addr = privateKeyToAddress(privateKey.trim());
            setConvertedAddress(addr);
            toast.success("Private key converted successfully!", {
                duration: 2000,
                position: "top-right",
            });
        } catch (error: any) {
            setConvertedAddress("");
            toast.error(error.message || "Invalid private key", {
                duration: 3000,
                position: "top-right",
            });
        }
    };

    return (
        <>
            <Toaster />
            <div
                id={sectionId}
                className="flex flex-col w-full p-5 gap-y-6 rounded-lg bg-[#1f2937] border border-gray-600"
            >
                <div className="flex flex-row items-center gap-x-2 mb-6">
                    <HiMiniWrench size={21} className="text-[#3B82F6]" />
                    <span className="text-white font-medium text-lg">Utilities</span>
                </div>

                <div
                    className="flex flex-col w-full h-auto p-6 items-start justify-center border
              border-gray-500 rounded-lg bg-[#111827] gap-5"
                >
                    <span className="text-white font-medium">Unit Converter</span>
                    <div className="flex flex-col sm:flex-row w-full gap-4">
                        <CustomTextField
                            label="wei"
                            placeholder="1000000000000000000"
                            value={wei}
                            onChange={handleWeiChange}
                        />
                        <CustomTextField
                            label="gwei"
                            placeholder="1000000000"
                            value={gwei}
                            onChange={handleGweiChange}
                        />
                        <CustomTextField label="ether" placeholder="1" value={ether} onChange={handleEtherChange} />
                    </div>
                </div>
                <div
                    className="flex flex-col w-full h-auto p-6 items-start justify-center border
              border-gray-500 rounded-lg bg-[#111827] gap-5"
                >
                    <span className="text-white font-medium">Address tools</span>
                    <div className="flex flex-col w-full gap-4 items-center justify-center">
                        <CustomTextField label="address" placeholder="0x..." value={address} onChange={setAddress} />
                        {validationResult && (
                            <div
                                className={`w-full text-center py-2 px-4 rounded-lg ${
                                    validationResult.includes("Valid")
                                        ? "bg-green-900/20 border border-green-600 text-green-400"
                                        : "bg-red-900/20 border border-red-600 text-red-400"
                                }`}
                            >
                                {validationResult}
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                            <button
                            onClick={validateAddress}
                            className="w-full sm:w-60 h-auto py-4 px-6 text-center text-white hover:bg-gray-600
                      bg-[#374151] font-medium rounded-lg cursor-pointer transition-colors duration-200"
                        >
                            Validate Address
                        </button>
                        <button
                            onClick={convertToChecksum}
                            className="w-full sm:min-w-60 sm:w-auto h-auto py-4 px-6 text-center text-white hover:bg-gray-600
                      bg-[#374151] font-medium rounded-lg cursor-pointer transition-colors duration-200"
                        >
                            Convert to Checksum
                        </button>
                        </div>
                    </div>
                </div>
                <div
                    className="flex flex-col w-full h-auto p-6 items-start justify-center border
              border-gray-500 rounded-lg bg-[#111827] gap-5"
                >
                    <span className="text-white font-medium">Private Key to Address</span>
                    <div className="flex flex-col w-full gap-4 items-center justify-center">
                        <CustomTextField
                            label="Private Key"
                            placeholder="0x..."
                            value={privateKey}
                            onChange={setPrivateKey}
                        />
                        {convertedAddress && (
                            <div className="w-full bg-green-900/20 border border-green-600 p-4 rounded-lg">
                                <span className="text-gray-400 text-sm block mb-2">Converted Address:</span>
                                <span className="text-green-400 break-all">{convertedAddress}</span>
                            </div>
                        )}
                        <button
                            onClick={convertPrivateKeyToAddress}
                            className="w-full sm:w-60 h-auto py-4 px-6 text-center text-white hover:bg-blue-700
                      bg-[#2563eb] font-medium rounded-lg cursor-pointer transition-colors duration-200"
                        >
                            Convert to Address
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Utilities;
