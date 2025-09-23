import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CustomFieldRender } from "@measured/puck";

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
