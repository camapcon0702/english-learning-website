"use client";

import React from "react";
import clsx from "clsx";
import type { AnswerLabel, ExamViewResponse } from "@/lib/services/exercise.service";

export default function ExamQuestionCard({
  question,
  questionNumber,
  selectedLabel,
  onSelect,
  disabled = false,
}: {
  question: ExamViewResponse["questions"][number];
  questionNumber: number;
  selectedLabel?: AnswerLabel | null;
  onSelect: (label: AnswerLabel) => void;
  disabled?: boolean;
}) {
  const hasAudio = !!question.audioUrl;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-200 transition-all">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center">
          {questionNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-gray-900 leading-relaxed">
            {question.title}
          </div>
          <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">
            {question.content}
          </div>

          {hasAudio && (
            <div className="mt-4">
              <audio controls src={question.audioUrl || undefined} className="w-full" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {question.answers.map((a) => {
          const isSelected = selectedLabel === a.label;
          return (
            <button
              key={a.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(a.label)}
              className={clsx(
                "w-full text-left p-4 rounded-xl border-2 transition-all",
                disabled ? "cursor-not-allowed" : "hover:border-orange-300 hover:bg-orange-50",
                isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    "flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center font-bold text-xs",
                    isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 text-gray-700"
                  )}
                >
                  {a.label}
                </div>
                <div className="text-sm text-gray-800 leading-relaxed">{a.content}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


