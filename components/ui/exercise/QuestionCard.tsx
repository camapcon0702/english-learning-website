"use client";

import React from "react";
import clsx from "clsx";
import { Question } from "@/data/exerciseData";

export interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: string | number | null;
  onAnswerChange: (answer: string | number) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerChange,
  showResult = false,
  isCorrect = false,
}: QuestionCardProps) {
  const handleAnswerChange = (answer: string | number) => {
    onAnswerChange(answer);
  };

  return (
    <div
      className={clsx(
        "bg-white border-2 rounded-lg p-6 transition-all",
        showResult
          ? isCorrect
            ? "border-green-300 bg-green-50/30"
            : "border-red-300 bg-red-50/30"
          : "border-gray-200 hover:border-orange-200"
      )}
    >
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className={clsx(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
            showResult
              ? isCorrect
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
              : "bg-orange-100 text-orange-700"
          )}
        >
          {questionNumber}
        </div>
        <div className="flex-1">
          <p className="text-base font-medium text-gray-900 leading-relaxed">
            {question.question}
          </p>
          {showResult && question.explanation && (
            <div
              className={clsx(
                "mt-3 p-3 rounded-lg text-sm",
                isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}
            >
              <strong>Giải thích:</strong> {question.explanation}
            </div>
          )}
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-2">
        {question.type === "multiple-choice" && question.options && (
          <>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = question.correctAnswer === index;
              const showCorrect = showResult && isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(index)}
                  disabled={showResult}
                  className={clsx(
                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                    "hover:border-orange-300 hover:bg-orange-50",
                    showResult
                      ? isCorrectAnswer
                        ? "border-green-500 bg-green-50"
                        : isSelected && !isCorrectAnswer
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                      : isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white",
                    showResult && "cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        showResult && isCorrectAnswer
                          ? "border-green-500 bg-green-500"
                          : isSelected && !isCorrectAnswer
                          ? "border-red-500 bg-red-500"
                          : isSelected
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      )}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                      {showCorrect && !isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={clsx(
                        "text-base",
                        showResult && isCorrectAnswer
                          ? "font-semibold text-green-700"
                          : isSelected && !isCorrectAnswer
                          ? "font-semibold text-red-700"
                          : "text-gray-700"
                      )}
                    >
                      {option}
                    </span>
                    {showCorrect && (
                      <span className="ml-auto text-green-600 font-semibold text-sm">
                        ✓ Đúng
                      </span>
                    )}
                    {isSelected && !isCorrectAnswer && showResult && (
                      <span className="ml-auto text-red-600 font-semibold text-sm">
                        ✗ Sai
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </>
        )}

        {question.type === "true-false" && question.options && (
          <>
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = question.correctAnswer === index;
              const showCorrect = showResult && isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(index)}
                  disabled={showResult}
                  className={clsx(
                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                    "hover:border-orange-300 hover:bg-orange-50",
                    showResult
                      ? isCorrectAnswer
                        ? "border-green-500 bg-green-50"
                        : isSelected && !isCorrectAnswer
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                      : isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white",
                    showResult && "cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        showResult && isCorrectAnswer
                          ? "border-green-500 bg-green-500"
                          : isSelected && !isCorrectAnswer
                          ? "border-red-500 bg-red-500"
                          : isSelected
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      )}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                      {showCorrect && !isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={clsx(
                        "text-base",
                        showResult && isCorrectAnswer
                          ? "font-semibold text-green-700"
                          : isSelected && !isCorrectAnswer
                          ? "font-semibold text-red-700"
                          : "text-gray-700"
                      )}
                    >
                      {option}
                    </span>
                    {showCorrect && (
                      <span className="ml-auto text-green-600 font-semibold text-sm">
                        ✓ Đúng
                      </span>
                    )}
                    {isSelected && !isCorrectAnswer && showResult && (
                      <span className="ml-auto text-red-600 font-semibold text-sm">
                        ✗ Sai
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </>
        )}

        {question.type === "fill-blank" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = question.correctAnswer === option;
              const showCorrect = showResult && isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerChange(option)}
                  disabled={showResult}
                  className={clsx(
                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                    "hover:border-orange-300 hover:bg-orange-50",
                    showResult
                      ? isCorrectAnswer
                        ? "border-green-500 bg-green-50"
                        : isSelected && !isCorrectAnswer
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                      : isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white",
                    showResult && "cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        showResult && isCorrectAnswer
                          ? "border-green-500 bg-green-500"
                          : isSelected && !isCorrectAnswer
                          ? "border-red-500 bg-red-500"
                          : isSelected
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-300"
                      )}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                      {showCorrect && !isSelected && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      className={clsx(
                        "text-base",
                        showResult && isCorrectAnswer
                          ? "font-semibold text-green-700"
                          : isSelected && !isCorrectAnswer
                          ? "font-semibold text-red-700"
                          : "text-gray-700"
                      )}
                    >
                      {option}
                    </span>
                    {showCorrect && (
                      <span className="ml-auto text-green-600 font-semibold text-sm">
                        ✓ Đúng
                      </span>
                    )}
                    {isSelected && !isCorrectAnswer && showResult && (
                      <span className="ml-auto text-red-600 font-semibold text-sm">
                        ✗ Sai
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

