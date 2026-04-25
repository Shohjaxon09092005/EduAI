const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

import { Course } from '@/types';

// wrapper around fetch that automatically adds Bearer token from localStorage
// and upon 401 attempts to refresh access token once. also logs errors for debugging.
interface StoredTokens {
  access?: string;
  refresh?: string;
}

function getStoredTokens(): StoredTokens {
  try {
    return JSON.parse(localStorage.getItem('auth_tokens') || '{}');
  } catch {
    return {};
  }
}

async function apiFetch(
  path: string,
  opts: RequestInit = {},
): Promise<Response> {
  const url = `${API_BASE_URL}${path}`;
  const tokens = getStoredTokens();
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> || {}),
  };
  if (tokens.access) {
    headers.Authorization = `Bearer ${tokens.access}`;
  }
  opts.headers = headers;

  let response = await fetch(url, opts);
  if (response.status === 401 && tokens.refresh) {
    console.warn('access token expired, attempting refresh');
    try {
      const newToken = await refreshAccessToken(tokens.refresh);
      tokens.access = newToken.access;
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
      // retry original request with new token
      headers.Authorization = `Bearer ${tokens.access}`;
      opts.headers = headers;
      response = await fetch(url, opts);
    } catch (err) {
      console.error('token refresh failed', err);
      // let original 401 propagate so caller can act (likely log out)
    }
  }
  if (response.status === 401) {
    // persistent unauthorized, clear tokens and refresh page to trigger login
    localStorage.removeItem('auth_tokens');
    window.location.reload();
  }
  return response;
}

