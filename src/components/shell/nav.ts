import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Flag,
  ArrowLeftRight,
  RadioTower,
  Gauge,
  ClipboardList,
  Construction,
  BarChart3,
  TrendingUp,
  Boxes,
  Users,
  UserSearch,
  Map,
  ShieldAlert,
  Activity,
  FileText,
  Plug,
  ShieldCheck,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "",
    items: [{ href: "/", label: "Обзор", icon: LayoutDashboard }],
  },
  {
    title: "Программа",
    items: [
      { href: "/tazartu-2026", label: "Тазарту 2026", icon: Flag },
      { href: "/migration", label: "Миграция абонентов", icon: ArrowLeftRight },
      { href: "/construction", label: "Строительство оптики", icon: Construction },
      { href: "/dslam", label: "Демонтаж DSLAM", icon: RadioTower },
      { href: "/speed", label: "Скорость интернета", icon: Gauge },
      { href: "/orders", label: "Заказы на переключение", icon: ClipboardList },
    ],
  },
  {
    title: "Аналитика и экономика",
    items: [
      { href: "/analytics", label: "Аналитика", icon: BarChart3 },
      { href: "/economics", label: "Экономика", icon: TrendingUp },
    ],
  },
  {
    title: "Ресурсы",
    items: [
      { href: "/materials", label: "Материалы", icon: Boxes },
      { href: "/staff", label: "Персонал", icon: Users },
      { href: "/clients", label: "Клиенты", icon: UserSearch },
    ],
  },
  {
    title: "Управление проектом",
    items: [
      { href: "/project", label: "Центр управления проектом", icon: Map },
      { href: "/risks", label: "Управление рисками", icon: ShieldAlert },
      { href: "/monitoring", label: "Мониторинг в реальном времени", icon: Activity },
      { href: "/documents", label: "Документы проекта", icon: FileText },
    ],
  },
  {
    title: "Система",
    items: [
      { href: "/integrations", label: "Интеграции", icon: Plug },
      { href: "/security", label: "Безопасность", icon: ShieldCheck },
    ],
  },
];
