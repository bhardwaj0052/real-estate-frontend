"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createProperty } from "@/services/propertyService";

const propertyTypes = [
  "Apartment",
  "Villa",
  "Independent House",
  "Plot",
  "Commercial",
];

const initialValues = {
  title: "",
  description: "",
  propertyType: "Apartment",
  bhk: "",
  area: "",
  price: "",
  city: "",
  locality: "",
  fullAddress: "",
  latitude: "",
  longitude: "",
  amenities: "",
  images: [""],
};

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  propertyType: Yup.string()
    .oneOf(propertyTypes)
    .required("Property type is required"),
  bhk: Yup.number()
    .typeError("BHK must be a number")
    .integer()
    .min(0)
    .required("BHK is required"),
  area: Yup.number()
    .typeError("Area must be a number")
    .positive()
    .required("Area is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive()
    .required("Price is required"),
  city: Yup.string().trim().required("City is required"),
  locality: Yup.string().trim().required("Area / Locality is required"),
  fullAddress: Yup.string().trim().required("Full address is required"),
  latitude: Yup.number()
    .typeError("Latitude must be a number")
    .min(-90)
    .max(90)
    .required("Latitude is required"),
  longitude: Yup.number()
    .typeError("Longitude must be a number")
    .min(-180)
    .max(180)
    .required("Longitude is required"),
  amenities: Yup.string().trim().required("Add at least one amenity"),
  images: Yup.array()
    .of(Yup.string().trim().url("Enter a valid image URL").required())
    .min(1, "Add at least one image"),
});

export default function PropertyForm() {
  const router = useRouter();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus("");
      try {
        await createProperty({
          title: values.title,
          description: values.description,
          city: values.city,
          area: values.locality,
          address: values.fullAddress,
          lat: Number(values.latitude),
          lng: Number(values.longitude),
          propertyType: values.propertyType,
          bhk: Number(values.bhk),
          sqft: Number(values.area),
          amenities: values.amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean),
          images: values.images,
          price: Number(values.price),
        });
        router.push("/owner/profile/properties");
      } catch (err) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.message
          : null;
        setStatus(
          Array.isArray(message)
            ? message.join(", ")
            : (message ?? "Unable to create property. Please try again."),
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    status,
    setFieldValue,
  } = formik;

  const updateImage = (index: number, value: string) => {
    const images = [...values.images];
    images[index] = value;
    setFieldValue("images", images);
  };

  const addImage = () => setFieldValue("images", [...values.images, ""]);
  const removeImage = (index: number) =>
    setFieldValue(
      "images",
      values.images.filter((_, i) => i !== index),
    );

  return (
    <Box sx={{ mt: 10, px: 3, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Create Property
      </Typography>
      <Card sx={{ maxWidth: 720 }}>
        <CardContent component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {status && <Alert severity="error">{status}</Alert>}

            <TextField
              label="Title"
              name="title"
              required
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.title && !!errors.title}
              helperText={touched.title && errors.title}
            />

            <TextField
              label="Description"
              name="description"
              required
              multiline
              minRows={3}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && !!errors.description}
              helperText={touched.description && errors.description}
            />

            <TextField
              select
              label="Property Type"
              name="propertyType"
              required
              value={values.propertyType}
              onChange={handleChange}
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="BHK"
              name="bhk"
              required
              type="number"
              value={values.bhk}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.bhk && !!errors.bhk}
              helperText={touched.bhk && errors.bhk}
            />

            <TextField
              label="Area / Sqft"
              name="area"
              required
              type="number"
              value={values.area}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.area && !!errors.area}
              helperText={touched.area && errors.area}
            />

            <TextField
              label="Price"
              name="price"
              required
              type="number"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price && !!errors.price}
              helperText={touched.price && errors.price}
            />

            <TextField
              label="City"
              name="city"
              required
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.city && !!errors.city}
              helperText={touched.city && errors.city}
            />

            <TextField
              label="Area / Locality"
              name="locality"
              required
              value={values.locality}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.locality && !!errors.locality}
              helperText={touched.locality && errors.locality}
            />

            <TextField
              label="Full Address"
              name="fullAddress"
              required
              multiline
              minRows={2}
              value={values.fullAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullAddress && !!errors.fullAddress}
              helperText={touched.fullAddress && errors.fullAddress}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Latitude"
                name="latitude"
                required
                type="number"
                fullWidth
                value={values.latitude}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.latitude && !!errors.latitude}
                helperText={touched.latitude && errors.latitude}
              />
              <TextField
                label="Longitude"
                name="longitude"
                required
                type="number"
                fullWidth
                value={values.longitude}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.longitude && !!errors.longitude}
                helperText={touched.longitude && errors.longitude}
              />
            </Stack>

            <TextField
              label="Amenities"
              name="amenities"
              required
              helperText={
                touched.amenities && errors.amenities
                  ? errors.amenities
                  : "Separate amenities with commas"
              }
              placeholder="Parking, Lift, Gym"
              value={values.amenities}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.amenities && !!errors.amenities}
            />

            {values.images.map((image, index) => (
              <Stack key={index} direction="row" spacing={1}>
                <TextField
                  label={`Image URL ${index + 1}`}
                  required
                  type="url"
                  fullWidth
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                />
                {values.images.length > 1 && (
                  <Button
                    type="button"
                    color="error"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            ))}
            {touched.images && errors.images && (
              <Alert severity="error">
                {typeof errors.images === "string"
                  ? errors.images
                  : "Check your image URLs"}
              </Alert>
            )}
            <Button type="button" variant="outlined" onClick={addImage}>
              Add another image
            </Button>

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Property"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
