import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../ui/select";

export default function DatePicker() {
  return (
    <Select defaultValue="week">
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
