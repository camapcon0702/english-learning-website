"use client";

import React, { useState, useEffect } from "react";
import {
  getAllVocabularyTopicsApi,
  createVocabularyTopicApi,
  updateVocabularyTopicApi,
  deleteVocabularyTopicApi,
  getVocabularyTopicByIdApi,
  createVocabularyApi,
  updateVocabularyApi,
  deleteVocabularyApi,
} from "@/lib/services/flashcard.service";
import TopicIcon from "@/components/ui/vocabulary/TopicIcon";
import {
  VocabularyTopic,
  Vocabulary,
  VocabularyDTO,
  VocabularyTopicDTO,
  Level,
  WordCategory,
} from "@/types/flashcard.types";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function FlashcardManagementPage() {
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Topic modal states
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState<VocabularyTopic | null>(null);
  const [topicForm, setTopicForm] = useState<VocabularyTopicDTO>({
    name: "",
    nameEn: "",
    description: "",
    icon: "",
    color: "",
    gradientFrom: "",
    gradientTo: "",
    level: Level.BEGINNER,
  });

  // Vocabulary modal states
  const [showVocabularyModal, setShowVocabularyModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<VocabularyTopic | null>(null);
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);
  const [vocabularyForm, setVocabularyForm] = useState<VocabularyDTO>({
    word: "",
    pronunciation: "",
    meaning: "",
    example: "",
    exampleTranslation: "",
    category: WordCategory.NOUN,
    level: Level.BEGINNER,
  });

  // Expanded topics
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllVocabularyTopicsApi();
      if (response.data) {
        setTopics(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách chủ đề");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = () => {
    setEditingTopic(null);
    setTopicForm({
      name: "",
      nameEn: "",
      description: "",
      icon: "",
      color: "",
      gradientFrom: "",
      gradientTo: "",
      level: Level.BEGINNER,
    });
    setShowTopicModal(true);
  };

  const handleEditTopic = (topic: VocabularyTopic) => {
    setEditingTopic(topic);
    setTopicForm({
      name: topic.name || "",
      nameEn: topic.nameEn || "",
      description: topic.description || "",
      icon: topic.icon || "",
      color: topic.color || "",
      gradientFrom: topic.gradientFrom || "",
      gradientTo: topic.gradientTo || "",
      level: topic.level || Level.BEGINNER,
    });
    setShowTopicModal(true);
  };

  const handleSaveTopic = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (editingTopic) {
        const response = await updateVocabularyTopicApi(editingTopic.id, topicForm);
        setSuccess("Cập nhật chủ đề thành công!");
        await loadTopics();
      } else {
        const response = await createVocabularyTopicApi(topicForm);
        setSuccess("Tạo chủ đề thành công!");
        await loadTopics();
      }

      setShowTopicModal(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi lưu chủ đề");
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chủ đề này? Tất cả flash card trong chủ đề sẽ bị xóa.")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await deleteVocabularyTopicApi(topicId);
      setSuccess("Xóa chủ đề thành công!");
      await loadTopics();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi xóa chủ đề");
    }
  };

  const handleCreateVocabulary = async (topic: VocabularyTopic) => {
    // Load full topic data first
    try {
      const response = await getVocabularyTopicByIdApi(topic.id);
      const fullTopic = response.data;
      setSelectedTopic(fullTopic);
      setEditingVocabulary(null);
      setVocabularyForm({
        word: "",
        pronunciation: "",
        meaning: "",
        example: "",
        exampleTranslation: "",
        category: WordCategory.NOUN,
        level: topic.level || Level.BEGINNER,
      });
      setShowVocabularyModal(true);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin chủ đề");
    }
  };

  const handleEditVocabulary = async (topic: VocabularyTopic, vocabulary: Vocabulary) => {
    try {
      const response = await getVocabularyTopicByIdApi(topic.id);
      const fullTopic = response.data;
      setSelectedTopic(fullTopic);
      setEditingVocabulary(vocabulary);
      setVocabularyForm({
        word: vocabulary.word || "",
        pronunciation: vocabulary.pronunciation || "",
        meaning: vocabulary.meaning || "",
        example: vocabulary.example || "",
        exampleTranslation: vocabulary.exampleTranslation || "",
        category: vocabulary.category || WordCategory.NOUN,
        level: vocabulary.level || Level.BEGINNER,
      });
      setShowVocabularyModal(true);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin flash card");
    }
  };

  const handleSaveVocabulary = async () => {
    if (!selectedTopic) return;

    try {
      setError(null);
      setSuccess(null);

      if (editingVocabulary) {
        await updateVocabularyApi(selectedTopic.id, editingVocabulary.id, vocabularyForm);
        setSuccess("Cập nhật flash card thành công!");
      } else {
        await createVocabularyApi(selectedTopic.id, vocabularyForm);
        setSuccess("Tạo flash card thành công!");
      }

      setShowVocabularyModal(false);
      await loadTopics();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi lưu flash card");
    }
  };

  const handleDeleteVocabulary = async (topic: VocabularyTopic, vocabularyId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa flash card này?")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await deleteVocabularyApi(topic.id, vocabularyId);
      setSuccess("Xóa flash card thành công!");
      await loadTopics();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi xóa flash card");
    }
  };

  const toggleTopicExpansion = (topicId: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  const getLevelLabel = (level?: Level) => {
    switch (level) {
      case Level.BEGINNER:
        return "Cơ bản";
      case Level.INTERMEDIATE:
        return "Trung bình";
      case Level.ADVANCED:
        return "Nâng cao";
      default:
        return "N/A";
    }
  };

  const getCategoryLabel = (category?: WordCategory) => {
    switch (category) {
      case WordCategory.NOUN:
        return "Danh từ";
      case WordCategory.VERB:
        return "Động từ";
      case WordCategory.ADJECTIVE:
        return "Tính từ";
      case WordCategory.ADVERB:
        return "Trạng từ";
      case WordCategory.OTHER:
        return "Khác";
      default:
        return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-orange-100 p-8">
            <main className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-orange-50 rounded-xl shadow-lg p-8 border border-orange-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-orange-600">
                Quản Lý Flash Card
                    </h1>
              <p className="text-lg text-gray-600">
                Quản lý chủ đề và flash card từ vựng
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadTopics}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshIcon className="w-5 h-5" />
                <span>Làm mới</span>
              </button>
              <button
                onClick={handleCreateTopic}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <AddIcon className="w-5 h-5" />
                <span>Tạo chủ đề mới</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {topics.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600 text-lg">Chưa có chủ đề nào. Hãy tạo chủ đề đầu tiên!</p>
            </div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Topic Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
                        <TopicIcon icon={topic.icon} alt={topic.name} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {topic.name}
                        </h3>
                        {topic.nameEn && (
                          <p className="text-gray-600 italic mb-2">{topic.nameEn}</p>
                        )}
                        {topic.description && (
                          <p className="text-gray-600 text-sm mb-2">{topic.description}</p>
                        )}
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                            {topic.vocabularyCount || 0} flash card
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {getLevelLabel(topic.level)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTopicExpansion(topic.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedTopics.has(topic.id) ? (
                          <ExpandLessIcon className="w-6 h-6" />
                        ) : (
                          <ExpandMoreIcon className="w-6 h-6" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditTopic(topic)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vocabularies List */}
                {expandedTopics.has(topic.id) && (
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Danh sách Flash Card
                      </h4>
                      <button
                        onClick={() => handleCreateVocabulary(topic)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                      >
                        <AddIcon className="w-4 h-4" />
                        <span>Thêm flash card</span>
                      </button>
                    </div>

                    {topic.vocabularies && topic.vocabularies.length > 0 ? (
                      <div className="space-y-3">
                        {topic.vocabularies.map((vocab) => (
                          <div
                            key={vocab.id}
                            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h5 className="text-lg font-semibold text-gray-900">
                                  {vocab.word}
                                </h5>
                                {vocab.pronunciation && (
                                  <span className="text-gray-500 text-sm">
                                    [{vocab.pronunciation}]
                                  </span>
                                )}
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                  {getCategoryLabel(vocab.category)}
                                </span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                  {getLevelLabel(vocab.level)}
                                </span>
                              </div>
                              {vocab.meaning && (
                                <p className="text-gray-700 mb-1">
                                  <span className="font-medium">Nghĩa: </span>
                                  {vocab.meaning}
                                </p>
                              )}
                              {vocab.example && (
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Ví dụ: </span>
                                  {vocab.example}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleEditVocabulary(topic, vocab)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <EditIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteVocabulary(topic, vocab.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <DeleteIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Chưa có flash card nào trong chủ đề này.</p>
                        <button
                          onClick={() => handleCreateVocabulary(topic)}
                          className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Tạo flash card đầu tiên
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Topic Modal */}
        {showTopicModal && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTopic ? "Chỉnh sửa chủ đề" : "Tạo chủ đề mới"}
                </h2>
                <button
                  onClick={() => setShowTopicModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ đề *
                  </label>
                  <input
                    type="text"
                    value={topicForm.name}
                    onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên tiếng Anh
                  </label>
                  <input
                    type="text"
                    value={topicForm.nameEn}
                    onChange={(e) => setTopicForm({ ...topicForm, nameEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={topicForm.description}
                    onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      value={topicForm.icon}
                      onChange={(e) => setTopicForm({ ...topicForm, icon: e.target.value })}
                      placeholder="📚"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cấp độ
                    </label>
                    <select
                      value={topicForm.level}
                      onChange={(e) => setTopicForm({ ...topicForm, level: e.target.value as Level })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value={Level.BEGINNER}>Cơ bản</option>
                      <option value={Level.INTERMEDIATE}>Trung bình</option>
                      <option value={Level.ADVANCED}>Nâng cao</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu sắc
                  </label>
                  <input
                    type="text"
                    value={topicForm.color}
                    onChange={(e) => setTopicForm({ ...topicForm, color: e.target.value })}
                    placeholder="#FF6B6B"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient từ
                    </label>
                    <input
                      type="text"
                      value={topicForm.gradientFrom}
                      onChange={(e) => setTopicForm({ ...topicForm, gradientFrom: e.target.value })}
                      placeholder="from-orange-400"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient đến
                    </label>
                    <input
                      type="text"
                      value={topicForm.gradientTo}
                      onChange={(e) => setTopicForm({ ...topicForm, gradientTo: e.target.value })}
                      placeholder="to-orange-600"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowTopicModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveTopic}
                  disabled={!topicForm.name}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vocabulary Modal */}
        {showVocabularyModal && selectedTopic && (
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingVocabulary ? "Chỉnh sửa flash card" : "Tạo flash card mới"}
                </h2>
                <button
                  onClick={() => setShowVocabularyModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Chủ đề:</p>
                  <p className="font-semibold text-gray-900">{selectedTopic.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Từ vựng *
                  </label>
                  <input
                    type="text"
                    value={vocabularyForm.word}
                    onChange={(e) => setVocabularyForm({ ...vocabularyForm, word: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phiên âm
                  </label>
                  <input
                    type="text"
                    value={vocabularyForm.pronunciation}
                    onChange={(e) => setVocabularyForm({ ...vocabularyForm, pronunciation: e.target.value })}
                    placeholder="/wɜːrd/"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nghĩa
                  </label>
                  <input
                    type="text"
                    value={vocabularyForm.meaning}
                    onChange={(e) => setVocabularyForm({ ...vocabularyForm, meaning: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ví dụ
                  </label>
                  <textarea
                    value={vocabularyForm.example}
                    onChange={(e) => setVocabularyForm({ ...vocabularyForm, example: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bản dịch ví dụ
                  </label>
                  <textarea
                    value={vocabularyForm.exampleTranslation}
                    onChange={(e) => setVocabularyForm({ ...vocabularyForm, exampleTranslation: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại từ
                    </label>
                    <select
                      value={vocabularyForm.category}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, category: e.target.value as WordCategory })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value={WordCategory.NOUN}>Danh từ</option>
                      <option value={WordCategory.VERB}>Động từ</option>
                      <option value={WordCategory.ADJECTIVE}>Tính từ</option>
                      <option value={WordCategory.ADVERB}>Trạng từ</option>
                      <option value={WordCategory.OTHER}>Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cấp độ
                    </label>
                    <select
                      value={vocabularyForm.level}
                      onChange={(e) => setVocabularyForm({ ...vocabularyForm, level: e.target.value as Level })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value={Level.BEGINNER}>Cơ bản</option>
                      <option value={Level.INTERMEDIATE}>Trung bình</option>
                      <option value={Level.ADVANCED}>Nâng cao</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowVocabularyModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveVocabulary}
                  disabled={!vocabularyForm.word}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SaveIcon className="w-5 h-5" />
                  <span>Lưu</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
        </div>
    );
}
