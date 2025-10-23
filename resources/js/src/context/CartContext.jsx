import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    
    const normalizeProduct = (p) => {
        const product = {
            ...p,
            price: Number(p.price || 0),
            quantity: Number(p.quantity) || 1,
            instructions: p.instructions || "",
            extras: (p.extras || []).map((e) => ({
                ...e,
                price: Number(e.price || 0),
                quantity: Number(e.quantity) || 1,
                // keep product_name/id if they exist
            })),
        };
        return product;
    };

    
    const computeItemTotal = (item) => {
        if (!item) return 0;
        const price = Number(item.price || 0);
        const qty = Number(item.quantity || 1);

        const extrasTotal =
            (item.extras || []).reduce((sum, e) => {
                const ePrice = Number(e.price || 0);
                const eQty = Number(e.quantity || 1);
                return sum + ePrice * eQty;
            }, 0) || 0;

        // extrasTotal is per-unit extras cost (if extras quantities are per unit)
        // item total = (base price + extrasTotal) * item quantity
        const total = (price + extrasTotal) * qty;

        
        return Number(total);
    };

    const computeCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + computeItemTotal(item), 0);
        return Number(total);
    };

    
    const addToCart = (rawProduct) => {
        const product = normalizeProduct(rawProduct);

        setCart((prev) => {
            if (!product || !product.id) {
                console.error("Invalid product passed to addToCart:", product);
                toast.error("Failed to add product — invalid item.");
                return prev;
            }

            const existingIndex = prev.findIndex((item) => item.id === product.id);

            if (existingIndex !== -1) {
                
                const newCart = [...prev];
                
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    ...product,
                };
                toast.info(`${product.product_name} cart updated`);
                return newCart;
            }

            toast.success(`${product.product_name} added to cart!`);
            return [...prev, product];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => {
            const removedItem = prev.find((item) => item.id === id);
            if (removedItem) toast.warning(`${removedItem.product_name} removed from cart.`);
            return prev.filter((item) => item.id !== id);
        });
    };

    const updateQuantity = (id, qty) => {
        const nQty = Math.max(1, Number(qty) || 1);
        setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: nQty } : item)));
    };

    const clearCart = () => {
        setCart([]);
        toast.warning("Cart cleared.");
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        computeItemTotal,
        computeCartTotal,
        setCartOpen,
    };

    
    return (
        <CartContext.Provider value={value}>
            {children}

            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col">
                    <SheetHeader>
                        <SheetTitle>Your Cart</SheetTitle>
                        <SheetDescription>Manage your selected items below.</SheetDescription>
                    </SheetHeader>

                    <Separator className="my-3" />

                    <div className="flex-1 overflow-y-auto px-2 space-y-4">
                        {cart.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
                        ) : (
                            cart.map((item, i) => (
                                <div key={i} className="bg-white space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg lato-bold">{item.product_name}</h4>
                                        <span className="text-[var(--forest-green)] lato-bold">
                                            ₱{computeItemTotal(item).toFixed(2)}
                                        </span>
                                    </div>

                                    <p className="text-md lato-regular">Qty: {item.quantity}</p>

                                    {item.extras?.length > 0 && (
                                        <div className="text-md mt-1 lato-regular">
                                            <p className="text-lg lato-bold">Extras:</p>
                                            <ul className="list-disc list-inside">
                                                {item.extras.map((extra, idx) => (
                                                    <li key={idx}>
                                                        {extra.product_name} — ₱{Number(extra.price).toFixed(2)} × {extra.quantity || 1}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 mt-2">
                                        <Link href={`/customer/menu/product/${item.id}`}>
                                            <Button className="bg-[var(--forest-green)]">View Details</Button>
                                        </Link>
                                        <Button onClick={() => removeFromCart(item.id)} variant="destructive">
                                            Remove
                                        </Button>
                                    </div>

                                    <Separator className="mt-3" />
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <>
                            <Separator className="my-4" />

                            <div className="px-4 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₱{computeCartTotal().toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>₱{computeCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="my-4 px-4">
                                <Link href="/customer/orders/create">
                                    <Button className="w-full bg-[var(--forest-green)] text-white py-2 rounded-lg hover:bg-green-700 transition">
                                        Checkout
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
