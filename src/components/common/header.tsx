"use client";

import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import Authform from "../authform/authform";

export default function Header() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const onSubmit = (values: {
    fname: string;
    lname: string;
    email: string;
    password: string;
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
              onClick={() => setShow((value) => !value)}
            >
              <AccountCircleIcon />
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
