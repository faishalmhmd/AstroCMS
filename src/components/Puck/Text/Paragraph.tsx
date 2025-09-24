import { useState, useMemo, useCallback, type KeyboardEvent } from "react";
import { Bold,Italic,Underline,Code,TextAlignStart,TextAlignJustify,TextAlignEnd,TextAlignCenter } from "lucide-react";
import {
  createEditor,
  type Descendant,
  type BaseEditor,
  Transforms,
  Text,
  type NodeEntry,
  Element as SlateElement,
  Editor
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  type RenderLeafProps,
  type RenderElementProps
} from "slate-react";
import { withHistory, type HistoryEditor } from "slate-history";

import type { ComponentConfig } from "@measured/puck";
import type { ParagraphProps } from "@/interface";
import { Button } from "@/components/ui/button";

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

type ParagraphElement = {
  type: "paragraph";
  align?: "left" | "center" | "right" | "justify";
  children: CustomText[];
};

type CustomElement = ParagraphElement;

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;


const toggleMark = (editor: CustomEditor, format: keyof CustomText) => {
  const marks = Editor.marks(editor) as Partial<CustomText> | null;
  const isActive = marks ? !!marks[format] : false;
  if (isActive) Editor.removeMark(editor, format as any);
  else Editor.addMark(editor, format as any, true);
};

const setAlign = (editor: CustomEditor, align: "left" | "center" | "right" | "justify") => {
  const paragraphEntry = Editor.above(editor, {
    match: n => SlateElement.isElement(n) && (n as any).type === "paragraph",
  });

  if (paragraphEntry) {
    const [, path] = paragraphEntry as NodeEntry<SlateElement>;
    const currentAlign = ((paragraphEntry[0] as any).align) as typeof align | undefined;
    Transforms.setNodes(editor, { align: currentAlign === align ? undefined : align } as any, { at: path });
  }
};

const serialize = (nodes: Descendant[]): string => {
  return nodes
    .map(node => {
      if (Text.isText(node)) {
        let text = node.text;
        const leaf = node as CustomText;
        if (leaf.bold) text = `<strong>${text}</strong>`;
        if (leaf.italic) text = `<em>${text}</em>`;
        if (leaf.underline) text = `<u>${text}</u>`;
        if (leaf.code) text = `<code>${text}</code>`;
        return text.replace(/\n/g, "<br />");
      }

      if (SlateElement.isElement(node)) {
        const elem = node as CustomElement;
        const children = serialize(elem.children as Descendant[]);
        const styleAttr = elem.align ? ` style="text-align:${elem.align};"` : "";
        switch (elem.type) {
          case "paragraph":
            return `<p${styleAttr}>${children}</p>`;
          default:
            return children;
        }
      }

      return "";
    })
    .join("");
};

export const Paragraph: ComponentConfig<ParagraphProps> = {
  fields: {
    title: {
      type: "custom",
      render: ({ name, onChange, value }: { name: string; onChange: (v: string) => void; value: string }) => {
        const initialValue: Descendant[] = useMemo(() => {
          if (value) {
            return [
              {
                type: "paragraph",
                children: [{ text: value.replace(/<[^>]+>/g, "") }]
              } as SlateElement
            ];
          }
          return [{ type: "paragraph", children: [{ text: "" }] } as SlateElement];
        }, [value]);

        const editor = useMemo<CustomEditor>(() => withHistory(withReact(createEditor())), []);
        const [val, setVal] = useState<Descendant[]>(initialValue);

        const handleChange = useCallback(
          (newValue: Descendant[]) => {
            setVal(newValue);
            const html = serialize(newValue);
            onChange(html);
          },
          [onChange]
        );

        const renderLeaf = useCallback(({ attributes, children, leaf }: RenderLeafProps) => {
          const customLeaf = leaf as CustomText;
          if (customLeaf.bold) children = <strong>{children}</strong>;
          if (customLeaf.italic) children = <em>{children}</em>;
          if (customLeaf.underline) children = <u>{children}</u>;
          if (customLeaf.code) children = <code>{children}</code>;
          return <span {...attributes}>{children}</span>;
        }, []);

        const renderElement = useCallback(({ attributes, children, element }: RenderElementProps) => {
          const el = element as CustomElement;
          const style = el.align ? { textAlign: el.align as any } : undefined;
          return (
            <p {...attributes} style={{ whiteSpace: "pre-wrap", ...(style || {}) }}>
              {children}
            </p>
          );
        }, []);

        return (
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" type="button" onMouseDown={e => { e.preventDefault(); toggleMark(editor, "bold"); }}><Bold /></Button>
                <Button variant="outline" size="sm" type="button" onMouseDown={e => { e.preventDefault(); toggleMark(editor, "italic"); }}><Italic/></Button>
                <Button variant="outline" size="sm" type="button" onMouseDown={e => { e.preventDefault(); toggleMark(editor, "underline"); }}><Underline/></Button>
                <Button variant="outline" size="sm" type="button" onMouseDown={e => { e.preventDefault(); toggleMark(editor, "code"); }}><Code/></Button>
              </div>
              <div className="flex flex-col">
                <span className="text-xs">Text Align</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" type="button" onMouseDown={e => { e.preventDefault(); setAlign(editor, "left"); }}><TextAlignStart/></Button>
                  <Button variant="outline" size="sm" type="button" onMouseDown={e => { e.preventDefault(); setAlign(editor, "center"); }}><TextAlignCenter/></Button>
                  <Button variant="outline" size="sm" type="button" onMouseDown={e => { e.preventDefault(); setAlign(editor, "right"); }}><TextAlignEnd/></Button>
                  <Button variant="outline" size="sm" type="button" onMouseDown={e => { e.preventDefault(); setAlign(editor, "justify"); }}><TextAlignJustify/></Button>
                </div>
              </div>
            </div>

            <Slate editor={editor} initialValue={val} onChange={handleChange}>
              <Editable
              className="p-2 border border-zinc-300 rounded-sm min-h-[100px]"
                renderLeaf={renderLeaf}
                renderElement={renderElement}
              />
            </Slate>
          </div>
        );
      }
    }
  },

  render: ({ title }: { title: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: title }} />;
  }
};
