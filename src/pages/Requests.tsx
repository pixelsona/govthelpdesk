import { useMemo, useState } from 'react';
import type { UserRequest, RequestStatus } from '@/data/types';
import { userRequests, departments, processes } from '@/data/mock';
import { getIcon } from '@/lib/icons';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { statusTone, formatDate } from '@/lib/format';
import {
  Inbox, Clock, CheckCircle2, XCircle, ArrowLeft, Search,
  FileCheck2, CircleDot,
} from 'lucide-react';

const tabs = ['All', 'Pending', 'Completed'] as const;
type Tab = (typeof tabs)[number];

export function Requests() {
  const [tab, setTab] = useState<Tab>('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return userRequests.filter((r) => {
      const pendingStatuses: RequestStatus[] = ['Submitted', 'Under Review', 'Approved'];
      const matchesTab =
        tab === 'All' ||
        (tab === 'Pending' && pendingStatuses.includes(r.status)) ||
        (tab === 'Completed' && ['Completed', 'Rejected'].includes(r.status));
      const matchesQuery =
        !q || r.title.toLowerCase().includes(q) || r.reference.toLowerCase().includes(q);
      return matchesTab && matchesQuery;
    });
  }, [tab, query]);

  const selected = userRequests.find((r) => r.id === selectedId) ?? null;

  const counts = {
    All: userRequests.length,
    Pending: userRequests.filter((r) => ['Submitted', 'Under Review', 'Approved'].includes(r.status)).length,
    Completed: userRequests.filter((r) => ['Completed', 'Rejected'].includes(r.status)).length,
  };

  if (selected) {
    return <RequestDetail req={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="section-title">My Requests</h2>
          <p className="text-sm text-ink-500">Track everything you've submitted across departments.</p>
        </div>
        <button className="btn-primary self-start sm:self-auto">
          <FileCheck2 className="h-4 w-4" /> New request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-ink-200 bg-white p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              tab === t ? 'bg-brand-600 text-white shadow-soft' : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
            }`}
          >
            {t} <span className={`ml-1 text-xs ${tab === t ? 'text-brand-100' : 'text-ink-400'}`}>({counts[t]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or reference number…"
          className="input pl-10"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-6 w-6" />}
          title="No requests here"
          description="You haven't submitted any requests matching this view yet."
          action={<button className="btn-primary"><FileCheck2 className="h-4 w-4" /> Start a new request</button>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const dept = departments.find((d) => d.id === r.departmentId);
            const DeptIcon = getIcon(dept?.icon ?? 'Landmark');
            const tone = statusTone(r.status);
            return (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className="card card-hover w-full p-5 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <DeptIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-ink-900">{r.title}</p>
                      <span className={`chip ${tone.bg} ${tone.text} shrink-0`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} /> {r.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-400">{r.reference} · submitted {formatDate(r.submittedOn)}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-ink-400">
                        <span>{dept?.shortName}</span>
                        <span>{r.progress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                        <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${r.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RequestDetail({ req, onBack }: { req: UserRequest; onBack: () => void }) {
  const dept = departments.find((d) => d.id === req.departmentId);
  const proc = processes.find((p) => p.id === req.processId);
  const DeptIcon = getIcon(dept?.icon ?? 'Landmark');
  const tone = statusTone(req.status);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="btn-ghost -ml-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> All requests
      </button>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <DeptIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`chip ${tone.bg} ${tone.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} /> {req.status}
              </span>
              <span className="text-xs text-ink-400">{dept?.name}</span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-ink-900">{req.title}</h2>
            <p className="mt-1 text-xs text-ink-400">
              {req.reference} · submitted on {formatDate(req.submittedOn)}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-ink-400">
            <span>Overall progress</span>
            <span className="font-semibold text-ink-700">{req.progress}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${req.progress}%` }} />
          </div>
        </div>
      </div>

      {/* Current status + timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-1">
          <h3 className="section-title">Current status</h3>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-ink-50 p-4">
            <CircleDot className="h-5 w-5 text-brand-500" />
            <div>
              <p className="text-sm font-semibold text-ink-900">{req.status}</p>
              <p className="text-xs text-ink-400">{proc?.title}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Department" value={dept?.name ?? '—'} />
            <Row label="Process" value={proc?.title ?? '—'} />
            <Row label="Reference" value={req.reference} />
            <Row label="Submitted" value={formatDate(req.submittedOn)} />
            <Row label="Estimated time" value={proc?.duration ?? '—'} />
          </div>
          {['Submitted', 'Under Review'].includes(req.status) && (
            <button onClick={() => setWithdrawOpen(true)} className="btn-secondary mt-5 w-full text-danger-600 hover:bg-danger-50">
              <XCircle className="h-4 w-4" /> Withdraw request
            </button>
          )}
        </div>

        <div className="card p-6 lg:col-span-2">
          <h3 className="section-title">Timeline</h3>
          <ol className="mt-5 space-y-1">
            {req.timeline.map((t, i) => (
              <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                {i < req.timeline.length - 1 && (
                  <span className={`absolute left-[11px] top-7 bottom-0 w-px ${t.done ? 'bg-brand-300' : 'bg-ink-200'}`} />
                )}
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${t.done ? 'bg-brand-500 text-white' : 'border-2 border-ink-300 bg-white'}`}>
                  {t.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3 w-3 text-ink-400" />}
                </div>
                <div className="pt-0.5">
                  <p className={`text-sm font-semibold ${t.done ? 'text-ink-900' : 'text-ink-500'}`}>{t.label}</p>
                  <p className="text-xs text-ink-400">{t.date}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Modal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        title="Withdraw this request?"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setWithdrawOpen(false)} className="btn-secondary">Keep it</button>
            <button onClick={() => setWithdrawOpen(false)} className="btn bg-danger-600 text-white hover:bg-danger-700">Withdraw</button>
          </div>
        }
      >
        <p className="text-sm text-ink-600">
          Withdrawing will cancel <span className="font-semibold text-ink-900">{req.title}</span> ({req.reference}). This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-100 py-2 last:border-0">
      <span className="text-xs text-ink-400">{label}</span>
      <span className="text-right text-sm font-medium text-ink-800">{value}</span>
    </div>
  );
}
