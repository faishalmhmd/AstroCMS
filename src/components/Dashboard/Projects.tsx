import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  FilePlus,
  Pencil,
  Trash2,
  Package,
  Hammer,
  PackagePlusIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export type ProjectItem = {
  _id: string;
  name?: string;
  slug?: string;
  status?: string;
  description?: string;
  updatedAt?: string;
};

interface ProjectsProps {
  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  onClickDevelop: (param: ProjectItem) => void;
}

export default function Projects({
  projects,
  setProjects,
  onClickDevelop,
}: ProjectsProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'new',
  });

  // function to refersh / get Data
  // return: none
  const refresh = async () => {
    const res = await axios.get('/api/projects');
    if (res.data?.success) setProjects(res.data.projects);
  };

  // function to handle create data
  // return: none
  const onCreate = async () => {
    if (!form.name.trim()) return;
    await axios.post('/api/projects', { ...form });
    setForm({ name: '', slug: '', description: '', status: 'new' });
    setOpen(false);
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
              <Button variant="outline">
                <PackagePlusIcon className="h-4 w-4" />
                New Project
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
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="mb-2">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="mb-2">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
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
                  <TableHead className="text-zinc-300">Desc</TableHead>
                  <TableHead className="text-zinc-300">Slug</TableHead>
                  <TableHead className="text-zinc-300">ID</TableHead>
                  <TableHead className="text-zinc-300">
                    Status Project
                  </TableHead>
                  <TableHead className="text-zinc-300">Updated At</TableHead>
                  <TableHead className="text-right text-zinc-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p, idx) => (
                  <TableRow key={p._id} className="border">
                    <TableCell className="text-zinc-300">{idx + 1}</TableCell>
                    <TableCell className="text-zinc-300">
                      {p.name || '-'}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {p.description || '-'}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      <Badge variant="outline">{p.slug || '-'}</Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300 uppercase">
                      {p._id}
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      <Badge variant="outline">✅ New </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {p.updatedAt || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Hammer Button with Tooltip */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="!bg-violet-600"
                            >
                              <Hammer className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Build Project</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Package Button with Dialog + Tooltip */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => onClickDevelop(p)}
                                  className="!bg-violet-600"
                                >
                                  <Package className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Develop Project</DialogTitle>
                                  <DialogDescription>
                                    Manage development settings for this
                                    project.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                  <p>
                                    <strong>Name:</strong> {p.name}
                                  </p>
                                  <p>
                                    <strong>Slug:</strong> {p.slug}
                                  </p>
                                  <p>
                                    <strong>Description:</strong>{' '}
                                    {p.description}
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Develop Project</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Edit Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="!bg-violet-600"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Page</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Delete Button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="!bg-violet-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Page</p>
                          </TooltipContent>
                        </Tooltip>
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
