import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';
import { QuizConfigModal } from './QuizConfigModal';
import { AnimatePresence } from 'framer-motion';

interface AIResourceActionsProps {
  resourceId: number;
  resourceTitle: string;
  onVideoCreated?: () => void;
  onTestCreated?: () => void;
  hasTranscript?: boolean;
  className?: string;
}

export const AIResourceActions: React.FC<AIResourceActionsProps> = ({
  resourceId,
  resourceTitle,
  onVideoCreated,
  onTestCreated,
  hasTranscript = false,
  className,
}) => {
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const handleVideoCreate = async () => {
    setLoadingVideo(true);
    try {
      const response = await api.post(`/ai/process-video/${resourceId}/`);
      toast.success(
        '✅ Video yaratish boshlandi',
        {
          description: 'Video yaratish jarayoni boshlandi. Holatni kuzatib turing.',
        }
      );
      onVideoCreated?.();
    } catch (error: any) {
      console.error('Video creation error:', error);
      const errorMessage = error.response?.data?.error || 'Video yaratishda xato';
      toast.error(errorMessage);
    } finally {
      setLoadingVideo(false);
    }
  };

  const handleTestSuccess = () => {
    setShowTestModal(false);
    onTestCreated?.();
  };

  return (
    <>
      <div className={cn('flex flex-col gap-2', className)}>
        {/* Video Creation Button */}
        <motion.button
          onClick={handleVideoCreate}
          disabled={loadingVideo}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
            'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loadingVideo ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Jarayonda...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>🎬 Video yaratish</span>
            </>
          )}
        </motion.button>

        {/* Test Creation Button */}
        <motion.button
          onClick={() => {
            if (!hasTranscript) {
              toast.error(
                'Transkript mavjud emas',
                {
                  description: 'Avval video pipeline ni ishga tushiring',
                }
              );
              return;
            }
            setShowTestModal(true);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2',
            'bg-green-600 hover:bg-green-700 text-white shadow-md',
            !hasTranscript && 'opacity-50 cursor-not-allowed hover:bg-green-600'
          )}
          disabled={!hasTranscript}
        >
          <Sparkles className="w-4 h-4" />
          <span>📝 Test yaratish</span>
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showTestModal && (
          <QuizConfigModal
            resourceId={resourceId}
            onClose={() => setShowTestModal(false)}
            onSuccess={handleTestSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AIResourceActions;
