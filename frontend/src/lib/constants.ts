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

export const TECH_STACK = [
  'React', 'Next.js', 'TypeScript', 'Java', 'Spring Boot',
  'PostgreSQL', 'Docker', 'AWS', 'Node.js', 'Python',
  'Figma', 'Git', 'Linux', 'Nginx', 'MongoDB',
];
