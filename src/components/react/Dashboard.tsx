import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from './ModeToggle';
interface Page {
  _id: string;
  title?: string;
  slug?: string;
  content?: any;
}

export default function Dashboard(): React.ReactElement {
  const [pages, setPages] = useState<Page[]>([]);

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
    <div className="w-full h-full bg-red-500 grid grid-cols-[10fr_90fr]">
     <div className="bg-white">
        <ModeToggle/>
      {pages.length === 0 ? (
          <p className="text-muted-foreground">Tidak ada halaman ditemukan.</p>
        ) : (
            <div className="space-y-4">
          {pages.map((page) => (
              <Card key={page._id}>
              <CardHeader>
                <CardTitle>{page.title || 'Tanpa Judul'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Slug: <code>{page.slug || 'n/a'}</code>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
