import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft } from "lucide-react"
import { FaCheck } from "react-icons/fa";
import { TbSaladFilled  } from "react-icons/tb";
import { FaBox } from "react-icons/fa6";
import { BsFillBagCheckFill } from "react-icons/bs";
import { TiHome } from "react-icons/ti";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react"

export default function TrackerDetails({ order, delivery }){
    const { register, handleSubmit, control, setValue, formState: { isSubmitting, errors } } = useForm()
    const [ progress, setProgress ] = useState(0)

    
    const AssignDelivery = async (data) => {
        console.log(data)
    }

    const Confirmed = async () => {
        setProgress(0)
    }
    
    const Preparing = async () => {
        setProgress(25)
    }

    const Packing = async () => {
        setProgress(50)
    }

    const Ready = async () => {
        setProgress(75)
    }

    const Delivered = async () => {
        setProgress(100)
    }

    useEffect(()=>{
        Confirmed()
    }, [order])

    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
                <Link href={"/owner/tracker"}>
                    <ChevronLeft className="mr-5 h-full"/>
                </Link>
                <span className="">Order Status</span>
            </div>
            <Separator/>

            <div className="w-full h-fit flex flex-col items-center px-20 py-20">
                <h1 className="text-3xl lato-bold-italic text-[var(--dark-green)] text-center">Order Status</h1>
                <div className="flex relative w-full items-center min-h-80">
                    <Progress value={progress} className={"w-full"}/>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <Button 
                            
                            className="rounded-full size-16 bg-[var(--forest-green)] flex items-center justify-center">
                            <FaCheck className="size-10 text-white" />
                        </Button>
                        <h1 className="text-center text-xl lato-bold mt-2 text-[var(--dark-green)] absolute -bottom-15">
                            Confirmed
                        </h1>
                    </div>

                    <div className="absolute left-[25%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <Button 
                            onClick={Preparing}
                            className="rounded-full size-16 bg-[var(--forest-green)] flex items-center justify-center">
                            <TbSaladFilled className="size-10 text-white" />
                        </Button>
                        <h1 className="text-center text-xl lato-bold mt-2 text-[var(--dark-green)] absolute -bottom-15">
                            Preparing
                        </h1>
                    </div>

                    <div className="absolute left-[50%] right-[50%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <Button 
                            onClick={Packing}
                            className="rounded-full size-16 bg-[var(--forest-green)] flex items-center justify-center">
                            <FaBox className="size-10 text-white" />
                        </Button>
                        <h1 className="text-center text-xl lato-bold mt-2 text-[var(--dark-green)] absolute -bottom-15">
                            Packing
                        </h1>
                    </div>

                    <div className="absolute right-[25%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <Button 
                            onClick={Ready}
                            className="rounded-full size-16 bg-[var(--forest-green)] flex items-center justify-center">
                            <BsFillBagCheckFill className="size-10 text-white" />
                        </Button>
                        <h1 className="text-center text-xl lato-bold mt-2 text-[var(--dark-green)] absolute -bottom-15">
                            Ready
                        </h1>
                    </div>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <Button 
                            onClick={Delivered}
                            className="rounded-full size-16 bg-[var(--forest-green)] flex items-center justify-center">
                            <TiHome className="size-10 text-white" />
                        </Button>
                        <h1 className="text-center text-xl lato-bold mt-2 text-[var(--dark-green)] absolute -bottom-15">
                            Delivered
                        </h1>
                    </div>
                </div>

                <p className="text-center lato-regular"><span className="font-bold">Tip:</span> Select the status buttons to set the order status</p>
            </div>
            <Separator/>

            <div className="w-full">
                <h1 className="text-2xl lato-bold my-4 text-[var(--dark-green)]">Order Confirmed</h1>
                <div className="border w-full h-fit p-4 space-y-2">
                    <h1 className="text-1xl lato-regular">Status: {"Order confirmed"}</h1>
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-1xl lato-regular">Order ID: {"121312"}</h1>
                            <h1 className="text-1xl lato-regular">Item(s) Ordered: {"1"}</h1>
                        </div>
                       <Link href={`/owner/orders/${1}`} asChild>
                            <Button className="bg-[var(--forest-green)] text-lg lato-regular-italic">
                                View Full Details
                            </Button>
                        </Link>
                    </div>
                    <Separator />
                    <form onSubmit={handleSubmit(AssignDelivery)} className="w-full flex gap-5 items-center">
                        <Controller
                            name="assigned_driver"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="!min-w-1/2 !flex-1 !h-12 !text-xl">
                                        <SelectValue placeholder="Assign Delivery" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem className={"!h-12 !text-xl"} value="Jimmy Boy">Jimmy Boy</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <Button className="bg-[var(--forest-green)] text-lg lato-regular-italic" disabled={isSubmitting}>{isSubmitting ? "Submitting" : "Submit"}</Button>
                    </form>
                </div>
                
            </div>
        </>
    )
}
TrackerDetails.layout = page => <HomeLayout children={page}/>