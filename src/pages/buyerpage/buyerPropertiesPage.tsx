"use client";

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
import {
  getPropertyLocation,
  propertyTypes,
  SortBy,
  SortOrder,
  usePropertySearch,
} from "@/hooks/usePropertySearch";
import PropertyMap from "@/components/properties/PropertyMap";
import PropertyCard from "@/components/cards/resuablepropertycard";

export default function PropertyPropertyPage() {
  const {
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    filteredProperties,
    savedPropertyIds,
    toggleSavedProperty,
  } = usePropertySearch();

  if (loading) {
    return <Typography sx={{ mt: 10, px: 3 }}>Loading properties...</Typography>;
  }
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 10, mx: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 10, px: { xs: 2, md: 4 }, pb: 5 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Find your next property
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Narrow the market by location, budget, size, and lifestyle.
      </Typography>

      <Paper component="section" elevation={2} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField fullWidth label="City" value={filters.city} onChange={(e) => updateFilter("city", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Property type</InputLabel>
              <Select label="Property type" value={filters.propertyType} onChange={(e) => updateFilter("propertyType", e.target.value)}>
                <MenuItem value="">Any type</MenuItem>
                {propertyTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField fullWidth label="BHK" type="number" slotProps={{ htmlInput: { min: 0, step: 1 } }} value={filters.bhk} onChange={(e) => updateFilter("bhk", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField fullWidth label="Amenities" placeholder="Gym, parking" value={filters.amenities} onChange={(e) => updateFilter("amenities", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button fullWidth variant="outlined" onClick={resetFilters} sx={{ height: "100%" }}>
              Reset filters
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth label="Min price" type="number" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth label="Max price" type="number" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth label="Min sqft" type="number" value={filters.minSqft} onChange={(e) => updateFilter("minSqft", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField fullWidth label="Max sqft" type="number" value={filters.maxSqft} onChange={(e) => updateFilter("maxSqft", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select label="Sort by" value={filters.sortBy} onChange={(e) => updateFilter("sortBy", e.target.value as SortBy)}>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="sqft">Area</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select label="Order" value={filters.sortOrder} onChange={(e) => updateFilter("sortOrder", e.target.value as SortOrder)}>
                <MenuItem value="asc">Low to high</MenuItem>
                <MenuItem value="desc">High to low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Typography sx={{ mb: 2 }} color="text.secondary">
        {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          height: { md: "calc(100vh - 320px)" },
          minHeight: { md: 500 },
        }}
      >
        {/* Left half: property cards, scrollable */}
        <Box sx={{ width: { xs: "100%", md: "50%" }, overflowY: { md: "auto" }, pr: { md: 1 } }}>
          {filteredProperties.length === 0 ? (
            <Typography>No properties match these filters.</Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredProperties.map((property) => (
                <Grid key={property._id} size={{ xs: 12, sm: 6 }}>
                  <PropertyCard
  title={property.title}
  price={property.price}
  location={getPropertyLocation(property)}
  images={property.images}
  bhk={property.bhk}
  sqft={property.sqft ?? property.area}
  propertyType={property.propertyType}
  description={property.description}
  city={property.city}
  locality={property.locality}
  address={property.fullAddress ?? property.address}
  amenities={property.amenities}
  latitude={property.latitude ?? property.lat}
  longitude={property.longitude ?? property.lng}
  saved={savedPropertyIds.has(property._id)}
  onFavorite={() => toggleSavedProperty(property._id)}
/>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: 380, md: "100%" },
            position: { md: "sticky" },
            top: { md: 96 },
          }}
        >
          <PropertyMap properties={filteredProperties} />
        </Box>
      </Box>
    </Box>
  );
}