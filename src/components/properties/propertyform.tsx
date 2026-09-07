"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as Yup from "yup";
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { createProperty } from "@/services/propertyService";

const propertyTypes = ["Apartment", "Villa", "Independent House", "Plot", "Commercial"] as const;

const initialValues = {
  title: "",
  description: "",
  propertyType: "Apartment" as (typeof propertyTypes)[number],
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

const propertySchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  propertyType: Yup.string().oneOf(propertyTypes).required("Property type is required"),
  bhk: Yup.number().typeError("BHK must be a number").integer("BHK must be a whole number").min(0).required("BHK is required"),
  area: Yup.number().typeError("Area must be a number").positive("Area must be greater than zero").required("Area is required"),
  city: Yup.string().trim().required("City is required"),
  locality: Yup.string().trim().required("Area / Locality is required"),
  fullAddress: Yup.string().trim().required("Full address is required"),
  latitude: Yup.number().typeError("Latitude must be a number").min(-90).max(90).required("Latitude is required"),
  longitude: Yup.number().typeError("Longitude must be a number").min(-180).max(180).required("Longitude is required"),
  amenities: Yup.string().trim().required("Add at least one amenity"),
  images: Yup.array()
    .of(Yup.string().trim().url("Enter a valid image URL").required("Image URL is required"))
    .min(1, "Add at least one image")
    .required(),
  price: Yup.number().typeError("Price must be a number").positive("Price must be greater than zero").required("Price is required"),
});

export default function PropertyForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateValue = (name: Exclude<keyof typeof initialValues, "images">, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const updateImage = (index: number, value: string) => {
    setValues((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => imageIndex === index ? value : image),
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    setSaving(true);

    try {
      const validatedValues = await propertySchema.validate(values, { abortEarly: false });
      await createProperty({
        title: validatedValues.title,
        description: validatedValues.description,
        propertyType: validatedValues.propertyType,
        bhk: validatedValues.bhk,
        area: validatedValues.area,
        city: validatedValues.city,
        locality: validatedValues.locality,
        fullAddress: validatedValues.fullAddress,
        latitude: validatedValues.latitude,
        longitude: validatedValues.longitude,
        amenities: validatedValues.amenities.split(",").map((amenity) => amenity.trim()).filter(Boolean),
        images: validatedValues.images,
        price: validatedValues.price,
      });
      router.push("/owner/profile/properties");
    } catch (requestError) {
      if (requestError instanceof Yup.ValidationError) {
        setError(requestError.errors.join(", "));
        setSaving(false);
        return;
      }
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.message
        : null;
      setError(Array.isArray(message) ? message.join(", ") : message ?? "Unable to create property. Please try again.");
      setSaving(false);
    }
  };

  return (
    <Box sx={{ mt: 10, px: 3, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Create Property</Typography>
      <Card sx={{ maxWidth: 720 }}>
        <CardContent component="form" onSubmit={submit}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Title" required value={values.title} onChange={(event) => updateValue("title", event.target.value)} />
            <TextField label="Description" required multiline minRows={3} value={values.description} onChange={(event) => updateValue("description", event.target.value)} />
            <TextField select label="Property Type" required value={values.propertyType} onChange={(event) => updateValue("propertyType", event.target.value)}>
              {propertyTypes.map((propertyType) => <MenuItem key={propertyType} value={propertyType}>{propertyType}</MenuItem>)}
            </TextField>
            <TextField label="BHK" required type="number" slotProps={{ htmlInput: { min: 0, step: 1 } }} value={values.bhk} onChange={(event) => updateValue("bhk", event.target.value)} />
            <TextField label="Area / Sqft" required type="number" slotProps={{ htmlInput: { min: 1 } }} value={values.area} onChange={(event) => updateValue("area", event.target.value)} />
            <TextField label="Price" required type="number" slotProps={{ htmlInput: { min: 1 } }} value={values.price} onChange={(event) => updateValue("price", event.target.value)} />
            <TextField label="City" required value={values.city} onChange={(event) => updateValue("city", event.target.value)} />
            <TextField label="Area / Locality" required value={values.locality} onChange={(event) => updateValue("locality", event.target.value)} />
            <TextField label="Full Address" required multiline minRows={2} value={values.fullAddress} onChange={(event) => updateValue("fullAddress", event.target.value)} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Latitude" required type="number" fullWidth value={values.latitude} onChange={(event) => updateValue("latitude", event.target.value)} />
              <TextField label="Longitude" required type="number" fullWidth value={values.longitude} onChange={(event) => updateValue("longitude", event.target.value)} />
            </Stack>
            <TextField label="Amenities" required helperText="Separate amenities with commas" placeholder="Parking, Lift, Gym" value={values.amenities} onChange={(event) => updateValue("amenities", event.target.value)} />
            {values.images.map((image, index) => (
              <Stack key={index} direction="row" spacing={1}>
                <TextField label={`Image URL ${index + 1}`} required type="url" fullWidth value={image} onChange={(event) => updateImage(index, event.target.value)} />
                {values.images.length > 1 && <Button type="button" color="error" onClick={() => setValues((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))}>Remove</Button>}
              </Stack>
            ))}
            <Button type="button" variant="outlined" onClick={() => setValues((current) => ({ ...current, images: [...current.images, ""] }))}>Add another image</Button>
            <Button type="submit" variant="contained" disabled={saving}>{saving ? "Creating..." : "Create Property"}</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}