import type { ComponentConfig, Slot } from "@measured/puck";
import clsx from "clsx";

export type GridProps = {
    columns: number;
    Content1: Slot;
};

export const Grid: ComponentConfig<GridProps> = {
    fields: {
        columns: {
            type: "number",
            label: "Columns",
            min: 1,
            max: 24,
        },
        Content1: {
            type: "slot",
        },
    },
    defaultProps: {
        columns: 2,
        Content1: [],
    },
    render: ({ columns, Content1 }) => {
        return (
<div>
        <div className="col-span-1 border border-dashed p-2">
                <Content1
                    className={clsx("grid", {
                        "grid-cols-1": columns === 1,
                        "grid-cols-2": columns === 2,
                        "grid-cols-3": columns === 3,
                        "grid-cols-4": columns === 4,
                        // … sampai max 24
                    })}
                    collisionAxis="dynamic"
                />
            </div>
        </div>
        );
    },
};
