"use client";

import React from "react";
import StatCard from "@/components/ui/admin/StatCard";
import QuickActionCard from "@/components/ui/admin/QuickActionCard";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import AddCardOutlined from "@mui/icons-material/AddCardOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import BookIcon from "@mui/icons-material/Book";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard Quản Trị
          </h1>
          <p className="text-lg text-gray-600">
            Tổng quan về hệ thống học tiếng Anh của bạn
          </p>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Quản lý ngữ pháp"
              description="Thêm, sửa, xóa các bài học ngữ pháp"
              icon={<LanguageOutlinedIcon className="w-6 h-6" />}
              href="/admin/grammar-management"
              color="orange"
            />
            <QuickActionCard
              title="Quản lý mini game"
              description="Quản lý word & suggest cho mini game"
              icon={<SportsEsportsOutlinedIcon className="w-6 h-6" />}
              href="/admin/minigame-management"
              color="blue"
            />
            <QuickActionCard
              title="Quản lý bài tập"
              description="Tạo và chỉnh sửa các bài tập luyện tập"
              icon={<QuizOutlinedIcon className="w-6 h-6" />}
              href="/admin/exercise-management"
              color="green"
            />
            <QuickActionCard
              title="Quản lý flashcard"
              description="Quản lý bộ flashcard cho người học"
              icon={<AddCardOutlined className="w-6 h-6" />}
              href="/admin/flashcard-management"
              color="purple"
            />
          </div>
        </div>
      </div>
    </div>
  );
}