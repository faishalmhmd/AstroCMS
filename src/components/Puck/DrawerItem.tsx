import { LayoutGrid,HeadingIcon,Cuboid,PanelLeft } from "lucide-react";
import React from "react";

const DrawerItemIcon = ({ name }: { name: string }) => {
  return (
    <React.Fragment>
      {name === "Grid" ? <LayoutGrid width={18} height={18}/> : null}
      {name === "Header" ? <HeadingIcon width={18} height={18}/> : null}
      {name === "Card" ? <Cuboid width={18} height={18}/> : null}
      {name === "LeftSidebar" ? <PanelLeft width={18} height={18}/> : null}
    </React.Fragment>
  );
};

export default function DrawerItem({ name }: { name: string }) {
  return (
    <div className="border-zinc-300 border bg-white p-2 rounded flex items-center gap-2 cursor-grab hover:bg-zinc-400">
      <DrawerItemIcon name={name} /> {name}
    </div>
  );
}
