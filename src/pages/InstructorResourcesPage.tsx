import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ResourceUploader } from '@/components/instructor/ResourceUploader';
import { ResourceViewer } from '@/components/instructor/ResourceViewer';
import { Resource } from '@/types';
import { mockResources as initialResources, resourceCategories } from '@/lib/mockData';
import { 
  FolderOpen, 
  Search, 
  Plus,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'link';
  size: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  aiTopics?: string[];
}

const InstructorResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Barchasi' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFilesAdded = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: (file.name.split('.').pop() || 'pdf') as UploadedFile['type'],
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      status: 'processing' as const,
      progress: 0,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simulate upload and AI processing
    newFiles.forEach(file => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: 'completed', aiTopics: ['Yangi mavzu', 'Tahlil'] } : f));
        
        const newResource: Resource = {
          id: file.id,
          title: file.name,
          type: file.type,
          url: '#',
          uploadedAt: new Date(),
          size: file.size,
          category: selectedCategory === 'Barchasi' ? 'Dasturlash' : selectedCategory,
          courseId: '1',
          aiTopics: ['Yangi mavzu', 'Tahlil']
        };
        setResources(prev => [newResource, ...prev]);
        toast.success(`${file.name} muvaffaqiyatli yuklandi`);
      }, 2000);
    });
  };

  const handleFileRemove = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <DashboardLayout role="instructor" title="Resurslar" userName="O'qituvchi">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Jami resurslar</p>
                <p className="text-2xl font-bold mt-1">{resources.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
          {/* Add more stats if needed */}
        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Resurslarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Filter className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
              {['Barchasi', ...resourceCategories].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Qo'shish
            </motion.button>
          </div>
        </motion.div>

        {/* Resources List */}
        <ResourceViewer 
          resources={filteredResources} 
          onView={(resource) => console.log('Viewing resource:', resource)} 
        />

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Resurslar topilmadi</h3>
            <p className="text-muted-foreground">Qidiruv mezonlariga mos resurs yo'q</p>
          </div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUploadModal(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 p-4"
              >
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-2xl">Yangi resurs qo'shish</h2>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Kategoriya</label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={selectedCategory === 'Barchasi' ? 'Dasturlash' : selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {resourceCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <ResourceUploader 
                      files={uploadedFiles}
                      onFilesAdded={handleFilesAdded}
                      onFileRemove={handleFileRemove}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowUploadModal(false)}
                        className="px-6 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-all"
                      >
                        Tayyor
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default InstructorResourcesPage;
