"use client";

import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Authform from "../authform/authform";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const onSubmit = (values: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "BUYER" | "OWNER";
  }) => {
    console.log(values);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 15,
          height: 64,
        }}
      >
        <Toolbar
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Real Estate
          </Typography>
          <Box sx={{ position: "relative" }}>
            <IconButton
              color="inherit"
              onClick={user ? handleLogout : () => setShow((value) => !value)}
              aria-label={user ? "Logout" : "Account"}
            >
              {user ? <LogoutIcon /> : <AccountCircleIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {show && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 16,
          }}
        >
          <Authform onClose={handleClose} onSave={onSubmit} />
        </Box>
      )}
    </>
  );
}
