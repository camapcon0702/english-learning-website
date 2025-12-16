"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TopicVocabularyPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topic as string;

  useEffect(() => {
    router.replace(`/flashcard/${topicId}`);
  }, [topicId, router]);

  return null;
}
