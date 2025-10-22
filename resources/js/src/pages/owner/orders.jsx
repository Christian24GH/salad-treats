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
import { Button } from "@/components/ui/button"
export default function Orders({orders = []}){
    return (
        <div className="">
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)]">No. Orders</div>
            <Separator/>
            {!orders?.length == 0 ? (
                <Empty>
                    <EmptyHeader className={"scale-120"}>
                        <EmptyMedia variant="icon">
                            <FileQuestionIcon/>
                        </EmptyMedia>
                        <EmptyTitle>No Orders</EmptyTitle>
                        <EmptyDescription>No orders found</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className={"scale-120"}>
                        <Button className={"bg-[var(--forest-green)]"}>Order Now</Button>
                    </EmptyContent>
                </Empty>
            ) : orders.map((record, index) => {
                return (
                    <div></div>
                )
            })}
        </div>
    )
}
Orders.layout = page => <HomeLayout children={page}/>