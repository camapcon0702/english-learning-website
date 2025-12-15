"use client";

import React from "react";
import Modal from "./Modal";
import LoginForm from "@/components/ui/form/LoginForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Chào mừng trở lại
          </h2>
          <p className="text-sm text-gray-600">
            Đăng nhập để tiếp tục hành trình học tập của bạn
          </p>
        </div>

        <LoginForm 
            onSuccess={onClose}
            hideFooter={true}
        />

        {onSwitchToRegister && (
          <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            Chưa có tài khoản?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors"
            >
              Đăng ký ngay
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

