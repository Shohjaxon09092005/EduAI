/**
 * Enrollment service for managing course enrollments
 */
import api from '@/lib/api';
import { CourseEnrollment } from '@/types';

class EnrollmentService {
  /**
   * Enroll student in a course
   */
  async enrollCourse(courseId: string): Promise<CourseEnrollment> {
    return api.post('/enrollments/', { course: courseId });
  }

  /**
   * Get all enrollments for current user
   */
  async getMyEnrollments() {
    return api.get('/enrollments/');
  }

  /**
   * Get course enrollments (instructor view)
   */
  async getCourseEnrollments(courseId: string) {
    return api.get(`/enrollments/?course=${courseId}`);
  }

  /**
   * Unenroll from a course
   */
  async unenrollCourse(enrollmentId: string): Promise<void> {
    await api.delete(`/enrollments/${enrollmentId}/`, {});
  }

  /**
   * Get enrolled students in a course
   */
  async getEnrolledStudents(courseId: string) {
    return api.get(`/enrollments/?course=${courseId}`);
  }

  /**
   * Update enrollment progress
   */
  async updateProgress(enrollmentId: string, progressPercent: number) {
    return api.patch(`/enrollments/${enrollmentId}/`, {
      progress_percent: progressPercent,
    });
  }
}

export default new EnrollmentService();
