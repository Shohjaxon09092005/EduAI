import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Video, Link as LinkIcon, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Resource } from '@/types';
import { AIResourceActions } from './AIResourceActions';

interface AIResourceCardProps {
  resource: Resource;
  onVideoCreated?: (resource: Resource) => void;
  onTestCreated?: (resource: Resource) => void;
  index?: number;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
    case 'pptx':
    case 'docx':
      return FileText;
    case 'video':
      return Video;
    case 'link':
      return LinkIcon;
    default:
      return FileText;
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'text-destructive bg-destructive/10 border-destructive/20';
    case 'pptx':
      return 'text-warning bg-warning/10 border-warning/20';
    case 'docx':
      return 'text-primary bg-primary/10 border-primary/20';
    case 'video':
      return 'text-accent bg-accent/10 border-accent/20';
    default:
      return 'text-muted-foreground bg-muted border-muted';
  }
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'ready':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'failed':
      return <AlertCircle className="w-5 h-5 text-destructive" />;
    case 'idle':
      return null;
    default:
      return status ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> : null;
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'idle':
      return 'Kutilmoqda';
    case 'extracting':
      return 'Matn ajratilmoqda...';
    case 'scripting':
      return 'Skript yaratilmoqda...';
    case 'audio':
      return 'Ovoz yaratilmoqda...';
    case 'video':
      return 'Video yaratilmoqda...';
    case 'quiz':
      return 'Test yaratilmoqda...';
    case 'ready':
      return '✅ Tayyor';
    case 'failed':
      return '❌ Xato';
    default:
      return '';
  }
};

export const AIResourceCard: React.FC<AIResourceCardProps> = ({
  resource,
  onVideoCreated,
  onTestCreated,
  index = 0,
}) => {
  const FileIcon = getFileIcon(resource.type);
  const statusIcon = getStatusIcon(resource.processing_status);
  const statusLabel = getStatusLabel(resource.processing_status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center border",
          getFileColor(resource.type)
        )}>
          <FileIcon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">
            {resource.title}
          </h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {resource.type}
            </span>
            {resource.size && (
              <>
                <span>•</span>
                <span>{resource.size}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Topics */}
      {resource.aiTopics && resource.aiTopics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <Sparkles className="w-3 h-3 text-accent mt-0.5" />
          {resource.aiTopics.slice(0, 3).map((topic, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Processing Status */}
      {resource.processing_status && resource.processing_status !== 'idle' && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          {statusIcon}
          <span className="text-sm text-muted-foreground">{statusLabel}</span>
        </div>
      )}

      {/* Error Message */}
      {resource.error_message && (
        <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{resource.error_message}</p>
        </div>
      )}

      {/* AI Actions */}
      <div className="pt-2">
        <AIResourceActions
          resourceId={Number(resource.id)}
          resourceTitle={resource.title}
          hasTranscript={!!resource.transcript}
          onVideoCreated={() => onVideoCreated?.(resource)}
          onTestCreated={() => onTestCreated?.(resource)}
        />
      </div>
    </motion.div>
  );
};

export default AIResourceCard;
