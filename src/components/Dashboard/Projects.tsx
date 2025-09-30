import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { FilePlus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export type ProjectItem = {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  updatedAt?: string;
};

interface ProjectsProps {
  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
}

export default function Projects({ projects, setProjects }: ProjectsProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  const refresh = async () => {
    const res = await axios.get('/api/projects/index');
    if (res.data?.success) setProjects(res.data.projects);
  };

  const onCreate = async () => {
    if (!form.name.trim()) return;
    await axios.post('/api/projects/index', { ...form });
    setForm({ name: "", slug: "", description: "" });
    setOpen(false);
    await refresh();
  };

  const onEdit = async (p: ProjectItem) => {
    const name = prompt('Project name?', p.name || '') ?? p.name;
    const slug = prompt('Slug?', p.slug || '') ?? p.slug;
    const description = prompt('Description?', p.description || '') ?? p.description;
    await axios.patch('/api/update-project', {
      id: p._id,
      name,
      slug,
      description,
    });
    await refresh();
  };

  const onDelete = async (p: ProjectItem) => {
    const ok = confirm(`Delete project "${p.name || p._id}"?`);
    if (!ok) return;
    await axios.delete(`/api/delete-project/${encodeURIComponent(p._id)}`);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-neutral-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Projects</CardTitle>

          {/* Create Project Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">New Project</Button>
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
                  <Label htmlFor="name" className='mb-2'>Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className='mb-2'>Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className='mb-2'>Description</Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  className="border text-zinc-200 hover:bg-zinc-800"
                >
                  <FilePlus className="h-4 w-4 mr-2" /> Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-black">
                <TableRow>
                  <TableHead className="w-[50px] text-zinc-300">No</TableHead>
                  <TableHead className="text-zinc-300">Name</TableHead>
                  <TableHead className="text-zinc-300">Slug</TableHead>
                  <TableHead className="text-zinc-300">ID</TableHead>
                  <TableHead className="text-zinc-300">Updated At</TableHead>
                  <TableHead className="text-right text-zinc-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p, idx) => (
                  <TableRow key={p._id} className="border-zinc-700">
                    <TableCell className="text-zinc-300">{idx + 1}</TableCell>
                    <TableCell className="text-zinc-300">{p.name || '-'}</TableCell>
                    <TableCell className="text-zinc-300">{p.slug || '-'}</TableCell>
                    <TableCell className="text-zinc-300">{p._id}</TableCell>
                    <TableCell className="text-zinc-300">{p.updatedAt || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(p)}
                          className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => onDelete(p)}
                          className="text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
