import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/ui/CourseCard';
import { Course } from '@/types';
import {
  BookOpen,
  Search,
  Grid3x3,
  List,
  UserPlus,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCourses } from '@/lib/api';
import enrollmentService from '@/services/enrollment.service';
import { toast } from 'sonner';

const CourseDiscoveryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // state coming from backend
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [enrolling, setEnrolling] = useState<Set<string>>(new Set());

  const { user, tokens } = useAuth();

  useEffect(() => {
    loadCoursesAndEnrollments();
  }, [tokens]);

  const loadCoursesAndEnrollments = async () => {
    if (!tokens) return;

    setLoading(true);
    try {
      // Load all available courses
      const allCourses = await getCourses();

      // Load user's enrollments to know which courses they're already enrolled in
      const enrollments = await enrollmentService.getMyEnrollments();
      const enrolledIds = new Set<string>(enrollments.map((e: any) => String(e.course)));

      setCourses(allCourses);
      setEnrolledCourseIds(enrolledIds);
    } catch (err) {
      console.error('Failed to load courses', err);
      toast.error('Kurslarni yuklab olishda xato');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (enrolling.has(courseId)) return;

    setEnrolling(prev => new Set(prev).add(courseId));

    try {
      await enrollmentService.enrollCourse(courseId);
      setEnrolledCourseIds(prev => {
        const next = new Set(prev);
        next.add(String(courseId));
        return next;
      });
      toast.success('Kursga muvaffaqiyatli yozildingiz!');
    } catch (err: any) {
      console.error('Enrollment failed', err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Kursga yozilishda xato');
      }
    } finally {
      setEnrolling(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handleCourseAction = (action: string, courseId: string) => {
    if (action === 'enroll') {
      handleEnroll(courseId);
    }
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: courses.length,
    enrolled: enrolledCourseIds.size,
    available: courses.length - enrolledCourseIds.size,
  };

  return (
    <DashboardLayout role="student" title="Kurslarni kashf etish" userName={user?.name || user?.email || 'Talaba'}>
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
                <p className="text-sm text-muted-foreground">Jami kurslar</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Yozilgan</p>
                <p className="text-2xl font-bold mt-1">{stats.enrolled}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mavjud</p>
                <p className="text-2xl font-bold mt-1">{stats.available}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-accent" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Kurslarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Barcha kategoriyalar</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2 border-l border-border/50 pl-4">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                )}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className={cn(
          'grid gap-6',
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        )}>
          {loading ? (
            <p className="col-span-full text-center py-12">Yuklanmoqda...</p>
          ) : filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <CourseCard
                course={course}
                variant="discovery"
                enrolled={enrolledCourseIds.has(String(course.id))}
                enrolling={enrolling.has(String(course.id))}
                onAction={handleCourseAction}
              />
            </motion.div>
          ))}
        </div>

        {!loading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kurslar topilmadi</h3>
            <p className="text-muted-foreground">Qidiruv yoki filtrni o'zgartiring</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseDiscoveryPage;