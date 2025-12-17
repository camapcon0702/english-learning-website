"use client";

import React, { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import ScrambledWordGame from "@/components/ui/minigame/ScrambledWordGame";
import { startMiniGameApi } from "@/lib/services/minigame.service";
import type { MiniGamePlay } from "@/types/minigame.types";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const GAME_COUNTS = [5, 10, 15, 20];

function extractErrorText(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const rec = err as Record<string, unknown>;
  const detail = typeof rec.detail === "string" ? rec.detail : undefined;
  const message = typeof rec.message === "string" ? rec.message : undefined;
  return detail || message;
}

export default function MiniGamePage() {
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [games, setGames] = useState<MiniGamePlay[]>([]);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer
  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted]);

  const loadGames = useCallback(async (count: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await startMiniGameApi(count);
      const data = Array.isArray(res?.data) ? res.data : [];
      if (data.length === 0) {
        setError("Không có mini game nào trong hệ thống. Vui lòng liên hệ admin để thêm mini game.");
        setGames([]);
      } else {
        setGames(data);
        setError(null);
      }
    } catch (err: unknown) {
      const errorText = extractErrorText(err);
      setError(errorText || "Không thể tải mini game. Vui lòng thử lại sau.");
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStartGame = async () => {
    if (games.length === 0) {
      await loadGames(selectedCount);
      return;
    }
    setGameStarted(true);
    setCurrentGameIndex(0);
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
    if (currentGameIndex < games.length - 1) {
      setCurrentGameIndex((prev) => prev + 1);
    } else {
      // Game finished
      setGameStarted(false);
    }
  };

  const handleRestart = async () => {
    setGameStarted(false);
    setCurrentGameIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setTimeElapsed(0);
    // Reload games for new session
    await loadGames(selectedCount);
  };

  const handleChangeCount = async (count: number) => {
    setSelectedCount(count);
    setGameStarted(false);
    setCurrentGameIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setTimeElapsed(0);
    await loadGames(count);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentGame = games[currentGameIndex];
  const isGameFinished = gameStarted && currentGameIndex >= games.length;
  const accuracy = totalAnswered > 0 ? ((score / totalAnswered) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">Mini Game - Sắp Xếp Chữ Cái</h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          Sắp xếp các chữ cái đã xáo trộn để tạo thành từ vựng đúng. Rèn luyện kỹ năng đánh vần và từ vựng một cách
          thú vị!
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <ErrorOutlineIcon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-700 font-semibold mb-1">Lỗi</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => loadGames(selectedCount)}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            <RefreshIcon className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      {/* Count Selection & Start */}
      {!gameStarted && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chọn số lượng câu hỏi</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {GAME_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => handleChangeCount(count)}
                disabled={loading}
                className={clsx(
                  "px-6 py-3 rounded-lg font-medium transition-all",
                  selectedCount === count
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                {count} câu
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải mini game...</p>
            </div>
          ) : games.length > 0 ? (
            <div className="mt-6">
              <button
                onClick={handleStartGame}
                className="w-full px-8 py-4 bg-orange-500 text-white rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                Bắt đầu chơi ({games.length} câu)
              </button>
            </div>
          ) : (
            <div className="mt-6 text-center text-gray-500">
              {error ? (
                <p>Không thể tải mini game. Vui lòng thử lại.</p>
              ) : (
                <p>Chưa có mini game nào. Vui lòng chọn số lượng câu hỏi để tải.</p>
              )}
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
                  {currentGameIndex + 1} / {games.length}
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
              <p className="text-lg font-bold text-gray-900 font-mono">{formatTime(timeElapsed)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Game Area */}
      {gameStarted && !isGameFinished && currentGame && (
        <ScrambledWordGame game={currentGame} onComplete={handleComplete} onNext={handleNext} />
      )}

      {/* Game Finished */}
      {isGameFinished && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-8 text-center">
          <div className="mb-6">
            <EmojiEventsIcon className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thành!</h2>
            <p className="text-gray-600">Bạn đã hoàn thành tất cả {games.length} câu hỏi</p>
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
              <div className="text-3xl font-bold text-green-600 mb-1">{formatTime(timeElapsed)}</div>
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
                setGameStarted(false);
                setCurrentGameIndex(0);
                setScore(0);
                setTotalAnswered(0);
                setTimeElapsed(0);
              }}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Chọn số lượng khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
