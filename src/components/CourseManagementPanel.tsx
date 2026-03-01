import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Course, Lesson } from '@/types';
import { ChevronDown, BookOpen, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { getLessons } from '@/lib/api';
import { LessonManagementModal } from '@/components/modals/LessonManagementModal';
import { ResourceManagementModal } from '@/components/modals/ResourceManagementModal';

interface CourseManagementPanelProps {
  course: Course;
  onLessonCountUpdate?: (count: number) => void;
}

export const CourseManagementPanel: React.FC<CourseManagementPanelProps> = ({
  course,
  onLessonCountUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;
    setLoading(true);
    getLessons(Number(course.id))
      .then((data) => {
        setLessons(data);
        onLessonCountUpdate?.(data.length);
      })
      .catch((err) => console.error('Failed to load lessons:', err))
      .finally(() => setLoading(false));
  }, [isExpanded, course.id, onLessonCountUpdate]);

  const selectedLesson = lessons.find((l) => l.id === selectedLessonId);

  return (
    <motion.div
      layout
      className="rounded-lg border border-border/50 bg-muted/20 overflow-hidden"
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 transition-transform transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-medium">{course.title}</span>
          <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary ml-auto mr-2">
            {lessons.length} dars
          </span>
        </div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50"
          >
            <div className="p-4 space-y-3 bg-background/50">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Yuklanmoqda...
                </p>
              ) : lessons.length > 0 ? (
                <>
                  {/* Lessons List */}
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                          selectedLessonId === lesson.id
                            ? 'bg-primary/10 border-primary/50'
                            : 'bg-muted/30 border-border/30 hover:border-border/50'
                        }`}
                        onClick={() => setSelectedLessonId(lesson.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration} min • {lesson.resources?.length || 0} resurs
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowResourceModal(true);
                            }}
                            className="p-1 hover:bg-primary/20 text-primary rounded transition-colors"
                            title="Resursharni tahrirlash"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {lesson.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Selected Lesson Resources */}
                  {selectedLesson?.resources && selectedLesson.resources.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-border/30 space-y-2"
                    >
                      <p className="text-xs font-semibold text-muted-foreground">
                        Resurslar: {selectedLesson.title}
                      </p>
                      {selectedLesson.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="p-2 rounded bg-muted/50 text-xs flex items-center justify-between"
                        >
                          <span className="truncate">{resource.title}</span>
                          <span className="text-muted-foreground whitespace-nowrap ml-2">
                            {resource.type}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Darslar yo'q
                </p>
              )}

              {/* Action Button */}
              <button
                onClick={() => setShowLessonModal(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Darslarni Boshqarish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <LessonManagementModal
        courseId={course.id}
        isOpen={showLessonModal}
        lessons={lessons}
        onClose={() => setShowLessonModal(false)}
        onLessonsUpdated={(updated) => {
          setLessons(updated);
          onLessonCountUpdate?.(updated.length);
        }}
      />

      {selectedLesson && (
        <ResourceManagementModal
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
          isOpen={showResourceModal}
          resources={selectedLesson.resources || []}
          onClose={() => setShowResourceModal(false)}
          onResourcesUpdated={(updated) => {
            setLessons(
              lessons.map((l) =>
                l.id === selectedLesson.id ? { ...l, resources: updated } : l
              )
            );
            setSelectedLessonId(selectedLesson.id);
          }}
        />
      )}
    </motion.div>
  );
};
