import HomeLayout from "@/layout/HomeLayout"
import { ChevronLeft } from "lucide-react"
import { FaCheck } from "react-icons/fa6";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react"
import axios from "../../../bootstrap"
import { toast } from "sonner"
export default function TrackerDetails({ order, drivers }){
    const { register, handleSubmit, control, setValue, formState: { isSubmitting, errors } } = useForm({
        defaultValues: {
            assigned_driver: String(order?.delivery?.delivery_person_id), // e.g., "3"
        },
    })
    const [ progress, setProgress ] = useState(0)
    const [currentStatus, setCurrentStatus] = useState(order?.status ?? "Accepted");
    const [nextStatus, setNextStatus] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const statusOrder = ["Accepted", "Preparing", "Packaged", "On Delivery", "Delivered"];
    const progressMap = {
        Accepted: 0,
        Preparing: 25,
        Packaged: 50,
        "On Delivery": 75,
        Delivered: 100,
    };

    useEffect(() => {
        setProgress(progressMap[currentStatus]);
    }, [currentStatus]);

    const handleStatusClick = (status) => {
        const currentIndex = statusOrder.indexOf(currentStatus);
        const targetIndex = statusOrder.indexOf(status);
        if (targetIndex <= currentIndex) {
            toast.warning("You cannot revert to a previous status.", { position: "top-center" });
            return;
        }

        if (targetIndex === statusOrder.length - 1) {
            toast.info("Only the delivery personnel can mark this as delivered.", {
            position: "top-center",
            });
            return;
        }


        setNextStatus(status);
        setOpenDialog(true);
    };

    const confirmStatusChange = async () => {
        try {
        setOpenDialog(false);
        setProgress(progressMap[nextStatus]);
        await axios.post(`/owner/tracker/${order?.id}/status`, { status: nextStatus });
        toast.success(`Order marked as ${nextStatus}`, { position: "top-center" });
        setCurrentStatus(nextStatus);
        } catch (err) {
        console.error(err);
        toast.error("Failed to update order status", { position: "top-center" });
        }
    };

    const AssignDelivery = async (data) => {
        console.log(data)
        try {
            await axios.post(`/owner/tracker/${order?.id}/assign-driver`, data)
            toast.success("Driver assigned successfully", { position: "top-center" })
        } catch (err) {
            console.error(err)
            toast.error("Failed to assign driver", { position: "top-center" })
        }
    }

    return (
        <>
            <div className="py-5 text-3xl lato-bold-italic text-[var(--dark-green)] flex items-center">
                <Link href={"/owner/tracker"}>
                    <ChevronLeft className="mr-5 h-full"/>
                </Link>
                <span className="">Order Status</span>
            </div>
            <Separator/>

            <div className="w-full h-fit flex flex-col items-center sm:px-0 md:px-4 lg:px-20 py-20">
                <h1 className="text-3xl lato-bold-italic text-[var(--dark-green)] text-center">Order Status</h1>
                <div className="flex relative w-full items-center min-h-80">
                    <Progress value={progress} className={"w-full"}/>
                    
                    {[
                        { label: "Accepted", icon: <FaCheck className="size-10 text-white" /> },
                        { label: "Preparing", icon: <TbSaladFilled className="size-10 text-white" /> },
                        { label: "Packaged", icon: <FaBox className="size-10 text-white" /> },
                        { label: "On Delivery", icon: <BsFillBagCheckFill className="size-10 text-white" /> },
                        { label: "Delivered", icon: <TiHome className="size-10 text-white" /> },
                    ].map((s, i) => (
                        <div
                        key={s.label}
                        className={`absolute flex flex-col items-center z-10 ${
                            i === 0
                            ? "left-0"
                            : i === 4
                            ? "right-0"
                            : i === 1
                            ? "left-[25%] -translate-x-1/5"
                            : i === 2
                            ? "left-[50%] -translate-x-1/2"
                            : "right-[25%] translate-x-1/5"
                        } top-1/2 -translate-y-1/2`}
                        >
                        <Button
                            onClick={() => handleStatusClick(s.label)}
                            disabled={s.label === currentStatus}
                            className={`rounded-full size-16 flex items-center justify-center transition-colors
                            ${
                                s.label === currentStatus
                                ? "bg-[var(--forest-green)] cursor-not-allowed pointer-events-none !opacity-100"
                                : "bg-gray-400 hover:bg-[var(--forest-green)]"
                            }`}
                        >
                            {s.icon}
                        </Button>
                        <h1 className="text-center sm:text-sm md:text-md lg:text-xl lato-bold mt-2 text-[var(--dark-green)] absolute -bottom-15">
                            {s.label}
                        </h1>
                        </div>
                    ))}
                </div>

                <p className="text-center lato-regular"><span className="font-bold">Tip:</span> Select the status buttons to set the order status</p>
            </div>
            <Separator/>
                <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                <AlertDialogDescription>
                Are you sure you want to mark this order as <strong>{nextStatus}</strong>?
                <br />
                You cannot revert to a previous status once confirmed.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmStatusChange}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
            <div className="w-full">
                <h1 className="text-2xl lato-bold my-4 text-[var(--dark-green)]">Order Confirmed</h1>
                <div className="border w-full h-fit p-4 space-y-2">
                    <h1 className="text-1xl lato-regular">Status: {"Order confirmed"}</h1>
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-1xl lato-regular">Order ID: {"121312"}</h1>
                            <h1 className="text-1xl lato-regular">Item(s) Ordered: {"1"}</h1>
                        </div>
                       <Link href={`/owner/orders/${1}`}>
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
                                <Select 
                                    disabled={Boolean(order?.delivery?.delivery_person_id)}
                                    onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="!min-w-1/2 !flex-1 !h-12 !text-xl">
                                        <SelectValue placeholder="Assign Delivery" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {drivers.length > 0 && drivers.map((d, i)=>(
                                            <SelectItem key={`driver ${i}`} className={"!h-12 !text-xl"} value={String(d.id)}>{d.name}</SelectItem>
                                        ))}
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