import { create } from 'zustand';
import api from '@/lib/api';

export interface Prompt {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  modal_type: 'text' | 'image' | 'video' | 'code' | 'audio' | 'other';
  content: any;
  style_profile_id?: string;
  tags: string[];
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

interface PromptState {
  prompts: Prompt[];
  loading: boolean;
  error: string | null;
  fetchPrompts: (filters?: any) => Promise<void>;
  createPrompt: (data: Partial<Prompt>) => Promise<void>;
  updatePrompt: (id: string, data: Partial<Prompt>) => Promise<void>;
  deletePrompt: (id: string) => Promise<void>;
  getPrompt: (id: string) => Promise<Prompt | null>;
}

export const usePrompts = create<PromptState>((set, get) => ({
  prompts: [],
  loading: false,
  error: null,
  fetchPrompts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/prompts', { params: filters });
      set({ prompts: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch prompts', loading: false });
    }
  },
  createPrompt: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/prompts', data);
      await get().fetchPrompts(); // Refresh list
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to create prompt', loading: false });
      throw error;
    }
  },
  updatePrompt: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/prompts/${id}`, data);
      await get().fetchPrompts();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to update prompt', loading: false });
      throw error;
    }
  },
  deletePrompt: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/prompts/${id}`);
      await get().fetchPrompts();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to delete prompt', loading: false });
      throw error;
    }
  },
  getPrompt: async (id) => {
     try {
       const response = await api.get(`/prompts/${id}`);
       return response.data;
     } catch (error) {
       return null;
     }
  }
}));
