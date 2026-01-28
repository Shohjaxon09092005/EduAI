import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  ChevronLeft,
  GraduationCap,
  Trophy,
  BarChart3,
  FolderOpen,
  ClipboardList,
  Map,
  MessageSquare,
  Bell,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onToggle: () => void;
}

const adminLinks = [
  { icon: LayoutDashboard, label: "Boshqaruv paneli", path: "/admin" },
  { icon: Users, label: "Foydalanuvchilar", path: "/admin/users" },
  { icon: BookOpen, label: "Kurslar", path: "/admin/courses" },
  { icon: BarChart3, label: "Statistika", path: "/admin/statistics" },
  { icon: Settings, label: "Sozlamalar", path: "/admin/settings" },
];

const instructorLinks = [
  { icon: LayoutDashboard, label: "Boshqaruv paneli", path: "/instructor" },
  { icon: BookOpen, label: "Mening kurslarim", path: "/instructor/courses" },
  { icon: FolderOpen, label: "Resurslar", path: "/instructor/resources" },
  { icon: ClipboardList, label: "Testlar", path: "/instructor/tests" },
  { icon: Users, label: "Talabalar", path: "/instructor/students" },
  { icon: BarChart3, label: "Tahlil", path: "/instructor/analytics" },
];

const studentLinks = [
  { icon: LayoutDashboard, label: "Boshqaruv paneli", path: "/student" },
  { icon: BookOpen, label: "Kurslarim", path: "/student/courses" },
  { icon: Map, label: "O'rganish yo'li", path: "/student/learning-path" },
  { icon: ClipboardList, label: "Testlar", path: "/student/tests" },
  { icon: Trophy, label: "Yutuqlar", path: "/student/achievements" },
  { icon: BarChart3, label: "Progress", path: "/student/progress" },
];

const getLinksByRole = (role: UserRole) => {
  switch (role) {
    case 'admin': return adminLinks;
    case 'instructor': return instructorLinks;
    case 'student': return studentLinks;
    default: return [];
  }
};

const getRoleTitle = (role: UserRole) => {
  switch (role) {
    case 'admin': return "Admin Panel";
    case 'instructor': return "Domla Panel";
    case 'student': return "Talaba Panel";
    default: return "Panel";
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onToggle }) => {
  const location = useLocation();
  const links = getLinksByRole(role);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-40 glass-card border-r border-border/50"
    >
      <div className="flex flex-col h-full">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-lg gradient-text">EduAI</h1>
                  <p className="text-xs text-muted-foreground">{getRoleTitle(role)}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </motion.button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {links.map((link, index) => (
              <motion.li
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    "hover:bg-primary/10",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium whitespace-nowrap overflow-hidden"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-border/50 space-y-1">
          <button className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200">
            <Bell className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Bildirishnomalar</span>}
          </button>
          <button className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Chiqish</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
