import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate("/login");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl rounded-[36px] p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200/80 light:text-sky-700">Create account</p>
        <h1 className="mt-3 text-4xl font-semibold">Open your finance workspace</h1>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          New registrations default to the Viewer role for secure onboarding. Admins can promote accounts later from the control panel.
        </p>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-[var(--muted)]">Full name</label>
            <Input placeholder="Alex Morgan" {...register("name")} />
            {errors.name ? <p className="mt-2 text-sm text-rose-300">{errors.name.message}</p> : null}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-[var(--muted)]">Email</label>
            <Input placeholder="alex@company.com" {...register("email")} />
            {errors.email ? <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm text-[var(--muted)]">Password</label>
            <Input type="password" placeholder="Minimum 6 characters" {...register("password")} />
            {errors.password ? <p className="mt-2 text-sm text-rose-300">{errors.password.message}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm text-[var(--muted)]">Confirm password</label>
            <Input type="password" placeholder="Repeat your password" {...register("confirmPassword")} />
            {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-300">{errors.confirmPassword.message}</p> : null}
          </div>
          <div className="md:col-span-2">
            <Button className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Creating account..." : "Create account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
          <span>Already have an account?</span>
          <Link to="/login" className="text-sky-300 transition hover:text-sky-200 light:text-sky-700">
            Back to sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
