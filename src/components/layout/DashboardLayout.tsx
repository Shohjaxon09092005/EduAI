import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AIChatbot } from '../ai/AIChatbot';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  title: string;
  userName: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  title,
  userName,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen mesh-bg">
      <Sidebar 
        role={role} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: sidebarOpen ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen"
      >
        <Header 
          title={title} 
          userName={userName}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </motion.main>

      {/* Floating AI Chatbot */}
      <AIChatbot />
    </div>
  );
};
