import { useEffect } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react"
const FormLayout = ({children}) => {
    //sets csrf token so all request doest get rejected by laravel e.g 419 error
    useEffect(() => {
        axios.get("/sanctum/csrf-cookie");
    }, []);
    return (
        <div className="w-full h-full">
            <header className="h-[50px] md:h-[60px] w-full bg-[var(--forest-green)] flex items-center px-4 fixed top-0 z-50">
                <Link className="flex items-center gap-x-3" href="/">
                <div className="w-[44px] h-[44px] rounded-full overflow-hidden flex items-center justify-center bg-white">
                    <img
                    src="/assets/logo.jfif"
                    alt="Logo"
                    className="w-full h-full object-cover scale-150"
                    />
                </div>
                <h1 className="birthstone-regular text-3xl font-bold text-white cursor-pointer select-none">
                    Salad Treats
                </h1>
                </Link>
            </header>
            <div className="my-[50px] md:my-[60px]">
                {children}
            </div>
        </div>
    )
}

export default FormLayout