import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
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
} from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { ModeToggle } from './ModeToggle';

interface IPages<T = any> {
  _id: string;
  title?: string;
  slug?: string;
  content?: T;
  root: IRootPages;
  updatedAt?: string;
}

interface IRootPages {
  props: {
    title: string;
  };
}

interface StatsOverview {
  totalPages: number;
  pagesWithTitles: number;
  pagesWithoutTitles: number;
  pagesWithSlugs: number;
  pagesWithContent: number;
  averageContentLength: number;
}

interface TimeStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
}

interface StorageRaw {
  size: number;
  storageSize: number;
  avgObjSize: number;
  indexSize: number;
  dataSize: number;
}

interface StorageStats {
  totalSize: string;
  storageSize: string;
  indexSize: string;
  avgPageSize: string;
  raw: StorageRaw;
}

interface GrowthItem {
  month: string;
  count: number;
}

interface RecentActivity {
  id: string;
  title: string;
  slug: string | null;
  updatedAt?: string; // opsional karena tidak semua ada
}

export interface ResponseReport {
  overview: StatsOverview;
  timeStats: TimeStats;
  storage: StorageStats;
  growth: GrowthItem[];
  recentActivity: RecentActivity[];
}

export default function Dashboard(): React.ReactElement {
  const [pages, setPages] = useState<IPages[]>([]);
  const [response, setResponse] = useState<ResponseReport>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get('/api/get-stats');
        if (res.data.success) {
          setResponse(res.data.stats); // pastikan backend kirim { success:true, report:{...} }
        } else {
          console.error('❌ Gagal mengambil statistik:', res.data.error);
        }
      } catch (error) {
        console.error('❌ Error saat fetch statistik:', error);
      }
    };

    const getPages = async () => {
      try {
        const res = await axios.get('/api/get-pages');
        if (res.data.success) {
          setPages(res.data.pages);
        } else {
          console.error('❌ Gagal mengambil halaman:', res.data.error);
        }
      } catch (error) {
        console.error('❌ Error saat fetch halaman:', error);
      }
    };

    getPages();
    getStats();
  }, []);

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

  return (
    <div className="w-full h-full flex text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 transition-colors">
      {/* Sidebar */}
      <div
        className={`
          ${isCollapsed ? 'w-[50px]' : 'w-[250px]'}
          pt-10
          transition-all duration-300 ease-in-out
          bg-zinc-100 dark:bg-zinc-900 
          p-4 space-y-4 overflow-hidden
        `}
      >
        <div className="flex items-center gap-2">
          <Blocks className="inline-flex !w-4 !h-4s" />
          {!isCollapsed && (
            <span className="font-semibold text-xl">Builder</span>
          )}
        </div>

        <div className="">{/* Pages Accordion */}</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-zinc-50 dark:bg-zinc-900 h-screen p-3 overflow-auto">
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
              <div className="font-semibold ml-2">Dashboard</div>
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
          <div className="p-6">
            {pages.length === 0 ? (
              <p className="text-muted-foreground dark:text-zinc-400 text-sm">
                Tidak ada halaman ditemukan.
              </p>
            ) : (
                <main className="p-6 space-y-6 overflow-auto">
                  {response && (
                    <>
                      {/* Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Total Pages</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent className="text-2xl font-bold">
                            {response.overview.totalPages}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>With Titles</CardTitle>
                            <FileCheck className="h-4 w-4 text-green-600" />
                          </CardHeader>
                          <CardContent className="text-2xl font-bold">
                            {response.overview.pagesWithTitles}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>No Title</CardTitle>
                            <FileWarning className="h-4 w-4 text-yellow-600" />
                          </CardHeader>
                          <CardContent className="text-2xl font-bold">
                            {response.overview.pagesWithoutTitles}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>With Content</CardTitle>
                            <FilePlus className="h-4 w-4 text-blue-600" />
                          </CardHeader>
                          <CardContent className="text-2xl font-bold">
                            {response.overview.pagesWithContent}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Growth Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Growth Over Time</CardTitle>
                        </CardHeader>
                        <CardContent className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={response.growth}>
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#2563eb"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Storage Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Storage Usage</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>Total Size: {response.storage.totalSize}</p>
                          <p>Avg Page Size: {response.storage.avgPageSize}</p>
                          <p>Index Size: {response.storage.indexSize}</p>
                        </CardContent>
                      </Card>

                      {/* Recent Activity */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {response.recentActivity.map((item) => (
                              <li
                                key={item.id}
                                className="flex justify-between items-center border-b pb-1"
                              >
                                <span>{item.title || 'Untitled'}</span>
                                {item.updatedAt && (
                                  <span className="text-sm text-muted-foreground">
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
                       <Table>
                  <TableHeader className="bg-zinc-900">
                    <TableRow>
                      <TableHead className="w-[50px]">No</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((page, idx) => (
                      <TableRow key={page._id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>
                          {page.root?.props?.title || page.title || 'Untitled'}
                        </TableCell>
                        <TableCell>{page.slug || '-'}</TableCell>
                        <TableCell>{page._id}</TableCell>
                        <TableCell>{page.updatedAt || '-'}</TableCell>
                        <TableCell className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(page._id)}
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
                </main>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
