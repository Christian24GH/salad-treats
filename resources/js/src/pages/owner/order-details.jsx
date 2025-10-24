import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft, MapPin, Salad } from "lucide-react"
import { Link, router } from "@inertiajs/react"
import { useState } from "react"
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
export default function OrderDetails({order}){
    const [note, setNote] = useState("")
    
    const AcceptOrder = async () => {
        console.log('Clicked')
        const payload = {
            'uuid': order?.uuid,
        }
        await axios.post('/owner/orders/approve', payload)
            .then(()=>{
                toast.success('Order moved to tracker', {position:"top-center"})
                router.visit('/owner/orders') //navigate
            })
    }

    const RejectOrder = async () => {
        try {
            const payload = {
                uuid: order?.uuid,
                note: note.trim(),
            }

            await axios.post("/owner/orders/reject", payload)

            toast.success("Order rejected", { position: "top-center" })
            router.visit("/owner/orders") // navigate back
        } catch (err) {
            console.error(err)
            toast.error("Failed to reject order", { position: "top-center" })
        }
    }


    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
                <Button variant="ghost" className="!size-fit !p-0" onClick={()=> window.history.back()}>
                    <ChevronLeft className="mr-5 !size-10"/>
                </Button>
                <span className="">Order Details</span>
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
                                <span>Customer Name</span><span>{order?.user?.name}</span> 
                            </div>
                        </div>
                        <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                            <div className="grid grid-cols-2">
                                <span>Email</span><span>{order?.user?.email}</span> 
                            </div>
                        </div>
                        <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                            <div className="grid grid-cols-2">
                                <span>Region</span><span>{order?.user?.address?.region}</span> 
                            </div>
                        </div>
                        <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                            <div className="grid grid-cols-2">
                                <span>Phone Number</span><span>{order?.user?.phone_number}</span> 
                            </div>
                        </div>
                    </div>
                    <div className="row-span-1 sm:w-full md:w-full lg:w-3/4">
                        <div className="grid grid-cols-2">
                            <span>Address</span><span>{order?.user?.address?.full_address}</span> 
                        </div>
                    </div>
                </div>
                <Separator/>
                <div className="flex items-center py-4 px-4 text-2xl lato-bold">
                    <Salad className="font-bold mr-5"/>
                    <span className="font-bold">Order</span>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="w-full border text-lg lato-regular">
                            <th className="p-2 text-inherit">No.</th>
                            <th className="p-2 text-inherit">Item</th>
                            <th className="p-2 text-inherit">Qty.</th>
                            <th className="p-2 text-inherit">Unit Price</th>
                            <th className="p-2 text-inherit">Subtotal</th>
                            <th className="p-2 text-inherit">Order Data & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order?.order_details?.map((item, index) => (
                        <tr className="w-full border text-lg lato-regular">
                            <td className="px-2 align-top lato-bold text-2xl">{index + 1}</td>
                            <td className="flex p-2 align-top">
                                <div className="size-40 !rounded-lg">
                                    <img className="w-full h-full object-scale-down rounded-lg" src="/assets/salad-shrimp.jfif" alt="" />
                                </div>
                                <div>
                                    <p className="text-lg">{item?.product?.name}</p>
                                    <p className="font-bold">Notes:</p>
                                    <p className="font-normal">{item?.notes}</p>
                                </div>
                            </td>
                            <td className="align-top">{item?.quantity}</td>
                            <td className="align-top">P {item?.price}</td>
                            <td className="align-top">P {item?.subtotal}</td>
                            <td className="align-top">{item?.order_date} {item?.order_time}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <Separator/>
                <div className="flex justify-center items-center py-4 px-4 text-2xl lato-bold gap-10">
                    <div>
                        <span className="font-normal mr-3">Order Type: </span>
                        <span className="font-bold">Delivery</span>
                    </div>
                     <div>
                        <span className="font-normal mr-3">Payment Status: </span>
                        <span className="font-bold">UNPAID</span>
                    </div>
                </div>
                <Separator/>
                <div className="w-full py-4 px-4 text-xl space-y-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
                    <div>
                        <span className="mr-4">Order ID: </span><span>{order?.order_uuid}</span>
                    </div>
                    <div>
                        <p className="mr-4">Selected Delivery Date & Time </p>
                        <p className="lato-bold">{order?.order_date} {order?.order_time}</p>
                    </div>
                    <div>
                        <div className="grid grid-cols-2 w-full mb-3">
                            <span>Total Item(s)</span>
                            <span className="lato-bold">{order?.order_details?.length}</span>
                        </div>
                        <div className="grid grid-cols-2 w-full">
                            <span className="lato-bold">Total Amount</span>
                            <span className="lato-bold">P{order?.order_details?.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <Separator/>
                <div className="w-full flex justify-end p-4 gap-5">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="min-w-40 min-h-15 bg-red-600 text-xl lato-regular">Reject</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>

                             <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason / Notes
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter reason for rejection..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <AlertDialogFooter>
                                <AlertDialogCancel className={"text-xl lato-regular"}>Cancel</AlertDialogCancel>
                                <AlertDialogAction className={"bg-red-600  text-xl lato-regular"} onClick={RejectOrder}>Reject</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    
                    
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="min-w-40 min-h-15 bg-[var(--forest-green)] text-xl lato-regular">Accept</Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                            
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className={"text-xl lato-regular"}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={AcceptOrder} className={"bg-[var(--forest-green)] text-xl lato-regular"}>Accept</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            
        </>
    )
}
OrderDetails.layout = page => <HomeLayout children={page}/>