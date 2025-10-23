import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"

import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"

export default function ProductDetails(product){
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
                <Link href={"/customer/menu"}>
                    <ChevronLeft className="mr-5 h-full"/>
                </Link>
                <span className=""><i class="fa fa-product-hunt" aria-hidden="true"></i> Details</span>
            </div>
            
        </>
    )
}
ProductDetails.layout = page => <HomeLayout children={page}/>