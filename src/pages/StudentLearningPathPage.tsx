import React from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LearningPath } from '@/components/student/LearningPath';
import { ResourceViewer } from '@/components/instructor/ResourceViewer';
import { Map, Sparkles, BookOpen, Target } from 'lucide-react';
import { LearningNode, Resource } from '@/types';

const mockNodes: LearningNode[] = [
  { id: '1', title: 'JavaScript Kirish', type: 'lesson', status: 'completed', xpReward: 100, connections: ['2'] },
  { id: '2', title: 'O\'zgaruvchilar va Ma\'lumot turlari', type: 'lesson', status: 'completed', xpReward: 150, connections: ['3'] },
  { id: '3', title: 'Asosiy Operatorlar Testi', type: 'quiz', status: 'in-progress', xpReward: 200, connections: ['4'] },
  { id: '4', title: 'Shartli operatorlar', type: 'lesson', status: 'available', xpReward: 250, connections: ['5'] },
  { id: '5', title: 'Kichik loyiha: Kalkulyator', type: 'project', status: 'locked', xpReward: 500, connections: [] },
];

const mockResources: Resource[] = [
  {
    id: '1',
    title: "JavaScript Operatorlar Qo'llanmasi.pdf",
    type: 'pdf',
    url: '#',
    uploadedAt: new Date(),
    size: '1.2 MB',
    aiTopics: ['Operatorlar', 'JS Asoslari'],
    courseId: '1',
  },
  {
    id: '2',
    title: "Sintaksis haqida qisqacha video",
    type: 'video',
    url: '#',
    uploadedAt: new Date(),
    size: '15 MB',
    aiTopics: ['Sintaksis', 'Video dars'],
    courseId: '1',
  },
];

const StudentLearningPathPage: React.FC = () => {
  return (
    <DashboardLayout role="student" title="Resurslar bilan o'rganish yo'li" userName="Talaba">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display gradient-text">Sizning o'rganish yo'lingiz</h2>
            <p className="text-muted-foreground">AI tomonidan generatsiya qilingan optimal bilim olish yo'nalishi</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Optimal Yo'nalish</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Learning Path */}
          <div className="xl:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <Map className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Vizual yo'l xaritasi</h3>
              </div>
              <LearningPath 
                nodes={mockNodes} 
                onNodeClick={(node) => console.log('Node clicked:', node)} 
              />
            </div>
          </div>

          {/* Resources Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
                <BookOpen className="w-5 h-5 text-accent" />
                <h3 className="font-display font-semibold text-lg">Tavsiya etilgan resurslar</h3>
              </div>
              <ResourceViewer 
                resources={mockResources} 
                onView={(resource) => console.log('Viewing resource:', resource)}
              />
            </div>

            <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Keyingi maqsad</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                "Asosiy Operatorlar Testi"ni yakunlang va 200 XP ballga ega bo'ling.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25"
              >
                Davom ettirish
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentLearningPathPage;
