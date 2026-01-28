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
  progress?: number;
  aiTopics?: string[];
}

interface ResourceUploaderProps {
  files: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (id: string) => void;
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
                      {file.status === 'processing' && (
                        <span className="flex items-center gap-1 text-accent">
                          <Sparkles className="w-3 h-3" />
                          AI tahlil qilmoqda...
                        </span>
                      )}
                    </div>
                    
                    {/* AI Topics */}
                    {file.aiTopics && file.aiTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.aiTopics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    )}
                    {file.status === 'processing' && (
                      <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    )}
                    {file.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onFileRemove(file.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
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
