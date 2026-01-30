import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { HiOutlineMenu } from "react-icons/hi";
import { Divider } from "@mui/material";
import { FaNetworkWired, FaWallet, FaFileContract } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { BiSolidWrench } from "react-icons/bi";
import { useWallet } from "../contexts/WalletContext";
import { TiTick } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";
import { IoCopyOutline } from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import toast from "react-hot-toast";
import { ethService } from "../services/provider";

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(false);
    const { wallet, walletAddress, balance, setBalance } = useWallet();
    const isWalletConnected = wallet !== null;

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const scrollContainer = element.closest(".overflow-y-auto");
            if (scrollContainer) {
                const elementTop = element.offsetTop;
                scrollContainer.scrollTo({
                    top: elementTop - 80,
                    behavior: "smooth",
                });
            }
        }
        setOpen(false); // Close drawer after clicking
    };

    const copyAddressToClipboard = async () => {
        if (walletAddress) {
            try {
                await navigator.clipboard.writeText(walletAddress);
                toast.success("Address copied to clipboard", {
                    duration: 1500,
                    position: "top-right",
                });
            } catch (error) {
                toast.error("Failed to copy address", {
                    duration: 2000,
                    position: "top-right",
                });
            }
        }
    };

    const refreshBalance = async () => {
        if (!walletAddress) return;

        try {
            const currentRpcUrl = ethService.getCurrentRpcUrl();
            if (!currentRpcUrl || currentRpcUrl === "http://localhost:8545") {
                toast.error("No valid RPC URL configured", {
                    duration: 2000,
                    position: "top-right",
                });
                return;
            }

            const balanceWei = await ethService.getBalance(walletAddress);
            const balanceEth = (Number(balanceWei) / 1e18).toFixed(4);
            setBalance(balanceEth);

            toast.success("Balance refreshed!", {
                duration: 1500,
                position: "top-right",
            });
        } catch (error) {
            console.error("Failed to refresh balance");
            toast.error("Failed to refresh balance", {
                duration: 2000,
                position: "top-right",
            });
        }
    };

    const navigationItems = [
        { text: "Network", icon: <FaNetworkWired color="white" size={20} />, sectionId: "network-section" },
        { text: "Wallet", icon: <FaWallet color="white" size={20} />, sectionId: "wallet-section" },
        { text: "Transaction", icon: <GrTransaction color="white" size={20} />, sectionId: "transaction-section" },
        { text: "Contract", icon: <FaFileContract color="white" size={20} />, sectionId: "contract-section" },
        { text: "Utilities", icon: <BiSolidWrench color="white" size={20} />, sectionId: "utilities-section" },
    ];

    const DrawerList = (
        <Box sx={{ width: 280, color: "white" }} role="presentation">
            {/* Wallet Status Section */}
            <Box sx={{ p: 2, bgcolor: "#111827", borderRadius: 1, m: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <span style={{ color: "#9CA3AF", fontSize: "13px", fontWeight: 500 }}>
                        {isWalletConnected ? "ACTIVE WALLET" : "NO WALLET"}
                    </span>
                    {isWalletConnected ? (
                        <Box sx={{ width: 20, height: 20, bgcolor: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TiTick style={{ color: "#10B981", fontSize: 14 }} />
                        </Box>
                    ) : (
                        <Box sx={{ width: 20, height: 20, bgcolor: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <RxCross1 style={{ color: "#EF4444", fontSize: 14 }} />
                        </Box>
                    )}
                </Box>

                {isWalletConnected ? (
                    <>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                            <span style={{ color: "#9CA3AF", fontSize: "14px", flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                            </span>
                            <button
                                onClick={copyAddressToClipboard}
                                style={{ color: "#9CA3AF", marginLeft: 8 }}
                                title="Copy address to clipboard"
                            >
                                <IoCopyOutline size={16} />
                            </button>
                        </Box>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                            <span style={{ color: "#9CA3AF", fontSize: "14px" }}>{balance} ETH</span>
                            {isWalletConnected && (
                                <button
                                    onClick={refreshBalance}
                                    style={{ color: "#9CA3AF", cursor: "pointer" }}
                                    title="Refresh balance"
                                >
                                    <MdRefresh size={16} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <span style={{ color: "#6B7280", fontSize: "14px" }}>Connect a wallet to get started</span>
                )}
            </Box>

            <Divider style={{ backgroundColor: "#4b5563" }} />

            <List>
                {navigationItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => scrollToSection(item.sectionId)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider style={{ backgroundColor: "#4b5563" }} />
            {/* <List>
                {[
                    { text: "Docs", icon: <IoDocumentSharp color="white" /> },
                    { text: "Settings", icon: <IoMdSettings color="white" /> }
                ].map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List> */}
        </Box>
    );

    return (
        <div>
            <div
                onClick={toggleDrawer(true)}
                className="cursor-pointer sm:hidden flex justify-center items-center w-10 h-10
                rounded-full p-2 bg-gray-500"
            >
                <HiOutlineMenu size={22} />
            </div>
            <Drawer
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: "#1f2937",
                        },
                    },
                }}
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
            >
                {DrawerList}
            </Drawer>
        </div>
    );
}
