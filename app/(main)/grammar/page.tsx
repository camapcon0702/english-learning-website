import { ModuleCardProps } from "@/components/ui/dashboard/ModuleCard";
import ModulesGrid from "@/components/ui/dashboard/ModulesGrid";

const grammarSubModule: ModuleCardProps[] = [
    {
        moduleName: "12 Thì cơ bản",
        moduleDescription: "Cấu trúc, cách sử dụng thì cơ bản.",
        moduleIcon: "./images/icon_tense.png",
        navigateTo: "/grammar/tense"
    },
    {
        moduleName: "Mệnh đề",
        moduleDescription: "Cách sử dụng mệnh đề.",
        moduleIcon: "./images/icon_clause.png",
        navigateTo: "/grammar/clause"
    },
    {
        moduleName: "Từ loại",
        moduleDescription: "Cách sử dụng từ loại.",
        moduleIcon: "./images/icon_wordtype.png",
        navigateTo: "/grammar/word-type"
    },
]

export default function GrammarPage() {
    return (
        <div className="min-h-screen bg-orange-100 p-8">
            <main className="max-w-7xl mx-auto">
                <div className="bg-orange-50 rounded-xl shadow-lg p-12 border border-orange-100">
                    <h1 className="text-5xl font-bold mb-6 text-orange-600">
                        Ngữ pháp
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Khám phá phương pháp học Tiếng Anh đơn giản hiệu quả
                    </p>
                    <ModulesGrid modules={grammarSubModule} gridColumns="grid-cols-4" />
                </div>
            </main>
        </div>
    );
}