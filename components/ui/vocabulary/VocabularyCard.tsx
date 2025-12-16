"use client";

import React, { useState } from "react";
import clsx from "clsx";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

export interface VocabularyItem {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  imageUrl?: string;
  topic?: string;
}

export interface VocabularyCardProps {
  vocabulary: VocabularyItem;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export default function VocabularyCard({
  vocabulary,
  onBookmark,
  isBookmarked = false,
}: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // Sử dụng Web Speech API để phát âm
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(vocabulary.word);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(vocabulary.id);
  };

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
    <div
      className="group relative h-full"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={clsx(
          "relative h-full bg-white rounded-xl border-2 transition-all duration-500 transform-gpu cursor-pointer",
          "hover:shadow-xl hover:-translate-y-1",
          isFlipped
            ? "border-orange-300 shadow-lg"
            : "border-gray-200 hover:border-orange-200"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front side */}
        <div
          className={clsx(
            "absolute inset-0 p-6 flex flex-col transition-opacity duration-500",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900 truncate">
                  {vocabulary.word}
                </h3>
                <button
                  onClick={handlePlayAudio}
                  className={clsx(
                    "flex-shrink-0 p-1.5 rounded-lg transition-all",
                    isPlaying
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                  )}
                  aria-label="Phát âm"
                >
                  <VolumeUpIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 italic">
                /{vocabulary.pronunciation}/
              </p>
            </div>
            <button
              onClick={handleBookmark}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu"}
            >
              {isBookmarked ? (
                <BookmarkIcon className="w-5 h-5 text-orange-500" />
              ) : (
                <BookmarkBorderIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Category and Level */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
              {vocabulary.category}
            </span>
            <span
              className={clsx(
                "px-3 py-1 text-xs font-semibold rounded-full border",
                levelColors[vocabulary.level]
              )}
            >
              {levelLabels[vocabulary.level]}
            </span>
          </div>

          {/* Meaning */}
          <div className="flex-1">
            <p className="text-gray-600 text-base leading-relaxed">
              {vocabulary.meaning}
            </p>
          </div>

          {/* Image if available */}
          {vocabulary.imageUrl && (
            <div className="mt-4 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={vocabulary.imageUrl}
                alt={vocabulary.word}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          {/* Flip hint */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              👆 Click để xem ví dụ
            </p>
          </div>
        </div>

        {/* Back side - Example */}
        <div
          className={clsx(
            "absolute inset-0 p-6 flex flex-col transition-opacity duration-500",
            isFlipped ? "opacity-100" : "opacity-0"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                Ví dụ
              </h4>
              <p className="text-lg text-gray-900 leading-relaxed mb-3 italic">
                "{vocabulary.example}"
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                {vocabulary.exampleTranslation}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              👆 Click để quay lại
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

