import type { Topic } from "@/components/ui/vocabulary/TopicCard";
import type { VocabularyItem } from "@/components/ui/vocabulary/VocabularyCard";
import type { Level, Vocabulary, VocabularyTopic, WordCategory } from "@/types/flashcard.types";

type UiLevel = Topic["level"];

export function mapLevelToUi(level?: Level | string | null): UiLevel {
  if (!level) return "beginner";
  const normalized = String(level).trim().toUpperCase();
  switch (normalized) {
    case "BEGINNER":
    case "LEVEL_BEGINNER":
      return "beginner";
    case "INTERMEDIATE":
    case "LEVEL_INTERMEDIATE":
      return "intermediate";
    case "ADVANCED":
    case "LEVEL_ADVANCED":
      return "advanced";
    default:
      // If backend ever returns already-normalized UI values
      if (normalized === "BEGINNER") return "beginner";
      if (normalized === "INTERMEDIATE") return "intermediate";
      if (normalized === "ADVANCED") return "advanced";
      return "beginner";
  }
}

export function mapCategoryToVi(category?: WordCategory | string | null): string {
  if (!category) return "Khác";
  const normalized = String(category).trim().toUpperCase();
  switch (normalized) {
    case "NOUN":
      return "Danh từ";
    case "VERB":
      return "Động từ";
    case "ADJECTIVE":
      return "Tính từ";
    case "ADVERB":
      return "Trạng từ";
    case "OTHER":
      return "Khác";
    default:
      // If it's already Vietnamese label (e.g. "Danh từ") just return as-is
      return String(category);
  }
}

export function toUiTopic(topic: VocabularyTopic): Topic {
  const vocabCount = topic.vocabularyCount ?? topic.vocabularies?.length ?? 0;
  const level = mapLevelToUi(topic.level ?? null);

  return {
    id: topic.id,
    name: topic.name ?? "",
    nameEn: topic.nameEn ?? "",
    description: topic.description ?? "",
    icon: topic.icon ?? "📚",
    color: topic.color ?? "orange",
    gradientFrom: topic.gradientFrom ?? "from-orange-400",
    gradientTo: topic.gradientTo ?? "to-orange-600",
    vocabularyCount: vocabCount,
    level,
  };
}

export function toUiVocabularyItem(
  v: Vocabulary,
  opts?: { fallbackTopicId?: string; fallbackLevel?: Level | string | null }
): VocabularyItem {
  const level = mapLevelToUi(v.level ?? opts?.fallbackLevel ?? null);

  return {
    id: v.id,
    word: v.word ?? "",
    pronunciation: v.pronunciation ?? "",
    meaning: v.meaning ?? "",
    example: v.example ?? "",
    exampleTranslation: v.exampleTranslation ?? "",
    category: mapCategoryToVi(v.category ?? null),
    level,
    topic: v.topic ?? opts?.fallbackTopicId,
  };
}


