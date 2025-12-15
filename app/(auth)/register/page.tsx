import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/ui/form/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký | Học tiếng Anh",
  description: "Tạo tài khoản mới để bắt đầu hành trình học tiếng Anh của bạn",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block mb-6 text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Học Tiếng Anh
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Bắt đầu hành trình học tiếng Anh của bạn ngay hôm nay
          </p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <RegisterForm />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Bằng việc đăng ký, bạn đồng ý với{" "}
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

