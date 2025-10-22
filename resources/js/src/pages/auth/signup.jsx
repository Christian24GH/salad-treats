import { SignupForm } from "@/components/signup-form"
import FormLayout from '../../layout/FormLayout'

export default function SignupPage() {
  return (
    <div
      className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <h1 className="text-center text-5xl lato-regular mb-5">Welcome to <span className="text-[var(--forest-green)] birthstone-regular text-7xl font-bold">Salad Treats</span></h1>
      <div className="w-full">
        <SignupForm className="sm:max-w-sm md:max-w-md lg:max-w-md scale-110" />
      </div>
    </div>
  );
}

SignupPage.layout = page => <FormLayout children={page}/>