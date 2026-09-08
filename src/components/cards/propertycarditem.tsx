"use client";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import Link from "next/link";
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
  const images = property.images.filter(Boolean);
  const { brokenImage, isSaved, saving, setBrokenImage, toggleSave } =
    usePropertyCardItem(property._id, saved, onRemoved);

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
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": href
          ? { boxShadow: 4, transform: "translateY(-2px)" }
          : undefined,
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: detail ? 360 : 200,
          bgcolor: "grey.100",
        }}
      >
        {images.length > 0 && !brokenImage ? (
          <CardMedia
            component="img"
            image={images[0]}
            alt={property.title}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setBrokenImage(true)}
          />
        ) : (
          <Stack
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "text.secondary",
            }}
          >
            <BrokenImageOutlinedIcon fontSize="large" />
            <Typography variant="body2">No image available</Typography>
          </Stack>
        )}

        {(detail || showStatus) && property.status && (
          <Chip
            label={property.status}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "background.paper",
            }}
          />
        )}
      </Box>

      <CardContent>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant={detail ? "h5" : "h6"} sx={{ fontWeight: 600 }}>
              {property.title}
            </Typography>
            <Typography
              variant={detail ? "h6" : "body1"}
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              ₹{property.price.toLocaleString("en-IN")}
            </Typography>
          </Box>

          {!hideActions && (
            <IconButton
              onClick={toggleSave}
              disabled={saving}
              aria-label={isSaved ? "Remove from saved" : "Save property"}
            >
              {isSaved ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          )}
        </Stack>

        {getPropertyLocation(property) && (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {getPropertyLocation(property)}
          </Typography>
        )}

        {detail && property.description && (
          <Typography sx={{ mt: 2 }}>{property.description}</Typography>
        )}

        {detail && (
          <Stack spacing={1.25} sx={{ mt: 2 }}>
            {property.propertyType && (
              <Typography>
                <strong>Property type:</strong> {property.propertyType}
              </Typography>
            )}
            {property.bhk !== undefined && (
              <Typography>
                <strong>BHK:</strong> {property.bhk}
              </Typography>
            )}
            {(property.area !== undefined || property.sqft !== undefined) && (
              <Typography>
                <strong>Area:</strong> {property.area ?? property.sqft} sqft
              </Typography>
            )}
            {property.city && (
              <Typography>
                <strong>City:</strong> {property.city}
              </Typography>
            )}
            {property.locality && (
              <Typography>
                <strong>Locality:</strong> {property.locality}
              </Typography>
            )}
            {(property.fullAddress || property.address) && (
              <Typography>
                <strong>Address:</strong> {property.fullAddress ?? property.address}
              </Typography>
            )}
            {property.amenities && property.amenities.length > 0 && (
              <Typography>
                <strong>Amenities:</strong> {property.amenities.join(", ")}
              </Typography>
            )}
            {(property.latitude !== undefined || property.lat !== undefined) &&
              (property.longitude !== undefined || property.lng !== undefined) && (
                <Typography>
                  <strong>Coordinates:</strong> {property.latitude ?? property.lat},{" "}
                  {property.longitude ?? property.lng}
                </Typography>
              )}
          </Stack>
        )}

        {!detail && !hideActions && (
          <Button
            fullWidth
            startIcon={<ChatBubbleOutlineOutlinedIcon />}
            variant="outlined"
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Contact owner
          </Button>
        )}
      </CardContent>
    </Card>
  );
}