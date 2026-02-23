import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
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
      <SelectTrigger className="w-full max-w-48 bg-white text-black border border-gray-300">
        <SelectValue placeholder="Select the date filter" />
      </SelectTrigger>

      <SelectContent className="bg-white text-black border border-gray-300">
        <SelectGroup>
          <SelectLabel>Select the Date Filter</SelectLabel>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="year">Year</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
