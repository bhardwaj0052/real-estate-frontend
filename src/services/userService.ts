import axios from "axios";

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: "BUYER" | "OWNER" | "ADMIN";
}
const BASE_URL = "http://localhost:3000";

export async function createUser(user: CreateUserRequest) {
  const response = await axios.post(`${BASE_URL}/users`, user);
  return response.data;
}