export type RouteId =
  | 'home'
  | 'helpdesk'
  | 'departments'
  | 'processes'
  | 'documents'
  | 'requests'
  | 'notifications'
  | 'profile';

export interface Department {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  processes: number;
  documents: number;
  head: string;
  contact: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Approval {
  role: string;
  name: string;
}

export interface GovProcess {
  id: string;
  title: string;
  departmentId: string;
  description: string;
  category: string;
  steps: ProcessStep[];
  approvals: Approval[];
  documents: string[];
  duration: string;
  fee: string;
  popularity: number;
}

export interface GovDocument {
  id: string;
  title: string;
  type: 'Government Order' | 'Circular' | 'Guideline' | 'Form' | 'Manual';
  departmentId: string;
  number: string;
  date: string;
  summary: string;
  pages: number;
  size: string;
}

export interface HelpdeskQuestion {
  id: string;
  question: string;
  answer: string;
  sources: { label: string; ref: string }[];
  departmentId: string;
  asked: string;
  status: 'answered' | 'pending';
  views: number;
  related: string[];
}

export type RequestStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';

export interface UserRequest {
  id: string;
  title: string;
  processId: string;
  departmentId: string;
  submittedOn: string;
  status: RequestStatus;
  progress: number;
  reference: string;
  timeline: { date: string; label: string; done: boolean }[];
}

export interface AppNotification {
  id: string;
  type: 'document' | 'request' | 'notice' | 'update';
  title: string;
  body: string;
  time: string;
  read: boolean;
  departmentId?: string;
}

export interface CommonTopic {
  id: string;
  title: string;
  category: string;
  icon: string;
}

export interface RecentActivity {
  id: string;
  kind: 'request' | 'document' | 'answer';
  title: string;
  meta: string;
  time: string;
}
