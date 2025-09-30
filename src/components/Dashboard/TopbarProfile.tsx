import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

interface TopbarProfileProps {
  name?: string;
  email?: string;
  initials?: string;
  onProfile?: () => void;
  onLogout?: () => void;
}

export default function TopbarProfile({
  name = 'John Doe',
  email = 'john@example.com',
  initials = 'JD',
  onProfile,
  onLogout,
}: TopbarProfileProps): React.ReactElement {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="sr-only">Open user menu</span>
          <div className="w-full h-full rounded-sm bg-zinc-300 dark:bg-neutral-800 flex items-center justify-center text-sm font-semibold text-black dark:text-white">
            {initials}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>

        <DropdownMenuItem onClick={onProfile ?? (() => {})}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onLogout ?? (() => {})}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
