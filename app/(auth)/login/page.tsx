import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/ui/form/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập | Học tiếng Anh",
  description: "Đăng nhập vào tài khoản của bạn để tiếp tục học tiếng Anh",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block mb-6 text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Học Tiếng Anh
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Chào mừng trở lại
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đăng nhập để tiếp tục hành trình học tập của bạn
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <LoginForm />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-semibold">
              Điều khoản sử dụng
            </Link>
            {" "}và{" "}
            <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

