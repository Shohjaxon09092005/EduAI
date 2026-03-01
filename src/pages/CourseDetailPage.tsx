import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Course, Lesson } from "@/types";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Play,
  FileText,
  Video,
  Link as LinkIcon,
  AlertCircle,
  Loader,
  Edit,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCourses, getLessons } from "@/lib/api";
import { LessonManagementModal } from "@/components/modals/LessonManagementModal";
import { ResourceManagementModal } from "@/components/modals/ResourceManagementModal";
import { toast } from "sonner";

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);

  const isInstructor = user?.role === "instructor" || user?.role === "admin";

  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    setError(null);

    getCourses()
      .then((courses) => {
        const found = courses.find((c) => c.id === courseId);
        if (!found) {
          setError("Kurs topilmadi");
          return;
        }
        setCourse(found);

        // Load lessons for this course
        return getLessons(Number(courseId));
      })
      .then((lessonsData) => {
        setLessons(lessonsData);
        if (lessonsData.length > 0) {
          setSelectedLesson(lessonsData[0]);
        }
      })
      .catch((err) => {
        console.error("Failed to load course or lessons:", err);
        setError(err.message || "Malumot yuklanmadi");
        toast.error("Malumot yuklanmadi");
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <DashboardLayout
        role={user?.role || "student"}
        title="Kurs"
        userName="O'qiy"
      >
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Malumot yuklanmoqda...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout
        role={user?.role || "student"}
        title="Kurs"
        userName="O'qiy"
      >
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <p className="text-destructive font-semibold">
              {error || "Kurs topilmadi"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:shadow-lg transition-all"
            >
              Orqaga qaytish
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      role={user?.role || "student"}
      title={course.title}
      userName="O'qiy"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Orqaga
        </motion.button>

        {/* Course Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex gap-6">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-48 h-48 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold mb-2">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {course.description}
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.totalLessons} dars</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-muted">
                    {course.category}
                  </span>
                </div>
              </div>
              {isInstructor && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setShowLessonModal(true)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Darslarni Boshqarish
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lessons and Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lessons List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-4">
              <h2 className="font-semibold text-lg mb-4">Darslar</h2>
              <div className="space-y-2">
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <motion.button
                      key={lesson.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedLesson?.id === lesson.id
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted/50 hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="font-medium truncate">{lesson.title}</div>
                      <div className="text-xs mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration} min
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Darslar yo'q
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Lesson Resources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedLesson ? (
              <div className="glass-card p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-2">
                    {selectedLesson.title}
                  </h2>
                  {selectedLesson.description && (
                    <p className="text-muted-foreground">
                      {selectedLesson.description}
                    </p>
                  )}
                  {isInstructor && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setShowResourceModal(true)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Resurslarni Boshqarish
                    </motion.button>
                  )}
                </div>

                {/* Resources */}
                {selectedLesson.resources &&
                selectedLesson.resources.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      O'quv Materiallari
                    </h3>
                    <div className="space-y-3">
                      {selectedLesson.resources.map((resource) => {
                        const isValidUrl =
                          resource.url &&
                          resource.url.toString().trim().length > 0;
                        const handleResourceClick = (e: React.MouseEvent) => {
                          if (!isValidUrl) {
                            e.preventDefault();
                            toast.error("Resurs yuklanmadi");
                          }
                        };

                        return (
                          <motion.a
                            key={resource.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            href={isValidUrl ? resource.url : "#"}
                            onClick={handleResourceClick}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block p-4 rounded-lg border transition-all group ${
                              isValidUrl
                                ? "border-border/50 hover:border-primary hover:bg-primary/5 cursor-pointer"
                                : "border-destructive/50 bg-destructive/5 cursor-not-allowed opacity-60"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                {resource.type === "video" && (
                                  <Video className="w-5 h-5 text-primary" />
                                )}
                                {resource.type === "link" && (
                                  <LinkIcon className="w-5 h-5 text-primary" />
                                )}
                                {["pdf", "pptx", "docx"].includes(
                                  resource.type,
                                ) && (
                                  <FileText className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium group-hover:text-primary transition-colors">
                                  {resource.title}
                                </h4>
                                {resource.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {resource.description}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                                  {resource.type}
                                </p>
                                {!isValidUrl && (
                                  <p className="text-xs text-destructive mt-2">
                                    ⚠️ Resurs yuklanmadi
                                  </p>
                                )}
                              </div>
                              {isValidUrl && (
                                <Play className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Bu dars uchun resurs mavjud emas
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-6 text-center py-12">
                <p className="text-muted-foreground">Dars tanlang</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Lesson Management Modal */}
        <LessonManagementModal
          courseId={courseId || ""}
          isOpen={showLessonModal}
          lessons={lessons}
          onClose={() => setShowLessonModal(false)}
          onLessonsUpdated={(updated) => {
            setLessons(updated);
            if (
              selectedLesson &&
              !updated.find((l) => l.id === selectedLesson.id)
            ) {
              setSelectedLesson(updated[0] || null);
            }
          }}
        />

        {/* Resource Management Modal */}
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
                  l.id === selectedLesson.id ? { ...l, resources: updated } : l,
                ),
              );
              setSelectedLesson({ ...selectedLesson, resources: updated });
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseDetailPage;
