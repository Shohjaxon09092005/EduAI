import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LessonResource } from '@/types';
import { X, Plus, Trash2, Edit, Upload } from 'lucide-react';
import { createLessonResource, updateLessonResource, deleteLessonResource } from '@/lib/api';
import { toast } from 'sonner';

interface ResourceManagementModalProps {
  lessonId: string;
  lessonTitle: string;
  isOpen: boolean;
  resources: LessonResource[];
  onClose: () => void;
  onResourcesUpdated: (resources: LessonResource[]) => void;
}

const resourceTypes = ['video', 'pdf', 'pptx', 'docx', 'link'] as const;

export const ResourceManagementModal: React.FC<ResourceManagementModalProps> = ({
  lessonId,
  lessonTitle,
  isOpen,
  resources,
  onClose,
  onResourcesUpdated,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'video' as typeof resourceTypes[number],
    url: '',
    file: null as File | null,
    description: '',
    order: resources.length + 1,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Resurs nomi kiritilmadi');
      return;
    }

    if (formData.type !== 'link' && !formData.file && !formData.url) {
      toast.error('Fayl yoki URL kiritilmadi');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        url: formData.url || undefined,
        file: formData.file || undefined,
        description: formData.description,
        order: formData.order,
        lesson: Number(lessonId),
      };

      if (editingId) {
        // Update resource
        const updated = await updateLessonResource(editingId, payload);
        onResourcesUpdated(
          resources.map((r) => (r.id === editingId ? { ...r, ...updated } : r))
        );
        toast.success('Resurs tahrirlandi');
      } else {
        // Create resource
        const newResource = await createLessonResource(payload);
        onResourcesUpdated([...resources, newResource]);
        toast.success('Resurs qo\'shildi');
      }
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource: LessonResource) => {
    setEditingId(resource.id);
    setFormData({
      title: resource.title,
      type: resource.type,
      url: resource.url || '',
      file: null,
      description: resource.description,
      order: resource.order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Resursni o\'chirmoqchimisiz?')) return;

    setLoading(true);
    try {
      await deleteLessonResource(id);
      onResourcesUpdated(resources.filter((r) => r.id !== id));
      toast.success('Resurs o\'chirildi');
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
      type: 'video',
      url: '',
      file: null,
      description: '',
      order: resources.length + 1,
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
            <div>
              <h2 className="text-2xl font-display font-bold">Resurslarni Boshqarish</h2>
              <p className="text-sm text-muted-foreground mt-1">{lessonTitle}</p>
            </div>
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
                  Resurs Nomi <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Resurs nomi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Turi <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as typeof resourceTypes[number],
                      url: '',
                      file: null,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="pptx">PowerPoint</option>
                  <option value="docx">Word</option>
                  <option value="link">Havolasi</option>
                </select>
              </div>

              {formData.type === 'link' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fayl {editingId && '(yangi fayl ni tanlang)'}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) =>
                        setFormData({ ...formData, file: e.target.files?.[0] || null })
                      }
                      className="hidden"
                      id="file-input"
                      accept={
                        formData.type === 'video'
                          ? 'video/*'
                          : formData.type === 'pdf'
                            ? '.pdf'
                            : formData.type === 'pptx'
                              ? '.pptx,.ppt'
                              : '.docx,.doc'
                      }
                    />
                    <label
                      htmlFor="file-input"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border-2 border-dashed border-border/50 hover:border-primary/50 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {formData.file ? formData.file.name : 'Fayl tanlang'}
                      </span>
                    </label>
                  </div>
                </div>
              )}

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
                  placeholder="Resurs tavsifi..."
                  rows={2}
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

            {/* Resources List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg mb-3">Resurslar ({resources.length})</h3>
              {resources.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {resources
                    .sort((a, b) => a.order - b.order)
                    .map((resource) => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{resource.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {resource.type.toUpperCase()} • Tartibi: {resource.order}
                          </div>
                          {resource.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {resource.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(resource)}
                            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(resource.id)}
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
                  Hali resurs yo\'q
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
