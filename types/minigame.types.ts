export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Spring LocalDateTime can be serialized as ISO string or as an array of numbers
export type LocalDateTimeLike = string | number[] | null;

export interface MiniGame {
  id: string;
  word: string;
  suggest: string;
  createdAt?: LocalDateTimeLike;
}

export interface MiniGameDTO {
  word: string;
  suggest: string;
}

export interface MiniGamePlay {
  id: string;
  scrambledLetters: string[];
  suggest: string;
}

