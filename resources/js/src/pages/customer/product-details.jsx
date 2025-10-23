import HomeLayout from "@/layout/HomeLayout";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import { ButtonGroup } from "@/components/ui/button-group";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ProductDetails({ product, extras }) {
    const { cart, addToCart, removeFromCart } = useCart();
    const [orderTotal, setOrderTotal] = useState(
        parseFloat(product?.price) || 0
    );
    const [quantity, setQuantity] = useState(1);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [instructions, setInstructions] = useState("");

    const computeOrderTotal = (newExtras = selectedExtras, newQty = quantity) => {
        const extrasTotal = newExtras.reduce(
            (sum, extra) => sum + parseFloat(extra.price) * (extra.quantity || 1),
            0
        );
        const total = (parseFloat(product.price) + extrasTotal) * newQty;
        setOrderTotal(total);
    };

    useEffect(() => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            setQuantity(existingItem.quantity || 1);
            setSelectedExtras(existingItem.extras || []);
            setInstructions(existingItem.instructions);
            computeOrderTotal(
                existingItem.extras || [],
                existingItem.quantity || 1
            );
        }
    }, [cart, product.id]);

    const handleExtraChange = (extra, checked) => {
        let updatedExtras;

        if (checked) {
            updatedExtras = [...selectedExtras, { ...extra, quantity: 1 }];
        } else {
            updatedExtras = selectedExtras.filter((e) => e.id !== extra.id);
        }

        setSelectedExtras(updatedExtras);
        computeOrderTotal(updatedExtras, quantity);
    };

    
    const updateExtraQuantity = (id, newQty) => {
        const updated = selectedExtras.map((e) =>
            e.id === id ? { ...e, quantity: Math.max(1, newQty) } : e
        );
        setSelectedExtras(updated);
        computeOrderTotal(updated, quantity);
    };

    const handleAddToCart = () => {
        const itemToAdd = {
            ...product,
            instructions: instructions,
            extras: selectedExtras,
            quantity,
            total: orderTotal,
        };
        addToCart(itemToAdd);
    };

    const existing = cart.find((item) => item.id === product.id);

    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex items-center">
                <Link href={"/customer/menu"}>
                    <ChevronLeft className="mr-5 h-full" />
                </Link>
                <span>
                    <i className="fa fa-product-hunt" aria-hidden="true"></i>{" "}
                    Details
                </span>
            </div>
            <Separator />
            <div className="py-5">
                {product.id ? (
                    <div className="flex sm:flex-col md:flex-col lg:flex-row md:gap-5 lg:gap-10">
                        <img
                            src={product?.image_url}
                            alt=""
                            className="h-[400px] lg:w-[350px] md:w-full object-top object-contain"
                        />
                        <div className="flex flex-col gap-2 w-full">
                            <h1 className="text-3xl lato-regular text-[var(--forest-green)] mb-3">
                                {product?.product_name}
                            </h1>
                            <p className="text-lg lato-regular">
                                {product?.description}
                            </p>

                            <Separator className={"my-5"} />

                            <p className="text-2xl lato-bold">
                                ₱ {parseFloat(product?.price).toFixed(2)}
                            </p>

                            <p className="text-lg lato-bold">ADD ON:</p>
                            {extras.length > 0 ? (
                                extras.map((item) => {
                                    const selected = selectedExtras.find(
                                        (e) => e.id === item.id
                                    );
                                    const extraQty = selected?.quantity || 1;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-2 border-b py-1"
                                        >
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected}
                                                    className="accent-[var(--soft-lime)] text-white"
                                                    onChange={(e) =>
                                                        handleExtraChange(
                                                            item,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="text-lg lato-regular">
                                                    {item.product_name}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-lg lato-regular">
                                                    ₱
                                                    {parseFloat(
                                                        item.price
                                                    ).toFixed(2)}
                                                </span>
                                                {selected && (
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateExtraQuantity(
                                                                    item.id,
                                                                    extraQty - 1
                                                                )
                                                            }
                                                        >
                                                            <Minus size={14} />
                                                        </Button>
                                                        <span className="text-lg w-6 text-center">
                                                            {extraQty}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateExtraQuantity(
                                                                    item.id,
                                                                    extraQty + 1
                                                                )
                                                            }
                                                        >
                                                            <Plus size={14} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-lg text-muted-foreground">
                                    No add-on available
                                </p>
                            )}

                            <Separator className={"my-5"} />
                            <h1 className="text-2xl lato-light">
                                SPECIAL INSTRUCTIONS (optional)
                            </h1>
                            <Textarea
                                placeholder="Add any special instructions here..."
                                value={instructions}
                                onChange={(e) =>
                                    setInstructions(e.target.value)
                                }
                                className="!text-lg max-h-[100px] w-full overflow-y-auto"
                            />

                            <Separator className={"my-5"} />
                            <div className="flex gap-5 items-center">
                                <h1 className="text-xl lato-regular">
                                    Quantity
                                </h1>
                                <ButtonGroup>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const newQty = Math.max(
                                                1,
                                                quantity - 1
                                            );
                                            setQuantity(newQty);
                                            computeOrderTotal(
                                                selectedExtras,
                                                newQty
                                            );
                                        }}
                                    >
                                        <Minus />
                                    </Button>

                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => {
                                            const newQty = Math.max(
                                                1,
                                                parseInt(e.target.value) || 1
                                            );
                                            setQuantity(newQty);
                                            computeOrderTotal(
                                                selectedExtras,
                                                newQty
                                            );
                                        }}
                                        className="min-w-10 w-14 text-lg text-center"
                                    />

                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const newQty = quantity + 1;
                                            setQuantity(newQty);
                                            computeOrderTotal(
                                                selectedExtras,
                                                newQty
                                            );
                                        }}
                                    >
                                        <Plus />
                                    </Button>
                                </ButtonGroup>
                            </div>

                            <div className="flex gap-5 mt-5">
                                <h1 className="text-xl lato-bold">
                                    Amount ₱ {parseFloat(orderTotal).toFixed(2)}
                                </h1>
                            </div>

                            <Button
                                onClick={handleAddToCart}
                                className={`text-lg lato-bold ${
                                    existing
                                        ? "bg-blue-500 hover:bg-blue-600"
                                        : "bg-[var(--soft-lime)] hover:bg-[var(--forest-green)]"
                                }`}
                            >
                                {existing ? "Update Order" : "Add to Cart"}
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
ProductDetails.layout = (page) => <HomeLayout children={page} />;
