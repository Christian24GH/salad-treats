import { useEffect} from "react";
import axios from "axios";
import AdminMenuBar from "@/components/admin/navigation-menu";
import CustomerMenuBar from "@/components/customer/navigation-menu";
import DeliveryMenuBar from "@/components/delivery/navigation-menu";
import DefaultMenuBar from "@/components/default/navigation-menu";
import { usePage } from '@inertiajs/react'
import { Toaster } from "sonner";

export default function HomeLayout({ children }){
    const { auth } = usePage().props
    
    //sets csrf token so all request doest get rejected by laravel e.g 419 error
    useEffect(() => {
        axios.get("/sanctum/csrf-cookie");
    }, []);
    
    return (
        <>
            <Toaster richColors/>
            <div className="w-full h-full">
                <header className="h-[50px] md:h-[60px] w-full bg-[var(--forest-green)] flex flex-wrap md:flex-nowrap items-center justify-between px-3 md:px-6 fixed top-0 z-50">
                    <div className="flex items-center gap-x-2 md:gap-x-3">
                        <div className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] rounded-full overflow-hidden flex items-center justify-center bg-white">
                        <img
                            src="/assets/logo.jfif"
                            alt="Logo"
                            className="w-full h-full object-cover scale-110"
                        />
                        </div>
                        <h1 className="birthstone-regular text-5xl md:text-3xl font-bold text-white cursor-pointer select-none whitespace-nowrap">
                            Salad Treats
                        </h1>
                    </div>

                    <div className="hidden md:flex">
                        {
                            auth.user.role === "Customer" ? <CustomerMenuBar /> :
                            auth.user.role === "Owner"    ? <AdminMenuBar /> :
                            auth.user.role === "Delivery"    ? <DeliveryMenuBar /> :
                            <DefaultMenuBar /> //fallback
                        }
                    </div>

                    
                    <div className="md:hidden ml-auto">
                        {/* Mobile menu button */
                            auth.user.role === "Customer" ? <CustomerMenuBar mobile/> :
                            auth.user.role === "Owner"    ? <AdminMenuBar mobile/> :
                            auth.user.role === "Delivery"    ? <DeliveryMenuBar mobile/> :
                            <DefaultMenuBar mobile/> //fallback
                        }
                    </div>
                </header>
                <div className="my-[50px] md:my-[60px] mx-10">
                    {children}
                </div>
            </div>
        </>
    )
}