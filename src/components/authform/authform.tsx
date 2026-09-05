import {
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
import { useFormik } from "formik";
import * as Yup from "yup";

interface AuthformProps {
  onSave: (values: {
    fname: string;
    lname: string;
    email: string;
    password: string;
  }) => void;
  onClose: () => void;
}

export default function Authform({ onSave, onClose }: AuthformProps) {
  const formik = useFormik({
    initialValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      fname: Yup.string().required("First name is required"),

      lname: Yup.string().required("Last name is required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: (values) => {
      onSave(values);
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
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
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
            <TextField
              label="First Name"
              fullWidth
              name="fname"
              value={formik.values.fname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fname && Boolean(formik.errors.fname)}
              helperText={formik.touched.fname && formik.errors.fname}
            />

            <TextField
              label="Last Name"
              fullWidth
              name="lname"
              value={formik.values.lname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lname && Boolean(formik.errors.lname)}
              helperText={formik.touched.lname && formik.errors.lname}
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
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", padding: 2 }}>
          <Button variant="contained" fullWidth type="submit">
            Sign Up
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
