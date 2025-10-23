import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"

import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"

export default function Feedback({ feedback = [] }){
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)]">Feedbacks</div>
            <Separator/>
            {!feedback?.length == 0 ? (
                <Empty>
                    <EmptyHeader className={"scale-120"}>
                        <EmptyMedia variant="icon">
                            <FileQuestionIcon/>
                        </EmptyMedia>
                        <EmptyTitle>No feedbacks</EmptyTitle>
                        <EmptyDescription>No feedbacks found</EmptyDescription>
                    </EmptyHeader>
                    {/**
                        <EmptyContent className={"scale-120"}>
                            <Button className={"bg-[var(--forest-green)]"}>Order Now</Button>
                        </EmptyContent>
                     */}
                </Empty>
            ) : (
                feedback.map((record, index) => (
                    <div key={`No ${index}`} className="w-full min-h-10 flex item-center text-[var(--forest-green)] bg-[var(--mint-cream)] rounded-sm my-3">
                        <div className="flex items-center p-2 text-2xl font-bold mr-4">{index+1}</div>
                        <div className="flex flex-col py-2 flex-2">
                            <p className="font-bold text-lg">Customer Name: <span className="font-normal">{record?.customer_name}</span></p>
                            <p className="font-bold text-lg">Subject: <span className="font-normal">{record?.subject}</span></p>
                        </div>
                        <div className="flex items-center me-2">
                            <Link href={`/owner/feedback${feedback.id}`} asChild>
                                <Button className="bg-[var(--forest-green)] text-lg lato-regular-italic">
                                    Read
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </>
    )
}
Feedback.layout = page => <HomeLayout children={page}/>