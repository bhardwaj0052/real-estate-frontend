import axios from "axios";

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "BUYER" | "OWNER";
}

export interface UserResponse {
  phone?: string;
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

export async function createUser(user: CreateUserRequest) {
  const response = await axios.post(`${BASE_URL}/users`, user);
  return response.data;
}

export async function getUserById<T = UserResponse>(userId: string): Promise<T> {
  const response = await axios.get<T>(`${BASE_URL}/users/${userId}`, authConfig());
  return response.data;
}