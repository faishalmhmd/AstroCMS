import { Puck, type Config, type Data, type Slot, DropZone, type Content } from "@measured/puck";
import type { SlotComponent } from "@measured/puck";
import "@measured/puck/puck.css";
import { Header } from "@/components/Puck/Text/index";
// import { Grid } from "@/components/Puck/Layout/Grid";
import DrawerItem from "./DrawerItem";
import React from "react";

import { Grid } from "@/components/Puck/Layout/Grid";

type Components = {
  Header: {
    inputTitle: string | number;
    fontBold: string;
    fontSize: string;
    fontColor: string;
  };
  Grid: {
    columns: number;
    Content1: Slot;
  };
};
const config: Config<Components, any, "layout" | "text"> = {
  categories: {
    layout: {
      title: "Layout",
      components: ["Grid"],
    },
    text: {
      title: "Text",
      components: ["Header"],
    },
  },
  components: {
    Header,
    Grid,
  },
};

const initialData: Data = {
  content: [],
  root: { props: { title: "" } },
};

const save = (data: Data): void => {
  console.log("Saved data:", data);
};

export function Editor(): React.ReactElement {
  return (
    <Puck
      config={config}
      data={initialData}
      onPublish={save}
      overrides={{
        drawerItem: ({ name }: { name: string }) => <DrawerItem name={name} />,
      }}
    />
  );
}
