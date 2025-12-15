"use client";

import React from "react";
import Modal from "./Modal";
import RegisterForm from "@/components/ui/form/RegisterForm";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Tạo tài khoản mới
          </h2>
          <p className="text-sm text-gray-600">
            Bắt đầu hành trình học tiếng Anh của bạn ngay hôm nay
          </p>
        </div>

        <RegisterForm 
            onSuccess={onClose}
            hideFooter={true}
        />

        {onSwitchToLogin && (
          <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
            Đã có tài khoản?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

