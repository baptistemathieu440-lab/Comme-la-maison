import {
  AlertTriangle,
  Bell,
  BookHeart,
  BookOpen,
  Building2,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  ClipboardList,
  FileText,
  FolderOpen,
  Handshake,
  Home,
  LayoutDashboard,
  ListChecks,
  Menu,
  Receipt,
  RefreshCw,
  ScrollText,
  Settings,
  UserCog,
  UserRound,
  Users,
  Wallet,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Space = "admin" | "owner" | "staff";

export type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };
export type NavGroup = { label?: string; items: NavItem[] };

export const navigation: Record<Space, NavGroup[]> = {
  admin: [
    {
      items: [
        { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
        { href: "/admin/calendrier", label: "Calendrier", icon: CalendarRange },
        { href: "/admin/notifications", label: "Notifications", icon: Bell },
      ],
    },
    {
      label: "Activité",
      items: [
        { href: "/admin/reservations", label: "Réservations", icon: CalendarDays },
        { href: "/admin/taches", label: "Tâches", icon: ClipboardCheck },
        { href: "/admin/incidents", label: "Incidents", icon: AlertTriangle },
        { href: "/admin/interventions", label: "Interventions", icon: Wrench },
      ],
    },
    {
      label: "Biens et clients",
      items: [
        { href: "/admin/biens", label: "Biens", icon: Building2 },
        { href: "/admin/proprietaires", label: "Propriétaires", icon: Users },
        { href: "/admin/prospects", label: "Prospects", icon: Handshake },
        { href: "/admin/prestataires", label: "Prestataires", icon: UserRound },
      ],
    },
    {
      label: "Voyageurs",
      items: [{ href: "/admin/guide", label: "Guide voyageurs", icon: BookHeart }],
    },
    {
      label: "Finances",
      items: [
        { href: "/admin/finances", label: "Vue d’ensemble", icon: Wallet },
        { href: "/admin/depenses", label: "Dépenses", icon: Receipt },
        { href: "/admin/releves", label: "Relevés et factures", icon: FileText },
        { href: "/admin/documents", label: "Documents", icon: FolderOpen },
      ],
    },
    {
      label: "Système",
      items: [
        { href: "/admin/synchronisation", label: "Synchronisation", icon: RefreshCw },
        { href: "/admin/automatisations", label: "Automatisations", icon: Workflow },
        { href: "/admin/journal", label: "Journal d’activité", icon: ScrollText },
        { href: "/admin/parametres", label: "Paramètres", icon: Settings },
        { href: "/admin/compte", label: "Mon compte", icon: UserCog },
      ],
    },
  ],
  owner: [
    {
      items: [
        { href: "/owner", label: "Accueil", icon: Home, exact: true },
        { href: "/owner/calendrier", label: "Calendrier", icon: CalendarRange },
        { href: "/owner/reservations", label: "Réservations", icon: CalendarDays },
        { href: "/owner/revenus", label: "Revenus", icon: Wallet },
        { href: "/owner/releves", label: "Relevés", icon: FileText },
        { href: "/owner/documents", label: "Documents", icon: FolderOpen },
        { href: "/owner/notifications", label: "Notifications", icon: Bell },
        { href: "/owner/compte", label: "Mon compte", icon: UserCog },
      ],
    },
  ],
  staff: [
    {
      items: [
        { href: "/staff", label: "Aujourd’hui", icon: ListChecks, exact: true },
        { href: "/staff/planning", label: "Planning", icon: ClipboardList },
        { href: "/staff/incidents", label: "Signalements", icon: AlertTriangle },
        { href: "/staff/notifications", label: "Notifications", icon: Bell },
        { href: "/staff/compte", label: "Mon compte", icon: UserCog },
      ],
    },
  ],
};

/** Onglets du bas sur téléphone (le dernier ouvre le menu complet). */
export const mobileTabs: Record<Space, NavItem[]> = {
  admin: [
    { href: "/admin", label: "Accueil", icon: LayoutDashboard, exact: true },
    { href: "/admin/calendrier", label: "Calendrier", icon: CalendarRange },
    { href: "/admin/reservations", label: "Réservations", icon: CalendarDays },
    { href: "/admin/taches", label: "Tâches", icon: ClipboardCheck },
  ],
  owner: [
    { href: "/owner", label: "Accueil", icon: Home, exact: true },
    { href: "/owner/calendrier", label: "Calendrier", icon: CalendarRange },
    { href: "/owner/revenus", label: "Revenus", icon: Wallet },
    { href: "/owner/releves", label: "Relevés", icon: FileText },
  ],
  staff: [
    { href: "/staff", label: "Aujourd’hui", icon: ListChecks, exact: true },
    { href: "/staff/planning", label: "Planning", icon: ClipboardList },
    { href: "/staff/incidents", label: "Signaler", icon: AlertTriangle },
    { href: "/staff/notifications", label: "Alertes", icon: Bell },
  ],
};

export const spaceLabel: Record<Space, string> = {
  admin: "Back-office",
  owner: "Espace propriétaire",
  staff: "Espace agent",
};

export const MenuIcon = Menu;
export const GuideIcon = BookOpen;

export function isActive(pathname: string, item: Pick<NavItem, "href" | "exact">) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
