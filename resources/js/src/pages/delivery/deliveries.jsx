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
import { Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"

export default function Delivery({deliveries}){
    console.log(deliveries)
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
                Delivery
            </div>
            <Separator/>
            {deliveries?.length == 0 ? (
                <Empty>
                    <EmptyHeader className={"scale-120"}>
                        <EmptyMedia variant="icon">
                            <FileQuestionIcon/>
                        </EmptyMedia>
                        <EmptyTitle>No Delivery Orders</EmptyTitle>
                        <EmptyDescription>No Delivery Orders found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
                
            ) : (
                deliveries.map((record, index) => (
                    <div key={`No ${index}`}>
                        <div className="w-full min-h-10 flex item-center text-[var(--forest-green)] bg-[var(--mint-cream)] rounded-sm my-3">
                            <div className="flex items-center p-2 text-2xl font-bold mr-4">{index+1}</div>
                            <div className="flex flex-col py-2 flex-2">
                                <p className="font-bold text-lg">Customer Name: <span className="font-normal">{record?.order.customer_name}</span></p>
                                <p className="font-bold text-lg">Order Status: <span className="font-normal">{record?.status}</span></p>
                                <p className="font-bold text-lg">Payment Status: <span className="font-normal">{`${record?.order.payment.payment_status} — ${record?.order.payment.payment_method}` }</span></p>
                            </div>
                            <div className="flex items-center me-2">
                                <Link href={`/d/delivery/${record.id}`}>
                                    <Button className="bg-[var(--forest-green)] text-lg lato-regular-italic">
                                        View Full Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <Separator />
                    </div>
                ))
            )}
        </>
    )
}
Delivery.layout = page => <HomeLayout children={page}/>