import HomeLayout from "@/layout/HomeLayout"
import { FileQuestionIcon } from "lucide-react"
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
    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
                Menu Items

                <Link href="/owner/menu/create" asChild>
                    <Button className={"bg-[var(--forest-green)]"}>Create Menu Item</Button>
                </Link>
            </div>
            <Separator/>
            {products?.length == 0 ? (
                <Empty>
                    <EmptyHeader className={"scale-120"}>
                        <EmptyMedia variant="icon">
                            <FileQuestionIcon/>
                        </EmptyMedia>
                        <EmptyTitle>No Menu Items</EmptyTitle>
                        <EmptyDescription>No Menu Items found</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className={"scale-120"}>
                        <Link href="/owner/menu/create" asChild>
                            <Button className={"bg-[var(--forest-green)]"}>Create Menu Item</Button>
                        </Link>
                    </EmptyContent>
                </Empty>
                
            ) : (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((record, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-md hover:shadow-xl transition">
                            <img
                                src={record.image_url ? record.image_url : '/placeholder.jpg'}
                                alt={record.product_name}
                                className="w-full h-48 object-cover"
                            />

                            {/* Content */}
                            <div className="p-4 h-full">
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

                                {/* Actions */}
                                <div className="mt-4 flex flex-col gap-2">
                                    <Button
                                        onClick={()=> router.visit(`/owner/menu/edit/${record.id}`)}
                                        className={"bg-[var(--forest-green)] !hover:bg-[var(--forest-green)]"}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className={"bg-gray-400 !hover:bg-gray-400"}
                                    >
                                        Archive
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
Menu.layout = page => <HomeLayout children={page}/>