import api from '@/lib/api';

export interface UploadProgressEvent {
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  message: string;
}

export interface ResourceStatusResponse {
  status: string;
  video_url: string;
  audio_url: string;
  has_quiz: boolean;
  error_message: string;
}

class ResourceService {
  /**
   * Upload file to /lesson-resources/ then trigger AI pipeline
   * Returns { id, processing_status }
   */
  async uploadResource(
    file: File,
    lessonId: string,
    title: string,
    onProgress?: (event: UploadProgressEvent) => void
  ): Promise<{ id: string; processing_status: string }> {
    onProgress?.({ progress: 10, status: 'uploading', message: 'Fayl yuklanyapti...' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('lesson', lessonId);
    formData.append('title', title || file.name);
    formData.append('type', this.getFileType(file.name));
    formData.append('description', '');
    formData.append('order', '1');

    // POST to /lesson-resources/ (correct endpoint)
    const resource = await api.post<any>('/lesson-resources/', formData);

    onProgress?.({ progress: 40, status: 'processing', message: 'Fayl yuklandi ✓ — AI pipeline ishga tushirilmoqda...' });

    // Trigger AI pipeline
    try {
      await api.post(`/ai/process/${resource.id}/`, {});
      onProgress?.({ progress: 60, status: 'processing', message: '🧠 AI matn ajratyapti...' });
    } catch (e) {
      console.warn('Pipeline trigger failed:', e);
    }

    return { id: String(resource.id), processing_status: 'extracting' };
  }

  /**
   * Get current processing status by polling /ai/status/{resourceId}/
   * Returns status, video_url, has_quiz, error_message
   */
  async getResourceStatus(resourceId: string): Promise<ResourceStatusResponse> {
    // api.ts returns JSON directly — no .data wrapper needed
    return api.get<ResourceStatusResponse>(`/ai/status/${resourceId}/`);
  }

  /**
   * Poll status every 3 seconds. Returns a stop function.
   * Calls onStatusChange with each update.
   * Automatically stops when status is 'ready' or 'failed'.
   */
  monitorResourceStatus(
    resourceId: string,
    onStatusChange: (update: {
      status: string;
      message: string;
      video_url?: string;
      has_quiz?: boolean;
    }) => void
  ): () => void {
    let active = true;

    const PIPELINE_MESSAGES: Record<string, string> = {
      idle:       '⏳ Kutilmoqda...',
      extracting: '📄 Fayldan matn ajratilmoqda...',
      scripting:  '🧠 Claude AI video skript yaratmoqda...',
      audio:      '🎙️ ElevenLabs Uzbek ovoz yaratmoqda...',
      video:      '🎬 Kling AI video render qilmoqda (5-10 daqiqa)...',
      quiz:       '📝 AI test savollar yaratmoqda...',
      ready:      '✅ Video va test tayyor!',
      failed:     '❌ Xato yuz berdi',
    };

    const poll = async () => {
      while (active) {
        try {
          const data = await this.getResourceStatus(resourceId);
          onStatusChange({
            status: data.status,
            message: PIPELINE_MESSAGES[data.status] || data.status,
            video_url: data.video_url || '',
            has_quiz: data.has_quiz,
          });
          if (data.status === 'ready' || data.status === 'failed') {
            active = false;
            break;
          }
        } catch (e) {
          // Silently ignore polling errors — backend may not be ready yet
        }
        await new Promise(r => setTimeout(r, 3000));
      }
    };

    poll();
    return () => { active = false; };
  }

  async getResource(resourceId: string) {
    // No .data — api.ts returns JSON directly
    return api.get(`/lesson-resources/${resourceId}/`);
  }

  async deleteResource(resourceId: string): Promise<void> {
    await api.delete(`/lesson-resources/${resourceId}/`);
  }

  async getCourseResources(courseId: string) {
    // No .data — api.ts returns JSON directly
    return api.get('/lesson-resources/', { params: { course: courseId } });
  }

  private getFileType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const map: Record<string, string> = {
      pdf: 'pdf', docx: 'docx', doc: 'docx',
      pptx: 'pptx', ppt: 'pptx', txt: 'pdf',
    };
    return map[ext] || 'pdf';
  }
}

export default new ResourceService();
