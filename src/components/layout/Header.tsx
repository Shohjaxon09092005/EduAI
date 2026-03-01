import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, Sun, Moon, Menu, LogOut, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const userName = user ? (user.first_name || user.email) : 'Foydalanuvchi';
  const role = user?.role;

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-border/50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-display font-bold"
            >
              {title}
            </motion.h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                       placeholder:text-muted-foreground transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-accent" />
              ) : (
                <Sun className="w-5 h-5 text-warning" />
              )}
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </motion.button>

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-medium text-sm">{userName}</div>
                <div className="text-xs text-muted-foreground capitalize">{role || 'User'}</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-lg overflow-hidden z-50"
              >
                <div className="p-4 border-b border-border">
                  <p className="font-semibold text-sm">{userName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{role}</p>
                </div>
                <button
                  onClick={() => {
                    navigate(`/${role}/settings`);
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Sozlamalar
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive transition-colors text-sm border-t border-border"
                >
                  <LogOut className="w-4 h-4" />
                  Chiqish
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
};
