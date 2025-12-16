"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ExerciseSet } from "@/data/exerciseData";

export interface ExerciseCardProps {
  exercise: ExerciseSet;
  className?: string;
}

export default function ExerciseCard({ exercise, className }: ExerciseCardProps) {
  const levelColors = {
    beginner: "bg-green-100 text-green-700 border-green-200",
    intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
    advanced: "bg-red-100 text-red-700 border-red-200",
  };

  const levelLabels = {
    beginner: "Cơ bản",
    intermediate: "Trung bình",
    advanced: "Nâng cao",
  };

  return (
    <Link href={`/exercise/${exercise.id}`}>
      <div
        className={clsx(
          "group bg-white border-2 border-gray-200 rounded-xl p-6",
          "hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer",
          "active:scale-[0.98]",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              {exercise.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {exercise.description}
            </p>
          </div>
          <ArrowForwardIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm">
                {exercise.totalQuestions}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Câu hỏi</p>
              <p className="text-sm font-semibold text-gray-900">
                {exercise.totalPoints} điểm
              </p>
            </div>
          </div>

          {exercise.timeLimit && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <AccessTimeIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Thời gian</p>
                <p className="text-sm font-semibold text-gray-900">
                  {exercise.timeLimit} phút
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span
            className={clsx(
              "px-3 py-1 text-xs font-semibold rounded-full border",
              levelColors[exercise.level]
            )}
          >
            {levelLabels[exercise.level]}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {exercise.topic}
          </span>
        </div>
      </div>
    </Link>
  );
}

