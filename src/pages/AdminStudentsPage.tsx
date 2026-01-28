import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { User } from '@/types';
import {
  Users,
  Search,
  Filter,
  BookOpen,
  Trophy,
  TrendingUp,
  Calendar,
  Mail,
  MoreVertical,
  Eye,
  Edit,
  MessageSquare,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockStudents: User[] = [
  {
    id: '1',
    name: 'Bobur Rahimov',
    email: 'bobur@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bobur',
    level: 3,
    xp: 890,
    badges: [
      { id: 'b1', name: 'Birinchi qadam', description: 'Birinchi kursni boshladi', icon: '🎯', tier: 'bronze', earnedAt: new Date('2024-01-15') },
      { id: 'b2', name: 'Test to\'purari', description: '10 ta test tugatdi', icon: '📝', tier: 'silver', earnedAt: new Date('2024-02-01') },
    ],
  },
  {
    id: '2',
    name: 'Malika Abdullayeva',
    email: 'malika@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Malika',
    level: 6,
    xp: 3200,
    badges: [
      { id: 'b1', name: 'Birinchi qadam', description: 'Birinchi kursni boshladi', icon: '🎯', tier: 'bronze', earnedAt: new Date('2023-11-20') },
      { id: 'b2', name: 'Test to\'purari', description: '10 ta test tugatdi', icon: '📝', tier: 'silver', earnedAt: new Date('2023-12-15') },
      { id: 'b3', name: 'Kurs bitkazuvchi', description: '5 ta kurs tugatdi', icon: '🎓', tier: 'gold', earnedAt: new Date('2024-01-30') },
    ],
  },
  {
    id: '3',
    name: 'Nilufar Saidova',
    email: 'nilufar@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar',
    level: 2,
    xp: 450,
    badges: [
      { id: 'b1', name: 'Birinchi qadam', description: 'Birinchi kursni boshladi', icon: '🎯', tier: 'bronze', earnedAt: new Date('2024-02-10') },
    ],
  },
  {
    id: '4',
    name: 'Sardor Toirov',
    email: 'sardor@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sardor',
    level: 4,
    xp: 1650,
    badges: [
      { id: 'b1', name: 'Birinchi qadam', description: 'Birinchi kursni boshladi', icon: '🎯', tier: 'bronze', earnedAt: new Date('2024-01-05') },
      { id: 'b2', name: 'Test to\'purari', description: '10 ta test tugatdi', icon: '📝', tier: 'silver', earnedAt: new Date('2024-01-25') },
    ],
  },
  {
    id: '5',
    name: 'Gulbahor Karimova',
    email: 'gulbahor@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gulbahor',
    level: 7,
    xp: 4200,
    badges: [
      { id: 'b1', name: 'Birinchi qadam', description: 'Birinchi kursni boshladi', icon: '🎯', tier: 'bronze', earnedAt: new Date('2023-09-01') },
      { id: 'b2', name: 'Test to\'purari', description: '10 ta test tugatdi', icon: '📝', tier: 'silver', earnedAt: new Date('2023-10-15') },
      { id: 'b3', name: 'Kurs bitkazuvchi', description: '5 ta kurs tugatdi', icon: '🎓', tier: 'gold', earnedAt: new Date('2023-12-01') },
      { id: 'b4', name: 'Kod ustasi', description: '100+ kod yozdi', icon: '💻', tier: 'gold', earnedAt: new Date('2024-01-20') },
    ],
  },
  {
    id: '6',
    name: 'Otabek Shukurov',
    email: 'otabek@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Otabek',
    level: 1,
    xp: 120,
    badges: [],
  },
  {
    id: '7',
    name: 'Zuhra Holmatova',
    email: 'zuhra@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zuhra',
    level: 5,
    xp: 2100,
    badges: [
      { id: 'b1', name: 'Birinchi qadam', description: 'Birinchi kursni boshladi', icon: '🎯', tier: 'bronze', earnedAt: new Date('2023-12-10') },
      { id: 'b2', name: 'Test to\'purari', description: '10 ta test tugatdi', icon: '📝', tier: 'silver', earnedAt: new Date('2024-01-05') },
      { id: 'b3', name: 'Kurs bitkazuvchi', description: '5 ta kurs tugatdi', icon: '🎓', tier: 'gold', earnedAt: new Date('2024-02-15') },
    ],
  },
  {
    id: '8',
    name: 'Rustam Yuldashev',
    email: 'rustam@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rustam',
    level: 8,
    xp: 5800,
    badges: [
      { id: 'b1', name: 'Birinchi qadam', description: 'Birinchi kursni boshladi', icon: '🎯', tier: 'bronze', earnedAt: new Date('2023-07-20') },
      { id: 'b2', name: 'Test to\'purari', description: '10 ta test tugatdi', icon: '📝', tier: 'silver', earnedAt: new Date('2023-08-15') },
      { id: 'b3', name: 'Kurs bitkazuvchi', description: '5 ta kurs tugatdi', icon: '🎓', tier: 'gold', earnedAt: new Date('2023-10-01') },
      { id: 'b4', name: 'Kod ustasi', description: '100+ kod yozdi', icon: '💻', tier: 'gold', earnedAt: new Date('2023-11-15') },
      { id: 'b5', name: 'Oltin talaba', description: '10 ta kurs tugatdi', icon: '⭐', tier: 'gold', earnedAt: new Date('2024-01-10') },
    ],
  },
];

const badgeTierColors = {
  bronze: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  silver: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const AdminStudentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || 
      (selectedLevel === 'beginner' && student.level! <= 3) ||
      (selectedLevel === 'intermediate' && student.level! > 3 && student.level! <= 6) ||
      (selectedLevel === 'advanced' && student.level! > 6);
    return matchesSearch && matchesLevel;
  });

  const stats = {
    total: mockStudents.length,
    active: mockStudents.filter(s => s.xp! > 1000).length,
    totalXP: mockStudents.reduce((acc, s) => acc + (s.xp || 0), 0),
    totalBadges: mockStudents.reduce((acc, s) => acc + (s.badges?.length || 0), 0),
  };

  return (
    <DashboardLayout role="instructor" title="Talabalar" userName="O'qituvchi">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Jami talabalar"
            value={stats.total.toString()}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Faol talabalar"
            value={stats.active.toString()}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="Jami XP"
            value={stats.totalXP.toLocaleString()}
            icon={Trophy}
            variant="accent"
          />
          <StatsCard
            title="Yutuqlar"
            value={stats.totalBadges.toString()}
            icon={Award}
            variant="warning"
          />
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Talabalar bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Level Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Daraja</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="all">Barcha darajalar</option>
                <option value="beginner">Beginner (1-3)</option>
                <option value="intermediate">Intermediate (4-6)</option>
                <option value="advanced">Advanced (7+)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredStudents.length}</span> ta talaba topildi
          </p>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full bg-muted"
                  />
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">Level {student.level}</p>
                  </div>
                </div>
                <button className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{student.xp?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{student.badges?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Yutuqlar</p>
                </div>
              </div>

              {/* Badges Preview */}
              {student.badges && student.badges.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Yutuqlar</p>
                  <div className="flex flex-wrap gap-1">
                    {student.badges.slice(0, 3).map((badge) => (
                      <span
                        key={badge.id}
                        className={cn(
                          'px-2 py-1 rounded-full text-xs',
                          badgeTierColors[badge.tier]
                        )}
                        title={badge.name}
                      >
                        {badge.icon}
                      </span>
                    ))}
                    {student.badges.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                        +{student.badges.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border/50">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Ko'rish
                </button>
                <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Talabalar topilmadi</h3>
            <p className="text-muted-foreground">Qidiruv yoki filtrlarni o'zgartiring</p>
          </motion.div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Talaba ma'lumotlari</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full bg-muted"
                />
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{selectedStudent.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{selectedStudent.level}</p>
                  <p className="text-sm text-muted-foreground">Level</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold">{selectedStudent.xp?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">XP</p>
                </div>
              </div>

              {/* All Badges */}
              {selectedStudent.badges && selectedStudent.badges.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Barcha yutuqlar</h4>
                  <div className="space-y-2">
                    {selectedStudent.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <span className="text-2xl">{badge.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">{badge.name}</p>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                        </div>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium capitalize',
                          badgeTierColors[badge.tier]
                        )}>
                          {badge.tier}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-6 border-t border-border/50">
                <button className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                  Tahrirlash
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors font-medium">
                  Xabar yuborish
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminStudentsPage;
