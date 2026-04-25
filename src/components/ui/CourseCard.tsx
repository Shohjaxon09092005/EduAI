import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Clock,
  ChevronRight,
  Play,
  Edit,
  Trash2,
  BarChart3,
  UserPlus,
  CheckCircle,
  Loader,
} from "lucide-react";
import { Course } from "@/types";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  variant?: "student" | "instructor" | "admin" | "discovery";
  enrolled?: boolean;
  enrolling?: boolean;
  onAction?: (
    action: "view" | "edit" | "delete" | "start" | "enroll",
    courseId: string,
  ) => void;
}

const difficultyColors = {
  beginner: "text-green-500 bg-green-500/10 border-green-500/20",
  intermediate: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  advanced: "text-red-500 bg-red-500/10 border-red-500/20",
};

const difficultyLabels = {
  beginner: "Boshlang'ich",
  intermediate: "O'rta",
  advanced: "Murakkab",
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = "student",
  enrolled = false,
  enrolling = false,
  onAction,
}) => {
  const navigate = useNavigate();
  const progress = course.progress || 0;
  const completionPercentage =
    course.totalLessons > 0
      ? Math.round((course.completedLessons / course.totalLessons) * 100)
      : 0;

  const handleViewCourse = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6 group cursor-pointer"
    >
      {/* Thumbnail or Emoji */}
      <div className="w-full h-40 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">📚</span>
        )}
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        {/* Title & Category */}
        <div>
          <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.totalLessons} dars</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.instructorName}</span>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-md border font-medium",
              difficultyColors[course.difficulty],
            )}
          >
            {difficultyLabels[course.difficulty]}
          </span>
          <span className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground">
            {course.category}
          </span>
        </div>

        {/* Progress Bar (for student variant) */}
        {variant === "student" && progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-border/50 flex items-center gap-2">
          {variant === "student" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewCourse}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Play className="w-4 h-4" />
              {progress > 0 ? "Davom ettirish" : "Boshlash"}
            </motion.button>
          )}

          {variant === "instructor" && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction?.("edit", course.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <Edit className="w-4 h-4" />
                Tahrirlash
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewCourse}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
              </motion.button>
            </>
          )}
          {variant === "instructor" && (
            <>
              {/* ✅ Shu qo'shiladi */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction?.("delete", course.id)}
                className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          )}
          {variant === "admin" && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewCourse}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Ko'rish
                <ChevronRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction?.("edit", course.id)}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAction?.("delete", course.id)}
                className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </>
          )}

          {variant === "discovery" && (
            <>
              {enrolled ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewCourse}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-success text-success-foreground font-medium hover:shadow-lg hover:shadow-success/25 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Yozilgan
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAction?.("enroll", course.id)}
                  disabled={enrolling}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrolling ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {enrolling ? "Yozilmoqda..." : "Yozilish"}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewCourse}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
