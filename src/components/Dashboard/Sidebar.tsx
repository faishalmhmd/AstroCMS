import React from 'react';
import { cn } from '@/lib/utils';
import {
  Blocks,
  FileText,
  FilePlus,
  Database,
  Activity,
  Cpu,
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'projects', label: 'Projects', icon: FilePlus },
  { id: 'mongodb', label: 'MongoDB', icon: Database },
  { id: 'currentOps', label: 'Current Ops', icon: Activity },
  { id: 'hostInfo', label: 'Host Info', icon: Cpu },
];

interface SidebarProps {
  active: string;
  onChange: (id: string) => void;
}

export default function Sidebar({
  active,
  onChange,
}: SidebarProps): React.ReactElement {
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r  bg-neutral-50 dark:bg-neutral-900  dark:text-white text-black">
      <div className="flex h-12 items-center gap-2 px-4 border-b border-zinc-800">
        <Blocks className="h-6 w-6" />
        <span className="font-semibold">Builder</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  onClick={() => onChange(id)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer',
                    isActive
                      ? 'dark:bg-zinc-800 bg-neutral-50 dark:text-white text-black'
                      : 'dark:text-zinc-400 dark:hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="h-12" />
    </aside>
  );
}
