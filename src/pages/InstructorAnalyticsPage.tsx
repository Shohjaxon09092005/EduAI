import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Clock,
  Target,
  Award,
  Activity,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const mockAnalyticsData = {
  overview: {
    totalStudents: 342,
    activeCourses: 8,
    totalResources: 67,
    completionRate: 78.5,
    averageScore: 84.2,
    totalTests: 24
  },
  coursePerformance: [
    { name: 'JavaScript asoslari', students: 89, completion: 82, avgScore: 87 },
    { name: 'React va TypeScript', students: 76, completion: 75, avgScore: 83 },
    { name: 'Node.js Backend', students: 65, completion: 79, avgScore: 85 },
    { name: 'MongoDB va Database', students: 58, completion: 71, avgScore: 81 },
    { name: 'Frontend Development', students: 54, completion: 68, avgScore: 79 }
  ],
  recentActivity: [
    { type: 'test_completed', student: 'Ali Valiyev', course: 'JavaScript asoslari', score: 95, time: '2 soat oldin' },
    { type: 'course_completed', student: 'Zara Karimova', course: 'React va TypeScript', score: null, time: '4 soat oldin' },
    { type: 'assignment_submitted', student: 'Bobur Shodiyev', course: 'Node.js Backend', score: 88, time: '6 soat oldin' },
    { type: 'test_completed', student: 'Malika Azizova', course: 'MongoDB va Database', score: 92, time: '8 soat oldin' },
    { type: 'course_started', student: 'Jasur Toxirov', course: 'Frontend Development', score: null, time: '1 kun oldin' }
  ],
  weeklyProgress: [
    { day: 'Du', students: 45 },
    { day: 'Se', students: 52 },
    { day: 'Ch', students: 38 },
    { day: 'Pa', students: 61 },
    { day: 'Ju', students: 47 },
    { day: 'Sh', students: 33 },
    { day: 'Ya', students: 29 }
  ]
};

const InstructorAnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('hafta');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test_completed':
        return Target;
      case 'course_completed':
        return Award;
      case 'assignment_submitted':
        return BookOpen;
      case 'course_started':
        return Users;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'test_completed':
        return 'text-success';
      case 'course_completed':
        return 'text-accent';
      case 'assignment_submitted':
        return 'text-primary';
      case 'course_started':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <DashboardLayout role="instructor" title="Tahlil va statistika" userName="Aziz Domla">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-2">
            {['kun', 'hafta', 'oy', 'yil'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              <span>Eksport</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard
            title="Jami talabalar"
            value={mockAnalyticsData.overview.totalStudents}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Faol kurslar"
            value={mockAnalyticsData.overview.activeCourses}
            icon={BookOpen}
            variant="accent"
          />
          <StatsCard
            title="Resurslar"
            value={mockAnalyticsData.overview.totalResources}
            icon={Activity}
            variant="success"
          />
          <StatsCard
            title="Tugallash darajasi"
            value={`${mockAnalyticsData.overview.completionRate}%`}
            icon={Target}
            variant="warning"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="O'rtacha ball"
            value={mockAnalyticsData.overview.averageScore}
            icon={Award}
            variant="default"
          />
          <StatsCard
            title="Testlar"
            value={mockAnalyticsData.overview.totalTests}
            icon={BarChart3}
            variant="default"
          />
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg">Kurslari performance</h3>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {mockAnalyticsData.coursePerformance.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{course.name}</span>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{course.students} talaba</span>
                      <span>{course.completion}% tugallandi</span>
                      <span>{course.avgScore} ball</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.completion}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg">Haftalik faoliyat</h3>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-end justify-between h-48">
              {mockAnalyticsData.weeklyProgress.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.students / 70) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="w-8 bg-gradient-to-t from-primary to-accent rounded-t-lg min-h-[20px]"
                  />
                  <span className="text-sm font-medium">{day.day}</span>
                  <span className="text-xs text-muted-foreground">{day.students}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg">So'nggi faoliyat</h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {mockAnalyticsData.recentActivity.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.student}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{activity.course}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                      {activity.score && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm font-medium text-success">{activity.score} ball</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg">Performance insights</h3>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Yuqori performance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                JavaScript asoslari kursi 87% o'rtacha ball bilan eng yaxshi performance ko'rsatmoqda
              </p>
            </div>
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">E'tibor kerak</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Frontend Development kursida tugallash darajasi past (68%)
              </p>
            </div>
            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-accent" />
                <span className="font-medium text-accent">O'sish sur'ati</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Talabalar soni o'tgan oyga nisbatan 12% ga oshdi
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorAnalyticsPage;