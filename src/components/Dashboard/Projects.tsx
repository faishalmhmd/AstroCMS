import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { FilePlus } from 'lucide-react';

export type ProjectItem = {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  updatedAt?: string;
};

interface ProjectsProps {
  projects: ProjectItem[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Projects</CardTitle>
          <FilePlus className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-900">
                <TableRow>
                  <TableHead className="w-[50px] text-zinc-300">No</TableHead>
                  <TableHead className="text-zinc-300">Name</TableHead>
                  <TableHead className="text-zinc-300">Slug</TableHead>
                  <TableHead className="text-zinc-300">ID</TableHead>
                  <TableHead className="text-zinc-300">Updated At</TableHead>
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
