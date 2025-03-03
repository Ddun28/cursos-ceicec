import { CursosTable } from "./components/CursosTable";

export default function Cursos() {
  return (
    <div className="mx-auto container flex justify-center p-2 gap-5 flex-col">
        <div className="flex justify-center">
          <CursosTable/>
        </div>
    </div>
  )
}
