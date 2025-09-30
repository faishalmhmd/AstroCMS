import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HostInfoProps {
  hostInfo: any;
}

export default function HostInfoTab({
  hostInfo,
}: HostInfoProps): React.ReactElement {
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Host Information</CardTitle>
            <Badge
              variant="secondary"
              className="bg-zinc-800 text-white border-zinc-700"
            >
              {hostInfo?.system?.hostname ?? 'unknown'}
            </Badge>
          </div>
          <CardDescription className="text-zinc-400">
            OS and hardware details from MongoDB hostInfo
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-sm text-zinc-400">Hostname</div>
            <div className="font-medium text-white">
              {hostInfo?.system?.hostname ?? 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-sm text-zinc-400">Current Time</div>
            <div className="font-medium text-white">
              {hostInfo?.system?.currentTime ?? 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-sm text-zinc-400">CPU Arch</div>
            <div className="font-medium text-white">
              {hostInfo?.system?.cpuArch ?? hostInfo?.os?.type ?? 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-sm text-zinc-400">CPU Cores</div>
            <div className="font-medium text-white">
              {hostInfo?.system?.numCores ?? 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-sm text-zinc-400">Memory (MB)</div>
            <div className="font-medium text-white">
              {hostInfo?.system?.memSizeMB ?? 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-sm text-zinc-400">OS</div>
            <div className="font-medium text-white">
              {hostInfo?.os?.name ?? hostInfo?.os?.type ?? 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-sm text-zinc-400">OS Version</div>
            <div className="font-medium text-white">
              {hostInfo?.os?.version ?? 'N/A'}
            </div>
          </div>
          <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
            <div className="text-sm text-zinc-400">Kernel Version</div>
            <div className="font-medium text-white">
              {hostInfo?.os?.kernelVersion ?? 'N/A'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
