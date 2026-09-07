"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import PropertyCardItem from "@/components/cards/propertycarditem";
import { getApprovedProperties, getSavedProperties } from "@/services/propertyService";
import type { Property } from "@/types/property";

type PropertiesResponse = Property[] | { properties: Property[] };
type SavedProperty = { propertyId?: string | { _id: string } };
type SavedPropertiesResponse =
  | SavedProperty[]
  | { properties: SavedProperty[] }
  | { savedProperties: SavedProperty[] }
  | { data: SavedProperty[] };
type SortBy = "price" | "sqft" | "title";
type SortOrder = "asc" | "desc";

interface Filters {
  city: string;
  propertyType: string;
  bhk: string;
  minPrice: string;
  maxPrice: string;
  minSqft: string;
  maxSqft: string;
  amenities: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

const initialFilters: Filters = {
  city: "",
  propertyType: "",
  bhk: "",
  minPrice: "",
  maxPrice: "",
  minSqft: "",
  maxSqft: "",
  amenities: "",
  sortBy: "price",
  sortOrder: "asc",
};

const propertyTypes = ["Apartment", "Villa", "Independent House", "Plot", "Commercial"];

export default function PropertySearch() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperties() {
      try {
        const [response, savedResponse] = await Promise.all([
          getApprovedProperties<PropertiesResponse>(),
          getSavedProperties<SavedPropertiesResponse>(),
        ]);
        setProperties(Array.isArray(response) ? response : response.properties);
        setSavedPropertyIds(new Set(getSavedPropertyIds(savedResponse)));
      } catch {
        setError("Unable to load properties.");
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  const filteredProperties = filterProperties(properties, filters);
  const updateFilter = <Key extends keyof Filters>(key: Key, value: Filters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  if (loading) {
    return <Typography sx={{ mt: 10, px: 3 }}>Loading properties...</Typography>;
  }
  if (error) {
    return <Alert severity="error" sx={{ mt: 10, mx: 3 }}>{error}</Alert>;
  }

  return (
    <Box sx={{ mt: 10, px: { xs: 2, md: 4 }, pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>Find your next property</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>Narrow the market by location, budget, size, and lifestyle.</Typography>
      <Paper component="section" elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><TextField fullWidth label="City" value={filters.city} onChange={(event) => updateFilter("city", event.target.value)} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth><InputLabel>Property type</InputLabel><Select label="Property type" value={filters.propertyType} onChange={(event) => updateFilter("propertyType", event.target.value)}><MenuItem value="">Any type</MenuItem>{propertyTypes.map((propertyType) => <MenuItem key={propertyType} value={propertyType}>{propertyType}</MenuItem>)}</Select></FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField fullWidth label="BHK" type="number" slotProps={{ htmlInput: { min: 0, step: 1 } }} value={filters.bhk} onChange={(event) => updateFilter("bhk", event.target.value)} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}><TextField fullWidth label="Amenities" placeholder="Gym, parking" value={filters.amenities} onChange={(event) => updateFilter("amenities", event.target.value)} /></Grid>
          <Grid size={{ xs: 12, md: 2 }}><Button fullWidth variant="outlined" onClick={() => setFilters(initialFilters)} sx={{ height: "100%" }}>Reset filters</Button></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label="Min price" type="number" value={filters.minPrice} onChange={(event) => updateFilter("minPrice", event.target.value)} /></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label="Max price" type="number" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} /></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label="Min sqft" type="number" value={filters.minSqft} onChange={(event) => updateFilter("minSqft", event.target.value)} /></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><TextField fullWidth label="Max sqft" type="number" value={filters.maxSqft} onChange={(event) => updateFilter("maxSqft", event.target.value)} /></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><FormControl fullWidth><InputLabel>Sort by</InputLabel><Select label="Sort by" value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value as SortBy)}><MenuItem value="price">Price</MenuItem><MenuItem value="sqft">Area</MenuItem><MenuItem value="title">Title</MenuItem></Select></FormControl></Grid>
          <Grid size={{ xs: 6, sm: 3 }}><FormControl fullWidth><InputLabel>Order</InputLabel><Select label="Order" value={filters.sortOrder} onChange={(event) => updateFilter("sortOrder", event.target.value as SortOrder)}><MenuItem value="asc">Low to high</MenuItem><MenuItem value="desc">High to low</MenuItem></Select></FormControl></Grid>
        </Grid>
      </Paper>
      <PropertyMap properties={filteredProperties} />
      <Typography sx={{ mt: 3, mb: 2 }} color="text.secondary">{filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found</Typography>
      {filteredProperties.length === 0 ? <Typography>No properties match these filters.</Typography> : <Grid container spacing={3}>{filteredProperties.map((property) => <Grid key={property._id} size={{ xs: 12, sm: 6, md: 4 }}><PropertyCardItem property={property} saved={savedPropertyIds.has(property._id)} onRemoved={(propertyId) => setSavedPropertyIds((current) => { const next = new Set(current); next.delete(propertyId); return next; })} /></Grid>)}</Grid>}
    </Box>
  );
}

function filterProperties(properties: Property[], filters: Filters) {
  const city = filters.city.trim().toLowerCase();
  const amenities = filters.amenities.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  const minPrice = toNumber(filters.minPrice);
  const maxPrice = toNumber(filters.maxPrice);
  const minSqft = toNumber(filters.minSqft);
  const maxSqft = toNumber(filters.maxSqft);
  const bhk = toNumber(filters.bhk);

  return properties.filter((property) => {
    const propertyCity = (property.city ?? property.location ?? "").toLowerCase();
    const propertyAmenities = (property.amenities ?? []).map((item) => item.toLowerCase());
    return (!city || propertyCity.includes(city)) && (!filters.propertyType || property.propertyType === filters.propertyType) && (bhk === undefined || property.bhk === bhk) && (minPrice === undefined || property.price >= minPrice) && (maxPrice === undefined || property.price <= maxPrice) && (minSqft === undefined || (property.sqft ?? property.area ?? 0) >= minSqft) && (maxSqft === undefined || (property.sqft ?? property.area ?? 0) <= maxSqft) && amenities.every((required) => propertyAmenities.some((available) => available.includes(required)));
  }).sort((first, second) => {
    const firstValue = filters.sortBy === "title" ? first.title.toLowerCase() : filters.sortBy === "sqft" ? (first.sqft ?? first.area ?? 0) : first.price;
    const secondValue = filters.sortBy === "title" ? second.title.toLowerCase() : filters.sortBy === "sqft" ? (second.sqft ?? second.area ?? 0) : second.price;
    const comparison = firstValue < secondValue ? -1 : firstValue > secondValue ? 1 : 0;
    return filters.sortOrder === "asc" ? comparison : -comparison;
  });
}

function toNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function PropertyMap({ properties }: { properties: Property[] }) {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function setupMap() {
      const leaflet = await import("leaflet");
      if (cancelled || !mapElement.current || map.current) return;
      map.current = leaflet.map(mapElement.current).setView([20.5937, 78.9629], 5);
      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(map.current);
      markers.current = leaflet.layerGroup().addTo(map.current);
      refreshMarkers(leaflet, map.current, markers.current, properties);
    }
    setupMap();
    return () => { cancelled = true; map.current?.remove(); map.current = null; markers.current = null; };
  }, []);

