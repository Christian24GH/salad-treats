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
import { MailIcon, LockIcon, UserIcon, EyeIcon, EyeOffIcon } from "lucide-react";

export function SignupForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register"); // Laravel Fortify default registration route
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full mx-auto", className)}
      {...props}
    >
      <Card>
        <CardHeader className="relative text-center">
          {/* horizontal line sandwiching the title */}
          <div className="flex items-center justify-center">
            <span className="flex-1 h-px bg-gray-300" />
            <CardTitle className="mx-4 text-2xl font-bold">
              Create your account
            </CardTitle>
            <span className="flex-1 h-px bg-gray-300" />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-1 gap-3">
              {/* Full Name */}
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </Field>

              {/* Password + Confirm */}
              <Field>
                <div className="grid grid-cols-1 gap-2">
                  {/* Password */}
                  <div className="relative space-y-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <LockIcon className="absolute left-3 top-[2.2rem] text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={data.password}
                      onChange={(e) => setData("password", e.target.value)}
                      required
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[2.2rem] text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative space-y-2">
                    <FieldLabel htmlFor="password_confirmation">
                      Confirm
                    </FieldLabel>
                    <LockIcon className="absolute left-3 top-[2.2rem] text-gray-400 w-5 h-5" />
                    <Input
                      id="password_confirmation"
                      type={showConfirm ? "text" : "password"}
                      placeholder="********"
                      value={data.password_confirmation}
                      onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                      }
                      required
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-[2.2rem] text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {(errors.password || errors.password_confirmation) ? (
                  <FieldDescription className="text-sm text-red-500 mt-1">
                    {errors.password || errors.password_confirmation}
                  </FieldDescription>
                ) : (
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                )}
              </Field>

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full rounded-2xl py-4 bg-[var(--forest-green)] hover:bg-[var(--medium-sea-green)]"
                >
                  {processing ? "Creating Account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-lg text-center mt-2">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[var(--forest-green)] hover:underline"
                  >
                    Sign in
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Field>
        {/* Terms and Privacy */}
        <FieldDescription className="px-6 text-center text-sm text-gray-600">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="text-[var(--forest-green)] hover:underline underline-offset-4"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-[var(--forest-green)] hover:underline underline-offset-4"
          >
            Privacy Policy
          </a>
          .
        </FieldDescription>
      </Field>
     
    </div>
  );
}
