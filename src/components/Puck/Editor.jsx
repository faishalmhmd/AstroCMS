import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { fontBold, fontSize, fontColor } from "../../lib/tailwind/utilFont";
import { inputTitle } from "../../lib/tailwind/utilInput";

const config = {
  components: {
    Header: {
      fields: {    
        inputTitle,  
        fontBold,
        fontSize,
        fontColor,
      },
      render: ({ inputTitle, fontBold, fontSize, fontColor }) => (
        <div
          className={[fontBold, fontSize, fontColor]
            .filter(Boolean)
            .join(" ")}
        >
          <h1>{inputTitle ?? ""}</h1>
        </div>
      ),
    },
  },
};

const initialData = {};

const save = (data) => {
  console.log("Saved data:", data);
};

export function Editor() {
  return <Puck config={config} data={initialData} onPublish={save} />;
}