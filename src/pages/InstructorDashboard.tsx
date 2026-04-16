import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { ResourceUploader } from "@/components/instructor/ResourceUploader";
import { ResourceViewer } from "@/components/instructor/ResourceViewer";
import { useAuth } from "@/contexts/AuthContext";
import analyticsService from "@/services/analytics.service";
import resourceService from "@/services/resource.service";
import { getCourses, getLessons } from "@/lib/api";
import { toast } from "sonner";
import {
  BookOpen,
  Users,
  FileText,
  ClipboardList,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Resource, TeacherDashboard } from "@/types";

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'pptx' | 'docx' | 'video' | 'link';
  size: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  resourceId?: string;
  pipelineStatus?: 'idle' | 'extracting' | 'scripting' | 'audio' | 'video' | 'quiz' | 'ready' | 'failed';
  pipelineMessage?: string;
  videoUrl?: string;
  hasQuiz?: boolean;
  progress?: number;
  aiTopics?: string[];
}

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [dashStats, setDashStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const stopPollersRef = useRef<Record<string, () => void>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "view">("upload");

  // Load dashboard stats + courses on mount
  useEffect(() => {
    Promise.all([
      analyticsService.getTeacherDashboard().catch(() => null),
      getCourses().catch(() => []),
    ]).then(([stats, courseList]) => {
      setDashStats(stats);
      setCourses(courseList);
    }).finally(() => setLoadingStats(false));
  }, []);

  // Load lessons when course is selected
  useEffect(() => {
    if (!selectedCourseId) { setLessons([]); setSelectedLessonId(''); return; }
    getLessons(Number(selectedCourseId))
      .then(setLessons)
      .catch(() => setLessons([]));
  }, [selectedCourseId]);

  // Cleanup pollers on unmount
  useEffect(() => {
    const pollers = stopPollersRef.current;
    return () => { Object.values(pollers).forEach(stop => stop()); };
  }, []);

  const handleFilesAdded = async (files: File[]) => {
    if (!selectedLessonId) {
      toast.error('Avval kurs va darsni tanlang');
      return;
    }

    for (const file of files) {
      const localId = `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const fileType: UploadedFile['type'] =
        ext === 'pdf' ? 'pdf' :
        ['pptx','ppt'].includes(ext) ? 'pptx' :
        ['docx','doc'].includes(ext) ? 'docx' : 'link';

      // Add file card immediately
      setUploadedFiles(prev => [...prev, {
        id: localId,
        name: file.name,
        type: fileType,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'uploading',
        pipelineStatus: 'idle',
        pipelineMessage: 'Fayl yuklanyapti...',
      }]);

      try {
        const result = await resourceService.uploadResource(
          file,
          selectedLessonId,
          file.name,
          (event) => {
            setUploadedFiles(prev => prev.map(f =>
              f.id === localId ? {
                ...f,
                pipelineMessage: event.message,
                status: event.status === 'complete' ? 'processing' :
                        event.status === 'error' ? 'error' : 'uploading',
              } : f
            ));
          }
        );

        // Mark as processing, store backend ID
        setUploadedFiles(prev => prev.map(f =>
          f.id === localId ? {
            ...f,
            resourceId: result.id,
            status: 'processing',
            pipelineStatus: 'extracting',
          } : f
        ));

        // Start status polling
        const stopPoller = resourceService.monitorResourceStatus(
          result.id,
          (update) => {
            const pipelineStatus = update.status as UploadedFile['pipelineStatus'];
            setUploadedFiles(prev => prev.map(f =>
              f.id === localId ? {
                ...f,
                pipelineStatus,
                pipelineMessage: update.message,
                videoUrl: update.video_url || f.videoUrl,
                hasQuiz: update.has_quiz ?? f.hasQuiz,
                status: update.status === 'ready' ? 'completed' :
                        update.status === 'failed' ? 'error' : 'processing',
              } : f
            ));

            if (update.status === 'ready') {
              toast.success(`✅ "${file.name}" tayyor! Video va test yaratildi.`);
            } else if (update.status === 'failed') {
              toast.error(`❌ "${file.name}" qayta ishlashda xato yuz berdi.`);
            }
          }
        );

        stopPollersRef.current[localId] = stopPoller;

      } catch (err: any) {
        setUploadedFiles(prev => prev.map(f =>
          f.id === localId ? {
            ...f,
            status: 'error',
            pipelineStatus: 'failed',
            pipelineMessage: err?.message || 'Yuklashda xato yuz berdi',
          } : f
        ));
        toast.error(`Fayl yuklashda xato: ${err?.message || 'Noma\'lum xato'}`);
      }
    }
  };

  const handleFileRemove = (id: string) => {
    // Stop polling if active
    if (stopPollersRef.current[id]) {
      stopPollersRef.current[id]();
      delete stopPollersRef.current[id];
    }
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <DashboardLayout role="instructor" title="Domla paneli" userName={user?.name || user?.first_name || user?.email || 'Domla'}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Mening kurslarim"   value={loadingStats ? '...' : String(dashStats?.total_courses  ?? courses.length)} icon={BookOpen}     variant="primary" />
          <StatsCard title="Talabalarim"         value={loadingStats ? '...' : String(dashStats?.total_students ?? 0)}              icon={Users}        variant="accent" trend={{ value: 15, isPositive: true }} />
          <StatsCard title="O'rtacha ball"       value={loadingStats ? '...' : `${dashStats?.avg_score ?? 0}%`}                    icon={TrendingUp}   variant="success" />
          <StatsCard title="So'nggi natijalar"   value={loadingStats ? '...' : String(dashStats?.recent_results?.length ?? 0)}     icon={ClipboardList} variant="warning" />
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
                  onClick={() => setActiveTab("upload")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "upload"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Yuklash
                </button>
                
              </div>
              <div className="flex items-center gap-2 text-sm text-accent">
                <Sparkles className="w-4 h-4" />
                <span>AI mavzulashtirish faol</span>
              </div>
            </div>

            {activeTab === 'upload' ? (
              <div className="space-y-4">
                {/* Course & Lesson Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Kurs tanlang
                    </label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">— Kurs tanlang —</option>
                      {courses.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    {courses.length === 0 && !loadingStats && (
                      <p className="text-xs text-muted-foreground">
                        Avval{' '}
                        <a href="/instructor/courses" className="text-primary underline">kurs yarating</a>
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Dars tanlang
                    </label>
                    <select
                      value={selectedLessonId}
                      onChange={(e) => setSelectedLessonId(e.target.value)}
                      disabled={!selectedCourseId || lessons.length === 0}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                                 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <option value="">— Dars tanlang —</option>
                      {lessons.map((l: any) => (
                        <option key={l.id} value={l.id}>{l.title}</option>
                      ))}
                    </select>
                    {selectedCourseId && lessons.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Bu kursda hali dars yo'q.{' '}
                        <a href="/instructor/courses" className="text-primary underline">Dars qo'shing</a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Upload hint when no lesson selected */}
                {!selectedLessonId && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20 text-xs text-warning">
                    ⚠️ Fayl yuklash uchun yuqoridan kurs va darsni tanlang
                  </div>
                )}

                <ResourceUploader
                  files={uploadedFiles}
                  onFilesAdded={handleFilesAdded}
                  onFileRemove={handleFileRemove}
                  onFileStatusUpdate={(id, updates) =>
                    setUploadedFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
                  }
                />
              </div>
            ) : (
              <ResourceViewer
                resources={[]}
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
          

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-lg mb-4">
                So'nggi faoliyat
              </h3>
              <div className="space-y-3">
                {(dashStats?.recent_results ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">Hali faoliyat yo'q</p>
                )}
                {(dashStats?.recent_results ?? []).slice(0, 3).map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{r.student_name} — <span className="text-muted-foreground">{r.test_title}</span></p>
                      <p className="text-muted-foreground text-xs">{r.score}% ball • {new Date(r.created_at).toLocaleDateString('uz')}</p>
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
