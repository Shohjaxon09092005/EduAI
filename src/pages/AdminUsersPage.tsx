import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { User, UserRole } from '@/types';
import {
  Users,
  Search,
  Filter,
  Grid3x3,
  List,
  UserCog,
  Mail,
  Shield,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alisher Karimov',
    email: 'alisher@example.com',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alisher',
    level: 5,
    xp: 2450,
  },
  {
    id: '2',
    name: 'Zarina Toshmatova',
    email: 'zarina@example.com',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zarina',
    level: 4,
    xp: 1890,
  },
  {
    id: '3',
    name: 'Bobur Rahimov',
    email: 'bobur@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bobur',
    level: 3,
    xp: 890,
  },
  {
    id: '4',
    name: 'Malika Abdullayeva',
    email: 'malika@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Malika',
    level: 6,
    xp: 3200,
  },
  {
    id: '5',
    name: 'Jamshid Umarov',
    email: 'jamshid@example.com',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamshid',
    level: 7,
    xp: 4500,
  },
  {
    id: '6',
    name: 'Nilufar Saidova',
    email: 'nilufar@example.com',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nilufar',
    level: 2,
    xp: 450,
  },
  {
    id: '7',
    name: 'Aziz Qodirov',
    email: 'aziz@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aziz',
    level: 10,
    xp: 10000,
  },
  {
    id: '8',
    name: 'Dilshod Nazarov',
    email: 'dilshod@example.com',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dilshod',
    level: 8,
    xp: 5600,
  },
];

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  instructor: 'O\'qituvchi',
  student: 'Talaba',
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  instructor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  student: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleUserAction = (action: string, userId: string) => {
    console.log(`Action: ${action} on user: ${userId}`);
  };

  const stats = {
    total: mockUsers.length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    instructors: mockUsers.filter(u => u.role === 'instructor').length,
    students: mockUsers.filter(u => u.role === 'student').length,
  };

  return (
    <DashboardLayout role="admin" title="Foydalanuvchilar" userName="Admin">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Jami foydalanuvchilar"
            value={stats.total.toString()}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Adminlar"
            value={stats.admins.toString()}
            icon={Shield}
            variant="accent"
          />
          <StatsCard
            title="O'qituvchilar"
            value={stats.instructors.toString()}
            icon={UserCog}
            variant="warning"
          />
          <StatsCard
            title="Talabalar"
            value={stats.students.toString()}
            icon={Users}
            variant="success"
          />
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Foydalanuvchilar bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4">
                {/* Role Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Rol</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="all">Barcha rollar</option>
                    <option value="admin">Admin</option>
                    <option value="instructor">O'qituvchi</option>
                    <option value="student">Talaba</option>
                  </select>
                </div>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-lg transition-all',
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filteredUsers.length}</span> ta foydalanuvchi topildi
          </p>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Foydalanuvchi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Level
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    XP
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full bg-muted"
                        />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        roleColors[user.role]
                      )}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">Level {user.level}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-muted-foreground">{user.xp?.toLocaleString()} XP</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUserAction('view', user.id)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('edit', user.id)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('delete', user.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Foydalanuvchilar topilmadi</h3>
              <p className="text-muted-foreground">Qidiruv yoki filtrlarni o'zgartiring</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
