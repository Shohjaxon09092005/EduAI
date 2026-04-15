import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createCategory, Category } from '@/lib/api';
import { toast } from 'sonner';

interface CategoryCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: Category) => void;
}

export const CategoryCreationModal: React.FC<CategoryCreationModalProps> = ({
  isOpen,
  onClose,
  onCategoryCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Kategoriya nomi kerak');
      return;
    }

    setLoading(true);
    try {
      const newCategory = await createCategory({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success('Kategoriya yaratildi');
      onCategoryCreated(newCategory);
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error('Failed to create category:', err);
      toast.error(err instanceof Error ? err.message : 'Kategoriya yaratilmadi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-background rounded-xl border border-border/50 shadow-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <h2 className="text-2xl font-display font-bold">Yangi kategoriya</h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Kategoriya nomi <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Ilm-fan, Soha, Raqam..."
                disabled={loading}
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tavsif (ixtiyoriy)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kategoriya haqida qisqa ma'lumot..."
                disabled={loading}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-all disabled:opacity-50"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50"
              >
                {loading ? 'Yaratilmoqda...' : 'Yaratish'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
