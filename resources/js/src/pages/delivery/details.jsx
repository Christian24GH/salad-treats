import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft, MapPin, Salad, Loader2 } from "lucide-react"
import { Link, router } from "@inertiajs/react"
import { useState } from "react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import axios from "../../../bootstrap"

export default function DeliveryDetails({delivery}){
    console.log(delivery)
    
    const [loading, setLoading] = useState(false);

    //Implement the Mark as Delivered for GCASH, Mark as Paid and delivered for Cash on Delivery, also fix the buttons
    
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
                <Button variant="ghost" className="!size-fit !p-0" onClick={()=> router.visit('/d/deliveries')}>
                    <ChevronLeft className="mr-5 !size-10"/>
                </Button>
                <span className="">Delivery Details</span>
            </div>
            <div className="w-full h-auto border-1 rounded-sm bg-[var(--mint-cream)] text-[var(--dark-green)]">
                <div className="flex items-center py-4 px-4 text-2xl lato-bold">
                    <MapPin className="font-bold mr-5"/>
                    <span className="font-bold">Delivery Address</span>
                </div>
                <Separator/>
                <div className="w-full py-4 px-4 text-xl space-y-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                    <div className="w-full space-y-5 grid">
                        <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                            <div className="grid grid-cols-2">
                                <span>Customer Name</span><span>{delivery?.order?.customer_name}</span> 
                            </div>
                        </div>
                        <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                            <div className="grid grid-cols-2">
                                <span>Email</span><span>{delivery?.order?.email}</span> 
                            </div>
                        </div>
                        <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                            <div className="grid grid-cols-2">
                                <span>Address</span><span>{delivery?.order?.delivery_address}</span> 
                            </div>
                        </div>
                        <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                            <div className="grid grid-cols-2">
                                <span>Phone Number</span><span>{delivery?.order?.contact_number}</span> 
                            </div>
                        </div>
                    </div>
                    <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                        <div className="grid grid-cols-2">
                            <span>Additional Instructions</span><span>{delivery?.order?.delivery_instructions}</span> 
                        </div>
                    </div>
                </div>
                <Separator/>
                <div className="flex justify-center items-center py-4 px-4 text-2xl lato-bold gap-10">
                    <div>
                        <span className="font-normal mr-3">Payment Method: </span>
                        <span className="font-bold">{delivery?.order?.payment?.payment_method}</span>
                    </div>
                     <div>
                        <span className="font-normal mr-3">Payment Status: </span>
                        <span className="font-bold">{delivery?.order?.payment?.payment_status}</span>
                    </div>
                </div>
                <Separator/>
                <div className="w-full py-4 px-4 text-xl space-y-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
                    <div>
                        <span className="mr-4">Order ID: </span><span>{delivery?.order?.order_uuid}</span>
                    </div>
                    <div>
                        <p className="mr-4">Selected Delivery Date & Time </p>
                        <p className="lato-bold">{format(new Date(delivery?.order?.delivery_time), "MMM dd, yyyy, h:mm a")}</p>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 w-full">
                            <span className="lato-bold">Total Amount</span>
                            <span className="lato-bold text-3xl my-3 text-center">₱ {delivery?.order?.total_price}</span>
                        </div>
                    </div>
                </div>
                <Separator/>
                <div className="w-full flex justify-end p-4 gap-5">
              
                {(deliver.status === "Pending" && delivery?.order?.payment?.payment_status !== "Completed") && (
                <Button
                    onClick={async () => {
                    setLoading(true);
                    try {
                        if (delivery?.order?.payment?.payment_method === "GCash") {
                        await axios.post(`/d/deliveries/${delivery.id}/delivered`);
                        toast.success("Order marked as delivered!");
                        } else {
                        await axios.post(`/d/deliveries/${delivery.id}/delivered-paid`);
                        toast.success("Order marked as paid and delivered!");
                        }
                        router.visit("/d/deliveries");
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Failed to update order.");
                    } finally {
                        setLoading(false);
                    }
                    }}
                    disabled={loading}
                    className="min-w-40 min-h-15 text-xl lato-regular bg-[var(--soft-lime)]"
                >
                    {loading ? (
                    <>
                        <Loader2 className="mr-3 animate-spin" /> Loading
                    </>
                    ) : delivery?.order?.payment?.payment_method === "GCash" ? (
                    "Mark as Delivered"
                    ) : (
                    "Mark as Paid and Delivered"
                    )}
                </Button>
                )}

                </div>

            </div>
            
        </>
    )
}
DeliveryDetails.layout = page => <HomeLayout children={page}/>