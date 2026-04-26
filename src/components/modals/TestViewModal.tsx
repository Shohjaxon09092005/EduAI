import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye } from "lucide-react";
import { Question } from "@/types";

interface Test {
  id: string;
  title: string;
  courseTitle?: string;
  questions: Question[];
  duration: number;
  difficulty: "easy" | "medium" | "hard";
}

interface TestResult {
  id: string;
  testTitle: string;
  course: string;
  score: number;
  maxScore: number;
  date: string;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface TestViewModalProps {
  isOpen: boolean;
  testData?: Test;
  result?: TestResult;
  onClose: () => void;
}

export const TestViewModal: React.FC<TestViewModalProps> = ({
  isOpen,
  testData,
  result,
  onClose,
}) => {
  if (!isOpen || !testData) return null;

  const difficultyLabel = (d: string) => {
    switch (d) {
      case "easy":
        return "Boshlang'ich";
      case "medium":
        return "O'rta";
      case "hard":
        return "Murakkab";
      default:
        return d;
    }
  };

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
              {result ? "Natija tafsilotlari" : "Testni ko‘rish"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="space-y-2">
              <p>
                <strong>Nomi:</strong> {testData.title}
              </p>
              {testData.courseTitle && (
                <p>
                  <strong>Kurs:</strong> {testData.courseTitle}
                </p>
              )}
              <p>
                <strong>Savollar soni:</strong> {testData.questions.length}
              </p>
              <p>
                <strong>Davomiyligi:</strong> {testData.duration} daqiqa
              </p>
              <p>
                <strong>Daraja:</strong> {difficultyLabel(testData.difficulty)}
              </p>
              {result && (
                <div className="space-y-1 pt-4 border-t border-border/50">
                  <p>
                    <strong>Ball:</strong> {result.score}/{result.maxScore}
                  </p>
                  <p>
                    <strong>Sana:</strong> {result.date}
                  </p>
                  <p>
                    <strong>O'tkazilgan vaqt:</strong> {result.timeSpent} daqiqa
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-semibold">Savollar</h3>
              {testData.questions.map((q, qi) => (
                <div key={qi} className="p-4 border rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">
                    {qi + 1}. {q.text}
                  </p>
                  {q.image && (
                    <img
                      src={q.image}
                      alt={q.imageCaption  || "savol rasmi"}
                      className={`rounded-lg max-h-48 object-contain mb-2 ${
                        q.imagePosition  === "right"
                          ? "float-right ml-3"
                          : q.imagePosition === "left"
                            ? "float-left mr-3"
                            : "w-full"
                      }`}
                    />
                  )}
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {q.options.map((opt, oi) => (
                      <li
                        key={oi}
                        className={
                          q.correctAnswer === oi
                            ? "font-semibold text-success"
                            : ""
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
