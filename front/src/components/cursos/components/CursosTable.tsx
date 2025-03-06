import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CursoForm } from "./CursoForm";
import { CursoActions } from "./CursoActions";
import { getCourses, createCourse, updateCourse, deleteCourse } from "@/api/cursos/cursos.api";
import { Curso, CursoPost } from "@/models/curso.model";
import { DataTable } from "./DataTable"; 
import { ColumnDef } from "@tanstack/react-table";
import { toast } from 'react-toastify';
import { getModalities } from "@/api/modalidad/modalidad.api";
import { getUsers, getUsersByRole } from "@/api/usuario/usuario.api"; 
import { Modalidad } from "@/models/modalidad.model";
import { Usuario } from "@/models/usuario.model";

export const CursosTable = () => {
  const [courses, setCourses] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentCourse, setCurrentCourse] = useState<CursoPost | null>(null);
  const [instructors, setInstructors] = useState<Usuario[]>([]);
  const [modalities, setModalities] = useState<Modalidad[]>([]);  
  const [filteredInstructors, setFilteredInstructors] = useState<Usuario[]>([]); // Estado para los instructores filtrados
  const [selectedRole, setSelectedRole] = useState<string>('docente'); // Estado para el rol seleccionado, predeterminado a "docente"

  // Obtener el usuario autenticado desde el localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || {});
  const cedulaUsuario = usuario.cedula;
  const rolUsuario = usuario.rol_nombre;

  useEffect(() => {
    fetchCourses();
    fetchInstructorsAndModalities();
    fetchInstructorsByRole(selectedRole); // Llama a la función para obtener instructores por rol al cargar el componente
  }, []); // Solo se ejecuta una vez al montar el componente

  const fetchInstructorsAndModalities = async () => {
    try {
      const [instructorsData, modalitiesData] = await Promise.all([
        getUsers(),
        getModalities(),
      ]);
      setInstructors(instructorsData);
      setModalities(modalitiesData);
    } catch (error) {
      console.error("Error al obtener instructores y modalidades:", error);
    }
  };

  const fetchInstructorsByRole = async (role: string) => {
    try {
      const instructorsData = await getUsersByRole(role);
      setFilteredInstructors(instructorsData); // Actualiza el estado con los instructores filtrados
    } catch (error) {
      console.error("Error al obtener instructores por rol:", error);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();

      // Filtrar cursos si el usuario es docente
      if (rolUsuario === "docente") {
        const cursosFiltrados = data.filter((curso) => curso.cedula_instructor === cedulaUsuario);
        setCourses(cursosFiltrados);
      } else {
        // Si es administrador, mostrar todos los cursos
        setCourses(data);
      }
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (curso: Omit<CursoPost, "curso_id">) => {
    try {
      await createCourse(curso);
      await fetchCourses(); 
      setIsCreateModalOpen(false);
      toast.success("Curso creado correctamente");
    } catch (error) {
      console.error("Error al crear el curso:", error);
      toast.error("Error al crear el curso");
    }
  };

  const handleEdit = async (curso: CursoPost) => {
    try {
      await updateCourse(curso);
      await fetchCourses();
      setIsEditModalOpen(false);
      toast.success("Curso actualizado correctamente");
    } catch (error) {
      console.error("Error al editar el curso:", error);
      toast.error("Error al editar el curso");
    }
  };

  const handleDelete = async (cursoId: number) => {
    try {
      await deleteCourse(cursoId.toString());
      await fetchCourses();
      toast.success("Curso eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      toast.error("Error al eliminar un curso");
    }
  };

  const columns: ColumnDef<Curso>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre del Curso",
    },
    {
      accessorKey: "instructor",
      header: "Instructor",
      cell: ({ row }) => {
        const instructor = row.original.instructor;
        return `${instructor.nombre} ${instructor.apellido}`;
      },
    },
    {
      accessorKey: "costo",
      header: "Costo",
    },
    {
      accessorKey: "duracion",
      header: "Duración",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (row.original.estado ? "Activo" : "Inactivo"),
    },
    {
      accessorKey: "limite_estudiante",
      header: "Límite de Estudiantes",
    },
    {
      accessorKey: "modalidad",
      header: "Modalidad",
      cell: ({ row }) => row.original.modalidad.modalidad_nombre,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <CursoActions
          cursoId={row.original.curso_id} // Pasar el cursoId
          onEdit={() => {
            setCurrentCourse(row.original);
            setIsEditModalOpen(true);
          }}
          onDelete={() => handleDelete(row.original.curso_id!)}
        />
      ),
    }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Listado de Cursos</h1>
          <Button className="dark:bg-blue-800 bg-blue-600 text-white hover:bg-blue-950 rounded" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Crear Curso
          </Button>
      </div>

      <DataTable columns={columns} data={courses} />


        <>
          <CursoForm
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreate}
            instructors={filteredInstructors} // Usa los instructores filtrados
            modalities={modalities} 
          />

          {currentCourse && (
            <CursoForm
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleEdit}
              initialData={currentCourse}
              instructors={filteredInstructors} // Usa los instructores filtrados
              modalities={modalities} 
            />
          )}
        </>
    </div>
  );
};