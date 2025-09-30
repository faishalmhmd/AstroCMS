import React, { useEffect, useState } from 'react';
import {
  FileText,
  FileWarning,
  FileCheck,
  FilePlus,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import axios from 'axios';

type PageItem = {
  _id: string;
  title?: string;
  slug?: string;
  updatedAt?: string;
  root?: { props?: { title?: string } };
};

interface PagesProps {
  pages: PageItem[];
}

export default function Pages({ pages }: PagesProps) {
  const [localPages, setLocalPages] = useState<PageItem[]>(pages);

  useEffect(() => {
    setLocalPages(pages);
  }, [pages]);

  const handleDelete = async (id: string) => {
    const confirmed =
      typeof window !== 'undefined'
        ? window.confirm('Are you sure you want to delete this page?')
        : false;
    if (!confirmed) return;

    try {
      const res = await axios.delete(`/api/deleted-page/${id}`);
      if (res.data?.success) {
        setLocalPages((prev) => prev.filter((p) => p._id !== id));
      } else {
        console.error('Failed to delete page:', res.data?.error);
      }
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  const handleEdit = (id: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/edit/${id}`;
    }
  };
  return (
    <main className="space-y-6">
      <div className="rounded-md border border-zinc-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900">
            <TableRow>
              <TableHead className="w-[50px] text-zinc-300">No</TableHead>
              <TableHead className="text-zinc-300">Title</TableHead>
              <TableHead className="text-zinc-300">Slug</TableHead>
              <TableHead className="text-zinc-300">ID</TableHead>
              <TableHead className="text-zinc-300">Updated At</TableHead>
              <TableHead className="text-right text-zinc-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localPages.map((page, idx) => (
              <TableRow key={page._id} className="border-zinc-700">
                <TableCell className="text-zinc-300">{idx + 1}</TableCell>
                <TableCell className="text-zinc-300">
                  {page.root?.props?.title || page.title || 'Untitled'}
                </TableCell>
                <TableCell className="text-zinc-300">
                  {page.slug || '-'}
                </TableCell>
                <TableCell className="text-zinc-300">{page._id}</TableCell>
                <TableCell className="text-zinc-300">
                  {page.updatedAt || '-'}
                </TableCell>
                <TableCell className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(page._id)}
                    className="border text-zinc-300 hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(page._id)}
                    className="text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
