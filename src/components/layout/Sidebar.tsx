import type { RouteId } from '@/data/types';
import { notifications, user } from '@/data/mock';
import {
  Home, MessageCircle, Building2, ListChecks, FileText, Inbox, Bell, User,
  ShieldCheck, X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: RouteId;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'helpdesk', label: 'Helpdesk', icon: MessageCircle },
  { id: 'departments', label: 'Departments', icon: Building2 },
  { id: 'processes', label: 'Processes', icon: ListChecks },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'requests', label: 'My Requests', icon: Inbox },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

interface SidebarProps {
  current: RouteId;
  onNavigate: (id: RouteId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-ink-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-2 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-extrabold tracking-tight text-ink-900">Sahayata</p>
              <p className="text-[11px] font-medium text-ink-400">Govt. Helpdesk Portal</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="label px-3.5 pb-2 pt-3">Menu</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = current === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`nav-link w-full ${active ? 'nav-link-active' : ''}`}
                  >
                    <Icon className={`h-[18px] w-[18px] ${active ? 'text-brand-600' : ''}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.id === 'notifications' && unread > 0 && (
                      <span className="chip bg-danger-100 text-danger-700">{unread}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="label px-3.5 pb-2 pt-6">Account</p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onNavigate('profile')}
                className={`nav-link w-full ${current === 'profile' ? 'nav-link-active' : ''}`}
              >
                <User className={`h-[18px] w-[18px] ${current === 'profile' ? 'text-brand-600' : ''}`} />
                <span className="flex-1 text-left">Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User card */}
        <div className="border-t border-ink-200 p-3">
          <button
            onClick={() => onNavigate('profile')}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-ink-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-800">{user.name}</p>
              <p className="truncate text-xs text-ink-400">{user.role}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
