import { CursosTable } from "./components/CursosTable";

export default function Cursos() {
  return (
    <div className="mx-auto flex justify-center p-2 gap-5 flex-col">
        <h1 className="text-xl ">Listado de Cursos</h1>
        <div className="flex justify-center">
          <CursosTable/>
        </div>
    </div>
  )
}
