export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

export interface Property {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  image?: string | string[];
  images?: string | string[];
  price: number;
  status?: PropertyStatus | null;
  ownerId?: string | number;
  owner?: { _id?: string };
}

export function getPrimaryImage(image?: string | string[]) {
  return Array.isArray(image) ? image[0] : image;
}