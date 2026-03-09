import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import analyticsService from "@/services/analytics.service";
import { TeacherDashboard } from "@/types";
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
  Filter,
} from "lucide-react";

const InstructorAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("hafta");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [dashStats, setDashStats] = useState<TeacherDashboard | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch analytics data on mount
  useEffect(() => {
    const loadAnalytics = async () => {
      setLoadingStats(true);
      try {
        const stats = await analyticsService.getTeacherDashboard();
        setDashStats(stats);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        toast({
          title: "Xato",
          description: "Tahlilni yuklab olishda xato",
          variant: "destructive",
        });
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      loadAnalytics();
    }
  }, [user, toast]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "test_completed":
        return Target;
      case "course_completed":
        return Award;
      case "assignment_submitted":
        return BookOpen;
      case "course_started":
        return Users;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "test_completed":
        return "text-success";
      case "course_completed":
        return "text-accent";
      case "assignment_submitted":
        return "text-primary";
      case "course_started":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <DashboardLayout
      role="instructor"
      title="Tahlil va statistika"
      userName={user?.name || user?.email || "Domla"}
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-2">
            {["kun", "hafta", "oy", "yil"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
            value={
              loadingStats ? "..." : String(dashStats?.total_students || 0)
            }
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Faol kurslar"
            value={loadingStats ? "..." : String(dashStats?.total_courses || 0)}
            icon={BookOpen}
            variant="accent"
          />
          <StatsCard
            title="Videoishlar"
            value={loadingStats ? "..." : String(dashStats?.total_videos || 0)}
            icon={Activity}
            variant="success"
          />
          <StatsCard
            title="O'rtacha ball"
            value={loadingStats ? "..." : `${dashStats?.avg_score || 0}%`}
            icon={Target}
            variant="warning"
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="So'nggi natijalar"
            value={
              loadingStats
                ? "..."
                : String(dashStats?.recent_results?.length || 0)
            }
            icon={Award}
            variant="default"
          />
          <StatsCard
            title="Qo'rgilanish kerak"
            value={
              loadingStats
                ? "..."
                : String(dashStats?.weak_topics_summary?.length || 0)
            }
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
              <h3 className="font-display font-semibold text-lg">
                Qo'rgilanish kerak mavzular
              </h3>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {loadingStats ? (
                <p className="text-muted-foreground">Yuklanmoqda...</p>
              ) : dashStats?.weak_topics_summary &&
                dashStats.weak_topics_summary.length > 0 ? (
                dashStats.weak_topics_summary.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{topic.topic}</span>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{topic.count} talaba</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(topic.count / (dashStats.total_students || 1)) * 100}%`,
                        }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Hali ma'lumot yo'q</p>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg">
                Haftalik faoliyat
              </h3>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            {loadingStats ? (
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            ) : (
              <div className="flex items-end justify-between h-48">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 100}%` }}
                      transition={{ delay: day * 0.1, duration: 0.6 }}
                      className="w-8 bg-gradient-to-t from-primary to-accent rounded-t-lg min-h-[20px]"
                    />
                    <span className="text-sm font-medium">
                      {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"][day]}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
            <h3 className="font-display font-semibold text-lg">
              So'nggi faoliyat
            </h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {loadingStats ? (
              <p className="text-muted-foreground">Yuklanmoqda...</p>
            ) : dashStats?.recent_results &&
              dashStats.recent_results.length > 0 ? (
              dashStats.recent_results.slice(0, 5).map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-success">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.student_name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {result.test_title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Test natijasi
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm font-medium text-success">
                        {result.score}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-muted-foreground">Hali faoliyat yo'q</p>
            )}
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
            <h3 className="font-display font-semibold text-lg">
              Performance insights
            </h3>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="font-medium text-success">
                  Yuqori performance
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                JavaScript asoslari kursi 87% o'rtacha ball bilan eng yaxshi
                performance ko'rsatmoqda
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
