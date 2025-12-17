"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";

const navigationItems = [
  { 
    label: "Trang chủ", 
    Icon: HomeRoundedIcon,
    path: "/",
    description: "Dashboard chính"
  },
  { 
    label: "Ngữ pháp", 
    Icon: AutoStoriesRoundedIcon,
    path: "/grammar",
    description: "Học ngữ pháp"
  },
  { 
    label: "Bài tập", 
    Icon: AssignmentRoundedIcon,
    path: "/exercise",
    description: "Luyện tập"
  },
  { 
    label: "Mini Game", 
    Icon: SportsEsportsRoundedIcon,
    path: "/minigame",
    description: "Trò chơi"
  },
  { 
    label: "Flash Card", 
    Icon: StyleRoundedIcon,
    path: "/flashcard",
    description: "Học từ vựng"
  },
];

export function MainSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("main-sidebar-collapsed") === "true"
      : false
  );

  useEffect(() => {
    localStorage.setItem("main-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-5 left-4 z-[1000] p-2.5 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[997] transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        data-sidebar="main"
        data-collapsed={collapsed}
        className={clsx(
          "fixed left-0 top-20 bottom-0 bg-white/95 backdrop-blur-md border-r border-gray-200/80 overflow-y-auto z-[998] transition-all duration-300 ease-out shadow-lg lg:shadow-none",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-[70px] lg:px-2" : "lg:w-72 lg:px-6"
        )}
      >
        <div className={clsx("p-4 lg:p-0", collapsed && "lg:px-0")}>
          {/* Toggle button - only visible on desktop */}
          <button
            className={clsx(
              "hidden lg:flex sticky top-4 h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white/80 hover:bg-gray-50 transition-all mb-4 shadow-sm",
              collapsed ? "mx-auto" : "ml-auto mr-4"
            )}
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <MenuIcon className="text-gray-700" />
            ) : (
              <MenuOpenIcon className="text-gray-700" />
            )}
          </button>

          {/* Header - hidden when collapsed */}
          {!collapsed && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Menu chính
              </h2>
            </div>
          )}

          <nav className={clsx("space-y-2", collapsed && "lg:space-y-3")}>
            {navigationItems.map((item) => {
              const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
              const Icon = item.Icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={clsx(
                    "flex items-center rounded-xl transition-all duration-200 group relative",
                    "hover:scale-[1.02]",
                    collapsed 
                      ? "lg:justify-center lg:px-2 lg:py-3" 
                      : "gap-4 px-4 py-3.5",
                    isActive
                      ? "bg-gradient-to-r from-orange-50 to-orange-50/50 text-orange-700 shadow-sm border border-orange-200/50"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span
                    className={clsx(
                      "flex-shrink-0 transition-all duration-200 rounded-xl flex items-center justify-center",
                      "w-10 h-10",
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700 group-hover:bg-orange-50 group-hover:text-orange-700",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                    aria-hidden
                  >
                    <Icon className="text-[22px]" />
                  </span>
                  {!collapsed && (
                    <>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className={clsx(
                          "font-semibold text-sm leading-tight",
                          isActive ? "text-orange-700" : "text-gray-900"
                        )}>
                          {item.label}
                        </span>
                        <span className={clsx(
                          "text-xs mt-1 leading-tight",
                          isActive ? "text-orange-600" : "text-gray-500"
                        )}>
                          {item.description}
                        </span>
                      </div>
                      {isActive && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 shadow-sm"></div>
                      )}
                      {!isActive && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      )}
                    </>
                  )}
                  {collapsed && isActive && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 shadow-sm"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

