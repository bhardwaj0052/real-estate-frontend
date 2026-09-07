export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

export interface Property {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  images: string[];
  price: number;
  status?: PropertyStatus | null;
  ownerId?: string | number;
  owner?: { _id?: string };
}
