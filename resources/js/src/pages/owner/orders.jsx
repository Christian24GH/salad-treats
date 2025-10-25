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
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"

export default function Orders({orders = []}){
    console.log(orders)
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)]">No. Orders</div>
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
                </Empty>
            ) : (
                orders.map((record, index) => (
                    <div key={`No ${index}`}>
                        <div className="w-full min-h-10 flex item-center text-[var(--forest-green)] bg-[var(--mint-cream)] rounded-sm my-3">
                            <div className="flex items-center p-2 text-2xl font-bold mr-4">{index+1}</div>
                            <div className="flex flex-col py-2 flex-2">
                                <p className="font-bold text-lg">Customer Name: <span className="font-normal">{record?.customer_name}</span></p>
                                <p className="font-bold text-lg">Order Status: <span className="font-normal">{record?.status}</span></p>
                                <p className="font-bold text-lg">Payment Status: <span className="font-normal">{`${record?.payment.payment_status} — ${record?.payment.payment_method}`}</span></p>
                            </div>
                            <div className="flex items-center me-2">
                                <Link href={`/owner/orders/${record.id}`}>
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
Orders.layout = page => <HomeLayout children={page}/>