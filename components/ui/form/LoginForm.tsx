"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

export default function LoginForm() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { login } = useAuth();
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("newUser");
        if (savedUser) {
            setUsername(savedUser);
        }
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        try {
            await login(username, password);
            router.push('/');
            localStorage.removeItem("newUser");
        } catch (error: any) {
            setErr(error?.detail || 'Login failed');
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-5" aria-describedby="login-error">
            {err && (
                <div id="login-error" role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded">
                    {err}
                </div>
            )}

            <div>
                <label className="block font-medium text-gray-700 mb-1" htmlFor="username">
                    Tên đăng nhập
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                    placeholder="Tên đăng nhập..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    autoComplete="username"
                />
            </div>

            <div>
                <label className="block font-medium text-gray-700 mb-1" htmlFor="password">
                    Mật khẩu
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    minLength={6}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    Ghi nhớ đăng nhập
                </label>
                <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Quên mật khẩu?
                </Link>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
                aria-busy={loading}
            >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            {/* Footer */}
            <div className="text-center mt-6 text-sm text-gray-500">
                Chưa có tài khoản?{" "}
                <Link href="/auth/register" className="text-indigo-600 font-semibold hover:underline">
                    Đăng ký ngay
                </Link>
            </div>
        </form>
    );
}