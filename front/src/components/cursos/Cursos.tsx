import { CursosTable } from "./components/CursosTable";

export default function Cursos() {
  return (
    <div className="container mx-auto p-4"> 
      <div className="flex flex-col gap-5"> 
        <CursosTable />
      </div>
    </div>
  );
}