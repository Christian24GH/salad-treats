import HomeLayout from "@/layout/HomeLayout"
import { CircleQuestionMark } from "lucide-react"
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

export default function Menu({products = []}){
    console.log(products)
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
                Available Products
                <Link href="/customer/orders/create">
                    <Button className={"bg-[var(--forest-green)] text-lg"}>
                        Checkout
                    </Button>
                </Link>
            </div>
            <Separator/>
            {products?.length == 0 ? (
                <Empty>
                    <EmptyHeader className={"scale-120"}>
                        <EmptyMedia variant="icon">
                            <CircleQuestionMark/>
                        </EmptyMedia>
                        <EmptyTitle>No Menu Items</EmptyTitle>
                        <EmptyDescription>No Menu Items found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
                
            ) : (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((record, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-md hover:shadow-xl transition relative h-fit">
                            <img
                                src={record.image_url ? record.image_url : '/placeholder.jpg'}
                                alt={record.product_name}
                                className="w-full h-48 object-cover"
                            />

                            <div className="p-4 h-full mb-14">
                                <div>
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold text-[var(--dark-green)] lato-regular">
                                            {record.product_name}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                        {record.description}
                                    </p>

                                    <Separator className={"bg-black my-4"}/>
                                    <p className="text-lg text-[var(--dark-green)]">
                                        ₱ {parseFloat(record.price).toFixed(2)}
                                    </p>
                                    
                                </div>
                            </div>
                            <Button
                                onClick={() => router.visit(`/customer/menu/product/${record.id}`)}
                                className={"w-full h-14 max-h-14 bg-[var(--soft-lime)] !hover:bg-[var(--forest-green)]  text-xl lato-bold-italic absolute bottom-0 rounded-t-none"}
                            >   
                                Add to cart
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
Menu.layout = page => <HomeLayout children={page}/>