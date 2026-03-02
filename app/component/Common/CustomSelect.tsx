"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/component/ui/select";

type Option = {
  value: number;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function CustomSelect({
  options,
  value,
  onChange,
  disabled = false,
}: CustomSelectProps) {
  const handleValueChange = (val: string) => {
    onChange(Number(val));
  };

  return (
    <Select
      value={String(value)}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="bg-[#343a40] border-[#4b5563] text-[#f9fafb] w-auto min-w-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-[#343a40] border-[#4b5563] text-[#f9fafb]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            className="text-[#f9fafb] focus:bg-[#4b5563] focus:text-[#f9fafb]"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
