import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
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
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const stats = {
    completedLessons: 47,
    totalLessons: 78,
    currentLevel: 9,
    xp: 3847,
    avgScore: 85,
    studyHours: 127,
    streak: 12,
  };

  const recentCourses = [
    { id: 1, title: 'JavaScript asoslari', progress: 65, completed: 16, total: 24, lastActivity: '2 soat oldin' },
    { id: 2, title: 'React frameworki', progress: 30, completed: 6, total: 18, lastActivity: 'Kecha' },
    { id: 3, title: 'TypeScript', progress: 0, completed: 0, total: 16, lastActivity: 'Boshlanmagan' },
  ];

  const achievements = [
    { id: 1, title: 'Birinchi qadamlar', description: 'Birinchi kursni boshlash', icon: '🚀', unlocked: true },
    { id: 2, title: 'O\'qish ashaddiyi', description: '7 kun ketma-ket o\'qish', icon: '🔥', unlocked: true },
    { id: 3, title: 'Test ustasi', description: '10 ta testdan o\'tish', icon: '🏆', unlocked: true },
    { id: 4, title: 'Kurs tugatuvchi', description: 'Birinchi kursni tugatish', icon: '📜', unlocked: false },
    { id: 5, title: 'Top talaba', description: 'Eng yaxshi 10 talaba qatoriga kirish', icon: '⭐', unlocked: false },
  ];

  const weeklyProgress = [
    { day: 'Dush', hours: 2.5, lessons: 3 },
    { day: 'Sesh', hours: 1.8, lessons: 2 },
    { day: 'Chor', hours: 3.2, lessons: 4 },
    { day: 'Pay', hours: 2.0, lessons: 2 },
    { day: 'Jum', hours: 1.5, lessons: 2 },
    { day: 'Shan', hours: 4.0, lessons: 5 },
    { day: 'Yak', hours: 2.8, lessons: 3 },
  ];

  const nextLevelXP = 5000;
  const progressToNextLevel = (stats.xp / nextLevelXP) * 100;

  return (
    <DashboardLayout role="student" title="Progress" userName="Talaba">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">O\'rganish progressi</h2>
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
            value={`${stats.completedLessons}/${stats.totalLessons}`}
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Joriy daraja"
            value={stats.currentLevel.toString()}
            icon={Trophy}
            variant="accent"
          />
          <StatsCard
            title="XP ballar"
            value={stats.xp.toLocaleString()}
            icon={Zap}
            variant="warning"
            trend={{ value: 250, isPositive: true }}
          />
          <StatsCard
            title="O\'rtacha ball"
            value={`${stats.avgScore}%`}
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
              <h3 className="font-display font-semibold text-lg">Daraja progressi</h3>
              <p className="text-sm text-muted-foreground">Keyingi darajaga {nextLevelXP - stats.xp.toLocaleString()} XP qoldi</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gradient-text">Level {stats.currentLevel}</p>
              <p className="text-sm text-muted-foreground">Next: Level {stats.currentLevel + 1}</p>
            </div>
          </div>
          <div className="h-4 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{stats.xp.toLocaleString()} XP</span>
            <span>{nextLevelXP.toLocaleString()} XP</span>
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
                <h3 className="font-display font-semibold text-lg">Haftalik o\'qish vaqti</h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stats.studyHours} soat</p>
                <p className="text-sm text-muted-foreground">Jami bu hafta</p>
              </div>
            </div>
            <div className="h-48 flex items-end justify-around gap-2">
              {weeklyProgress.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.hours / 5) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <div className="w-full max-w-12 bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all group-hover:opacity-80 relative" style={{ height: `${(day.hours / 5) * 100}%` }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-foreground text-background text-xs whitespace-nowrap"
                    >
                      {day.hours} soat
                    </motion.div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
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
            <h3 className="font-display font-semibold text-lg mb-6">O\'qish statistikasi</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">O\'rtacha kunlik</p>
                    <p className="text-sm text-muted-foreground">O\'qish vaqti</p>
                  </div>
                </div>
                <span className="font-bold">2.4 soat</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Ketma-ket</p>
                    <p className="text-sm text-muted-foreground">O\'qish kunlari</p>
                  </div>
                </div>
                <span className="font-bold">{stats.streak} kun</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">O\'sish</p>
                    <p className="text-sm text-muted-foreground">O\'tgan oydan</p>
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
            {recentCourses.map((course, index) => (
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
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">{course.completed}/{course.total} dars</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{course.progress}%</p>
                    <p className="text-xs text-muted-foreground">{course.lastActivity}</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-warning" />
              <h3 className="font-display font-semibold text-lg">Yutuqlar</h3>
            </div>
            <span className="text-sm text-muted-foreground">
              {achievements.filter(a => a.unlocked).length}/{achievements.length} ochilgan
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all',
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20'
                    : 'bg-muted/30 border-border/50 opacity-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                    achievement.unlocked ? 'bg-warning' : 'bg-muted'
                  )}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                  </div>
                  {achievement.unlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProgressPage;
