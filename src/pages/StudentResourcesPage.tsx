import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ResourceViewer } from "@/components/instructor/ResourceViewer";
import { Resource } from "@/types";
import { resourceCategories } from "@/lib/mockData";

import { FolderOpen, Search, Filter, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { getResources, getCategories, Category } from "@/lib/api";
import { toast } from "sonner";

const StudentResourcesPage: React.FC = () => {
  const { tokens } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Barchasi");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  // Load resources for student's enrolled courses
  useEffect(() => {
    if (!tokens) return;
    Promise.all([getResources(), getCategories()])
      .then(([resourcesData, cats]) => {
        setResources(resourcesData);
        setCategories(cats);
      })
      .catch((err) => {
        console.error("Failed to load:", err);
        toast.error("Resurslar yuklanmadi");
      })
      .finally(() => setLoading(false));
    setLoading(true);
    getResources()
      .then((data) => {
        console.log("StudentResources loaded:", data.length);
        setResources(data);
      })
      .catch((err) => {
        console.error("Failed to load resources:", err);
        toast.error("Resurslar yuklanmadi");
      })
      .finally(() => setLoading(false));
  }, [tokens]);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Barchasi" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  console.log("StudentResources state:", {
    resourcesLength: resources.length,
    filteredLength: filteredResources.length,
    sample: resources[0],
  });

  return (
    <DashboardLayout role="student" title="Resurslar" userName="Talaba">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text">
              Bilimlar xazinasi
            </h1>
            <p className="text-muted-foreground mt-1">
              Barcha dars materiallari va qo'shimcha resurslar bir joyda
            </p>
          </div>
          <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">
              AI tomonidan tavsiya etilganlar 
            </span>
          </div>
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
          </div>
        </motion.div>

        {/* Resources Grid */}
        <ResourceViewer
          resources={filteredResources}
          onView={(resource) => console.log("Viewing resource:", resource)}
          tokens={tokens}
        />

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Resurslar topilmadi</h3>
            <p className="text-muted-foreground">
              Qidiruv mezonlariga mos resurs yo'q
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentResourcesPage;
