import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AITest } from '@/components/student/AITest';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
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
  Calendar
} from 'lucide-react';

interface AvailableTest {
  id: string;
  title: string;
  course: string;
  questions: number;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'available' | 'attempted' | 'completed';
  maxScore?: number;
  lastScore?: number;
  attemptsLeft?: number;
}

interface TestResult {
  id: string;
  testTitle: string;
  course: string;
  score: number;
  maxScore: number;
  date: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

const mockAvailableTests: AvailableTest[] = [
  {
    id: '1',
    title: 'JavaScript asoslari',
    course: 'Web Dasturlash',
    questions: 25,
    duration: 30,
    difficulty: 'beginner',
    status: 'available'
  },
  {
    id: '2',
    title: 'React hooks',
    course: 'React Development',
    questions: 20,
    duration: 25,
    difficulty: 'intermediate',
    status: 'attempted',
    lastScore: 75,
    maxScore: 100,
    attemptsLeft: 2
  },
  {
    id: '3',
    title: 'CSS Grid va Flexbox',
    course: 'Frontend Masterclass',
    questions: 15,
    duration: 20,
    difficulty: 'intermediate',
    status: 'completed',
    maxScore: 100,
    lastScore: 95
  },
  {
    id: '4',
    title: 'Node.js backend',
    course: 'Backend Development',
    questions: 30,
    duration: 40,
    difficulty: 'advanced',
    status: 'available'
  }
];

const mockTestResults: TestResult[] = [
  {
    id: 'result-1',
    testTitle: 'React hooks',
    course: 'React Development',
    score: 85,
    maxScore: 100,
    date: '2024-01-18',
    timeSpent: 22,
    correctAnswers: 17,
    totalQuestions: 20
  },
  {
    id: 'result-2',
    testTitle: 'JavaScript asoslari',
    course: 'Web Dasturlash',
    score: 92,
    maxScore: 100,
    date: '2024-01-16',
    timeSpent: 28,
    correctAnswers: 23,
    totalQuestions: 25
  },
  {
    id: 'result-3',
    testTitle: 'CSS Grid va Flexbox',
    course: 'Frontend Masterclass',
    score: 78,
    maxScore: 100,
    date: '2024-01-14',
    timeSpent: 18,
    correctAnswers: 12,
    totalQuestions: 15
  }
];

const mockQuestions: Question[] = [
  {
    id: '1',
    text: "JavaScript'da o'zgaruvchi e'lon qilish uchun qaysi kalit so'z ishlatiladi?",
    options: ['var', 'let', 'const', 'Barchasi to\'g\'ri'],
    correctAnswer: 3,
    explanation: "JavaScript'da var, let va const kalit so'zlari o'zgaruvchi e'lon qilish uchun ishlatiladi.",
  },
  {
    id: '2',
    text: "React'da state boshqarish uchun qaysi hook ishlatiladi?",
    options: ['useEffect', 'useState', 'useContext', 'useRef'],
    correctAnswer: 1,
    explanation: "useState hook'i React komponentlarida state boshqarish uchun ishlatiladi.",
  },
  {
    id: '3',
    text: "CSS'da flexbox yordamida elementlarni markazga joylashtirish uchun qaysi xususiyat ishlatiladi?",
    options: ['text-align: center', 'justify-content: center va align-items: center', 'margin: auto', 'position: center'],
    correctAnswer: 1,
    explanation: "Flexbox'da justify-content va align-items xususiyatlari elementlarni markazga joylashtirishda ishlatiladi.",
  },
  {
    id: '4',
    text: "TypeScript'da tur aniqlanishi uchun qaysi belgi ishlatiladi?",
    options: [':', '::', '=>', '->'],
    correctAnswer: 0,
    explanation: ": belgisi TypeScript'da tur aniqlanishi uchun ishlatiladi.",
  },
];

const StudentTestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'results'>('available');
  const [selectedTest, setSelectedTest] = useState<AvailableTest | null>(null);
  const [showTest, setShowTest] = useState(false);

  const availableTests = mockAvailableTests.filter(test => test.status === 'available');
  const attemptedTests = mockAvailableTests.filter(test => test.status === 'attempted');
  const completedTests = mockAvailableTests.filter(test => test.status === 'completed');

  const handleStartTest = (test: AvailableTest) => {
    setSelectedTest(test);
    setShowTest(true);
  };

  const handleTestComplete = (score: number, answers: number[]) => {
    console.log('Test completed with score:', score, 'Answers:', answers);
    setShowTest(false);
    setSelectedTest(null);
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

  if (showTest && selectedTest) {
    return (
      <DashboardLayout role="student" title={selectedTest.title} userName="Talaba">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <AITest
              title={selectedTest.title}
              questions={mockQuestions}
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
                <p className="text-2xl font-bold mt-1">{mockAvailableTests.length}</p>
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
                <p className="text-2xl font-bold mt-1">82%</p>
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
                <p className="text-sm text-muted-foreground">Reyting</p>
                <p className="text-2xl font-bold mt-1">#12</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-warning" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Testga tayyorgarlik</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    className="text-success"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">75%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Mavzular o'rganildi</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="87.92"
                    className="text-warning"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">65%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Mashqlar bajarildi</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset="50.24"
                    className="text-accent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">80%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Testlar yaxshi</p>
            </div>
          </div>
        </motion.div>

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
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Attempted Tests */}
              {attemptedTests.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Qayta urinish mumkin</h3>
                  <div className="grid gap-4">
                    {attemptedTests.map((test, index) => (
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
                              <span className="flex items-center gap-1">
                                <RefreshCw className="w-4 h-4" />
                                {test.attemptsLeft} urinish qoldi
                              </span>
                              {test.lastScore && (
                                <span className={cn('flex items-center gap-1 font-medium', getScoreColor(test.lastScore))}>
                                  <Target className="w-4 h-4" />
                                  Oxirgi ball: {test.lastScore}%
                                </span>
                              )}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleStartTest(test)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                          >
                            <Play className="w-4 h-4" />
                            Qayta urinish
                          </motion.button>
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
                {mockTestResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-4"
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
                ))}
              </div>

              {mockTestResults.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Hali natijalar yo'q</h3>
                  <p className="text-muted-foreground">Biror testni bajarib ko'ring!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default StudentTestsPage;