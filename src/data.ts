import { BusinessLink, Route, Partner, Campaign, FAQItem, CategorySchema, TagSchema, DirectorySourceSchema } from "./types";

export const initialCategories: CategorySchema[] = [
  {
    id: "operations",
    name: "Operations",
    description: "Centralized operational systems, fleet telematics, dispatch consoles, and transit routing tools.",
    icon: "Settings",
    route: "/business-links/operations"
  },
  {
    id: "finance",
    name: "Finance & Admin",
    description: "Enterprise payroll, expense management, corporate accounting, and vendor invoicing portals.",
    icon: "DollarSign",
    route: "/business-links/finance"
  },
  {
    id: "customer-services",
    name: "Customer Services",
    description: "Passenger support ticketing, SLA monitoring, refund processing, and live customer chat consoles.",
    icon: "Headphones",
    route: "/business-links/customer-services"
  },
  {
    id: "marketing",
    name: "Marketing & Reputation",
    description: "Brand review portals, customer feedback channels, advertising analytics, and PR directories.",
    icon: "TrendingUp",
    route: "/business-links/marketing"
  },
  {
    id: "partners-vendors",
    name: "Partners & Vendors",
    description: "Third-party vendor management, fuel grid contracts, insurance claims, and partner portals.",
    icon: "Users",
    route: "/business-links/partners-vendors"
  },
  {
    id: "local-profiles",
    name: "Local Business Profiles",
    description: "Geographic listings, map locations, local business directories, and regional depot contacts.",
    icon: "MapPin",
    route: "/business-links/local-profiles"
  },
  {
    id: "company-intelligence",
    name: "Company Intelligence",
    description: "Investor metrics, market capitalization data, employer branding pages, and corporate listings.",
    icon: "BarChart3",
    route: "/business-links/company-intelligence"
  }
];

export const initialDirectorySources: DirectorySourceSchema[] = [
  { id: "dir-yelp", name: "Yelp", homepage: "https://www.yelp.com" },
  { id: "dir-bbb", name: "BBB (Better Business Bureau)", homepage: "https://www.bbb.org" },
  { id: "dir-trustpilot", name: "Trustpilot", homepage: "https://www.trustpilot.com" },
  { id: "dir-glassdoor", name: "Glassdoor", homepage: "https://www.glassdoor.com" },
  { id: "dir-crunchbase", name: "Crunchbase", homepage: "https://www.crunchbase.com" },
  { id: "dir-google", name: "Google Business", homepage: "https://business.google.com" },
  { id: "dir-internal", name: "Internal Directory", homepage: "https://app.ai.studio/business-links" }
];

export const initialTags: TagSchema[] = [
  { id: "tag-1", name: "Fleet" },
  { id: "tag-2", name: "GPS" },
  { id: "tag-3", name: "Maintenance" },
  { id: "tag-4", name: "Accounting" },
  { id: "tag-5", name: "Finance" },
  { id: "tag-6", name: "Payroll" },
  { id: "tag-7", name: "Support" },
  { id: "tag-8", name: "CRM" },
  { id: "tag-9", name: "Reviews" },
  { id: "tag-10", name: "Reputation" },
  { id: "tag-11", name: "Vendors" },
  { id: "tag-12", name: "Partners" },
  { id: "tag-13", name: "Local" },
  { id: "tag-14", name: "Intelligence" },
  { id: "tag-15", name: "Compliance" }
];

