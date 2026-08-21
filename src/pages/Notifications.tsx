import { useMemo, useState } from 'react';
import type { AppNotification } from '@/data/types';
import { notifications, departments } from '@/data/mock';
import { getIcon } from '@/lib/icons';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Bell, FileText, Inbox, Megaphone, RefreshCw, CheckCheck,
  Dot,
} from 'lucide-react';

const typeMeta: Record<
  AppNotification['type'],
  { label: string; icon: typeof FileText; bg: string; text: string }
> = {
  document: { label: 'New document', icon: FileText, bg: 'bg-success-50', text: 'text-success-600' },
  request: { label: 'Request update', icon: Inbox, bg: 'bg-brand-50', text: 'text-brand-600' },
  notice: { label: 'Important notice', icon: Megaphone, bg: 'bg-danger-50', text: 'text-danger-600' },
  update: { label: 'Update', icon: RefreshCw, bg: 'bg-accent-50', text: 'text-accent-600' },
};

const filters = ['All', 'Unread', 'Requests', 'Documents', 'Notices'] as const;
type Filter = (typeof filters)[number];

export function Notifications() {
  const [filter, setFilter] = useState<Filter>('All');
  const [items, setItems] = useState<AppNotification[]>(notifications);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'Unread':
        return items.filter((n) => !n.read);
      case 'Requests':
        return items.filter((n) => n.type === 'request');
      case 'Documents':
        return items.filter((n) => n.type === 'document');
      case 'Notices':
        return items.filter((n) => n.type === 'notice' || n.type === 'update');
      default:
        return items;
    }
  }, [items, filter]);

  const unreadCount = items.filter((n) => !n.read).length;

  function markAll() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function toggleRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="section-title">Notifications</h2>
          <p className="text-sm text-ink-500">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAll} className="btn-secondary self-start sm:self-auto">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-white text-ink-500 border border-ink-200 hover:bg-ink-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={<Bell className="h-6 w-6" />} title="No notifications here" description="New updates about your requests and documents will appear here." />
      ) : (
        <div className="card divide-y divide-ink-100">
          {filtered.map((n) => {
            const meta = typeMeta[n.type];
            const Icon = meta.icon;
            const dept = departments.find((d) => d.id === n.departmentId);
            const DeptIcon = dept ? getIcon(dept.icon) : null;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors ${n.read ? 'bg-white' : 'bg-brand-50/30'}`}
              >
                <button onClick={() => toggleRead(n.id)} className="mt-1 shrink-0" aria-label="Toggle read">
                  <Dot className={`h-6 w-6 ${n.read ? 'text-ink-200' : 'text-brand-500'}`} />
                </button>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.text}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{meta.label}</span>
                    {DeptIcon && dept && (
                      <span className="flex items-center gap-1 text-[11px] text-ink-400">
                        <DeptIcon className="h-3 w-3" /> {dept.shortName}
                      </span>
                    )}
                  </div>
                  <p className={`mt-1 text-sm ${n.read ? 'font-medium text-ink-700' : 'font-bold text-ink-900'}`}>{n.title}</p>
                  <p className="mt-0.5 text-sm text-ink-500">{n.body}</p>
                  <p className="mt-1.5 text-[11px] text-ink-400">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
