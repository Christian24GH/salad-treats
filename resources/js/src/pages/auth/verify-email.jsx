import { usePage, router } from '@inertiajs/react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import axios from "axios";
export default function VerifyEmail() {
    const { status, auth } = usePage().props

    useEffect(() => {
        if (auth.user.email_verified_at) {
        router.visit('/dashboard')
        }
    }, [auth.user.email_verified_at])

  //sets csrf token so all request doest get rejected by laravel e.g 419 error
    useEffect(() => {
        axios.get("/sanctum/csrf-cookie");
    }, []);

    const resend = () => {
        router.post('/email/verification-notification')
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Verify Your Email</h1>
        <p className="max-w-md text-gray-600">
            A verification link has been sent to your email address. Please check your inbox and click the link to verify.
        </p>

        {status === 'verification-link-sent' && (
            <p className="text-green-600 font-medium">A new verification link has been sent!</p>
        )}

        <Button onClick={resend} className={"bg-[var(--forest-green)]"}>Resend Verification Email</Button>

        <form onSubmit={(e) => { e.preventDefault(); router.post('/logout') }}>
            <Button variant="outline" className="mt-4">Logout</Button>
        </form>
        </div>
    )
}
