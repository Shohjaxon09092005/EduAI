import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Brain,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/types';

interface AITestProps {
  title: string;
  questions: Question[];
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
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 2000);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const score = calculateScore();
  const question = questions[currentQuestion];

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
            const isCorrect = selectedAnswers[i] === q.correctAnswer;
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
                    {!isCorrect && (
                      <p className="text-sm text-muted-foreground">
                        <span className="text-success font-medium">To'g'ri javob:</span>{' '}
                        {q.options[q.correctAnswer]}
                      </p>
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Savol {currentQuestion + 1}/{questions.length}</span>
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
