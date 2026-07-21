export interface BusinessLink {
  id: string;
  title: string;
  description: string;
  category: "operations" | "finance" | "hr_training" | "legal_compliance" | "external";
  tags: string[];
  url: string;
  lastUpdated: string;
}

export interface Route {
  id: string;
  name: string;
  region: string;
  status: "active" | "inactive";
  stops: string[];
  timetable: {
    [key: string]: string[]; // e.g., "Weekdays": ["08:00", "12:00", "16:00"], "Weekends": ["10:00", "15:00"]
  };
  vehicles: string[];
  drivers: string[];
  linkedResources: string[]; // references to BusinessLink IDs or titles
  dispatchedDate?: string; // current date when dispatched
}

export interface Partner {
  id: string;
  name: string;
  logo: string; // url or keyword/symbol
  category: string;
  contact: {
    email: string;
    phone: string;
  };
  contractStatus: "active" | "inactive" | "pending" | "expired" | string;
  renewalDate: string;
  links: {
    portal: string;
    support: string;
    sla: string;
  };
}

export interface Campaign {
  id: string;
  name: string;
  channel: string;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "completed" | "draft" | string;
  landingPage: string;
  promoCodes: string[];
  targetRoutes: string[]; // references to Route IDs
  metrics: {
    clicks: number;
    conversions: number;
    ticketSales: number;
  };
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}
