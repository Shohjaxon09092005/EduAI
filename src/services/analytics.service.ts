/**
 * Analytics service for fetching dashboard analytics
 */
import api from '@/lib/api';
import { TeacherDashboard, StudentDashboard } from '@/types';

class AnalyticsService {
  /**
   * Get teacher dashboard statistics
   */
  async getTeacherDashboard(): Promise<TeacherDashboard> {
    return api.get('/analytics/teacher/dashboard/');
  }

  /**
   * Get student dashboard statistics
   */
  async getStudentDashboard(): Promise<StudentDashboard> {
    return api.get('/analytics/student/dashboard/');
  }

  /**
   * Get course-specific analytics
   */
  async getCourseAnalytics(courseId: string) {
    return api.get(`/analytics/course/${courseId}/`);
  }
}

export default new AnalyticsService();
