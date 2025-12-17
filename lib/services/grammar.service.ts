import { API_CONFIG } from "@/lib/constants/app.constants";
import type { ApiResponse, Grammar, GrammarDTO } from "@/types/grammar.types";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

function authHeadersOrThrow() {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No authentication token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function request<T>(url: string, init: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, init);
    const data = await safeJson(res);

    if (!res.ok) {
      const err: ApiError = {
        status: res.status,
        message: data?.message || "Request failed",
        detail: data?.detail || data?.message || "An error occurred",
      };
      throw err;
    }

    return data as ApiResponse<T>;
  } catch (e: any) {
    if (e?.status) throw e;
    const err: ApiError = {
      status: 0,
      message: "Network error",
      detail: e?.message || "Unable to connect to the server",
    };
    throw err;
  }
}

/** Public-ish endpoints (still behind /api/** security in your backend) */
export async function getAllGrammarsApi(): Promise<ApiResponse<Grammar[]>> {
  return request(`${API_BASE_URL}/api/grammars`, {
    method: "GET",
    headers: authHeadersOrThrow(),
  });
}

export async function getGrammarByIdApi(id: string): Promise<ApiResponse<Grammar>> {
  return request(`${API_BASE_URL}/api/grammars/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: authHeadersOrThrow(),
  });
}

/** Admin endpoints */
export async function createGrammarApi(dto: GrammarDTO): Promise<ApiResponse<Grammar>> {
  return request(`${API_BASE_URL}/api/admin/grammars`, {
    method: "POST",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function updateGrammarApi(id: string, dto: GrammarDTO): Promise<ApiResponse<Grammar>> {
  return request(`${API_BASE_URL}/api/admin/grammars/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function deleteGrammarApi(id: string): Promise<ApiResponse<void>> {
  return request(`${API_BASE_URL}/api/admin/grammars/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeadersOrThrow(),
  });
}


