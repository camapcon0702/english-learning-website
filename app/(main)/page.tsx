import ModulesGrid from "@/components/ui/dashboard/ModulesGrid";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-orange-100 p-8">
            <main className="max-w-7xl mx-auto">
                <div className="bg-orange-50 rounded-xl shadow-lg p-12 border border-orange-100">
                    <h1 className="text-5xl font-bold mb-6 text-orange-600">
                        Chào mừng đến với English Learning
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Khám phá phương pháp học Tiếng Anh đơn giản hiệu quả
                    </p>

                    <ModulesGrid gridColumns="grid-cols-4" />
                </div>
            </main>
        </div>
    );
}
