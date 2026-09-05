 import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

const data = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    title: "Luxury Modern Villa",
    price: 8500000,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    title: "Beautiful 3 BHK Apartment",
    price: 6200000,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    title: "Spacious Family Home",
    price: 7500000,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
    title: "Premium City Apartment",
    price: 5800000,
  },
];
export default function PropertyCard() {
  return (
    <>
      <Grid container spacing={3} sx={{ mt: 10, px: 3 }}>
        {data.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography>₹{item.price.toLocaleString("en-IN")}</Typography>
                <Button
                  startIcon={<ChatBubbleOutlineOutlinedIcon />}
                  sx={{
                    bgcolor: "#1976D2",
                    color: "white",
                    px: 2,
                    marginRight: 5,
                    mt:1,
                    borderRadius:3
                  }}
                >
                  Contact Owner
                </Button>
                <Button
                  sx={{
                    bgcolor: "#f5276c",
                    color: "#faf7f8",
                    px: 2,
                    mt:1,
                    borderRadius: 6,
                  }}
                >
                  Fav <FavoriteIcon sx={{ ml: 0.5 }} />
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
