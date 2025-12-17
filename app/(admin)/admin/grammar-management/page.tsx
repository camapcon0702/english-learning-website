"use client";

import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import DOMPurify from "dompurify";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import type { Grammar, GrammarDTO } from "@/types/grammar.types";
import RichTextEditor from "@/components/ui/editor/RichTextEditor";
import {
  createGrammarApi,
  deleteGrammarApi,
  getAllGrammarsApi,
  updateGrammarApi,
} from "@/lib/services/grammar.service";

function isEmptyHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim().length === 0;
}

export default function GrammarManagementPage() {
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Grammar | null>(null);
  const [form, setForm] = useState<GrammarDTO>({
    name: "",
    description: "",
    content: "",
  });

  const loadGrammars = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllGrammarsApi();
      setGrammars(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Không thể tải danh sách ngữ pháp");
      setGrammars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrammars();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return grammars;
    return grammars.filter((g) => {
      const name = (g.name || "").toLowerCase();
      const desc = (g.description || "").toLowerCase();
      const content = (g.content || "").toLowerCase();
      return name.includes(q) || desc.includes(q) || content.includes(q);
    });
  }, [grammars, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", content: "" });
    setShowModal(true);
  };

  const openEdit = (g: Grammar) => {
    setEditing(g);
    setForm({
      name: g.name || "",
      description: g.description || "",
      content: g.content || "",
    });
    setShowModal(true);
  };

  const save = async () => {
    try {
      setError(null);
      setSuccess(null);

      const dto: GrammarDTO = {
        name: form.name.trim(),
        description: (form.description || "").trim(),
        content: form.content.trim(),
      };

      if (!dto.name) {
        setError("Vui lòng nhập tên công thức ngữ pháp");
        return;
      }
      if (!dto.content) {
        setError("Vui lòng nhập nội dung");
        return;
      }

      if (editing) {
        await updateGrammarApi(editing.id, dto);
        setSuccess("Cập nhật công thức thành công!");
      } else {
        await createGrammarApi(dto);
        setSuccess("Tạo công thức thành công!");
      }

      setShowModal(false);
      await loadGrammars();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Có lỗi xảy ra khi lưu ngữ pháp");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá công thức ngữ pháp này?")) return;
    try {
      setError(null);
      setSuccess(null);
      await deleteGrammarApi(id);
      setSuccess("Xoá công thức thành công!");
      await loadGrammars();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Có lỗi xảy ra khi xoá ngữ pháp");
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
              <h1 className="text-4xl font-bold mb-2 text-orange-600">
                Quản Lý Ngữ Pháp
              </h1>
              <p className="text-lg text-gray-600">
                Thêm, sửa, xoá các công thức/ngữ pháp (name, description, content)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadGrammars}
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
                <span>Tạo công thức mới</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
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
              placeholder="Tìm theo tên, mô tả hoặc nội dung..."
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{filtered.length}</span> công thức
          </div>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">Chưa có công thức nào. Hãy tạo công thức đầu tiên!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((g) => {
              const isOpen = expanded.has(g.id);
              return (
                <div
                  key={g.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 truncate">
                            {g.name}
                          </h3>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                            {g.id}
                          </span>
                        </div>
                        {g.description && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {g.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleExpand(g.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={isOpen ? "Thu gọn" : "Xem nội dung"}
                        >
                          {isOpen ? (
                            <ExpandLessIcon className="w-6 h-6" />
                          ) : (
                            <ExpandMoreIcon className="w-6 h-6" />
                          )}
                        </button>
                        <button
                          onClick={() => openEdit(g)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(g.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xoá"
                        >
                          <DeleteIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-6 bg-gray-50">
                      <div className="text-sm font-semibold text-gray-700 mb-2">
                        Nội dung
                      </div>
                      <div
                        className="bg-white border border-gray-200 rounded-xl p-4 text-gray-800 wysiwyg-content"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(g.content || ""),
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editing ? "Chỉnh sửa công thức" : "Tạo công thức mới"}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên công thức *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung *
                  </label>
                  <RichTextEditor
                    value={form.content}
                    onChange={(html) => setForm({ ...form, content: html })}
                    placeholder="Nhập nội dung công thức ngữ pháp..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Gợi ý: bạn có thể xuống dòng, dùng bullet, ví dụ… nội dung sẽ hiển thị dạng text (whitespace preserved).
                  </p>
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
                  disabled={!form.name.trim() || isEmptyHtml(form.content)}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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