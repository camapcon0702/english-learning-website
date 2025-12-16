"use client";

import React, { useState } from "react";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import ExerciseCard from "@/components/ui/exercise/ExerciseCard";
import { getAllExerciseSets } from "@/data/exerciseData";

export default function ExercisePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  const exerciseSets = getAllExerciseSets();

  // Filter exercises
  const filteredExercises = exerciseSets.filter((exercise) => {
    const matchesSearch =
      searchQuery === "" ||
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === "all" || exercise.level === selectedLevel;
    const matchesTopic = selectedTopic === "all" || exercise.topic === selectedTopic;

    return matchesSearch && matchesLevel && matchesTopic;
  });

  const topics = Array.from(new Set(exerciseSets.map((ex) => ex.topic)));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          Bài tập luyện tập
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          Luyện tập và củng cố kiến thức đã học với các bài tập đa dạng. 
          Từ bài tập cơ bản đến nâng cao, phù hợp với mọi trình độ.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Level Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cấp độ
            </label>
            <div className="flex gap-2">
              {[
                { value: "all", label: "Tất cả" },
                { value: "beginner", label: "Cơ bản" },
                { value: "intermediate", label: "Trung bình" },
                { value: "advanced", label: "Nâng cao" },
              ].map((level) => (
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

          {/* Topic Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chủ đề
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedTopic("all")}
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                  selectedTopic === "all"
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Tất cả
              </button>
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={clsx(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                    selectedTopic === topic
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Tìm thấy <span className="font-semibold text-gray-900">{filteredExercises.length}</span> đề bài tập
        </p>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy bài tập
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
