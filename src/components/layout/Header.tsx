import type { RouteId } from '@/data/types';
import { navItems } from './Sidebar';
import { Menu, Bell, Search } from 'lucide-react';
import { notifications } from '@/data/mock';

interface HeaderProps {
  current: RouteId;
  onOpenMobile: () => void;
  onNavigate: (id: RouteId) => void;
}

export function Header({ current, onOpenMobile, onNavigate }: HeaderProps) {
  const item = navItems.find((n) => n.id === current);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-200 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6">
      <button
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-ink-900 sm:text-xl">{item?.label ?? 'Home'}</h1>
        <p className="hidden text-xs text-ink-400 sm:block">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="hidden md:block">
        <div className="relative w-64 lg:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search across the portal…"
            className="input pl-10 py-2"
            onFocus={() => onNavigate('helpdesk')}
          />
        </div>
      </div>

      <button
        onClick={() => onNavigate('notifications')}
        className="relative rounded-xl p-2.5 text-ink-600 transition-colors hover:bg-ink-100"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
    </header>
  );
}
