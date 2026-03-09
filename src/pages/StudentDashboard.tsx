import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/ui/StatsCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { LearningPath } from "@/components/student/LearningPath";
import { Gamification } from "@/components/student/Gamification";
import { AITest } from "@/components/student/AITest";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import analyticsService from "@/services/analytics.service";
import enrollmentService from "@/services/enrollment.service";
import {
  BookOpen,
  Trophy,
  Target,
  Zap,
  Sparkles,
  Play,
  Clock,
  ChevronRight,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentDashboard as StudentDashboardType } from "@/types";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<
    "overview" | "path" | "test" | "achievements"
  >("overview");
  const [dashStats, setDashStats] = useState<StudentDashboardType | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch student dashboard data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoadingStats(true);
      try {
        const stats = await analyticsService.getStudentDashboard();
        setDashStats(stats);
      } catch (error) {
        console.error("Failed to load student dashboard:", error);
        toast({
          title: "Xato",
          description: "Panelni yuklab olishda xato",
          variant: "destructive",
        });
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, toast]);

  return (
    <DashboardLayout
      role="student"
      title="Talaba paneli"
      userName={user?.name || user?.email || "Talaba"}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Umumiy", icon: BookOpen },
            { id: "path", label: "O'rganish yo'li", icon: Target },
            { id: "test", label: "AI Test", icon: Brain },
            { id: "achievements", label: "Yutuqlar", icon: Trophy },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all",
                activeSection === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Bajarilgan darslar"
                value={
                  loadingStats
                    ? "..."
                    : String(dashStats?.completed_videos || 0)
                }
                subtitle={
                  loadingStats
                    ? ""
                    : `${dashStats?.enrolled_courses?.length || 0} dan`
                }
                icon={BookOpen}
                variant="primary"
              />
              <StatsCard
                title="O'rtacha ball"
                value={
                  loadingStats ? "..." : `${dashStats?.avg_quiz_score || 0}%`
                }
                icon={Trophy}
                variant="accent"
              />
              <StatsCard
                title="Weak Topics"
                value={
                  loadingStats
                    ? "..."
                    : String(dashStats?.weak_topics?.length || 0)
                }
                icon={Zap}
                variant="warning"
              />
              <StatsCard
                title="Progress"
                value={loadingStats ? "..." : "100%"}
                icon={Target}
                variant="success"
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Continue Learning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-lg">
                    Davom ettirish
                  </h3>
                  <button className="text-sm text-primary font-medium hover:underline">
                    Barchasini ko'rish
                  </button>
                </div>

                <div className="space-y-4">
                  {loadingStats ? (
                    <p className="text-muted-foreground">Yuklanmoqda...</p>
                  ) : dashStats?.enrolled_courses &&
                    dashStats.enrolled_courses.length > 0 ? (
                    dashStats.enrolled_courses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all group"
                      >
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
                          📚
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {course.course_title}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span>
                              {Math.floor(course.progress_percent)}% bajarildi
                            </span>
                          </div>
                          {course.progress_percent > 0 && (
                            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${course.progress_percent}%`,
                                }}
                                transition={{
                                  duration: 0.5,
                                  delay: index * 0.1,
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                              />
                            </div>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/25"
                        >
                          <Play className="w-4 h-4 ml-0.5" />
                        </motion.button>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      Hali kursga yozilmagan
                    </p>
                  )}
                </div>
              </motion.div>

              {/* AI Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-semibold text-lg">
                    AI tavsiyalari
                  </h3>
                </div>

                <div className="space-y-4">
                  {loadingStats ? (
                    <p className="text-muted-foreground">Yuklanmoqda...</p>
                  ) : dashStats?.recommendations &&
                    dashStats.recommendations.length > 0 ? (
                    dashStats.recommendations.slice(0, 3).map((rec, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20"
                      >
                        <p className="text-sm mb-2">
                          <span className="text-accent font-medium">
                            Tavsiya:
                          </span>{" "}
                          {rec}
                        </p>
                        <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                          Ko'proq ma'lumot <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-success/10 border border-success/20"
                    >
                      <p className="text-sm text-success font-medium mb-1">
                        🎯 Ajoyib ishlar!
                      </p>
                      <p className="text-sm">
                        Siz barcha test natijalarini yaxshi bajardingiz
                      </p>
                    </motion.div>
                  )}

                  {dashStats?.weak_topics &&
                    dashStats.weak_topics.length > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-muted/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-accent" />
                          <span className="text-sm text-muted-foreground">
                            Mustahkam ko'nikma uchun
                          </span>
                        </div>
                        <p className="text-sm">
                          <span className="font-medium text-accent">
                            {dashStats.weak_topics[0]}
                          </span>{" "}
                          mavzusini ko'proq o'rganish tavsiya etiladi
                        </p>
                      </motion.div>
                    )}
                </div>

                {/* Weekly Progress */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h4 className="font-medium mb-4">Haftalik progress</h4>
                  <div className="flex justify-center">
                    <ProgressRing
                      progress={dashStats?.avg_quiz_score || 0}
                      label="bajarildi"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Learning Path Section */}
        {activeSection === "path" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-lg">
                O'rganish yo'li
              </h3>
            </div>
            <LearningPath
              nodes={[]}
              onNodeClick={(node) => console.log("Node clicked:", node)}
            />
          </motion.div>
        )}

        {/* AI Test Section */}
        {activeSection === "test" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <AITest
              onComplete={(score, answers) =>
                console.log("Test completed:", score, answers)
              }
            />
          </motion.div>
        )}

        {/* Achievements Section */}
        {activeSection === "achievements" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Gamification />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
