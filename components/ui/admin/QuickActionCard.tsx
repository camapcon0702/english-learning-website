"use client";

import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: "orange" | "blue" | "green" | "purple" | "pink";
  className?: string;
}

const colorClasses = {
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100/50",
    border: "border-orange-200/50",
    icon: "bg-orange-500 text-white",
    hover: "hover:from-orange-100 hover:to-orange-200/50 hover:border-orange-300",
    text: "text-orange-700",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    border: "border-blue-200/50",
    icon: "bg-blue-500 text-white",
    hover: "hover:from-blue-100 hover:to-blue-200/50 hover:border-blue-300",
    text: "text-blue-700",
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-100/50",
    border: "border-green-200/50",
    icon: "bg-green-500 text-white",
    hover: "hover:from-green-100 hover:to-green-200/50 hover:border-green-300",
    text: "text-green-700",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100/50",
    border: "border-purple-200/50",
    icon: "bg-purple-500 text-white",
    hover: "hover:from-purple-100 hover:to-purple-200/50 hover:border-purple-300",
    text: "text-purple-700",
  },
  pink: {
    bg: "bg-gradient-to-br from-pink-50 to-pink-100/50",
    border: "border-pink-200/50",
    icon: "bg-pink-500 text-white",
    hover: "hover:from-pink-100 hover:to-pink-200/50 hover:border-pink-300",
    text: "text-pink-700",
  },
};

export default function QuickActionCard({
  title,
  description,
  icon,
  href,
  color = "orange",
  className,
}: QuickActionCardProps) {
  const router = useRouter();
  const colors = colorClasses[color];

  const handleClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "group w-full text-left rounded-xl p-5 border shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:-translate-y-1",
        colors.bg,
        colors.border,
        colors.hover,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={clsx(
            "flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0",
            "transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            colors.icon
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={clsx("font-bold text-base mb-1", colors.text)}>
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          <div className="mt-3 flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className={colors.text}>Xem chi tiết</span>
            <svg
              className={clsx("w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform", colors.text)}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

