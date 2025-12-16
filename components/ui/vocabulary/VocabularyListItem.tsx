"use client";

import React, { useState } from "react";
import clsx from "clsx";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { VocabularyItem } from "./VocabularyCard";

export interface VocabularyListItemProps {
  vocabulary: VocabularyItem;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export default function VocabularyListItem({
  vocabulary,
  onBookmark,
  isBookmarked = false,
}: VocabularyListItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
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
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
      {/* Main Content */}
      <div className="flex items-start gap-4">
        {/* Word and Info */}
        <div className="flex-1 min-w-0">
          {/* Word Row */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {vocabulary.word}
            </h3>
            <button
              onClick={handlePlayAudio}
              className={clsx(
                "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 transition-colors",
                isPlaying && "bg-orange-100"
              )}
              aria-label="Phát âm"
            >
              <VolumeUpIcon className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleBookmark}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
              aria-label={isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu"}
            >
              {isBookmarked ? (
                <BookmarkIcon className="w-5 h-5 text-orange-500" />
              ) : (
                <BookmarkBorderIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Pronunciation */}
          <p className="text-sm text-gray-500 italic mb-3">
            /{vocabulary.pronunciation}/
          </p>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 text-xs font-semibold rounded bg-orange-100 text-orange-700">
              {vocabulary.category}
            </span>
            <span
              className={clsx(
                "px-3 py-1 text-xs font-semibold rounded border",
                levelColors[vocabulary.level]
              )}
            >
              {levelLabels[vocabulary.level]}
            </span>
          </div>

          {/* Meaning */}
          <p className="text-gray-700 text-base leading-relaxed mb-3">
            {vocabulary.meaning}
          </p>

          {/* Example Toggle */}
          <button
            onClick={() => setShowExample(!showExample)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showExample ? (
              <>
                <ExpandLessIcon className="w-4 h-4" />
                <span>Ẩn ví dụ</span>
              </>
            ) : (
              <>
                <ExpandMoreIcon className="w-4 h-4" />
                <span>Click để xem ví dụ</span>
              </>
            )}
          </button>

          {/* Example Section */}
          {showExample && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-gray-600 text-base italic mb-2">
                "{vocabulary.example}"
              </p>
              <p className="text-gray-700 text-base">
                {vocabulary.exampleTranslation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

