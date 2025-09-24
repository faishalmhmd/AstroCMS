import type { ComponentConfig, Slot } from "@measured/puck";
import { InputField } from "@/lib/tailwind/utilInput";

export type GridProps = {
  col: number;
  colMd: number;
  colSm: number;
  gapX: number;
  gapY: number;
  paddingX: number;
  paddingY: number;
  Content: Slot;
};

export const LeftSidebar: ComponentConfig<GridProps> = {
  label: "LeftSidebar",
  fields: {
    col: InputField({
      label: "Col Default Size",
      placeholder: "Masukkan jumlah kolom...",
      type: "number",
      min: 1,
      max: 24,
    }),
    colMd: InputField({
      label: "Col Mobile Size",
      placeholder: "Jumlah kolom untuk mobile...",
      type: "number",
      min: 1,
      max: 24,
    }),
    colSm: InputField({
      label: "Col Tablet Size",
      placeholder: "Jumlah kolom untuk tablet...",
      type: "number",
      min: 1,
      max: 24,
    }),
    gapX: InputField({
      label: "Gap X",
      placeholder: "Gap horizontal antar kolom...",
      type: "number",
      min: 0,
    }),
    gapY: InputField({
      label: "Gap Y",
      placeholder: "Gap vertikal antar baris...",
      type: "number",
      min: 0,
    }),
    paddingX: InputField({
      label: "Padding X",
      placeholder: "Padding kiri-kanan...",
      type: "number",
      min: 0,
    }),
    paddingY: InputField({
      label: "Padding Y",
      placeholder: "Padding atas-bawah...",
      type: "number",
      min: 0,
    }),
    Content: {
      type: "slot",
    },
  },
  defaultProps: {
    col: 2,
    colMd: 2,
    colSm: 2,
    gapX: 16,
    gapY: 16,
    paddingX: 16,
    paddingY: 16,
    Content: [],
  },
  render: ({ col, colMd, colSm, gapX, gapY, paddingX, paddingY, Content }) => {
    return (
      <div className="grid grid-cols-[10fr_90fr] h-screen">
        <div className="">herererer</div>
        <Content
          className="grid-container grid"
          style={{
            gridTemplateColumns: `repeat(${col}, minmax(0, 1fr))`,
            columnGap: `${gapX}px`,
            rowGap: `${gapY}px`,
            padding: `${paddingY}px ${paddingX}px`,
          }}
          collisionAxis="dynamic"
        />
        <style>
          {`
            @media (max-width: 500px) {
              .grid-container {
                grid-template-columns: repeat(${colMd}, minmax(0, 1fr)) !important;
              }
            }

            @media (min-width: 501px) and (max-width: 1024px) {
              .grid-container {
                grid-template-columns: repeat(${colSm}, minmax(0, 1fr)) !important;
              }
            }
          `}
        </style>
      </div>
    );
  },
};
