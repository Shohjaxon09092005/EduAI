import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Brain,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question, Test } from '@/types';
import { submitTestResult } from '@/lib/api';
import { toast } from 'sonner';

interface AITestProps {
  title: string;
  questions: Question[];
  testId?: string | number;
  duration?: number; // minutes, optional
  onComplete: (score: number, answers: number[]) => void;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    text: "JavaScript'da o'zgaruvchi e'lon qilish uchun qaysi kalit so'z ishlatiladi?",
    options: ['var', 'let', 'const', 'Barchasi to\'g\'ri'],
    correctAnswer: 3,
    explanation: "JavaScript'da var, let va const kalit so'zlari o'zgaruvchi e'lon qilish uchun ishlatiladi.",
  },
  {
    id: '2',
    text: "React'da state boshqarish uchun qaysi hook ishlatiladi?",
    options: ['useEffect', 'useState', 'useContext', 'useRef'],
    correctAnswer: 1,
    explanation: "useState hook'i React komponentlarida state boshqarish uchun ishlatiladi.",
  },
  {
    id: '3',
    text: "CSS'da flexbox yordamida elementlarni markazga joylashtirish uchun qaysi xususiyat ishlatiladi?",
    options: ['text-align: center', 'justify-content: center va align-items: center', 'margin: auto', 'position: center'],
    correctAnswer: 1,
    explanation: "Flexbox'da justify-content va align-items xususiyatlari elementlarni markazga joylashtirishda ishlatiladi.",
  },
];

export const AITest: React.FC<Partial<AITestProps>> = ({
  title = "AI yaratgan test",
  questions = mockQuestions,
  testId,
  duration = 0,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [timeStarted] = useState(Date.now());
  const [error, setError] = useState<string | null>(null);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  // calculating score may change when questions/answers update
  const calculateScore = React.useCallback(() => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  }, [questions, selectedAnswers]);

  // calculate score on demand inside finishTest
  const finishTest = React.useCallback(async () => {
    const currentScore = calculateScore();
    const timeSpentSeconds = Math.round((Date.now() - timeStarted) / 1000);
    
    setIsAnalyzing(true);
    setError(null);

    try {
      // Submit to backend if testId is provided
      if (testId) {
        setIsSubmitting(true);
        const answersList = selectedAnswers.map(a => a ?? -1);
        await submitTestResult({
          test: testId,
          answers: answersList,
          time_spent: timeSpentSeconds,
        });
        toast.success('Test natijalari saqlandi');
      }

      setTimeout(() => {
        setIsAnalyzing(false);
        setIsSubmitting(false);
        setShowResult(true);
        if (onComplete) {
          onComplete(currentScore, selectedAnswers.map(a => a ?? -1));
        }
      }, 1500);
    } catch (err: any) {
      console.error('Test submission error:', err);
      setError(err.message || 'Test saqlashda xatolik');
      setIsAnalyzing(false);
      setIsSubmitting(false);
      toast.error('Test natijalari saqlanmadi');
    }
  }, [calculateScore, timeStarted, selectedAnswers, testId, onComplete]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  // note: score computed when needed by finishTest and when showing results
  const score = calculateScore();
  const question = questions[currentQuestion];

  // timer effect
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration, questions.length]);

  useEffect(() => {
    if (showResult || isAnalyzing) return;
    if (timeLeft <= 0) {
      finishTest();
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, showResult, isAnalyzing, finishTest]);

  // Auto-submit if time's up
  useEffect(() => {
    if (timeLeft === 0 && duration > 0 && !showResult && !isAnalyzing) {
      toast.warning('Vaqt tugadi!');
      finishTest();
    }
  }, [timeLeft, duration, showResult, isAnalyzing, finishTest]);

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        >
          <Brain className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h3 className="font-display font-semibold text-xl mb-2">
          {isSubmitting ? 'Natijalari saqlanmoqda...' : 'AI javoblarni tahlil qilmoqda...'}
        </h3>
        <p className="text-muted-foreground">Biroz kuting</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8"
      >
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className="w-12 h-12 text-destructive flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Xatolik yuz berdi</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium"
          onClick={() => {
            setError(null);
            setCurrentQuestion(0);
            setSelectedAnswers(new Array(questions.length).fill(null));
            setShowResult(false);
          }}
        >
          Qayta urinish
        </motion.button>
      </motion.div>
    );
  }

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
        >
          <Brain className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h3 className="font-display font-semibold text-xl mb-2">AI javoblarni tahlil qilmoqda...</h3>
        <p className="text-muted-foreground">Biroz kuting</p>
      </motion.div>
    );
  }

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className={cn(
              "w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center",
              score >= 70 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
            )}
          >
            {score >= 70 ? (
              <CheckCircle className="w-12 h-12" />
            ) : (
              <XCircle className="w-12 h-12" />
            )}
          </motion.div>
          <h3 className="font-display font-bold text-3xl mb-2">{score}%</h3>
          <p className="text-muted-foreground">
            {score >= 90 ? "Ajoyib natija!" : 
             score >= 70 ? "Yaxshi natija!" : 
             "Ko'proq mashq qiling!"}
          </p>
        </div>

        {/* Question Review */}
        <div className="space-y-4">
          {questions.map((q, i) => {
            const selected = selectedAnswers[i];
            const isCorrect = selected === q.correctAnswer;
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border-2",
                  isCorrect ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                  )}>
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-2">{q.text}</p>
                    <p className="text-sm">
                      <span className="font-medium">Sizning javobingiz:</span>{' '}
                      {selected !== null && selected >= 0 ? q.options[selected] : '–'}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-success">
                        <span className="font-medium">To'g'ri javob:</span>{' '}
                        {q.options[q.correctAnswer]}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium"
          onClick={() => {
            setCurrentQuestion(0);
            setSelectedAnswers(new Array(questions.length).fill(null));
            setShowResult(false);
          }}
        >
          Qayta urinish
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-display font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Savol {currentQuestion + 1}/{questions.length}</span>
            </div>
            {duration > 0 && (
              <div className={cn(
                'flex items-center gap-2 px-2 py-1 rounded-lg',
                timeLeft <= 60 ? 'bg-destructive/10 text-destructive font-medium' : ''
              )}>
                <Clock className="w-4 h-4" />
                <span>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</span>
              </div>
            )}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h4 className="font-medium text-lg mb-6">{question.text}</h4>

            <div className="space-y-3">
              {question.options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectAnswer(i)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                    selectedAnswers[currentQuestion] === i
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm",
                      selectedAnswers[currentQuestion] === i
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === null}
          className={cn(
            "w-full mt-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
            selectedAnswers[currentQuestion] !== null
              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {currentQuestion < questions.length - 1 ? (
            <>
              Keyingi savol
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Tugatish
              <CheckCircle className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
