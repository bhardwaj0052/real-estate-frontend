"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Box, Grid, Typography } from "@mui/material";
import { getProperty, getSavedProperties } from "@/services/propertyService";
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
            } catch (requestError) {
                if (axios.isAxiosError(requestError)) {
                    const message = requestError.response?.data?.message;
                    setError(
                        Array.isArray(message)
                            ? message.join(", ")
                            : message ?? `Unable to load saved properties (HTTP ${requestError.response?.status ?? "error"}).`,
                    );
                } else {
                    setError("Unable to load saved properties.");
                }
            } finally {
                setLoading(false);
            }
        }

        loadSavedProperties();
    }, []);

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
                {properties.map((property) => (
                    <Grid key={property._id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <PropertyCard
                            title={property.title}
                            price={property.price}
                            location={getPropertyLocation(property)}
                            images={property.images}
                            bhk={property.bhk}
                            sqft={property.sqft ?? property.area}
                            propertyType={property.propertyType}
                            saved
                            onFavorite={() => setProperties((current) => current.filter((item) => item._id !== property._id))}
                        />
                    </Grid>
                ))}
            </Grid>

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
