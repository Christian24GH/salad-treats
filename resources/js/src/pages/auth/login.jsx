import { LoginForm } from "@/components/login-form"
import AuthLayout from '../../layout/AuthLayout'

export default function Login() {
  return (
    <div className="flex flex-col w-full items-center p-6 md:p-10">
      <h1 className="text-center text-5xl lato-regular mb-15">Welcome back to <span className="text-[var(--forest-green)] birthstone-regular text-7xl font-bold">Salad Treats</span></h1>
      <div className="w-full">
        <LoginForm className="sm:max-w-sm md:max-w-md lg:max-w-md scale-110"/>
      </div>
    </div>
  );
}

Login.layout = page => <AuthLayout children={page}/>