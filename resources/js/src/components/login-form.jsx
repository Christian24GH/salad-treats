import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/login"); // Laravel Fortify login route
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full mx-auto", className)} {...props}>
      <Card>
        <CardHeader className="relative text-center">
          {/* horizontal lines sandwiching the text */}
          <div className="flex items-center justify-center">
            <span className="flex-1 h-px bg-gray-300" />
            <CardTitle className="mx-4 text-2xl font-bold">Login</CardTitle>
            <span className="flex-1 h-px bg-gray-300" />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4 gap-1">
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    required
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </Field>

              {/* Remember me + Forgot password */}
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="checkbox"
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData("remember", e.target.checked)}
                    className="accent-[var(--forest-green)] w-4 h-4"
                  />
                  <FieldLabel htmlFor="checkbox" className="text-sm">
                    Remember me
                  </FieldLabel>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-[var(--forest-green)] hover:underline underline-offset-4"
                >
                  Forgot your password?
                </a>
              </div>

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full rounded-2xl py-4 bg-[var(--forest-green)] hover:bg-[var(--medium-sea-green)]"
                >
                  {processing ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center mt-2">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="text-[var(--forest-green)] hover:underline">
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
