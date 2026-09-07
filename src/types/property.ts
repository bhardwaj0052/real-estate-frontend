export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

export interface Property {
  _id: string;
  title: string;
  description?: string;
  propertyType?: "Apartment" | "Villa" | "Independent House" | "Plot" | "Commercial" | string;
  bhk?: number;
  area?: number;
  location?: string;
  city?: string;
  locality?: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  lat?: number;
  lng?: number;
  sqft?: number;
  amenities?: string[];
  images: string[];
  price: number;
  status?: PropertyStatus | null;
  ownerId?: string | number;
  owner?: { _id?: string };
}
