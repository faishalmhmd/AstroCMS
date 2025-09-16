import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const inputTitle = {
  label: "Input Title",
  type: "custom",
  render: ({ name, onChange, value }) => (
    <div className="w-full">
      <Label className="my-4 text-black">Input Title</Label>
      <Input
        defaultValue={value}
        name={name}
        onChange={(e) => onChange(e.currentTarget.value)}
        style={{ border: "1px solid black", padding: 4 }}
      />
    </div>
  ),
}
