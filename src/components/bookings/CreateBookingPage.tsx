"use client";


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IMainServiceType } from "@/types/booking";
import { mapServiceDetails } from "@/lib/factory";
import { BookingAddons } from "@/components/bookings/bookingAddons";

const TIME_SLOTS = [
  "08:00 AM",
  "10:00 AM",
  "01:00 PM",
  "03:00 PM",
  "05:00 PM",
];

export default function CreateBookingPageComponent() {
  const router = useRouter();

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const [serviceType, setServiceType] =
    useState<IMainServiceType>("GENERAL_CLEANING");

  const [serviceDetails, setServiceDetails] = useState(
    mapServiceDetails(serviceType, {
      id: "temp",
      serviceType,
      details: {},
    })
  );

  const [addons, setAddons] = useState<any[]>([]);
  const [schedule, setSchedule] = useState({
    date: "",
    time: "",
  });

  const [dirtyScale, setDirtyScale] = useState(1);
  const [notes, setNotes] = useState("");

  const [existingBookings, setExistingBookings] = useState<any[]>([]);

  // 🔥 FETCH BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/booking/fetchBookings");
      const data = await res.json();

      const bookings = Array.isArray(data)
        ? data
        : data.bookings || data.data || [];

      setExistingBookings(bookings);
    };

    fetchBookings();
  }, []);

  const handleServiceChange = (value: IMainServiceType) => {
    setServiceType(value);

    setServiceDetails(
      mapServiceDetails(value, {
        id: "temp",
        serviceType: value,
        details: {},
      })
    );
  };

  // 🔥 SLOT INFO (COUNT + CAPACITY)
  const getSlotInfo = (slot: string) => {
    if (!schedule.date) {
      return { count: 0, capacity: 2, isFull: false };
    }

    const sameSlot = existingBookings.filter(
      (b: any) =>
        b.date === schedule.date && b.time === slot
    );

    const capacity = 2;
    const count = sameSlot.length;

    return {
      count,
      capacity,
      isFull: count >= capacity,
    };
  };

  const handleCreate = async () => {
    if (!schedule.date || !schedule.time) {
      alert("Please select date and time");
      return;
    }

    if (getSlotInfo(schedule.time).isFull) {
      alert("This time slot is already full.");
      return;
    }

    const payload = {
      customer,
      service: {
        type: serviceType,
        details: serviceDetails.details,
      },
      addons,
      schedule,
      operational: {
        dirtyScale,
        notes,
      },
    };

    console.log("CREATE BOOKING PAYLOAD:", payload);

    // 🔥 TODO: connect to backend POST
    // await fetch("/api/booking/createBooking", {...})

    router.push("/bookings");
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Create Booking</h1>
        <p className="text-muted-foreground">
          Schedule and configure a new service booking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* CUSTOMER */}
          <Card>
            <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" onChange={(e)=>setCustomer({...customer, firstName:e.target.value})}/>
              <Input placeholder="Last Name" onChange={(e)=>setCustomer({...customer, lastName:e.target.value})}/>
              <Input placeholder="Phone" onChange={(e)=>setCustomer({...customer, phone:e.target.value})}/>
              <Input placeholder="Address" onChange={(e)=>setCustomer({...customer, address:e.target.value})}/>
            </CardContent>
          </Card>

          {/* SERVICE */}
          <Card>
            <CardHeader><CardTitle>Service</CardTitle></CardHeader>
            <CardContent>
              <Select value={serviceType} onValueChange={(val)=>handleServiceChange(val as IMainServiceType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL_CLEANING">General Cleaning</SelectItem>
                  <SelectItem value="COUCH">Couch</SelectItem>
                  <SelectItem value="MATTRESS">Mattress</SelectItem>
                  <SelectItem value="CAR">Car</SelectItem>
                  <SelectItem value="POST">Post Construction</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* ADDONS */}
          <BookingAddons addons={[]} selectable selectedAddons={addons} onChange={setAddons}/>

          {/* 🔥 SCHEDULE */}
          <Card>
            <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">

              {/* DATE */}
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  onChange={(e)=>setSchedule({...schedule, date:e.target.value})}
                />
              </div>

              {/* TIME SLOT */}
              <div>
                <Label>Time Slot</Label>
                <Select
                  value={schedule.time}
                  onValueChange={(val)=>setSchedule({...schedule, time:val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>

                  <SelectContent>
                    {TIME_SLOTS.map((slot)=>{
                      const info = getSlotInfo(slot);

                      return (
                        <SelectItem
                          key={slot}
                          value={slot}
                          disabled={info.isFull}
                        >
                          {slot} ({info.count}/{info.capacity}
                          {info.isFull ? " Full" : ""})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          {/* OPERATIONAL */}
          <Card>
            <CardHeader><CardTitle>Operational</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Input
                type="number"
                value={dirtyScale}
                onChange={(e)=>setDirtyScale(Number(e.target.value))}
              />
              <Input
                placeholder="Notes"
                onChange={(e)=>setNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent>
              <p>{schedule.date || "—"} {schedule.time || ""}</p>
              <p>{addons.length} addons</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleCreate} className="w-full">
                Create Booking
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}