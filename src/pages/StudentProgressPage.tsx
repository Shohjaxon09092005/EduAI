import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import analyticsService from '@/services/analytics.service';
import enrollmentService from '@/services/enrollment.service';
import { StudentDashboard } from '@/types';
import {
  BookOpen,
  Trophy,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle2,
  Circle,
  BarChart3,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StudentProgressPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [dashStats, setDashStats] = useState<StudentDashboard | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch student progress data
  useEffect(() => {
    const loadProgressData = async () => {
      setLoadingStats(true);
      try {
        const stats = await analyticsService.getStudentDashboard();
        setDashStats(stats);
      } catch (error) {
        console.error('Failed to load progress data:', error);
        toast({
          title: "Xato",
          description: "Progress ma'lumotlarini yuklab olishda xato",
          variant: "destructive",
        });
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      loadProgressData();
    }
  }, [user, toast]);

  return (
    <DashboardLayout role="student" title="Progress" userName={user?.name || user?.email || 'Talaba'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">O'rganish progressi</h2>
            <p className="text-muted-foreground mt-1">Natijalaringiz va yutuqlaringiz</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
          >
            <Download className="w-4 h-4" />
            Hisobot yuklab olish
          </motion.button>
        </div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              {[
                { id: 'week', label: 'Hafta' },
                { id: 'month', label: 'Oy' },
                { id: 'year', label: 'Yil' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id as any)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all',
                    timeRange === range.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Bajarilgan darslar"
            value={loadingStats ? '...' : String(dashStats?.completed_videos || 0)}
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Ro'y berilgan kurslar"
            value={loadingStats ? '...' : String(dashStats?.enrolled_courses?.length || 0)}
            icon={Trophy}
            variant="accent"
          />
          <StatsCard
            title="Qo'rgilanish kerak"
            value={loadingStats ? '...' : String(dashStats?.weak_topics?.length || 0)}
            icon={Zap}
            variant="warning"
          />
          <StatsCard
            title="O'rtacha ball"
            value={loadingStats ? '...' : `${dashStats?.avg_quiz_score || 0}%`}
            icon={Target}
            variant="success"
          />
        </div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg">O'rganish darajasi</h3>
              <p className="text-sm text-muted-foreground">Keyingi bosqichga {Math.round((100 - (dashStats?.avg_quiz_score || 0)) * 10)} XP qoldi</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gradient-text">Level {Math.floor((dashStats?.avg_quiz_score || 0) / 10) + 1}</p>
              <p className="text-sm text-muted-foreground">Keyingi: Level {Math.floor((dashStats?.avg_quiz_score || 0) / 10) + 2}</p>
            </div>
          </div>
          <div className="h-4 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dashStats?.avg_quiz_score || 0}%` }}
              transition={{ duration: 1 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{dashStats?.avg_quiz_score || 0}%</span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Study Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Haftalik o'qish faoliyati</h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{(dashStats?.avg_quiz_score || 0) * 1.5}%</p>
                <p className="text-sm text-muted-foreground">O'rtacha samaradorlik</p>
              </div>
            </div>
            <div className="h-48 flex items-end justify-around gap-2">
              {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((day, index) => (
                <motion.div
                  key={day}
                  initial={{ height: 0 }}
                  animate={{ height: `${20 + Math.random() * 70}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-full max-w-12 bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all group-hover:opacity-80" style={{ height: `${20 + Math.random() * 70}%` }}></div>
                  <span className="text-xs text-muted-foreground font-medium">{day}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Study Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-6">O'qish statistikasi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">O'rtacha skor</p>
                    <p className="text-sm text-muted-foreground">Quiz natijasi</p>
                  </div>
                </div>
                <span className="font-bold">{dashStats?.avg_quiz_score || 0}%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Kurslar</p>
                    <p className="text-sm text-muted-foreground">Ro'y berilgan</p>
                  </div>
                </div>
                <span className="font-bold">{dashStats?.enrolled_courses?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Taqlid</p>
                    <p className="text-sm text-muted-foreground">O'rta holati</p>
                  </div>
                </div>
                <span className="font-bold text-success">+15%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-display font-semibold text-lg mb-6">Kurslar progressi</h3>
          <div className="space-y-4">
            {loadingStats ? (
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            ) : dashStats?.enrolled_courses && dashStats.enrolled_courses.length > 0 ? (
              dashStats.enrolled_courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{course.course_title}</h4>
                        <p className="text-sm text-muted-foreground">{course.progress_percent.toFixed(0)}% bajarildi</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{course.progress_percent.toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground">Yangi</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress_percent}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
              </motion.div>
            ))) : (
              <div className="p-4 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground">Hozircha kurslarga yozilmagan</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Weak Topics & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-warning" />
              <h3 className="font-display font-semibold text-lg">O'rganilishi kerak mavzular</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {loadingStats ? '...' : `${dashStats?.weak_topics?.length || 0} ta`}
            </span>
          </div>
          <div className="space-y-3">
            {loadingStats ? (
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            ) : dashStats?.weak_topics && dashStats.weak_topics.length > 0 ? (
              dashStats.weak_topics.slice(0, 5).map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl border-2 bg-warning/10 border-warning/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center text-lg">
                      📚
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{topic}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Bu mavzuda ko'proq mashq qilish tavsiya etiladi</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-4 rounded-xl border-2 bg-success/10 border-success/20">
                <p className="text-sm text-success font-medium">✨ Ajoyib! Barcha mavzular bo'yicha yaxshi</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProgressPage;
