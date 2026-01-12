import { create } from 'zustand';
import api from '@/lib/api';

export interface StyleProfile {
  _id?: string;
  id?: string;
  schema_version: string;
  name: string;
  description?: string;
  tags: string[];
  style: any;
  intent?: any;
  negative?: any;
  usage_count?: number;
  is_template?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface StyleState {
  styles: StyleProfile[];
  loading: boolean;
  error: string | null;
  fetchStyles: (filters?: any) => Promise<void>;
  createStyle: (data: Partial<StyleProfile>) => Promise<void>;
  updateStyle: (id: string, data: Partial<StyleProfile>) => Promise<void>;
  deleteStyle: (id: string) => Promise<void>;
  getStyle: (id: string) => Promise<StyleProfile | null>;
  validateStyle: (styleJson: any) => Promise<{valid: boolean, errors: any[]}>;
}

export const useStyles = create<StyleState>((set, get) => ({
  styles: [],
  loading: false,
  error: null,
  fetchStyles: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/styles', { params: filters });
      set({ styles: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch styles', loading: false });
    }
  },
  createStyle: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post('/styles', data);
      await get().fetchStyles();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to create style', loading: false });
      throw error;
    }
  },
  updateStyle: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/styles/${id}`, data);
      await get().fetchStyles();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to update style', loading: false });
      throw error;
    }
  },
  deleteStyle: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/styles/${id}`);
      await get().fetchStyles();
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to delete style', loading: false });
      throw error;
    }
  },
  getStyle: async (id) => {
     try {
       const response = await api.get(`/styles/${id}`);
       return response.data;
     } catch (error) {
       return null;
     }
  },
  validateStyle: async (styleJson) => {
      try {
          const response = await api.post('/styles/validate', styleJson);
          return response.data;
      } catch (error) {
          return { valid: false, errors: ['Validation failed'] };
      }
  }
}));
