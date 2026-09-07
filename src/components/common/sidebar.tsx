"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MessageIcon from "@mui/icons-material/Message";
import AddHomeIcon from "@mui/icons-material/AddHome";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";

const userMenuItems = [
  {
    label: "Home",
    icon: <HomeIcon />,
    href: "/properties",
  },
  {
    label: "Favourites",
    icon: <FavoriteIcon />,
    href: "/properties",
  },
  {
    label: "Inbox",
    icon: <MessageIcon />,
    href: "/properties",
  },
  {
    label: "My Properties",
    icon: <AddHomeIcon />,
    href: "/properties",
  },
];

const adminMenuItems = [
  {
    label: "Profile",
    icon: <PersonIcon />,
    href: "/admin/profile",
  },
  {
    label: "Properties",
    icon: <AddHomeIcon />,
    href: "/admin/properties",
  },
  {
    label: "Users",
    icon: <PeopleIcon />,
    href: "/admin/users",
  },
];

const ownerMenuItems = [
  {
    label: "Profile",
    icon: <PersonIcon />,
    href: "/owner",
  },
  {
    label: "New Property",
    icon: <AddHomeIcon />,
    href: "/owner/profile/new",
  },
  {
    label: "My Properties",
    icon: <AddHomeIcon />,
    href: "/owner/profile/properties",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role.toUpperCase() === "ADMIN";
  const isOwner = user?.role.toUpperCase() === "OWNER";
  const menuItems = isAdmin ? adminMenuItems : isOwner ? ownerMenuItems : userMenuItems;

  return (
    <>
      {!open && (
        <IconButton
          onMouseEnter={() => setOpen(true)}
          sx={{
            position: "fixed",
            left: 15,
            top: "calc(64px + (100vh - 64px) / 2)",
            transform: "translateY(-50%)",
            zIndex: 14,
            width: 40,
            height: 40,
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "white",
            },
          }}
        >
          <ArrowRight />
        </IconButton>
      )}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        sx={{
          zIndex: 14,
          "& .MuiDrawer-paper": {
            top: 64,
            height: "calc(100% - 64px)",
            overflow: "visible",
          },
        }}
      >
        <Box
          sx={{
            width: 260,
            height: "100%",
            position: "relative",
          }}
        >
          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.label}
                component={Link}
                href={item.href}
                selected={pathname === item.href}
                onClick={() => setOpen(false)}
              >
                <ListItemIcon sx={{color: "rgb(62, 59, 235)"}}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",

              width: 32,
              height: 58,

              borderRadius: "0 16px 16px 0",

              backgroundColor: "white",

              boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.18)",
              zIndex: 1,

              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <ArrowLeft />
          </IconButton>
        </Box>
      </Drawer>
    </>
  );
}
