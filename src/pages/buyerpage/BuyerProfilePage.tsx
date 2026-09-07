"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function BuyerProfilePage() {
  const { user } = useAuth();

  return (
    <Box sx={{ mt: 10, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Buyer Profile
      </Typography>
      <Card sx={{ maxWidth: 560 }}>
        <CardContent>
          <Typography variant="h6">{user?.name ?? "Buyer"}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Email: {user?.email ?? "Not available"}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Role: {user?.role ?? "BUYER"}
          </Typography>
          {user?.userId && (
            <Typography sx={{ mt: 1 }}>Buyer ID: {user.userId}</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}