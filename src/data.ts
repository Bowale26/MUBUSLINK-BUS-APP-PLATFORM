import { BusinessLink, Route, Partner, Campaign, FAQItem } from "./types";

export const initialBusinessLinks: BusinessLink[] = [
  {
    id: "link-fleet",
    title: "Fleet Management Portal",
    description: "Real-time GPS tracking, vehicle diagnostics, and maintenance logs for all active buses.",
    category: "operations",
    tags: ["Fleet", "GPS", "Maintenance"],
    url: "https://fleet.example.com/login",
    lastUpdated: "2026-07-20T10:30:00Z"
  },
  {
    id: "link-tickets",
    title: "Ticketing Partner",
    description: "Centralized ticketing system for reservation management, passenger manifests, and sales.",
    category: "external",
    tags: ["Ticketing", "Sales", "Passenger"],
    url: "https://tickets.example.com/dashboard",
    lastUpdated: "2026-07-19T14:20:00Z"
  },
  {
    id: "link-accounting",
    title: "Accounting System",
    description: "Enterprise payroll, expense reporting, vendor billing, and double-entry general ledger.",
    category: "finance",
    tags: ["Accounting", "Finance", "Payroll"],
    url: "https://accounts.example.com",
    lastUpdated: "2026-07-15T09:00:00Z"
  },
  {
    id: "link-insurance",
    title: "Insurance Portal",
    description: "Access liability claims, commercial auto coverage certificates, and incident reporting forms.",
    category: "legal_compliance",
    tags: ["Insurance", "Compliance", "Legal"],
    url: "https://insurance.example.com/clients/mubuslink",
    lastUpdated: "2026-07-18T16:45:00Z"
  },
  {
    id: "link-hr",
    title: "HR Portal",
    description: "Employee onboarding, driver drug/alcohol testing compliance records, and shift schedules.",
    category: "hr_training",
    tags: ["HR", "Onboarding", "Training", "Drivers"],
    url: "https://hr.example.com/mubuslink",
    lastUpdated: "2026-07-10T11:00:00Z"
  },
  {
    id: "link-ops-dispatch",
    title: "Central Dispatch Console",
    description: "Direct communication dashboard connecting dispatchers and on-route bus operators.",
    category: "operations",
    tags: ["Operations", "Radio", "Live"],
    url: "https://mubuslink.ai.studio/dashboard/dispatch",
    lastUpdated: "2026-07-21T02:00:00Z"
  },
  {
    id: "link-legal-regulatory",
    title: "Federal Safety Compliance Docs",
    description: "Official FMCSA registration, regulatory filings, and Department of Transportation inspection records.",
    category: "legal_compliance",
    tags: ["Legal", "Compliance", "DOT", "FMCSA"],
    url: "https://mubuslink.ai.studio/docs/safety-manual",
    lastUpdated: "2026-07-05T13:15:00Z"
  },
  {
    id: "link-driver-training",
    title: "Defensive Driving Training Portal",
    description: "Mandatory LMS refresher courses covering passenger safety, bad-weather navigation, and EV bus handling.",
    category: "hr_training",
    tags: ["Training", "Drivers", "Safety", "LMS"],
    url: "https://mubuslink.ai.studio/hr/training",
    lastUpdated: "2026-07-12T08:30:00Z"
  }
];

export const initialRoutes: Route[] = [
  {
    id: "route-101",
    name: "Pacific Express (Route 101)",
    region: "West Coast Metro",
    status: "active",
    stops: ["Seattle Transit Hub", "Tacoma Terminal", "Portland Union Station", "Eugene Depot"],
    timetable: {
      "Weekdays": ["06:00", "09:30", "13:00", "16:30", "20:00"],
      "Weekends": ["08:00", "12:00", "16:00", "20:00"]
    },
    vehicles: ["Bus #302 (Double-Decker)", "Bus #305 (EV Coach)", "Bus #410 (EV Coach)"],
    drivers: ["Marcus Vance (Senior Lead)", "Sarah Chen", "David Miller"],
    linkedResources: ["link-fleet", "link-tickets"]
  },
  {
    id: "route-202",
    name: "Interstate Link (Route 202)",
    region: "Cascadia East",
    status: "active",
    stops: ["Portland Union Station", "Hood River Depot", "The Dalles Transit Center", "Spokane Hub"],
    timetable: {
      "Weekdays": ["07:30", "11:00", "15:00", "18:30"],
      "Weekends": ["09:00", "14:00", "18:00"]
    },
    vehicles: ["Bus #102 (Standard Highway Coach)", "Bus #220 (Volvo Coach)"],
    drivers: ["Elena Rostova", "Thomas Fletcher"],
    linkedResources: ["link-fleet", "link-insurance"]
  },
  {
    id: "route-303",
    name: "Cascade Shuttles (Route 303)",
    region: "Mountain Connector",
    status: "inactive",
    stops: ["Seattle Transit Hub", "Bellevue Center", "Snoqualmie Depot", "Ellensburg Station"],
    timetable: {
      "Daily Winter": ["08:00", "11:00", "14:00", "17:00", "20:00"],
      "Daily Summer": ["09:00", "13:00", "17:00"]
    },
    vehicles: ["Bus #401 (4x4 Heavy-Duty Transit)"],
    drivers: ["James O'Connor"],
    linkedResources: ["link-fleet"]
  }
];

