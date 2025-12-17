export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface Grammar {
  id: string;
  name: string;
  description?: string;
  content: string;
}

export interface GrammarDTO {
  name: string;
  description?: string;
  content: string;
}


