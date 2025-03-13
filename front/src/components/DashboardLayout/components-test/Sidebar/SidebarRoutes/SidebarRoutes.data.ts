import {  BookOpen, UserPlus, Users, User, CheckCircle } from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: BookOpen,
    label: "Cursos",
    href: "/dashboard/docente",
    roles: ["administrativo", "superusuario"], 
  },
  {
    icon: UserPlus,
    label: "Matriculación",
    href: "/dashboard/estudiante",
    roles: ["estudiante"], 
  },
  {
    icon: Users,
    label: "Usuarios",
    href: "/dashboard/usuarios",
    roles: ["superusuario"], 
  },
  {
    icon: User,
    label: "Editar Perfil",
    href: "/dashboard/editar-perfil",
    roles: ["estudiante", "administrativo", "superusuario"], 
  },
  {
    icon: CheckCircle, 
    label: "Verificar Pagos",
    href: "/dashboard/Verificacion-Pagos",
    roles: ["superusuario"], 
}
];