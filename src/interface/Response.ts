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
