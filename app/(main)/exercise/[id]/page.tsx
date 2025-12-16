"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import QuestionCard from "@/components/ui/exercise/QuestionCard";
import { getExerciseSetById } from "@/data/exerciseData";

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const exercise = getExerciseSetById(exerciseId);

  const [answers, setAnswers] = useState<Record<string, string | number | null>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = useCallback(() => {
    if (!exercise) return;

    let totalScore = 0;
    exercise.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        totalScore += question.points;
      }
    });

    setScore(totalScore);
    setShowResults(true);
  }, [exercise, answers]);

  // Initialize timer if time limit exists
  useEffect(() => {
    if (exercise?.timeLimit && !showResults) {
      setTimeRemaining(exercise.timeLimit * 60); // Convert to seconds
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [exercise, showResults, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(answers).filter((key) => answers[key] !== null).length;
  const isAllAnswered = answeredCount === exercise?.questions.length;

  if (!exercise) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy bài tập
            </h3>
            <p className="text-gray-600 mb-6">
              Bài tập bạn đang tìm không tồn tại.
            </p>
            <button
              onClick={() => router.push("/exercise")}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Quay lại danh sách bài tập
            </button>
          </div>
        </div>
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
                {exercise.title}
              </h1>
              <p className="text-gray-600 text-sm">{exercise.description}</p>
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
              <span className="font-semibold text-gray-900">{exercise.totalQuestions}</span> câu hỏi
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{exercise.totalPoints}</span> điểm
            </div>
            <div className="text-sm text-gray-600">
              Đã trả lời: <span className="font-semibold text-gray-900">{answeredCount}/{exercise.totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {exercise.questions.map((question, index) => {
          const userAnswer = answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <QuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              selectedAnswer={userAnswer}
              onAnswerChange={(answer) => handleAnswerChange(question.id, answer)}
              showResult={showResults}
              isCorrect={showResults ? isCorrect : undefined}
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
                <>Còn {exercise.totalQuestions - answeredCount} câu chưa trả lời</>
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
        <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-8 mb-6">
          <div className="text-center mb-6">
            <div
              className={clsx(
                "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center",
                score >= exercise.totalPoints * 0.7
                  ? "bg-green-100"
                  : score >= exercise.totalPoints * 0.5
                  ? "bg-yellow-100"
                  : "bg-red-100"
              )}
            >
              {score >= exercise.totalPoints * 0.7 ? (
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              ) : (
                <CancelIcon className="w-12 h-12 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Kết quả bài làm
            </h2>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {score.toFixed(1)} / {exercise.totalPoints}
            </div>
            <p className="text-gray-600">
              {score >= exercise.totalPoints * 0.7
                ? "🎉 Xuất sắc! Bạn đã làm rất tốt!"
                : score >= exercise.totalPoints * 0.5
                ? "👍 Tốt! Hãy tiếp tục cố gắng!"
                : "💪 Cần cố gắng thêm! Hãy xem lại các câu sai."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {exercise.questions.filter(
                  (q) => answers[q.id] === q.correctAnswer
                ).length}
              </div>
              <div className="text-sm text-gray-600">Câu đúng</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {exercise.questions.filter(
                  (q) => answers[q.id] !== q.correctAnswer && answers[q.id] !== null
                ).length}
              </div>
              <div className="text-sm text-gray-600">Câu sai</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {exercise.questions.filter((q) => answers[q.id] === null).length}
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
      )}
    </div>
  );
}

