import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CustomFieldRender } from "@measured/puck";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type InputFieldOptions = {
  label?: string;
  placeholder?: string;
  type?: "text" | "number" | "password" | "email";
  min?: number;
  max?: number;
};

export const InputField = <T extends string | number>(options?: InputFieldOptions) => ({
  label: options?.label ?? "Input Title",
  type: "custom" as const,
  render: (({ name, onChange, value }) => (
    <div className="w-full">
      <Label className="my-2 text-black">{options?.label ?? "Input Title"}</Label>
      <Input
        type={options?.type ?? "text"}
        value={value ?? ""}
        name={name}
        placeholder={options?.placeholder ?? "Type here..."}
        min={options?.type === "number" ? options?.min : undefined}
        max={options?.type === "number" ? options?.max : undefined}
        onChange={(e) => {
          if (options?.type === "number") {
            onChange(Number(e.currentTarget.value) as T);
          } else {
            onChange(e.currentTarget.value as T);
          }
        }}
        className="border border-black"
      />
    </div>
  )) as CustomFieldRender<T>,
});




type SelectFieldOptions<T extends string | number> = {
  label?: string;
  placeholder?: string;
  options: { label: string; value: T }[];
};

export const SelectField = <T extends string | number>(options: SelectFieldOptions<T>) => ({
  label: options?.label ?? "Select Title",
  type: "custom" as const,
  render: (({ name, onChange, value }) => {
    // Convert number to string because shadcn/ui Select only accepts string
    const stringValue = value !== undefined ? String(value) : "";

    return (
      <div className="w-full">
        <Label className="my-2 text-black">{options?.label ?? "Select Title"}</Label>
        <Select value={stringValue} onValueChange={(val: string) => {
          const selected = options.options.find(opt => String(opt.value) === val);
          if (selected) onChange(selected.value);
        }}>
          <SelectTrigger>
            <SelectValue placeholder={options.placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {options.options.map(opt => (
              <SelectItem key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }) as CustomFieldRender<T>,
});
