import { Link, useNavigate } from "react-router-dom";

export function Logo() {
  const navigate = useNavigate();

  return (
    <div 
      className="h-20 min-h-20 flex items-center px-6 cursor-pointer gap-2 transition-colors hover:bg-accent/40"
      onClick={() => navigate("/")}
    >
      <h1 className="font-bold text-2xl text-foreground">
        <span className="text-primary">Cursos</span> Ceicec
      </h1>
    </div>
  );
}