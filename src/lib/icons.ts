import type { LucideIcon } from 'lucide-react';
import {
  Landmark, GraduationCap, HeartPulse, Car, Building2, Wheat, Trees, HandHeart,
  FileText, Map,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Landmark, GraduationCap, HeartPulse, Car, Building2, Wheat, Trees, HandHeart,
  FileText, Map,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Landmark;
}
