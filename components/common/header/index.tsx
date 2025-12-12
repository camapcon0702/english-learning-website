"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dropdown, type MenuProps } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { User } from "@/types/auth.types";

interface HeaderProps {
  className?: string;
}

export function Header({
  className,
}: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
    }
  }, []);

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

  const router = useRouter();

  return (
    <header
      className={`fixed px-20 top-0 left-0 w-full z-[999] bg-orange-400 flex items-center py-3 text-white shadow-lg ${className || ""}`}
    >
      <div className="flex items-center gap-3 min-w-0 pl-6">
          <>
            <div className="w-9 h-9" aria-hidden>
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
                <rect width="48" height="48" rx="10" fill="#027CFF" />
                <path d="M14 26h8v8h-8zM26 14h8v8h-8z" fill="#fff" opacity="0.95" />
              </svg>
            </div>
            <div className="text-lg font-bold text-white ml-2.5">
              Học tiếng anh
            </div>
          </>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4 mr-8">
        {!user ? (
          <button
            className="bg-amber-500 text-white font-bold border-none rounded-lg px-5 py-2.5 text-[15px] cursor-pointer transition-all hover:bg-amber-600 active:scale-95 shadow-md"
            onClick={() => router.push("/auth/login")}
          >
            Đăng nhập/Đăng ký
          </button>
        ) : (
          <Dropdown menu={{ items: userMenu }} trigger={["click"]} placement="bottomRight">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 bg-[#027CFF] text-[#ffffff] rounded-full font-bold text-xl flex items-center justify-center" aria-hidden>
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.name} avatar`}
                    draggable={false}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold">{initials}</span>
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="font-bold">{user.name}</div>
                <div className="text-xs text-yellow-200">{user.role ?? "Người dùng"}</div>
              </div>
            </div>
          </Dropdown>
        )}
      </div>
    </header>
  );
}