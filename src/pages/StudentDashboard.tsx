import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { LearningPath } from '@/components/student/LearningPath';
import { Gamification } from '@/components/student/Gamification';
import { AITest } from '@/components/student/AITest';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Zap,
  Sparkles,
  Play,
  Clock,
  ChevronRight,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

const recommendedCourses = [
  { id: 1, title: "JavaScript asoslari", progress: 65, lessons: 24, image: "🚀" },
  { id: 2, title: "React frameworki", progress: 30, lessons: 18, image: "⚛️" },
  { id: 3, title: "TypeScript", progress: 0, lessons: 16, image: "📘" },
];

const StudentDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'path' | 'test' | 'achievements'>('overview');

  return (
    <DashboardLayout role="student" title="Talaba paneli" userName="Talaba">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Umumiy', icon: BookOpen },
            { id: 'path', label: "O'rganish yo'li", icon: Target },
            { id: 'test', label: 'AI Test', icon: Brain },
            { id: 'achievements', label: 'Yutuqlar', icon: Trophy },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all",
                activeSection === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Bajarilgan darslar"
                value="47"
                subtitle="78 dan"
                icon={BookOpen}
                variant="primary"
              />
              <StatsCard
                title="Joriy daraja"
                value="9"
                icon={Trophy}
                variant="accent"
              />
              <StatsCard
                title="XP ballar"
                value="3,847"
                icon={Zap}
                variant="warning"
                trend={{ value: 250, isPositive: true }}
              />
              <StatsCard
                title="O'rtacha ball"
                value="85%"
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
                  <h3 className="font-display font-semibold text-lg">Davom ettirish</h3>
                  <button className="text-sm text-primary font-medium hover:underline">
                    Barchasini ko'rish
                  </button>
                </div>

                <div className="space-y-4">
                  {recommendedCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all group"
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
                        {course.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium group-hover:text-primary transition-colors">{course.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>{course.lessons} dars</span>
                          <span>•</span>
                          <span>{course.progress}% bajarildi</span>
                        </div>
                        {course.progress > 0 && (
                          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  ))}
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
                  <h3 className="font-display font-semibold text-lg">AI tavsiyalari</h3>
                </div>

                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20"
                  >
                    <p className="text-sm mb-2">
                      <span className="text-accent font-medium">Tavsiya:</span> JavaScript testingizda{' '}
                      <span className="font-medium">Promise</span> mavzusida qiyinchilik sezdik.
                    </p>
                    <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                      Mavzuni takrorlash <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-muted/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Optimal vaqt</span>
                    </div>
                    <p className="text-sm">
                      Sizning eng samarali o'rganish vaqtingiz <span className="font-medium text-primary">09:00 - 11:00</span>
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-success/10 border border-success/20"
                  >
                    <p className="text-sm text-success font-medium mb-1">🎯 Kunlik maqsad</p>
                    <p className="text-sm">Bugun 2 ta dars o'ting va 1 ta test yeching</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2 rounded-full bg-success/20 overflow-hidden">
                        <div className="h-full w-1/3 rounded-full bg-success" />
                      </div>
                      <span className="text-xs text-muted-foreground">1/3</span>
                    </div>
                  </motion.div>
                </div>

                {/* Weekly Progress */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h4 className="font-medium mb-4">Haftalik progress</h4>
                  <div className="flex justify-center">
                    <ProgressRing progress={68} label="bajarildi" />
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Learning Path Section */}
        {activeSection === 'path' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-lg">O'rganish yo'li</h3>
            </div>
            <LearningPath 
              nodes={[]}
              onNodeClick={(node) => console.log('Node clicked:', node)}
            />
          </motion.div>
        )}

        {/* AI Test Section */}
        {activeSection === 'test' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <AITest 
              onComplete={(score, answers) => console.log('Test completed:', score, answers)}
            />
          </motion.div>
        )}

        {/* Achievements Section */}
        {activeSection === 'achievements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Gamification />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
