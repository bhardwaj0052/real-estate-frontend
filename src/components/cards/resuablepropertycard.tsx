"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { getUserById } from "@/services/userService";

const CONTACT_UNLOCK_SECONDS = 10;

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
  ownerId?: string | number;
  ownerPhone?: string;
  saved?: boolean;
  onFavorite?: () => void;
}

function buildWhatsAppLink(ownerPhone: string, title: string) {
  const digitsOnly = ownerPhone.replace(/\D/g, "");
  const message = `Hi, I'm interested in this property: ${title}. Can you share more details?`;
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
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
  ownerId,
  ownerPhone,
  saved = false,
  onFavorite,
}: PropertyCardProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CONTACT_UNLOCK_SECONDS);
  const [fetchedOwnerPhone, setFetchedOwnerPhone] = useState("");
  const [isSaved, setIsSaved] = useState(saved);
  const availableImages = images.filter(Boolean);
  const image = availableImages[activeImage] ?? "";
  const contactPhone = ownerPhone || fetchedOwnerPhone;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSaved(saved);
  }, [saved]);

  useEffect(() => {
    if (!ownerId || ownerPhone) return;

    getUserById<{ phone?: string; user?: { phone?: string } }>(String(ownerId))
      .then((owner) =>
        setFetchedOwnerPhone(owner.phone ?? owner.user?.phone ?? ""),
      )
      .catch(() => setFetchedOwnerPhone(""));
  }, [ownerId, ownerPhone]);

  const showPrevious = () => {
    setActiveImage((current) => (current === 0 ? availableImages.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveImage((current) => (current + 1) % availableImages.length);
  };

  useEffect(() => {
    if (!detailsOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSecondsLeft(CONTACT_UNLOCK_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [detailsOpen]);

  const contactReady = secondsLeft === 0;

  return (
    <>
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
            aria-label={isSaved ? "Remove from favourites" : "Save property"}
            onClick={() => {
              setIsSaved((current) => !current);
              onFavorite?.();
            }}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "white",
              "&:hover": { bgcolor: "white" },
            }}
          >
            {isSaved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
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

          <Button
            fullWidth
            variant="contained"
            onClick={() => setDetailsOpen(true)}
            sx={{ mt: 2.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Buy now
          </Button>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {title}
          <IconButton onClick={() => setDetailsOpen(false)} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {image && (
            <Box component="img" src={image} alt={title} sx={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 2, mb: 2 }} />
          )}

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            ₹{price.toLocaleString("en-IN")}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1, color: "text.secondary" }}>
            <LocationOnOutlinedIcon fontSize="small" />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {location}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2.5, mt: 1.5, color: "text.secondary" }}>
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

          <Divider sx={{ mt: 2.5, mb: 2 }} />

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {contactReady
              ? "Ready to move ahead? Message the owner directly and they can walk you through everything."
              : `Reading the details... you can contact the owner in ${secondsLeft}s.`}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<WhatsAppIcon />}
            disabled={!contactReady}
            onClick={async () => {
              let phone = contactPhone;
              if (!phone && ownerId) {
                try {
                  const owner = await getUserById<{
                    phone?: string;
                    user?: { phone?: string };
                  }>(String(ownerId));
                  phone = owner.phone ?? owner.user?.phone ?? "";
                  setFetchedOwnerPhone(phone);
                } catch {
                  phone = "";
                }
              }
              if (!phone) return;
              window.open(buildWhatsAppLink(phone, title), "_blank", "noopener,noreferrer");
            }}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {contactReady ? "Contact owner" : `Contact owner (${secondsLeft}s)`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}