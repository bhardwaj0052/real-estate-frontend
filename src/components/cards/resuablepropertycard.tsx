"use client";

import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";

interface PropertyCardProps {
  title: string;
  price: number;
  location: string;
  images: string[];
  bhk?: number;
  sqft?: number;
  propertyType?: string;
  description?: string;
  city?: string;
  locality?: string;
  address?: string;
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  saved?: boolean;
  onFavorite?: () => void;
}

export default function PropertyCard({
  title,
  price,
  location,
  images,
  bhk,
  sqft,
  propertyType,
  description,
  city,
  locality,
  address,
  amenities,
  latitude,
  longitude,
  saved = false,
  onFavorite,
}: PropertyCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const availableImages = images.filter(Boolean);
  const image = availableImages[activeImage] ?? "";

  const showPrevious = () => {
    setActiveImage((current) => (current === 0 ? availableImages.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveImage((current) => (current + 1) % availableImages.length);
  };

  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: 360,
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        overflow: "hidden",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {image ? (
          <Box component="img" src={image} alt={`${title} image ${activeImage + 1}`} sx={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} />
        ) : (
          <Box sx={{ height: 220, bgcolor: "#eef0f2", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
            No image available
          </Box>
        )}

        {availableImages.length > 1 && (
          <>
            <IconButton aria-label="Previous image" onClick={showPrevious} sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.9)", "&:hover": { bgcolor: "white" } }}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="Next image" onClick={showNext} sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.9)", "&:hover": { bgcolor: "white" } }}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
            <Box sx={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 0.5 }}>
              {availableImages.map((_, index) => <Box key={index} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: index === activeImage ? "white" : "rgba(255,255,255,0.55)" }} />)}
            </Box>
          </>
        )}

        <IconButton
          aria-label={saved ? "Remove from favourites" : "Save property"}
          onClick={onFavorite}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "white",
            "&:hover": { bgcolor: "white" },
          }}
        >
          {saved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        {propertyType && (
          <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
            {propertyType}
          </Typography>
        )}

        <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>
          ₹{price.toLocaleString("en-IN")}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1, color: "text.secondary" }}>
          <LocationOnOutlinedIcon fontSize="small" />
          <Typography variant="body2" noWrap sx={{ color: "text.secondary" }}>
            {location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2.5, mt: 2, color: "text.secondary" }}>
          {bhk !== undefined && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BedOutlinedIcon fontSize="small" />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {bhk} BHK
              </Typography>
            </Box>
          )}

          {sqft !== undefined && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <SquareFootOutlinedIcon fontSize="small" />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {sqft} sqft
              </Typography>
            </Box>
          )}
        </Box>

        {description && (
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            {description}
          </Typography>
        )}

        {(city || locality || address) && (
          <Box sx={{ mt: 2 }}>
            {city && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>City:</strong> {city}
              </Typography>
            )}
            {locality && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>Locality:</strong> {locality}
              </Typography>
            )}
            {address && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>Address:</strong> {address}
              </Typography>
            )}
          </Box>
        )}

        {amenities && amenities.length > 0 && (
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            <strong>Amenities:</strong> {amenities.join(", ")}
          </Typography>
        )}

        {latitude !== undefined && longitude !== undefined && (
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            <strong>Coordinates:</strong> {latitude}, {longitude}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}