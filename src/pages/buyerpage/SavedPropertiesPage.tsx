"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Grid, Pagination, Typography } from "@mui/material";
import {
    getProperty,
    getSavedProperties,
    removeSavedProperty,
} from "@/services/propertyService";
import PropertyCard from "@/components/cards/resuablepropertycard";
import type { Property } from "@/types/property";

type SavedProperty =
    | Property
    | { property?: Property; propertyId?: string | Property };
type SavedPropertiesResponse =
    | SavedProperty[]
    | { properties: SavedProperty[] }
    | { savedProperties: SavedProperty[] }
    | { data: SavedProperty[] };

export default function SavedPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const pageProperties = properties.slice((page - 1) * 10, page * 10);
    const pageCount = Math.ceil(properties.length / 10);

    useEffect(() => {
        async function loadSavedProperties() {
            try {
                const response = await getSavedProperties<SavedPropertiesResponse>();
                const savedProperties = getSavedPropertyItems(response);
                const properties = await Promise.all(
                    savedProperties.map(async (item) => {
                        if ("property" in item && item.property) {
                            return item.property;
                        }

                        if ("propertyId" in item && item.propertyId) {
                            const propertyId =
                                typeof item.propertyId === "string"
                                    ? item.propertyId
                                    : item.propertyId._id;
                            const response = await getProperty<
                                Property | { property: Property }
                            >(propertyId);
                            return "property" in response ? response.property : response;
                        }

                        return "_id" in item ? item : null;
                    }),
                );
                setProperties(
                    properties.filter(
                        (property): property is Property => Boolean(property?._id),
                    ),
                );
            } catch {
                setError("Unable to load saved properties.");
            } finally {
                setLoading(false);
            }
        }

        loadSavedProperties();
    }, []);

    const removeFromSaved = async (propertyId: string) => {
        try {
            await removeSavedProperty(propertyId);
                setProperties((current) => {
                    const next = current.filter((item) => item._id !== propertyId);
                    const nextPageCount = Math.max(1, Math.ceil(next.length / 10));
                    setPage((currentPage) => Math.min(currentPage, nextPageCount));
                    return next;
                });
        } catch {
            setError("Unable to remove this saved property.");
        }
    };

    if (loading) {
        return <Typography sx={{ mt: 10, px: 3 }}>Loading saved properties...</Typography>;
    }

    return (
        <Box sx={{ mt: 10, px: 3, pb: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                Saved Properties
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {pageProperties.map((property) => (
                    <Grid key={property._id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <PropertyCard
                            title={property.title}
                            price={property.price}
                            location={getPropertyLocation(property)}
                            images={property.images}
                            bhk={property.bhk}
                            sqft={property.sqft ?? property.area}
                            propertyType={property.propertyType}
                            ownerId={property.ownerId ?? property.owner?._id}
                            saved
                            onFavorite={() => removeFromSaved(property._id)}
                        />
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

            {!properties.length && !error && (
                <Typography>No saved properties yet.</Typography>
            )}
        </Box>
    );
}

function getPropertyLocation(property: Property) {
    return property.location ?? property.fullAddress ?? [property.address, property.area, property.city].filter(Boolean).join(", ");
}

function getSavedPropertyItems(response: SavedPropertiesResponse): SavedProperty[] {
    if (Array.isArray(response)) {
        return response;
    }

    if ("properties" in response) {
        return response.properties;
    }

    if ("savedProperties" in response) {
        return response.savedProperties;
    }

    return response.data;
}
