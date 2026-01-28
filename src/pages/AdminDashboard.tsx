import  { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Activity,
  GraduationCap,
  Award,
  Calendar
} from 'lucide-react';

const recentActivities = [
  { id: 1, action: "Yangi kurs qo'shildi", user: "Aziz Domla", time: "5 daqiqa oldin" },
  { id: 2, action: "Test yakunlandi", user: "Malika Talaba", time: "15 daqiqa oldin" },
  { id: 3, action: "Resurs yuklandi", user: "Jasur Domla", time: "1 soat oldin" },
  { id: 4, action: "Yangi foydalanuvchi", user: "Nilufar Talaba", time: "2 soat oldin" },
];

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout role="admin" title="Boshqaruv paneli" userName="Admin">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Jami talabalar"
            value="2,847"
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Faol kurslar"
            value="156"
            icon={BookOpen}
            variant="accent"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Resurslar"
            value="1,234"
            icon={FileText}
            variant="success"
          />
          <StatsCard
            title="O'rtacha ball"
            value="78%"
            icon={TrendingUp}
            variant="warning"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg">Faollik statistikasi</h3>
              <select className="px-3 py-2 rounded-lg bg-muted border-0 text-sm focus:ring-2 focus:ring-primary">
                <option>So'nggi 7 kun</option>
                <option>So'nggi 30 kun</option>
                <option>So'nggi 90 kun</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-xl">
              <div className="text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Grafik joylashadigan joy</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-6">Tezkor statistika</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Bitirganlar</p>
                    <p className="text-sm text-muted-foreground">Bu oy</p>
                  </div>
                </div>
                <span className="text-2xl font-display font-bold">89</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Sertifikatlar</p>
                    <p className="text-sm text-muted-foreground">Berilgan</p>
                  </div>
                </div>
                <span className="text-2xl font-display font-bold">234</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Yangi ro'yxatlar</p>
                    <p className="text-sm text-muted-foreground">Bu hafta</p>
                  </div>
                </div>
                <span className="text-2xl font-display font-bold">156</span>
              </div>
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
          <h3 className="font-display font-semibold text-lg mb-4">So'nggi faoliyat</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
