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
export type { TabButtonProps, ChartDataItem, MemoryUsageData };
