import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/ui/CourseCard';
import { Course } from '@/types';
import { 
  BookOpen, 
  Search, 
  Filter,
  Grid3x3,
  List,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'JavaScript asoslari',
    description: 'JavaScript dasturlash tilining asoslarini o\'rganing. Variables, functions, objects va boshqalar.',
    instructorId: 'inst1',
    instructorName: 'Alisher Karimov',
    totalLessons: 24,
    completedLessons: 16,
    progress: 65,
    category: 'Dasturlash',
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'React frameworki',
    description: 'Modern web ilovalarni React yordamida yarating. Components, hooks, state management.',
    instructorId: 'inst1',
    instructorName: 'Dilshod Nazarov',
    totalLessons: 18,
    completedLessons: 6,
    progress: 30,
    category: 'Web Development',
    difficulty: 'intermediate',
  },
  {
    id: '3',
    title: 'TypeScript asoslari',
    description: 'TypeScript bilan type-safe kod yozing. Interfaces, types, generics va advanced patterns.',
    instructorId: 'inst2',
    instructorName: 'Zarina Toshmatova',
    totalLessons: 16,
    completedLessons: 0,
    progress: 0,
    category: 'Dasturlash',
    difficulty: 'intermediate',
  },
  {
    id: '4',
    title: 'Python asoslari',
    description: 'Python dasturlash tilining asoslarini o\'rganing. Data structures, OOP, file handling.',
    instructorId: 'inst3',
    instructorName: 'Bobur Rahimov',
    totalLessons: 20,
    completedLessons: 20,
    progress: 100,
    category: 'Dasturlash',
    difficulty: 'beginner',
  },
  {
    id: '5',
    title: 'Node.js va Backend Development',
    description: 'Server-side dasturlash. Express.js, REST APIs, databases va authentication.',
    instructorId: 'inst1',
    instructorName: 'Alisher Karimov',
    totalLessons: 22,
    completedLessons: 8,
    progress: 36,
    category: 'Backend',
    difficulty: 'advanced',
  },
  {
    id: '6',
    title: 'Machine Learning kirish',
    description: 'Sun\'iy intellekt va ML asoslari. Python, numpy, pandas, scikit-learn.',
    instructorId: 'inst4',
    instructorName: 'Nodira Abdullayeva',
    totalLessons: 30,
    completedLessons: 0,
    progress: 0,
    category: 'AI/ML',
    difficulty: 'advanced',
  },
];

const StudentCoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCourses = mockCourses.filter(course => {
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
    enrolled: mockCourses.length,
    inProgress: mockCourses.filter(c => c.progress > 0 && c.progress < 100).length,
    completed: mockCourses.filter(c => c.progress === 100).length,
  };

  return (
    <DashboardLayout role="student" title="Kurslarim" userName="Talaba">
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
          {filteredCourses.map((course, index) => (
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

        {filteredCourses.length === 0 && (
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

export default StudentCoursesPage;
