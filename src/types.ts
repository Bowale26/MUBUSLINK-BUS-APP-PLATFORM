export interface BusinessLink {
  id: string;
  title: string;
  description: string;
  category: string; // operations | finance | customer-services | marketing | partners-vendors | local-profiles | company-intelligence
  tags: string[];
  url: string;
  directorySource: string; // e.g., Yelp, BBB, Trustpilot, Glassdoor, Crunchbase, Internal
  lastUpdated: string;
  notes: string;
  clicks?: number;
}

export interface CategorySchema {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
}

export interface TagSchema {
  id: string;
  name: string;
}

export interface DirectorySourceSchema {
  id: string;
  name: string;
  homepage: string;
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
