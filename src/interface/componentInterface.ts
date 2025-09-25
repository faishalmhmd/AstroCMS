import type { Slot } from '@measured/puck';
import type { Config } from '@measured/puck';

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
  Sidebar: Slot;
  Content: Slot;
};

type CardProps = {
  Content: Slot;
  padding: number;
  backgroundColor: string;
  borderRadius: number;
};

type ParagraphProps = {
  title: string;
};

export type FlexProps = {
  direction: 'row' | 'column';
  justify:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  align: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  Content: Slot;
};

export interface ComponentInterface {
  Header: HeaderProps;
  Grid: GridProps;
  Flex: FlexProps;
  Card: CardProps;
  LeftSidebar: LeftSidebarProps;
  Paragraph: ParagraphProps;
}

export type { HeaderProps, GridProps, CardProps, ParagraphProps };
