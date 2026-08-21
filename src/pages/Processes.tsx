import { useMemo, useState } from 'react';
import type { GovProcess } from '@/data/types';
import { processes, departments } from '@/data/mock';
import { getIcon } from '@/lib/icons';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import {
  ListChecks, Clock, Coins, FileText, CheckCircle2, UserCheck,
  ChevronRight, ArrowLeft, Flame, FileCheck2,
} from 'lucide-react';

export function Processes() {
  const [query, setQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return processes.filter((p) => {
      const matchesDept = deptFilter === 'all' || p.departmentId === deptFilter;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesDept && matchesQuery;
    });
  }, [query, deptFilter]);

  const selected = processes.find((p) => p.id === selectedId) ?? null;

  if (selected) {
    return <ProcessDetail proc={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="section-title">Browse common processes</h2>
        <p className="text-sm text-ink-500">Find a process, see the steps, approvals and documents required.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Search for a process…" icon={ListChecks} className="flex-1" />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="input sm:w-56"
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.shortName}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ListChecks className="h-6 w-6" />} title="No processes found" description="Try a different search or department." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const dept = departments.find((d) => d.id === p.departmentId);
            const DeptIcon = getIcon(dept?.icon ?? 'Landmark');
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="card card-hover group flex flex-col p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <DeptIcon className="h-5 w-5" />
                  </div>
                  <span className="chip bg-ink-100 text-ink-600">{p.category}</span>
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink-900">{p.title}</h3>
                <p className="mt-1 flex-1 text-xs text-ink-500">{p.description}</p>
                <div className="mt-4 flex items-center gap-3 text-[11px] text-ink-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.duration}</span>
                  <span className="flex items-center gap-1"><Coins className="h-3 w-3" />{p.fee}</span>
                  <span className="flex items-center gap-1"><Flame className="h-3 w-3" />{p.popularity}%</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProcessDetail({ proc, onBack }: { proc: GovProcess; onBack: () => void }) {
  const dept = departments.find((d) => d.id === proc.departmentId);
  const DeptIcon = getIcon(dept?.icon ?? 'Landmark');
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="btn-ghost -ml-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> All processes
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-600 px-6 py-8 text-white sm:px-10">
        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <DeptIcon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <span className="chip bg-white/15 text-white backdrop-blur-sm">{dept?.name}</span>
            <h2 className="mt-2 text-2xl font-extrabold">{proc.title}</h2>
            <p className="mt-1 max-w-xl text-sm text-brand-100">{proc.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{proc.duration}</span>
              <span className="flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" />{proc.fee}</span>
              <span className="flex items-center gap-1.5"><Flame className="h-3.5 w-3.5" />{proc.popularity}% demand</span>
            </div>
          </div>
          <button onClick={() => setApplyOpen(true)} className="btn bg-white text-brand-700 hover:bg-brand-50 hidden sm:inline-flex">
            <FileCheck2 className="h-4 w-4" /> Start application
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Steps */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="section-title">Steps to complete it</h3>
            <ol className="mt-5 space-y-1">
              {proc.steps.map((s, i) => (
                <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* connector */}
                  {i < proc.steps.length - 1 && (
                    <span className="absolute left-[15px] top-9 bottom-0 w-px bg-ink-200" />
                  )}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-500 bg-white text-xs font-bold text-brand-600">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-ink-900">{s.title}</p>
                    <p className="mt-0.5 text-sm text-ink-500">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Side: approvals + documents */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-ink-400" />
              <h3 className="section-title">Who needs to approve it</h3>
            </div>
            <div className="mt-4 space-y-3">
              {proc.approvals.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-800">{a.role}</p>
                    <p className="text-xs text-ink-400">{a.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-ink-400" />
              <h3 className="section-title">Documents required</h3>
            </div>
            <ul className="mt-4 space-y-2">
              {proc.documents.map((d, i) => (
                <li key={i} className="flex items-center gap-2.5 rounded-lg border border-ink-200 bg-ink-50/50 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" />
                  <span className="text-sm text-ink-700">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={() => setApplyOpen(true)} className="btn-primary w-full sm:hidden">
            <FileCheck2 className="h-4 w-4" /> Start application
          </button>
        </div>
      </div>

      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Start application"
        subtitle={proc.title}
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setApplyOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => setApplyOpen(false)} className="btn-primary">Create draft</button>
          </div>
        }
      >
        <p className="text-sm text-ink-600">
          We'll create a draft application for <span className="font-semibold text-ink-900">{proc.title}</span> under the {dept?.name} department. You'll need the following documents ready:
        </p>
        <ul className="mt-4 space-y-2">
          {proc.documents.map((d, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-ink-700">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success-500" /> {d}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
