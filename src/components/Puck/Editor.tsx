import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import TextType from "../bits/TextType";
import { fontBold, fontSize, fontColor} from "../../lib/tailwind/utilFont"

const config = {
  components: {
  TextType: {
      fields: {
        text: {
          label: "Text",
          type: "array",
          arrayFields: {
            value: { type: "text" },
          },
          getItemSummary: (item: any, index: number) => item.title || `Item No ${index + 1}`,
          max: 5,
        },
        textColor: {
          label: "Text Color (HEX)",
          type: "array",
          arrayFields: {
            value: { 
              type: "text",
              label: "Hello"
             },
          },
        },
        fontBold : fontBold,
        fontSize : fontSize,
        fontColor: fontColor,
        typingSpeed: { 
          label: "Typing Speed",
          type: "number" 
        },
        pauseDuration: {
          label: "Pause Duration (ms)",
          type: "number"
         },
        cursorCharacter: { 
          label: 'Cursor Character',
          type: "text" },
        showCursor: {
          label : 'Show Cursor',
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        
      },
      render: (props: any) => (
        <TextType
          className={[props.fontBold, props.fontSize, props.fontColor].filter(Boolean).join(" ")}
          text={(props.text ?? []).map((item: { value: string }) => item.value)}
          textColors={(props.textColor ?? []).map((item: { value: string }) => item.value)}
          typingSpeed={props.typingSpeed ?? 75}
          pauseDuration={props.pauseDuration ?? 1500}
          showCursor={props.showCursor ?? true}
          cursorCharacter={props.cursorCharacter ?? "|"}
          variableSpeed={props.variableSpeed ?? false}
          onSentenceComplete={props.onSentenceComplete ?? (() => {})}
        />
      ),
    },
  },
};

// Data awal kosong
const initialData = {};

// Fungsi simpan data
const save = (data: any) => {
  console.log("Saved data:", data);
};

export function Editor() {
  return <Puck config={config} data={initialData} onPublish={save} />;
}
