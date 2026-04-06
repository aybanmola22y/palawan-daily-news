export const mockCategories = [
  { id: 1, name: "Provincial News", slug: "provincial-news", color: "blue", description: "News from the province of Palawan" },
  { id: 2, name: "City News", slug: "city-news", color: "emerald", description: "News from around the city" },
  { id: 3, name: "Puerto Princesa City", slug: "puerto-princesa-city", color: "indigo", description: "Specific updates from the capital" },
  { id: 4, name: "Police Report", slug: "police-report", color: "red", description: "Latest police and crime reports" },
  { id: 5, name: "National News", slug: "national", color: "slate", description: "News from across the Philippines" },
  { id: 6, name: "Feature", slug: "feature", color: "purple", description: "Special features and long-form stories" },
  { id: 7, name: "Press Release", slug: "press-release", color: "gray", description: "Official press releases" },
  { id: 8, name: "Environment", slug: "environment", color: "green", description: "Environmental and conservation news" },
  { id: 9, name: "Column", slug: "column", color: "amber", description: "Columns and recurring sections" },
  { id: 10, name: "Opinion", slug: "opinion", color: "red", description: "Editorials and opinion pieces" },
  { id: 11, name: "Lifestyle", slug: "lifestyle", color: "pink", description: "Health, travel, and lifestyle" },
  { id: 12, name: "Advertise", slug: "advertise", color: "gray", description: "Advertising info" },
  { id: 13, name: "Legal Section", slug: "legal", color: "slate", description: "Legal notices" },
  { id: 14, name: "International News", slug: "international", color: "sky", description: "World news and global updates" },
  { id: 15, name: "Editorial", slug: "editorial", color: "indigo", description: "The Editorial Board's perspectives" },
  { id: 16, name: "Regional News", slug: "regional-news", color: "orange", description: "Updates from across the MIMAROPA region" },
  { id: 17, name: "Youth & Campus", slug: "youth-campus", color: "pink", description: "Campus news and youth-oriented stories" },
  { id: 18, name: "Tourism", slug: "tourism", color: "teal", description: "Explore the beauty and attractions of Palawan" },
  { id: 19, name: "Technology", slug: "technology", color: "blue", description: "Tech news, innovation, and digital trends" },
  { id: 20, name: "Business", slug: "business", color: "emerald", description: "Economic updates and business highlights" },
  { id: 21, name: "Sports", slug: "sports", color: "orange", description: "Local and national sports updates" },
];

export const mockArticles: {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  authorName: string;
  authorAvatar: string;
  status: string;
  featured: boolean;
  breaking: boolean;
  views: number;
  publishedAt: Date;
  tags: string[];
}[] = [];

export type MockArticle = (typeof mockArticles)[0];
export type MockCategory = (typeof mockCategories)[0];

export interface Advertisement {
  id: string;
  type: 'billboard' | 'leaderboard' | 'sidebar' | 'header';
  fit: 'cover' | 'contain';
  imageUrl?: string;
  linkUrl?: string;
  active: boolean;
  label: string;
  sublabel: string;
}

export const mockAds: Advertisement[] = [
  {
    id: "home-billboard",
    type: "billboard",
    fit: "cover",
    active: false,
    label: "BILLBOARD ADVERTISEMENT SPACE",
    sublabel: "Get your brand in front of thousands of daily readers",
  },
  {
    id: "article-sidebar",
    type: "sidebar",
    fit: "cover",
    active: false,
    label: "SIDEBAR ADVERTISEMENT SPACE",
    sublabel: "Contact us at ads@palawandaily.com for rates",
  },
  {
    id: "home-header",
    type: "header",
    fit: "cover",
    active: true,
    label: "Be a certified safety officer",
    sublabel: "Attend our online and face-to-face training.",
  },
];

export interface PdnContactInfo {
  officeName: string;
  addressLines: string[];
  email: string;
  telephone?: string;
  mobile?: string;
  businessHours: string[];
}

export const mockPdnContactInfo: PdnContactInfo = {
  officeName: "Palawan Daily News Head Office",
  addressLines: [
    "3/F Daniel Alley Bldg. II",
    "National Highway, San Pedro",
    "Puerto Princesa City 5300",
    "Philippines",
  ],
  email: "info@palawandailynews.com",
  telephone: "+63 (48) 717 0288",
  mobile: "+63 917 829 1370",
  businessHours: [
    "Monday–Friday: 8:30 AM – 5:30 PM",
    "Saturday: 9:00 AM – 12:00 PM",
    "Sunday: Closed",
  ],
};

