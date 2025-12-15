"use client";

import React from "react";
import clsx from "clsx";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  gradient?: "orange" | "blue" | "green" | "purple" | "pink";
  className?: string;
}

const gradientClasses = {
  orange: "from-orange-500 to-orange-600",
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  purple: "from-purple-500 to-purple-600",
  pink: "from-pink-500 to-pink-600",
};

const iconBgClasses = {
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  pink: "bg-pink-100 text-pink-600",
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  description,
  gradient = "orange",
  className,
}: StatCardProps) {
  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-2xl bg-white p-6",
        "border border-gray-200/80 shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {/* Gradient background decoration */}
      <div
        className={clsx(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10",
          "bg-gradient-to-br",
          gradientClasses[gradient],
          "transition-opacity duration-300 group-hover:opacity-20"
        )}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          </div>
          {icon && (
            <div
              className={clsx(
                "flex items-center justify-center w-12 h-12 rounded-xl",
                iconBgClasses[gradient],
                "transition-transform duration-300 group-hover:scale-110"
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Trend & Description */}
        {(trend || description) && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            {trend && (
              <div className="flex items-center gap-1.5">
                <span
                  className={clsx(
                    "text-sm font-semibold",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500">so với tháng trước</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

