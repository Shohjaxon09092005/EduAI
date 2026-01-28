import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Settings,
  Bell,
  Lock,
  User,
  Globe,
  Monitor,
  Mail,
  Save,
  RotateCcw,
  Check,
  Info,
  Trash2,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StudentSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences' | 'danger'>('profile');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Xavfsizlik', icon: Lock },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    { id: 'preferences', label: 'Afzalliklar', icon: Monitor },
    { id: 'danger', label: 'Xavfli hudud', icon: Trash2 },
  ];

  return (
    <DashboardLayout role="student" title="Sozlamalar" userName="Talaba">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Sozlamalar</h2>
            <p className="text-muted-foreground mt-1">Profil sozlamalaringizni boshqaring</p>
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
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Profil ma'lumotlari</h3>
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Student"
                          alt="Avatar"
                          className="w-24 h-24 rounded-full"
                        />
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-semibold">Profil rasmi</h4>
                        <p className="text-sm text-muted-foreground mt-1">JPG, PNG yoki GIF. Maksimal 2MB</p>
                        <button className="mt-2 text-sm text-primary font-medium hover:underline">
                          Rasmni o'zgartirish
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ism</label>
                        <input
                          type="text"
                          defaultValue="Talaba"
                          className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Familiya</label>
                        <input
                          type="text"
                          defaultValue="Talabov"
                          className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Foydalanuvchi nomi</label>
                      <input
                        type="text"
                        defaultValue="@talaba123"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          defaultValue="talaba@example.com"
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea
                        defaultValue="Dasturchi bo'lishni maqsad qilganman. Yangi narsalarni o'rganishni yaxshi ko'raman."
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Qo'shimcha ma'lumotlar</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefon raqam</label>
                      <input
                        type="tel"
                        defaultValue="+998 90 123 45 67"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Manzil</label>
                      <input
                        type="text"
                        defaultValue="Toshkent, O'zbekiston"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tug'ilgan sana</label>
                      <input
                        type="date"
                        defaultValue="2000-01-01"
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Parolni o\'zgartirish</h3>
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
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">2FA o'chirilgan</p>
                          <p className="text-sm text-muted-foreground">Himoyani kuchaytirish uchun yoqing</p>
                        </div>
                      </div>
                      <button className="text-sm text-primary font-medium hover:underline">
                        Yoqish
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Faol sessiyalar</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Joriy sessiya</p>
                        <p className="text-sm text-muted-foreground">Chrome • Windows • Toshkent</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                        Faol
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Boshqa qurilma</p>
                        <p className="text-sm text-muted-foreground">Safari • iPhone • 2 kun oldin</p>
                      </div>
                      <button className="text-sm text-destructive font-medium hover:underline">
                        Chiqarish
                      </button>
                    </div>
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
                      { id: 'courses', label: 'Kurs yangiliklari', desc: 'Yangi darslar va materiallar' },
                      { id: 'tests', label: 'Test natijalari', desc: 'Test tugagandan so\'ng' },
                      { id: 'reminders', label: 'Eslatmalar', desc: 'O\'qish vaqtini eslatish' },
                      { id: 'achievements', label: 'Yutuqlar', desc: 'Yangi yutuqlar va medallar' },
                      { id: 'promotions', label: 'Takliflar', desc: 'Maxsus takliflar va chegirmalar' },
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
                  <h3 className="font-display font-semibold text-lg mb-6">Push bildirishnomalari</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Browser bildirishnomalari</p>
                        <p className="text-sm text-muted-foreground">Real-time bildirishnomalar</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-muted relative">
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Til va mintaqa</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Til</label>
                      <select className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                        <option>O'zbek tili</option>
                        <option>English</option>
                        <option>Русский</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Vaqt zonasi</label>
                      <select className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                        <option>Toshkent (GMT+5)</option>
                        <option>New York (GMT-5)</option>
                        <option>London (GMT+0)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">Ko'rinish</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Qorong'u rejim</p>
                        <p className="text-sm text-muted-foreground">Tema rejimini tanlang</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-muted relative">
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-all" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Animatsiyalar</p>
                        <p className="text-sm text-muted-foreground">Interaktiv animatsiyalar</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-primary relative">
                        <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white transition-all" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold text-lg mb-6">O\'qish afzalliklari</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Kunlik o\'qish maqsadi (soat)</label>
                      <input
                        type="number"
                        defaultValue={2}
                        min={1}
                        max={10}
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Avtomatik o\'yin</p>
                        <p className="text-sm text-muted-foreground">Darslarni avtomatik o\'ynash</p>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-muted relative">
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-muted-foreground transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeTab === 'danger' && (
              <div className="space-y-6">
                <div className="glass-card p-6 border border-warning/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-warning" />
                    <h3 className="font-display font-semibold text-lg text-warning">Diqqat qiling</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Bu amallarni bajaringiz ma'lumotlaringiz yo'qolishiga olib kelishi mumkin. Ehtiyot bo'ling.
                  </p>
                  <div className="space-y-4">
                    <button className="w-full px-4 py-3 rounded-lg border border-border text-left font-medium hover:bg-muted/50 transition-all">
                      Barcha sessiyalarni bekor qilish
                    </button>
                    <button className="w-full px-4 py-3 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-all text-left font-medium">
                      O\'qish tarixini o\'chirish
                    </button>
                  </div>
                </div>

                <div className="glass-card p-6 border border-destructive/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <h3 className="font-display font-semibold text-lg text-destructive">Hisobni o\'chirish</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Hisobingizni o'chirgandan so'ng, barcha ma'lumotlaringiz qaytarib bo'lmaydigan tarzda o'chiriladi.
                  </p>
                  <button className="w-full px-4 py-3 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-medium flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Hisobni o'chirish
                  </button>
                </div>

                <div className="glass-card p-6">
                  <button className="w-full px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-all font-medium flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                    <LogOut className="w-4 h-4" />
                    Tizimdan chiqish
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {activeTab !== 'danger' && (
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
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettingsPage;
