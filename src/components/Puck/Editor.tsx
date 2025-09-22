import { Puck, type Config, type Data, DropZone, createUsePuck } from "@measured/puck";
import "@measured/puck/puck.css";
import { fontBold, fontSize, fontColor } from "../../lib/tailwind/utilFont";
import { inputTitle } from "../../lib/tailwind/utilInput";
import DrawerItem from "./DrawerItem";
import React from "react";

// Define component props
type Components = {
  Header: {
    inputTitle: string;
    fontBold: string;
    fontSize: string;
    fontColor: string;
  };
  Grid: {
    columns: number;
    gap: number;
  };
};

const config: Config<Components, any, 'layout' | 'text'> = {
  categories: {
    layout: {
      title: 'Layout',
      components: ['Grid']
    },
    text: {
      title: 'Text',
      components: ['Header']
    }
  },
  components: {
    Header: {
      fields: {
        inputTitle,  
        fontBold,
        fontSize,
        fontColor,
      },
      render: (props: any) => {
        const { inputTitle, fontBold, fontSize, fontColor } = props;
        return (
          <div
            className={[fontBold, fontSize, fontColor]
              .filter(Boolean)
              .join(" ")}
          >
            <h1>{inputTitle ?? "Input Text Header"}</h1>
          </div>
        );
      },
    },
    Grid: {
      fields: {
        columns: {
          type: 'number',
          label: 'Grid Columns',
          min: 1,
          max: 12,
        },
        gap: {
          type: 'number',
          label: 'Gap',
          min: 0,
          max: 10,
        },
      },
      render: (props: { columns: number; gap: number }) => {
        const { columns, gap } = props;
        const columnArray = Array.from({ length: columns }, (_, i) => i);
        return (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: `${gap * 0.25}rem`,
            }}
          >
            {columnArray.map((columnIndex) => (
              <div
                key={columnIndex}
                className="min-h-[200px] border-2 border-dashed border-gray-300 p-2"
              >
                <DropZone
                  zone={`column-${columnIndex + 1}`}
                />
              </div>
            ))}
          </div>
        );
      },
    },
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