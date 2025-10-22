import { LoginForm } from "@/components/login-form"
import FormLayout from '../../layout/FormLayout'

export default function Login() {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
      <h1 className="text-center text-5xl lato-regular mb-15">Welcome to back to <span className="text-[var(--forest-green)] birthstone-regular text-7xl font-bold">Salad Treats</span></h1>
      <div className="w-full">
        <LoginForm className="sm:max-w-sm md:max-w-md lg:max-w-md scale-110"/>
      </div>
    </div>
  );
}

Login.layout = page => <FormLayout children={page}/>