/**
 * Quiz service for handling quiz operations
 */
import api from '@/lib/api';
import { Test, QuizResult } from '@/types';

class QuizService {
  /**
   * Get quiz for a course
   */
  async getQuizForCourse(courseId: string): Promise<Test[]> {
    return api.get(`/tests/?course=${courseId}`);
  }

  /**
   * Get a specific test
   */
  async getTest(testId: string): Promise<Test> {
    return api.get(`/tests/${testId}/`);
  }

  /**
   * Submit quiz answers
   */
  async submitQuiz(
    testId: string,
    answers: number[],
    timeSpent: number
  ): Promise<any> {
    return api.post('/test-results/', {
      test: Number(testId),
      answers,
      time_spent: timeSpent,
    });
  }

  /**
   * Get quiz results for current user
   */
  async getMyResults() {
    return api.get('/test-results/');
  }

  /**
   * Get specific quiz result
   */
  async getResult(resultId: string): Promise<any> {
    return api.get(`/test-results/${resultId}/`);
  }

  /**
   * Retake a quiz (get fresh questions)
   */
  async retakeQuiz(testId: string): Promise<Test> {
    return this.getTest(testId);
  }
}

export default new QuizService();
