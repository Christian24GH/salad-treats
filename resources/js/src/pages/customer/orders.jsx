import HomeLayout from "@/layout/HomeLayout"
import { FileQuestionIcon, PlusCircle, XCircle } from "lucide-react"
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

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel
} from "@/components/ui/field"

import { Textarea } from "@/components/ui/textarea"

import { Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import axios from "../../../bootstrap"
import { toast } from "sonner"
import { useForm } from "react-hook-form"


export default function Orders({orders = []}){
    console.log(orders)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm()

    const handleCancel = async (data) => {
        if(!data.order_uuid){
            toast.warning("Missing order uuid, please reload the page");
            return
        }

        await axios.post(`/customer/orders/cancel/${data.order_uuid}`, {
                reason: data.cancellation_reason
            })
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

    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
                Orders
                
                <div className="flex gap-3">
                    <Link href="/customer/menu">
                        <Button className={"bg-[var(--forest-green)] flex gap-2 text-lg p-1"}>
                            <PlusCircle className="!size-6"/>
                            Add Order
                        </Button>
                    </Link>
                    <Link href="/customer/orders/cancelled">
                        <Button className={"bg-[var(--forest-green)] flex gap-2 text-lg p-1"}>
                            <XCircle className="!size-6"/>
                            Cancelled Orders
                        </Button>
                    </Link>
                </div>
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
                            <p className="font-bold text-lg">Status: <span className="font-normal">{record?.status}</span></p>
                        </div>
                        <div className="flex flex-col items-center justify-center me-2 gap-2">
                            <Link href={`/customer/orders/${record.id}`}>
                                <Button className="bg-[var(--forest-green)] text-lg lato-regular-italic max-w-40">
                                    View Full Details
                                </Button>
                            </Link>
                            {(record.payment.payment_status !== "Completed" && record.status === "Pending") && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button 
                                            variant={"destructive"}
                                            className="text-lg lato-regular-italic w-full max-w-40">
                                            Cancel Order
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <form onSubmit={handleSubmit(handleCancel)}>
                                        <input {...register('order_uuid', {required:true})} type="hidden" value={record?.order_uuid} />
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Cancel my order</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        
                                        <Field className="my-5">
                                            <FieldLabel>Reason for cancellation</FieldLabel>
                                            <Textarea
                                                className={"!text-lg !min-h-16"}
                                                placeholder="Type reason here"
                                                {...register("cancellation_reason", {
                                                    required: "You need to provide your reason here",
                                                    minLength: {
                                                        value: 5,
                                                        message: "Must be more than 5 characters",
                                                    },
                                                })}/>
                                            {errors.cancellation_reason && <FieldError>{errors.cancellation_reason.message}</FieldError>}
                                        </Field>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <Button type="Submit" variant={"destructive"} className={"bg-red-500"}>
                                            Cancel Order
                                        </Button>
                                        </AlertDialogFooter>
                                        </form>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </div>
                ))
            )}
        </>
    )
}
Orders.layout = page => <HomeLayout children={page}/>