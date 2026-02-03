import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface ServiceDynamicsData {
  label: string;
  value: number;
}
interface ServiceDynamicsProps {
  bookingSeries: ServiceDynamicsData[];
}

export default function ServiceDynamics({
  bookingSeries,
}: ServiceDynamicsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Service Dynamics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-40 items-end gap-2">
          {bookingSeries.map((point) => (
            <div
              key={point.label}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                className="w-full rounded-md bg-primary/80"
                style={{ height: `${point.value}%` }}
              />
              <span className="text-xs text-muted-foreground">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
