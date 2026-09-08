"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, Grid, Pagination, Stack, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { deleteProperty, getProperties } from "@/services/propertyService";
import type { Property } from "@/types/property";
import PropertyCardItem from "@/components/cards/propertycarditem";

export default function OwnerPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageProperties = properties.slice((page - 1) * 10, page * 10);
  const pageCount = Math.ceil(properties.length / 10);

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

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    setError("");
    try {
      await deleteProperty(id);
      setProperties((current) => {
        const next = current.filter((property) => property._id !== id);
        const nextPageCount = Math.max(1, Math.ceil(next.length / 10));
        setPage((currentPage) => Math.min(currentPage, nextPageCount));
        return next;
      });
    } catch {
      setError("Unable to delete this property.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Typography sx={{ mt: 10, px: 3 }}>
        Loading your properties...
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 10, px: 3, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        My Properties
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {pageProperties.map((property) => (
          <Grid
            key={property._id}
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <Stack spacing={1.5}>
              <PropertyCardItem
                property={property}
                showStatus
                detail
                hideActions
                href={`/owner/profile/properties/${property._id}`}
              />
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                disabled={deletingId === property._id}
                onClick={() => handleDelete(property._id, property.title)}
              >
                {deletingId === property._id ? "Deleting..." : "Delete property"}
              </Button>
            </Stack>
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 3, display: "flex", justifyContent: "center" }}
        />
      )}

      {!properties.length && (
        <Typography>No properties created yet.</Typography>
      )}
    </Box>
  );
}