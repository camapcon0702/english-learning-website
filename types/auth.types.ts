export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt?: string;
    avatarUrl?: string;
}