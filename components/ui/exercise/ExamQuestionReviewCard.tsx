"use client";

import React from "react";
import clsx from "clsx";
import type { AnswerLabel, ExamResultResponse } from "@/lib/services/exercise.service";

type ReviewItem = NonNullable<ExamResultResponse["review"]>[number];

export default function ExamQuestionReviewCard({
  review,
  questionNumber,
}: {
  review: ReviewItem;
  questionNumber: number;
}) {
  const correctLabel = review.correctLabel;
  const selectedLabel = review.selectedLabel;
  const answers = review.answers || [];

  return (
    <div
      className={clsx(
        "bg-white border-2 rounded-xl p-6 transition-all",
        review.correct ? "border-green-200" : "border-red-200"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={clsx(
              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
              review.correct ? "bg-green-500 text-white" : "bg-red-500 text-white"
            )}
          >
            {questionNumber}
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-gray-900 leading-relaxed">
              {review.title || `Câu ${questionNumber}`}
            </div>
            {review.content && (
              <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                {review.content}
              </div>
            )}
            {review.audioUrl && (
              <div className="mt-4">
                <audio controls src={review.audioUrl} className="w-full" />
              </div>
            )}
          </div>
        </div>

        <div className="text-right text-sm flex-shrink-0">
          <div className="text-gray-600">
            Bạn chọn:{" "}
            <span className={clsx("font-bold", review.correct ? "text-green-700" : "text-red-700")}>
              {selectedLabel || "—"}
            </span>
          </div>
          <div className="text-gray-600 mt-1">
            Đáp án đúng:{" "}
            <span className="font-bold text-green-700">{correctLabel || "—"}</span>
          </div>
        </div>
      </div>

      {answers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {answers.map((a) => {
            const label = a.label as AnswerLabel;
            const isCorrect = label === correctLabel;
            const isSelected = label === selectedLabel;
            return (
              <div
                key={label}
                className={clsx(
                  "p-4 rounded-xl border-2",
                  isCorrect
                    ? "border-green-500 bg-green-50"
                    : isSelected
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={clsx(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0",
                      isCorrect
                        ? "bg-green-500 text-white"
                        : isSelected
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {label}
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed">{a.content}</div>
                </div>
                <div className="mt-2 text-xs font-semibold">
                  {isCorrect && <span className="text-green-700">✓ Đúng</span>}
                  {!isCorrect && isSelected && <span className="text-red-700">✗ Bạn chọn</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


