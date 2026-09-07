import axios from "axios";

export interface CreatePropertyRequest {
  title: string;
  description: string;
  city: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  propertyType: string;
  bhk: number;
  sqft: number;
  amenities: string[];
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

export async function getApprovedProperties<T>(): Promise<T> {
  const response = await axios.get<T>(
    `${BASE_URL}/properties/approved`,
    authConfig(),
  );
  console.log(response)
  return response.data;
}

export async function saveProperty<T>(propertyId: string): Promise<T> {
  const response = await axios.post<T>(
    `${BASE_URL}/saved-properties/${propertyId}`,
    undefined,
    authConfig(),
  );
  return response.data;
}

export async function getSavedProperties<T>(): Promise<T> {
  const response = await axios.get<T>(
    `${BASE_URL}/saved-properties`,
    authConfig(),
  );
  return response.data;
}

export async function removeSavedProperty<T>(propertyId: string): Promise<T> {
  const response = await axios.delete<T>(
    `${BASE_URL}/saved-properties/${propertyId}`,
    authConfig(),
  );
  return response.data;
}

export async function getProperty<T>(id: string): Promise<T> {
  const response = await axios.get<T>(
    `${BASE_URL}/properties/${id}`,
    authConfig(),
  );
  return response.data;
}

export async function deleteProperty(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/properties/${id}`, authConfig());
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