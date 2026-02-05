import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";

// TODO: replace with real fetch later
import { mockBookings } from "@/data/mockBookings";

interface BookingDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function BookingDetailsPage(
  props: BookingDetailsPageProps,
) {
  const { id } = await props.params;

  const booking = mockBookings.bookings.find((b) => b.id === id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full h-screen gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Link
            href="/bookings"
            className="text-sm text-muted-foreground hover:underline"
          >
            Back to Bookings
          </Link>
          <h1 className="text-2xl font-semibold">Booking #{booking.id}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary">PENDING</Badge>
          <Button variant="destructive" disabled>
            Cancel Booking
          </Button>
          <Button disabled>Reassign</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>First Name: {booking.base.customerFirstName}</p>
                <p>Last Name: {booking.base.customerLastName}</p>
                <p>Address: {booking.base.address.addressHuman}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Main Service: {booking.mainService.serviceType}</p>
                <p>
                  Schedule:{" "}
                  {format(
                    new Date(booking.base.startSched),
                    "MMM dd, yyyy · hh:mm a",
                  )}
                </p>
                <p>
                  End:{" "}
                  {format(
                    new Date(booking.base.endSched),
                    "MMM dd, yyyy · hh:mm a",
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Allocation */}
        <TabsContent value="allocation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Resources</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Cleaners, equipment, and resources will go here.
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media */}
        <TabsContent value="media" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Images & Attachments</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Before / after photos, damage reports, uploads.
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing */}
        <TabsContent value="pricing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Total Price: ₱{booking.totalPrice}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit */}
        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Created at, updated at, source, overrides.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
