"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { createUser } from "@/services/userService";

interface AuthformProps {
  onSave?: (values: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "BUYER" | "OWNER" | "ADMIN";
  }) => void;
  onClose?: () => void;
}

export default function Authform({ onSave, onClose }: AuthformProps) {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "BUYER" as "BUYER" | "OWNER",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),

      role: Yup.string()
        .oneOf(["BUYER", "OWNER", "ADMIN"])
        .required("Role is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      if (onSave) {
        onSave(values);
        return;
      }
      try {
        await createUser({
          name: values.name,
          email: values.email,
          phone: values.phone,
          passwordHash: values.password,
          role: values.role,
        });
        router.push("/login");
      } catch (requestError) {
        const responseMessage = axios.isAxiosError(requestError)
          ? requestError.response?.data?.message
          : null;
        const message = Array.isArray(responseMessage)
          ? responseMessage.join(", ")
          : responseMessage ?? "Unable to create your account. Please try again.";
        formik.setStatus(message);
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
      <Card sx={{ width: 400, padding: 2 }}>
        <CardHeader
          title="Sign Up"
          subheader="Create your account"
          action={
            onClose && (
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )
          }
        />

        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {formik.status && <Alert severity="error">{formik.status}</Alert>}
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              label="Phone"
              fullWidth
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <TextField
              select
              label="Role"
              fullWidth
              name="role"
              value={formik.values.role}
              onChange={(event) =>
                formik.setFieldValue(
                  "role",
                  event.target.value as "BUYER" | "OWNER" | "ADMIN",
                )
              }
              onBlur={formik.handleBlur}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
              slotProps={{ select: { native: true } }}
            >
              <option value="BUYER">BUYER</option>
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
            </TextField>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", padding: 2 }}>
          <Box sx={{ width: "100%" }}>
            <Button variant="contained" fullWidth type="submit">
              Sign Up
            </Button>
            <Button component={Link} href="/login" fullWidth sx={{ mt: 1 }}>
              Already have an account? Login
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
}
