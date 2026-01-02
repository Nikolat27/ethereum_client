import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { IoDocumentSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import { Divider } from "@mui/material";
import { FaNetworkWired, FaWallet, FaFileContract } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { BiSolidWrench } from "react-icons/bi";

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(false);

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

    const navigationItems = [
        { text: "Network", icon: <FaNetworkWired color="white" size={20} />, sectionId: "network-section" },
        { text: "Wallet", icon: <FaWallet color="white" size={20} />, sectionId: "wallet-section" },
        { text: "Transaction", icon: <GrTransaction color="white" size={20} />, sectionId: "transaction-section" },
        { text: "Contract", icon: <FaFileContract color="white" size={20} />, sectionId: "contract-section" },
        { text: "Utilities", icon: <BiSolidWrench color="white" size={20} />, sectionId: "utilities-section" },
    ];

    const DrawerList = (
        <Box sx={{ width: 250, color: "white" }} role="presentation">
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
            <List>
                {["Docs", "Settings"].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <IoDocumentSharp color="white" /> : <IoMdSettings color="white" />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
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
