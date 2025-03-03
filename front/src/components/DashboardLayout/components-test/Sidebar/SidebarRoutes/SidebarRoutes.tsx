import { Separator } from "@/components/ui/separator";
import SidebarItem from "../SidebarItem/SidebarItem";
import { dataGeneralSidebar } from "./SidebarRoutes.data";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Route, SidebarItemType } from "./SidebarRoutes.types";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"; 

export default function SidebarRoutes() {
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {

      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      const rol_nombre = usuario.rol_nombre || "";

      const routes = dataGeneralSidebar.filter((route: Route) =>
        route.roles.includes(rol_nombre.toLowerCase())
      );

      setFilteredRoutes(routes);
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      setFilteredRoutes([]); 
    }
  }, []);

  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("usuario");

    navigate("/");
  };

  return (
    <div className="flex flex-col dark:bg-slate-900 bg-white justify-between h-full">
      <div>
        <div className="p-2 md:p-4">
          <p className="text-slate-500 mb-2">General</p>
          {filteredRoutes.map((item: Route) => (
            <SidebarItem key={item.label} item={item as SidebarItemType} />
          ))}
        </div>

        <Separator />
      </div>
      <div>
        <div className="text-center p-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Cerrar Sesión
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-800">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">
                  ¿Estás seguro de cerrar sesión?
                </DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Button className="border border-black dark:border-white" variant="destructive" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator />

        <footer className="text-center p-1 mt-2">2025.</footer>
      </div>
    </div>
  );
}