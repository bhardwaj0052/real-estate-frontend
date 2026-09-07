import axios from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  role: string;
}

export interface AuthUser {
  accessToken: string;
  role: string;
  userId?: string;
  name?: string;
  email?: string;
}

const BASE_URL = "http://localhost:3000";

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/login`, credentials);

  if (typeof window !== "undefined") {
    window.localStorage.setItem("access_token", response.data.access_token);
    window.localStorage.setItem("role", response.data.role);
  }

  return response.data;
}

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = window.localStorage.getItem("access_token");
  const role = window.localStorage.getItem("role");

  if (!accessToken || !role) {
    return null;
  }

  const claims = decodeToken(accessToken);

  return {
    accessToken,
    role,
    userId: claims?.sub ?? claims?.id,
    name: claims?.name,
    email: claims?.email,
  };
}

function decodeToken(token: string): Record<string, string> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("role");
}
