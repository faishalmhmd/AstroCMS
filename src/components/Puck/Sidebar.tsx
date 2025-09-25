import { Layers } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Sidebar({ pages }: { pages: string[] }) {
  return (
    <div className="border-r bg-zinc-900 text-white p-4">
      <h3 className="font-bold mb-2">Pages</h3>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <span className="flex gap-4 items-center">
              <Layers />
              Pages
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {pages.map((name) => (
              <li key={name} className="list-none">
                <a href={`/${name}`} className="hover:underline">
                  {name}
                </a>
              </li>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
