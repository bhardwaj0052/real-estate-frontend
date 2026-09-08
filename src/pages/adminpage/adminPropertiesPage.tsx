"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
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

type PropertyFilter =
  | "ALL"
  | "APPROVED"
  | "PENDING"
  | "REJECTED";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<PropertyFilter>("PENDING");

  const [page, setPage] = useState(1);

  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});

  const [updatingId, setUpdatingId] = useState<
    string | number | null
  >(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        const response =
          await getProperties<PropertiesResponse>();

        const data = Array.isArray(response)
          ? response
          : response.properties;

        setProperties(data);
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
    status: "APPROVED" | "REJECTED",
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
        ...(reason && {
          rejectionReason: reason,
        }),
      });

      setProperties((current) =>
        current.filter(
          (property) => property._id !== id,
        ),
      );
    } catch {
      setError(
        `Unable to ${status.toLowerCase()} this property.`,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleProperties = properties.filter(
    (property) => {
      if (statusFilter === "ALL") {
        return true;
      }

      return (
        property.status?.toUpperCase() ===
        statusFilter
      );
    },
  );

  const pageProperties = visibleProperties.slice(
    (page - 1) * 10,
    page * 10,
  );

  const pageCount = Math.ceil(
    visibleProperties.length / 10,
  );

  if (loading) {
    return (
      <Typography sx={{ mt: 10, px: 3 }}>
        Loading...
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 10, px: 3 }}>
      {/* Title + Status Filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700 }}
        >
          Property Requests
        </Typography>

        <FormControl
          size="small"
          sx={{ minWidth: 180 }}
        >
          <InputLabel id="property-status-label">
            Status
          </InputLabel>

          <Select
            labelId="property-status-label"
            value={statusFilter}
            label="Status"
            onChange={(event) => {
              setStatusFilter(
                event.target.value as PropertyFilter,
              );
              setPage(1);
            }}
          >
            <MenuItem value="ALL">
              All
            </MenuItem>

            <MenuItem value="APPROVED">
              Approved
            </MenuItem>

            <MenuItem value="PENDING">
              Pending
            </MenuItem>

            <MenuItem value="REJECTED">
              Rejected
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Property Cards */}
      <Grid container spacing={3}>
        {pageProperties.map((property) => (
          <Grid
  key={property._id}
  size={{ xs: 12, sm: 6, md: 3 }}
>
            <Stack spacing={1.5}>
              <PropertyCardItem
                property={property}
                showStatus
                hideActions
                detail
              />

              {/* Approve / Reject only for pending */}
              {property.status?.toUpperCase() ===
                "PENDING" && (
                <>
                  <TextField
                    label="Rejection reason"
                    value={
                      rejectionReasons[property._id] ??
                      ""
                    }
                    onChange={(e) =>
                      setRejectionReasons(
                        (current) => ({
                          ...current,
                          [property._id]:
                            e.target.value,
                        }),
                      )
                    }
                    size="small"
                    fullWidth
                  />

                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      disabled={
                        updatingId ===
                        property._id
                      }
                      onClick={() =>
                        changeStatus(
                          property._id,
                          "APPROVED",
                        )
                      }
                    >
                      Approve
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      disabled={
                        updatingId ===
                        property._id
                      }
                      onClick={() =>
                        changeStatus(
                          property._id,
                          "REJECTED",
                        )
                      }
                    >
                      Reject
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) =>
            setPage(value)
          }
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
          }}
        />
      )}

      {/* Empty State */}
      {!visibleProperties.length && (
        <Typography sx={{ mt: 2 }}>
          No pending property requests.
        </Typography>
      )}
    </Box>
  );
}