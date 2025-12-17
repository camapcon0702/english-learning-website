import { ModuleCardProps } from "@/components/ui/dashboard/ModuleCard";
import ModulesGrid from "@/components/ui/dashboard/ModulesGrid";
import Link from "next/link";

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
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-3 text-gray-900">
                    Ngữ pháp Tiếng Anh
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                    Học và nắm vững các quy tắc ngữ pháp cơ bản và nâng cao. 
                    Từ các thì cơ bản đến cấu trúc câu phức tạp.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                    Chủ đề ngữ pháp
                </h2>
                <ModulesGrid modules={grammarSubModule} gridColumns="grid-cols-3" />
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Thư viện công thức ngữ pháp
                        </h2>
                        <p className="text-gray-600 mt-2 max-w-3xl">
                            Xem danh sách các công thức/ngữ pháp được biên soạn trong hệ thống (nội dung WYSIWYG).
                        </p>
                    </div>
                    <Link
                        href="/grammar/library"
                        className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Mở thư viện
                    </Link>
                </div>
            </div>
        </div>
    );
}