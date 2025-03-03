import { LucideIcon } from "lucide-react";

export type Route = {
  icon: LucideIcon;
  label: string;
  href: string;
  roles: string[];
};

export type SidebarItemType = {
  label: string;
  icon: LucideIcon;
  href: string;
};