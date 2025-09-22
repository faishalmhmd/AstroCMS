import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const inputTitle = {
  label: "Input Title",
  type: "custom" as const,
  render: (({ name, onChange, value }: { name: string; onChange: (v: string) => void; value: string }) => (
    <div className="w-full">
      <Label className="my-4 text-black">Input Title</Label>
      <Input
        defaultValue={value}
        name={name}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="border border-black"
      />
    </div>
  )),
};

export const input = {
  label: "Input Gap",
  type: "custom" as const,
  render: (({ name, onChange, value }: { name: string; onChange: (v: string) => void; value: string }) => (
    <div className="w-full">
      <Label className="my-4 text-black">Input Gap</Label>
      <Input
        defaultValue={value}
        name={name}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="border border-black"
      />
    </div>
  )),
};


