"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as Yup from "yup";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { createProperty } from "@/services/propertyService";

const initialValues = { title: "", description: "", location: "", images: [""], price: "" };

const propertySchema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  location: Yup.string().trim().required("Location is required"),
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

  const updateValue = (name: "title" | "description" | "location" | "price", value: string) => {
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
        location: validatedValues.location,
        image: validatedValues.images,
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
            <TextField label="Location" required value={values.location} onChange={(event) => updateValue("location", event.target.value)} />
            {values.images.map((image, index) => (
              <Stack key={index} direction="row" spacing={1}>
                <TextField label={`Image URL ${index + 1}`} required type="url" fullWidth value={image} onChange={(event) => updateImage(index, event.target.value)} />
                {values.images.length > 1 && <Button type="button" color="error" onClick={() => setValues((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))}>Remove</Button>}
              </Stack>
            ))}
            <Button type="button" variant="outlined" onClick={() => setValues((current) => ({ ...current, images: [...current.images, ""] }))}>Add another image</Button>
            <TextField label="Price" required type="number" slotProps={{ htmlInput: { min: 1 } }} value={values.price} onChange={(event) => updateValue("price", event.target.value)} />
            <Button type="submit" variant="contained" disabled={saving}>{saving ? "Creating..." : "Create Property"}</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}