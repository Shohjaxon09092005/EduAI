import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AITest } from '@/components/student/AITest';
import { Test } from '@/types';
import { cn } from '@/lib/utils';
import { getTests, getTestResults } from '@/lib/api';
import { 
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  BookOpen,
  TrendingUp,
  Target,
  Award,
  RefreshCw,
  BarChart3,
  Calendar,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';

interface StudentTest {
  id: string;
  title: string;
  course: string;
  questions: number;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'available' | 'completed';
  maxScore?: number;
  lastScore?: number;
  apiTest?: Test;
}

interface StudentTestResult {
  id: string;
  testId?: string;
  testTitle: string;
  course: string;
  score: number;
  maxScore: number;
  date: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

const StudentTestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'results'>('available');
  const [selectedTest, setSelectedTest] = useState<StudentTest | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [tests, setTests] = useState<StudentTest[]>([]);
  const [results, setResults] = useState<StudentTestResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tests and results from backend
  const loadData = async () => {
    try {
      setLoading(true);
      const [apiTests, apiResults] = await Promise.all([
        getTests(),
        getTestResults().catch(() => [])
      ]);

      // Map API tests to StudentTest
      const mappedTests: StudentTest[] = apiTests.map(t => {
        const result = (apiResults as any[]).find((r: any) => r.test === parseInt(t.id));
        return {
          id: t.id,
          title: t.title,
          course: t.courseTitle || '',
          questions: t.questions?.length || 0,
          duration: t.duration,
          difficulty: t.difficulty === 'easy' ? 'beginner' : t.difficulty === 'medium' ? 'intermediate' : 'advanced',
          status: result ? 'completed' : 'available',
          maxScore: result?.max_score || 100,
          lastScore: result ? result.score : undefined,
          apiTest: t,
        };
      });
      setTests(mappedTests);

      // Map API results to StudentTestResult
      const mappedResults: StudentTestResult[] = (apiResults as any[]).map((r: any) => ({
        id: r.id,
        testId: r.test,
        testTitle: r.test_title,
        course: r.course_title,
        score: r.score,
        maxScore: r.max_score,
        date: new Date(r.created_at).toLocaleDateString('uz'),
        timeSpent: Math.round(r.time_spent / 60),
        correctAnswers: r.correct_answers,
        totalQuestions: r.total_questions,
      }));
      setResults(mappedResults);
    } catch (err) {
      console.error('Failed to load tests:', err);
      toast.error('Testlar yuklanmadi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartTest = (test: StudentTest) => {
    setSelectedTest(test);
    setShowTest(true);
  };

  const handleTestComplete = (score: number, answers: number[]) => {
    toast.success('Test tugallandi! Natijalar saqland');
    setShowTest(false);
    setSelectedTest(null);
    // Reload data
    loadData();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/10 text-success';
      case 'intermediate': return 'bg-warning/10 text-warning';
      case 'advanced': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const availableTests = tests.filter(test => test.status === 'available');
  const completedTests = tests.filter(test => test.status === 'completed');
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  if (showTest && selectedTest && selectedTest.apiTest) {
    return (
      <DashboardLayout role="student" title={selectedTest.title} userName="Talaba">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <AITest
              title={selectedTest.title}
              questions={selectedTest.apiTest.questions || []}
              testId={selectedTest.id}
              duration={selectedTest.duration}
              onComplete={handleTestComplete}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="Testlar" userName="Talaba">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Jami testlar</p>
                <p className="text-2xl font-bold mt-1">{tests.length}</p>
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
                <p className="text-sm text-muted-foreground">Bajarildi</p>
                <p className="text-2xl font-bold mt-1">{completedTests.length}</p>
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
                <p className="text-sm text-muted-foreground">O'rtacha ball</p>
                <p className="text-2xl font-bold mt-1">{avgScore}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Yakunlangan</p>
                <p className="text-2xl font-bold mt-1">{results.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-warning" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-1"
        >
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('available')}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium transition-all',
                activeTab === 'available'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Mavjud testlar
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg font-medium transition-all',
                activeTab === 'results'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Natijalar
            </button>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="w-8 h-8 mx-auto text-primary" />
            </motion.div>
            <p className="text-muted-foreground mt-4">Testlar yuklanmoqda...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'available' ? (
              <motion.div
                key="available"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Available Tests */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Mavjud testlar</h3>
                  {availableTests.length > 0 ? (
                    <div className="grid gap-4">
                      {availableTests.map((test, index) => (
                        <motion.div
                          key={test.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-card p-4"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{test.title}</h4>
                                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getDifficultyColor(test.difficulty))}>
                                  {test.difficulty === 'beginner' ? 'Boshlang\'ich' : 
                                   test.difficulty === 'intermediate' ? 'O\'rta' : 'Murakkab'}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-2">{test.course}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Trophy className="w-4 h-4" />
                                  {test.questions} savol
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {test.duration} daqiqa
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleStartTest(test)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                              >
                                <Play className="w-4 h-4" />
                                Testni boshlash
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Mavjud testlar yo'q</p>
                    </div>
                  )}
                </div>

                {/* Completed Tests */}
                {completedTests.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Yakunlangan testlar</h3>
                    <div className="grid gap-4">
                      {completedTests.map((test, index) => (
                        <motion.div
                          key={test.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="glass-card p-4"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{test.title}</h4>
                                <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getDifficultyColor(test.difficulty))}>
                                  {test.difficulty === 'beginner' ? 'Boshlang\'ich' : 
                                   test.difficulty === 'intermediate' ? 'O\'rta' : 'Murakkab'}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-2">{test.course}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Trophy className="w-4 h-4" />
                                  {test.questions} savol
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {test.duration} daqiqa
                                </span>
                                {test.lastScore && (
                                  <span className={cn('flex items-center gap-1 font-medium', getScoreColor(test.lastScore))}>
                                    <Target className="w-4 h-4" />
                                    Ball: {test.lastScore}%
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleStartTest(test)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Qayta urinish
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="grid gap-4">
                  {results.length > 0 ? (
                    results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        className="glass-card p-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{result.testTitle}</h4>
                            <p className="text-muted-foreground mb-2">{result.course}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {result.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {result.timeSpent} daqiqa
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {result.correctAnswers}/{result.totalQuestions}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className={cn('text-3xl font-bold', getScoreColor(result.score))}>
                              {result.score}%
                            </div>
                            <p className="text-sm text-muted-foreground">Ball</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Hali natijalar yo'q</h3>
                      <p className="text-muted-foreground">Biror testni bajarib ko'ring!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentTestsPage;
