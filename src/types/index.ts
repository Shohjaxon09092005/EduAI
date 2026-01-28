export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  level?: number;
  xp?: number;
  badges?: Badge[];
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
  questions: Question[];
  duration: number; // in minutes
  aiGenerated: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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
