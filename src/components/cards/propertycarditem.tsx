"use client";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import Link from "next/link";
import { useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { removeSavedProperty, saveProperty } from "@/services/propertyService";
import type { Property } from "@/types/property";

interface PropertyCardItemProps {
  property: Property;
  detail?: boolean;
  showStatus?: boolean;
  hideActions?: boolean;
  href?: string;
  saved?: boolean;
  onRemoved?: (propertyId: string) => void;
}

export default function PropertyCardItem({
  property,
  detail = false,
  showStatus = false,
  hideActions = false,
  href,
  saved = false,
  onRemoved,
}: PropertyCardItemProps) {
  const images = property.images.filter(Boolean);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [isSaved, setIsSaved] = useState(saved);
  const [saving, setSaving] = useState(false);

  return (
    <Card
      component={href ? Link : "div"}
      href={href}
      sx={href ? { textDecoration: "none", color: "inherit" } : undefined}
    >
      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", scrollSnapType: "x mandatory" }}>
        {images.length > 0 ? images.map((image, index) => (
          <Box
            key={`${image}-${index}`}
            sx={{ minWidth: "100%", height: detail ? 320 : 200, position: "relative", scrollSnapAlign: "start" }}
          >
            {failedImages.has(index) ? (
              <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1, color: "text.secondary" }}>
                <BrokenImageOutlinedIcon fontSize="large" />
              </Box>
            ) : (
              <CardMedia
                component="img"
                image={image}
                alt={`${property.title} image ${index + 1}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={() => setFailedImages((current) => new Set(current).add(index))}
              />
            )}
          </Box>
        )) : (
          <Box sx={{ minWidth: "100%", height: detail ? 320 : 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1, color: "text.secondary" }}>
            <BrokenImageOutlinedIcon fontSize="large" />
            <Typography>No image available</Typography>
          </Box>
        )}
      </Box>
      <CardContent>
        <Typography variant={detail ? "h4" : "h6"}>{property.title}</Typography>
        <Typography>₹{property.price.toLocaleString("en-IN")}</Typography>
        {detail && getPropertyLocation(property) && (
          <Typography color="text.secondary">{getPropertyLocation(property)}</Typography>
        )}
        {(detail || showStatus) && property.status && <Typography sx={{ mt: 1 }}>Status: {property.status}</Typography>}
        {detail && property.description && <Typography sx={{ mt: 1 }}>{property.description}</Typography>}
        {!detail && !hideActions && (
          <>
            <Button
              startIcon={<ChatBubbleOutlineOutlinedIcon />}
              sx={{ bgcolor: "#1976D2", color: "white", px: 2, marginRight: 5, mt: 1, borderRadius: 3 }}
            >
              Contact Owner
            </Button>
            <Button
              disabled={saving}
              onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                setSaving(true);
                try {
                  if (isSaved) {
                    await removeSavedProperty(property._id);
                    setIsSaved(false);
                    onRemoved?.(property._id);
                  } else {
                    await saveProperty(property._id);
                    setIsSaved(true);
                  }
                } finally {
                  setSaving(false);
                }
              }}
              sx={{ bgcolor: isSaved ? "#b71c1c" : "#f5276c", color: "#faf7f8", px: 2, mt: 1, borderRadius: 6 }}
            >
              {isSaved ? "Saved" : "Fav"} <FavoriteIcon sx={{ ml: 0.5 }} />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function getPropertyLocation(property: Property) {
  return property.location ??
    [property.address, property.area, property.city].filter(Boolean).join(", ");
}
