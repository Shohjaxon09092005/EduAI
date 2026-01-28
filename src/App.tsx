import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCoursesPage from "./pages/InstructorCoursesPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCoursesPage from "./pages/StudentCoursesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/instructor" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<InstructorCoursesPage />} />
            <Route path="/instructor/*" element={<InstructorDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCoursesPage />} />
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
