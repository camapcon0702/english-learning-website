"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { WordPuzzle, generatePuzzleDisplay } from "@/data/miniGameData";

export interface WordPuzzleGameProps {
  puzzle: WordPuzzle;
  onComplete: (isCorrect: boolean) => void;
  onNext: () => void;
}

export default function WordPuzzleGame({
  puzzle,
  onComplete,
  onNext,
}: WordPuzzleGameProps) {
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Initialize user input with empty strings for each blank
  useEffect(() => {
    setUserInput(new Array(puzzle.blanks.length).fill(""));
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [puzzle]);

  const handleInputChange = (index: number, value: string) => {
    if (isSubmitted) return;
    
    // Only allow single letter
    const letter = value.slice(-1).toLowerCase();
    if (letter.match(/[a-z]/) || value === "") {
      const newInput = [...userInput];
      newInput[index] = letter;
      setUserInput(newInput);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && userInput[index] === "" && index > 0) {
      // Move to previous input on backspace
      const prevInput = document.getElementById(`input-${index - 1}`);
      prevInput?.focus();
    } else if (e.key.match(/[a-z]/i) && userInput[index] !== "" && index < puzzle.blanks.length - 1) {
      // Move to next input when typing
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    const userAnswer = userInput.join("").toLowerCase();
    const correctAnswer = puzzle.blanks.map((i) => puzzle.word[i]).join("").toLowerCase();

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    onComplete(correct);
  };

  const handleNext = () => {
    onNext();
  };

  const allFilled = userInput.every((input) => input !== "");

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
      {/* Puzzle Display */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Gợi ý:</p>
          <p className="text-lg font-medium text-gray-700">{puzzle.hint}</p>
        </div>
        
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          {puzzle.word.split("").map((char, wordIndex) => {
            const blankIndex = puzzle.blanks.indexOf(wordIndex);
            const isBlank = blankIndex !== -1;

            if (isBlank) {
              const userChar = userInput[blankIndex] || "";
              const correctChar = puzzle.word[wordIndex];
              const isCharCorrect = userChar.toLowerCase() === correctChar.toLowerCase();

              return (
                <input
                  key={wordIndex}
                  id={`input-${blankIndex}`}
                  type="text"
                  maxLength={1}
                  value={userChar}
                  onChange={(e) => handleInputChange(blankIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(blankIndex, e)}
                  disabled={isSubmitted}
                  className={clsx(
                    "w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-orange-500",
                    isSubmitted
                      ? isCharCorrect
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-orange-300 bg-orange-50 text-gray-900",
                    isSubmitted && "cursor-not-allowed"
                  )}
                />
              );
            }

            return (
              <span
                key={wordIndex}
                className="w-12 h-14 flex items-center justify-center text-2xl font-bold text-gray-700 border-2 border-transparent"
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Result */}
        {isSubmitted && (
          <div
            className={clsx(
              "p-4 rounded-lg mb-4",
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
                  <span className="text-lg font-bold text-red-700">Sai rồi!</span>
                </>
              )}
            </div>
            {!isCorrect && (
              <p className="text-sm text-gray-600">
                Đáp án đúng: <span className="font-bold text-gray-900">{puzzle.word}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allFilled}
            className={clsx(
              "px-8 py-3 rounded-lg font-semibold transition-all",
              allFilled
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
          >
            Câu tiếp theo
          </button>
        )}
      </div>
    </div>
  );
}

