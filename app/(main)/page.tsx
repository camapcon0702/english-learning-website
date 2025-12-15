import ModulesGrid from "@/components/ui/dashboard/ModulesGrid";

export default function HomePage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-8 lg:p-12 shadow-xl">
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                        Chào mừng đến với English Learning
                    </h1>
                    <p className="text-lg lg:text-xl text-orange-50 leading-relaxed">
                        Khám phá phương pháp học Tiếng Anh đơn giản và hiệu quả. 
                        Học tập theo cách của riêng bạn với các bài học tương tác, 
                        trò chơi thú vị và công cụ hỗ trợ học tập hiện đại.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
            </div>

            {/* Modules Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-8 lg:p-10 backdrop-blur-sm">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">
                        Các module học tập
                    </h2>
                    <p className="text-gray-600">
                        Chọn module bạn muốn bắt đầu học ngay hôm nay
                    </p>
                </div>
                <ModulesGrid gridColumns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
            </div>
        </div>
    );
}
