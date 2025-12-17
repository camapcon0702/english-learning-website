"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components";
import { useAuth } from "@/hooks/auth/useAuth";
import { getCurrentUserApi } from "@/lib/services/auth.service";

function isAdminRole(role?: string | null) {
  if (!role) return false;
  const normalized = role.trim().toUpperCase();
  return normalized === "ADMIN" || normalized === "ROLE_ADMIN";
}

function AccessDenied() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-20 px-6 pb-6 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
              ⛔
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Bạn không có quyền truy cập trang này
              </h1>
              <p className="mt-2 text-gray-600">
                Khu vực <span className="font-semibold">/admin</span> chỉ dành cho tài khoản có quyền{" "}
                <span className="font-semibold">Admin</span>.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                  Về trang chủ
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Đăng nhập tài khoản khác
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  const [checking, setChecking] = React.useState(true);
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      if (loading) return;

      // No token => definitely not allowed
      if (!token) {
        if (!cancelled) {
          setAllowed(false);
          setChecking(false);
        }
        return;
      }

      // Fast-path from cached user role (best-effort)
      if (isAdminRole(user?.role)) {
        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
        return;
      }

      // Verify with backend to avoid stale local role
      try {
        const res = await getCurrentUserApi();
        const ok = isAdminRole(res?.data?.role);
        if (!cancelled) {
          setAllowed(ok);
          setChecking(false);
        }
      } catch {
        if (!cancelled) {
          setAllowed(false);
          setChecking(false);
        }
      }
    }

    setChecking(true);
    checkAdmin();

    return () => {
      cancelled = true;
    };
  }, [loading, token, user?.role]);

  if (loading || checking) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 px-6 pb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
          </div>
        </div>
      </>
    );
  }

  if (!allowed) return <AccessDenied />;

  return <>{children}</>;
}


