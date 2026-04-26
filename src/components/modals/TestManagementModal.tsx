import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, ImagePlus, XCircle } from "lucide-react";
import { Course } from "@/types";
import {
  createTest,
  updateTest,
  addQuestion as apiAddQuestion,
  updateQuestion as apiUpdateQuestion,
} from "@/lib/api";
import { toast } from "sonner";

interface QuestionEditor {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  imageFile?: File | null;
  imageUrl?: string;
  imageCaption?: string;
  imagePosition?: "top" | "right" | "bottom" | "left";
  points: number;
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
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy",
  );
  const [questions, setQuestions] = useState<QuestionEditor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setCourseId(initial.courseId || initial.course || "");
      setDuration(initial.duration || 30);
      setDifficulty(initial.difficulty || "easy");
      setQuestions(
        (initial.questions || []).map((q: any) => ({
          id: q.id ? String(q.id) : undefined,
          text: q.text || "",
          options: q.options ? [...q.options] : ["", ""],
          correctAnswer: q.correctAnswer ?? q.correct_answer ?? 0,
          explanation: q.explanation || "",
          imageFile: null,
          imageUrl: q.image || "",
          imageCaption: q.image_caption || "",
          imagePosition: q.image_position || "top",
          points: q.points ?? 1,
        })),
      );
    } else {
      setTitle("");
      setCourseId("");
      setDuration(30);
      setDifficulty("easy");
      setQuestions([]);
    }
  }, [initial, isOpen]);

  const addQuestion = () => {
    setQuestions((qs) => [
      ...qs,
      {
        text: "",
        options: ["", ""],
        correctAnswer: 0,
        imageFile: null,
        imageUrl: "",
        imageCaption: "",
        imagePosition: "top",
        points: 1,
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setQuestions((qs) => qs.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, patch: Partial<QuestionEditor>) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseId) {
      toast.error("Iltimos test nomi va kursni toʻldiring");
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
        explanation: q.explanation || "",
      })),
    };

    setLoading(true);
    try {
      // 1. Avval test yaratiladi/yangilanadi (savolsiz)
      let saved: any;
      const testPayload = {
        title: title.trim(),
        course: Number(courseId),
        duration,
        difficulty,
      };

      if (initial?.id) {
        saved = await updateTest(String(initial.id), testPayload);
        toast.success("Test yangilandi");
      } else {
        saved = await createTest(testPayload);
        toast.success("Test yaratildi");
      }

      // 2. Har bir savol alohida FormData bilan yuboriladi
      for (const q of questions) {
        const fd = new FormData();
        fd.append("text", q.text);
        fd.append("options", JSON.stringify(q.options));
        fd.append("correct_answer", String(q.correctAnswer));
        fd.append("explanation", q.explanation || "");
        if (q.imageFile) {
          fd.append("image", q.imageFile);
          fd.append("image_caption", q.imageCaption || "");
          fd.append("image_position", q.imagePosition || "top");
        }
        fd.append("points", String(q.points ?? 1));

        if (q.id) {
          await apiUpdateQuestion(q.id, fd);
        } else {
          await apiAddQuestion(saved.id, fd);
        }
      }

      onSaved(saved);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Xato yuz berdi");
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
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur">
            <h2 className="text-2xl font-display font-bold">
              {initial ? "Testni tahrirlash" : "Yangi test yaratish"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Test nomi
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kurs</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">--kurs tanlang--</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Davomiylik (daq.)
                </label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Daraja</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="easy">Oson</option>
                  <option value="medium">O'rta</option>
                  <option value="hard">Qiyin</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Savollar ({questions.length})</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 text-primary"
                >
                  {" "}
                  <Plus className="w-4 h-4" /> Qo'shish
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((q, qi) => (
                  <div key={qi} className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <label className="font-medium">Savol #{qi + 1}</label>
                      <div className="flex items-center gap-3">
                        {/* Ball input */}
                        <div className="flex items-center gap-1.5">
                          <label className="text-xs text-muted-foreground">
                            Ball:
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={q.points ?? 1}
                            onChange={(e) =>
                              updateQuestion(qi, {
                                points: Number(e.target.value),
                              })
                            }
                            className="w-14 px-2 py-1 text-sm text-center rounded bg-muted/50 border border-border/50 focus:border-primary focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(qi)}
                          className="p-1 rounded hover:bg-destructive/10 text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={q.text}
                      onChange={(e) =>
                        updateQuestion(qi, { text: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded mb-2 bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Savol matni..."
                      rows={2}
                    />

                    {/* Rasm qo'shish */}
                    <div className="my-3 border border-border/50 rounded-lg overflow-hidden">
                      {/* Tab */}
                      <div className="flex text-xs border-b border-border/50">
                        <span className="flex-1 text-center py-2 bg-muted/80 font-medium text-primary">
                          Rasm yuklash
                        </span>
                      </div>

                      {/* Preview yoki upload zone */}
                      {q.imageUrl || q.imageFile ? (
                        <div className="p-3 space-y-2">
                          <div className="relative bg-muted/50 rounded-lg h-28 flex items-center justify-center">
                            <img
                              src={
                                q.imageFile
                                  ? URL.createObjectURL(q.imageFile)
                                  : q.imageUrl
                              }
                              alt="preview"
                              className="max-h-full max-w-full object-contain rounded"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateQuestion(qi, {
                                  imageFile: null,
                                  imageUrl: "",
                                })
                              }
                              className="absolute top-2 right-2 p-1 bg-destructive/10 rounded-full text-destructive hover:bg-destructive/20"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Rasm tavsifi (ixtiyoriy)"
                            value={q.imageCaption || ""}
                            onChange={(e) =>
                              updateQuestion(qi, {
                                imageCaption: e.target.value,
                              })
                            }
                            className="w-full px-3 py-1.5 text-sm rounded bg-muted/50 border border-border/50 focus:border-primary focus:outline-none"
                          />
                          <div className="flex gap-2">
                            {(["top", "right", "bottom", "left"] as const).map(
                              (pos) => (
                                <button
                                  key={pos}
                                  type="button"
                                  onClick={() =>
                                    updateQuestion(qi, { imagePosition: pos })
                                  }
                                  className={`flex-1 py-1 text-xs rounded border transition-all ${
                                    q.imagePosition === pos
                                      ? "border-primary bg-primary/10 text-primary font-medium"
                                      : "border-border/50 bg-muted/50 text-muted-foreground"
                                  }`}
                                >
                                  {pos === "top"
                                    ? "Tepada"
                                    : pos === "right"
                                      ? "O'ngda"
                                      : pos === "bottom"
                                        ? "Pastda"
                                        : "Chapda"}
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center gap-2 p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                          <ImagePlus className="w-7 h-7 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Rasm yuklash uchun bosing
                          </span>
                          <span className="text-xs text-muted-foreground/70">
                            JPG, PNG, WebP — max 5MB
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error(
                                    "Rasm 5MB dan kichik bo'lishi kerak",
                                  );
                                  return;
                                }
                                updateQuestion(qi, {
                                  imageFile: file,
                                  imageUrl: "",
                                });
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qi}`}
                            checked={q.correctAnswer === oi}
                            onChange={() =>
                              updateQuestion(qi, { correctAnswer: oi })
                            }
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) =>
                              updateQuestion(qi, {
                                options: q.options.map((o, i) =>
                                  i === oi ? e.target.value : o,
                                ),
                              })
                            }
                            className="flex-1 px-3 py-2 rounded bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder={`Variant ${oi + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateQuestion(qi, {
                                options: q.options.filter((_, i) => i !== oi),
                                correctAnswer: Math.min(
                                  q.correctAnswer,
                                  Math.max(0, q.options.length - 2),
                                ),
                              })
                            }
                            className="p-1 rounded hover:bg-muted/80"
                          >
                            X
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          updateQuestion(qi, { options: [...q.options, ""] })
                        }
                        className="mt-2 px-3 py-1 rounded bg-muted/80"
                      >
                        Variant qo'shish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50"
              >
                {initial ? "Saqlash" : "Yaratish"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
