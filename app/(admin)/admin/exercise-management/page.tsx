"use client";

import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SearchIcon from "@mui/icons-material/Search";
import {
  adminCreateManualExamApi,
  adminCreateQuestionApi,
  adminCreateRandomExamApi,
  adminDeleteExamApi,
  adminDeleteQuestionApi,
  adminGetAllExamsApi,
  adminGetAllQuestionsApi,
  adminUpdateExamApi,
  adminUpdateQuestionApi,
  AnswerLabel,
  ExamDTO,
  ExamRandomDTO,
  ExamResponse,
  QuestionDTO,
  QuestionResponse,
  TestType,
} from "@/lib/services/exercise.service";

type TabKey = "exams" | "questions";

const ANSWER_LABELS: AnswerLabel[] = ["A", "B", "C", "D"];

function typeBadge(type: TestType) {
  return type === "LISTENING"
    ? "bg-purple-100 text-purple-700 border-purple-200"
    : "bg-blue-100 text-blue-700 border-blue-200";
}

function typeLabel(type: TestType) {
  return type === "LISTENING" ? "Listening" : "Reading";
}

export default function ExerciseManagementPage() {
  const [tab, setTab] = useState<TabKey>("exams");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [exams, setExams] = useState<ExamResponse[]>([]);

  const [qSearch, setQSearch] = useState("");
  const [qType, setQType] = useState<"all" | TestType>("all");

  const [eSearch, setESearch] = useState("");
  const [eType, setEType] = useState<"all" | TestType>("all");

  // ===== Question modal =====
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | null>(null);
  const [questionForm, setQuestionForm] = useState<QuestionDTO>({
    title: "",
    type: "READING",
    content: "",
    audioUrl: "",
    answers: [
      { label: "A", content: "", correct: true },
      { label: "B", content: "", correct: false },
    ],
  });

  // ===== Exam modal (manual) =====
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamResponse | null>(null);
  const [examForm, setExamForm] = useState<ExamDTO>({
    title: "",
    description: "",
    type: "READING",
    duration: 20,
    questionIds: [],
  });

  // ===== Exam modal (random) =====
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomForm, setRandomForm] = useState<ExamRandomDTO>({
    title: "",
    description: "",
    type: "READING",
    duration: 20,
    count: 10,
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [qRes, eRes] = await Promise.all([adminGetAllQuestionsApi(), adminGetAllExamsApi()]);
      setQuestions(Array.isArray(qRes?.data) ? qRes.data : []);
      setExams(Array.isArray(eRes?.data) ? eRes.data : []);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Không thể tải dữ liệu bài tập");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredQuestions = useMemo(() => {
    const q = qSearch.trim().toLowerCase();
    return questions.filter((item) => {
      const matchesType = qType === "all" || item.type === qType;
      if (!matchesType) return false;
      if (q === "") return true;
      return (
        (item.title || "").toLowerCase().includes(q) ||
        (item.content || "").toLowerCase().includes(q)
      );
    });
  }, [questions, qSearch, qType]);

  const filteredExams = useMemo(() => {
    const q = eSearch.trim().toLowerCase();
    return exams.filter((item) => {
      const matchesType = eType === "all" || item.type === eType;
      if (!matchesType) return false;
      if (q === "") return true;
      return (
        (item.title || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q)
      );
    });
  }, [exams, eSearch, eType]);

  const questionsForExamPicker = useMemo(() => {
    return questions.filter((q) => q.type === examForm.type);
  }, [questions, examForm.type]);

  const availableRandomCount = useMemo(() => {
    return questions.filter((q) => q.type === randomForm.type).length;
  }, [questions, randomForm.type]);

  const openCreateQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      title: "",
      type: "READING",
      content: "",
      audioUrl: "",
      answers: [
        { label: "A", content: "", correct: true },
        { label: "B", content: "", correct: false },
      ],
    });
    setShowQuestionModal(true);
  };

  const openEditQuestion = (q: QuestionResponse) => {
    setEditingQuestion(q);
    const answersFromApi = (q.answers || []).slice(0, 4).map((a, idx) => ({
      label: ANSWER_LABELS[idx],
      content: a.content || "",
      correct: !!a.correct,
    }));
    // Ensure 2..4 answers
    const normalized = answersFromApi.length >= 2 ? answersFromApi : [
      { label: "A" as AnswerLabel, content: "", correct: true },
      { label: "B" as AnswerLabel, content: "", correct: false },
    ];
    // Ensure exactly one correct (best-effort)
    const correctCount = normalized.filter((a) => a.correct).length;
    if (correctCount !== 1) {
      normalized.forEach((a, idx) => (a.correct = idx === 0));
    }

    setQuestionForm({
      title: q.title || "",
      type: q.type,
      content: q.content || "",
      audioUrl: q.audioUrl || "",
      answers: normalized,
    });
    setShowQuestionModal(true);
  };

  const validateQuestionForm = (dto: QuestionDTO) => {
    if (!dto.title.trim()) return "Vui lòng nhập tiêu đề câu hỏi";
    if (!dto.content.trim()) return "Vui lòng nhập nội dung câu hỏi";
    if (dto.type === "LISTENING" && !dto.audioUrl?.trim()) return "Câu hỏi Listening bắt buộc có audioUrl";
    if (dto.answers.length < 2 || dto.answers.length > 4) return "Câu hỏi phải có từ 2 đến 4 đáp án";
    if (dto.answers.some((a) => !a.content.trim())) return "Vui lòng nhập nội dung cho tất cả đáp án";
    const correctCount = dto.answers.filter((a) => a.correct).length;
    if (correctCount !== 1) return "Phải có đúng 1 đáp án đúng";
    return null;
  };

  const saveQuestion = async () => {
    try {
      setError(null);
      setSuccess(null);

      // normalize labels A..D
      const dto: QuestionDTO = {
        ...questionForm,
        title: questionForm.title.trim(),
        content: questionForm.content.trim(),
        audioUrl: questionForm.type === "LISTENING" ? (questionForm.audioUrl || "").trim() : "",
        answers: questionForm.answers.map((a, idx) => ({
          ...a,
          label: ANSWER_LABELS[idx],
          content: a.content.trim(),
        })),
      };

      const validation = validateQuestionForm(dto);
      if (validation) {
        setError(validation);
        return;
      }

      if (editingQuestion) {
        await adminUpdateQuestionApi(editingQuestion.id, dto);
        setSuccess("Cập nhật câu hỏi thành công!");
      } else {
        await adminCreateQuestionApi(dto);
        setSuccess("Tạo câu hỏi thành công!");
      }

      setShowQuestionModal(false);
      await loadAll();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Có lỗi khi lưu câu hỏi");
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá câu hỏi này?")) return;
    try {
      setError(null);
      setSuccess(null);
      await adminDeleteQuestionApi(id);
      setSuccess("Xoá câu hỏi thành công!");
      await loadAll();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Có lỗi khi xoá câu hỏi");
    }
  };

  const openCreateManualExam = () => {
    setEditingExam(null);
    setExamForm({
      title: "",
      description: "",
      type: "READING",
      duration: 20,
      questionIds: [],
    });
    setShowExamModal(true);
  };

  const openEditExam = (exam: ExamResponse) => {
    setEditingExam(exam);
    const ids = (exam.questions || []).map((q) => q.id).filter(Boolean);
    setExamForm({
      title: exam.title || "",
      description: exam.description || "",
      type: exam.type,
      duration: exam.duration || 20,
      questionIds: ids,
    });
    setShowExamModal(true);
  };

  const validateExamForm = (dto: ExamDTO) => {
    if (!dto.title.trim()) return "Vui lòng nhập tên đề";
    if (!dto.duration || dto.duration < 1) return "Thời gian làm bài tối thiểu 1 phút";
    if (!dto.questionIds.length) return "Vui lòng chọn ít nhất 1 câu hỏi";
    return null;
  };

  const saveExam = async () => {
    try {
      setError(null);
      setSuccess(null);

      const dto: ExamDTO = {
        ...examForm,
        title: examForm.title.trim(),
        description: (examForm.description || "").trim(),
        duration: Number(examForm.duration) || 0,
        questionIds: Array.from(new Set(examForm.questionIds)),
      };

      const validation = validateExamForm(dto);
      if (validation) {
        setError(validation);
        return;
      }

      if (editingExam) {
        await adminUpdateExamApi(editingExam.id, dto);
        setSuccess("Cập nhật đề thành công!");
      } else {
        await adminCreateManualExamApi(dto);
        setSuccess("Tạo đề thủ công thành công!");
      }

      setShowExamModal(false);
      await loadAll();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Có lỗi khi lưu đề");
    }
  };

  const openCreateRandomExam = () => {
    setRandomForm({
      title: "",
      description: "",
      type: "READING",
      duration: 20,
      count: 10,
    });
    setShowRandomModal(true);
  };

  const saveRandomExam = async () => {
    try {
      setError(null);
      setSuccess(null);

      const dto: ExamRandomDTO = {
        ...randomForm,
        title: randomForm.title.trim(),
        description: (randomForm.description || "").trim(),
        duration: Number(randomForm.duration) || 0,
        count: Number(randomForm.count) || 0,
      };

      if (!dto.title) {
        setError("Vui lòng nhập tên đề");
        return;
      }
      if (dto.duration < 1) {
        setError("Thời gian làm bài tối thiểu 1 phút");
        return;
      }
      if (dto.count < 1) {
        setError("Số câu hỏi tối thiểu là 1");
        return;
      }
      if (availableRandomCount > 0 && dto.count > availableRandomCount) {
        setError(`Không đủ câu hỏi cho loại ${typeLabel(dto.type)} (hiện có ${availableRandomCount})`);
        return;
      }

      await adminCreateRandomExamApi(dto);
      setSuccess("Tạo đề ngẫu nhiên thành công!");
      setShowRandomModal(false);
      await loadAll();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Có lỗi khi tạo đề ngẫu nhiên");
    }
  };

  const deleteExam = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá đề này?")) return;
    try {
      setError(null);
      setSuccess(null);
      await adminDeleteExamApi(id);
      setSuccess("Xoá đề thành công!");
      await loadAll();
      setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Có lỗi khi xoá đề");
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
              <h1 className="text-4xl font-bold mb-2 text-orange-600">Quản Lý Bài Tập</h1>
              <p className="text-lg text-gray-600">Quản lý câu hỏi và đề bài (Exam) cho người học</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadAll}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshIcon className="w-5 h-5" />
                <span>Làm mới</span>
              </button>
              {tab === "questions" ? (
                <button
                  onClick={openCreateQuestion}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <AddIcon className="w-5 h-5" />
                  <span>Tạo câu hỏi</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={openCreateManualExam}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <AddIcon className="w-5 h-5" />
                    <span>Tạo đề thủ công</span>
                  </button>
                  <button
                    onClick={openCreateRandomExam}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                  >
                    <ShuffleIcon className="w-5 h-5" />
                    <span>Tạo đề ngẫu nhiên</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 bg-white rounded-xl p-2 border border-gray-200 w-fit">
            <button
              onClick={() => setTab("exams")}
              className={clsx(
                "px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                tab === "exams" ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              Đề bài (Exams)
            </button>
            <button
              onClick={() => setTab("questions")}
              className={clsx(
                "px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                tab === "questions" ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              Câu hỏi (Questions)
            </button>
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

        {/* Content */}
        {tab === "questions" ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4 mb-6">
              <div className="flex-1 min-w-[260px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={qSearch}
                    onChange={(e) => setQSearch(e.target.value)}
                    placeholder="Tìm theo tiêu đề hoặc nội dung..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
                <select
                  value={qType}
                  onChange={(e) => setQType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="READING">Reading</option>
                  <option value="LISTENING">Listening</option>
                </select>
              </div>
              <div className="text-sm text-gray-600 ml-auto">
                Tổng: <span className="font-semibold text-gray-900">{filteredQuestions.length}</span> câu hỏi
              </div>
            </div>

            {/* List */}
            {filteredQuestions.length === 0 ? (
              <div className="p-10 text-center text-gray-600">Chưa có câu hỏi nào.</div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map((q) => {
                  const correct = (q.answers || []).find((a) => a.correct);
                  return (
                    <div
                      key={q.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={clsx("px-3 py-1 text-xs font-semibold rounded-full border", typeBadge(q.type))}>
                              {typeLabel(q.type)}
                            </span>
                            {q.type === "LISTENING" && (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-orange-100 text-orange-700 border-orange-200">
                                Audio
                              </span>
                            )}
                            <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                              {q.answers?.length || 0} đáp án
                            </span>
                          </div>
                          <div className="font-bold text-gray-900 text-lg truncate">{q.title}</div>
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">{q.content}</div>
                          {correct && (
                            <div className="text-xs text-green-700 mt-2">
                              Đáp án đúng: <span className="font-semibold">{correct.label}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditQuestion(q)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(q.id)}
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
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4 mb-6">
              <div className="flex-1 min-w-[260px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={eSearch}
                    onChange={(e) => setESearch(e.target.value)}
                    placeholder="Tìm theo tên đề hoặc mô tả..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
                <select
                  value={eType}
                  onChange={(e) => setEType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="READING">Reading</option>
                  <option value="LISTENING">Listening</option>
                </select>
              </div>
              <div className="text-sm text-gray-600 ml-auto">
                Tổng: <span className="font-semibold text-gray-900">{filteredExams.length}</span> đề
              </div>
            </div>

            {/* List */}
            {filteredExams.length === 0 ? (
              <div className="p-10 text-center text-gray-600">Chưa có đề nào.</div>
            ) : (
              <div className="space-y-3">
                {filteredExams.map((ex) => {
                  const count = ex.questions?.length ?? 0;
                  return (
                    <div
                      key={ex.id}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className={clsx("px-3 py-1 text-xs font-semibold rounded-full border", typeBadge(ex.type))}>
                              {typeLabel(ex.type)}
                            </span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                              {ex.duration} phút
                            </span>
                            <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-orange-100 text-orange-700 border-orange-200">
                              {count} câu hỏi
                            </span>
                          </div>
                          <div className="font-bold text-gray-900 text-lg truncate">{ex.title}</div>
                          {ex.description && (
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">{ex.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditExam(ex)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteExam(ex.id)}
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
          </div>
        )}

        {/* ===== Question Modal ===== */}
        {showQuestionModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingQuestion ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
                </h2>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                  <input
                    value={questionForm.title}
                    onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại *</label>
                    <select
                      value={questionForm.type}
                      onChange={(e) => {
                        const nextType = e.target.value as TestType;
                        setQuestionForm((prev) => ({
                          ...prev,
                          type: nextType,
                          audioUrl: nextType === "LISTENING" ? prev.audioUrl : "",
                        }));
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="READING">Reading</option>
                      <option value="LISTENING">Listening</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audio URL {questionForm.type === "LISTENING" ? "*" : "(tuỳ chọn)"}
                    </label>
                    <input
                      value={questionForm.audioUrl || ""}
                      onChange={(e) => setQuestionForm({ ...questionForm, audioUrl: e.target.value })}
                      disabled={questionForm.type !== "LISTENING"}
                      placeholder={questionForm.type === "LISTENING" ? "https://..." : "Chỉ dùng cho Listening"}
                      className={clsx(
                        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                        questionForm.type !== "LISTENING" ? "bg-gray-50 border-gray-200 text-gray-400" : "border-gray-300"
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung câu hỏi *</label>
                  <textarea
                    value={questionForm.content}
                    onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Answers */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Đáp án (2-4) *</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setQuestionForm((prev) => {
                            if (prev.answers.length >= 4) return prev;
                            const idx = prev.answers.length;
                            return {
                              ...prev,
                              answers: [
                                ...prev.answers,
                                { label: ANSWER_LABELS[idx], content: "", correct: false },
                              ],
                            };
                          });
                        }}
                        disabled={questionForm.answers.length >= 4}
                        className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + Thêm
                      </button>
                      <button
                        onClick={() => {
                          setQuestionForm((prev) => {
                            if (prev.answers.length <= 2) return prev;
                            const next = prev.answers.slice(0, -1);
                            // ensure one correct
                            if (next.filter((a) => a.correct).length !== 1) {
                              next.forEach((a, i) => (a.correct = i === 0));
                            }
                            return { ...prev, answers: next };
                          });
                        }}
                        disabled={questionForm.answers.length <= 2}
                        className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        - Bớt
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {questionForm.answers.map((a, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                        <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-orange-700">
                          {ANSWER_LABELS[idx]}
                        </div>
                        <input
                          value={a.content}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQuestionForm((prev) => {
                              const next = [...prev.answers];
                              next[idx] = { ...next[idx], content: val };
                              return { ...prev, answers: next };
                            });
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Nội dung đáp án..."
                        />
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={!!a.correct}
                            onChange={() => {
                              setQuestionForm((prev) => {
                                const next = prev.answers.map((x, i) => ({ ...x, correct: i === idx }));
                                return { ...prev, answers: next };
                              });
                            }}
                            className="accent-orange-500"
                          />
                          Đúng
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  onClick={saveQuestion}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== Manual Exam Modal ===== */}
        {showExamModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingExam ? "Chỉnh sửa đề" : "Tạo đề thủ công"}
                </h2>
                <button
                  onClick={() => setShowExamModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên đề *</label>
                    <input
                      value={examForm.title}
                      onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian (phút) *</label>
                    <input
                      type="number"
                      min={1}
                      value={examForm.duration}
                      onChange={(e) => setExamForm({ ...examForm, duration: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={examForm.description || ""}
                    onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại *</label>
                    <select
                      value={examForm.type}
                      onChange={(e) => {
                        const next = e.target.value as TestType;
                        setExamForm((prev) => ({
                          ...prev,
                          type: next,
                          questionIds: [],
                        }));
                      }}
                      disabled={!!editingExam}
                      className={clsx(
                        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
                        editingExam ? "bg-gray-50 border-gray-200 text-gray-500" : "border-gray-300"
                      )}
                    >
                      <option value="READING">Reading</option>
                      <option value="LISTENING">Listening</option>
                    </select>
                    {editingExam && (
                      <p className="text-xs text-gray-500 mt-2">
                        Khi sửa đề, loại (type) giữ nguyên để tránh sai lệch dữ liệu.
                      </p>
                    )}
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-sm text-gray-600">
                      Đã chọn:{" "}
                      <span className="font-semibold text-gray-900">{examForm.questionIds.length}</span> câu
                    </div>
                    <button
                      onClick={() => setExamForm((prev) => ({ ...prev, questionIds: [] }))}
                      className="px-3 py-2 text-sm font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-gray-900">Chọn câu hỏi *</div>
                    <div className="text-xs text-gray-600">
                      Có <span className="font-semibold">{questionsForExamPicker.length}</span> câu phù hợp
                    </div>
                  </div>

                  {questionsForExamPicker.length === 0 ? (
                    <div className="text-sm text-gray-600">
                      Chưa có câu hỏi cho loại {typeLabel(examForm.type)}. Hãy tạo câu hỏi trước.
                    </div>
                  ) : (
                    <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
                      {questionsForExamPicker.map((q) => {
                        const checked = examForm.questionIds.includes(q.id);
                        return (
                          <label
                            key={q.id}
                            className={clsx(
                              "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors",
                              checked
                                ? "border-orange-300 bg-white"
                                : "border-gray-200 bg-white hover:bg-orange-50/40 hover:border-orange-200"
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setExamForm((prev) => {
                                  const exists = prev.questionIds.includes(q.id);
                                  const nextIds = exists
                                    ? prev.questionIds.filter((x) => x !== q.id)
                                    : [...prev.questionIds, q.id];
                                  return { ...prev, questionIds: nextIds };
                                });
                              }}
                              className="mt-1 accent-orange-500"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-gray-900 truncate">{q.title}</div>
                              <div className="text-sm text-gray-600 line-clamp-2">{q.content}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  onClick={saveExam}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== Random Exam Modal ===== */}
        {showRandomModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Tạo đề ngẫu nhiên</h2>
                <button
                  onClick={() => setShowRandomModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên đề *</label>
                  <input
                    value={randomForm.title}
                    onChange={(e) => setRandomForm({ ...randomForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={randomForm.description || ""}
                    onChange={(e) => setRandomForm({ ...randomForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại *</label>
                    <select
                      value={randomForm.type}
                      onChange={(e) => setRandomForm({ ...randomForm, type: e.target.value as TestType })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="READING">Reading</option>
                      <option value="LISTENING">Listening</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Hiện có <span className="font-semibold">{availableRandomCount}</span> câu hỏi cho loại này.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian (phút) *</label>
                    <input
                      type="number"
                      min={1}
                      value={randomForm.duration}
                      onChange={(e) => setRandomForm({ ...randomForm, duration: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số câu hỏi *</label>
                  <input
                    type="number"
                    min={1}
                    value={randomForm.count}
                    onChange={(e) => setRandomForm({ ...randomForm, count: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowRandomModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Huỷ
                </button>
                <button
                  onClick={saveRandomExam}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                  <ShuffleIcon className="w-5 h-5" />
                  <span>Tạo đề</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}