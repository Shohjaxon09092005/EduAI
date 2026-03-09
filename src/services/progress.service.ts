/**
 * Video progress service for tracking video watching progress
 */
import api from '@/lib/api';
import { VideoProgress } from '@/types';

class VideoProgressService {
  /**
   * Save video watching progress
   */
  async saveProgress(
    lessonResourceId: string,
    watchedSeconds: number,
    totalSeconds: number
  ): Promise<VideoProgress> {
    return api.post('/progress/video/', {
      lesson_resource: lessonResourceId,
      watched_seconds: watchedSeconds,
      total_seconds: totalSeconds,
    });
  }

  /**
   * Update video progress
   */
  async updateProgress(
    progressId: string,
    watchedSeconds: number,
    totalSeconds: number,
    completed?: boolean
  ): Promise<VideoProgress> {
    return api.patch(`/progress/video/${progressId}/`, {
      watched_seconds: watchedSeconds,
      total_seconds: totalSeconds,
      ...(completed !== undefined && { completed }),
    });
  }

  /**
   * Get progress for a lesson resource
   */
  async getProgress(lessonResourceId: string): Promise<VideoProgress | null> {
    try {
      const response = await api.get<VideoProgress[]>(`/progress/video/?lesson_resource=${lessonResourceId}`);
      return response?.[0] || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all progress for current student
   */
  async getAllProgress() {
    return api.get('/progress/video/');
  }

  /**
   * Get progress by course
   */
  async getProgressByCourse(courseId: string) {
    return api.get(`/progress/video/?course=${courseId}`);
  }
}

export default new VideoProgressService();
