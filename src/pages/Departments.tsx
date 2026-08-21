import { useMemo, useState } from 'react';
import type { Department } from '@/data/types';
import { departments, processes, documents } from '@/data/mock';
import { getIcon } from '@/lib/icons';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Building2, FileText, ListChecks, Mail, ChevronRight, ArrowLeft,
  CheckCircle2, Clock,
} from 'lucide-react';

export function Departments() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return departments;
    return departments.filter(
      (d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = departments.find((d) => d.id === selectedId) ?? null;

  if (selected) {
    return <DepartmentDetail dept={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="section-title">Departments</h2>
        <p className="text-sm text-ink-500">Select a department to see its services, processes and documents.</p>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Search departments…" icon={Building2} className="max-w-md" />

      {filtered.length === 0 ? (
        <EmptyState icon={<Building2 className="h-6 w-6" />} title="No departments found" description="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => {
            const Icon = getIcon(d.icon);
            return (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className="card card-hover group p-6 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-500" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink-900">{d.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{d.description}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-ink-400">
                  <span className="flex items-center gap-1.5"><ListChecks className="h-3.5 w-3.5" />{d.processes} processes</span>
                  <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />{d.documents} documents</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DepartmentDetail({ dept, onBack }: { dept: Department; onBack: () => void }) {
  const Icon = getIcon(dept.icon);
  const deptProcesses = processes.filter((p) => p.departmentId === dept.id);
  const deptDocs = documents.filter((d) => d.departmentId === dept.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="btn-ghost -ml-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> All departments
      </button>

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-600 px-6 py-8 text-white sm:px-10">
        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">{dept.name}</h2>
            <p className="mt-1 max-w-xl text-sm text-brand-100">{dept.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" />Head: {dept.head}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{dept.contact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* What this department handles */}
      <div className="card p-6">
        <h3 className="section-title">What this department handles</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {dept.name} oversees {dept.processes} citizen-facing processes and maintains {dept.documents} official documents. The department is responsible for {dept.description.toLowerCase()}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Processes" value={dept.processes} />
          <Metric label="Documents" value={dept.documents} />
          <Metric label="Avg. response" value="3 days" />
          <Metric label="Service hours" value="9am–5pm" />
        </div>
      </div>

      {/* Related processes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="section-title">Related processes</h3>
          <span className="text-xs text-ink-400">{deptProcesses.length} processes</span>
        </div>
        {deptProcesses.length === 0 ? (
          <EmptyState icon={<ListChecks className="h-6 w-6" />} title="No processes listed yet" />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deptProcesses.map((p) => (
              <div key={p.id} className="card card-hover p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-ink-900">{p.title}</p>
                  <span className="chip bg-ink-100 text-ink-600 shrink-0">{p.category}</span>
                </div>
                <p className="mt-1 text-xs text-ink-500">{p.description}</p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-ink-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.duration}</span>
                  <span>{p.steps.length} steps</span>
                  <span>{p.documents.length} documents</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related documents */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="section-title">Related documents</h3>
          <span className="text-xs text-ink-400">{deptDocs.length} documents</span>
        </div>
        {deptDocs.length === 0 ? (
          <EmptyState icon={<FileText className="h-6 w-6" />} title="No documents published yet" />
        ) : (
          <div className="card divide-y divide-ink-100">
            {deptDocs.map((d) => (
              <div key={d.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{d.title}</p>
                  <p className="truncate text-xs text-ink-400">{d.number} · {d.size}</p>
                </div>
                <span className="hidden text-xs text-ink-400 sm:block">{d.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50/50 p-3">
      <p className="text-lg font-bold text-ink-900">{value}</p>
      <p className="text-[11px] font-medium text-ink-400">{label}</p>
    </div>
  );
}
