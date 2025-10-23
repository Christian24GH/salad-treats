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
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
                Orders

                <Link href="/customer/orders/create" asChild>
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
                        <Link href="/customer/orders/create">
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
                        <div className="flex items-center me-2">
                            <Link asChild>
                                <Button className="bg-[var(--forest-green)] text-lg lato-regular-italic">
                                    View Full Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </>
    )
}
Orders.layout = page => <HomeLayout children={page}/>