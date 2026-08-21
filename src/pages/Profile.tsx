import { useState } from 'react';
import type { RouteId } from '@/data/types';
import { user, userRequests, departments } from '@/data/mock';
import { getIcon } from '@/lib/icons';
import { statusTone } from '@/lib/format';
import {
  Mail, Phone, IdCard, CalendarDays, Building2, Bell, Shield,
  HelpCircle, ChevronRight, LogOut, Globe, Moon, Monitor, Check, Sun,
} from 'lucide-react';

interface ProfileProps {
  onNavigate: (id: RouteId) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const dept = departments.find((d) => d.name === user.department);
  const DeptIcon = getIcon(dept?.icon ?? 'Landmark');
  const completed = userRequests.filter((r) => r.status === 'Completed').length;
  const pending = userRequests.filter((r) => ['Submitted', 'Under Review', 'Approved'].includes(r.status)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-600 px-6 py-8 text-white sm:px-10">
        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-extrabold backdrop-blur-sm">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold">{user.name}</h2>
            <p className="mt-0.5 text-sm text-brand-100">{user.role}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{user.department}</span>
              <span className="flex items-center gap-1.5"><IdCard className="h-3.5 w-3.5" />{user.employeeId}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Joined {user.joined}</span>
            </div>
          </div>
          <button className="btn bg-white text-brand-700 hover:bg-brand-50">
            Edit profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatBox label="Requests submitted" value={userRequests.length} />
        <StatBox label="Pending" value={pending} />
        <StatBox label="Completed" value={completed} />
        <StatBox label="Departments used" value={new Set(userRequests.map((r) => r.departmentId)).size} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* My details */}
        <div className="card p-6 lg:col-span-1">
          <h3 className="section-title">My details</h3>
          <div className="mt-4 space-y-1">
            <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
            <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone} />
            <DetailRow icon={<IdCard className="h-4 w-4" />} label="Employee ID" value={user.employeeId} />
            <DetailRow icon={<Building2 className="h-4 w-4" />} label="Department" value={user.department} />
            <DetailRow icon={<CalendarDays className="h-4 w-4" />} label="Joined" value={user.joined} />
          </div>
        </div>

        {/* Settings */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="section-title">Settings</h3>

          {/* Notifications */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-ink-400" />
              <p className="label">Notification preferences</p>
            </div>
            <div className="mt-3 space-y-2">
              <ToggleRow label="Email notifications" desc="Receive updates by email" checked={notifEmail} onChange={setNotifEmail} />
              <ToggleRow label="Push notifications" desc="In-app and browser push" checked={notifPush} onChange={setNotifPush} />
              <ToggleRow label="SMS notifications" desc="Text messages for urgent updates" checked={notifSms} onChange={setNotifSms} />
            </div>
          </div>

          {/* Theme */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-ink-400" />
              <p className="label">Appearance</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {([
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ] as const).map((opt) => {
                const Icon = opt.icon;
                const active = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      active ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {opt.label}
                    {active && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-ink-400" />
              <p className="label">Language</p>
            </div>
            <select className="input mt-2 sm:w-64" defaultValue="en">
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Help & security */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="section-title">Help & support</h3>
          <div className="mt-4 space-y-1">
            <LinkRow icon={<HelpCircle className="h-4 w-4" />} label="Help centre" desc="Guides and how-tos" onClick={() => onNavigate('helpdesk')} />
            <LinkRow icon={<Building2 className="h-4 w-4" />} label="Browse departments" desc="Find a department" onClick={() => onNavigate('departments')} />
            <LinkRow icon={<Shield className="h-4 w-4" />} label="Privacy & security" desc="Manage your data" />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="section-title">Recent requests</h3>
          <div className="mt-4 space-y-2">
            {userRequests.slice(0, 3).map((r) => {
              const tone = statusTone(r.status);
              return (
                <button
                  key={r.id}
                  onClick={() => onNavigate('requests')}
                  className="flex w-full items-center gap-3 rounded-xl border border-ink-200 px-4 py-3 text-left transition-colors hover:bg-ink-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-800">{r.title}</p>
                    <p className="text-xs text-ink-400">{r.reference}</p>
                  </div>
                  <span className={`chip ${tone.bg} ${tone.text} shrink-0`}>{r.status}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="flex justify-center pb-4">
        <button className="btn-ghost text-danger-600 hover:bg-danger-50 hover:text-danger-700">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <p className="text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs font-medium text-ink-400">{label}</p>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-ink-100 py-3 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="truncate text-sm font-semibold text-ink-800">{value}</p>
      </div>
    </div>
  );
}

function ToggleRow({
  label, desc, checked, onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ink-200 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink-800">{label}</p>
        <p className="text-xs text-ink-400">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-ink-200'}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}

function LinkRow({
  icon, label, desc, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-ink-200 px-4 py-3 text-left transition-colors hover:bg-ink-50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-800">{label}</p>
        <p className="text-xs text-ink-400">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
    </button>
  );
}

