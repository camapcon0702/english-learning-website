"use client";

import { useState } from "react";
import Link from "next/link";

import {
    validateUsername,
    validateEmail,
    validatePhone,
    validatePassword,
    validateFullname,
} from "@/lib/regex";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
    onSuccess?: () => void;
    hideFooter?: boolean;
}

export default function RegisterForm({ onSuccess, hideFooter = false }: RegisterFormProps) {
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
    });

    const [errors, setErrors] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirm: "",
    });

    const [respErrors, setRespErrors] = useState<Record<string, string[]> | null>(null);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleBlur = (field: string) => {
        let msg = "";

        if (field === "username") msg = validateUsername(form.username);
        if (field === "email") msg = validateEmail(form.email);
        if (field === "phone") msg = validatePhone(form.phone);
        if (field === "password") msg = validatePassword(form.password);
        if (field === "fullname") msg = validateFullname(form.fullname);

        if (field === "confirm") {
            msg = form.confirm !== form.password
                ? "Mật khẩu xác nhận không khớp."
                : "";
        }

        setErrors((prev) => ({ ...prev, [field]: msg }));
    };

    const validateAll = () => {
        const newErrors = {
            fullname: validateFullname(form.fullname),
            username: validateUsername(form.username),
            email: validateEmail(form.email),
            phone: validatePhone(form.phone),
            password: validatePassword(form.password),
            confirm:
                form.confirm !== form.password
                    ? "Mật khẩu xác nhận không khớp."
                    : "",
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((e) => e === "");
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validateAll()) return;

        setLoading(true);

        try {
            await register(form.username, form.password, form.email, form.fullname);
            alert("Đăng ký thành công");
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/login');
            }
        } catch (err: any) {
            const respErr = {
                fullname: "",
                username: err.username,
                email: err.email,
                phone: err.phone_number,
                password: err.password,
                confirm:
                form.confirm !== form.password
                    ? "Mật khẩu xác nhận không khớp."
                    : "",
            };
            setErrors(respErr);
        }

        setLoading(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-2">

                {/* Họ tên */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input
                        type="text"
                        required
                        value={form.fullname}
                        onChange={(e) => handleChange("fullname", e.target.value)}
                        onBlur={() => handleBlur("fullname")}
                        className={`w-full px-4 py-2 rounded-xl border outline-none transition
                                ${errors.fullname ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Họ và tên..."
                    />
                    {errors.fullname && (
                        <p className="text-red-600 text-sm mt-1">{errors.fullname}</p>
                    )}
                </div>

                {/* Username */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">
                        Tên đăng nhập
                    </label>
                    <input
                        type="text"
                        value={form.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        onBlur={() => handleBlur("username")}
                        className={`w-full px-4 py-2 rounded-xl border outline-none transition
                                ${errors.username ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Tên đăng nhập..."
                    />
                    {errors.username && (
                        <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="text"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={`w-full px-4 py-2 rounded-xl border outline-none transition
                                ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        placeholder="you@example.com"
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">
                        Số điện thoại
                    </label>
                    <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        className={`w-full px-4 py-2 rounded-xl border outline-none transition
                                ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                        placeholder="0123456789"
                    />
                    {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                        className={`w-full px-4 py-2 rounded-xl border outline-none transition
                                ${errors.password ? "border-red-500" : "border-gray-300"}`}
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Confirm password */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        value={form.confirm}
                        onChange={(e) => handleChange("confirm", e.target.value)}
                        onBlur={() => handleBlur("confirm")}
                        className={`w-full px-4 py-2 rounded-xl border outline-none transition
                                ${errors.confirm ? "border-red-500" : "border-gray-300"}`}
                        placeholder="••••••••"
                    />
                    {errors.confirm && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirm}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full mt-4 h-10 bg-gradient-to-r from-orange-500 to-orange-400 
                                    text-white rounded-xl font-semibold shadow-lg 
                                    hover:shadow-xl hover:-translate-y-0.5 transition"
                >
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>
            </form>

            {!hideFooter && (
                <div className="text-center mt-4 text-sm text-gray-500">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors">
                        Đăng nhập
                    </Link>
                </div>
            )}
        </>
    );
}
