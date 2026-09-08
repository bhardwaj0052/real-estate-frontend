"use client";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";

import Link from "next/link";
import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import type { Property } from "@/types/property";

import {
  getPropertyLocation,
  usePropertyCardItem,
} from "@/hooks/usePropertyCardItem";

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
  const images = property.images?.filter(Boolean) ?? [];

  const {
    brokenImage,
    isSaved,
    saving,
    setBrokenImage,
    toggleSave,
  } = usePropertyCardItem(
    property._id,
    saved,
    onRemoved,
  );

  const [activeImage, setActiveImage] = useState(0);

  const image = images[activeImage] ?? "";

  const showPrevious = (
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setBrokenImage(false);

    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1,
    );
  };

  const showNext = (
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setBrokenImage(false);

    setActiveImage(
      (current) => (current + 1) % images.length,
    );
  };

  const location = getPropertyLocation(property);

  return (
    <Card
      component={href ? Link : "div"}
      href={href}
      sx={{
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        border: "1px solid",
        borderColor: "divider",
        transition:
          "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": href
          ? {
              boxShadow: 4,
              transform: "translateY(-2px)",
            }
          : undefined,
      }}
    >
      {/* Image */}
      <Box
        sx={{
          position: "relative",
          height: detail ? 250 : 200,
          bgcolor: "grey.100",
        }}
      >
        {images.length > 0 && !brokenImage ? (
          <CardMedia
            component="img"
            image={image}
            alt={property.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={() => setBrokenImage(true)}
          />
        ) : (
          <Stack
            sx={{
              position: "absolute",
              inset: 0,
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <BrokenImageOutlinedIcon fontSize="large" />

            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              No image available
            </Typography>
          </Stack>
        )}

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <IconButton
              aria-label="Previous image"
              onClick={showPrevious}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": {
                  bgcolor: "white",
                },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              aria-label="Next image"
              onClick={showNext}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.9)",
                "&:hover": {
                  bgcolor: "white",
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>

            <Box
              sx={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                px: 1.2,
                py: 0.4,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 600 }}
              >
                {activeImage + 1} / {images.length}
              </Typography>
            </Box>
          </>
        )}

        {/* Status */}
        {(detail || showStatus) &&
          property.status && (
            <Chip
              label={property.status}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bgcolor: "background.paper",
                fontWeight: 600,
              }}
            />
          )}
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant={detail ? "h5" : "h6"}
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              {property.title}
            </Typography>

            <Typography
              variant={detail ? "h6" : "body1"}
              sx={{
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              ₹{property.price.toLocaleString("en-IN")}
            </Typography>
          </Box>

          {!hideActions && (
            <IconButton
              onClick={toggleSave}
              disabled={saving}
              aria-label={
                isSaved
                  ? "Remove from saved"
                  : "Save property"
              }
              sx={{ flexShrink: 0 }}
            >
              {isSaved ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          )}
        </Box>

        {/* Location — shown only once */}
        {location && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: "text.secondary",
            }}
          >
            {location}
          </Typography>
        )}

        {/* Description */}
        {detail && property.description && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: "text.secondary",
              lineHeight: 1.6,
            }}
          >
            {property.description}
          </Typography>
        )}

        {/* Property Details */}
        {detail && (
          <Box
            sx={{
              mt: 2.5,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 1.5,
              }}
            >
              Property Details
            </Typography>

            <Stack spacing={1}>
              {property.propertyType && (
                <Typography variant="body2">
                  <strong>Property Type:</strong>{" "}
                  {property.propertyType}
                </Typography>
              )}

              {property.bhk !== undefined && (
                <Typography variant="body2">
                  <strong>BHK:</strong> {property.bhk}
                </Typography>
              )}

              {(property.area !== undefined ||
                property.sqft !== undefined) && (
                <Typography variant="body2">
                  <strong>Area:</strong>{" "}
                  {property.area ?? property.sqft} sqft
                </Typography>
              )}

              {property.amenities &&
                property.amenities.length > 0 && (
                  <Typography variant="body2">
                    <strong>Amenities:</strong>{" "}
                    {property.amenities.join(", ")}
                  </Typography>
                )}

              {(property.latitude !== undefined ||
                property.lat !== undefined) &&
                (property.longitude !== undefined ||
                  property.lng !== undefined) && (
                  <Typography variant="body2">
                    <strong>Coordinates:</strong>{" "}
                    {property.latitude ?? property.lat},{" "}
                    {property.longitude ??
                      property.lng}
                  </Typography>
                )}

              {(property.fullAddress ||
                property.address) && (
                <Typography variant="body2">
                  <strong>Address:</strong>{" "}
                  {property.fullAddress ??
                    property.address}
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* Contact Owner */}
        {!detail && !hideActions && (
          <Button
            fullWidth
            startIcon={
              <ChatBubbleOutlineOutlinedIcon />
            }
            variant="outlined"
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Contact owner
          </Button>
        )}
      </CardContent>
    </Card>
  );
}