import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import TextType from "../bits/TextType";

const config = {
  components: {
    HeadingBlock: {
      fields: {
        children: { type: "text" },
      },
      render: (props: any) => <h1 className="text-3xl font-bold">{props.children}</h1>,
    },
  TextType: {
      fields: {
        text: {
          label: "Text",
          type: "array",
          arrayFields: {
            value: { type: "text" },
          },
        },
        textColor: {
          label: "Text Color (HEX)",
          type: "array",
          arrayFields: {
            value: { type: "text" },
          },
        },
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
            { label: "Left", value: true },
            { label: "Right", value: false },
          ],
        },
        
      },
      render: (props: any) => (
        <TextType
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
    ImageBlock: {
      fields: {
        src: { type: "text" },
        alt: { type: "text" },
      },
      render: (props: any) => (
        <img
          src={props.src}
          alt={props.alt}
          className="max-w-full rounded-lg shadow-md"
        />
      ),
    },

    ButtonBlock: {
      fields: {
        label: { type: "text" },
        url: { type: "text" },
      },
      render: (props: any) => (
        <a
          href={props.url}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {props.label}
        </a>
      ),
    },

    HeroSection: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        image: { type: "text" },
      },
      render: (props: any) => (
        <div className="flex items-center gap-6 bg-gray-100 p-6 rounded-xl">
          <div>
            <h2 className="text-2xl font-bold">{props.title}</h2>
            <p className="text-gray-600">{props.subtitle}</p>
          </div>
          {props.image && (
            <img src={props.image} alt="Hero" className="w-40 h-40 rounded-lg" />
          )}
        </div>
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
