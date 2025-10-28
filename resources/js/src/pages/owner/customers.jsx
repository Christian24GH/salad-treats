import HomeLayout from "@/layout/HomeLayout";
import { CircleQuestionMark } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";

export default function Customers({ customers }) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reason, setReason] = useState("");
  const [filter, setFilter] = useState("All");

  const handleBlock = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleUnblock = async (user) => {
    try {
      await axios.post("/owner/customer-management/unblock-customer", {
        user_id: user.id,
      });
      toast.success("Customer unblocked successfully!");
      window.location.reload()
    } catch {
      toast.error("Failed to unblock user.");
    }
  };

  const confirmBlock = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason for blocking.");
      return;
    }

    try {
      await axios.post("/owner/customer-management/block-customer", {
        user_id: selectedUser.id,
        message: reason,
      });
      toast.success("Customer blocked successfully!");
      setReason("");
      setOpen(false);
      window.location.reload()
    } catch {
      toast.error("Failed to block user. Please try again.");
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (filter === "Blocked") return c.blocked?.is_blocked;
    if (filter === "Active") return !c.blocked?.is_blocked;
    return true;
  });

  return (
    <>
      <div className="py-5 text-3xl lato-bold-italic text-[var(--forest-green)] flex justify-between items-center">
        Customers
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px] text-lg">
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-lg">All Customers</SelectItem>
            <SelectItem value="Active" className="text-lg">Active</SelectItem>
            <SelectItem value="Blocked" className="text-lg">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />

      {filteredCustomers.length === 0 ? (
        <Empty>
          <EmptyHeader className="scale-120">
            <EmptyMedia variant="icon">
              <CircleQuestionMark />
            </EmptyMedia>
            <EmptyTitle>No Customers</EmptyTitle>
            <EmptyDescription>No customers match your filter.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        filteredCustomers.map((record, index) => {
          const isBlocked = record?.blocked?.is_blocked;
          const reason = record?.blocked?.report?.message || "";
          return (
            <div key={record.id}>
              <div
                className={`w-full min-h-10 flex flex-wrap items-start text-[var(--forest-green)] rounded-md my-3 p-3 ${
                  isBlocked ? "bg-red-50 border" : "bg-[var(--mint-cream)]"
                }`}
              >
                <div className="flex items-center p-2 text-2xl font-bold mr-4">{index + 1}</div>
                <div className="flex flex-col py-2 flex-2 min-w-[250px]">
                  <p className="font-bold text-lg">
                    Name: <span className="font-normal">{record?.name}</span>
                  </p>
                  <p className="font-bold text-lg">
                    Email: <span className="font-normal">{record?.email}</span>
                  </p>
                  <p className="font-bold text-lg">
                    Verified:{" "}
                    <span className="font-normal">
                      {record?.email_verified_at
                        ? format(new Date(record?.email_verified_at), "MMM dd, yyyy, h:mm a")
                        : "No"}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col py-2 flex-2 min-w-[250px]">
                  <p className="font-bold text-lg">
                    Delivered Orders: <span className="font-normal">{record?.delivered_orders_count}</span>
                  </p>
                  <p className="font-bold text-lg">
                    Paid Orders: <span className="font-normal">{record?.paid_orders_count}</span>
                  </p>
                  <p className="font-bold text-lg">
                    Cancelled Orders: <span className="font-normal">{record?.cancelled_orders_count}</span>
                  </p>
                </div>

                <div className="flex flex-col justify-center items-start p-3 gap-2">
                  <p className={`font-bold text-lg ${isBlocked ? "text-red-600" : "text-green-700"}`}>
                    Status: {isBlocked ? "Blocked" : "Active"}
                  </p>

                  {(isBlocked && reason) ? (
                    <p className="text-md text-gray-600 italic max-w-sm">
                      Reason: "{reason}"
                    </p>
                  ) : null}

                  {isBlocked ? (
                    <Button
                      onClick={() => handleUnblock(record)}
                      className="bg-green-600 hover:bg-green-700 text-lg lato-regular-italic"
                    >
                      Unblock Customer
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleBlock(record)}
                      className="bg-red-600 hover:bg-red-700 text-lg lato-regular-italic"
                    >
                      Block Customer
                    </Button>
                  )}

                </div>
              </div>
              <Separator />
            </div>
          );
        })
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[var(--forest-green)]">Block Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-lg">Please enter the reason for blocking this customer:</p>
            <Textarea
              placeholder="Type the reason here..."
              className="text-lg h-32"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-5">
            <Button variant="outline" className="text-lg px-5" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBlock} className="bg-red-600 hover:bg-red-700 text-lg px-5">
              Confirm Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

Customers.layout = (page) => <HomeLayout children={page} />;
