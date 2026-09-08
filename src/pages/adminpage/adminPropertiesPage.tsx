"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  getProperties,
  updatePropertyStatus,
} from "@/services/propertyService";
import PropertyCardItem from "@/components/cards/propertycarditem";
import type { Property } from "@/types/property";

type PropertiesResponse = Property[] | { properties: Property[] };

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await getProperties<PropertiesResponse>();
        const data = Array.isArray(response) ? response : response.properties;
        setProperties(
          data.filter(
            (property) => property.status?.toUpperCase() === "PENDING"
          )
        );
      } catch {
        setError("Unable to load property requests.");
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  const changeStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    const reason = rejectionReasons[String(id)]?.trim();

    if (status === "REJECTED" && !reason) {
      setError("Rejection reason is required.");
      return;
    }

    setUpdatingId(id);
    setError("");
    try {
      await updatePropertyStatus(String(id), {
        status,
        ...(reason && { rejectionReason: reason }),
      });

      setProperties((current) =>
        current.filter((property) => property._id !== id)
      );
    } catch {
      setError(`Unable to ${status.toLowerCase()} this property.`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Typography sx={{ mt: 10, px: 3 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ mt: 10, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Property Requests
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid key={property._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack spacing={1.5}>
              <PropertyCardItem property={property} showStatus hideActions />

              <TextField
                label="Rejection reason"
                value={rejectionReasons[property._id] ?? ""}
                onChange={(e) =>
                  setRejectionReasons((current) => ({
                    ...current,
                    [property._id]: e.target.value,
                  }))
                }
                size="small"
                fullWidth
              />

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={updatingId === property._id}
                  onClick={() => changeStatus(property._id, "APPROVED")}
                >
                  Approve
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  disabled={updatingId === property._id}
                  onClick={() => changeStatus(property._id, "REJECTED")}
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>

      {!properties.length && (
        <Typography sx={{ mt: 2 }}>
          No pending property requests.
        </Typography>
      )}
    </Box>
  );
}

