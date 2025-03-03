import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalInscripcion from './modalinscripcion';


interface Courses {
  curso_id: number;
  nombre: string;
  cedula_instructor: string;
  costo: number;
  duracion: number;
  estado: boolean;
  limite_estudiante: number;
  modalidad_id: number;
}

export const ListaCourses: React.FC = () => {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Courses | null>(null);
  const [cedulaUsuario, setCedulaUsuario] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/lista_cursos');
        setCourses(response.data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al obtener Cursos');
      }
    };
    fetchCourses();

    const fetchCedula = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/ruta_protegida', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCedulaUsuario(response.data.cedula);
        } catch (error) {
          console.error('Error al obtener la cédula:', error);
        }
      }
    };
    fetchCedula();
  }, []);

  const handleInscribirseClick = (curso: Courses) => {
    setCursoSeleccionado(curso);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setError('');
  };

  const handlePago = async (pago: string) => {
    if (!cursoSeleccionado || cedulaUsuario === null) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No hay token de acceso. Inicia sesión para inscribirte.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/pago', {
        curso_id: cursoSeleccionado.curso_id,
        pago: pago,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Pago realizado');
      setModalAbierto(false);
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al realizar el pago');
    }
  };

  return (
<div className="flex flex-wrap gap-5 p-5">
  {courses.map((course) => (
    <div key={course.curso_id} className="border border-gray-300 rounded-lg p-5 w-72 shadow-md">
      <h3 className="mt-0 text-lg font-semibold">{course.nombre}</h3>
      <p>Instructor: {course.cedula_instructor}</p>
      <p>Costo: {course.costo} Bolívares</p>
      <p>Duración: {course.duracion}</p>
      <p>Estado: {course.estado ? 'Activo' : 'Inactivo'}</p>
      <p>Límite de Estudiantes: {course.limite_estudiante}</p>
      <p>Modalidad: {course.modalidad_id}</p>
      <button 
        onClick={() => handleInscribirseClick(course)} 
        className="mt-3 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
      >
        Inscribirse
      </button>
    </div>
  ))}

  {modalAbierto && cursoSeleccionado && cedulaUsuario !== null && (
    <ModalInscripcion
      nombreCurso={cursoSeleccionado.nombre}
      cedulaUsuario={cedulaUsuario}
      onPago={handlePago}
      onCerrar={handleCerrarModal}
      error={error}
    />
  )}
</div>
  );
};

export default ListaCourses;