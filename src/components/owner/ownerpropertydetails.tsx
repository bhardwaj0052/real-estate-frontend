"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Alert, Box, Button, Typography } from "@mui/material";
import { getProperty } from "@/services/propertyService";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/cards/propertycard";

export default function OwnerPropertyDetails({ slug }: { slug: string }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getProperty<Property>(slug)
      .then((response) => {
        const propertyResponse = response as Property | { property: Property };
        setProperty("property" in propertyResponse ? propertyResponse.property : propertyResponse);
      })
      .catch((requestError) => {
        const message = axios.isAxiosError(requestError)
          ? requestError.response?.data?.message
          : null;
        setError(Array.isArray(message) ? message.join(", ") : message ?? "Unable to load this property.");
      });
  }, [slug]);

  if (error) {
    return <Alert severity="error" sx={{ mt: 10, mx: 3 }}>{error}</Alert>;
  }

  if (!property) {
    return <Typography sx={{ mt: 10, px: 3 }}>Loading property details...</Typography>;
  }

  return (
    <Box sx={{ mt: 10, px: 3, pb: 4 }}>
      <Button component={Link} href="/owner/profile/properties" sx={{ mb: 2 }}>
        Back to My Properties
      </Button>
      <Box sx={{ maxWidth: 800 }}>
        <PropertyCard property={property} detail />
      </Box>
    </Box>
  );
}