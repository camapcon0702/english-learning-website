import { API_CONFIG } from "@/lib/constants/app.constants";
import type { ApiResponse, MiniGame, MiniGameDTO, MiniGamePlay } from "@/types/minigame.types";

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

function authHeadersOptional() {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  } catch (e: unknown) {
    if (e && typeof e === "object" && "status" in e) throw e as ApiError;
    const err: ApiError = {
      status: 0,
      message: "Network error",
      detail:
        e && typeof e === "object" && "message" in e && typeof (e as Record<string, unknown>).message === "string"
          ? ((e as Record<string, unknown>).message as string)
          : "Unable to connect to the server",
    };
    throw err;
  }
}

/** ===== Admin endpoints ===== */
export async function adminGetAllMiniGamesApi(): Promise<ApiResponse<MiniGame[]>> {
  return request(`${API_BASE_URL}/api/admin/mini-games`, {
    method: "GET",
    headers: authHeadersOrThrow(),
  });
}

export async function adminGetMiniGameByIdApi(id: string): Promise<ApiResponse<MiniGame>> {
  return request(`${API_BASE_URL}/api/admin/mini-games/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: authHeadersOrThrow(),
  });
}

export async function adminCreateMiniGameApi(dto: MiniGameDTO): Promise<ApiResponse<MiniGame>> {
  return request(`${API_BASE_URL}/api/admin/mini-games`, {
    method: "POST",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function adminUpdateMiniGameApi(id: string, dto: MiniGameDTO): Promise<ApiResponse<MiniGame>> {
  return request(`${API_BASE_URL}/api/admin/mini-games/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function adminDeleteMiniGameApi(id: string): Promise<ApiResponse<void>> {
  return request(`${API_BASE_URL}/api/admin/mini-games/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeadersOrThrow(),
  });
}

/** ===== Player endpoints ===== */
export async function startMiniGameApi(count: number): Promise<ApiResponse<MiniGamePlay[]>> {
  return request(`${API_BASE_URL}/api/mini-games/start/${encodeURIComponent(count)}`, {
    method: "GET",
    headers: authHeadersOptional(),
  });
}

export async function submitMiniGameAnswerApi(id: string, answer: string): Promise<ApiResponse<boolean>> {
  return request(
    `${API_BASE_URL}/api/mini-games/${encodeURIComponent(id)}/submit?answer=${encodeURIComponent(answer)}`,
    {
      method: "POST",
      headers: authHeadersOptional(),
    }
  );
}