export const initialBusinessLinks: BusinessLink[] = [
  {
    id: "link-yelp-biz",
    title: "Yelp Business Page",
    description: "Official customer review directory, location photos, operating hours, and rating score.",
    category: "local-profiles",
    tags: ["Local", "Reviews", "Reputation"],
    url: "https://www.yelp.com/biz/example",
    directorySource: "Yelp",
    lastUpdated: "2026-07-20T11:00:00Z",
    notes: "Monitored daily by customer service team for feedback resolution.",
    clicks: 1240
  },
  {
    id: "link-bbb-profile",
    title: "BBB Accreditation Profile",
    description: "Better Business Bureau official rating, accreditation seal, and business dispute records.",
    category: "marketing",
    tags: ["Reputation", "Compliance", "Trust"],
    url: "https://www.bbb.org/example",
    directorySource: "BBB (Better Business Bureau)",
    lastUpdated: "2026-07-18T14:30:00Z",
    notes: "Maintained at A+ rating status.",
    clicks: 890
  },
  {
    id: "link-trustpilot-reviews",
    title: "Trustpilot Reviews Portal",
    description: "Global customer feedback aggregator, verified passenger reviews, and sentiment analytics.",
    category: "marketing",
    tags: ["Reviews", "Reputation", "Feedback"],
    url: "https://www.trustpilot.com/review/example",
    directorySource: "Trustpilot",
    lastUpdated: "2026-07-21T08:15:00Z",
    notes: "Automated invite triggers active post-trip.",
    clicks: 1560
  },
  {
    id: "link-glassdoor-co",
    title: "Glassdoor Company Page",
    description: "Employer branding, employee reviews, driver salary benchmarks, and interview feedback.",
    category: "company-intelligence",
    tags: ["HR", "Intelligence", "Employer Brand"],
    url: "https://www.glassdoor.com/Overview/example",
    directorySource: "Glassdoor",
    lastUpdated: "2026-07-15T09:00:00Z",
    notes: "Reviewed monthly by HR and recruitment leads.",
    clicks: 640
  },
  {
    id: "link-crunchbase-org",
    title: "Crunchbase Listing",
    description: "Corporate funding history, executive team profiles, acquisition logs, and growth benchmarks.",
    category: "company-intelligence",
    tags: ["Finance", "Intelligence", "Investor"],
    url: "https://www.crunchbase.com/organization/example",
    directorySource: "Crunchbase",
    lastUpdated: "2026-07-12T16:20:00Z",
    notes: "Used during quarterly board meetings and investor updates.",
    clicks: 980
  },
  {
    id: "link-fleet-ops",
    title: "Central Dispatch & Fleet Console",
    description: "Real-time GPS bus tracking, active route telemetry, vehicle diagnostics, and operator radios.",
    category: "operations",
    tags: ["Fleet", "GPS", "Maintenance", "Operations"],
    url: "https://app.ai.studio/business-links/operations",
    directorySource: "Internal Directory",
    lastUpdated: "2026-07-21T10:00:00Z",
    notes: "Mission critical dashboard for daily transit dispatchers.",
    clicks: 3410
  },
  {
    id: "link-accounting-hub",
    title: "Enterprise Accounting & Payroll Hub",
    description: "General ledger, vendor billing, passenger revenue auditing, and driver payroll management.",
    category: "finance",
    tags: ["Accounting", "Finance", "Payroll"],
    url: "https://app.ai.studio/business-links/finance",
    directorySource: "Internal Directory",
    lastUpdated: "2026-07-19T13:45:00Z",
    notes: "Restricted access to finance department managers.",
    clicks: 1820
  },
  {
    id: "link-customer-helpdesk",
    title: "Passenger Care & SLA Desk",
    description: "Omnichannel support inbox, passenger refund requests, lost-and-found registry, and ticket disputes.",
    category: "customer-services",
    tags: ["Support", "CRM", "Passenger"],
    url: "https://app.ai.studio/business-links/customer-services",
    directorySource: "Internal Directory",
    lastUpdated: "2026-07-20T15:10:00Z",
    notes: "24/7 passenger care team primary portal.",
    clicks: 2150
  },
  {
    id: "link-vendor-network",
    title: "Vendor Contracts & Fuel Grid Portal",
    description: "CleanFuel charging contracts, Allianz fleet insurance policies, and maintenance partner SLAs.",
    category: "partners-vendors",
    tags: ["Vendors", "Partners", "Compliance"],
    url: "https://app.ai.studio/business-links/partners-vendors",
    directorySource: "Internal Directory",
    lastUpdated: "2026-07-17T11:30:00Z",
    notes: "Legal and vendor relations primary hub.",
    clicks: 1100
  },
  {
    id: "link-google-biz",
    title: "Google Business Terminal Profiles",
    description: "Google Maps transit station pins, passenger directions, terminal hours, and local Q&A.",
    category: "local-profiles",
    tags: ["Local", "GPS", "Maps"],
    url: "https://business.google.com",
    directorySource: "Google Business",
    lastUpdated: "2026-07-21T06:00:00Z",
    notes: "Covers Seattle, Portland, Spokane, and Eugene transit terminals.",
    clicks: 2890
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
    question: "Where are the API integrations and Google AI Studio keys managed?",
    answer: "You can find API keys, telemetry webhooks, and single-sign-on (SSO) settings inside 'Admin & Settings' under the 'Integration settings' tab, or in the 'Google AI Studio Core' module under 'API Key Hub'.",
    category: "System Admin"
  },
  {
    id: "faq-3",
    question: "What key business features does Google AI Studio offer?",
    answer: "Google AI Studio is a browser-based prototyping workspace featuring App & Website Prototyping (no coding required), Multimodal Content Creation (Imagen 4, Veo 3.1, audio), Google Workspace Data Integration (Sheets, Drive, Docs), 1-Click Code Export (GitHub, Netlify, Google Cloud), and API Key Management.",
    category: "System Admin"
  },
  {
    id: "faq-4",
    question: "What is the difference between Google AI Studio Free Tier and Paid Tier?",
    answer: "The Free Tier is suitable for prototyping and internal tools with standard rate limits. The Paid Tier (pay-as-you-go) provides enterprise data privacy guarantees and access to advanced flagship models like Imagen 4 and Veo 3.1.",
    category: "System Admin"
  },
  {
    id: "faq-5",
    question: "How are sitemap pages generated?",
    answer: "Our underlying AI-powered core can draft clean HTML/Tailwind content for any specific landing page inside the 'Marketing & Promotions' module or 'Support & Documentation' module.",
    category: "Marketing"
  },
  {
    id: "faq-6",
    question: "Can I assign a driver to multiple routes simultaneously?",
    answer: "Yes, but the system will throw a telemetry warning flag if timetables overlap on Seattle Transit Hub or Eugene Depot crossings.",
    category: "Routes & Schedules"
  }
];
