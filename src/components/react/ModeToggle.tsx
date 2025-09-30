import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

export function ModeToggle() {
  const [theme, setTheme] = React.useState<Theme>('dark');

  // Set theme ke <html> dan localStorage
  const applyTheme = (theme: Theme) => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
    } else {
      document.documentElement.classList[theme === 'dark' ? 'add' : 'remove'](
        'dark'
      );
    }
    localStorage.setItem('theme', theme);
    setTheme(theme);
  };

  // On mount: load theme dari localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme('dark'); // default to dark
    }

    // Optional: listen to system preference change (only in 'system' mode)
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const systemListener = () => {
      if (localStorage.getItem('theme') === 'system') {
        applyTheme('system');
      }
    };
    media.addEventListener('change', systemListener);

    return () => media.removeEventListener('change', systemListener);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] shrink-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => applyTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
