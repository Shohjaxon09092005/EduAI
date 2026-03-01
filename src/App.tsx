import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminStatisticsPage from "./pages/AdminStatisticsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import InstructorDashboard from "./pages/InstructorDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorCoursesPage from "./pages/InstructorCoursesPage";
import InstructorResourcesPage from "./pages/InstructorResourcesPage";
import InstructorTestsPage from "./pages/InstructorTestsPage";
import InstructorAnalyticsPage from "./pages/InstructorAnalyticsPage";
import InstructorStudentsPage from "./pages/InstructorStudentsPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCoursesPage from "./pages/StudentCoursesPage";
import StudentResourcesPage from "./pages/StudentResourcesPage";
import StudentTestsPage from "./pages/StudentTestsPage";
import StudentProgressPage from "./pages/StudentProgressPage";
import StudentSettingsPage from "./pages/StudentSettingsPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* auth pages */}
              <Route path="/login/:role" element={<Login />} />
              <Route path="/register/:role" element={<Register />} />
              {/* admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/statistics"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminStatisticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              {/* instructor routes */}
              <Route
                path="/instructor"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/resources"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorResourcesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/tests"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorTestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/analytics"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorAnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/students"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorStudentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/*"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              {/* student routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/courses"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentCoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/resources"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentResourcesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/tests"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentTestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/progress"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/settings"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:courseId"
                element={
                  <ProtectedRoute allowedRoles={["student", "instructor", "admin"]}>
                    <CourseDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
