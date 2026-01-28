import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Eye, 
  Download,
  MoreVertical,
  Sparkles,
  Calendar,
  ChevronRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Resource } from '@/types';

interface ResourceViewerProps {
  resources: Resource[];
  onView: (resource: Resource) => void;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: "Kirish - Asosiy tushunchalar.pdf",
    type: 'pdf',
    url: '#',
    uploadedAt: new Date(),
    size: '2.4 MB',
    aiTopics: ['Asosiy tushunchalar', 'Nazariya', 'Kirish'],
    courseId: '1',
  },
  {
    id: '2',
    title: "Ma'ruza 1 - Prezentatsiya.pptx",
    type: 'pptx',
    url: '#',
    uploadedAt: new Date(),
    size: '5.1 MB',
    aiTopics: ['Ma\'ruza', 'Vizual materiallar'],
    courseId: '1',
  },
  {
    id: '3',
    title: "Amaliy mashg'ulot - Video dars",
    type: 'video',
    url: '#',
    uploadedAt: new Date(),
    size: '124 MB',
    aiTopics: ['Amaliyot', 'Video dars', 'Namuna'],
    courseId: '1',
  },
];

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

export const ResourceViewer: React.FC<ResourceViewerProps> = ({ 
  resources = mockResources,
  onView 
}) => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  return (
    <div className="space-y-4">
      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource, index) => {
          const FileIcon = getFileIcon(resource.type);
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card-hover p-4 cursor-pointer group"
              onClick={() => setSelectedResource(resource)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border",
                  getFileColor(resource.type)
                )}>
                  <FileIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                    {resource.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{resource.size}</span>
                    <span>•</span>
                    <span>{new Date(resource.uploadedAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* AI Topics */}
              {resource.aiTopics && resource.aiTopics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  <Sparkles className="w-3 h-3 text-accent" />
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
            </motion.div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {selectedResource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedResource(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  getFileColor(selectedResource.type)
                )}>
                  {React.createElement(getFileIcon(selectedResource.type), { className: "w-5 h-5" })}
                </div>
                <div>
                  <h3 className="font-medium">{selectedResource.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedResource.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Download className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedResource(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-8 flex items-center justify-center min-h-[400px] bg-muted/30">
              <div className="text-center">
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4",
                  getFileColor(selectedResource.type)
                )}>
                  {React.createElement(getFileIcon(selectedResource.type), { className: "w-10 h-10" })}
                </div>
                <p className="text-lg font-medium mb-2">Hujjat ko'rish</p>
                <p className="text-muted-foreground mb-4">
                  Bu yerda {selectedResource.type.toUpperCase()} ko'rish komponenti joylashadi
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  To'liq ekranda ochish
                </motion.button>
              </div>
            </div>

            {/* AI Topics */}
            {selectedResource.aiTopics && selectedResource.aiTopics.length > 0 && (
              <div className="p-4 border-t border-border/50 bg-accent/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">AI aniqlagan mavzular</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedResource.aiTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
