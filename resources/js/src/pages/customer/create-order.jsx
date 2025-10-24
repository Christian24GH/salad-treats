import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft, ShoppingCartIcon, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm, Controller } from "react-hook-form"
import { usePage, router } from "@inertiajs/react"
import { toast } from "sonner"
import axios from "../../../bootstrap"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CreateOrder() {
    const { auth } = usePage().props
    //console.log(auth)
    const { cart, computeItemTotal, computeCartTotal, setCartOpen, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            customer_name: auth?.user?.name,
            contact_number: "",
            delivery_address: "",
            delivery_time: "",
            delivery_instructions: "",
            payment_method: "",
        },
    })

    const handleCheckout = () => {
        setOpenDialog(true)
    }

    const onSubmit = async (data) => {
        setLoading(true)
        const orderData = {
            ...data,
            items: cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                instructions: item.instructions || "",
                extras: item.extras?.map((ex) => ({
                    product_id: ex.id,
                    quantity: ex.quantity || 1,
                })) || [],
            })),
        }

        //console.log("Submitting order:", orderData)

        // Simulate API call
        await axios.post('/customer/orders/place', orderData)
            .then((response)=>{
                if(response.status == 201){
                    clearCart()
                    toast.success("Order submitted successfully")
                    setOpenDialog(false)
                    reset()
                    router.visit('/customer/orders')
                }
            })
            .catch((error)=>{
                if(error.status === 500){
                    toast.warning(error.response.data.message)
                }
                console.log(error)
            })
            .finally(()=>{
                setLoading(false)
            })
    }

    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
                <Link href={"/customer/orders"}>
                    <ChevronLeft className="mr-5 h-full cursor-pointer" />
                </Link>
                <span>Checkout</span>
            </div>

            <Separator />

            <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl lato-bold text-[var(--dark-green)] py-5">
                        Review Cart
                    </h1>
                    <Button
                        onClick={() => setCartOpen(true)}
                        className="flex gap-2 bg-[var(--forest-green)] text-xl"
                    >
                        <ShoppingCartIcon className="!size-6" />
                        Cart ({cart.length})
                    </Button>
                </div>

                <Separator />

                <div className="mt-4 space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-muted-foreground text-center text-lg py-6">
                            Your cart is empty.
                        </p>
                    ) : (
                        cart.map((item, i) => (
                            <div
                                key={i}
                                className="border rounded-md p-4 bg-white shadow-sm"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl lato-bold">
                                            {item.product_name}
                                        </h3>
                                        <p className="text-lg">
                                            Quantity:{" "}
                                            {`₱${item.price.toFixed(2)} × ${item.quantity}`}
                                        </p>
                                    </div>
                                    <span className="text-[var(--forest-green)] lato-bold text-xl">
                                        ₱{computeItemTotal(item).toFixed(2)}
                                    </span>
                                </div>

                                {item.extras?.length > 0 && (
                                    <div className="mt-2 text-lg">
                                        <p className="font-semibold">Extras:</p>
                                        <ul className="list-disc list-inside">
                                            {item.extras.map((extra, idx) => (
                                                <li key={idx}>
                                                    {extra.product_name} — ₱{extra.price} ×{" "}
                                                    {extra.quantity || 1}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <>
                        <Separator className="my-6" />
                        <div className="flex flex-col justify-end gap-4">
                            <div className="space-y-1 text-right sm:text-left">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal &nbsp;</span>
                                    <span>₱{computeCartTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-2xl">
                                    <span>Total &nbsp;</span>
                                    <span>₱{computeCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                disabled={loading}
                                onClick={handleCheckout}
                                className="bg-[var(--forest-green)] text-white w-full sm:w-auto mt-5 sm:mt-0 text-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        Processing...
                                    </div>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </div>

           
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[500px] max-h-screen overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Enter Delivery Details</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldSet>
                            <FieldGroup>
                                
                                <Field>
                                    <FieldLabel className="text-lg">Customer Name</FieldLabel>
                                    <Input
                                        defaultValues={auth?.user?.name}
                                        className={"text-lg !h-16"}
                                        placeholder="e.g. John Doe"
                                        {...register("customer_name", {
                                            required: "Customer name is required",
                                            minLength: {
                                                value: 3,
                                                message: "Name must be at least 3 characters",
                                            },
                                        })}
                                    />
                                    {errors.customer_name && (
                                        <FieldDescription className="text-red-500">
                                            {errors.customer_name.message}
                                        </FieldDescription>
                                    )}
                                </Field>
                                
                                <Field>
                                    <FieldLabel  className={"text-lg"}>Payment Method</FieldLabel>
                                    <Controller
                                        name="payment_method"
                                        control={control}
                                        rules={{ required: "Payment method is required!" }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full !h-16 !text-xl">
                                                    <SelectValue placeholder="Select Payment Method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem className={"!h-16 !text-xl"} value="Cash on Delivery">Cash on Delivery</SelectItem>
                                                    <SelectItem className={"!h-16 !text-xl"} value="GCash">GCash</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    </Field>
                                    {errors.payment_method && (
                                        <FieldDescription className="text-red-500">
                                            {errors.payment_method.message}
                                        </FieldDescription>
                                    )}
                                <Field>
                                    <FieldLabel className="text-lg">Contact Number</FieldLabel>
                                    <Input
                                        placeholder="e.g. 09123456789"
                                        className={"text-lg !h-16"}
                                        {...register("contact_number", {
                                            required: "Contact number is required",
                                            pattern: {
                                                value: /^09\d{9}$/,
                                                message:
                                                    "Please enter a valid 11-digit PH number (e.g., 09123456789)",
                                            },
                                        })}
                                    />
                                    {errors.contact_number && (
                                        <FieldDescription className="text-red-500">
                                            {errors.contact_number.message}
                                        </FieldDescription>
                                    )}
                                </Field>

                                
                                <Field>
                                    <FieldLabel className="text-lg">Delivery Address</FieldLabel>
                                    <Textarea
                                        className={"text-lg !h-16"}
                                        placeholder="Enter your full address"
                                        {...register("delivery_address", {
                                            required: "Delivery address is required",
                                        })}
                                    />
                                    {errors.delivery_address && (
                                        <FieldDescription className="text-red-500">
                                            {errors.delivery_address.message}
                                        </FieldDescription>
                                    )}
                                </Field>

                                
                                <Field>
                                    <FieldLabel className="text-lg">Preferred Delivery Time</FieldLabel>
                                    <Input
                                        className={"text-lg !h-16"}
                                        type="datetime-local"
                                        {...register("delivery_time", {
                                            required: "Please select a delivery time",
                                        })}
                                    />
                                    {errors.delivery_time && (
                                        <FieldDescription className="text-red-500">
                                            {errors.delivery_time.message}
                                        </FieldDescription>
                                    )}
                                </Field>

                                
                                <Field>
                                    <FieldLabel className="text-lg">Delivery Instructions</FieldLabel>
                                    <Textarea
                                        className={"text-lg !min-h-16"}
                                        placeholder="Optional (e.g., Leave at front gate)"
                                        {...register("delivery_instructions")}
                                    />
                                    {errors.delivery_instructions && (
                                        <FieldDescription className="text-red-500">
                                            {errors.delivery_instructions.message}
                                        </FieldDescription>
                                    )}
                                </Field>

                            </FieldGroup>
                        </FieldSet>

                        <DialogFooter className="mt-4 text-lg">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenDialog(false)}
                                disabled={loading}
                                className="text-lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[var(--forest-green)] text-white text-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                        Submitting...
                                    </div>
                                ) : (
                                    "Confirm Order"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

CreateOrder.layout = (page) => <HomeLayout children={page} />
