import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ───
export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

// ─── Profile ───
export const profileAPI = {
  get: () => api.get('/api/profile/'),
  update: (data) => api.put('/api/profile/', data),
  getAbout: () => api.get('/api/profile/about'),
  updateAbout: (data) => api.put('/api/profile/about', data),
  getSettings: () => api.get('/api/profile/settings'),
  updateSettings: (data) => api.put('/api/profile/settings', data),
};

// ─── Content ───
export const contentAPI = {
  // Skills
  getSkills: () => api.get('/api/content/skills'),
  createSkill: (data) => api.post('/api/content/skills', data),
  updateSkill: (id, data) => api.put(`/api/content/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/api/content/skills/${id}`),

  // Experience
  getExperience: () => api.get('/api/content/experience'),
  createExperience: (data) => api.post('/api/content/experience', data),
  updateExperience: (id, data) => api.put(`/api/content/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/api/content/experience/${id}`),

  // Education
  getEducation: () => api.get('/api/content/education'),
  createEducation: (data) => api.post('/api/content/education', data),
  updateEducation: (id, data) => api.put(`/api/content/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/api/content/education/${id}`),

  // Projects
  getProjects: () => api.get('/api/content/projects'),
  createProject: (data) => api.post('/api/content/projects', data),
  updateProject: (id, data) => api.put(`/api/content/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/content/projects/${id}`),

  // Certifications
  getCertifications: () => api.get('/api/content/certifications'),
  createCertification: (data) => api.post('/api/content/certifications', data),
  updateCertification: (id, data) => api.put(`/api/content/certifications/${id}`, data),
  deleteCertification: (id) => api.delete(`/api/content/certifications/${id}`),

  // Testimonials
  getTestimonials: () => api.get('/api/content/testimonials'),
  createTestimonial: (data) => api.post('/api/content/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/api/content/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/api/content/testimonials/${id}`),
};

// ─── Contact ───
export const contactAPI = {
  send: (data) => api.post('/api/contact/', data),
  getAll: () => api.get('/api/contact/'),
  markRead: (id) => api.put(`/api/contact/${id}/read`),
  delete: (id) => api.delete(`/api/contact/${id}`),
};

// ─── Upload ───
export const uploadAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (publicId) => api.delete(`/api/upload/?public_id=${publicId}`),
};

// ─── Chatbot ───
export const chatbotAPI = {
  chat: (message) => api.post('/api/chatbot/chat', { message }),
  uploadVectors: (data) => api.post('/api/chatbot/upload-vectors', data),
  deleteVectors: () => api.delete('/api/chatbot/vectors'),
  // LLM Settings
  getLLMSettings: () => api.get('/api/chatbot/llm-settings'),
  updateLLMSettings: (data) => api.put('/api/chatbot/llm-settings', data),
  // Chunk Management
  getChunks: (skip = 0, limit = 50) => api.get(`/api/chatbot/chunks?skip=${skip}&limit=${limit}`),
  deleteChunk: (chunkId) => api.delete(`/api/chatbot/chunks/${encodeURIComponent(chunkId)}`),
};

export default api;
