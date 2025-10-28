import HomeLayout from "@/layout/HomeLayout";
import { CircleQuestionMark, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Feedback({ feedback = [] }) {
  return (
    <>
      <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
        Your Feedbacks
        <Link href="/customer/feedback/write">
          <Button className="bg-[var(--forest-green)] text-lg px-6">
            Write a Feedback
          </Button>
        </Link>
      </div>

      <Separator />

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
        <div className="mt-4">
          
          <div className="hidden md:grid grid-cols-12 bg-[var(--forest-green)] text-white font-semibold py-3 px-4 rounded-t-md">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-3">Customer Name</div>
            <div className="col-span-2">Rating</div>
            <div className="col-span-5">Comment</div>
          </div>

          <div className="divide-y">
            {feedback.map((record, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 items-center bg-[var(--mint-cream)] rounded-md my-2 px-4 py-3 hover:bg-green-50 transition-colors"
              >
               
                <div className="col-span-1 text-lg font-bold text-center mb-2 md:mb-0">
                  {index + 1}
                </div>

                
                <div className="col-span-3 text-lg font-semibold text-[var(--forest-green)] mb-2 md:mb-0">
                  {record.customer_name}
                </div>

                
                <div className="col-span-2 flex items-center gap-1 mb-2 md:mb-0">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= record.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

               
                <div className="col-span-5 text-gray-700 italic text-lg mb-2 md:mb-0 truncate md:whitespace-normal">
                  “{record.comment}”
                </div>

                
                <div className="col-span-1 flex justify-center">
                  {record.order_id ? (
                    <Button
                      onClick={() =>
                        router.visit(`/customer/orders/${record.order_id}`)
                      }
                      className="bg-[var(--soft-lime)] hover:bg-lime-200 text-[var(--forest-green)] text-md font-medium"
                    >
                      View
                    </Button>
                  ) : (
                    <span className="text-gray-400 italic">N/A</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

Feedback.layout = (page) => <HomeLayout>{page}</HomeLayout>;
