import { useMemo, useState } from 'react';
import type { GovDocument } from '@/data/types';
import { documents, departments } from '@/data/mock';
import { getIcon } from '@/lib/icons';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { docTypeTone, formatDate } from '@/lib/format';
import {
  FileText, Download, ChevronRight, FileCheck, FileSignature,
  BookOpen, ClipboardList, FileSpreadsheet,
} from 'lucide-react';

const typeFilters = ['All', 'Government Order', 'Circular', 'Guideline', 'Form', 'Manual'] as const;
type TypeFilter = (typeof typeFilters)[number];

const typeIcons: Record<string, typeof FileText> = {
  'Government Order': FileSignature,
  Circular: FileSpreadsheet,
  Guideline: BookOpen,
  Form: ClipboardList,
  Manual: BookOpen,
};

export function Documents() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((d) => {
      const matchesType = typeFilter === 'All' || d.type === typeFilter;
      const matchesDept = deptFilter === 'all' || d.departmentId === deptFilter;
      const matchesQuery =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.number.toLowerCase().includes(q);
      return matchesType && matchesDept && matchesQuery;
    });
  }, [query, typeFilter, deptFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    documents.forEach((d) => {
      map[d.type] = (map[d.type] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="section-title">Documents</h2>
        <p className="text-sm text-ink-500">Search government orders, circulars, guidelines, forms and manuals.</p>
      </div>

      {/* Type cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {typeFilters.filter((t) => t !== 'All').map((t) => {
          const Icon = typeIcons[t];
          const active = typeFilter === t;
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(active ? 'All' : t)}
              className={`card card-hover flex items-center gap-3 p-4 text-left transition-colors ${
                active ? 'border-brand-300 bg-brand-50/50 ring-1 ring-brand-200' : ''
              }`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink-900">{t}</p>
                <p className="text-[11px] text-ink-400">{counts[t] ?? 0} items</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={query} onChange={setQuery} placeholder="Search documents by title, number or keyword…" icon={FileText} className="flex-1" />
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

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={<FileText className="h-6 w-6" />} title="No documents found" description="Try adjusting your search or filters." />
      ) : (
        <div className="card divide-y divide-ink-100">
          {filtered.map((d) => (
            <DocumentRow key={d.id} doc={d} />
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentRow({ doc }: { doc: GovDocument }) {
  const dept = departments.find((d) => d.id === doc.departmentId);
  const DeptIcon = getIcon(dept?.icon ?? 'Landmark');
  const tone = docTypeTone(doc.type);
  const TypeIcon = typeIcons[doc.type] ?? FileText;

  return (
    <div className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink-50/50">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <TypeIcon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`chip ${tone.bg} ${tone.text}`}>{doc.type}</span>
          <span className="flex items-center gap-1 text-[11px] text-ink-400">
            <DeptIcon className="h-3 w-3" /> {dept?.shortName}
          </span>
        </div>
        <p className="mt-1.5 truncate text-sm font-semibold text-ink-900">{doc.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">{doc.summary}</p>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-ink-400">
          <span className="font-medium">{doc.number}</span>
          <span>·</span>
          <span>{formatDate(doc.date)}</span>
          <span>·</span>
          <span>{doc.pages} pages · {doc.size}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button className="btn-secondary px-3 py-2 text-xs">
          <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Download</span>
        </button>
        <button className="btn-ghost p-2 text-ink-400 group-hover:text-brand-600">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
