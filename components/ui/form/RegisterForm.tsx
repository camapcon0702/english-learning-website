"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    validateEmail,
    validatePassword,
    validateFullname,
} from "@/lib/regex";
import { useAuth } from "@/hooks/auth/useAuth";

interface RegisterFormProps {
    onSuccess?: () => void;
    hideFooter?: boolean;
}

export default function RegisterForm({ onSuccess, hideFooter = false }: RegisterFormProps) {
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [apiError, setApiError] = useState<string | null>(null);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
        if (apiError) {
            setApiError(null);
        }
    };

    const handleBlur = (field: string) => {
        let msg = "";

        if (field === "fullName") {
            msg = validateFullname(form.fullName);
        } else if (field === "email") {
            msg = validateEmail(form.email);
        } else if (field === "password") {
            msg = validatePassword(form.password);
        } else if (field === "confirmPassword") {
            if (form.confirmPassword !== form.password) {
                msg = "Mật khẩu xác nhận không khớp.";
            }
        }

        setErrors((prev) => ({ ...prev, [field]: msg }));
    };

    const validateAll = () => {
        const newErrors = {
            fullName: validateFullname(form.fullName),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
            confirmPassword:
                form.confirmPassword !== form.password
                    ? "Mật khẩu xác nhận không khớp."
                    : "",
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((e) => e === "");
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setApiError(null);

        if (!validateAll()) {
            return;
        }

        setLoading(true);

        try {
            await register(form.fullName, form.email, form.password, form.confirmPassword);
            
            // Registration successful - redirect to login
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/login');
            }
        } catch (err: any) {
            // Handle API errors
            const errorMessage = err?.detail || err?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            setApiError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6" aria-describedby="register-error">
                {apiError && (
                    <div id="register-error" role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl">
                        {apiError}
                    </div>
                )}

                {/* Full Name */}
                <div>
                    <label className="block font-semibold text-gray-900 mb-2 text-sm" htmlFor="fullName">
                        Họ và tên
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        onBlur={() => handleBlur("fullName")}
                        className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all bg-white shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-orange-500/20 ${
                            errors.fullName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                        }`}
                        placeholder="Nhập họ và tên của bạn..."
                        disabled={loading}
                        autoComplete="name"
                    />
                    {errors.fullName && (
                        <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block font-semibold text-gray-900 mb-2 text-sm" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all bg-white shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-orange-500/20 ${
                            errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                        }`}
                        placeholder="you@example.com"
                        disabled={loading}
                        autoComplete="email"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block font-semibold text-gray-900 mb-2 text-sm" htmlFor="password">
                        Mật khẩu
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                        className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all bg-white shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-orange-500/20 ${
                            errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                        }`}
                        placeholder="••••••••"
                        disabled={loading}
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block font-semibold text-gray-900 mb-2 text-sm" htmlFor="confirmPassword">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                        value={form.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                        className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all bg-white shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-orange-500/20 ${
                            errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                        }`}
                        placeholder="••••••••"
                        disabled={loading}
                        autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    aria-busy={loading}
                >
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
            </form>

            {!hideFooter && (
                <div className="text-center mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors">
                        Đăng nhập ngay
                    </Link>
                </div>
            )}
        </>
    );
}
