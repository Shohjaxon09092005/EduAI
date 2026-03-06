import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { Course } from '@/types';
import { createTest, updateTest } from '@/lib/api';
import { toast } from 'sonner';

interface QuestionEditor {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface TestManagementModalProps {
  isOpen: boolean;
  courses: Course[];
  initial?: any;
  onClose: () => void;
  onSaved: (test: any) => void;
}

export const TestManagementModal: React.FC<TestManagementModalProps> = ({
  isOpen,
  courses,
  initial,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('easy');
  const [questions, setQuestions] = useState<QuestionEditor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setCourseId(initial.courseId || initial.course || '');
      setDuration(initial.duration || 30);
      setDifficulty(initial.difficulty || 'easy');
      setQuestions(
        (initial.questions || []).map((q: any) => ({
          id: q.id ? String(q.id) : undefined,
          text: q.text || '',
          options: q.options ? [...q.options] : ['', ''],
          correctAnswer: q.correctAnswer ?? q.correct_answer ?? 0,
          explanation: q.explanation || '',
        }))
      );
    } else {
      setTitle('');
      setCourseId('');
      setDuration(30);
      setDifficulty('easy');
      setQuestions([]);
    }
  }, [initial, isOpen]);

  const addQuestion = () => {
    setQuestions(qs => [...qs, { text: '', options: ['', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, patch: Partial<QuestionEditor>) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, ...patch } : q));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) {
      toast.error('Iltimos test nomi va kursni toʻldiring');
      return;
    }

    // map to API payload
    const payload: any = {
      title: title.trim(),
      course: Number(courseId),
      duration,
      difficulty,
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation || '',
      })),
    };

    setLoading(true);
    try {
      let saved: any;
      if (initial && initial.id) {
        saved = await updateTest(String(initial.id), payload);
        toast.success('Test muvaffaqiyatli yangilandi');
      } else {
        saved = await createTest(payload);
        toast.success('Test yaratildi');
      }
      onSaved(saved);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur">
            <h2 className="text-2xl font-display font-bold">{initial ? 'Testni tahrirlash' : 'Yangi test yaratish'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test nomi</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kurs</label>
              <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                <option value="">--kurs tanlang--</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Davomiylik (daq.)</label>
                <input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Daraja</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option value="easy">Oson</option>
                  <option value="medium">O'rta</option>
                  <option value="hard">Qiyin</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Savollar ({questions.length})</h3>
                <button type="button" onClick={addQuestion} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary"> <Plus className="w-4 h-4" /> Qo'shish</button>
              </div>

              <div className="space-y-4">
                {questions.map((q, qi) => (
                  <div key={qi} className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <label className="font-medium">Savol #{qi + 1}</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => removeQuestion(qi)} className="p-1 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                    <textarea value={q.text} onChange={e => updateQuestion(qi, { text: e.target.value })} className="w-full px-3 py-2 rounded mb-2 bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Savol matni..." rows={2} />

                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi} onChange={() => updateQuestion(qi, { correctAnswer: oi })} />
                          <input type="text" value={opt} onChange={e => updateQuestion(qi, { options: q.options.map((o, i) => i === oi ? e.target.value : o) })} className="flex-1 px-3 py-2 rounded bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder={`Variant ${oi + 1}`} />
                          <button type="button" onClick={() => updateQuestion(qi, { options: q.options.filter((_, i) => i !== oi), correctAnswer: Math.min(q.correctAnswer, Math.max(0, q.options.length - 2)) })} className="p-1 rounded hover:bg-muted/80">X</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => updateQuestion(qi, { options: [...q.options, ''] })} className="mt-2 px-3 py-1 rounded bg-muted/80">Variant qo'shish</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50">{initial ? 'Saqlash' : 'Yaratish'}</motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
