"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

interface LoginFormProps {
    onSuccess?: () => void;
    hideFooter?: boolean;
}

export default function LoginForm({ onSuccess, hideFooter = false }: LoginFormProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const [err, setErr] = useState<string | null>(null);

    const isAdminRole = (role?: string) => {
        const r = (role || "").toUpperCase();
        return r === "ROLE_ADMIN" || r === "ADMIN";
    };

    useEffect(() => {
        const savedUser = localStorage.getItem("newUser");
        if (savedUser) {
            setEmail(savedUser);
        }
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const userData = await login(email, password);
            localStorage.removeItem("newUser");
            if (isAdminRole(userData?.role)) {
                onSuccess?.();
                router.push("/admin");
                return;
            }
            if (onSuccess) onSuccess();
            else router.push("/");
        } catch (error: any) {
            setErr(error?.detail || error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
        } finally {
            setLoading(false);
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
                <label className="block font-semibold text-gray-900 mb-2 text-sm" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all bg-white shadow-sm hover:border-gray-400"
                    placeholder="Nhập email của bạn..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
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
                className="w-full h-12 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                aria-busy={loading}
            >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            {/* Footer */}
            {!hideFooter && (
                <div className="text-center mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link href="/register" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors">
                        Đăng ký ngay
                    </Link>
                </div>
            )}
        </form>
    );
}