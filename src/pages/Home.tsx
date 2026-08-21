import { useState } from 'react';
import type { RouteId } from '@/data/types';
import { commonTopics, recentActivity, departments, userRequests, user } from '@/data/mock';
import { getIcon } from '@/lib/icons';
import { SearchBar } from '@/components/ui/SearchBar';
import { statusTone } from '@/lib/format';
import {
  ArrowRight, Sparkles, FileText, Inbox, MessageCircle,
  TrendingUp, ChevronRight,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (id: RouteId) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [query, setQuery] = useState('');
  const pending = userRequests.filter((r) => !['Completed', 'Rejected'].includes(r.status)).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-10 text-white sm:px-10 sm:py-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-accent-400/20 blur-2xl" />
        <div className="relative">
          <span className="chip bg-white/15 text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> Welcome back, {user.name.split(' ')[0]}
          </span>
          <h2 className="mt-4 max-w-2xl text-2xl font-extrabold leading-tight sm:text-3xl">
            How can we help you today?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-brand-100">
            Search for a service, ask a question, or track an application — all your government helpdesk needs in one place.
          </p>

          <div className="mt-6 max-w-2xl">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Ask a question or search for a service, document, process…"
              className="[&_input]:bg-white/95 [&_input]:py-3.5 [&_input]:text-ink-900 [&_input]:shadow-soft [&_input]:border-transparent"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-brand-100">Try:</span>
              {['How to apply for a birth certificate?', 'Land mutation status', 'Scholarship deadline'].map((s) => (
                <button
                  key={s}
                  onClick={() => onNavigate('helpdesk')}
                  className="chip bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Inbox className="h-5 w-5" />}
          label="Pending requests"
          value={pending}
          tone="brand"
          onClick={() => onNavigate('requests')}
        />
        <StatCard
          icon={<MessageCircle className="h-5 w-5" />}
          label="Helpdesk answers"
          value="6"
          tone="accent"
          onClick={() => onNavigate('helpdesk')}
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Documents available"
          value="240"
          tone="success"
          onClick={() => onNavigate('documents')}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Departments"
          value={departments.length}
          tone="warning"
          onClick={() => onNavigate('departments')}
        />
      </section>

      {/* Common things people look for */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="section-title">Common things people look for</h3>
            <p className="text-sm text-ink-500">Popular services across departments</p>
          </div>
          <button onClick={() => onNavigate('processes')} className="btn-ghost text-sm">
            All processes <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {commonTopics.map((t) => {
            const Icon = getIcon(t.icon);
            return (
              <button
                key={t.id}
                onClick={() => onNavigate('processes')}
                className="card card-hover group p-5 text-left"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-ink-900">{t.title}</p>
                <p className="mt-1 text-xs text-ink-400">{t.category}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent activity + active requests */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="section-title">Recent activity</h3>
              <p className="text-sm text-ink-500">Your latest actions on the portal</p>
            </div>
            <button onClick={() => onNavigate('requests')} className="btn-ghost text-sm">
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="card divide-y divide-ink-100">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    a.kind === 'request' ? 'bg-brand-50 text-brand-600' : a.kind === 'document' ? 'bg-success-50 text-success-600' : 'bg-accent-50 text-accent-600'
                  }`}
                >
                  {a.kind === 'request' ? <Inbox className="h-5 w-5" /> : a.kind === 'document' ? <FileText className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-800">{a.title}</p>
                  <p className="truncate text-xs text-ink-400">{a.meta}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-400">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="section-title">Active requests</h3>
              <p className="text-sm text-ink-500">In progress</p>
            </div>
          </div>
          <div className="space-y-3">
            {userRequests.filter((r) => !['Completed', 'Rejected'].includes(r.status)).slice(0, 3).map((r) => {
              const tone = statusTone(r.status);
              return (
                <button
                  key={r.id}
                  onClick={() => onNavigate('requests')}
                  className="card card-hover w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-ink-900">{r.title}</p>
                    <span className={`chip ${tone.bg} ${tone.text} shrink-0`}>{r.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-400">{r.reference}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-ink-400">
                      <span>Progress</span>
                      <span>{r.progress}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${r.progress}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Departments strip */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="section-title">Departments</h3>
            <p className="text-sm text-ink-500">Browse services by department</p>
          </div>
          <button onClick={() => onNavigate('departments')} className="btn-ghost text-sm">
            All departments <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {departments.slice(0, 8).map((d) => {
            const Icon = getIcon(d.icon);
            return (
              <button
                key={d.id}
                onClick={() => onNavigate('departments')}
                className="card card-hover group flex items-center gap-3 p-4 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-600 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{d.shortName}</p>
                  <p className="truncate text-xs text-ink-400">{d.processes} processes</p>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon, label, value, tone, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone: 'brand' | 'accent' | 'success' | 'warning';
  onClick?: () => void;
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-50 text-accent-600',
    success: 'bg-success-50 text-success-600',
    warning: 'bg-warning-50 text-warning-600',
  };
  return (
    <button onClick={onClick} className="card card-hover p-5 text-left">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>
        {icon}
      </div>
      <p className="text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs font-medium text-ink-400">{label}</p>
    </button>
  );
}
