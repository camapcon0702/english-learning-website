"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigationItems = [
  { label: "Trang chủ", icon: "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f3e0.png", path: "/" },
  { label: "Ngữ pháp", icon: "./images/icon_grammar.png", path: "/grammar/library" },
  { label: "Bài tập", icon: "./images/icon_exercise.png", path: "/exercise" },
  { label: "Mini Game", icon: "./images/icon_minigame.png", path: "/minigame" },
  { label: "Flash Card", icon: "./images/icon_flashcard.png", path: "/flashcard" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-[60px] left-0 w-full z-[998] bg-orange-300 flex items-end justify-center gap-14 min-h-[100px] border-b-2 border-orange-400 px-3 shadow-lg">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.label}
              href={item.path}
              className="flex flex-col items-center relative min-w-[95px] h-[90px] justify-end cursor-pointer no-underline hover:transform hover:scale-105 transition-transform"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-10 h-10 mb-2 drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)]"
              />
              <span
                className={`text-[17px] font-semibold text-center mb-1.5 mt-0.5 transition-all ${
                  isActive
                    ? "text-orange-700 font-bold"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-t-full shadow-lg"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="h-[100px]"></div>
    </>
  );
}
