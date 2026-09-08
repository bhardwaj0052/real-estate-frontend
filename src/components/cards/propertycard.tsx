"use client";

import { Grid, Typography } from "@mui/material";
import type { Property } from "@/types/property";
import { usePropertyCard } from "@/hooks/usePropertyCard";
import PropertyCardItem from "./propertycarditem";

interface PropertyCardProps {
  property?: Property;
  detail?: boolean;
}

export default function PropertyCard({ property: selectedProperty, detail = false }: PropertyCardProps) {
  const { token, properties, savedPropertyIds, loading, error } = usePropertyCard();

  if (selectedProperty) {
    return <PropertyCardItem property={selectedProperty} detail={detail} />;
  }

  if (loading) {
    return <Typography sx={{ mt: 10, px: 3 }}>Loading properties...</Typography>;
  }

  if (error) {
    return <Typography sx={{ mt: 10, px: 3 }}>{error}</Typography>;
  }

  if (!token) {
    return (
      <Typography sx={{ mt: 10, px: 3 }}>
        Please login to view properties.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 10, px: 3 }}>
      {properties.map((item) => (
        <Grid key={item._id} size={{ xs: 12, sm: 6, md: 3 }}>
          <PropertyCardItem
            property={item}
            saved={savedPropertyIds.has(item._id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