export interface User {
  name: string;
  username: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "instructor" | "student";
  level: number;
  xp: number;
  avatar?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

// Courses
export interface ApiCourse {
  id: number;
  title: string;
  description: string;
  instructor: number;
  instructor_name: string;
  thumbnail?: string;
  category: {
    id: number;
    name: string;
    description: string;
    created_at: string;
  } | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  total_lessons: number;
  created_at: string;
}

export interface CoursePayload {
  title: string;
  description: string;
  category_id?: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  total_lessons: number;
  thumbnail?: File | string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiFetch(`/categories/`, { method: 'GET' });
  if (!response.ok) {
    const txt = await response.text().catch(() => '');
    console.warn('getCategories failed', response.status, txt);
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const createCategory = async (data: CategoryPayload): Promise<Category> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const body = JSON.stringify(data);
  const response = await apiFetch(`/categories/`, {
    method: 'POST',
    headers,
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create category');
  }
  return response.json();
};

export const createCourse = async (
  data: CoursePayload,
  instructorId?: number | string
): Promise<Course> => {
  // determine whether we need multipart
  let body: BodyInit;
  const headers: Record<string, string> = {};

  if (data.thumbnail instanceof File) {
    const form = new FormData();
    form.append('title', data.title);
    form.append('description', data.description);
    if (data.category_id != null) form.append('category_id', String(data.category_id));
    form.append('difficulty', data.difficulty);
    form.append('total_lessons', String(data.total_lessons));
    form.append('thumbnail', data.thumbnail);
    if (instructorId !== undefined && instructorId !== null && instructorId !== '') {
      form.append('instructor', String(instructorId));
    }
    body = form;
  } else {
    headers['Content-Type'] = 'application/json';
    const bodyObj: any = { ...data };
    if (instructorId !== undefined && instructorId !== null && instructorId !== '') bodyObj.instructor = Number(instructorId);
    body = JSON.stringify(bodyObj);
  }

  const response = await apiFetch(`/courses/`, {
    method: 'POST',
    headers,
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create course");
  }
  const c: ApiCourse = await response.json();
  const host = API_BASE_URL.replace(/\/api\/?$/, '');
  return {
    id: String(c.id),
    title: c.title,
    description: c.description,
    instructorId: String(c.instructor),
    instructorName: c.instructor_name,
    thumbnail: c.thumbnail ? `${c.thumbnail}` : undefined,
    category: c.category?.name || "",
    difficulty: c.difficulty,
    totalLessons: c.total_lessons,
    completedLessons: 0,
    progress: 0,
  };
};


export const updateCourse = async (
  id: string,
  data: Partial<CoursePayload>,
  instructorId?: number | string
): Promise<Course> => {
  let body: BodyInit;
  const headers: Record<string, string> = {};

  if (data.thumbnail instanceof File) {
    const form = new FormData();
    if (data.title) form.append('title', data.title);
    if (data.description) form.append('description', data.description);
    if (data.category_id != null) form.append('category_id', String(data.category_id));
    if (data.difficulty) form.append('difficulty', data.difficulty);
    if (data.total_lessons != null) form.append('total_lessons', String(data.total_lessons));
    form.append('thumbnail', data.thumbnail);
    if (instructorId !== undefined && instructorId !== null && instructorId !== '') {
      form.append('instructor', String(instructorId));
    }
    body = form;
  } else {
    headers['Content-Type'] = 'application/json';
    const bodyObj: any = { ...data };
    if (instructorId !== undefined && instructorId !== null && instructorId !== '') bodyObj.instructor = Number(instructorId);
    body = JSON.stringify(bodyObj);
  }

  const response = await apiFetch(`/courses/${id}/`, {
    method: 'PUT',
    headers,
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update course");
  }
  const c: ApiCourse = await response.json();
  const host = API_BASE_URL.replace(/\/api\/?$/, '');
  return {
    id: String(c.id),
    title: c.title,
    description: c.description,
    instructorId: String(c.instructor),
    instructorName: c.instructor_name,
    thumbnail: c.thumbnail ? `${c.thumbnail}` : undefined,
    category: c.category?.name || "",
    difficulty: c.difficulty,
    totalLessons: c.total_lessons,
    completedLessons: 0,
    progress: 0,
  };
};

export const deleteCourse = async (id: string): Promise<void> => {
  const response = await apiFetch(`/courses/${id}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete course');
  }
};
export const getCourses = async (): Promise<Course[]> => {
  const response = await apiFetch(`/courses/`, { method: 'GET' });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.warn('getCourses failed', response.status, text);
    throw new Error(`Failed to fetch courses (${response.status})`);
  }
  const data: ApiCourse[] = await response.json();
  // map backend shape to frontend Course type
  const host = API_BASE_URL.replace(/\/api\/?$/, '');
  return data.map((c) => ({
    id: String(c.id),
    title: c.title,
    description: c.description,
    instructorId: String(c.instructor),
    instructorName: c.instructor_name,
    thumbnail: c.thumbnail ? `${c.thumbnail}` : undefined,
    category: c.category?.name || "",
    difficulty: c.difficulty,
    totalLessons: c.total_lessons,
    completedLessons: 0, // progress info not provided yet
    progress: 0,
  }));
};

// Register
export const registerUser = async (
  email: string,
  password: string,
  role: "admin" | "instructor" | "student",
  firstName?: string,
  lastName?: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      role,
      first_name: firstName || "",
      last_name: lastName || "",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.email?.[0] || "Registration failed");
  }

  return response.json();
};

// Login
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  return response.json();
};

// Get current user
export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};

// Refresh token
export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ access: string }> => {
  const response = await fetch(
    `${API_BASE_URL || "http://localhost:8000"}/token/refresh/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    }
  );

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
};

// Resources
export interface ApiResource {
  id: number;
  title: string;
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'link';
  file?: string;
  url?: string;
  uploaded_at: string;
  size?: string;
  ai_topics?: string;
  course: number;
  category?: {
    id: number;
    name: string;
    description: string;
    created_at: string;
  };
}

export interface ResourcePayload {
  title: string;
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'link';
  url?: string;
  size?: string;
  ai_topics?: string;
  course: number;
  category_id?: number;
  file?: File;
}

// Lessons
export interface ApiLesson {
  id: number;
  title: string;
  description: string;
  course: number;
  order: number;
  duration: number;
  resources?: ApiLessonResource[];
  created_at: string;
}

export interface ApiLessonResource {
  id: number;
  title: string;
  type: 'video' | 'pdf' | 'pptx' | 'docx' | 'link';
  file?: string;
  url?: string;
  description: string;
  order: number;
  created_at: string;
}

export interface LessonPayload {
  title: string;
  description: string;
  course: number;
  order: number;
  duration: number;
}

export interface LessonResourcePayload {
  title: string;
  type: 'video' | 'pdf' | 'pptx' | 'docx' | 'link';
  lesson: number;
  url?: string;
  description: string;
  order: number;
  file?: File;
}

import { Resource, Lesson, LessonResource } from '@/types';

// Lesson API Helpers
export const getLessons = async (courseId: number): Promise<Lesson[]> => {
  const response = await apiFetch(`/lessons/?course=${courseId}`, { method: 'GET' });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.warn('getLessons failed', response.status, text);
    throw new Error(`Failed to fetch lessons: ${text}`);
  }
  const data: ApiLesson[] = await response.json();
  console.log('API Lessons response:', data);
  
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
  console.log('Base URL for resources:', baseUrl);
  
  return data.map((l) => ({
    id: String(l.id),
    title: l.title,
    description: l.description,
    courseId: String(l.course),
    order: l.order,
    duration: l.duration,
    resources: l.resources?.map((r) => {
      // Ensure URL is properly constructed
      let url: string | undefined;
      if (r.url && r.url.trim()) {
        url = r.url;
      } else if (r.file) {
        // File field contains the relative path, need to prefix with base URL
        url = `${r.file}`;
      }
      
      console.log(`Resource "${r.title}": url=${r.url}, file=${r.file}, final=${url}`);
      
      return {
        id: String(r.id),
        title: r.title,
        type: r.type,
        url: url,
        description: r.description,
        order: r.order,
      };
    }) || [],
  }));
};

export const createLesson = async (data: LessonPayload): Promise<Lesson> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const body = JSON.stringify(data);

  const response = await apiFetch(`/lessons/`, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create lesson');
  }

  const l: ApiLesson = await response.json();
  return {
    id: String(l.id),
    title: l.title,
    description: l.description,
    courseId: String(l.course),
    order: l.order,
    duration: l.duration,
  };
};

export const createLessonResource = async (data: LessonResourcePayload): Promise<LessonResource> => {
  const headers: Record<string, string> = {};
  let body: BodyInit;

  if (data.file instanceof File) {
    const form = new FormData();
    form.append('title', data.title);
    form.append('type', data.type);
    form.append('lesson', String(data.lesson));
    if (data.url) form.append('url', data.url);
    form.append('description', data.description);
    form.append('order', String(data.order));
    form.append('file', data.file);
    body = form;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  const response = await apiFetch(`/lesson-resources/`, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create lesson resource');
  }

  const r: ApiLessonResource = await response.json();
  console.log('Created lesson resource:', r);
  
  // Ensure URL is properly constructed
  let url: string | undefined;
  if (r.url && r.url.trim()) {
    url = r.url;
  } else if (r.file) {
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    url = `${baseUrl}${r.file}`;
  }
  
  return {
    id: String(r.id),
    title: r.title,
    type: r.type,
    url: url,
    description: r.description,
    order: r.order,
  };
};

export const updateLesson = async (id: string, data: Partial<LessonPayload>): Promise<Lesson> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const body = JSON.stringify(data);

  const response = await apiFetch(`/lessons/${id}/`, {
    method: 'PUT',
    headers,
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update lesson');
  }

  const l: ApiLesson = await response.json();
  return {
    id: String(l.id),
    title: l.title,
    description: l.description,
    courseId: String(l.course),
    order: l.order,
    duration: l.duration,
  };
};

export const deleteLesson = async (id: string): Promise<void> => {
  const response = await apiFetch(`/lessons/${id}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to delete lesson');
  }
};

export const updateLessonResource = async (id: string, data: Partial<LessonResourcePayload>): Promise<LessonResource> => {
  const headers: Record<string, string> = {};
  let body: BodyInit;

  if (data.file instanceof File) {
    const form = new FormData();
    if (data.title) form.append('title', data.title);
    if (data.type) form.append('type', data.type);
    if (data.lesson) form.append('lesson', String(data.lesson));
    if (data.url) form.append('url', data.url);
    if (data.description) form.append('description', data.description);
    if (data.order !== undefined) form.append('order', String(data.order));
    form.append('file', data.file);
    body = form;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  const response = await apiFetch(`/lesson-resources/${id}/`, {
    method: 'PUT',
    headers,
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update lesson resource');
  }

  const r: ApiLessonResource = await response.json();
  console.log('Updated lesson resource:', r);
  
  // Ensure URL is properly constructed
  let url: string | undefined;
  if (r.url && r.url.trim()) {
    url = r.url;
  } else if (r.file) {
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    url = `${r.file}`;
  }
  
  return {
    id: String(r.id),
    title: r.title,
    type: r.type,
    url: url,
    description: r.description,
    order: r.order,
  };
};

export const deleteLessonResource = async (id: string): Promise<void> => {
  const response = await apiFetch(`/lesson-resources/${id}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to delete lesson resource');
  }
};

// Tests
export interface ApiQuestion {
  id: number;
  text: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface ApiTest {
  id: number;
  title: string;
  course: number;
  course_title?: string;
  duration: number;
  ai_generated: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  questions?: ApiQuestion[];
}

export interface TestPayload {
  title: string;
  course: number;
  duration: number;
  ai_generated?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  questions?: ApiQuestion[];
}

import { Test, Question } from '@/types';

export const getTests = async (courseId?: number): Promise<Test[]> => {
  const url = courseId ? `/tests/?course=${courseId}` : '/tests/';
  const response = await apiFetch(url, { method: 'GET' });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.warn('getTests failed', response.status, text);
    throw new Error(`Failed to fetch tests: ${text}`);
  }
  const data: ApiTest[] = await response.json();
  return data.map((t) => ({
    id: String(t.id),
    title: t.title,
    courseId: String(t.course),
    // note: course_title may be provided by serializer for display purposes
    courseTitle: t.course_title,
    duration: t.duration,
    aiGenerated: t.ai_generated,
    difficulty: t.difficulty,
    questions: t.questions?.map((q) => ({
      id: String(q.id),
      text: q.text,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
    })) || [],
  }));
};

export const getTest = async (id: string): Promise<Test> => {
  const response = await apiFetch(`/tests/${id}/`, { method: 'GET' });
  if (!response.ok) {
    const err = await response.text().catch(() => '');
    throw new Error(err || 'Failed to fetch test');
  }
  const t: ApiTest = await response.json();
  return {
    id: String(t.id),
    title: t.title,
    courseId: String(t.course),
    duration: t.duration,
    aiGenerated: t.ai_generated,
    difficulty: t.difficulty,
    questions: t.questions?.map((q) => ({
      id: String(q.id),
      text: q.text,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
    })) || [],
  };
};

export const createTest = async (data: TestPayload): Promise<Test> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const body = JSON.stringify(data);
  const response = await apiFetch(`/tests/`, {
    method: 'POST',
    headers,
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create test');
  }
  const t: ApiTest = await response.json();
  return {
    id: String(t.id),
    title: t.title,
    courseId: String(t.course),
    courseTitle: t.course_title,
    duration: t.duration,
    aiGenerated: t.ai_generated,
    difficulty: t.difficulty,
    questions: t.questions?.map((q) => ({
      id: String(q.id),
      text: q.text,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
    })) || [],
  };
};

export const updateTest = async (id: string, data: Partial<TestPayload>): Promise<Test> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const body = JSON.stringify(data);
  const response = await apiFetch(`/tests/${id}/`, {
    method: 'PUT',
    headers,
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update test');
  }
  const t: ApiTest = await response.json();
  return {
    id: String(t.id),
    title: t.title,
    courseId: String(t.course),
    courseTitle: t.course_title,
    duration: t.duration,
    aiGenerated: t.ai_generated,
    difficulty: t.difficulty,
    questions: t.questions?.map((q) => ({
      id: String(q.id),
      text: q.text,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation,
    })) || [],
  };
};

export const deleteTest = async (id: string): Promise<void> => {
  const response = await apiFetch(`/tests/${id}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete test');
  }
};

export const getResources = async (courseId?: number): Promise<Resource[]> => {
  let path = `/resources/`;
  if (courseId) {
    path += `?course=${courseId}`;
  }
  const response = await apiFetch(path, { method: 'GET' });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.warn('getResources failed', { path, status: response.status, body: text });
    throw new Error(`Failed to fetch resources (${response.status}): ${text}`);
  }
  const data: ApiResource[] = await response.json();
  return data.map((r) => ({
    id: String(r.id),
    title: r.title,
    type: r.type,
    url: r.url || r.file || '',
    uploadedAt: new Date(r.uploaded_at),
    size: r.size,
    aiTopics: Array.isArray(r.ai_topics)
  ? r.ai_topics.map((t: string) => String(t).trim()).filter(Boolean)
  : r.ai_topics
  ? String(r.ai_topics).split(',').map(t => t.trim()).filter(Boolean)
  : [],
    courseId: String(r.course),
    category: r.category?.name || 'Boshqa',
  }));
};

export const createResource = async (
  data: ResourcePayload
): Promise<Resource> => {
  const headers: Record<string, string> = {};

  let body: BodyInit;

  if (data.file instanceof File) {
    const form = new FormData();
    form.append('title', data.title);
    form.append('type', data.type);
    form.append('course', String(data.course));
    if (data.url) form.append('url', data.url);
    if (data.size) form.append('size', data.size);
    if (data.ai_topics) form.append('ai_topics', data.ai_topics);
    if (data.category_id != null) form.append('category_id', String(data.category_id));
    form.append('file', data.file);
    body = form;
  } else {
    headers['Content-Type'] = 'application/json';
    const bodyObj: any = {
      title: data.title,
      type: data.type,
      course: data.course,
    };
    if (data.url) bodyObj.url = data.url;
    if (data.size) bodyObj.size = data.size;
    if (data.ai_topics) bodyObj.ai_topics = data.ai_topics;
    if (data.category_id != null) bodyObj.category_id = data.category_id;
    body = JSON.stringify(bodyObj);
  }

  const response = await apiFetch(`/resources/`, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create resource');
  }

  const r: ApiResource = await response.json();
  return {
    id: String(r.id),
    title: r.title,
    type: r.type,
    url: r.url || r.file || '',
    uploadedAt: new Date(r.uploaded_at),
    size: r.size,
    aiTopics: Array.isArray(r.ai_topics)
  ? r.ai_topics.map((t: string) => String(t).trim()).filter(Boolean)
  : r.ai_topics
  ? String(r.ai_topics).split(',').map(t => t.trim()).filter(Boolean)
  : [],
    courseId: String(r.course),
    category: r.category?.name || 'Boshqa',
  };
};

export const updateResource = async (
  id: string,
  data: Partial<ResourcePayload>
): Promise<Resource> => {
  const headers: Record<string, string> = {};

  let body: BodyInit;

  if (data.file instanceof File) {
    const form = new FormData();
    if (data.title) form.append('title', data.title);
    if (data.type) form.append('type', data.type);
    if (data.course) form.append('course', String(data.course));
    if (data.url) form.append('url', data.url);
    if (data.size) form.append('size', data.size);
    if (data.ai_topics) form.append('ai_topics', data.ai_topics);
    if (data.category_id) form.append('category_id', String(data.category_id));
    form.append('file', data.file);
    body = form;
  } else {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    body = JSON.stringify(data);
  }

  const response = await apiFetch(`/resources/${id}/`, {
    method: 'PATCH',
    headers,
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update resource');
  }

  const r: ApiResource = await response.json();
  return {
    id: String(r.id),
    title: r.title,
    type: r.type,
    url: r.url || r.file || '',
    uploadedAt: new Date(r.uploaded_at),
    size: r.size,
    aiTopics: Array.isArray(r.ai_topics)
  ? r.ai_topics.map((t: string) => String(t).trim()).filter(Boolean)
  : r.ai_topics
  ? String(r.ai_topics).split(',').map(t => t.trim()).filter(Boolean)
  : [],
    courseId: String(r.course),
    category: r.category?.name || 'Boshqa',
  };
};

// HTTP Client wrapper providing convenience methods
interface ApiOptions extends RequestInit {
  params?: Record<string, any>;
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
}

const api = {
  async get<T = any>(path: string, options?: ApiOptions): Promise<T> {
    let finalPath = path;
    if (options?.params) {
      const queryString = new URLSearchParams(options.params).toString();
      finalPath = queryString ? `${path}?${queryString}` : path;
    }
    
    const response = await apiFetch(finalPath, {
      ...options,
      method: 'GET',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `API Error: ${response.status}`);
    }
    return response.json();
  },

  async post<T = any>(path: string, body?: any, options?: ApiOptions): Promise<T> {
    let finalPath = path;
    if (options?.params) {
      const queryString = new URLSearchParams(options.params).toString();
      finalPath = queryString ? `${path}?${queryString}` : path;
    }

    const response = await apiFetch(finalPath, {
      ...options,
      method: 'POST',
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options?.headers as Record<string, string> || {}),
      },
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `API Error: ${response.status}`);
    }
    return response.json();
  },

  async patch<T = any>(path: string, body?: any, options?: ApiOptions): Promise<T> {
    let finalPath = path;
    if (options?.params) {
      const queryString = new URLSearchParams(options.params).toString();
      finalPath = queryString ? `${path}?${queryString}` : path;
    }

    const response = await apiFetch(finalPath, {
      ...options,
      method: 'PATCH',
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options?.headers as Record<string, string> || {}),
      },
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `API Error: ${response.status}`);
    }
    return response.json();
  },

  async put<T = any>(path: string, body?: any, options?: ApiOptions): Promise<T> {
    let finalPath = path;
    if (options?.params) {
      const queryString = new URLSearchParams(options.params).toString();
      finalPath = queryString ? `${path}?${queryString}` : path;
    }

    const response = await apiFetch(finalPath, {
      ...options,
      method: 'PUT',
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options?.headers as Record<string, string> || {}),
      },
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `API Error: ${response.status}`);
    }
    return response.json();
  },

  async delete<T = any>(path: string, options?: ApiOptions): Promise<T> {
    let finalPath = path;
    if (options?.params) {
      const queryString = new URLSearchParams(options.params).toString();
      finalPath = queryString ? `${path}?${queryString}` : path;
    }

    const response = await apiFetch(finalPath, {
      ...options,
      method: 'DELETE',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `API Error: ${response.status}`);
    }
    return response.json();
  },
};

export default api;

export const deleteResource = async (id: string): Promise<void> => {
  const response = await apiFetch(`/resources/${id}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to delete resource');
  }
};

// Test Results
export interface TestResultPayload {
  test: number | string;
  answers: number[];
  time_spent: number; // in seconds
}

export interface ApiTestResult {
  id: number;
  student: number;
  student_name: string;
  test: number;
  test_title: string;
  course_title: string;
  score: number;
  max_score: number;
  answers: number[];
  time_spent: number;
  correct_answers: number;
  total_questions: number;
  created_at: string;
}

export const submitTestResult = async (payload: TestResultPayload): Promise<ApiTestResult> => {
  const response = await apiFetch(`/test-results/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to submit test result');
  }

  return response.json();
};

export const getTestResults = async (testId?: number): Promise<ApiTestResult[]> => {
  let path = '/test-results/';
  if (testId) {
    path += `?test=${testId}`;
  }
  const response = await apiFetch(path, { method: 'GET' });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.warn('getTestResults failed', response.status, text);
    throw new Error(`Failed to fetch test results: ${text}`);
  }

  return response.json();
};

export interface InstructorStudentsStats {
  total: number;
  active: number;
  inactive: number;
  topPerformers: number;
}

export interface InstructorStudent {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  progress: number;
  score: number;
  testsCount: number;
  enrolledDate?: string;
}

export const getInstructorStudentsStats = async (): Promise<InstructorStudentsStats> => {
  const response = await apiFetch('/auth/instructor-students-stats/', { method: 'GET' });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.warn('getInstructorStudentsStats failed', response.status, text);
    throw new Error(`Failed to fetch instructor students stats: ${text}`);
  }

  return response.json();
};

export const getInstructorStudents = async (): Promise<InstructorStudent[]> => {
  const response = await apiFetch('/auth/instructor-students/', { method: 'GET' });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.warn('getInstructorStudents failed', response.status, text);
    throw new Error(`Failed to fetch instructor students: ${text}`);
  }

  return response.json();
};

