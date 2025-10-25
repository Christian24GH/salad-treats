import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft, Loader2, Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { usePage, router } from "@inertiajs/react"
import { toast } from "sonner"
import axios from "../../../bootstrap"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldGroup,
    FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CreateFeedback({ order }) {
    const { auth } = usePage().props
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            order_id: "",
            rating: 0,
            comment: "",
        }
    })

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const payload = {
                ...data,
                user_id: auth.user.id,
                customer_name: auth.user.name,
            }

            await axios.post("/customer/feedback/store", payload)
            toast.success("Feedback submitted successfully!")
            reset()
            router.visit("/customer/feedback")
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to submit feedback.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
                <Link href={"/customer/orders"}>
                    <ChevronLeft className="mr-5 h-full cursor-pointer" />
                </Link>
                <span>Write Feedback</span>
            </div>

            <Separator className="mb-5" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
                {/* Order Select 
                <Field>
                    <FieldLabel>Order</FieldLabel>
                    <Controller
                        control={control}
                        name="order_id"
                        render={({ field }) => (
                            <Select {...field}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your delivered order" />
                                </SelectTrigger>
                                <SelectContent>
                                    {order.length > 0 ?order.map((o) => (
                                        <SelectItem key={o.id} value={o.id}>
                                            {o.id} - {o.status}
                                        </SelectItem>
                                    )) : (
                                        <SelectItem>You have no received orders</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.order_id && <p className="text-red-500 text-sm">{errors.order_id.message}</p>}
                </Field>
                */}
                {/* Star Rating */}
                <Field>
                    <FieldLabel>Rating</FieldLabel>
                    <Controller
                        control={control}
                        name="rating"
                        rules={{ required: "Please give a rating" }}
                        render={({ field }) => (
                            <div className="flex space-x-1">
                                {[1,2,3,4,5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => field.onChange(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            size={28}
                                            className={star <= field.value ? "text-yellow-400 fill-amber-300" : "text-gray-300"}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    />
                    {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
                </Field>

                {/* Comment */}
                <Field>
                    <FieldLabel>Comment</FieldLabel>
                    <Textarea
                        placeholder="Write your feedback here..."
                        {...register("comment", { required: "Comment is required" })}
                    />
                    {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
                </Field>

                <Button type="submit" className="bg-[var(--soft-lime)]" disabled={loading}>
                    {loading ? <><Loader2 className="animate-spin mr-2" />Submitting</> : "Submit Feedback"}
                </Button>
            </form>
        </>
    )
}

CreateFeedback.layout = (page) => <HomeLayout>{page}</HomeLayout>
