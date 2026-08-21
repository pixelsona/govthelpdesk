import { useMemo, useState } from 'react';
import type { HelpdeskQuestion } from '@/data/types';
import { questions, departments } from '@/data/mock';
import { getIcon } from '@/lib/icons';
import { SearchBar } from '@/components/ui/SearchBar';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  MessageCircle, Send, Clock, Eye, BookOpen, FileText, Lightbulb,
  History, ChevronRight, Sparkles,
} from 'lucide-react';

export function Helpdesk() {
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(questions[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(
      (x) => x.question.toLowerCase().includes(q) || x.answer?.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = questions.find((q) => q.id === selectedId) ?? filtered[0] ?? null;
  const previous = questions.filter((q) => q.status === 'answered');

  function deptName(id: string) {
    return departments.find((d) => d.id === id)?.shortName ?? 'General';
  }
  function deptIcon(id: string) {
    return getIcon(departments.find((d) => d.id === id)?.icon ?? 'Landmark');
  }

  function handleAsk() {
    if (!draft.trim()) return;
    setSubmitted(true);
    setDraft('');
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Ask your question */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-600 px-6 py-8 text-white sm:px-10">
        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="chip bg-white/15 text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" /> AI-assisted helpdesk
          </span>
          <h2 className="mt-3 text-2xl font-extrabold">Ask your question</h2>
          <p className="mt-1 max-w-xl text-sm text-brand-100">
            Type your question in plain language. We'll find the answer from official documents and past replies.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="e.g. How do I correct my name on the RTC?"
                className="w-full rounded-xl border-transparent bg-white/95 py-3 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 shadow-soft focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button onClick={handleAsk} className="btn bg-white text-brand-700 hover:bg-brand-50">
              <Send className="h-4 w-4" /> Ask
            </button>
          </div>
          {submitted && (
            <p className="mt-3 text-sm font-medium text-accent-200 animate-fade-in">
              Your question has been received. We'll post an answer shortly.
            </p>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: search + previous questions */}
        <div className="space-y-6 lg:col-span-1">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <History className="h-4 w-4 text-ink-400" />
              <h3 className="section-title">Previous questions</h3>
            </div>
            <SearchBar value={query} onChange={setQuery} placeholder="Search questions…" autoFocus />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <EmptyState icon={<MessageCircle className="h-6 w-6" />} title="No questions found" description="Try a different search term." />
            ) : (
              filtered.map((q) => {
                const DeptIcon = deptIcon(q.departmentId);
                const active = selected?.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedId(q.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? 'border-brand-300 bg-brand-50/60 ring-1 ring-brand-200'
                        : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                        <DeptIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink-900">{q.question}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-ink-400">
                          <span>{deptName(q.departmentId)}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{q.asked}</span>
                          {q.status === 'answered' && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{q.views}</span>
                            </>
                          )}
                          {q.status === 'pending' && (
                            <span className="chip bg-warning-100 text-warning-700">Pending</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 text-ink-300 transition-transform ${active ? 'translate-x-0.5 text-brand-500' : ''}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: answer + related */}
        <div className="lg:col-span-2">
          {selected ? (
            <AnswerPanel q={selected} />
          ) : (
            <EmptyState icon={<Lightbulb className="h-6 w-6" />} title="No question selected" description="Pick a question from the list to see its answer." />
          )}
        </div>
      </div>
    </div>
  );
}

function AnswerPanel({ q }: { q: HelpdeskQuestion }) {
  const DeptIcon = getIcon(departments.find((d) => d.id === q.departmentId)?.icon ?? 'Landmark');
  const related = questions.filter((r) => q.related.includes(r.id));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <DeptIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="label">Question</p>
            <h3 className="mt-1 text-lg font-bold text-ink-900">{q.question}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-400">
              <span>{departments.find((d) => d.id === q.departmentId)?.name}</span>
              <span>·</span>
              <span>{q.asked}</span>
              {q.status === 'answered' && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{q.views} views</span>
                </>
              )}
            </div>
          </div>
        </div>

        {q.status === 'answered' ? (
          <div className="mt-5 border-t border-ink-100 pt-5">
            <p className="label">Answer</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{q.answer}</p>
          </div>
        ) : (
          <div className="mt-5 border-t border-ink-100 pt-5">
            <div className="flex items-center gap-2 rounded-xl bg-warning-50 px-4 py-3 text-sm text-warning-700">
              <Clock className="h-4 w-4" /> This question is awaiting an answer from the department.
            </div>
          </div>
        )}
      </div>

      {q.status === 'answered' && q.sources.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-ink-400" />
            <p className="label">Where the information came from</p>
          </div>
          <div className="mt-3 space-y-2">
            {q.sources.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-ink-50/50 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600 shadow-soft">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-800">{s.label}</p>
                  <p className="text-xs text-ink-400">{s.ref}</p>
                </div>
                <button className="btn-ghost text-xs">View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="card p-6">
          <p className="label">Related questions</p>
          <div className="mt-3 space-y-2">
            {related.map((r) => (
              <button key={r.id} className="flex w-full items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 text-left transition-colors hover:bg-ink-50">
                <MessageCircle className="h-4 w-4 shrink-0 text-brand-500" />
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink-800">{r.question}</p>
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
