"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { Grammar } from "@/types/grammar.types";
import { getAllGrammarsApi } from "@/lib/services/grammar.service";

export default function GrammarLibraryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Grammar[]>([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllGrammarsApi();
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Không thể tải danh sách ngữ pháp");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((g) => {
      const name = (g.name || "").toLowerCase();
      const desc = (g.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [items, search]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">Ngữ pháp</h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          Danh sách các công thức/ngữ pháp được biên soạn trong hệ thống.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên hoặc mô tả..."
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải ngữ pháp...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải dữ liệu</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={load}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có ngữ pháp</h3>
            <p className="text-gray-600">Thử đổi từ khoá tìm kiếm của bạn.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((g) => (
            <Link key={g.id} href={`/grammar/library/${g.id}`}>
              <div
                className={clsx(
                  "group bg-white border-2 border-gray-200 rounded-xl p-6",
                  "hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer",
                  "active:scale-[0.98]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                      {g.name}
                    </h3>
                    {g.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-3">
                        {g.description}
                      </p>
                    )}
                  </div>
                  <ArrowForwardIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Xem chi tiết</span>
                  <span className="text-xs font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Mở
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


