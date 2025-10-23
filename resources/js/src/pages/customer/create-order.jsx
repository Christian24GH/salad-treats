import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft, CircleQuestionMark, ShoppingCartIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCart } from "@/context/CartContext"

export default function CreateOrder({ products }){
    const { cart, addToCart, removeFromCart } = useCart()

    const handleAdd = (product) => {
        addToCart(product)
        toast.success(`${product.product_name} added to cart!`)
    }

    console.log(products)
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
                <Link href={"/customer/orders"}>
                    <ChevronLeft className="mr-5 h-full"/>
                </Link>
                <span className="">Create Order</span>
            </div>
            <Separator/>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl lato-bold text-[var(--dark-green)] py-5">Select Product</h1>
                <Button className={"flex gap-2 bg-[var(--forest-green)] text-xl size-fit"}><ShoppingCartIcon className="!size-6" />Cart ({cart.length})</Button>
            </div>
            <Separator/>
            <div className="">
                <h1 className="text-2xl lato-bold text-[var(--dark-green)] py-5">Checkout</h1>
                <div className="flex items-center">

                </div>
            </div>
        </>
    )
}
CreateOrder.layout = page => <HomeLayout children={page}/>


{/*
    products.length > 0 ? products.map((products, index) => (
        <div key={`Item: ${index}`} className="">
            
        </div>
    )) : (
        <>
            <Empty>
                <EmptyHeader className={"scale-120"}>
                    <EmptyMedia variant="icon">
                        <CircleQuestionMark/>
                    </EmptyMedia>
                    <EmptyTitle>No Products</EmptyTitle>
                    <EmptyDescription>No products available right now, please come back later</EmptyDescription>
                </EmptyHeader>
            </Empty>
        </>
    )
*/}