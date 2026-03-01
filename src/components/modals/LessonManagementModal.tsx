import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lesson } from '@/types';
import { X, Plus, Trash2, Edit } from 'lucide-react';
import { createLesson, updateLesson, deleteLesson } from '@/lib/api';
import { toast } from 'sonner';

interface LessonManagementModalProps {
  courseId: string;
  isOpen: boolean;
  lessons: Lesson[];
  onClose: () => void;
  onLessonsUpdated: (lessons: Lesson[]) => void;
}

export const LessonManagementModal: React.FC<LessonManagementModalProps> = ({
  courseId,
  isOpen,
  lessons,
  onClose,
  onLessonsUpdated,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    order: lessons.length + 1,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Dars nomi kiritilmadi');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update lesson
        const updated = await updateLesson(editingId, {
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          order: formData.order,
          course: Number(courseId),
        });
        onLessonsUpdated(
          lessons.map((l) => (l.id === editingId ? { ...l, ...updated } : l))
        );
        toast.success('Dars tahrirlandi');
      } else {
        // Create lesson
        const newLesson = await createLesson({
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          order: formData.order,
          course: Number(courseId),
        });
        onLessonsUpdated([...lessons, newLesson]);
        toast.success('Dars qo\'shildi');
      }
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title,
      description: lesson.description || '',
      duration: lesson.duration || 30,
      order: lesson.order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Darsni o\'chirmoqchimisiz?')) return;

    setLoading(true);
    try {
      await deleteLesson(id);
      onLessonsUpdated(lessons.filter((l) => l.id !== id));
      toast.success('Dars o\'chirildi');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      duration: 30,
      order: lessons.length + 1,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-background rounded-xl border border-border/50 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur">
            <h2 className="text-2xl font-display font-bold">Darslarni Boshqarish</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Form */}
            <form onSubmit={handleSubmit} className="glass-card p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Dars Nomi <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Dars nomi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tavsifi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Dars tavsifi..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Davomiyligi (min)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tartibi
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  {editingId ? 'Tahrirlash' : 'Qo\'shish'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    Bekor qilish
                  </button>
                )}
              </div>
            </form>

            {/* Lessons List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-3">Darslar ({lessons.length})</h3>
              {lessons.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{lesson.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {lesson.duration} min • Tartibi: {lesson.order}
                          </div>
                          {lesson.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(lesson)}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lesson.id)}
                            disabled={loading}
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Hali dars yo\'q
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
