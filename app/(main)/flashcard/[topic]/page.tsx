"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import FlashCard from "@/components/ui/flashcard/FlashCard";
import TopicIcon from "@/components/ui/vocabulary/TopicIcon";
import type { Topic } from "@/components/ui/vocabulary/TopicCard";
import type { VocabularyItem } from "@/components/ui/vocabulary/VocabularyCard";
import { categories, levels } from "@/data/vocabularyData";
import { toUiTopic, toUiVocabularyItem } from "@/lib/mappers/flashcard.mapper";
import { getVocabularyTopicByIdApi } from "@/lib/services/flashcard.service";

export default function TopicFlashCardPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topic as string;

  const [topic, setTopic] = useState<(Topic & { vocabularies: VocabularyItem[] }) | null>(null);
  const [loadingTopic, setLoadingTopic] = useState(true);
  const [topicError, setTopicError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set(JSON.parse(localStorage.getItem("vocabulary-bookmarks") || "[]"))
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  const loadTopic = React.useCallback(async () => {
    try {
      setLoadingTopic(true);
      setTopicError(null);
      const response = await getVocabularyTopicByIdApi(topicId);
      const apiTopic = response?.data;
      if (!apiTopic?.id) {
        setTopic(null);
        setTopicError("Không tìm thấy chủ đề");
        return;
      }

      const uiTopic = toUiTopic(apiTopic);
      const vocabularies = (apiTopic.vocabularies ?? []).map((v) =>
        toUiVocabularyItem(v, { fallbackTopicId: apiTopic.id, fallbackLevel: apiTopic.level })
      );
      setTopic({ ...uiTopic, vocabularies });
    } catch (err: any) {
      setTopic(null);
      setTopicError(err?.detail || err?.message || "Không thể tải thông tin chủ đề");
    } finally {
      setLoadingTopic(false);
    }
  }, [topicId]);

  React.useEffect(() => {
    loadTopic();
  }, [loadTopic]);

  // Save bookmarks to localStorage
  React.useEffect(() => {
    localStorage.setItem("vocabulary-bookmarks", JSON.stringify(Array.from(bookmarkedIds)));
  }, [bookmarkedIds]);

  const handleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Filter vocabulary
  const filteredVocabulary = useMemo(() => {
    if (!topic) return [];

    let filtered = topic.vocabularies.filter((item) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.example.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "Tất cả" || item.category === selectedCategory;

      // Level filter
      const matchesLevel =
        selectedLevel === "all" || item.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Shuffle if needed
    if (isShuffled) {
      const shuffled = [...filtered];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return filtered;
  }, [topic, searchQuery, selectedCategory, selectedLevel, isShuffled]);

  // Reset index when filtered vocabulary changes
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [filteredVocabulary.length, searchQuery, selectedCategory, selectedLevel, isShuffled]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredVocabulary.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredVocabulary.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredVocabulary.length === 0) return;
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredVocabulary.length - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < filteredVocabulary.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredVocabulary.length]);

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Tất cả");
    setSelectedLevel("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "Tất cả" ||
    selectedLevel !== "all";

  if (loadingTopic) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải chủ đề...</p>
          </div>
        </div>
      </div>
    );
  }

  // If topic not found
  if (!topic) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy chủ đề
            </h3>
            <p className="text-gray-600 mb-6">
              {topicError || "Chủ đề bạn đang tìm không tồn tại."}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => router.push("/flashcard")}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Quay lại trang chủ đề
              </button>
              <button
                onClick={loadTopic}
                className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = filteredVocabulary[currentIndex];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button & Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/flashcard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowBackIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại chủ đề</span>
        </button>

        {/* Topic Header */}
        <div
          className={clsx(
            "relative overflow-hidden rounded-2xl p-8 lg:p-12 shadow-xl mb-6",
            `bg-gradient-to-br ${topic.gradientFrom} ${topic.gradientTo}`
          )}
        >
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-white/15 backdrop-blur-sm flex items-center justify-center text-5xl lg:text-6xl">
                <TopicIcon icon={topic.icon} alt={topic.name} className="w-full h-full" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-white">
                  {topic.name}
                </h1>
                <p className="text-lg text-white/90 italic mb-4">
                  {topic.nameEn}
                </p>
                <p className="text-base text-white/80 leading-relaxed max-w-3xl">
                  {topic.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <span className="text-white font-semibold">{filteredVocabulary.length}</span>
                <span className="text-white/90 ml-2">thẻ</span>
              </div>
              <span
                className={clsx(
                  "px-4 py-2 text-sm font-semibold rounded-lg border backdrop-blur-sm",
                  topic.level === "beginner" &&
                    "bg-green-500/20 text-white border-green-300/30",
                  topic.level === "intermediate" &&
                    "bg-yellow-500/20 text-white border-yellow-300/30",
                  topic.level === "advanced" &&
                    "bg-red-500/20 text-white border-red-300/30"
                )}
              >
                {topic.level === "beginner" && "Cơ bản"}
                {topic.level === "intermediate" && "Trung bình"}
                {topic.level === "advanced" && "Nâng cao"}
              </span>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm từ vựng, nghĩa hoặc ví dụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <ClearIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FilterListIcon className="h-5 w-5" />
              <span>Bộ lọc</span>
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full">
                  {[searchQuery && "1", selectedCategory !== "Tất cả" && "1", selectedLevel !== "all" && "1"]
                    .filter(Boolean).length}
                </span>
              )}
            </button>

            <button
              onClick={handleShuffle}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isShuffled
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <ShuffleIcon className="h-5 w-5" />
              <span>Xáo trộn</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ClearIcon className="h-4 w-4" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={clsx(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                      selectedCategory === category
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cấp độ
              </label>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedLevel(level.value)}
                    className={clsx(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                      selectedLevel === level.value
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flash Card Display */}
      {filteredVocabulary.length > 0 ? (
        <div className="mb-6">
          <FlashCard
            vocabulary={currentCard}
            onBookmark={handleBookmark}
            isBookmarked={bookmarkedIds.has(currentCard.id)}
            cardNumber={currentIndex + 1}
            totalCards={filteredVocabulary.length}
          />

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-orange-300 transition-all"
            >
              <ArrowBackIosIcon className="w-5 h-5" />
              <span>Trước</span>
            </button>

            <div className="px-6 py-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-semibold text-orange-700">
                {currentIndex + 1} / {filteredVocabulary.length}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-orange-300 transition-all"
            >
              <span>Sau</span>
              <ArrowForwardIosIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Keyboard Navigation Hint */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Sử dụng phím mũi tên ← → để chuyển thẻ
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy từ vựng
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
