import { Home, BookOpen, UserPlus, Users, User } from "lucide-react";

// Definir las rutas generales
export const dataGeneralSidebar = [
  // {
  //   icon: Home,
  //   label: "Home",
  //   href: "/home",
  //   roles: ["estudiante", "docente", "administrador"], // Roles que pueden ver esta ruta
  // },
  {
    icon: BookOpen,
    label: "Cursos",
    href: "/dashboard/docente",
    roles: ["docente", "administrador"], // Solo docentes y administradores
  },
  {
    icon: UserPlus,
    label: "Matriculación",
    href: "/dashboard/estudiante",
    roles: ["estudiante"], // Solo estudiantes
  },
  {
    icon: Users,
    label: "Usuarios",
    href: "/dashboard/usuarios",
    roles: ["administrador"], // Solo administradores
  },
  {
    icon: User,
    label: "Editar Perfil",
    href: "/dashboard/editar-perfil",
    roles: ["estudiante", "docente", "administrador"], // Todos los roles
  },
];