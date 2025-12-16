"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export interface Topic {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  vocabularyCount: number;
  level: "beginner" | "intermediate" | "advanced";
}

export interface TopicCardProps {
  topic: Topic;
  className?: string;
}

export default function TopicCard({ topic, className }: TopicCardProps) {
  return (
    <Link href={`/flashcard/${topic.id}`}>
      <div
        className={clsx(
          "group relative h-full bg-white rounded-2xl border-2 border-gray-200 overflow-hidden",
          "transition-all duration-300 cursor-pointer",
          "hover:shadow-2xl hover:-translate-y-2 hover:border-orange-300",
          "active:scale-[0.98]",
          className
        )}
      >
        {/* Gradient Background */}
        <div
          className={clsx(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            `bg-gradient-to-br ${topic.gradientFrom} ${topic.gradientTo}`
          )}
        />

        {/* Content */}
        <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
          {/* Icon and Count */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={clsx(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                "bg-gradient-to-br shadow-lg",
                topic.gradientFrom,
                topic.gradientTo,
                "group-hover:scale-110 transition-transform duration-300"
              )}
            >
              {topic.icon}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors">
                {topic.vocabularyCount}
              </div>
              <div className="text-xs text-gray-500 group-hover:text-white/80 transition-colors">
                từ vựng
              </div>
            </div>
          </div>

          {/* Topic Name */}
          <div className="mb-3">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-white transition-colors mb-1">
              {topic.name}
            </h3>
            <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors italic">
              {topic.nameEn}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors flex-1 mb-4 leading-relaxed">
            {topic.description}
          </p>

          {/* Level Badge */}
          <div className="flex items-center justify-between">
            <span
              className={clsx(
                "px-3 py-1 text-xs font-semibold rounded-full border",
                topic.level === "beginner" &&
                  "bg-green-100 text-green-700 border-green-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30",
                topic.level === "intermediate" &&
                  "bg-yellow-100 text-yellow-700 border-yellow-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30",
                topic.level === "advanced" &&
                  "bg-red-100 text-red-700 border-red-200 group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30",
                "transition-all duration-300"
              )}
            >
              {topic.level === "beginner" && "Cơ bản"}
              {topic.level === "intermediate" && "Trung bình"}
              {topic.level === "advanced" && "Nâng cao"}
            </span>

            {/* Arrow Icon */}
            <div className="flex items-center gap-2 text-orange-500 group-hover:text-white transition-colors">
              <span className="text-sm font-medium hidden sm:inline">Xem thêm</span>
              <ArrowForwardIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-300" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 group-hover:bg-white/10 transition-all duration-300" />
      </div>
    </Link>
  );
}

