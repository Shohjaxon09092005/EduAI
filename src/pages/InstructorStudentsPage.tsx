import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { 
  Users, 
  Search, 
  Mail, 
  Phone,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Filter,
  Download,
  UserCheck,
  UserX,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getInstructorStudents, getInstructorStudentsStats, InstructorStudent, InstructorStudentsStats } from '@/lib/api';
import { toast } from 'sonner';

const InstructorStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<InstructorStudent[]>([]);
  const [stats, setStats] = useState<InstructorStudentsStats>({
    total: 0,
    active: 0,
    inactive: 0,
    topPerformers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load stats and students from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('📚 Loading instructor students data...');
        
        const [statsData, studentsData] = await Promise.all([
          getInstructorStudentsStats(),
          getInstructorStudents(),
        ]);
        
        console.log('✅ Stats loaded:', statsData);
        console.log('✅ Students loaded:', studentsData?.length || 0, 'students');
        
        setStats(statsData);
        setStudents(studentsData || []);
        
        if (studentsData?.length === 0) {
          toast.info('Hozircha talabalar yo\'q. Kurs yarating va talabalarni yozishga taklif eting.');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Noma\'lum xato';
        console.error('❌ Failed to load instructor students data:', error);
        setError(errorMessage);
        toast.error(`Talabalar ma'lumotlarini yuklab olish to'xtadi: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredStudents = students.filter(student => {
    const name = String(student.name || '');
    const email = String(student.email || '');
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        email.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'high-progress') {
      matchesFilter = Number(student.progress) >= 80;
    } else if (filterStatus === 'medium-progress') {
      matchesFilter = Number(student.progress) >= 60 && Number(student.progress) < 80;
    } else if (filterStatus === 'low-progress') {
      matchesFilter = Number(student.progress) < 60;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (student: InstructorStudent) => {
    // Determine status based on recent activity (if enrolled recently, consider active)
    if (!student.enrolledDate) return UserX;
    const enrolledDate = new Date(student.enrolledDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return enrolledDate > thirtyDaysAgo ? UserCheck : UserX;
  };

  const getStatusColor = (student: InstructorStudent) => {
    if (!student.enrolledDate) return 'text-muted-foreground';
    const enrolledDate = new Date(student.enrolledDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return enrolledDate > thirtyDaysAgo ? 'text-success' : 'text-muted-foreground';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-success';
    if (progress >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Noma\'lum';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ');
  };

  return (
    <DashboardLayout role="instructor" title="Talabalar" userName="Aziz Domla">
      <div className="space-y-6">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Ma'lumot yuklashda xato</p>
              <p className="text-sm text-destructive/90 mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 text-sm rounded-md bg-destructive/20 hover:bg-destructive/30 text-destructive transition-colors"
              >
                Qayta yuklash
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Talabalar ma'lumotlari yuklanmoqda...</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Jami talabalar"
                value={stats.total}
                icon={Users}
                variant="primary"
              />
          <StatsCard
            title="Faol talabalar"
            value={stats.active}
            icon={UserCheck}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Nofaol talabalar"
            value={stats.inactive}
            icon={UserX}
            variant="warning"
          />
          <StatsCard
            title="Yuqori natijalar"
            value={stats.topPerformers}
            icon={Award}
            variant="accent"
          />
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Talaba qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Barcha talabalar</option>
              <option value="high-progress">Yuqori progress (80%+)</option>
              <option value="medium-progress">O'rta progress (60-79%)</option>
              <option value="low-progress">Past progress (0-59%)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              <span>Qo'shimcha filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              <span>Eksport</span>
            </button>
          </div>
        </div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h3 className="font-display font-semibold text-lg">Talabalar ro'yxati</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Talaba</th>
                  <th className="text-left p-4 font-medium">Daraja</th>
                  <th className="text-left p-4 font-medium">Progress</th>
                  <th className="text-left p-4 font-medium">O'rtacha ball</th>
                  <th className="text-left p-4 font-medium">Testlar soni</th>
                  <th className="text-left p-4 font-medium">Yozilgan sana</th>
                  <th className="text-left p-4 font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => {
                    return (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Daraja {student.level} ({student.xp} XP)</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{student.progress}%</span>
                              <span className={getProgressColor(student.progress)}>{student.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${student.progress}%` }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className={`h-2 rounded-full ${
                                  student.progress >= 80 ? 'bg-success' :
                                  student.progress >= 60 ? 'bg-warning' : 'bg-destructive'
                                }`}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{student.score}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{student.testsCount} ta test</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(student.enrolledDate)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                              <Phone className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Talabalar topilmadi. Iltimos, kursga yozilgan talabalarni tekshiring yoki sahifani yangilang.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Student Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg">Performance insights</h3>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Yuqori performers</span>
              </div>
              <p className="text-sm text-muted-foreground">
                25 ta talaba 90% dan yuqori natija ko'rsatmoqda
              </p>
            </div>
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">E'tibor kerak</span>
              </div>
              <p className="text-sm text-muted-foreground">
                12 ta talaba 1 haftadan ortiq faol emas
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-medium text-primary">O'sish sur'ati</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O'rtacha progress 15% ga oshdi
              </p>
            </div>
          </div>
        </motion.div>
            </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstructorStudentsPage;