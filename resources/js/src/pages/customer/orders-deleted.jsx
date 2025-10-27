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


export default function CancelledOrders({orders = []}){
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
                Cancelled Orders
                <Link href="/customer/orders">
                    <Button className={"bg-[var(--forest-green)] flex gap-2 text-lg"}>
                        Orders
                    </Button>
                </Link>
            </div>
            <Separator/>
            {orders?.length == 0 ? (
                <Empty>
                    <EmptyHeader className={"scale-120"}>
                        <EmptyMedia variant="icon">
                            <FileQuestionIcon/>
                        </EmptyMedia>
                        <EmptyTitle>No Cancelled Orders</EmptyTitle>
                        <EmptyDescription>No cancelled orders found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                orders.map((record, index) => (
                    <div key={`No ${index}`} className="w-full min-h-10 flex flex-col item-center text-[var(--forest-green)] bg-[var(--mint-cream)] rounded-sm my-3">
                        <div className="flex item-center w-full">
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
                            </div>
                        </div>
                        <Separator/>
                        <div className="w-full p-2">
                            <h6 className="font-bold text-lg">Reason for cancellation</h6>
                            <p className="w-full break-all">{record?.cancellation_reason}</p>
                        </div>
                    </div>
                ))
            )}
        </>
    )
}
CancelledOrders.layout = page => <HomeLayout children={page}/>