import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/ui/StatsCard';
import { 
  Users, 
  Search, 
  Mail, 
  Phone,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  Filter,
  Download,
  UserCheck,
  UserX
} from 'lucide-react';

const mockStudentsData = {
  total: 342,
  active: 298,
  inactive: 44,
  topPerformers: 25
};

const mockStudents = [
  {
    id: '1',
    name: 'Ali Valiyev',
    email: 'ali.valiyev@email.com',
    phone: '+998 90 123 45 67',
    course: 'JavaScript asoslari',
    progress: 85,
    lastActivity: '2 soat oldin',
    status: 'active',
    score: 92,
    enrolledDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Zara Karimova',
    email: 'zara.karimova@email.com',
    phone: '+998 91 234 56 78',
    course: 'React va TypeScript',
    progress: 67,
    lastActivity: '1 kun oldin',
    status: 'active',
    score: 88,
    enrolledDate: '2024-01-20'
  },
  {
    id: '3',
    name: 'Bobur Shodiyev',
    email: 'bobur.shodiyev@email.com',
    phone: '+998 93 345 67 89',
    course: 'Node.js Backend',
    progress: 45,
    lastActivity: '3 kun oldin',
    status: 'active',
    score: 76,
    enrolledDate: '2024-02-01'
  },
  {
    id: '4',
    name: 'Malika Azizova',
    email: 'malika.azizova@email.com',
    phone: '+998 94 456 78 90',
    course: 'MongoDB va Database',
    progress: 92,
    lastActivity: '1 soat oldin',
    status: 'active',
    score: 95,
    enrolledDate: '2023-12-10'
  },
  {
    id: '5',
    name: 'Jasur Toxirov',
    email: 'jasur.toxirov@email.com',
    phone: '+998 95 567 89 01',
    course: 'Frontend Development',
    progress: 23,
    lastActivity: '1 hafta oldin',
    status: 'inactive',
    score: 45,
    enrolledDate: '2024-02-15'
  },
  {
    id: '6',
    name: 'Dilshod Abdullayev',
    email: 'dilshod.abdullayev@email.com',
    phone: '+998 97 678 90 12',
    course: 'JavaScript asoslari',
    progress: 78,
    lastActivity: '4 soat oldin',
    status: 'active',
    score: 89,
    enrolledDate: '2024-01-08'
  }
];

const InstructorStudentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    return status === 'active' ? UserCheck : UserX;
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-success' : 'text-muted-foreground';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-success';
    if (progress >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <DashboardLayout role="instructor" title="Talabalar" userName="Aziz Domla">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Jami talabalar"
            value={mockStudentsData.total}
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Faol talabalar"
            value={mockStudentsData.active}
            icon={UserCheck}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Nofaol talabalar"
            value={mockStudentsData.inactive}
            icon={UserX}
            variant="warning"
          />
          <StatsCard
            title="Yuqori natijalar"
            value={mockStudentsData.topPerformers}
            icon={Award}
            variant="accent"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Talaba qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Barcha holatlar</option>
              <option value="active">Faol</option>
              <option value="inactive">Nofaol</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              <span>Qo'shimcha filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              <span>Eksport</span>
            </button>
          </div>
        </div>

        {/* Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-6 border-b border-border">
            <h3 className="font-display font-semibold text-lg">Talabalar ro'yxati</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Talaba</th>
                  <th className="text-left p-4 font-medium">Kurs</th>
                  <th className="text-left p-4 font-medium">Progress</th>
                  <th className="text-left p-4 font-medium">Ball</th>
                  <th className="text-left p-4 font-medium">Holati</th>
                  <th className="text-left p-4 font-medium">Oxirgi faoliyat</th>
                  <th className="text-left p-4 font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => {
                  const StatusIcon = getStatusIcon(student.status);
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                          <div className="text-xs text-muted-foreground">{student.phone}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{student.course}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{student.progress}%</span>
                            <span className={getProgressColor(student.progress)}>{student.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${student.progress}%` }}
                              transition={{ delay: index * 0.1, duration: 0.6 }}
                              className={`h-2 rounded-full ${
                                student.progress >= 80 ? 'bg-success' :
                                student.progress >= 60 ? 'bg-warning' : 'bg-destructive'
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-warning" />
                          <span className="font-medium">{student.score}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${getStatusColor(student.status)}`} />
                          <span className={`text-sm capitalize ${getStatusColor(student.status)}`}>
                            {student.status === 'active' ? 'Faol' : 'Nofaol'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{student.lastActivity}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Student Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg">Performance insights</h3>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Yuqori performers</span>
              </div>
              <p className="text-sm text-muted-foreground">
                25 ta talaba 90% dan yuqori natija ko'rsatmoqda
              </p>
            </div>
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">E'tibor kerak</span>
              </div>
              <p className="text-sm text-muted-foreground">
                12 ta talaba 1 haftadan ortiq faol emas
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-medium text-primary">O'sish sur'ati</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O'rtacha progress 15% ga oshdi
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorStudentsPage;