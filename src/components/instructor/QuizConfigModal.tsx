import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';

interface QuizConfigModalProps {
  resourceId: number;
  onClose: () => void;
  onSuccess: () => void;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';

const difficultyOptions: { value: DifficultyLevel; label: string }[] = [
  { value: 'easy', label: 'Oson' },
  { value: 'medium', label: "O'rta" },
  { value: 'hard', label: 'Qiyin' },
  { value: 'mixed', label: 'Aralash' },
];

export const QuizConfigModal: React.FC<QuizConfigModalProps> = ({
  resourceId,
  onClose,
  onSuccess,
}) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [duration, setDuration] = useState(15);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (numQuestions < 5 || numQuestions > 30) {
      toast.error('Savollar soni 5-30 orasida bo\'lishi kerak');
      return;
    }

    if (duration < 5 || duration > 120) {
      toast.error('Test vaqti 5-120 minut orasida bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/ai/generate-quiz/${resourceId}/`, {
        num_questions: numQuestions,
        difficulty: difficulty,
        duration: duration,
      });

      toast.success('✅ Test muvaffaqiyatli yaratildi');
      onSuccess();
    } catch (error: any) {
      console.error('Quiz generation error:', error);
      const errorMessage = error.response?.data?.error || 'Test yaratishda xato';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-md shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold">📝 Test sozlamalari</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Number of Questions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Savollar soni</label>
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {numQuestions}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: 5</span>
              <span>Max: 30</span>
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Qiyinlik darajasi</label>
            <div className="grid grid-cols-2 gap-2">
              {difficultyOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(option.value)}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all text-sm',
                    difficulty === option.value
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Test vaqti (daqiqa)</label>
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {duration}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: 5 daqiqa</span>
              <span>Max: 120 daqiqa</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-accent">💡 Maslahat:</span> Oson testlar talabalar uchun boshlang'ich bo'lib, qiyin testlar rijalary bo'lib, aralash testlar balansirangan bo'ladi.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-medium disabled:opacity-50"
            >
              Bekor qilish
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Yaratilmoqda...
                </>
              ) : (
                <>
                  ✅ Test yaratish
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default QuizConfigModal;
