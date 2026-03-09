import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sun, Moon, Menu, LogOut, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, WsNotification } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

// Add this ABOVE the Header function definition:
const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleOpen = () => {
    setOpen(v => !v);
    if (!open && unreadCount > 0) markAllRead();
  };

  const typeIcon = (type: WsNotification['type']) => {
    switch (type) {
      case 'pipeline_ready':  return '✅';
      case 'pipeline_failed': return '❌';
      case 'quiz_result':     return '📊';
      case 'enrollment':      return '🎓';
      default:                return 'ℹ️';
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="relative p-2.5 rounded-xl hover:bg-muted transition-colors"
        aria-label="Bildirishnomalar"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full
                       bg-destructive text-white text-[10px] font-bold
                       flex items-center justify-center px-1 leading-none"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 z-50
                       glass-card border border-border/60 shadow-xl rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <h3 className="font-semibold text-sm">Bildirishnomalar</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Barchasini o'qildi
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Bell className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Bildirishnomalar yo'q</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`flex gap-3 px-4 py-3 border-b border-border/30 last:border-0 transition-colors
                                ${notif.read ? 'opacity-60' : 'bg-primary/[0.03] hover:bg-muted/40'}`}
                  >
                    <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon(notif.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${!notif.read ? '' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {new Date(notif.timestamp).toLocaleString('uz', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-border/50 bg-muted/20">
                <p className="text-xs text-center text-muted-foreground">
                  Jami {notifications.length} ta bildirishnoma
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
          <NotificationBell />

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
