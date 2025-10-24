import HomeLayout from "@/layout/HomeLayout"
import { FileQuestionIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

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


import { Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import axios from "../../../bootstrap"
import { toast } from "sonner"
export default function Orders({orders = []}){

    const handleCancel = async (uuid) => {
        await axios.post(`/customer/orders/cancel/${uuid}`)
            .then((response)=>{
                if(response.status == 201){
                    toast.success("You have cancelled an order")
                }
                window.location.reload()
            })
            .catch((error)=>{
                if(error.status == 400){
                    toast.error(error?.response.data.message)
                    //window.location.reload()
                }
        })
    }

    const handlePayment = () => {

    }
    
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
                Orders

                <Link href="/customer/menu" asChild>
                    <Button className={"bg-[var(--forest-green)]"}>Add Order</Button>
                </Link>
            </div>
            <Separator/>
            {orders?.length == 0 ? (
                <Empty>
                    <EmptyHeader className={"scale-120"}>
                        <EmptyMedia variant="icon">
                            <FileQuestionIcon/>
                        </EmptyMedia>
                        <EmptyTitle>No Orders</EmptyTitle>
                        <EmptyDescription>No orders found</EmptyDescription>
                    </EmptyHeader>
                
                    <EmptyContent className={"scale-120"}>
                        <Link href="/customer/menu">
                            <Button className={"bg-[var(--forest-green)]"}>Order Now</Button>
                        </Link>
                    </EmptyContent>
                </Empty>
            ) : (
                orders.map((record, index) => (
                    <div key={`No ${index}`} className="w-full min-h-10 flex item-center text-[var(--forest-green)] bg-[var(--mint-cream)] rounded-sm my-3">
                        <div className="flex items-center p-2 text-2xl font-bold mr-4">{index+1}</div>
                        <div className="flex flex-col py-2 flex-2">
                            <p className="font-bold text-lg">Customer Name: <span className="font-normal">{record?.customer_name}</span></p>
                            <p className="font-bold text-lg">Order ID: <span className="font-normal">{record?.order_uuid}</span></p>
                        </div>
                        <div className="flex items-center me-2 gap-2">
                            <Link asChild>
                                <Button className="bg-[var(--forest-green)] text-lg lato-regular-italic">
                                    View Full Details
                                </Button>
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        className="text-lg lato-regular-italic">
                                        Pay Online
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={()=>{
                                            handleCancel(record.order_uuid)
                                        }}
                                    >
                                        Pay
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant={"destructive"}
                                        className="text-lg lato-regular-italic">
                                        Cancel
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction variant={"destructive"} className={"bg-red-500"}
                                        onClick={()=>{
                                            handlePayment(record.order_uuid)
                                        }}
                                    >
                                        Cancel Order
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))
            )}
        </>
    )
}
Orders.layout = page => <HomeLayout children={page}/>