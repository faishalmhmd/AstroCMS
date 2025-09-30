import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { formatSecs } from '@/lib/format';

interface CurrentOpItem {
  opid: string | number;
  ns?: string;
  type?: string;
  active?: boolean;
  waitingForLock?: boolean;
  secs_running?: number;
  client?: string;
  appName?: string;
  desc?: string;
}

interface CurrentOpsProps {
  currentOps: CurrentOpItem[];
}

export default function CurrentOpsTab({
  currentOps,
}: CurrentOpsProps): React.ReactElement {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-white">Current Operations</CardTitle>
            <CardDescription className="text-zinc-400">
              Live operations from MongoDB currentOp command
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="bg-zinc-800 text-white border-zinc-700"
          >
            {currentOps.length.toLocaleString()} ops
          </Badge>
        </CardHeader>
        <CardContent>
          {currentOps.length === 0 ? (
            <p className="text-sm text-zinc-400">No active operations.</p>
          ) : (
            <div className="rounded-md border border-zinc-700 overflow-auto">
              <Table>
                <TableHeader className="bg-zinc-900">
                  <TableRow>
                    <TableHead className="text-zinc-300">OpID</TableHead>
                    <TableHead className="text-zinc-300">Namespace</TableHead>
                    <TableHead className="text-zinc-300">Type</TableHead>
                    <TableHead className="text-zinc-300">Active</TableHead>
                    <TableHead className="text-zinc-300">Waiting</TableHead>
                    <TableHead className="text-zinc-300">Runtime</TableHead>
                    <TableHead className="text-zinc-300">Client</TableHead>
                    <TableHead className="text-zinc-300">App</TableHead>
                    <TableHead className="text-right text-zinc-300">
                      Desc / Command
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOps.map((op) => (
                    <TableRow key={op.opid} className="border-zinc-700">
                      <TableCell className="text-zinc-300">{op.opid}</TableCell>
                      <TableCell className="text-zinc-300">{op.ns}</TableCell>
                      <TableCell className="text-zinc-300">{op.type}</TableCell>
                      <TableCell className="text-zinc-300">
                        {op.active ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {op.waitingForLock ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {formatSecs(op.secs_running || 0)}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {op.client}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {op.appName}
                      </TableCell>
                      <TableCell className="text-right text-zinc-300 max-w-[420px] truncate">
                        {op.desc}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
