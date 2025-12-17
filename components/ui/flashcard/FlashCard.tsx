"use client";

import React, { useState } from "react";
import clsx from "clsx";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FlipIcon from "@mui/icons-material/Flip";
import { VocabularyItem } from "@/components/ui/vocabulary/VocabularyCard";

export interface FlashCardProps {
  vocabulary: VocabularyItem;
  cardNumber?: number;
  totalCards?: number;
}

export default function FlashCard({
  vocabulary,
  cardNumber,
  totalCards,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
    <div className="w-full max-w-2xl mx-auto">
      {/* Card Counter */}
      {cardNumber !== undefined && totalCards !== undefined && (
        <div className="text-center mb-4">
          <span className="text-sm text-gray-500">
            Thẻ {cardNumber} / {totalCards}
          </span>
        </div>
      )}

      {/* Flash Card */}
      <div
        className="relative w-full h-[500px] perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={clsx(
            "relative w-full h-full transition-transform duration-500 transform-gpu",
            "preserve-3d",
            isFlipped && "rotate-y-180"
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front Side - Word */}
          <div
            className={clsx(
              "absolute inset-0 w-full h-full rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl",
              "backface-hidden flex flex-col items-center justify-center p-8 cursor-pointer",
              "hover:shadow-2xl transition-shadow"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Header Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handlePlayAudio}
                className={clsx(
                  "p-2 rounded-lg transition-all",
                  isPlaying
                    ? "bg-orange-200 text-orange-700"
                    : "bg-white/80 text-gray-600 hover:bg-orange-100 hover:text-orange-600"
                )}
                aria-label="Phát âm"
              >
                <VolumeUpIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content */}
            <div className="text-center flex-1 flex flex-col items-center justify-center">
              <div className="mb-6">
                <span
                  className={clsx(
                    "px-4 py-2 text-sm font-semibold rounded-full border",
                    levelColors[vocabulary.level]
                  )}
                >
                  {levelLabels[vocabulary.level]}
                </span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {vocabulary.word}
              </h2>

              <p className="text-xl text-gray-600 italic mb-6">
                /{vocabulary.pronunciation}/
              </p>

              <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
                <FlipIcon className="w-4 h-4" />
                <span>Click để xem nghĩa</span>
              </div>
            </div>
          </div>

          {/* Back Side - Meaning & Example */}
          <div
            className={clsx(
              "absolute inset-0 w-full h-full rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl",
              "backface-hidden flex flex-col items-center justify-center p-8 cursor-pointer rotate-y-180",
              "hover:shadow-2xl transition-shadow"
            )}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Main Content */}
            <div className="text-center flex-1 flex flex-col items-center justify-center w-full">
              <div className="mb-6">
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-blue-200 text-blue-700">
                  {vocabulary.category}
                </span>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {vocabulary.meaning}
              </h3>

              {/* Example */}
              <div className="w-full max-w-lg mt-8 p-6 bg-white/60 rounded-xl">
                <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  Ví dụ
                </p>
                <p className="text-lg text-gray-800 italic mb-3 leading-relaxed">
                  "{vocabulary.example}"
                </p>
                <p className="text-base text-gray-600 leading-relaxed">
                  {vocabulary.exampleTranslation}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
                <FlipIcon className="w-4 h-4" />
                <span>Click để quay lại</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

