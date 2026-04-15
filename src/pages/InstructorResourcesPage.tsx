import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ResourceUploader } from "@/components/instructor/ResourceUploader";
import { ResourceViewer } from "@/components/instructor/ResourceViewer";
import { CategoryCreationModal } from "@/components/modals/CategoryCreationModal";
import { Resource } from "@/types";
// import { resourceCategories } from '@/lib/mockData';
import { FolderOpen, Search, Plus, Filter, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  getResources,
  createResource,
  deleteResource,
  getCourses,
  getCategories,
  ResourcePayload,
  Category,
} from "@/lib/api";

interface UploadedFile {
  id: string;
  name: string;
  type: "pdf" | "pptx" | "docx" | "video" | "link";
  size: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress?: number;
  aiTopics?: string[];
}

const InstructorResourcesPage: React.FC = () => {
  const { tokens, user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Barchasi");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  // modal form state
  const [modalCourseId, setModalCourseId] = useState<number | null>(null);
  const [modalCategoryId, setModalCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load instructor's courses, resources and categories
  useEffect(() => {
    if (!tokens) return;
    setLoading(true);

    let completeCount = 0;
    const checkDone = () => {
      completeCount += 1;
      if (completeCount === 3) {
        setLoading(false);
      }
    };

    // courses
    getCourses()
      .then((coursesData) => {
        console.log("fetched courses", coursesData.length);
        if (user?.id) {
          const uid = String(user.id);
          const instructorCourses = coursesData.filter(
            (c) => c.instructorId === uid,
          );
          setCourses(instructorCourses);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        toast.error("Kurslar yuklanmadi");
      })
      .finally(checkDone);

    // categories
    getCategories()
      .then((cats) => {
        console.log("fetched categories", cats.length);
        setCategories(cats);
        if (cats.length && modalCategoryId == null) {
          setModalCategoryId(cats[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
        toast.error("Kategoriyalar yuklanmadi");
      })
      .finally(checkDone);

    // resources
    getResources()
      .then((resourcesData) => {
        console.log("fetched resources", resourcesData.length);
        setResources(resourcesData);
      })
      .catch((err) => {
        console.error("Failed to fetch resources", err);
        toast.error("Resurslar yuklanmadi");
        // keep resources empty
        setResources([]);
      })
      .finally(checkDone);
  }, [tokens, user?.id]);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Barchasi" || resource.category === selectedCategory;
    const matchesCourse =
      !selectedCourseId || Number(resource.courseId) === selectedCourseId;
    return matchesSearch && matchesCategory && matchesCourse;
  });

  console.log("InstructorResources state:", {
    resourcesLength: resources.length,
    filteredLength: filteredResources.length,
    sample: resources[0],
  });

  const handleFilesAdded = (files: File[]) => {
    if (!tokens || !modalCourseId || !modalCategoryId) {
      console.warn("upload skipped, missing selection", {
        modalCourseId,
        modalCategoryId,
      });
      toast.error("Kurs va kategoriya tanlang");
      return;
    }
    const formatSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: (file.name.split(".").pop() || "pdf") as UploadedFile["type"],
      size: formatSize(file.size), // ✅ endi "320 B", "1.2 KB", "2.45 MB" ko'rinishida
      status: "uploading" as const,
      progress: 0,
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Upload each file to API
    newFiles.forEach((file, index) => {
      const actualFile = files[index];
      const payload: ResourcePayload = {
        title: actualFile.name.replace(/\.[^/.]+$/, ""),
        type: (actualFile.name.split(".").pop() ||
          "pdf") as ResourcePayload["type"],
        course: modalCourseId,
        category_id: modalCategoryId || undefined,
        size: formatSize(actualFile.size), // ✅ haqiqiy File hajmi
        file: actualFile,
      };
      console.log("upload payload", payload);
      createResource(payload)
        .then((resource) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: "completed", aiTopics: resource.aiTopics }
                : f,
            ),
          );
          setResources((prev) => [resource, ...prev]);
          toast.success(`${file.name} muvaffaqiyatli yuklandi`);
        })
        .catch((err) => {
          console.error("Upload failed:", err);
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, status: "error" } : f)),
          );
          toast.error(`${file.name} yuklanmadi`);
        });
    });
  };

  const handleFileRemove = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDeleteResource = async (id: string) => {
    if (!tokens) return;
    if (!confirm("Resursni o'chirishni tasdiqlamoqchimiz?")) return;

    try {
      await deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      toast.success("Resurs o'chirildi");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Resursni o'chira olmadik");
    }
  };

  return (
    <DashboardLayout role="instructor" title="Resurslar" userName="O'qituvchi">
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
                <p className="text-sm text-muted-foreground">Jami resurslar</p>
                <p className="text-2xl font-bold mt-1">{resources.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>
          {/* Course selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <label className="block text-sm font-medium mb-2">
              Kurs tanlang
            </label>
            <select
              value={selectedCourseId || ""}
              onChange={(e) =>
                setSelectedCourseId(
                  e.target.value ? Number(e.target.value) : null,
                )
              }
              className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Barcha kurslar</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Resurslarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Filter className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
              <button
                key="all"
                onClick={() => setSelectedCategory("Barchasi")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === "Barchasi"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                Barchasi
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    selectedCategory === cat.name
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowUploadModal(true);
                // if a course filter is applied use it, otherwise pick first available course
                setModalCourseId(
                  selectedCourseId || (courses.length ? courses[0].id : null),
                );
                if (categories.length && !modalCategoryId) {
                  setModalCategoryId(categories[0].id);
                }
              }}
              disabled={courses.length === 0 || categories.length === 0}
              title={
                courses.length === 0
                  ? "Avvalo kurs qo‘shing"
                  : categories.length === 0
                    ? "Avvalo kategoriya qo‘shing"
                    : ""
              }
              className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Qo'shish
            </motion.button>
          </div>
        </motion.div>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{resource.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{resource.type.toUpperCase()}</span>
                    {resource.size && <span>{resource.size}</span>}
                    <span>
                      {new Date(resource.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {resource.aiTopics && resource.aiTopics.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {resource.aiTopics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(resource.url, "_blank")}
                    className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                  >
                    Ko'rish
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteResource(resource.id)}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Resurslar topilmadi
              </h3>
              <p className="text-muted-foreground">
                Qidiruv mezonlariga mos resurs yo'q
              </p>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowUploadModal(false);
                  setModalCourseId(null);
                  setModalCategoryId(null);
                  setUploadedFiles([]);
                }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed left-1/4 top-10 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 p-4"
              >
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-2xl">
                      Yangi resurs qo'shish
                    </h2>
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setModalCourseId(null);
                        setModalCategoryId(null);
                        setUploadedFiles([]);
                      }}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Kurs <span className="text-destructive">*</span>
                        </label>
                        <select
                          className="w-full px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          value={modalCourseId || ""}
                          onChange={(e) =>
                            setModalCourseId(
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                        >
                          <option value="">--kurs tanlang--</option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Kategoriya <span className="text-destructive">*</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={modalCategoryId || ""}
                            onChange={(e) =>
                              setModalCategoryId(
                                e.target.value ? Number(e.target.value) : null,
                              )
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
                    </div>

                    <ResourceUploader
                      files={uploadedFiles}
                      onFilesAdded={handleFilesAdded}
                      onFileRemove={handleFileRemove}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowUploadModal(false);
                          setModalCourseId(null);
                          setModalCategoryId(null);
                          setUploadedFiles([]);
                        }}
                        className="px-6 py-2 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-all"
                      >
                        Tayyor
                      </motion.button>
                    </div>
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
            setModalCategoryId(newCategory.id);
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default InstructorResourcesPage;
