"use client";

import React, { useMemo, useState } from "react";
import { Dropdown, type MenuProps } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/auth/useAuth";
import { User } from "@/types/auth.types";
import Link from "next/link";
import clsx from "clsx";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [user] = useState<User>({
    id: 1,
    name: "Nguyen Van A",
    role: "admin",
    avatarUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  });
  const { logout } = useAuth();

  const initials = useMemo(() => {
    if (!user?.name) return "A";
    const parts = user.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  async function onLogout() {
    logout();
  }

  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-[999] bg-white/95 backdrop-blur-md",
        "border-b border-gray-200/80",
        "shadow-sm",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 flex-shrink-0" aria-hidden>
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden
                className="drop-shadow-sm"
              >
                <rect width="48" height="48" rx="12" fill="url(#logoGradient)" />
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
                <path
                  d="M14 26h8v8h-8zM26 14h8v8h-8z"
                  fill="#fff"
                  opacity="0.95"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold text-gray-900 tracking-tight">
                English Learning
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">
                Học tiếng Anh hiệu quả
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {!user ? (
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl px-6 py-2.5 text-sm cursor-pointer transition-all hover:from-orange-600 hover:to-orange-700 active:scale-95 shadow-md hover:shadow-lg"
              >
                Đăng nhập
              </Link>
            ) : (
              <Dropdown
                menu={{ items: userMenu }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200 border border-transparent hover:border-gray-200">
                  <div
                    className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full font-semibold text-sm flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-orange-100"
                    aria-hidden
                  >
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatarUrl}
                        alt={`${user.name} avatar`}
                        draggable={false}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">{initials}</span>
                    )}
                  </div>
                  <div className="hidden xl:flex flex-col gap-0">
                    <div className="font-semibold text-sm text-gray-900 leading-tight">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 leading-tight">
                      {user.role ?? "Người dùng"}
                    </div>
                  </div>
                  <svg
                    className="hidden xl:block w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
