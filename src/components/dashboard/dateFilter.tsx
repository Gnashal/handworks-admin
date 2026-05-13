import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type DateFilterValue = "week" | "month" | "year";

interface DatePickerProps {
  value?: DateFilterValue;
  onChange?: (value: DateFilterValue) => void;
}

export default function DatePicker({
  value = "week",
  onChange,
}: DatePickerProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange?.(v as DateFilterValue)}
    >
      <SelectTrigger className="h-10 w-full min-w-40 rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm">
        <SelectValue placeholder="Select date filter" />
      </SelectTrigger>

      <SelectContent className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-lg">
        <SelectGroup>
          <SelectLabel>Date Filter</SelectLabel>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}