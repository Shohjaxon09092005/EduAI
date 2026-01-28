import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Settings,
  Bell,
  Lock,
  User,
  Shield,
  Globe,
  Palette,
  Database,
  Mail,
  CreditCard,
  Save,
  RotateCcw,
  Check,
  X,
  Info,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'integrations' | 'billing'>('general');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'Umumiy', icon: Settings },
    { id: 'security', label: 'Xavfsizlik', icon: Shield },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    { id: 'integrations', label: 'Integratsiyalar', icon: Database },
    { id: 'billing', label: 'To\'lovlar', icon: CreditCard },
  ];

  return (
    <DashboardLayout role="admin" title="Sozlamalar" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Sozlamalar</h2>
            <p className="text-muted-foreground mt-1">Platforma sozlamalarini boshqaring</p>
          </div>
          {savedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success"
            >
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Saqlandi!</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Umumiy sozlamalar</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Platforma nomi</label>
                      <input
                        type="text"
                        defaultValue="EduAI"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Platforma tavsifi</label>
                      <textarea
                        defaultValue="Zamonaviy ta'lim platformasi sun'iy intellekt bilan"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Kontakt email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          defaultValue="info@eduai.uz"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Default til</label>
                      <select className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                        <option>O'zbek tili</option>
                        <option>English</option>
                        <option>Русский</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Ko'rinish</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Qorong'u rejim</p>
                        <p className="text-sm text-muted-foreground">Default tema rejimi</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-muted relative">
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-all" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Animatsiyalar</p>
                        <p className="text-sm text-muted-foreground">Interaktiv animatsiyalarni yoqish</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-primary relative">
                        <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Parol sozlamalari</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Joriy parol</label>
                      <input
                        type="password"
                        placeholder="Joriy parolni kiriting"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Yangi parol</label>
                      <input
                        type="password"
                        placeholder="Yangi parolni kiriting"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Parolni tasdiqlash</label>
                      <input
                        type="password"
                        placeholder="Yangi parolni qayta kiriting"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Ikki bosqichli autentifikatsiya</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                          <Check className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">2FA yoqilgan</p>
                          <p className="text-sm text-muted-foreground">Google Authenticator</p>
                        </div>
                      </div>
                      <button className="text-sm text-primary font-medium hover:underline">
                        O'zgartirish
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Xavfli hudud
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full px-4 py-3 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-all text-left font-medium">
                      Barcha sessiyalarni bekor qilish
                    </button>
                    <button className="w-full px-4 py-3 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-medium">
                      Admin hisobini o'chirish
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Email bildirishnomalari</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'new-users', label: 'Yangi foydalanuvchilar', desc: 'Yangi ro\'yxatdan o\'tganlar haqida' },
                      { id: 'new-courses', label: 'Yangi kurslar', desc: 'Kurs qo\'shilganda' },
                      { id: 'reports', label: 'Hisobotlar', desc: 'Kunlik va haftalik hisobotlar' },
                      { id: 'issues', label: 'Muammolar', desc: 'Texnik muammolar va xatolar' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <button className="w-12 h-6 rounded-full bg-primary relative">
                          <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-all" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Browser bildirishnomalari</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">Push bildirishnomalar</p>
                      <p className="text-sm text-muted-foreground">Real-time bildirishnomalar</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-muted relative">
                      <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Tashqi integratsiyalar</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'stripe', name: 'Stripe', desc: 'To\'lov tizimi', status: 'connected' },
                      { id: 'google', name: 'Google Analytics', desc: 'Analitika', status: 'disconnected' },
                      { id: 'slack', name: 'Slack', desc: 'Jamoa kommunikatsiyasi', status: 'connected' },
                      { id: 'github', name: 'GitHub', desc: 'Kod boshqaruvi', status: 'disconnected' },
                    ].map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold">
                            {integration.name[0]}
                          </div>
                          <div>
                            <p className="font-medium">{integration.name}</p>
                            <p className="text-sm text-muted-foreground">{integration.desc}</p>
                          </div>
                        </div>
                        <button
                          className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            integration.status === 'connected'
                              ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                              : 'bg-primary text-primary-foreground hover:bg-primary/90'
                          )}
                        >
                          {integration.status === 'connected' ? 'Uzish' : 'Ulanish'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-semibold text-lg">Obuna rejimi</h3>
                    <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">Faol</span>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Joriy reja</p>
                        <p className="text-2xl font-bold mt-1">Enterprise</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Oylik to\'lov</p>
                        <p className="text-2xl font-bold mt-1">$499</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="w-4 h-4" />
                      <span>Keyingi to\'lov: 2024 yil 28 fevral</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">To\'lov usullari</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">**** **** **** 4242</p>
                          <p className="text-sm text-muted-foreground">American Express</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">Asosiy</span>
                    </div>
                    <button className="w-full px-4 py-3 rounded-lg border border-border text-left font-medium hover:bg-muted/50 transition-all">
                      + Yangi karta qo'shish
                    </button>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">To\'lov tarixi</h3>
                  <div className="space-y-3">
                    {[
                      { id: 1, date: '2024 yil 28 yanvar', amount: '$499.00', status: 'muvaffaqiyatli' },
                      { id: 2, date: '2023 yil 28 dekabr', amount: '$499.00', status: 'muvaffaqiyatli' },
                      { id: 3, date: '2023 yil 28 noyabr', amount: '$499.00', status: 'muvaffaqiyatli' },
                    ].map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div>
                          <p className="font-medium">{payment.date}</p>
                          <p className="text-sm text-muted-foreground">Enterprise reja</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{payment.amount}</p>
                          <p className="text-sm text-success">{payment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-all font-medium"
                onClick={() => {}}
              >
                <RotateCcw className="w-4 h-4" />
                Qaytarish
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-medium"
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
                Saqlash
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;
