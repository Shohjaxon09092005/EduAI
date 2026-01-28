import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  GraduationCap,
  BarChart3,
  Activity,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminStatisticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'year'>('30days');
  const [category, setCategory] = useState<'all' | 'students' | 'courses' | 'instructors'>('all');

  const stats = {
    totalStudents: 2847,
    activeStudents: 2134,
    totalCourses: 156,
    activeCourses: 142,
    totalInstructors: 45,
    totalLessons: 2847,
    completionRate: 78,
    avgTestScore: 85,
    totalCertificates: 1234,
    monthlyRevenue: 45000,
  };

  const weeklyActivity = [
    { day: 'Dush', value: 65 },
    { day: 'Sesh', value: 78 },
    { day: 'Chor', value: 72 },
    { day: 'Pay', value: 89 },
    { day: 'Jum', value: 95 },
    { day: 'Shan', value: 82 },
    { day: 'Yak', value: 58 },
  ];

  const topPerformers = [
    { id: 1, name: 'Malika Abdullayeva', courses: 8, xp: 3200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Malika' },
    { id: 2, name: 'Bobur Rahimov', courses: 6, xp: 2890, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bobur' },
    { id: 3, name: 'Nilufar Saidova', courses: 5, xp: 2450, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar' },
  ];

  const courseStats = [
    { id: 1, title: 'JavaScript asoslari', students: 847, completion: 85, avgScore: 88 },
    { id: 2, title: 'React frameworki', students: 654, completion: 72, avgScore: 82 },
    { id: 3, title: 'TypeScript', students: 423, completion: 68, avgScore: 79 },
    { id: 4, title: 'Python asoslari', students: 389, completion: 91, avgScore: 90 },
  ];

  return (
    <DashboardLayout role="admin" title="Statistika" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Platforma statistikasi</h2>
            <p className="text-muted-foreground mt-1">Platformaning ishlashi va ko'rsatkichlari</p>
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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              {[
                { id: '7days', label: '7 kun' },
                { id: '30days', label: '30 kun' },
                { id: '90days', label: '90 kun' },
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
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Barcha kategoriyalar</option>
                <option value="students">Talabalar</option>
                <option value="courses">Kurslar</option>
                <option value="instructors">O\'qituvchilar</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Jami talabalar"
            value={stats.totalStudents.toLocaleString()}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Faol talabalar"
            value={stats.activeStudents.toLocaleString()}
            icon={Activity}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Jami kurslar"
            value={stats.totalCourses.toString()}
            icon={BookOpen}
            variant="accent"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Bitirish foizi"
            value={`${stats.completionRate}%`}
            icon={TrendingUp}
            variant="warning"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="O\'qituvchilar"
            value={stats.totalInstructors.toString()}
            icon={GraduationCap}
            variant="primary"
          />
          <StatsCard
            title="Jami darslar"
            value={stats.totalLessons.toLocaleString()}
            icon={FileText}
            variant="accent"
          />
          <StatsCard
            title="O\'rtacha ball"
            value={`${stats.avgTestScore}%`}
            icon={Award}
            variant="success"
          />
          <StatsCard
            title="Sertifikatlar"
            value={stats.totalCertificates.toLocaleString()}
            icon={Award}
            variant="warning"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Haftalik faollik</h3>
              </div>
            </div>
            <div className="h-64 flex items-end justify-around gap-2">
              {weeklyActivity.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${day.value}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full max-w-12 bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all hover:opacity-80" style={{ height: `${day.value}%` }} />
                  <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Completion Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-accent" />
              <h3 className="font-display font-semibold text-lg">O\'rtacha bitirish</h3>
            </div>
            <div className="flex justify-center">
              <ProgressRing progress={stats.completionRate} label="bitirildi" />
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bu oy</span>
                <span className="font-medium text-success">+5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">O\'tgan oy</span>
                <span className="font-medium">73%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Course Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-lg">Kurslar natijalari</h3>
            </div>
            <button className="text-sm text-primary font-medium hover:underline">
              Barchasini ko'rish
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Kurs</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Talabalar</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Bitirish</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">O\'rtacha ball</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/30"
                  >
                    <td className="py-4 font-medium">{course.title}</td>
                    <td className="py-4 text-muted-foreground">{course.students}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden max-w-24">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.completion}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="h-full bg-success rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium">{course.completion}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-medium">{course.avgScore}%</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-warning" />
            <h3 className="font-display font-semibold text-lg">Eng yaxshi talabalar</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">{student.courses} kurs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{student.xp.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStatisticsPage;
