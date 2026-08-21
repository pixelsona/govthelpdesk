export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function statusTone(status: string): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case 'Completed':
    case 'Approved':
      return { bg: 'bg-success-50', text: 'text-success-700', dot: 'bg-success-500' };
    case 'Rejected':
      return { bg: 'bg-danger-50', text: 'text-danger-700', dot: 'bg-danger-500' };
    case 'Under Review':
      return { bg: 'bg-warning-50', text: 'text-warning-700', dot: 'bg-warning-500' };
    case 'Submitted':
      return { bg: 'bg-brand-50', text: 'text-brand-700', dot: 'bg-brand-500' };
    default:
      return { bg: 'bg-ink-100', text: 'text-ink-600', dot: 'bg-ink-400' };
  }
}

export function docTypeTone(type: string): { bg: string; text: string } {
  switch (type) {
    case 'Government Order':
      return { bg: 'bg-brand-50', text: 'text-brand-700' };
    case 'Circular':
      return { bg: 'bg-accent-50', text: 'text-accent-700' };
    case 'Guideline':
      return { bg: 'bg-success-50', text: 'text-success-700' };
    case 'Form':
      return { bg: 'bg-warning-50', text: 'text-warning-700' };
    case 'Manual':
      return { bg: 'bg-ink-100', text: 'text-ink-700' };
    default:
      return { bg: 'bg-ink-100', text: 'text-ink-600' };
  }
}