  useEffect(() => {
    async function updateMap() {
      if (!map.current || !markers.current) return;
      refreshMarkers(await import("leaflet"), map.current, markers.current, properties);
    }
    updateMap();
  }, [properties]);

  return <Box ref={mapElement} sx={{ height: { xs: 280, md: 380 }, width: "100%", borderRadius: 1, overflow: "hidden", bgcolor: "#e8eef0" }} />;
}

function refreshMarkers(
  leaflet: typeof import("leaflet"),
  map: LeafletMap | null,
  markers: LayerGroup | null,
  properties: Property[],
) {
  if (!map || !markers) return;
  markers.clearLayers();
  const points = properties.flatMap((property) => {
    const latitude = property.latitude ?? property.lat;
    const longitude = property.longitude ?? property.lng;
    return latitude !== undefined && longitude !== undefined ? [{ property, latitude, longitude }] : [];
  });
  points.forEach(({ property, latitude, longitude }) => leaflet.marker([latitude, longitude]).bindPopup(`<strong>${property.title}</strong><br />₹${property.price.toLocaleString("en-IN")}`).addTo(markers));
  if (points.length === 1) map.setView([points[0].latitude, points[0].longitude], 13);
  if (points.length > 1) map.fitBounds(points.map((point) => [point.latitude, point.longitude] as [number, number]), { padding: [24, 24] });
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
    if (!item.propertyId) return [];
    return [typeof item.propertyId === "string" ? item.propertyId : item.propertyId._id];
  });
}