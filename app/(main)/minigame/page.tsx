"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import WordPuzzleGame from "@/components/ui/minigame/WordPuzzleGame";
import { getAllPuzzles, getPuzzlesByLevel, WordPuzzle } from "@/data/miniGameData";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default function MiniGamePage() {
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | "all">("all");
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [puzzles, setPuzzles] = useState<WordPuzzle[]>([]);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Initialize puzzles based on selected level
  useEffect(() => {
    if (selectedLevel === "all") {
      setPuzzles(getAllPuzzles());
    } else {
      setPuzzles(getPuzzlesByLevel(selectedLevel));
    }
    setCurrentPuzzleIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setGameStarted(false);
    setTimeElapsed(0);
  }, [selectedLevel]);

  // Timer
  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted]);

  const handleStartGame = () => {
    if (puzzles.length === 0) return;
    setGameStarted(true);
    setCurrentPuzzleIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setTimeElapsed(0);
  };

  const handleComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setTotalAnswered((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex((prev) => prev + 1);
    } else {
      // Game finished
      setGameStarted(false);
    }
  };

  const handleRestart = () => {
    setGameStarted(false);
    setCurrentPuzzleIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const isGameFinished = gameStarted && currentPuzzleIndex >= puzzles.length;
  const accuracy = totalAnswered > 0 ? ((score / totalAnswered) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          Mini Game - Đoán Từ
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          Điền các chữ cái còn thiếu để hoàn thành từ vựng. 
          Rèn luyện kỹ năng đánh vần và từ vựng một cách thú vị!
        </p>
      </div>

      {/* Level Selection */}
      {!gameStarted && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Chọn cấp độ
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { value: "all", label: "Tất cả" },
              { value: "beginner", label: "Cơ bản" },
              { value: "intermediate", label: "Trung bình" },
              { value: "advanced", label: "Nâng cao" },
            ].map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedLevel(level.value as any)}
                className={clsx(
                  "px-6 py-3 rounded-lg font-medium transition-all",
                  selectedLevel === level.value
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {level.label}
              </button>
            ))}
          </div>

          {puzzles.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handleStartGame}
                className="w-full px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                Bắt đầu chơi ({puzzles.length} câu)
              </button>
            </div>
          )}

          {puzzles.length === 0 && (
            <div className="mt-6 text-center text-gray-500">
              Không có câu hỏi nào ở cấp độ này
            </div>
          )}
        </div>
      )}

      {/* Game Stats */}
      {gameStarted && !isGameFinished && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-500">Câu hỏi</p>
                <p className="text-lg font-bold text-gray-900">
                  {currentPuzzleIndex + 1} / {puzzles.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Điểm số</p>
                <p className="text-lg font-bold text-orange-600">{score}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Độ chính xác</p>
                <p className="text-lg font-bold text-gray-900">{accuracy}%</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Thời gian</p>
              <p className="text-lg font-bold text-gray-900 font-mono">
                {formatTime(timeElapsed)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Game Area */}
      {gameStarted && !isGameFinished && currentPuzzle && (
        <WordPuzzleGame
          puzzle={currentPuzzle}
          onComplete={handleComplete}
          onNext={handleNext}
        />
      )}

      {/* Game Finished */}
      {isGameFinished && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-8 text-center">
          <div className="mb-6">
            <EmojiEventsIcon className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Hoàn thành!
            </h2>
            <p className="text-gray-600">
              Bạn đã hoàn thành tất cả {puzzles.length} câu hỏi
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-1">{score}</div>
              <div className="text-sm text-gray-600">Điểm số</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">{accuracy}%</div>
              <div className="text-sm text-gray-600">Độ chính xác</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Thời gian</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <RestartAltIcon className="w-5 h-5" />
              Chơi lại
            </button>
            <button
              onClick={() => {
                setSelectedLevel("all");
                setGameStarted(false);
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Chọn cấp độ khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
