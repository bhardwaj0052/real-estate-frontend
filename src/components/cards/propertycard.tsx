"use client";

import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getProperties } from "@/services/propertyService";
import type { Property } from "@/types/property";
import PropertyCardItem from "./propertycarditem";

type PropertiesResponse = Property[] | { properties: Property[] };

interface PropertyCardProps {
  property?: Property;
  detail?: boolean;
}

export default function PropertyCard({ property: selectedProperty, detail = false }: PropertyCardProps) {
  const [token] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("access_token") ?? "",
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    getProperties<PropertiesResponse>()
      .then((response) => {
        const allProperties = Array.isArray(response) ? response : response.properties;
        setProperties(allProperties.filter((property) => property.status === "APPROVED"));
      })
      .catch(() => {
        setError("Unable to load properties.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

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
          <PropertyCardItem property={item} />
        </Grid>
      ))}
    </Grid>
  );
}
