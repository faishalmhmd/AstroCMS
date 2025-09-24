import type { Slot } from "@measured/puck";

type HeaderProps = {
    inputTitle: string | number;
    fontBold: string;
    fontSize: string;
    fontColor: string;
};

type GridProps = {
    col: number;
    colMd: number;
    colSm: number;
    gapX: number;
    gapY: number;
    paddingX: number;
    paddingY: number;
    Content: Slot;
};

type LeftSidebarProps = {
    col: number;
    colMd: number;
    colSm: number;
    gapX: number;
    gapY: number;
    paddingX: number;
    paddingY: number;
    Content: Slot;
};

type CardProps = {
    Content : Slot;
    padding: number;
    backgroundColor: string;
    borderRadius: number;
}

export interface ComponentInterface {
  Header: HeaderProps;
  Grid: GridProps;
  Card: CardProps;
  LeftSidebar: LeftSidebarProps;
}

export type { HeaderProps, GridProps, CardProps}
