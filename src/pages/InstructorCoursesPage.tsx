import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/ui/CourseCard';
import { Course } from '@/types';
import { 
  BookOpen, 
  Search, 
  Plus,
  Grid3x3,
  List,
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockInstructorCourses: Course[] = [
  {
    id: '1',
    title: 'JavaScript asoslari',
    description: 'JavaScript dasturlash tilining asoslarini o\'rganing. Variables, functions, objects va boshqalar.',
    instructorId: 'current-instructor',
    instructorName: 'Siz',
    totalLessons: 24,
    completedLessons: 0,
    category: 'Dasturlash',
    difficulty: 'beginner',
  },
  {
    id: '5',
    title: 'Node.js va Backend Development',
    description: 'Server-side dasturlash. Express.js, REST APIs, databases va authentication.',
    instructorId: 'current-instructor',
    instructorName: 'Siz',
    totalLessons: 22,
    completedLessons: 0,
    category: 'Backend',
    difficulty: 'advanced',
  },
  {
    id: '7',
    title: 'MongoDB bilan ishlash',
    description: 'NoSQL database MongoDB bilan ishlashni o\'rganing. CRUD operations, aggregation, indexes.',
    instructorId: 'current-instructor',
    instructorName: 'Siz',
    totalLessons: 15,
    completedLessons: 0,
    category: 'Database',
    difficulty: 'intermediate',
  },
];

const InstructorCoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCourses = mockInstructorCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseAction = (action: string, courseId: string) => {
    console.log(`Action: ${action} on course: ${courseId}`);
    if (action === 'edit') {
      // Navigate to course editor
    } else if (action === 'view') {
      // Navigate to course analytics
    }
  };

  return (
    <DashboardLayout role="instructor" title="Mening kurslarim" userName="O'qituvchi">
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
                <p className="text-2xl font-bold mt-1">{mockInstructorCourses.length}</p>
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
                <p className="text-sm text-muted-foreground">Talabalar</p>
                <p className="text-2xl font-bold mt-1">324</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
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
                <p className="text-sm text-muted-foreground">O'rtacha baholash</p>
                <p className="text-2xl font-bold mt-1">4.8</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Actions Bar */}
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

            {/* Create Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi kurs
            </motion.button>

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
                variant="instructor"
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
            <p className="text-muted-foreground mb-4">Qidiruvni o'zgartiring yoki yangi kurs yarating</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Birinchi kursni yaratish
            </motion.button>
          </motion.div>
        )}

        {/* Create Course Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
              >
                <div className="glass-card p-6">
                  <h2 className="font-display font-bold text-2xl mb-4">Yangi kurs yaratish</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Kurs nomi</label>
                      <input
                        type="text"
                        placeholder="Masalan: JavaScript asoslari"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tavsif</label>
                      <textarea
                        rows={3}
                        placeholder="Kurs haqida qisqacha ma'lumot..."
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Kategoriya</label>
                        <select className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                          <option>Dasturlash</option>
                          <option>Web Development</option>
                          <option>Backend</option>
                          <option>Database</option>
                          <option>AI/ML</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Daraja</label>
                        <select className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                          <option value="beginner">Boshlang'ich</option>
                          <option value="intermediate">O'rta</option>
                          <option value="advanced">Murakkab</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateModal(false)}
                        className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-all"
                      >
                        Bekor qilish
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Create course logic
                          setShowCreateModal(false);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                      >
                        Yaratish
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

export default InstructorCoursesPage;
