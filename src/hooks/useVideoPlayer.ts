/**
 * useVideoPlayer hook for video playback management
 */
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import VideoProgressService from '@/services/progress.service';

export function useVideoPlayer(lessonResourceId: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const saveProgressMutation = useMutation({
    mutationFn: (data: { watched: number; total: number }) =>
      VideoProgressService.saveProgress(lessonResourceId, data.watched, data.total),
  });

  // Save progress every 10 seconds
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(() => {
      if (isPlaying) {
        saveProgressMutation.mutate({
          watched: Math.floor(video.currentTime),
          total: Math.floor(video.duration),
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, lessonResourceId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const getProgressPercent = () => (duration > 0 ? (currentTime / duration) * 100 : 0);

  return {
    videoRef,
    duration,
    currentTime,
    isPlaying,
    progressPercent: getProgressPercent(),
    canTakeQuiz: getProgressPercent() >= 80,
  };
}
