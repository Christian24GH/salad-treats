import HomeLayout from "@/layout/HomeLayout"
import { CircleQuestionMark, Star } from "lucide-react"
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

export default function Feedback({ feedback = [] }) {
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
                Customer Feedbacks
                <Link href="/customer/feedback/write">
                    <Button className="bg-[var(--forest-green)] text-lg">
                        Write a Feedback
                    </Button>
                </Link>
            </div>

            <Separator/>

            {feedback.length === 0 ? (
                <Empty>
                    <EmptyHeader className="scale-120">
                        <EmptyMedia variant="icon">
                            <CircleQuestionMark />
                        </EmptyMedia>
                        <EmptyTitle>No Feedbacks</EmptyTitle>
                        <EmptyDescription>No feedback found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {feedback.map((record, index) => (
                        <div key={index} className="bg-white shadow rounded-sm p-4 flex flex-col justify-between overflow-auto h-40">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{record.customer_name}</h3>
                                <div className="text-lg mb-2 flex items-center gap-2">
                                    Rating: 
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(star => (
                                            <Star
                                                key={star}
                                                size={20}
                                                className={star <= record.rating ? "text-yellow-400" : "text-gray-300"}
                                                fill={star <= record.rating ? "currentColor" : "none"}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gray-700">{record.comment}</p>
                            </div>
                            {record.order_id && (
                                <Button
                                    onClick={() => router.visit(`/customer/orders/${record.order_id}`)}
                                    className="mt-3 bg-[var(--soft-lime)] text-sm"
                                >
                                    View Order #{record.order_id}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

Feedback.layout = page => <HomeLayout>{page}</HomeLayout>
