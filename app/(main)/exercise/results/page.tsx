"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  ExamResponse,
  ExamResultResponse,
  getExamByIdApi,
  getMyExamResultsApi,
} from "@/lib/services/exercise.service";

type Row = ExamResultResponse & {
  exam?: ExamResponse | null;
};

function scoreBadge(score: number) {
  if (score >= 8) return "bg-green-100 text-green-700 border-green-200";
  if (score >= 5) return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-red-100 text-red-700 border-red-200";
}

export default function ExerciseResultsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMyExamResultsApi();
      const results = Array.isArray(res?.data) ? res.data : [];

      // hydrate exam metadata (best-effort)
      const uniqueIds = Array.from(new Set(results.map((r) => r.examId))).filter(Boolean);
      const examMap = new Map<string, ExamResponse | null>();

      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const ex = await getExamByIdApi(id);
            examMap.set(id, ex.data);
          } catch {
            examMap.set(id, null);
          }
        })
      );

      setRows(results.map((r) => ({ ...r, exam: examMap.get(r.examId) ?? null })));
    } catch (err: any) {
      setError(err?.detail || err?.message || "Không thể tải lịch sử kết quả. Vui lòng đăng nhập.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sortedRows = useMemo(() => {
    // Backend doesn't provide timestamps; keep as received but sort by score desc for better UX
    return [...rows].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [rows]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link
              href="/exercise"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors group"
            >
              <ArrowBackIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Quay lại bài tập</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lịch sử kết quả</h1>
            <p className="text-gray-600">
              Danh sách điểm các bài bạn đã nộp (Reading/Listening).
            </p>
          </div>

          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshIcon className="w-5 h-5" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải kết quả...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không thể tải lịch sử
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={load}
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
      ) : sortedRows.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có kết quả nào
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy làm một bài tập rồi nộp bài để xem kết quả ở đây.
            </p>
            <Link
              href="/exercise"
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors inline-block"
            >
              Đi tới bài tập
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Tổng: <span className="font-semibold text-gray-900">{sortedRows.length}</span> lượt nộp
            </div>
            <div className="text-xs text-gray-500">
              (Backend hiện chưa trả về thời gian nộp, nên danh sách được sắp theo điểm)
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {sortedRows.map((r, idx) => {
              const title = r.exam?.title || `Exam #${r.examId}`;
              const type = r.exam?.type;
              const duration = r.exam?.duration;
              return (
                <div key={`${r.examId}-${idx}`} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span
                          className={clsx(
                            "px-3 py-1 text-xs font-semibold rounded-full border",
                            scoreBadge(r.score ?? 0)
                          )}
                        >
                          {(r.score ?? 0).toFixed(1)} / 10
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                          Đúng: {r.correctAnswers}/{r.totalQuestions}
                        </span>
                        {type && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-700 border-blue-200">
                            {type === "LISTENING" ? "Listening" : "Reading"}
                          </span>
                        )}
                        {duration && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-orange-100 text-orange-700 border-orange-200">
                            {duration} phút
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-gray-900 truncate">{title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        examId: <span className="font-mono">{r.examId}</span>
                      </div>
                    </div>
                    <Link
                      href={`/exercise/${r.examId}`}
                      className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
                    >
                      Làm lại
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


