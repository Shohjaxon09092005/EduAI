export type UserRole = 'admin' | 'instructor' | 'student';
export type ResourceStatus = 'uploaded' | 'extracting' | 'scripting' | 'audio' | 'video' | 'ready' | 'failed';
export type PlanType = 'basic' | 'pro' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  level?: number;
  xp?: number;
  badges?: Badge[];
  organization?: Organization;
}

export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  max_students: number;
  max_videos_per_month: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  thumbnail?: string;
  progress?: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons?: Lesson[];
  student_count?: number;
  resource_count?: number;
  created_at?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
  duration: number; // in minutes
  resources?: LessonResource[];
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'pptx' | 'docx' | 'link';
  url?: string;
  file?: string;
  description: string;
  order: number;
  script?: string;
  transcript?: string;
  audio_url?: string;
  status?: ResourceStatus;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'link';
  url: string;
  uploadedAt: Date;
  size?: string;
  aiTopics?: string[];
  courseId: string;
  category: string;
}

export interface Test {
  id: string;
  title: string;
  courseId: string;
  courseTitle?: string;
  questions: Question[];
  duration: number; // in minutes
  aiGenerated: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  score: number;
  max_score: number;
  weak_topics: string[];
  strong_topics: string[];
  ai_feedback: string;
  recommendations: string[];
  answers: Array<{ question_id: number; selected: number; correct: boolean }>;
  completed_at: string;
  correct_answers: number;
  total_questions: number;
  student_name: string;
  test_title: string;
}

export interface CourseEnrollment {
  id: string;
  student_id: string;
  student_name: string;
  course_id: string;
  course_title: string;
  enrolled_at: string;
  progress_percent: number;
}

export interface VideoProgress {
  id: string;
  student_id: string;
  lesson_resource_id: string;
  watched_seconds: number;
  total_seconds: number;
  progress_percent: number;
  completed: boolean;
  last_watched: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  earnedAt?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
}

export interface LearningPath {
  id: string;
  title: string;
  nodes: LearningNode[];
}

export interface LearningNode {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'project';
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  xpReward: number;
  connections: string[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  sources?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface Statistics {
  totalStudents: number;
  totalCourses: number;
  totalResources: number;
  activeUsers: number;
  completionRate: number;
  averageScore: number;
}

export interface TeacherDashboard {
  total_students: number;
  total_courses: number;
  total_videos: number;
  avg_score: number;
  recent_results: QuizResult[];
  weak_topics_summary: Array<{ topic: string; count: number }>;
  monthly_videos_used: number;
  monthly_videos_limit: number;
}

export interface StudentDashboard {
  enrolled_courses: CourseEnrollment[];
  completed_videos: number;
  avg_quiz_score: number;
  weak_topics: string[];
  recommendations: string[];
  recent_activity: Array<{ type: string; title: string; date: string; score?: number }>;
}

export interface ProgressUpdate {
  status: ResourceStatus;
  message: string;
}