export interface PdnOwnershipFundingInfo {
  title: string;
  highlights: string[];
  bodyHtml: string;
}

export type OrgChartDepartment =
  | "management"
  | "news"
  | "creatives"
  | "online-radio"
  | "digital"
  | "online-tv"
  | "columnists";

export interface OrgChartEmployee {
  id: string;
  name: string;
  title: string;
  department: OrgChartDepartment;
  avatarUrl?: string | null;
  facebookUrl?: string | null;
}

export const mockOrgChartDepartments: { slug: OrgChartDepartment; label: string }[] = [
  { slug: "management", label: "Management" },
  { slug: "news", label: "News Department" },
  { slug: "creatives", label: "Creatives (Audio Video Animation) Team" },
  { slug: "online-radio", label: "Online Radio Team" },
  { slug: "digital", label: "Digital (Web & SocMed)" },
  { slug: "online-tv", label: "Online TV" },
];

export const mockOrgChartEmployees: OrgChartEmployee[] = [
  { id: "1", name: "Kent Janaban", title: "Publisher", department: "management", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "2", name: "Harthwell Capistrano", title: "Editor in Chief / Co-founder", department: "management", avatarUrl: null, facebookUrl: "#" },
  { id: "3", name: "Clarina Herrera Guludah", title: "Broadcast Journalist / Co-founder", department: "management", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "4", name: "Rexcel John Sorza", title: "Editorial Consultant", department: "management", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "5", name: "Atty. Analisa Navarro - Padon", title: "Legal Counsel", department: "management", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "6", name: "Sevedeo Borda III", title: "Managing Editor", department: "news", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "7", name: "Hanna Camella Talabucon", title: "Associate Editor", department: "news", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "8", name: "Gerardo Reyes Jr.", title: "Journalist", department: "news", avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "9", name: "John Castor Viernes", title: "Sales & Marketing / Journalist", department: "news", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "10", name: "Maria Santos", title: "Senior Journalist", department: "news", avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "11", name: "Mechael Glen Dagot", title: "Circulation Officer", department: "digital", avatarUrl: null, facebookUrl: "#" },
  { id: "12", name: "Carlos dela Cruz", title: "Digital Content Manager", department: "digital", avatarUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "13", name: "Ana Bautista", title: "Social Media Editor", department: "digital", avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "14", name: "Roberto Cruz", title: "Online Radio Host", department: "online-radio", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "15", name: "Liza Garcia", title: "Online Radio Producer", department: "online-radio", avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "16", name: "Miguel Torres", title: "Video Producer", department: "creatives", avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "17", name: "Sofia Reyes", title: "Motion Designer", department: "creatives", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
  { id: "18", name: "Jose Reyes", title: "Online TV Anchor", department: "online-tv", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", facebookUrl: "#" },
];

export const mockPdnOwnershipFundingInfo: PdnOwnershipFundingInfo = {
  title: "Ownership and Funding Information",
  highlights: [
    "Palawan Daily News is independently owned and operated.",
    "We do not accept funding that influences editorial decision-making.",
    "Revenue primarily comes from advertising and other self-sustaining sources.",
  ],
  bodyHtml: `
    <p><strong>Palawan Daily News</strong> is a regional media platform based in Puerto Princesa City, Palawan. For this demo project, the details below are intentionally written as <em>dummy reference content</em> so you can adjust it later to match your official company disclosures.</p>
    <p>The publication is <strong>self-funded</strong> and has operated continuously since 2018 with a commitment to accuracy, fairness, and balance. We maintain a clear separation between our newsroom and revenue operations.</p>
    <p>Majority of the organization’s operating income is generated through:</p>
    <ul>
      <li>Display and sponsored advertising placements</li>
      <li>Brand partnerships and event coverage packages</li>
      <li>Content production services (when clearly labeled and contracted)</li>
    </ul>
    <p>We publish online and may expand into additional formats (print, radio, video) depending on community demand and sustainability goals.</p>
    <p>If you have questions about ownership, funding, or corrections, please contact us using the information on the <a href="/about/contact-us">Contact Us</a> page.</p>
  `,
};
