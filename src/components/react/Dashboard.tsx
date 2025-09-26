import React, { useEffect, useState } from 'react';
import { useGetData } from '@/hook/useGetData';
import axios from 'axios';
import {
  Blocks,
  Menu,
  LogOut,
  User,
  Pencil,
  Trash2,
  FileText,
  FileWarning,
  FileCheck,
  FilePlus,
  Server,
  Database,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
import { ModeToggle } from './ModeToggle';

// Type definitions
interface TabButtonProps {
  id: string;
  children: React.ReactNode;
  icon: React.ElementType;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface MemoryUsageData {
  name: string;
  value: number;
}

export default function Dashboard(): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('pages');
  const { stats, pages, setPages, serverStatus } = useGetData();

  console.log(serverStatus);

  // MongoDB stats data with proper fallbacks
  const mongoStats = serverStatus || {
    success: true,
    server: {
      host: 'DESKTOP-RMJUA72',
      version: '8.2.0',
      process: 'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe',
      pid: 5184,
      uptime: 66961,
    },
    connections: {
      current: 21,
      available: 999979,
      totalCreated: 28,
      rejected: 0,
      active: 4,
      queuedForEstablishment: 0,
      establishmentRateLimit: {
        rejected: 0,
        exempted: 0,
        interruptedDueToClientDisconnect: 0,
      },
      threaded: 21,
      exhaustIsMaster: 0,
      exhaustHello: 3,
      awaitingTopologyChanges: 3,
      loadBalanced: 0,
    },
    memory: {
      bits: 64,
      resident: 56,
      virtual: 4488,
      supported: true,
      secureAllocByteCount: 0,
      secureAllocBytesInPages: 0,
    },
    opcounters: {
      insert: 0,
      query: 2452,
      update: 67,
      delete: 0,
      getmore: 0,
      command: 4817,
    },
    network: {
      bytesIn: 1020270,
      bytesOut: 8263763,
      physicalBytesIn: 717028,
      physicalBytesOut: 8263646,
      egress: {
        bytesIn: 0,
        bytesOut: 0,
        physicalBytesIn: 0,
        physicalBytesOut: 0,
        numRequests: 0,
      },
      numSlowDNSOperations: 0,
      numSlowSSLOperations: 0,
      numRequests: 7109,
      tcpFastOpen: {
        serverSupported: false,
        clientSupported: false,
        accepted: 0,
      },
    },
    wiredTiger: {
      'maximum bytes configured': 7733248000,
      'bytes currently in the cache': 78937,
      'pages currently held in the cache': 26,
      'pages requested from the cache': 12729,
      'pages read into cache': 36,
      'pages written from cache': 677,
      'bytes read into cache': 74308,
      'bytes written from cache': 6231651,
    },
  };

  // Helper functions
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  const getCurrentConnections = () => mongoStats?.connections?.current || 0;
  const getActiveConnections = () => mongoStats?.connections || 0;
  const getAvailableConnections = () => mongoStats?.connections?.available || 0;
  const getTotalCreated = () => mongoStats?.connections?.totalCreated || 0;
  const getRejected = () => mongoStats?.connections || 0;
  const getNetworkRequests = () => mongoStats?.network?.numRequests || 0;
  const getPhysicalBytesIn = () =>
    (mongoStats?.network as any)?.physicalBytesIn || 0;
  const getPhysicalBytesOut = () =>
    (mongoStats?.network as any)?.physicalBytesOut || 0;

  // Chart data with safe access
  const opCountersData: ChartDataItem[] = [
    {
      name: 'Query',
      value: mongoStats?.opcounters?.query || 0,
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

  const handleEdit = (pageId: string) => {
    window.location.href = `/edit/${pageId}`;
  };

  const handleDelete = async (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        const response = await axios.delete(`/api/delete-page/${pageId}`);
        if (response.data.success) {
          setPages(pages.filter((page) => page._id !== pageId));
          console.log('✅ Page deleted successfully');
        } else {
          console.error('❌ Failed to delete page:', response.data.error);
        }
      } catch (error) {
        console.error('❌ Error deleting page:', error);
      }
    }
  };

  const TabButton: React.FC<TabButtonProps> = ({
    id,
    children,
    icon: Icon,
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${
          activeTab === id
            ? 'bg-white text-black dark:bg-zinc-800 dark:text-white'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        }
      `}
    >
      <Icon className="h-4 w-4" />
      {!isCollapsed && children}
    </button>
  );

  return (
    <div className="w-full h-full flex text-black dark:text-white bg-zinc-100 dark:bg-neutral-950 transition-colors">
      {/* Sidebar */}
      <div
        className={`
          ${isCollapsed ? 'w-[50px]' : 'w-[250px]'}
          pt-10
          transition-all duration-300 ease-in-out
          bg-zinc-100 dark:bg-neutral-950
          p-4 space-y-4 overflow-hidden
        `}
      >
        <div className="flex items-center gap-2">
          <Blocks className="inline-flex !w-4 !h-4s" />
          {!isCollapsed && (
            <span className="font-semibold text-xl">Builder</span>
          )}
        </div>

        <div className="space-y-2">
          <TabButton id="pages" icon={FileText}>
            Pages
          </TabButton>
          <TabButton id="mongodb" icon={Database}>
            MongoDB
          </TabButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-zinc-50 dark:bg-neutral-950 h-screen p-3 overflow-auto">
        <div className="bg-black h-full rounded-2xl">
          {/* Topbar */}
          <div className="border-b border-zinc-300 dark:border-zinc-700 flex justify-between items-center p-4">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded bg-white text-black transition"
              >
                <Menu size={18} />
              </button>
              <div className="font-semibold ml-2 text-white">
                {activeTab === 'pages'
                  ? 'Pages Dashboard'
                  : 'MongoDB Server Monitor'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Open user menu</span>
                    <div className="w-full h-full rounded-sm bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-sm font-semibold text-black dark:text-white">
                      JD
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">
                      john@example.com
                    </p>
                  </div>

                  <DropdownMenuItem
                    onClick={() => console.log('Go to profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6 h-full overflow-auto">
            {activeTab === 'pages' && (
              <>
                {pages.length === 0 ? (
                  <p className="text-muted-foreground dark:text-zinc-400 text-sm">
                    Tidak ada halaman ditemukan.
                  </p>
                ) : (
                  <main className="space-y-6">
                    {stats && (
                      <>
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-white">
                                Total Pages
                              </CardTitle>
                              <FileText className="h-4 w-4 text-zinc-400" />
                            </CardHeader>
                            <CardContent className="text-2xl font-bold text-white">
                              {stats.overview.totalPages}
                            </CardContent>
                          </Card>

                          <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-white">
                                With Titles
                              </CardTitle>
                              <FileCheck className="h-4 w-4 text-white" />
                            </CardHeader>
                            <CardContent className="text-2xl font-bold text-white">
                              {stats.overview.pagesWithTitles}
                            </CardContent>
                          </Card>

                          <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-white">
                                No Title
                              </CardTitle>
                              <FileWarning className="h-4 w-4 text-white" />
                            </CardHeader>
                            <CardContent className="text-2xl font-bold text-white">
                              {stats.overview.pagesWithoutTitles}
                            </CardContent>
                          </Card>

                          <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                              <CardTitle className="text-white">
                                With Content
                              </CardTitle>
                              <FilePlus className="h-4 w-4 text-white" />
                            </CardHeader>
                            <CardContent className="text-2xl font-bold text-white">
                              {stats.overview.pagesWithContent}
                            </CardContent>
                          </Card>
                        </div>

                        {/* Storage Info */}
                        <Card className="bg-zinc-900 border-zinc-800">
                          <CardHeader>
                            <CardTitle className="text-white">
                              Storage Usage
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-zinc-300">
                            <p>Total Size: {stats.storage.totalSize}</p>
                            <p>Avg Page Size: {stats.storage.avgPageSize}</p>
                            <p>Index Size: {stats.storage.indexSize}</p>
                          </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="bg-zinc-900 border-zinc-800">
                          <CardHeader>
                            <CardTitle className="text-white">
                              Recent Activity
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {stats.recentActivity.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex justify-between items-center border-b border-zinc-700 pb-1"
                                >
                                  <span className="text-zinc-300">
                                    {item.title || 'Untitled'}
                                  </span>
                                  {item.updatedAt && (
                                    <span className="text-sm text-zinc-400">
                                      {new Date(item.updatedAt).toLocaleString(
                                        'id-ID',
                                        { hour12: false }
                                      )}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    <div className="rounded-md border border-zinc-700 overflow-hidden">
                      <Table>
                        <TableHeader className="bg-zinc-900">
                          <TableRow>
                            <TableHead className="w-[50px] text-zinc-300">
                              No
                            </TableHead>
                            <TableHead className="text-zinc-300">
                              Title
                            </TableHead>
                            <TableHead className="text-zinc-300">
                              Slug
                            </TableHead>
                            <TableHead className="text-zinc-300">ID</TableHead>
                            <TableHead className="text-zinc-300">
                              Updated At
                            </TableHead>
                            <TableHead className="text-right text-zinc-300">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pages.map((page, idx) => (
                            <TableRow
                              key={page._id}
                              className="border-zinc-700"
                            >
                              <TableCell className="text-zinc-300">
                                {idx + 1}
                              </TableCell>
                              <TableCell className="text-zinc-300">
                                {page.root?.props?.title ||
                                  page.title ||
                                  'Untitled'}
                              </TableCell>
                              <TableCell className="text-zinc-300">
                                {page.slug || '-'}
                              </TableCell>
                              <TableCell className="text-zinc-300">
                                {page._id}
                              </TableCell>
                              <TableCell className="text-zinc-300">
                                {page.updatedAt || '-'}
                              </TableCell>
                              <TableCell className="flex justify-end gap-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(page._id)}
                                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
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
                )}
              </>
            )}

            {activeTab === 'mongodb' && (
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
                          <p className="text-zinc-400">
                            MongoDB v• Running for{' '}
                          </p>
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
                        <CardTitle className="text-lg text-white">
                          Connections
                        </CardTitle>
                        <Users className="h-5 w-5 text-zinc-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">
                        {getCurrentConnections()}
                      </div>
                      <div className="text-zinc-400 text-sm mt-1">
                        available
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">
                          Operations
                        </CardTitle>
                        <Activity className="h-5 w-5 text-zinc-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">
                        {Object.values(mongoStats?.opcounters || {}).reduce(
                          (a, b) => a + b,
                          0
                        )}
                      </div>
                      <div className="text-zinc-400 text-sm mt-1">
                        Total operations
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">
                          Memory
                        </CardTitle>
                        <HardDrive className="h-5 w-5 text-zinc-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">MB</div>
                      <div className="text-zinc-400 text-sm mt-1">
                        Resident memory
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">
                          Network
                        </CardTitle>
                        <Network className="h-5 w-5 text-zinc-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white">
                        {getNetworkRequests()}
                      </div>
                      <div className="text-zinc-400 text-sm mt-1">
                        Total requests
                      </div>
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
                            ></div>
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
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#3f3f46"
                          />
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
                              (mongoStats?.wiredTiger as any)?.[
                                'pages requested from the cache'
                              ] || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Pages Read</span>
                          <span className="font-medium text-white">
                            {(mongoStats?.wiredTiger as any)?.[
                              'pages read into cache'
                            ] || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Pages Written</span>
                          <span className="font-medium text-white">
                            {(mongoStats?.wiredTiger as any)?.[
                              'pages written from cache'
                            ] || 0}
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
                          <RadialBar
                            dataKey="value"
                            cornerRadius={10}
                            fill="#ffffff"
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 text-sm mt-4">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">
                            Current Connections
                          </span>
                          <span className="font-medium text-white">
                            {getCurrentConnections()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">
                            Active Connections
                          </span>
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
                        <div className="font-medium text-white"></div>
                      </div>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="text-sm text-zinc-400">Version</div>
                        <div className="font-medium text-white">MongoDB </div>
                      </div>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="text-sm text-zinc-400">Process ID</div>
                        <div className="font-medium text-white">
                          {mongoStats.network.bytesIn || 'N/A'}
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="text-sm text-zinc-400">
                          Architecture
                        </div>
                        <div className="font-medium text-white">
                          {mongoStats.network.bytesIn || 64}-bit
                        </div>
                      </div>
                      <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="text-sm text-zinc-400">
                          Virtual Memory
                        </div>
                        <div className="font-medium text-white">
                          {mongoStats.network.bytesIn || 0}MB
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-zinc-500 mt-8">
                  Last updated: {new Date().toLocaleString()} • Dashboard
                  auto-refreshes every 30 seconds
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
