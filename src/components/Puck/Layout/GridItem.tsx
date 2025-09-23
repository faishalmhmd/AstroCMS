import type { ComponentConfig, Slot } from "@measured/puck";

export type GridItemProps = {
  content: Slot;
};

export const GridItem: ComponentConfig<GridItemProps> = {
  fields: {
    content: { type: "slot", label: "Content" },
  },
  defaultProps: {
    content: [], 
  },
  render: ({ content }) => {
    const slots = Array.isArray(content) ? content : [content];

    return (
      <div className="col-span-1 border border-dashed p-2">
        {slots.map((SlotComponent, index) => (
          <SlotComponent key={index} />
        ))}
      </div>
    );
  },
};
