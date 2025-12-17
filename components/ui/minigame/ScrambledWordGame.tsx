"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { MiniGamePlay } from "@/types/minigame.types";

export interface ScrambledWordGameProps {
  game: MiniGamePlay;
  onComplete: (isCorrect: boolean) => void;
  onNext: () => void;
}

export default function ScrambledWordGame({
  game,
  onComplete,
  onNext,
}: ScrambledWordGameProps) {
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize letters when game changes
  useEffect(() => {
    setAvailableLetters([...game.scrambledLetters]);
    setSelectedLetters([]);
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsSubmitting(false);
  }, [game]);

  const handleLetterClick = (index: number, fromAvailable: boolean) => {
    if (isSubmitted || isSubmitting) return;

    if (fromAvailable) {
      // Move from available to selected
      const letter = availableLetters[index];
      setAvailableLetters((prev) => prev.filter((_, i) => i !== index));
      setSelectedLetters((prev) => [...prev, letter]);
    } else {
      // Move from selected back to available
      const letter = selectedLetters[index];
      setSelectedLetters((prev) => prev.filter((_, i) => i !== index));
      setAvailableLetters((prev) => [...prev, letter]);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted || isSubmitting || selectedLetters.length === 0) return;

    const userAnswer = selectedLetters.join("").toLowerCase();
    setIsSubmitting(true);

    try {
      const { submitMiniGameAnswerApi } = await import("@/lib/services/minigame.service");
      const res = await submitMiniGameAnswerApi(game.id, userAnswer);
      const correct = res.data === true;

      setIsCorrect(correct);
      setIsSubmitted(true);
      setIsSubmitting(false);
      onComplete(correct);
    } catch (err) {
      console.error("Error submitting answer:", err);
      setIsSubmitting(false);
      // Still mark as submitted but show error
      setIsSubmitted(true);
      setIsCorrect(false);
      onComplete(false);
    }
  };

  const handleClear = () => {
    if (isSubmitted || isSubmitting) return;
    setAvailableLetters([...game.scrambledLetters]);
    setSelectedLetters([]);
  };

  const allLettersUsed = selectedLetters.length === game.scrambledLetters.length;

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
      {/* Hint */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Gợi ý:</p>
          <p className="text-lg font-medium text-gray-700">{game.suggest}</p>
        </div>
      </div>

      {/* Selected Letters (Answer Area) */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Sắp xếp các chữ cái:</p>
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-[80px] p-4 bg-orange-50 rounded-xl border-2 border-dashed border-orange-300">
          {selectedLetters.length === 0 ? (
            <p className="text-gray-400 text-sm">Chọn chữ cái từ bên dưới để tạo từ</p>
          ) : (
            selectedLetters.map((letter, index) => (
              <button
                key={`selected-${index}`}
                onClick={() => handleLetterClick(index, false)}
                disabled={isSubmitted || isSubmitting}
                className={clsx(
                  "w-14 h-14 text-2xl font-bold rounded-lg border-2 transition-all",
                  "hover:scale-105 active:scale-95",
                  isSubmitted
                    ? isCorrect
                      ? "bg-green-100 border-green-500 text-green-700 cursor-default"
                      : "bg-red-100 border-red-500 text-red-700 cursor-default"
                    : "bg-white border-orange-400 text-gray-900 hover:border-orange-500 hover:shadow-md",
                  (isSubmitted || isSubmitting) && "cursor-not-allowed"
                )}
              >
                {letter.toUpperCase()}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Available Letters */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Chữ cái có sẵn:</p>
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-[80px] p-4 bg-gray-50 rounded-xl">
          {availableLetters.length === 0 ? (
            <p className="text-gray-400 text-sm">Đã sử dụng hết chữ cái</p>
          ) : (
            availableLetters.map((letter, index) => (
              <button
                key={`available-${index}`}
                onClick={() => handleLetterClick(index, true)}
                disabled={isSubmitted || isSubmitting}
                className={clsx(
                  "w-14 h-14 text-2xl font-bold rounded-lg border-2 transition-all",
                  "bg-white border-gray-300 text-gray-900",
                  "hover:border-orange-400 hover:bg-orange-50 hover:shadow-md hover:scale-105 active:scale-95",
                  (isSubmitted || isSubmitting) && "cursor-not-allowed opacity-50"
                )}
              >
                {letter.toUpperCase()}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Result */}
      {isSubmitted && (
        <div
          className={clsx(
            "p-4 rounded-lg mb-4 text-center",
            isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"
          )}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <span className="text-lg font-bold text-green-700">Chính xác!</span>
              </>
            ) : (
              <>
                <CancelIcon className="w-6 h-6 text-red-600" />
                <span className="text-lg font-bold text-red-700">Sai rồi! Hãy thử lại</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        {!isSubmitted ? (
          <>
            <button
              onClick={handleClear}
              disabled={selectedLetters.length === 0 || isSubmitting}
              className={clsx(
                "px-6 py-3 rounded-lg font-semibold transition-all",
                selectedLetters.length === 0 || isSubmitting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Xóa
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allLettersUsed || isSubmitting}
              className={clsx(
                "px-8 py-3 rounded-lg font-semibold transition-all",
                allLettersUsed && !isSubmitting
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {isSubmitting ? "Đang kiểm tra..." : "Kiểm tra"}
            </button>
          </>
        ) : (
          <button
            onClick={onNext}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
          >
            Câu tiếp theo
          </button>
        )}
      </div>
    </div>
  );
}
