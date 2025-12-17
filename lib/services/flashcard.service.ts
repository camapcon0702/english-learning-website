import { API_CONFIG } from "@/lib/constants/app.constants";
import { ApiResponse, Vocabulary, VocabularyDTO, VocabularyTopic, VocabularyTopicDTO } from "@/types/flashcard.types";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}

/**
 * Get all vocabulary topics
 */
export async function getAllVocabularyTopicsApi(): Promise<ApiResponse<VocabularyTopic[]>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/api/vocabulary-topics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Failed to get vocabulary topics',
        detail: data.detail || data.message || 'An error occurred while fetching vocabulary topics',
      };
      throw error;
    }

    return data as ApiResponse<VocabularyTopic[]>;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

/**
 * Get vocabulary topic by ID
 */
export async function getVocabularyTopicByIdApi(id: string): Promise<ApiResponse<VocabularyTopic>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}/api/vocabulary-topics/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Failed to get vocabulary topic',
        detail: data.detail || data.message || 'An error occurred while fetching vocabulary topic',
      };
      throw error;
    }

    return data as ApiResponse<VocabularyTopic>;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

/**
 * Create vocabulary topic (admin only)
 */
export async function createVocabularyTopicApi(dto: VocabularyTopicDTO): Promise<ApiResponse<VocabularyTopic>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/vocabulary-topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Failed to create vocabulary topic',
        detail: data.detail || data.message || 'An error occurred while creating vocabulary topic',
      };
      throw error;
    }

    return data as ApiResponse<VocabularyTopic>;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

/**
 * Update vocabulary topic (admin only)
 */
export async function updateVocabularyTopicApi(id: string, dto: VocabularyTopicDTO): Promise<ApiResponse<VocabularyTopic>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/vocabulary-topics/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Failed to update vocabulary topic',
        detail: data.detail || data.message || 'An error occurred while updating vocabulary topic',
      };
      throw error;
    }

    return data as ApiResponse<VocabularyTopic>;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

/**
 * Delete vocabulary topic (admin only)
 */
export async function deleteVocabularyTopicApi(id: string): Promise<ApiResponse<void>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/vocabulary-topics/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Failed to delete vocabulary topic',
        detail: data.detail || data.message || 'An error occurred while deleting vocabulary topic',
      };
      throw error;
    }

    return data as ApiResponse<void>;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

/**
 * Create vocabulary (flash card) (admin only)
 */
export async function createVocabularyApi(topicId: string, dto: VocabularyDTO): Promise<ApiResponse<Vocabulary>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/vocabulary-topics/${topicId}/vocabularies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Failed to create vocabulary',
        detail: data.detail || data.message || 'An error occurred while creating vocabulary',
      };
      throw error;
    }

    return data as ApiResponse<Vocabulary>;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

/**
 * Update vocabulary (flash card) (admin only)
 */
export async function updateVocabularyApi(topicId: string, vocabularyId: string, dto: VocabularyDTO): Promise<ApiResponse<Vocabulary>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/vocabulary-topics/${topicId}/vocabularies/${vocabularyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Failed to update vocabulary',
        detail: data.detail || data.message || 'An error occurred while updating vocabulary',
      };
      throw error;
    }

    return data as ApiResponse<Vocabulary>;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

/**
 * Delete vocabulary (flash card) (admin only)
 */
export async function deleteVocabularyApi(topicId: string, vocabularyId: string): Promise<ApiResponse<void>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/vocabulary-topics/${topicId}/vocabularies/${vocabularyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message: data.message || 'Failed to delete vocabulary',
        detail: data.detail || data.message || 'An error occurred while deleting vocabulary',
      };
      throw error;
    }

    return data as ApiResponse<void>;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    const networkError: ApiError = {
      status: 0,
      message: 'Network error',
      detail: error.message || 'Unable to connect to the server. Please check your connection.',
    };
    throw networkError;
  }
}

