import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser(data.email, data.password);
      login(result.user, result.tokens);

      // Redirect to appropriate dashboard based on role
      if (result.user.role === "admin") {
        navigate("/admin");
      } else if (result.user.role === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kirish xatosi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 mesh-bg">
      <div className="w-full max-w-md glass-card p-8">
        <h2 className="text-2xl font-bold mb-6 capitalize">
          {role === "instructor"
            ? "Domla kirishi"
            : role === "admin"
              ? "Admin kirishi"
              : role === "student"
                ? "Talaba kirishi"
                : "Kirish"}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="Email kiriting"
              {...register("email", {
                required: "Email kiritilishi shart",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email noto'g'ri formatda",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Parol</label>
            <Input
              type="password"
              placeholder="Parol kiriting"
              {...register("password", {
                required: "Parol kiritilishi shart",
                minLength: {
                  value: 6,
                  message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Yuklanmoqda..." : "Kirish"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-center">
          Hisobingiz yo'qmi?{" "}
          <Link to={`/register/${role ?? ""}`} className="text-primary underline">
            Ro'yxatdan o'tish
          </Link>
        </p>
        <p className="mt-2 text-sm text-center text-muted-foreground">
          <Link to="/" className="text-primary hover:underline">
            Bosh sahifaga qaytish
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
