import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        console.log(product);

        setCart((prev) => {
            console.log(prev)
            if (!product || !product.id) {
                console.error("Invalid product passed to addToCart:", product);
                toast.error("Failed to add product — invalid item.");
                return prev;
            }

            const existing = prev.find(
                (item) => item && item.id === product.id
            );

            if (existing) {
                toast.info(`${product.product_name} cart updated`);
                return prev.map((item) => {
                    return item.id === product.id
                        ? { ...item, instructions: product.instructions, extras: product.extras, quantity: product.quantity }
                        : item;
                });
            }

            toast.success(`${product.product_name} added to cart!`);
            return [
                ...prev,
                {
                    ...product,
                    instructions: product.instructions, 
                    extras: product.extras || [],
                    quantity: product.quantity,
                },
            ];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => {
            const removedItem = prev.find((item) => item.id === id);
            if (removedItem) {
                toast.warning(`${removedItem.product_name} removed from cart.`);
            }
            return prev.filter((item) => item.id !== id);
        });
    };

    const updateQuantity = (id, qty) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: qty } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
        toast.warning("Cart cleared.");
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
