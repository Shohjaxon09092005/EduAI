import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  X, 
  CheckCircle,
  Loader2,
  Sparkles,
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'link';
  size: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  // NEW fields:
  resourceId?: string;       // backend ID after upload
  pipelineStatus?: 'idle' | 'extracting' | 'scripting' | 'audio' | 'video' | 'quiz' | 'ready' | 'failed';
  pipelineMessage?: string;
  videoUrl?: string;
  hasQuiz?: boolean;
  progress?: number;
  aiTopics?: string[];
}

interface ResourceUploaderProps {
  files: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (id: string) => void;
  onFileStatusUpdate?: (id: string, updates: Partial<UploadedFile>) => void; // NEW
  className?: string;
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
      return File;
  }
};

const getFileColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'text-destructive bg-destructive/10';
    case 'pptx':
      return 'text-warning bg-warning/10';
    case 'docx':
      return 'text-primary bg-primary/10';
    case 'video':
      return 'text-accent bg-accent/10';
    case 'link':
      return 'text-success bg-success/10';
    default:
      return 'text-muted-foreground bg-muted';
  }
};

export const ResourceUploader: React.FC<ResourceUploaderProps> = ({
  files,
  onFilesAdded,
  onFileRemove,
  onFileStatusUpdate,
  className,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'video/*': ['.mp4', '.webm', '.mov'],
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div {...getRootProps()}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "dropzone cursor-pointer text-center",
            isDragActive && "dropzone-active"
          )}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ y: isDragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
              isDragActive ? "bg-accent/20" : "bg-muted"
            )}>
              <Upload className={cn(
                "w-8 h-8 transition-colors",
                isDragActive ? "text-accent" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragActive ? "Fayllarni shu yerga tashlang" : "Fayllarni sudrab tashlang"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                yoki <span className="text-primary font-medium">kompyuterdan tanlang</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['PDF', 'PPTX', 'DOCX', 'Video'].map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                >
                  {type}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="font-medium text-sm text-muted-foreground">Yuklangan fayllar</h4>
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    getFileColor(file.type)
                  )}>
                    <FileIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{file.size}</span>
                    </div>
                    
                    {/* Pipeline status bar — shown during processing */}
                    {file.pipelineStatus && file.pipelineStatus !== 'idle' && (
                      <div className="mt-2 space-y-2">
                        {/* Status message */}
                        <p className={`text-xs font-medium flex items-center gap-1.5 ${
                          file.pipelineStatus === 'failed' ? 'text-destructive' :
                          file.pipelineStatus === 'ready' ? 'text-success' : 'text-accent'
                        }`}>
                          {file.pipelineStatus !== 'ready' && file.pipelineStatus !== 'failed' && (
                            <span className="w-3 h-3 rounded-full border border-accent border-t-transparent animate-spin inline-block" />
                          )}
                          {file.pipelineStatus === 'ready' && <span>✅</span>}
                          {file.pipelineStatus === 'failed' && <span>❌</span>}
                          {file.pipelineMessage || file.pipelineStatus}
                        </p>

                        {/* Step indicators */}
                        {file.pipelineStatus !== 'ready' && file.pipelineStatus !== 'failed' && (
                          <div className="flex gap-1">
                            {(
                              [
                                { key: 'extracting', label: '📄', title: 'Matn' },
                                { key: 'scripting',  label: '🧠', title: 'Skript' },
                                { key: 'audio',      label: '🎙️', title: 'Ovoz' },
                                { key: 'video',      label: '🎬', title: 'Video' },
                                { key: 'quiz',       label: '📝', title: 'Test' },
                              ] as const
                            ).map(({ key, label, title }) => {
                              const ORDER = ['extracting', 'scripting', 'audio', 'video', 'quiz'];
                              const curIdx = ORDER.indexOf(file.pipelineStatus as string);
                              const stepIdx = ORDER.indexOf(key);
                              const isDone    = stepIdx < curIdx;
                              const isActive  = stepIdx === curIdx;
                              const isPending = stepIdx > curIdx;
                              return (
                                <div
                                  key={key}
                                  title={title}
                                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs transition-all ${
                                    isDone    ? 'bg-success/15 text-success' :
                                    isActive  ? 'bg-accent/20 text-accent ring-1 ring-accent/40' :
                                                'bg-muted/60 text-muted-foreground'
                                  }`}
                                >
                                  <span>{label}</span>
                                  <span className="hidden sm:inline">{title}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Video ready — watch button */}
                        {file.pipelineStatus === 'ready' && file.videoUrl && (
                          <div className="flex items-center gap-2 mt-1">
                            <a
                              href={file.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-success/15 text-success text-xs font-medium hover:bg-success/25 transition-colors"
                            >
                              ▶ Video ko'rish
                            </a>
                            {file.hasQuiz && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                                📝 Test yaratildi
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Topics (existing — keep unchanged) */}
                    {file.aiTopics && file.aiTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.aiTopics.map((topic, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(file.status === 'uploading' || (file.pipelineStatus && !['ready','failed','idle',undefined].includes(file.pipelineStatus))) && (
                      file.status === 'uploading'
                        ? <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        : <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    )}
                    {file.status === 'completed' && file.pipelineStatus === 'ready' && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {file.status === 'error' && (
                      <span className="text-destructive text-lg">✗</span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onFileRemove(file.id)}
                      disabled={file.status === 'uploading'}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
