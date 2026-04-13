import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCourses } from '@/lib/api';
import enrollmentService from '@/services/enrollment.service';

// NOTE: We previously used a mocked list for layout/development purposes.  
// Once the backend is available we fetch real data from the API instead.

const StudentCoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-progress' | 'completed'>('all');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // state coming from backend
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user, tokens } = useAuth();

  useEffect(() => {
    loadEnrolledCourses();
  }, [tokens]);

  const loadEnrolledCourses = async () => {
    if (!tokens) return;

    setLoading(true);
    try {
      // Load user's enrollments
      const enrollments = await enrollmentService.getMyEnrollments();
      
      // Normalize IDs so backend numeric IDs and frontend string IDs both match
      const enrolledCourseIds = new Set(enrollments.map((e: any) => String(e.course)));
      if (enrolledCourseIds.size > 0) {
        const allCourses = await getCourses();
        const enrolledCourses = allCourses.filter(course => 
          enrolledCourseIds.has(String(course.id))
        );
        setCourses(enrolledCourses);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Failed to load enrolled courses', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'in-progress' && course.progress > 0 && course.progress < 100) ||
      (filterStatus === 'completed' && course.progress === 100);

    return matchesSearch && matchesFilter;
  });

  const handleCourseAction = (action: string, courseId: string) => {
    console.log(`Action: ${action} on course: ${courseId}`);
  };

  const stats = {
    enrolled: courses.length,
    inProgress: courses.filter(c => c.progress && c.progress > 0 && c.progress < 100).length,
    completed: courses.filter(c => c.progress === 100).length,
  };

  return (
    <DashboardLayout role="student" title="Mening kurslarim" userName={user?.name || user?.email || 'Talaba'}>
      <div className="space-y-6">
        {/* Header with Discover Button */}
        <div className="flex items-center justify-between">
          <div></div>
          <Link to="/student/discover">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              Kurslarni kashf etish
            </motion.button>
          </Link>
        </div>
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
                <p className="text-2xl font-bold mt-1">{stats.enrolled}</p>
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
                <p className="text-sm text-muted-foreground">Jarayonda</p>
                <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent" />
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
                <p className="text-sm text-muted-foreground">Yakunlangan</p>
                <p className="text-2xl font-bold mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-success" />
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

            {/* Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  filterStatus === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                )}
              >
                Barchasi
              </button>
              <button
                onClick={() => setFilterStatus('in-progress')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  filterStatus === 'in-progress'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                )}
              >
                Jarayonda
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  filterStatus === 'completed'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                )}
              >
                Yakunlangan
              </button>
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
                variant="student"
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
            <h3 className="text-lg font-semibold mb-2">Siz hali kurslarga yozilmagansiz</h3>
            <p className="text-muted-foreground mb-6">Yangi kurslarni kashf eting va o'rganishni boshlang</p>
            <Link to="/student/discover">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                Kurslarni kashf etish
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCoursesPage;
