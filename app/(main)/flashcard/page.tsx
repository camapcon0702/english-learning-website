"use client";

import React, { useState } from "react";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import TopicCard from "@/components/ui/vocabulary/TopicCard";
import { getAllTopics } from "@/data/vocabularyTopics";

export default function FlashCardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const topics = getAllTopics();

  // Filter topics by search query
  const filteredTopics = topics.filter((topic) =>
    searchQuery === "" ||
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-8 lg:p-12 shadow-xl mb-8">
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
              Flash Card - Từ vựng
            </h1>
            <p className="text-lg lg:text-xl text-orange-50 leading-relaxed max-w-3xl">
              Ôn tập từ vựng hiệu quả với phương pháp flash card. 
              Học từ mới một cách nhanh chóng và bền vững với các chủ đề đa dạng.
            </p>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề từ vựng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Chủ đề từ vựng
            </h2>
            <p className="text-sm text-gray-600">
              Tìm thấy <span className="font-semibold text-gray-900">{filteredTopics.length}</span> chủ đề
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy chủ đề
            </h3>
            <p className="text-gray-600 mb-6">
              Thử thay đổi từ khóa tìm kiếm của bạn
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Xóa tìm kiếm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
