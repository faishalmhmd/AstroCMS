import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Blocks } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from './ModeToggle';

interface IPages<T = any> {
  _id: string;
  title?: string;
  slug?: string;
  content?: T;
  root: IRootPages;
}

interface IRootPages  {
    props : {
        title: string
    }
}

export default function Dashboard(): React.ReactElement {
  const [pages, setPages] = useState<IPages[]>([]);

  useEffect(() => {
    const getPages = async () => {
      try {
        const response = await axios.get('/api/get-pages');
        if (response.data.success) {
          console.log('📄 Halaman ditemukan:', response.data.pages);
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
    <div className="w-full h-full grid grid-cols-[10fr_90fr] text-black dark:text-white bg-zinc-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <div className="bg-zinc-100 dark:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700 p-5">
        <div className="mb-6">
          <div className="flex gap-2 items-center">
            <Blocks className="w-5 h-5" />
            <span className="font-semibold text-xl">Builder</span>
          </div>
        </div>
        
        {pages.length === 0 ? (
          <p className="text-muted-foreground dark:text-zinc-400">Tidak ada halaman ditemukan.</p>
        ) : (
          <div className="space-y-4">
            {pages.map((page,index) => (
                <div className="" key={page._id}>
                    {page.root.props.title ? page.root.props.title : `Untitled ${index +1}`}
                </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-zinc-50 dark:bg-zinc-900">
        <div className="border-b border-zinc-300 dark:border-zinc-700 flex justify-between items-center p-4">
          <div className="font-semibold">Dashboard</div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
