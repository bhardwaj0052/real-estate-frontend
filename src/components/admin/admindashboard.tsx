import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

export default function AdminDashboard() {
  return (
    <Box sx={{ mt: 10, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {["Manage Users", "Review Properties", "Approved Listings"].map((title) => (
          <Grid key={title} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Admin access enabled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}