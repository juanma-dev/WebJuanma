import {
  Palette, PenTool, BookOpen, ShoppingCart, Search, Wrench,
  BarChart3, Globe, Smartphone, Monitor, MessageSquare, Lightbulb,
  Users, HeadphonesIcon, Target, Sparkles, Shield, Heart
} from 'lucide-react';

export const WHATSAPP_URL = 'https://wa.me/573150533698';
export const CONTACT_EMAIL = 'websjuanma@gmail.com';

export const SERVICE_ICONS = {
  webDesign: Palette,
  graphicDesign: PenTool,
  blogs: BookOpen,
  ecommerce: ShoppingCart,
  seo: Search,
  maintenance: Wrench,
  analytics: BarChart3,
  webApps: Globe,
  mobileApps: Smartphone,
  desktopApps: Monitor,
};

export const SERVICE_KEYS = [
  'webDesign', 'graphicDesign', 'blogs', 'ecommerce', 'seo',
  'maintenance', 'analytics', 'webApps', 'mobileApps', 'desktopApps'
] as const;

export const WHY_CHOOSE_ICONS = {
  experience: Target,
  custom: Sparkles,
  innovation: Lightbulb,
  support: HeadphonesIcon,
};

export const VALUES_ICONS = [Lightbulb, Shield, Heart, Users, Sparkles];

export const PROCESS_ICONS = {
  consult: MessageSquare,
  design: PenTool,
  develop: Globe,
  test: Search,
  launch: Target,
  support: HeadphonesIcon,
};

export type TechItem = {
  name: string;
  /** simple-icons slug, or 'custom:<key>' for inline SVG (Axum, Leptos) */
  slug: string;
  /** hex (no #) — black/dark official logos are forced to white for contrast on dark bg */
  color: string;
};

export const TECH_STACK: TechItem[] = [
  { name: 'React',        slug: 'react',             color: '61DAFB' },
  { name: 'Next.js',      slug: 'nextdotjs',         color: 'FFFFFF' },
  { name: 'TypeScript',   slug: 'typescript',        color: '3178C6' },
  { name: 'Rust',         slug: 'rust',              color: 'FFFFFF' },
  { name: 'Leptos',       slug: 'leptos',            color: 'EF3939' },
  { name: 'Axum',         slug: 'custom:axum',       color: 'FFFFFF' },
  { name: 'PostgreSQL',   slug: 'postgresql',        color: '4169E1' },
  { name: 'Docker',       slug: 'docker',            color: '2496ED' },
  { name: 'AWS',          slug: 'local:aws',         color: 'FF9900' },
  { name: 'Google Cloud', slug: 'googlecloud',       color: '4285F4' },
  { name: 'Node.js',      slug: 'nodedotjs',         color: '5FA04E' },
  { name: 'Python',       slug: 'python',            color: 'FFD43B' },
  { name: 'Figma',        slug: 'figma',             color: 'F24E1E' },
  { name: 'Git',          slug: 'git',               color: 'F05032' },
  { name: 'Linux',        slug: 'linux',             color: 'FFFFFF' },
  { name: 'Nginx',        slug: 'nginx',             color: '009639' },
  { name: 'MongoDB',      slug: 'mongodb',           color: '47A248' },
];
