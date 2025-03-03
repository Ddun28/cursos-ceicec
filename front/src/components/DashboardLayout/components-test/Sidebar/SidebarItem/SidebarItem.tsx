import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarItemProps } from "./SidebarItem.type";

export default function SidebarItem(props: SidebarItemProps) {
  const { item } = props;
  const { href, icon: Icon, label } = item;
  const location = useLocation();
  const activePath = location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        "flex gap-x-2 mt-2 text-sm items-center p-2 rounded-lg transition-colors",
        "text-foreground hover:bg-accent/80", // Texto y hover
        activePath && "bg-primary/10 text-primary", // Estado activo
        "dark:hover:bg-primary/20" // Hover en modo oscuro
      )}
    >
      <Icon className="h-5 w-5 stroke-[1.5]" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}