export const initialPartners: Partner[] = [
  {
    id: "partner-fleetpro",
    name: "FleetPro Telematics LLC",
    logo: "Truck",
    category: "Operations Systems",
    contact: {
      email: "support@fleetpro-telematics.com",
      phone: "+1 (800) 555-0192"
    },
    contractStatus: "active",
    renewalDate: "2027-01-15",
    links: {
      portal: "https://fleet.example.com/login",
      support: "https://fleet.example.com/support",
      sla: "https://fleet.example.com/legal/sla-mubuslink.pdf"
    }
  },
  {
    id: "partner-tickethub",
    name: "TicketHub Systems",
    logo: "Ticket",
    category: "Distribution & Ticketing",
    contact: {
      email: "mubuslink-account@tickethub.net",
      phone: "+1 (888) 555-0344"
    },
    contractStatus: "active",
    renewalDate: "2026-11-30",
    links: {
      portal: "https://tickets.example.com/dashboard",
      support: "https://tickets.example.com/support/clients",
      sla: "https://tickets.example.com/contracts/sla_v3.pdf"
    }
  },
  {
    id: "partner-allianz-bus",
    name: "Allianz Fleet Underwriters",
    logo: "Shield",
    category: "Commercial Auto Insurance",
    contact: {
      email: "commercial-claims@allianz-fleet.com",
      phone: "+1 (877) 555-9000"
    },
    contractStatus: "active",
    renewalDate: "2027-05-01",
    links: {
      portal: "https://insurance.example.com/clients/mubuslink",
      support: "https://insurance.example.com/contact-mubuslink",
      sla: "https://insurance.example.com/terms/coverage-certificate"
    }
  },
  {
    id: "partner-cleanfuel",
    name: "CleanFuel ChargeGrid Inc.",
    logo: "Zap",
    category: "EV Infrastructure",
    contact: {
      email: "ops@cleanfuel-grid.com",
      phone: "+1 (855) 555-1234"
    },
    contractStatus: "pending",
    renewalDate: "2026-09-01",
    links: {
      portal: "https://cleanfuel-grid.com/portal/mubuslink",
      support: "https://cleanfuel-grid.com/help-desk",
      sla: "https://cleanfuel-grid.com/legal/sla_charging"
    }
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: "camp-summer26",
    name: "Summer Cascadia Explorer 2026",
    channel: "Social & Retargeting",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    status: "active",
    landingPage: "https://mubuslink.ai.studio/marketing/cascadia-summer-promo",
    promoCodes: ["SUMMER26", "CASCADIA15"],
    targetRoutes: ["route-101", "route-202"],
    metrics: {
      clicks: 14500,
      conversions: 2450,
      ticketSales: 48900
    }
  },
  {
    id: "camp-seattleback",
    name: "Seattle Commuter Fuel Offset",
    channel: "Search Ads",
    startDate: "2026-05-01",
    endDate: "2026-07-31",
    status: "active",
    landingPage: "https://mubuslink.ai.studio/marketing/commuter-fuel-discount",
    promoCodes: ["COMMUTE26", "EVBUS26"],
    targetRoutes: ["route-101"],
    metrics: {
      clicks: 8200,
      conversions: 980,
      ticketSales: 18500
    }
  },
  {
    id: "camp-autumnearly",
    name: "Early Bird Fall Retreats",
    channel: "Email Newsletter",
    startDate: "2026-08-15",
    endDate: "2026-10-15",
    status: "draft",
    landingPage: "https://mubuslink.ai.studio/marketing/early-fall-escapes",
    promoCodes: ["FALL_EARLY"],
    targetRoutes: ["route-101", "route-202", "route-303"],
    metrics: {
      clicks: 0,
      conversions: 0,
      ticketSales: 0
    }
  }
];

export const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I add a new external tool to the links directory?",
    answer: "Go to the 'Business Links Directory', click 'Add Link', specify its name, URL, tags, and category, and hit save. The platform automatically indexes and formats the resource card.",
    category: "Operations"
  },
  {
    id: "faq-2",
    question: "Where are the API integrations managed?",
    answer: "You can find API keys, telemetry webhooks, and single-sign-on (SSO) settings inside 'Admin & Settings' under the 'Integration settings' tab.",
    category: "System Admin"
  },
  {
    id: "faq-3",
    question: "How are sitemap pages generated?",
    answer: "Our underlying AI-powered core can draft clean HTML/Tailwind content for any specific landing page inside the 'Marketing & Promotions' module or 'Support & Documentation' module.",
    category: "Marketing"
  },
  {
    id: "faq-4",
    question: "Can I assign a driver to multiple routes simultaneously?",
    answer: "Yes, but the system will throw a telemetry warning flag if timetables overlap on Seattle Transit Hub or Eugene Depot crossings.",
    category: "Routes & Schedules"
  }
];
