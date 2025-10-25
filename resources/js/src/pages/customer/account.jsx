import HomeLayout from "@/layout/HomeLayout"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon } from "lucide-react"
import React from "react"

export default function Account({ customerAccount }) {
  return (
    <>
      <section className="min-h-screen bg-[var(--mint-cream)] flex flex-col items-center py-10 px-6 text-[var(--forest-green)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lato-bold-italic">Your Profile</h1>
          <p className="text-lg lato-regular mt-2">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl border border-[var(--forest-green)]/20">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <div className="h-32 w-32 rounded-full bg-[var(--forest-green)]/10 flex items-center justify-center">
                <UserIcon className="text-[var(--forest-green)] h-16 w-16" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold lato-bold text-[var(--forest-green)]">
                {customerAccount?.name || "John Doe"}
              </h2>
              <p className="text-lg lato-regular-italic mb-2">
                {customerAccount?.role || "Customer"}
              </p>
              <Separator className="my-3" />
              <div className="space-y-2 text-lg">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-5 w-5" />
                  <span>{customerAccount?.email || "johndoe@example.com"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5" />
                  <span>{customerAccount?.phone || "0917-123-4567"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{customerAccount?.address || "388 3rd St. Kalayaan B., Quezon City"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-[var(--forest-green)] text-white text-lg lato-regular-italic px-8">
              Edit Profile
            </Button>
            <Button className="border border-[var(--forest-green)] text-[var(--forest-green)] text-lg lato-regular-italic bg-transparent px-8">
              Change Password
            </Button>
          </div>
        </div>

        {/* Optional Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--forest-green)]/70">
            © 2025 Salad Treats — All Rights Reserved
          </p>
        </div>
      </section>
    </>
  )
}

Account.layout = (page) => <HomeLayout children={page} />