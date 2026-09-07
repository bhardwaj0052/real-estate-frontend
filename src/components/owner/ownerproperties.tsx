"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { getProperties } from "@/services/propertyService";
import type { Property } from "@/types/property";
import PropertyCardItem from "@/components/cards/propertycarditem";

export default function OwnerProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties<Property[]>();
        setProperties(data);
      } catch {
        setError("Unable to load your properties.");
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  if (loading) {
    return (
      <Typography sx={{ mt: 10, px: 3 }}>
        Loading your properties...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography sx={{ mt: 10, px: 3 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 10, px: 3, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        My Properties
      </Typography>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid
            key={property._id}
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <PropertyCardItem
              property={property}
              showStatus
              hideActions
              href={`/owner/profile/properties/${property._id}`}
            />
          </Grid>
        ))}
      </Grid>

      {!properties.length && (
        <Typography>No properties created yet.</Typography>
      )}
    </Box>
  );
}