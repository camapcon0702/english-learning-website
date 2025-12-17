import Link from "next/link";

const quickLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Ngữ pháp", href: "/grammar/library" },
  { label: "Bài tập", href: "/exercise" },
  { label: "Mini Game", href: "/minigame" },
  { label: "Flash Card", href: "/flashcard" },
];

const accountLinks = [
  { label: "Thông tin cá nhân", href: "/profile" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0" aria-hidden>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden
                  className="drop-shadow-sm"
                >
                  <rect width="48" height="48" rx="12" fill="url(#footerLogoGradient)" />
                  <defs>
                    <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="48" y2="48">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                  <path d="M14 26h8v8h-8zM26 14h8v8h-8z" fill="#fff" opacity="0.95" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold text-gray-900 tracking-tight">English Learning</div>
                <div className="text-xs text-gray-500">Học tiếng Anh hiệu quả, rõ ràng và có lộ trình.</div>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-prose">
              Nền tảng học tiếng Anh với ngữ pháp, từ vựng, flashcard và bài tập thực hành — tối ưu cho việc học mỗi
              ngày.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-sm font-semibold text-gray-900">Liên kết nhanh</div>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Tài khoản</div>
            <ul className="mt-4 space-y-2">
              {accountLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-xs text-gray-500">
              Nguyễn Phước Lộc, Lê Văn Quý, Nguyễn Quang Ninh
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
