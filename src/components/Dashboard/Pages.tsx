import { useEffect, useState } from 'react';
import { Pencil, Trash2, PackagePlusIcon, FilePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProjectItem } from '../Dashboard/Projects';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';

type PageItem = {
  _id: string;
  title?: string;
  slug?: string;
  updatedAt?: string;
  root?: { props?: { title?: string } };
};

interface PagesProps {
  project?: ProjectItem;
}

export default function Pages({ project }: PagesProps) {
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [form, setForm] = useState({
    title: '',
    projectId: project?._id,
  });

  useEffect(() => {
    if (project) {
      getDataPages(project?._id ?? '');
    }
  }, [project]);

  // function to get data pages
  // return: none
  const getDataPages = async (id: string) => {
    try {
      const res = await axios.get(`/api/pages?projectId=${id}`);
      setPages(res.data.pages);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  // function to handle get data pages with params
  // return: list pages
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/pages/${id}`);
      // Refresh the pages list after deletion
      if (project) {
        await getDataPages(project._id);
      }
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  // function to handle edit with params id
  // return: none
  const handleEdit = (id: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/edit/${id}`;
    }
  };

  // function to handle create data
  // return: none
  const onCreate = async () => {
    if (!form.title.trim()) return;
    await axios.post('/api/pages', { ...form });
    setForm({ title: '', projectId: project?._id });
    setOpen(false);
  };
  return (
    <main className="space-y-6">
      {project ? (
        <div className="border not-first:border-neutral-700 flex bg-neutral-900 p-1 rounded-sm gap-2">
          <div className="uppercase">Project Id : {project?._id}</div>
          <Badge variant="outline">Project Name : {project?.name}</Badge>
        </div>
      ) : (
        <div className="bg-neutral-900 border p-4 rounded-lg text-red-700">
          <div className="">Select Project First</div>
          <p className="text-sm text-red-800">
            Please choose a project from the list to view its details.
          </p>
        </div>
      )}
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="!bg-green-600">
              <FilePlus className="h-4 w-4" />
              New Pages
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new project.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-2">
                  Name
                </Label>
                <Input
                  id="name"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="outline"
                onClick={onCreate}
                className="!bg-green-600"
              >
                <FilePlus className="h-4 w-4 " /> Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border border-neutral-700 overflow-hidden">
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
            {pages.map((page, idx) => (
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
