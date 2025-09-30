import React from 'react';
import { formatBytes, formatUptime } from '@/lib/format';
import type { ServerStatusView } from '@/interface';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import {
  Server,
  Database,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Users,
} from 'lucide-react';

export type ChartDataItem = { name: string; value: number; color: string };
export type MemoryUsageData = { name: string; value: number };

interface MongoDBProps {
  serverStatus: ServerStatusView | null;
}

export default function MongoDBTab({
  serverStatus,
}: MongoDBProps): React.ReactElement {
  const mongoStats: ServerStatusView | null = serverStatus ?? null;

  const getCurrentConnections = () => mongoStats?.connections?.current ?? 0;
  const getAvailableConnections = () => mongoStats?.connections?.available ?? 0;
  const getTotalCreated = () => mongoStats?.connections?.totalCreated ?? 0;
  const getNetworkRequests = () => mongoStats?.network?.numRequests ?? 0;
  const getPhysicalBytesIn = () => mongoStats?.network?.physicalBytesIn ?? 0;
  const getPhysicalBytesOut = () => mongoStats?.network?.physicalBytesOut ?? 0;

  const opCountersData: ChartDataItem[] = [
    {
      name: 'Query',
      value: mongoStats?.opcounters?.query ?? 0,
      color: '#ffffff',
    },
    {
      name: 'Command',
      value: mongoStats?.opcounters?.command || 0,
      color: '#a1a1aa',
    },
    {
      name: 'Update',
      value: mongoStats?.opcounters?.update || 0,
      color: '#71717a',
    },
    {
      name: 'Insert',
      value: mongoStats?.opcounters?.insert || 0,
      color: '#52525b',
    },
    {
      name: 'Delete',
      value: mongoStats?.opcounters?.delete || 0,
      color: '#3f3f46',
    },
  ];

  const networkData: ChartDataItem[] = [
    {
      name: 'Bytes In',
      value: mongoStats?.network?.bytesIn || 0,
      color: '#ffffff',
    },
    {
      name: 'Bytes Out',
      value: mongoStats?.network?.bytesOut || 0,
      color: '#a1a1aa',
    },
    { name: 'Physical In', value: getPhysicalBytesIn(), color: '#71717a' },
    { name: 'Physical Out', value: getPhysicalBytesOut(), color: '#52525b' },
  ];

  const getCacheUsagePercentage = (): number => {
    if (!mongoStats?.wiredTiger) return 0;
    const current =
      (mongoStats.wiredTiger as any)['bytes currently in the cache'] || 0;
    const max = (mongoStats.wiredTiger as any)['maximum bytes configured'] || 1;
    return (current / max) * 100;
  };

  const memoryUsage: MemoryUsageData[] = [
    { name: 'Cache Usage', value: getCacheUsagePercentage() },
  ];

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-zinc-800 rounded-full">
                <Server className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white"></h2>
                <p className="text-zinc-400">MongoDB v• Running for </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-zinc-800 text-white border-zinc-700"
            >
              Online
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white">Connections</CardTitle>
              <Users className="h-5 w-5 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {getCurrentConnections()}
            </div>
            <div className="text-zinc-400 text-sm mt-1">available</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white">Operations</CardTitle>
              <Activity className="h-5 w-5 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {Object.values(mongoStats?.opcounters ?? {}).reduce(
                (a: number, b: number) => a + b,
                0
              )}
            </div>
            <div className="text-zinc-400 text-sm mt-1">Total operations</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white">Memory</CardTitle>
              <HardDrive className="h-5 w-5 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {(mongoStats?.memory?.resident ?? 0).toLocaleString()} MB
            </div>
            <div className="text-zinc-400 text-sm mt-1">Resident memory</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-white">Network</CardTitle>
              <Network className="h-5 w-5 text-zinc-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {getNetworkRequests()}
            </div>
            <div className="text-zinc-400 text-sm mt-1">Total requests</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operations Breakdown */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-5 w-5 text-zinc-400" />
              Operations Breakdown
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Distribution of database operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={opCountersData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {opCountersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    Number(value).toLocaleString(),
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #3f3f46',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {opCountersData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-zinc-300">
                    {item.name}: {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Network Traffic */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Network className="h-5 w-5 text-zinc-400" />
              Network Traffic
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Data transfer statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={networkData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#a1a1aa' }}
                />
                <YAxis
                  tickFormatter={formatBytes}
                  tick={{ fontSize: 12, fill: '#a1a1aa' }}
                />
                <Tooltip
                  formatter={(value) => formatBytes(Number(value))}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #3f3f46',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {networkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cache Performance */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Cpu className="h-5 w-5 text-zinc-400" />
              Cache Performance
            </CardTitle>
            <CardDescription className="text-zinc-400">
              WiredTiger cache statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 text-zinc-300">
                <span>Cache Usage</span>
                <span>
                  {formatBytes(
                    (mongoStats?.wiredTiger as any)?.[
                      'bytes currently in the cache'
                    ] || 0
                  )}{' '}
                  /
                  {formatBytes(
                    (mongoStats?.wiredTiger as any)?.[
                      'maximum bytes configured'
                    ] || 1
                  )}
                </span>
              </div>
              <Progress
                value={getCacheUsagePercentage()}
                className="h-2 bg-zinc-800"
              />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Pages in Cache</span>
                <span className="font-medium text-white">
                  {(mongoStats?.wiredTiger as any)?.[
                    'pages currently held in the cache'
                  ] || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Cache Requests</span>
                <span className="font-medium text-white">
                  {(
                    ((mongoStats?.wiredTiger as any)?.[
                      'pages requested from the cache'
                    ] || 0) as number
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Pages Read</span>
                <span className="font-medium text-white">
                  {(mongoStats as any)?.['pages read into cache'] || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Pages Written</span>
                <span className="font-medium text-white">
                  {(mongoStats as any)?.['pages written from cache'] || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Details */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-zinc-400" />
              Connection Details
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Active connection monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart
                innerRadius="30%"
                outerRadius="90%"
                data={memoryUsage}
              >
                <RadialBar dataKey="value" cornerRadius={10} fill="#ffffff" />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="space-y-2 text-sm mt-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Current Connections</span>
                <span className="font-medium text-white">
                  {getCurrentConnections()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Active Connections</span>
                <span className="font-medium text-white"></span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Created</span>
                <span className="font-medium text-white">
                  {getTotalCreated()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Rejected</span>
                <span className="font-medium text-white"></span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Available</span>
                <span className="font-medium text-white">
                  {getAvailableConnections().toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Server className="h-5 w-5 text-zinc-400" />
              System Information
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Server configuration details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400">Host</div>
              <div className="font-medium text-white">
                {mongoStats?.server?.host ?? 'N/A'}
              </div>
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400">Version</div>
              <div className="font-medium text-white">
                MongoDB {mongoStats?.server?.version ?? 'N/A'}
              </div>
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400">Process ID</div>
              <div className="font-medium text-white">
                {mongoStats?.server?.pid ?? 'N/A'}
              </div>
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400">Uptime</div>
              <div className="font-medium text-white">
                {mongoStats?.server?.uptime
                  ? formatUptime(mongoStats.server.uptime)
                  : 'N/A'}
              </div>
            </div>
            <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="text-sm text-zinc-400">Virtual Memory</div>
              <div className="font-medium text-white">
                {mongoStats?.memory?.virtual ?? 0} MB
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-zinc-500 mt-8">
        Last updated: {new Date().toLocaleString()} • Dashboard auto-refreshes
        every 30 seconds
      </div>
    </div>
  );
}
