"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { getCurrentUserApi, CurrentUserResponse } from "@/lib/services/auth.service";
import { User } from "@/types/auth.types";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: authUser, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUserApi();
        if (response.status === 200 && response.data) {
          setUser(response.data);
        }
      } catch (err: any) {
        setError(err?.detail || err?.message || 'Không thể tải thông tin người dùng');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, router]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Chưa có thông tin';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Chưa có thông tin';
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl px-6 py-3 transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-12 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-4xl font-bold shadow-lg ring-4 ring-white/30">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{getInitials(user.fullName)}</span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <p className="text-orange-100 text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
          
          <div className="space-y-6">
            {/* Full Name */}
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Họ và tên
              </label>
              <p className="text-lg text-gray-900">{user.fullName}</p>
            </div>

            {/* Email */}
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Email
              </label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>

            {/* Role */}
            <div className="border-b border-gray-200 pb-6">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Vai trò
              </label>
              <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-semibold text-sm">
                {user.role}
              </span>
            </div>

            {/* Created At */}
            <div className="pb-6">
              <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                Ngày tham gia
              </label>
              <p className="text-lg text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl px-6 py-3 transition-all"
            >
              Quay lại trang chủ
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl"
            >
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

