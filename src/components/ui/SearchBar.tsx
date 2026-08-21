import { Search, type LucideIcon } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, placeholder = 'Search…', icon: Icon = Search, className = '', autoFocus }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="input pl-10"
      />
    </div>
  );
}
