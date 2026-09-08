"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, login } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setStatus }) => {
      try {
        const response = await login(values);
        const authenticatedUser = getAuth();
        setUser({
          accessToken: response.access_token,
          role: response.role,
          email: authenticatedUser?.email ?? values.email,
          name: authenticatedUser?.name,
          userId: authenticatedUser?.userId,
        });
        const role = response.role.toUpperCase();
        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "BUYER") {
          router.push("/buyer/profile");
        } else {
          router.push("/owner/profile");
        }
      } catch {
        setStatus("Invalid email or password");
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: 400, p: 2 }}>
        <CardHeader title="Login" subheader="Access your account" />
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            {formik.status && <Box color="error.main">{formik.status}</Box>}
            <Button type="submit" variant="contained">
              Login
            </Button>
            <Button component={Link} href="/">
              Create account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
