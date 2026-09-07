import { Box, Typography } from "@mui/material";

export default function AdminUsersPage() {
	return (
		<Box sx={{ mt: 10, px: 3 }}>
			<Typography variant="h4" sx={{ fontWeight: 700 }}>
				Users
			</Typography>
			<Typography color="text.secondary" sx={{ mt: 1 }}>
				User management is not available yet.
			</Typography>
		</Box>
	);
}
