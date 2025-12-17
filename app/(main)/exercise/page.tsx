"use client";

import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import {
  ExamResponse,
  TestType,
  getExamsByTypeApi,
} from "@/lib/services/exercise.service";

export default function ExercisePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | TestType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<ExamResponse[]>([]);

  const loadExams = async () => {
    try {
      setLoading(true);
      setError(null);
      // Backend doesn't provide /api/exams list -> fetch both types
      const [reading, listening] = await Promise.all([
        getExamsByTypeApi("READING"),
        getExamsByTypeApi("LISTENING"),
      ]);
      const merged = [...(reading.data || []), ...(listening.data || [])];
      setExams(merged);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Không thể tải danh sách bài tập. Vui lòng đăng nhập.");
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return exams.filter((exam) => {
      const matchesType = selectedType === "all" || exam.type === selectedType;
      if (!matchesType) return false;
      if (q === "") return true;
      return (
        (exam.title || "").toLowerCase().includes(q) ||
        (exam.description || "").toLowerCase().includes(q)
      );
    });
  }, [exams, searchQuery, selectedType]);

  const typeLabel = (t: TestType) => (t === "LISTENING" ? "Listening" : "Reading");
  const typeBadge = (t: TestType) =>
    t === "LISTENING"
      ? "bg-purple-100 text-purple-700 border-purple-200"
      : "bg-blue-100 text-blue-700 border-blue-200";

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          Bài tập luyện tập
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          Làm bài Reading/Listening theo đề. Bạn cần đăng nhập để truy cập bài tập.
        </p>
        <div className="mt-4 flex gap-3 flex-wrap">
          <Link
            href="/exercise/results"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-semibold inline-block"
          >
            Lịch sử kết quả
          </Link>
        </div>
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
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[260px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại đề
            </label>
            <div className="flex gap-2 flex-wrap">
              {([
                { value: "all", label: "Tất cả" },
                { value: "READING", label: "Reading" },
                { value: "LISTENING", label: "Listening" },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value as any)}
                  className={clsx(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                    selectedType === t.value
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Tìm thấy <span className="font-semibold text-gray-900">{filteredExams.length}</span> đề bài tập
        </p>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách đề...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không thể tải bài tập
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={loadExams}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Thử lại
              </button>
              <Link
                href="/login"
                className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      ) : filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <Link key={exam.id} href={`/exercise/${exam.id}`}>
              <div
                className={clsx(
                  "group bg-white border-2 border-gray-200 rounded-xl p-6",
                  "hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer",
                  "active:scale-[0.98]"
                )}
              >
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={clsx("px-3 py-1 text-xs font-semibold rounded-full border", typeBadge(exam.type))}>
                        {typeLabel(exam.type)}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                        {exam.duration} phút
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-orange-100 text-orange-700 border-orange-200">
                        {exam.questions?.length ?? 0} câu
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                      {exam.title}
                    </h3>
                    {exam.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-2">
                        {exam.description}
                      </p>
                    )}
                  </div>
                  <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                    <span className="text-xl">→</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Bắt đầu làm bài</span>
                  <span className="text-xs font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Vào đề
                  </span>
                </div>
              </div>
            </Link>
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
