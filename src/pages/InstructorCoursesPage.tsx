import { useState } from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/ui/CourseCard";
import { CourseManagementPanel } from "@/components/CourseManagementPanel";
import { CategoryCreationModal } from "@/components/modals/CategoryCreationModal";
import { Course } from "@/types";
import {
  BookOpen,
  Search,
  Plus,
  Grid3x3,
  List,
  Users,
  CheckCircle,
  Clock,
  Trash2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  getInstructorStudentsStats,
  Category,
  CoursePayload,
} from "@/lib/api";

// the course list is loaded from the API instead of using mocks

const InstructorCoursesPage: React.FC = () => {
  const { tokens, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "manage">("grid");
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalStudentCount, setTotalStudentCount] = useState<number>(0);
  // O'chirish uchun state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<Partial<CoursePayload>>({
    title: "",
    description: "",
    category_id: undefined,
    difficulty: "beginner",
    total_lessons: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // load courses and category list
  useEffect(() => {
    if (!tokens) return;
    setLoading(true);
    Promise.all([getCourses(), getCategories(), getInstructorStudentsStats()])
      .then(([data, cats, stats]) => {
        if (user?.id) {
          const uid = String(user.id);
          const instructorCourses = data.filter((c) => c.instructorId === uid);
          setCourses(instructorCourses);
        } else {
          setCourses(data);
        }
        setCategories(cats);
        // set active student count from API stats
        setTotalStudentCount(stats.active);
      })
      .catch((err) => console.error("load failed", err))
      .finally(() => setLoading(false));
  }, [tokens, user]);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCourseAction = (action: string, courseId: string) => {
    console.log(`Action: ${action} on course: ${courseId}`);
    const target = courses.find((c) => c.id === courseId);
    if (!target) return;
    if (action === "edit") {
      setEditingId(courseId);
      setFormData({
        title: target.title,
        description: target.description,
        category_id: categories.find((cat) => cat.name === target.category)?.id,
        difficulty: target.difficulty,
        total_lessons: target.totalLessons,
      });
      setShowModal(true);
    } else if (action === "view") {
      // navigate to analytics if implemented
    } else if (action === "delete") {
      setDeleteConfirm({ id: courseId, title: target.title });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      category_id: undefined,
      difficulty: "beginner",
      total_lessons: 0,
    });
  };
  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    deleteCourse(deleteConfirm.id)
      .then(() => {
        setCourses((c) => c.filter((x) => x.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      })
      .catch((err) => console.error("delete failed", err))
      .finally(() => setDeleting(false));
  };

  const handleSave = () => {
    if (!tokens) return;
    const payload: CoursePayload = {
      title: formData.title || "",
      description: formData.description || "",
      category_id: formData.category_id,
      difficulty: formData.difficulty as any,
      total_lessons: formData.total_lessons || 0,
      // include thumbnail file if one has been selected
      thumbnail: formData.thumbnail,
    };
    console.log("handleSave payload", payload);
    const op = editingId
      ? updateCourse(editingId, payload, user?.id)
      : createCourse(payload, user?.id);
    op.then((c) => {
      if (editingId) {
        setCourses((cs) => cs.map((x) => (x.id === editingId ? c : x)));
      } else {
        setCourses((cs) => [c, ...cs]);
      }
    })
      .catch((err) => console.error("save failed", err))
      .finally(() => {
        setShowModal(false);
        resetForm();
      });
  };

  return (
    <DashboardLayout
      role="instructor"
      title="Mening kurslarim"
      userName="O'qituvchi"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Jami kurslar</p>
                <p className="text-2xl font-bold mt-1">{courses.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Talabalar</p>
                <p className="text-2xl font-bold mt-1">{totalStudentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  O'rtacha baholash
                </p>
                <p className="text-2xl font-bold mt-1">4.8</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Kurslarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Create Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Yangi kurs
            </motion.button>

            {/* View Mode */}
            <div className="flex items-center gap-2 border-l border-border/50 pl-4">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground",
                )}
                title="Grid ko'rinish"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground",
                )}
                title="Ro'yxat ko'rinish"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("manage")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "manage"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground",
                )}
                title="Boshqarish ko'rinish"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Courses Display */}
        {viewMode === "manage" ? (
          // Management View
          <div className="space-y-2">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CourseManagementPanel
                    course={course}
                    onLessonCountUpdate={(count) => {
                      setCourses((cs) =>
                        cs.map((c) =>
                          c.id === course.id
                            ? { ...c, totalLessons: count }
                            : c,
                        ),
                      );
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <p className="text-center py-12 text-muted-foreground">
                Kurslar topilmadi
              </p>
            )}
          </div>
        ) : (
          // Grid/List View
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1",
            )}
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard
                  course={course}
                  variant="instructor"
                  onAction={handleCourseAction}
                />
              </motion.div>
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kurslar topilmadi</h3>
            <p className="text-muted-foreground mb-4">
              Qidiruvni o'zgartiring yoki yangi kurs yarating
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Plus className="w-5 h-5" />
              Birinchi kursni yaratish
            </motion.button>
          </motion.div>
        )}

        {/* Course Modal (create/edit) */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <div className="glass-card w-full max-w-lg max-h-[90vh] flex flex-col">
                  <h2 className="font-display font-bold text-2xl mb-4 p-6 pb-0">
                    {editingId ? "Kursni tahrirlash" : "Yangi kurs yaratish"}
                  </h2>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kurs nomi
                      </label>
                      <input
                        type="text"
                        placeholder="Masalan: JavaScript asoslari"
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData((f) => ({ ...f, title: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tavsif
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Kurs haqida qisqacha ma'lumot..."
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Kategoriya
                        </label>
                        <div className="flex gap-2">
                          <select
                            className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={formData.category_id || ""}
                            onChange={(e) =>
                              setFormData((f) => ({
                                ...f,
                                category_id: Number(e.target.value),
                              }))
                            }
                          >
                            <option value="">--kategoriya tanlang--</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setShowCategoryModal(true)}
                            title="Yangi kategoriya qo'shish"
                            className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-all"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Daraja
                        </label>
                        <select
                          className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          value={formData.difficulty}
                          onChange={(e) =>
                            setFormData((f) => ({
                              ...f,
                              difficulty: e.target.value as any,
                            }))
                          }
                        >
                          <option value="beginner">Boshlang'ich</option>
                          <option value="intermediate">O'rta</option>
                          <option value="advanced">Murakkab</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Darslar soni
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.total_lessons ?? 0}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            total_lessons: Number(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Muqova rasmi (ixtiyoriy)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setFormData((f) => ({ ...f, thumbnail: file }));
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="border-t border-border/50 p-6 flex gap-3 bg-background/50">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-all"
                    >
                      Bekor qilish
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
                    >
                      Yaratish
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
          {deleteConfirm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !deleting && setDeleteConfirm(null)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <div className="glass-card w-full max-w-sm p-6 text-center">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-6 h-6 text-destructive" />
                  </div>

                  <h3 className="font-semibold text-lg mb-2">
                    Kursni o'chirish
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    <span className="font-medium text-foreground">
                      "{deleteConfirm.title}"
                    </span>{" "}
                    kursini o'chirasizmi? Bu amalni qaytarib bo'lmaydi.
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDeleteConfirm(null)}
                      disabled={deleting}
                      className="flex-1 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-all disabled:opacity-50"
                    >
                      Bekor qilish
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeleteConfirm}
                      disabled={deleting}
                      className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {deleting ? (
                        <Clock className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      {deleting ? "O'chirilmoqda..." : "O'chirish"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Category Creation Modal */}
        <CategoryCreationModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onCategoryCreated={(newCategory) => {
            setCategories((prev) => [...prev, newCategory]);
            setFormData((f) => ({ ...f, category_id: newCategory.id }));
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default InstructorCoursesPage;
