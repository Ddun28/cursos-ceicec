import { Button } from '@/components/ui/button'
import { useLocation, Link } from 'react-router-dom'

export default function SidebarButtons() {
  const location = useLocation()

  return (
    <div className="flex flex-col gap-1">
        <Button 
          asChild
          variant={location.pathname === '/cursos' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
        >
          <Link to="/cursos">
            Cursos
          </Link>
        </Button>
        
        <Button 
          asChild
          variant={location.pathname === '/usuarios' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
        >
          <Link to="/usuarios">
            Usuarios
          </Link>
        </Button>
        
        <Button 
          asChild
          variant={location.pathname === '/matriculacion' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
        >
          <Link to="/matriculacion">
            Matriculación
          </Link>
        </Button>
    </div>
  )
}