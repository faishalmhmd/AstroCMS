import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import textColor from "./font/textColor";


export const fontBold = {
          label : 'Font Bold',
          type: "select",
          options: [
            { label: "100", value: "font-thin" },
            { label: "200", value: "font-extralight" },
            { label: "300", value: "font-light" },
            { label: "400", value: "font-normal" },
            { label: "500", value: "font-medium" },
            { label: "600", value: "font-semibold" },
            { label: "700", value: "font-bold" },
            { label: "800", value: "font-extrabold" },
            { label: "900", value: "font-black" },
          ],
    defaultValue: "font-normal",
}

export const fontSize = {
  label: "Font Color",
  type: "custom",
  render: ({
    name,
    onChange,
    value,
  }: {
    name: string
    onChange: (value: string) => void
    value: string
  }) => (
    <div className="w-full">
    <Select
      value={value}
      onValueChange={(val) => onChange(val)}
      name={name}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select color" />
      </SelectTrigger>
      <SelectContent>
        {textColor.map((item) => (
          <SelectItem value={item.text} key={item.text}>
            <span className={`inline-block w-4 h-4 rounded ${item.color} mr-2`} ></span>
            {item.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>
  ),
}

export const fontColor = {
  label: "Font Color",
  type: "custom",
  render: ({
    name,
    onChange,
    value,
  }: {
    name: string
    onChange: (value: string) => void
    value: string
  }) => (
    <div className="w-full">
    <Select
      value={value}
      onValueChange={(val) => onChange(val)}
      name={name}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select color" />
      </SelectTrigger>
      <SelectContent>
        {textColor.map((item) => (
          <SelectItem value={item.text} key={item.text}>
            <span className={`inline-block w-4 h-4 rounded ${item.color} mr-2`} ></span>
            {item.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </div>
  ),
}