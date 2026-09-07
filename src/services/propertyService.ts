import axios from "axios";

export interface CreatePropertyRequest {
  title: string;
  description: string;
  location: string;
  images: string[];
  price: number;
}

export interface PropertyStatusUpdate {
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}
const BASE_URL = "http://localhost:3000";

function authConfig() {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("access_token")
      : null;

  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export async function getProperties<T>(): Promise<T> {
  const response = await axios.get<T>(`${BASE_URL}/properties`, authConfig());
  return response.data;
}

export async function getProperty<T>(id: string): Promise<T> {
  const response = await axios.get<T>(
    `${BASE_URL}/properties/${id}`,
    authConfig(),
  );
  return response.data;
}

export async function updatePropertyStatus<T>(
  id: string,
  update: PropertyStatusUpdate,
): Promise<T> {
  const response = await axios.patch<T>(
    `${BASE_URL}/properties/${id}/status`,
    update,
    authConfig(),
  );
  return response.data;
}

export async function createProperty<T>(
  property: CreatePropertyRequest,
): Promise<T> {
  const response = await axios.post<T>(
    `${BASE_URL}/properties`,
    property,
    authConfig(),
  );
  return response.data;
}