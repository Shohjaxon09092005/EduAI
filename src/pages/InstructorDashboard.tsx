import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { ResourceUploader } from '@/components/instructor/ResourceUploader';
import { ResourceViewer } from '@/components/instructor/ResourceViewer';
import { 
  BookOpen, 
  Users, 
  FileText, 
  ClipboardList,
  Plus,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Resource } from '@/types';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'link';
  size: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  aiTopics?: string[];
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

const InstructorDashboard: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'view'>('upload');

  const handleFilesAdded = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      type: file.name.endsWith('.pdf') ? 'pdf' : 
            file.name.endsWith('.pptx') || file.name.endsWith('.ppt') ? 'pptx' :
            file.name.endsWith('.docx') || file.name.endsWith('.doc') ? 'docx' :
            file.type.startsWith('video/') ? 'video' : 'link',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: 'uploading',
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload and AI processing
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'processing' } : f
        ));

        setTimeout(() => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'completed',
              aiTopics: ['AI aniqlagan mavzu 1', 'AI aniqlagan mavzu 2']
            } : f
          ));
        }, 2000);
      }, 1000 * (index + 1));
    });
  };

  const handleFileRemove = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <DashboardLayout role="instructor" title="Domla paneli" userName="Aziz Domla">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Mening kurslarim"
            value="8"
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Talabalarim"
            value="342"
            icon={Users}
            variant="accent"
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="Resurslar"
            value="67"
            icon={FileText}
            variant="success"
          />
          <StatsCard
            title="Testlar"
            value="24"
            icon={ClipboardList}
            variant="warning"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resource Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'upload' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Yuklash
                </button>
                <button
                  onClick={() => setActiveTab('view')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'view' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Resurslar
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-accent">
                <Sparkles className="w-4 h-4" />
                <span>AI mavzulashtirish faol</span>
              </div>
            </div>

            {activeTab === 'upload' ? (
              <ResourceUploader
                files={uploadedFiles}
                onFilesAdded={handleFilesAdded}
                onFileRemove={handleFileRemove}
              />
            ) : (
              <ResourceViewer 
                resources={mockResources}
                onView={(resource) => console.log('View resource:', resource)}
              />
            )}
          </motion.div>

          {/* AI Tools & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* AI Tools */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="font-display font-semibold text-lg">AI vositalari</h3>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 
                           border border-primary/20 hover:border-primary/40 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Test yaratish</p>
                      <p className="text-sm text-muted-foreground">AI yordamida</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Topshiriq yaratish</p>
                      <p className="text-sm text-muted-foreground">Resurslar asosida</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">Tahlil ko'rish</p>
                      <p className="text-sm text-muted-foreground">Talabalar progressi</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-4">So'nggi faoliyat</h3>
              <div className="space-y-3">
                {[
                  { text: "5 ta talaba testni yakunladi", time: "2 soat oldin" },
                  { text: "Yangi resurs yuklandi", time: "5 soat oldin" },
                  { text: "Kurs yangilandi", time: "1 kun oldin" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p>{item.text}</p>
                      <p className="text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
