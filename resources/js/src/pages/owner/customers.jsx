import HomeLayout from "@/layout/HomeLayout"
import { CircleQuestionMark } from "lucide-react"
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
import { format } from "date-fns"
export default function Customers({orders = [], customers}){
    console.log(customers)
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)]">Customers</div>
            <Separator/>
            {customers?.length == 0 ? (
                <Empty>
                    <EmptyHeader className={"scale-120"}>
                        <EmptyMedia variant="icon">
                            <CircleQuestionMark/>
                        </EmptyMedia>
                        <EmptyTitle>No Customers</EmptyTitle>
                        <EmptyDescription>No customers found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                customers.map((record, index) => (
                    <div key={`No ${index}`}>
                        <div className="w-full min-h-10 flex item-center text-[var(--forest-green)] bg-[var(--mint-cream)] rounded-sm my-3">
                            <div className="flex items-center p-2 text-2xl font-bold mr-4">{index+1}</div>
                            <div className="flex flex-col py-2 flex-2">
                                <p className="font-bold text-lg">Customer Name: <span className="font-normal">{record?.name}</span></p>
                                <p className="font-bold text-lg">Email: <span className="font-normal">{record?.email}</span></p>
                                <p className="font-bold text-lg">Verified Email: <span className="font-normal">{record?.email_verified_at ? format(new Date(record?.email_verified_at), "MMM dd, yyyy, h:mm a") : "No" }</span></p>
                            </div>
                            <div className="flex flex-col py-2 flex-2">
                                <p className="font-bold text-lg">Total Delivered Orders: <span className="font-normal">{record?.delivered_orders_count}</span></p>
                                <p className="font-bold text-lg">Total Paid Orders: <span className="font-normal">{record?.paid_orders_count}</span></p>
                                <p className="font-bold text-lg">Total Cancelled Orders: <span className="font-normal">{record?.cancelled_orders_count}</span></p>
                            </div>
                            <div className="flex items-center me-2">
                                <Link href={`/owner/customers/${record.id}`}>
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
Customers.layout = page => <HomeLayout children={page}/>