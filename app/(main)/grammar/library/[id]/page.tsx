"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DOMPurify from "dompurify";
import type { Grammar } from "@/types/grammar.types";
import { getGrammarByIdApi } from "@/lib/services/grammar.service";

export default function GrammarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grammar, setGrammar] = useState<Grammar | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getGrammarByIdApi(id);
      setGrammar(res.data);
    } catch (err: any) {
      setGrammar(null);
      setError(err?.detail || err?.message || "Không thể tải nội dung ngữ pháp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải nội dung...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!grammar) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy ngữ pháp</h3>
            <p className="text-gray-600 mb-6">{error || "Nội dung bạn đang tìm không tồn tại."}</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => router.push("/grammar/library")}
                className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Quay lại thư viện
              </button>
              <button
                onClick={load}
                className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/grammar/library"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
        >
          <ArrowBackIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại thư viện</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{grammar.name}</h1>
          {grammar.description && <p className="text-gray-600">{grammar.description}</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div
          className="wysiwyg-content text-gray-900"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(grammar.content || "") }}
        />
      </div>
    </div>
  );
}


