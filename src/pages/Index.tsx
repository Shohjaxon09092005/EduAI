import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Sparkles, ChevronRight, Shield, Zap, Trophy } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  const roles = [
    { title: "Admin", desc: "Universitet boshqaruvi", path: "/admin", icon: Shield, color: "from-primary to-primary/70" },
    { title: "Domla", desc: "O'qituvchi paneli", path: "/instructor", icon: BookOpen, color: "from-accent to-accent/70" },
    { title: "Talaba", desc: "O'quvchi paneli", path: "/student", icon: GraduationCap, color: "from-success to-success/70" },
  ];

  return (
    <div className="min-h-screen mesh-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">EduAI</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-warning" />}
          </motion.button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-powered ta'lim platformasi</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Zamonaviy <span className="gradient-text">AI ta'lim</span> platformasi
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Sun'iy intellekt yordamida o'rganishni osonlashtiring. Interaktiv darslar, AI testlar va shaxsiy o'rganish yo'li.
            </p>
          </motion.div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {roles.map((role, index) => (
              <motion.div
                key={role.path}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link to={role.path}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="glass-card-hover p-8 text-center group"
                  >
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <role.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-xl mb-2">{role.title}</h3>
                    <p className="text-muted-foreground mb-4">{role.desc}</p>
                    <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                      Kirish <ChevronRight className="w-4 h-4" />
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "AI Tutor", desc: "24/7 sun'iy intellekt yordamchisi" },
              { icon: Zap, title: "Tezkor o'rganish", desc: "Shaxsiy o'rganish yo'li" },
              { icon: Trophy, title: "Gamifikatsiya", desc: "Badge, level va leaderboard" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
