import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Blocks, Layers2, Menu, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ModeToggle } from './ModeToggle';

interface IPages<T = any> {
  _id: string;
  title?: string;
  slug?: string;
  content?: T;
  root: IRootPages;
}

interface IRootPages {
  props: {
    title: string;
  };
}

export default function Dashboard(): React.ReactElement {
  const [pages, setPages] = useState<IPages[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const getPages = async () => {
      try {
        const response = await axios.get('/api/get-pages');
        if (response.data.success) {
          setPages(response.data.pages);
        } else {
          console.error('❌ Gagal mengambil halaman:', response.data.error);
        }
      } catch (error) {
        console.error('❌ Error saat fetch halaman:', error);
      }
    };

    getPages();
  }, []);

  return (
    <div className="w-full h-full flex text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 transition-colors">
      {/* Sidebar */}
      <div
        className={`
          ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}
          transition-all duration-300 ease-in-out
          bg-zinc-100 dark:bg-zinc-800 
          border-r border-zinc-300 dark:border-zinc-700 
          p-4 space-y-4 overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Blocks className="w-5 h-5" />
            {!isCollapsed && (
              <span className="font-semibold text-xl">Builder</span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded bg-white text-black transition"
          >
            {isCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        <div className="">
          {/* Pages Accordion */}
          {pages.length === 0 ? (
            <p className="text-muted-foreground dark:text-zinc-400 text-sm">
              {!isCollapsed && 'Tidak ada halaman ditemukan.'}
            </p>
          ) : (
            <Accordion
              defaultValue="pages"
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value="pages">
                <AccordionTrigger hideArrow={isCollapsed}>
                  <div className="flex items-center gap-2">
                    <Layers2 size={16} />
                    {!isCollapsed && 'Pages'}
                  </div>
                </AccordionTrigger>
                {!isCollapsed && (
                  <AccordionContent>
                    <div className="space-y-2">
                      {pages.map((page, index) => (
                        <div
                          key={page._id}
                          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {page.root.props.title || `Untitled ${index + 1}`}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                )}
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
        {/* Topbar */}
        <div className="border-b border-zinc-300 dark:border-zinc-700 flex justify-between items-center p-4">
          <div className="font-semibold">Dashboard</div>
          <ModeToggle />
        </div>

        {/* Page Content */}
        <div className="p-6">Main content here...</div>
      </div>
    </div>
  );
}
