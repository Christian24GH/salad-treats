import { useEffect } from "react";
import axios from "axios";

const FormLayout = ({children}) => {

    //sets csrf token so all request doest get rejected by laravel e.g 419 error
    useEffect(() => {
        axios.get("/sanctum/csrf-cookie");
    }, []);
    return (
        <div className="w-full h-full">
            <header className="h-[50px] w-full bg-[var(--forest-green)] flex items-center px-4 fixed top-0">
                <div className="flex items-center gap-x-3">
                <div className="w-[44px] h-[44px] rounded-full overflow-hidden flex items-center justify-center bg-white">
                    <img
                    src="/assets/logo.jfif"
                    alt="Logo"
                    className="w-full h-full object-cover scale-110"
                    />
                </div>
                <h1 className="birthstone-regular text-3xl font-bold text-white cursor-pointer select-none">
                    Salad Fruits
                </h1>
                </div>
            </header>
            {children}
        </div>
    )
}

export default FormLayout