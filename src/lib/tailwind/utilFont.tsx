import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandItem, CommandGroup, CommandEmpty, CommandInput } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import textColor from "./font/textColor";
import textBold from "./font/textBold";
import textSize from "./font/textSize";
import { cn } from "@/lib/utils";

export const fontBold = {
  label: "Font Bold",
  type: "custom" as const,
  render: ({ name, onChange, value }: { name: string; onChange: (v: string) => void; value: string }) => (
    <div className="w-full">
      <Label className="my-4 text-black">Select font bold</Label>
      <Select value={value} onValueChange={val => onChange(val)} name={name}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Font Bold" />
        </SelectTrigger>
        <SelectContent>
          {textBold.map(item => (
            <SelectItem value={item.text} key={item.text}>
              {item.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const fontSize = {
  label: "Font Size",
  type: "custom" as const,
  render: ({ name, onChange, value }: { name: string; onChange: (v: string) => void; value: string }) => (
    <div className="w-full">
      <Label className="my-4 text-black">Select font size</Label>
      <Select value={value} onValueChange={val => onChange(val)} name={name}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Font Size" />
        </SelectTrigger>
        <SelectContent>
          {textSize.map(item => (
            <SelectItem value={item.text} key={item.text}>
              {item.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ),
};


export const fontColor = {
  label: "Font Color",
  type: "custom" as const,
  render: (({ name, onChange, value }: { name: string; onChange: (v: string) => void; value: string }) => (
    <div className="w-full">
      <Label className="my-4 text-black">Select text color</Label>
      <SearchableColorSelect value={value} onChange={onChange} name={name} />
    </div>
  )),
};

function SearchableColorSelect({
  name,
  onChange,
  value,
}: {
  name: string;
  onChange: (v: string) => void;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedItem = textColor.find((item) => item.text === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedItem ? (
            <span className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded ${selectedItem.color} mr-2`}></span>
              {selectedItem.text}
            </span>
          ) : (
            "Select color..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search colors..." />
          <CommandEmpty>No color found.</CommandEmpty>
          <CommandGroup>
            {textColor.map((item) => (
              <CommandItem
                key={item.text}
                value={item.text}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue); // pakai onChange
                  setOpen(false);
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", value === item.text ? "opacity-100" : "opacity-0")} />
                <span className={`inline-block w-4 h-4 rounded ${item.color} mr-2`}></span>
                {item.text}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
