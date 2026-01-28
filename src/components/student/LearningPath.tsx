import React from 'react';
import { motion } from 'framer-motion';
import { LearningNode } from '@/types';
import { cn } from '@/lib/utils';
import { Lock, Play, CheckCircle, BookOpen, FileQuestion, Code } from 'lucide-react';

interface LearningPathProps {
  nodes: LearningNode[];
  onNodeClick: (node: LearningNode) => void;
}

const mockNodes: LearningNode[] = [
  { id: '1', title: 'Kirish', type: 'lesson', status: 'completed', xpReward: 100, connections: ['2'] },
  { id: '2', title: 'Asosiy tushunchalar', type: 'lesson', status: 'completed', xpReward: 150, connections: ['3', '4'] },
  { id: '3', title: 'Birinchi test', type: 'quiz', status: 'in-progress', xpReward: 200, connections: ['5'] },
  { id: '4', title: 'Amaliy loyiha', type: 'project', status: 'available', xpReward: 300, connections: ['5'] },
  { id: '5', title: 'Ilg\'or mavzular', type: 'lesson', status: 'locked', xpReward: 250, connections: ['6'] },
  { id: '6', title: 'Yakuniy imtihon', type: 'quiz', status: 'locked', xpReward: 500, connections: [] },
];

const getNodeIcon = (type: LearningNode['type']) => {
  switch (type) {
    case 'lesson': return BookOpen;
    case 'quiz': return FileQuestion;
    case 'project': return Code;
    default: return BookOpen;
  }
};

const getStatusStyle = (status: LearningNode['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-success text-success-foreground border-success shadow-lg shadow-success/25';
    case 'in-progress':
      return 'bg-gradient-to-br from-primary to-accent text-primary-foreground border-primary shadow-lg shadow-primary/25 animate-pulse-glow';
    case 'available':
      return 'bg-card text-foreground border-primary hover:border-accent hover:shadow-lg';
    case 'locked':
      return 'bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-60';
    default:
      return 'bg-muted';
  }
};

const getStatusIcon = (status: LearningNode['status']) => {
  switch (status) {
    case 'completed': return CheckCircle;
    case 'in-progress': return Play;
    case 'locked': return Lock;
    default: return null;
  }
};

export const LearningPath: React.FC<LearningPathProps> = ({ 
  nodes = mockNodes,
  onNodeClick 
}) => {
  return (
    <div className="relative py-8">
      {/* Path visualization */}
      <div className="flex flex-col items-center gap-4 relative">
        {nodes.map((node, index) => {
          const NodeIcon = getNodeIcon(node.type);
          const StatusIcon = getStatusIcon(node.status);
          const isLast = index === nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={node.status !== 'locked' ? { scale: 1.05 } : undefined}
                onClick={() => node.status !== 'locked' && onNodeClick(node)}
                className={cn(
                  "relative w-full max-w-md p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                  getStatusStyle(node.status)
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Node Icon */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center",
                    node.status === 'completed' ? 'bg-success-foreground/20' :
                    node.status === 'in-progress' ? 'bg-primary-foreground/20' :
                    'bg-muted'
                  )}>
                    <NodeIcon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-lg">{node.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm opacity-80">
                        {node.type === 'lesson' ? 'Dars' : node.type === 'quiz' ? 'Test' : 'Loyiha'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-current/10">
                        +{node.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Status Icon */}
                  {StatusIcon && (
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      node.status === 'completed' ? 'bg-success-foreground/20' :
                      node.status === 'in-progress' ? 'bg-primary-foreground/20' :
                      'bg-muted'
                    )}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Progress indicator for in-progress */}
                {node.status === 'in-progress' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-primary-foreground"
                      />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Connector Line */}
              {!isLast && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 40 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={cn(
                    "w-1 rounded-full",
                    nodes[index + 1].status === 'locked' ? 'bg-muted' : 'bg-gradient-to-b from-primary to-accent'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
