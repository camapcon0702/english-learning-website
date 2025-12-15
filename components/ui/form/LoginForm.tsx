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
        <form onSubmit={onSubmit} className="space-y-6" aria-describedby="login-error">
            {err && (
                <div id="login-error" role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl">
                    {err}
                </div>
            )}

            <div>
                <label className="block font-semibold text-gray-900 mb-2 text-sm" htmlFor="username">
                    Tên đăng nhập
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-white shadow-sm hover:border-gray-400"
                    placeholder="Nhập tên đăng nhập..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    autoComplete="username"
                />
            </div>

            <div>
                <label className="block font-semibold text-gray-900 mb-2 text-sm" htmlFor="password">
                    Mật khẩu
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    minLength={6}
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-white shadow-sm hover:border-gray-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                    Ghi nhớ đăng nhập
                </label>
                <Link href="/forgot-password" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                    Quên mật khẩu?
                </Link>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                aria-busy={loading}
            >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link href="/auth/register" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors">
                    Đăng ký ngay
                </Link>
            </div>
        </form>
    );
}