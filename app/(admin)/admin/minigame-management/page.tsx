"use client";

import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import type { MiniGame, MiniGameDTO, LocalDateTimeLike } from "@/types/minigame.types";
import {
  adminCreateMiniGameApi,
  adminDeleteMiniGameApi,
  adminGetAllMiniGamesApi,
  adminUpdateMiniGameApi,
} from "@/lib/services/minigame.service";

function extractErrorText(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const rec = err as Record<string, unknown>;
  const detail = typeof rec.detail === "string" ? rec.detail : undefined;
  const message = typeof rec.message === "string" ? rec.message : undefined;
  return detail || message;
}

function formatCreatedAt(value: LocalDateTimeLike | undefined) {
  if (!value) return "";
  // ISO string
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toLocaleString();
    return value;
  }
  // [yyyy, MM, dd, HH, mm, ss, nnnnnnnnn]
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d, hh = 0, mm = 0, ss = 0] = value;
    const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
    if (!Number.isNaN(date.getTime())) return date.toLocaleString();
  }
  return "";
}

export default function MiniGameManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [items, setItems] = useState<MiniGame[]>([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MiniGame | null>(null);
  const [form, setForm] = useState<MiniGameDTO>({ word: "", suggest: "" });

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminGetAllMiniGamesApi();
      const data = Array.isArray(res?.data) ? res.data : [];
      // sort newest first when possible
      const sorted = [...data].sort((a, b) => {
        const fa = formatCreatedAt(a.createdAt) || "";
        const fb = formatCreatedAt(b.createdAt) || "";
        return fb.localeCompare(fa);
      });
      setItems(sorted);
    } catch (err: unknown) {
      setError(extractErrorText(err) || "Không thể tải danh sách mini game");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => {
      const w = (x.word || "").toLowerCase();
      const s = (x.suggest || "").toLowerCase();
      return w.includes(q) || s.includes(q) || (x.id || "").toLowerCase().includes(q);
    });
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ word: "", suggest: "" });
    setShowModal(true);
  };

  const openEdit = (mg: MiniGame) => {
    setEditing(mg);
    setForm({ word: mg.word || "", suggest: mg.suggest || "" });
    setShowModal(true);
  };

  const save = async () => {
    try {
      setError(null);
      setSuccess(null);

      const dto: MiniGameDTO = {
        word: form.word.trim(),
        suggest: form.suggest.trim(),
      };

      if (!dto.word) {
        setError("Vui lòng nhập từ (word)");
        return;
      }
      if (!dto.suggest) {
        setError("Vui lòng nhập gợi ý (suggest)");
        return;
      }

      if (editing) {
        await adminUpdateMiniGameApi(editing.id, dto);
        setSuccess("Cập nhật mini game thành công!");
      } else {
        await adminCreateMiniGameApi(dto);
        setSuccess("Tạo mini game thành công!");
      }

      setShowModal(false);
      await loadAll();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: unknown) {
      setError(extractErrorText(err) || "Có lỗi xảy ra khi lưu mini game");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá mini game này?")) return;
    try {
      setError(null);
      setSuccess(null);
      await adminDeleteMiniGameApi(id);
      setSuccess("Xoá mini game thành công!");
      await loadAll();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: unknown) {
      setError(extractErrorText(err) || "Có lỗi xảy ra khi xoá mini game");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-orange-50 rounded-xl shadow-lg p-8 border border-orange-100 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-orange-600">Quản Lý Mini Game</h1>
              <p className="text-lg text-gray-600">Quản lý câu đố (word) và gợi ý (suggest) cho mini game</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadAll}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshIcon className="w-5 h-5" />
                <span>Làm mới</span>
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <AddIcon className="w-5 h-5" />
                <span>Tạo mini game</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{success}</div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo word, suggest hoặc id..."
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{filtered.length}</span> mini game
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">Chưa có mini game nào. Hãy tạo mini game đầu tiên!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((mg) => {
              const created = formatCreatedAt(mg.createdAt);
              return (
                <div
                  key={mg.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-orange-100 text-orange-700 border-orange-200">
                          {mg.id}
                        </span>
                        {created && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                            {created}
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-gray-900 truncate">
                        Word: <span className="text-orange-700">{mg.word}</span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        <span className="font-semibold">Suggest:</span> {mg.suggest}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit(mg)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(mg.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xoá"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editing ? "Chỉnh sửa mini game" : "Tạo mini game mới"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Word *</label>
                  <input
                    value={form.word}
                    onChange={(e) => setForm((prev) => ({ ...prev, word: e.target.value }))}
                    placeholder="Ví dụ: airport"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Lưu ý: backend đang chặn trùng word khi tạo mới.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suggest *</label>
                  <textarea
                    value={form.suggest}
                    onChange={(e) => setForm((prev) => ({ ...prev, suggest: e.target.value }))}
                    rows={3}
                    placeholder="Gợi ý để người chơi đoán từ..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  onClick={save}
                  disabled={!form.word.trim() || !form.suggest.trim()}
                  className={clsx(
                    "flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors",
                    !form.word.trim() || !form.suggest.trim()
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  )}
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

