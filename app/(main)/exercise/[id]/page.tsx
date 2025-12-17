"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Link from "next/link";
import ExamQuestionCard from "@/components/ui/exercise/ExamQuestionCard";
import ExamQuestionReviewCard from "@/components/ui/exercise/ExamQuestionReviewCard";
import LoginModal from "@/components/ui/modal/LoginModal";
import RegisterModal from "@/components/ui/modal/RegisterModal";
import {
  AnswerLabel,
  ApiError,
  ExamResponse,
  ExamResultResponse,
  ExamViewResponse,
  getExamByIdApi,
  startExamApi,
  submitExamApi,
} from "@/lib/services/exercise.service";

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [examInfo, setExamInfo] = useState<ExamResponse | null>(null);
  const [examSession, setExamSession] = useState<ExamViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, AnswerLabel | null>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<ExamResultResponse | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const handleAnswerChange = (questionId: string, answer: AnswerLabel) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const loadExamInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setStartError(null);

      // Public: user can view exam detail without login
      const res = await getExamByIdApi(exerciseId);
      setExamInfo(res.data);

      // Reset session state
      setExamSession(null);
      setAnswers({});
      setShowResults(false);
      setResult(null);
    } catch (err: any) {
      setExamInfo(null);
      setExamSession(null);
      setError(err?.detail || err?.message || "Không thể tải thông tin đề.");
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    loadExamInfo();
  }, [loadExamInfo]);

  const startExam = useCallback(async () => {
    if (!examInfo) return;
    try {
      setStartError(null);
      setError(null);
      const res = await startExamApi(exerciseId);
      const data = res.data;
      setExamSession(data);
      const init: Record<string, AnswerLabel | null> = {};
      data.questions.forEach((q) => {
        init[q.id] = null;
      });
      setAnswers(init);
      setShowResults(false);
      setResult(null);
    } catch (err: ApiError | any) {
      const status = err?.status;
      if (status === 401 || status === 403) {
        setStartError("Bạn cần đăng nhập để bắt đầu làm bài.");
      } else {
        setStartError(err?.detail || err?.message || "Không thể bắt đầu làm bài.");
      }
    }
  }, [examInfo, exerciseId]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== null).length,
    [answers]
  );

  const isAllAnswered = examSession ? answeredCount === examSession.questions.length : false;

  const handleSubmit = useCallback(async () => {
    if (!examSession) return;
    if (showResults) return;

    const picked = Object.entries(answers)
      .filter(([, v]) => v !== null)
      .map(([questionId, selectedLabel]) => ({
        questionId,
        selectedLabel: selectedLabel as AnswerLabel,
      }));

    if (picked.length === 0) {
      setError("Vui lòng chọn ít nhất 1 câu trả lời trước khi nộp bài.");
      return;
    }

    try {
      setError(null);
      const res = await submitExamApi({ examId: examSession.id, answers: picked });
      setResult(res.data);
      setShowResults(true);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Không thể nộp bài. Vui lòng đăng nhập.");
    }
  }, [answers, examSession, showResults]);

  // Initialize timer if time limit exists
  useEffect(() => {
    if (examSession?.duration && !showResults) {
      setTimeRemaining(examSession.duration * 60); // Convert to seconds
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            // Auto submit if user has at least 1 answer
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examSession, showResults, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài tập...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!examInfo) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy bài tập
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "Bài tập bạn đang tìm không tồn tại."}
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => router.push("/exercise")}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Quay lại danh sách bài tập
              </button>
              <button
                onClick={loadExamInfo}
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

  // ===== Not started yet: show exam info & start button =====
  if (!examSession) {
    const totalQuestions = examInfo.questions?.length ?? 0;
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push("/exercise")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowBackIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Quay lại danh sách</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{examInfo.title}</h1>
                {examInfo.description && <p className="text-gray-600 text-sm">{examInfo.description}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={startExam}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Bắt đầu làm bài
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 flex-wrap text-sm text-gray-600">
              <div>
                Loại:{" "}
                <span className="font-semibold text-gray-900">
                  {examInfo.type === "LISTENING" ? "Listening" : "Reading"}
                </span>
              </div>
              <div>
                Thời gian: <span className="font-semibold text-gray-900">{examInfo.duration} phút</span>
              </div>
              <div>
                Số câu: <span className="font-semibold text-gray-900">{totalQuestions}</span>
              </div>
            </div>

            {startError && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-center justify-between gap-3">
                <div className="text-sm">{startError}</div>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-semibold"
                >
                  Đăng nhập
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

      {/* Auth Modals (same behavior as Header) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/exercise")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <ArrowBackIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại danh sách</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {examSession.title}
              </h1>
              {examSession.description && (
                <p className="text-gray-600 text-sm">{examSession.description}</p>
              )}
            </div>
            {timeRemaining !== null && !showResults && (
              <div
                className={clsx(
                  "px-4 py-2 rounded-lg font-mono text-lg font-bold",
                  timeRemaining < 300
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                )}
              >
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{examSession.questions.length}</span> câu hỏi
            </div>
            <div className="text-sm text-gray-600">
              Điểm tối đa: <span className="font-semibold text-gray-900">10</span>
            </div>
            <div className="text-sm text-gray-600">
              Đã trả lời:{" "}
              <span className="font-semibold text-gray-900">
                {answeredCount}/{examSession.questions.length}
              </span>
            </div>
            {examSession.type && (
              <div className="text-sm text-gray-600">
                Loại:{" "}
                <span className="font-semibold text-gray-900">
                  {examSession.type === "LISTENING" ? "Listening" : "Reading"}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {showResults && result?.review && result.review.length > 0
          ? result.review.map((r, index) => (
              <ExamQuestionReviewCard
                key={`${r.questionId}-${index}`}
                review={r as any}
                questionNumber={index + 1}
              />
            ))
          : examSession.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              return (
                <ExamQuestionCard
                  key={question.id}
                  question={question}
                  questionNumber={index + 1}
                  selectedLabel={userAnswer}
                  onSelect={(label) => handleAnswerChange(question.id, label)}
                  disabled={showResults}
                />
              );
            })}
      </div>

      {/* Submit Button */}
      {!showResults && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-t-xl shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {isAllAnswered ? (
                <span className="text-green-600 font-semibold">
                  ✓ Đã trả lời tất cả câu hỏi
                </span>
              ) : (
                <>Còn {examSession.questions.length - answeredCount} câu chưa trả lời</>
              )}
            </p>
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className={clsx(
                "px-8 py-3 rounded-lg font-semibold transition-all",
                answeredCount === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg"
              )}
            >
              Nộp bài
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="space-y-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-8">
            <div className="text-center mb-6">
            <div
              className={clsx(
                "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center",
                (result?.score ?? 0) >= 7
                  ? "bg-green-100"
                  : (result?.score ?? 0) >= 5
                  ? "bg-yellow-100"
                  : "bg-red-100"
              )}
            >
              {(result?.score ?? 0) >= 7 ? (
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              ) : (
                <CancelIcon className="w-12 h-12 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Kết quả bài làm
            </h2>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {(result?.score ?? 0).toFixed(1)} / 10
            </div>
            <p className="text-gray-600">
              {(result?.score ?? 0) >= 7
                ? "🎉 Xuất sắc! Bạn đã làm rất tốt!"
                : (result?.score ?? 0) >= 5
                ? "👍 Tốt! Hãy tiếp tục cố gắng!"
                : "💪 Cần cố gắng thêm! Hãy xem lại các câu sai."}
            </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {result?.correctAnswers ?? 0}
              </div>
              <div className="text-sm text-gray-600">Câu đúng</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {(result?.totalQuestions ?? examSession.questions.length) - (result?.correctAnswers ?? 0)}
              </div>
              <div className="text-sm text-gray-600">Câu sai</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {Object.values(answers).filter((v) => v === null).length}
              </div>
              <div className="text-sm text-gray-600">Chưa trả lời</div>
            </div>
          </div>

            <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/exercise")}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Làm bài tập khác
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}


