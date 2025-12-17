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

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng số người dùng"
            value="1,234"
            icon={<PeopleIcon className="w-6 h-6" />}
            trend={{ value: 12.5, isPositive: true }}
            description="Người dùng hoạt động"
            gradient="blue"
          />
          <StatCard
            title="Bài học đã tạo"
            value="456"
            icon={<BookIcon className="w-6 h-6" />}
            trend={{ value: 8.3, isPositive: true }}
            description="Tổng số bài học"
            gradient="green"
          />
          <StatCard
            title="Bài tập đã làm"
            value="8,901"
            icon={<AssessmentIcon className="w-6 h-6" />}
            trend={{ value: 15.2, isPositive: true }}
            description="Lượt làm bài tập"
            gradient="purple"
          />
          <StatCard
            title="Tỷ lệ hoàn thành"
            value="87%"
            icon={<TrendingUpIcon className="w-6 h-6" />}
            trend={{ value: 5.1, isPositive: true }}
            description="Trung bình hoàn thành"
            gradient="orange"
          />
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

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Người dùng mới nhất
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                    U{item}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Người dùng {item}
                    </p>
                    <p className="text-sm text-gray-500">
                      Đã tham gia {item} ngày trước
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Trạng thái hệ thống
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold text-gray-900">
                    Hệ thống hoạt động bình thường
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-semibold text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-semibold text-gray-900">62%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "62%" }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-semibold text-gray-900">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}