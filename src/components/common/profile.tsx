"use client";

import { Avatar, Box, Card, CardContent, Chip, Divider, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { useAuth } from "@/context/AuthContext";

interface ProfileProps {
  title: string;
  fallbackName: string;
  idLabel: string;
  fallbackRole: string;
}

export default function Profile({
  title,
  fallbackName,
  idLabel,
  fallbackRole,
}: ProfileProps) {
  const { user } = useAuth();

  const name = user?.name ?? fallbackName;
  const email = user?.email ?? "Not available";
  const role = user?.role ?? fallbackRole;

  return (
    <Box sx={{ mt: 10, px: 3, bgcolor: "#f7f8fa", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 650, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 2, color: "#111827", fontSize: { xs: "1.8rem", sm: "2.125rem" } }}
        >
          {title}
        </Typography>

        <Card
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              bgcolor: "#111827",
              color: "white",
              p: { xs: 2.5, sm: 3 },
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ width: 56, height: 56, bgcolor: "white", color: "#111827" }}>
              {name.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {name}
              </Typography>
              <Typography sx={{ color: "#d1d5db", mt: 0.5, fontSize: 14 }}>
                {email}
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5, color: "#111827" }}>
              Account Information
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, py: 1 }}>
              <AccountCircleIcon sx={{ color: "#374151", fontSize: 22, mt: 0.25 }} />
              <Box>
                <Typography variant="caption" sx={{ display: "block", color: "text.secondary", lineHeight: 1.2 }}>
                  Full Name
                </Typography>
                <Typography sx={{ fontWeight: 600, mt: 0.25, color: "#111827", lineHeight: 1.3 }}>
                  {name}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", gap: 1.5, py: 1 }}>
              <EmailOutlinedIcon sx={{ color: "#374151", fontSize: 22, mt: 0.25 }} />
              <Box>
                <Typography variant="caption" sx={{ display: "block", color: "text.secondary", lineHeight: 1.2 }}>
                  Email
                </Typography>
                <Typography sx={{ fontWeight: 600, mt: 0.25, color: "#111827", lineHeight: 1.3, wordBreak: "break-word" }}>
                  {email}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", gap: 1.5, py: 1 }}>
              <VerifiedUserOutlinedIcon sx={{ color: "#374151", fontSize: 22, mt: 0.25 }} />
              <Box>
                <Typography variant="caption" sx={{ display: "block", color: "text.secondary", lineHeight: 1.2 }}>
                  Role
                </Typography>
                <Chip label={role} size="small" sx={{ mt: 0.5, fontWeight: 600 }} />
              </Box>
            </Box>

            {user?.userId && (
              <>
                <Divider />

                <Box sx={{ display: "flex", gap: 1.5, py: 1 }}>
                  <BadgeOutlinedIcon sx={{ color: "#374151", fontSize: 22, mt: 0.25 }} />
                  <Box>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary", lineHeight: 1.2 }}>
                      {idLabel}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, mt: 0.25, color: "#111827", lineHeight: 1.3, wordBreak: "break-all" }}>
                      {user.userId}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}