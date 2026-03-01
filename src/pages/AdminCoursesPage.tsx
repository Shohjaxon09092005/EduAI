import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/ui/CourseCard";
import { CourseManagementPanel } from "@/components/CourseManagementPanel";
import { StatsCard } from "@/components/ui/StatsCard";
import { Course } from "@/types";
import {
  BookOpen,
  Search,
  Filter,
  Grid3x3,
  List,
  Users,
  TrendingUp,
  Award,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  Category,
  CoursePayload,
} from "@/lib/api";

// courses are loaded from the backend and held in state

const AdminCoursesPage: React.FC = () => {
  const { tokens, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "manage">("grid");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categoriesState, setCategoriesState] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CoursePayload>>({
    title: "",
    description: "",
    category_id: undefined,
    difficulty: "beginner",
    total_lessons: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = ["all", ...categoriesState.map((c) => c.name)];
  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleCourseAction = (action: string, courseId: string) => {
    console.log(`Action: ${action} on course: ${courseId}`);
    if (action === "delete") {
      const confirmed = window.confirm("Kursni o'chirmoqchimisiz?");
      if (confirmed) {
        deleteCourse(courseId)
          .then(() => setCourses((c) => c.filter((x) => x.id !== courseId)))
          .catch((err) => console.error("delete failed", err));
      }
    } else if (action === "edit") {
      const target = courses.find((c) => c.id === courseId);
      if (!target) return;
      setEditingId(courseId);
      setFormData({
        title: target.title,
        description: target.description,
        category_id: categoriesState.find((cat) => cat.name === target.category)
          ?.id,
        difficulty: target.difficulty,
        total_lessons: target.totalLessons,
      });
      setShowModal(true);
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

  const handleSave = () => {
    if (!tokens) return;
    const payload: CoursePayload = {
      title: formData.title || "",
      description: formData.description || "",
      category_id: formData.category_id,
      difficulty: formData.difficulty as any,
      total_lessons: formData.total_lessons || 0,
      // copy thumbnail from form state so the API helper can append it
      thumbnail: formData.thumbnail,
    };
    console.log("admin handleSave payload", payload);
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

  useEffect(() => {
    if (!tokens) return;
    setLoading(true);
    Promise.all([getCourses(), getCategories()])
      .then(([data, cats]) => {
        setCourses(data);
        setCategoriesState(cats);
      })
      .catch((err) => console.error("load failed", err))
      .finally(() => setLoading(false));
  }, [tokens]);

  return (
    <DashboardLayout role="admin" title="Barcha kurslar" userName="Admin">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Jami kurslar"
            value={courses.length.toString()}
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="O'qituvchilar"
            value="5"
            icon={Users}
            variant="accent"
          />
          <StatsCard
            title="Talabalar"
            value="1,234"
            icon={Users}
            variant="warning"
            trend={{ value: 150, isPositive: true }}
          />
          <StatsCard
            title="Yakunlash darajasi"
            value="73%"
            icon={Award}
            variant="success"
          />
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Kurslar, o'qituvchilar yoki kategoriya bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Category Filter */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Kategoriya
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "Barcha kategoriyalar" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Daraja
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="all">Barcha darajalar</option>
                  <option value="beginner">Boshlang'ich</option>
                  <option value="intermediate">O'rta</option>
                  <option value="advanced">Murakkab</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">
                  Ko'rinish
                </label>
                <div className="flex items-center gap-2">
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
            </div>
          </div>
        </motion.div>

        {/* Results Count + create button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredCourses.length}
            </span>{" "}
            ta kurs topildi
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Yangi kurs
          </motion.button>
        </div>

        {/* Courses Grid */}
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
                      setCourses(cs => 
                        cs.map(c => c.id === course.id 
                          ? { ...c, totalLessons: count }
                          : c
                        )
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
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                variant="admin"
                onAction={handleCourseAction}
              />
            </motion.div>
          ))}
          </div>
        )}

        {viewMode !== "manage" && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kurslar topilmadi</h3>
            <p className="text-muted-foreground">
              Qidiruv yoki filtrlarni o'zgartiring
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

        {/* Course modal used for create/edit */}
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Kategoriya
                        </label>
                        <select
                          className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          value={formData.category_id || ""}
                          onChange={(e) =>
                            setFormData((f) => ({
                              ...f,
                              category_id: Number(e.target.value),
                            }))
                          }
                        >
                          <option value="">--kategoriya tanlang--</option>
                          {categoriesState.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
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
                        min={1}
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
                      Saqlash
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default AdminCoursesPage;
