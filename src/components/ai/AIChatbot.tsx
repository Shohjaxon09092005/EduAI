import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User,
  Loader2,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIMessage } from '@/types';

const mockMessages: AIMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Salom! Men sizning AI o'quv yordamchingizman. Platformaga yuklangan materiallar asosida savollaringizga javob beraman. Qanday yordam bera olaman?",
    timestamp: new Date(),
    confidence: 0.98,
  },
];

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>(mockMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Bu ajoyib savol! Men platformadagi materiallarni tahlil qildim va quyidagi javobni taqdim etaman: Sizning savolingiz bo'yicha eng mos ma'lumotlar mavjud. Batafsilroq tushuntirish uchun tegishli kurs materiallarini ko'rib chiqishingizni tavsiya qilaman.",
        timestamp: new Date(),
        confidence: 0.92,
        sources: ["Kirish kursi - 3-bob", "Amaliy mashg'ulot #5"],
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent 
                     shadow-lg shadow-primary/25 flex items-center justify-center animate-pulse-glow"
          >
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[80vh] glass-card rounded-3xl 
                     shadow-2xl flex flex-col overflow-hidden border border-border/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">AI Tutor</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-gradient-to-br from-accent to-primary text-primary-foreground"
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <div className={cn(
                    "flex-1 max-w-[80%]",
                    message.role === 'user' ? "text-right" : ""
                  )}>
                    <div className={cn(
                      "inline-block p-3 rounded-2xl",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    )}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    
                    {/* AI Metadata */}
                    {message.role === 'assistant' && (
                      <div className="mt-2 space-y-1">
                        {message.confidence && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-accent to-success"
                                style={{ width: `${message.confidence * 100}%` }}
                              />
                            </div>
                            <span>{Math.round(message.confidence * 100)}% ishonch</span>
                          </div>
                        )}
                        {message.sources && message.sources.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-accent">
                            <BookOpen className="w-3 h-3" />
                            <span>{message.sources.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce animation-delay-100" />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce animation-delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Savolingizni yozing..."
                  className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border/50 
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                           placeholder:text-muted-foreground transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground
                           disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Faqat platforma resurslari asosida javob beradi
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
