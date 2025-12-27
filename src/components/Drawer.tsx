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

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250, color: "white" }} role="presentation" onClick={toggleDrawer(false)}>
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
            <Divider style={{ color: "white" }} />
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
