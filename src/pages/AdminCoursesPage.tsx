import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/ui/CourseCard';
import { StatsCard } from '@/components/ui/StatsCard';
import { Course } from '@/types';
import { 
  BookOpen, 
  Search, 
  Filter,
  Grid3x3,
  List,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockAllCourses: Course[] = [
  {
    id: '1',
    title: 'JavaScript asoslari',
    description: 'JavaScript dasturlash tilining asoslarini o\'rganing. Variables, functions, objects va boshqalar.',
    instructorId: 'inst1',
    instructorName: 'Alisher Karimov',
    totalLessons: 24,
    completedLessons: 0,
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
    completedLessons: 0,
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
    completedLessons: 0,
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
    completedLessons: 0,
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
    category: 'AI/ML',
    difficulty: 'advanced',
  },
  {
    id: '7',
    title: 'MongoDB bilan ishlash',
    description: 'NoSQL database MongoDB bilan ishlashni o\'rganing. CRUD operations, aggregation, indexes.',
    instructorId: 'inst1',
    instructorName: 'Alisher Karimov',
    totalLessons: 15,
    completedLessons: 0,
    category: 'Database',
    difficulty: 'intermediate',
  },
  {
    id: '8',
    title: 'Docker va Containerization',
    description: 'Docker bilan ilovalarni containerizatsiya qilishni o\'rganing. Images, containers, docker-compose.',
    instructorId: 'inst5',
    instructorName: 'Jamshid Umarov',
    totalLessons: 12,
    completedLessons: 0,
    category: 'DevOps',
    difficulty: 'intermediate',
  },
];

const AdminCoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['all', 'Dasturlash', 'Web Development', 'Backend', 'Database', 'AI/ML', 'DevOps'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredCourses = mockAllCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleCourseAction = (action: string, courseId: string) => {
    console.log(`Action: ${action} on course: ${courseId}`);
    if (action === 'delete') {
      const confirmed = window.confirm('Kursni o\'chirmoqchimisiz?');
      if (confirmed) {
        // Delete course logic
      }
    }
  };

  return (
    <DashboardLayout role="admin" title="Barcha kurslar" userName="Admin">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Jami kurslar"
            value={mockAllCourses.length.toString()}
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="O'qituvchilar"
            value="5"
            icon={Users}
            variant="accent"
          />
          <StatsCard
            title="Talabalar"
            value="1,234"
            icon={Users}
            variant="warning"
            trend={{ value: 150, isPositive: true }}
          />
          <StatsCard
            title="Yakunlash darajasi"
            value="73%"
            icon={Award}
            variant="success"
          />
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Kurslar, o'qituvchilar yoki kategoriya bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Category Filter */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Kategoriya</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Barcha kategoriyalar' : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Daraja</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="all">Barcha darajalar</option>
                  <option value="beginner">Boshlang'ich</option>
                  <option value="intermediate">O'rta</option>
                  <option value="advanced">Murakkab</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">Ko'rinish</label>
                <div className="flex items-center gap-2">
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
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredCourses.length}</span> ta kurs topildi
          </p>
        </div>

        {/* Courses Grid */}
        <div className={cn(
          'grid gap-6',
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
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
                variant="admin"
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
            <p className="text-muted-foreground">Qidiruv yoki filtrlarni o'zgartiring</p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminCoursesPage;
