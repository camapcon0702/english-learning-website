import { API_CONFIG } from "@/lib/constants/app.constants";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

export type TestType = "LISTENING" | "READING";

export type AnswerLabel = "A" | "B" | "C" | "D";

export interface AnswerDTO {
  label: AnswerLabel;
  content: string;
  correct: boolean;
}

export interface QuestionDTO {
  title: string;
  type: TestType;
  content: string;
  audioUrl?: string;
  answers: AnswerDTO[];
}

export interface QuestionResponse {
  id: string;
  title: string;
  type: TestType;
  content: string;
  audioUrl?: string;
  answers: Array<{
    label: AnswerLabel;
    content: string;
    correct?: boolean;
  }>;
}

export interface ExamDTO {
  title: string;
  description?: string;
  type: TestType;
  duration: number;
  questionIds: string[];
}

export interface ExamRandomDTO {
  title: string;
  description?: string;
  type: TestType;
  duration: number;
  count: number;
}

export interface ExamResponse {
  id: string;
  title: string;
  description?: string;
  type: TestType;
  duration: number;
  questions?: Array<{
    id: string;
    title: string;
    type: TestType;
    content: string;
    audioUrl?: string;
    answers?: Array<{ label: string; content: string }>;
  }>;
}

export interface ExamViewResponse {
  id: string;
  title: string;
  description?: string;
  type: TestType;
  duration: number;
  questions: Array<{
    id: string;
    title: string;
    type: TestType;
    content: string;
    audioUrl?: string;
    answers: Array<{ label: AnswerLabel; content: string }>;
  }>;
}

export interface ExamSubmitDTO {
  examId: string;
  answers: Array<{ questionId: string; selectedLabel: AnswerLabel }>;
}

export interface ExamResultResponse {
  examId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}

function authHeadersOrThrow() {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function publicHeaders() {
  return {
    "Content-Type": "application/json",
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

/** ===== Questions (Admin) ===== */
export async function adminGetAllQuestionsApi(): Promise<ApiResponse<QuestionResponse[]>> {
  return request(`${API_BASE_URL}/api/admin/questions`, {
    method: "GET",
    headers: authHeadersOrThrow(),
  });
}

export async function adminCreateQuestionApi(dto: QuestionDTO): Promise<ApiResponse<QuestionResponse>> {
  return request(`${API_BASE_URL}/api/admin/questions`, {
    method: "POST",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function adminUpdateQuestionApi(
  id: string,
  dto: QuestionDTO
): Promise<ApiResponse<QuestionResponse>> {
  return request(`${API_BASE_URL}/api/admin/questions/${id}`, {
    method: "PUT",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function adminDeleteQuestionApi(id: string): Promise<ApiResponse<void>> {
  return request(`${API_BASE_URL}/api/admin/questions/${id}`, {
    method: "DELETE",
    headers: authHeadersOrThrow(),
  });
}

/** ===== Exams (Admin) ===== */
export async function adminGetAllExamsApi(): Promise<ApiResponse<ExamResponse[]>> {
  return request(`${API_BASE_URL}/api/admin/exams`, {
    method: "GET",
    headers: authHeadersOrThrow(),
  });
}

export async function adminCreateManualExamApi(dto: ExamDTO): Promise<ApiResponse<ExamResponse>> {
  return request(`${API_BASE_URL}/api/admin/exams/manual`, {
    method: "POST",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function adminCreateRandomExamApi(dto: ExamRandomDTO): Promise<ApiResponse<ExamResponse>> {
  return request(`${API_BASE_URL}/api/admin/exams/random`, {
    method: "POST",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function adminUpdateExamApi(id: string, dto: ExamDTO): Promise<ApiResponse<ExamResponse>> {
  return request(`${API_BASE_URL}/api/admin/exams/${id}`, {
    method: "PUT",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function adminDeleteExamApi(id: string): Promise<ApiResponse<void>> {
  return request(`${API_BASE_URL}/api/admin/exams/${id}`, {
    method: "DELETE",
    headers: authHeadersOrThrow(),
  });
}

/** ===== Exams (User) ===== */
export async function getExamsByTypeApi(type: TestType): Promise<ApiResponse<ExamResponse[]>> {
  return request(`${API_BASE_URL}/api/exams/type?type=${encodeURIComponent(type)}`, {
    method: "GET",
    headers: authHeadersOptional(),
  });
}

export async function startExamApi(id: string): Promise<ApiResponse<ExamViewResponse>> {
  return request(`${API_BASE_URL}/api/exams/${encodeURIComponent(id)}/start`, {
    method: "GET",
    headers: authHeadersOrThrow(),
  });
}

export async function getExamByIdApi(id: string): Promise<ApiResponse<ExamResponse>> {
  return request(`${API_BASE_URL}/api/exams/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: authHeadersOptional(),
  });
}

export async function submitExamApi(dto: ExamSubmitDTO): Promise<ApiResponse<ExamResultResponse>> {
  return request(`${API_BASE_URL}/api/exams/submit`, {
    method: "POST",
    headers: authHeadersOrThrow(),
    body: JSON.stringify(dto),
  });
}

export async function getMyExamResultsApi(): Promise<ApiResponse<ExamResultResponse[]>> {
  return request(`${API_BASE_URL}/api/exams/result`, {
    method: "GET",
    headers: authHeadersOrThrow(),
  });
}


