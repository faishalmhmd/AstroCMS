import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
 
const config = {
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: "text",
        },
      },
      render: (props: any) => {
        return <h1>Hello{props.children}</h1>;
      },
    },
  },
};
 
const initialData = {};
 
const save = (data: any) => {};
 
export function Editor() {
  return <Puck config={config} data={initialData} onPublish={save} />;
}