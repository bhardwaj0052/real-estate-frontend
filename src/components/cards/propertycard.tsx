"use client";

import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  getApprovedProperties,
  getSavedProperties,
} from "@/services/propertyService";
import type { Property } from "@/types/property";
import PropertyCardItem from "./propertycarditem";

type PropertiesResponse = Property[] | { properties: Property[] };
type SavedProperty = { propertyId?: string | { _id: string } };
type SavedPropertiesResponse =
  | SavedProperty[]
  | { properties: SavedProperty[] }
  | { savedProperties: SavedProperty[] }
  | { data: SavedProperty[] };

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
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperties() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [response, savedResponse] = await Promise.all([
          getApprovedProperties<PropertiesResponse>(),
          getSavedProperties<SavedPropertiesResponse>(),
        ]);
        const allProperties = Array.isArray(response) ? response : response.properties;
        setProperties(allProperties);
        setSavedPropertyIds(new Set(getSavedPropertyIds(savedResponse)));
      } catch {
        setError("Unable to load properties.");
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
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
          <PropertyCardItem
            property={item}
            saved={savedPropertyIds.has(item._id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

function getSavedPropertyIds(response: SavedPropertiesResponse): string[] {
  const savedProperties = Array.isArray(response)
    ? response
    : "properties" in response
      ? response.properties
      : "savedProperties" in response
        ? response.savedProperties
        : response.data;

  return savedProperties.flatMap((item) => {
    if (!item.propertyId) {
      return [];
    }

    return [
      typeof item.propertyId === "string" ? item.propertyId : item.propertyId._id,
    ];
  });
}
