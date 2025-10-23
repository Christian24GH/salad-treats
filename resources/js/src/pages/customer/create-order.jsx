import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft, ShoppingCartIcon, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useState } from "react"

export default function CreateOrder() {
    const { cart, computeItemTotal, computeCartTotal, setCartOpen } = useCart()
    const [loading, setLoading] = useState(false)

    const handleCheckout = () => {
        setLoading(true)
        // Simulate checkout request
        setTimeout(() => {
            setLoading(false)
            console.log("Order submitted", cart)
        }, 1500)
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
                            <div key={i} className="border rounded-md p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl lato-bold">{item.product_name}</h3>
                                        <p className="text-lg">
                                            Quantity:  {`₱${item.price.toFixed(2)} × ${item.quantity}`}
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
                                                    {extra.product_name} — ₱{extra.price} × {extra.quantity || 1}
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
        </>
    )
}

CreateOrder.layout = (page) => <HomeLayout children={page} />
