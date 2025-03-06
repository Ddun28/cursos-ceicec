// ListaCourses.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalInscripcion from './modalinscripcion';
import { FaShoppingCart } from 'react-icons/fa';
import { createCursoUsuario } from '@/api/curso-usuario/curso-usuario.api'; // Importar la función de la API

interface Courses {
  curso_id: number;
  nombre: string;
  cedula_instructor: string;
  costo: number;
  duracion: number;
  estado: boolean;
  limite_estudiante: number;
  modalidad_id: string;
}

interface Inscripcion {
  cedula: number;
  cursos_inscritos: number[];
  estado_pago: string;
}

export const ListaCourses: React.FC = () => {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [carrito, setCarrito] = useState<Courses[]>([]);
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [cursosInscritos, setCursosInscritos] = useState<Inscripcion[]>([]);

  // Obtener datos del usuario desde el localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const cedulaUsuario = usuario.cedula;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/lista_cursos');
        setCourses(response.data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al obtener Cursos');
      }
    };

    const fetchCursosInscritos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await axios.get('http://localhost:5000/listado-pago', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCursosInscritos(response.data);
        }
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al obtener cursos inscritos');
      }
    };

    fetchCourses();
    fetchCursosInscritos();

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Función para contar las inscripciones confirmadas de un curso
  const contarInscripcionesConfirmadas = (cursoId: number) => {
    return cursosInscritos.filter(
      (inscripcion) =>
        inscripcion.cursos_inscritos.includes(cursoId) &&
        inscripcion.estado_pago === 'CONFIRMADO'
    ).length;
  };

  const agregarAlCarrito = (curso: Courses) => {
    const cursoInscrito = cursosInscritos.find(
      (inscripcion) =>
        inscripcion.cedula === cedulaUsuario &&
        inscripcion.cursos_inscritos.includes(curso.curso_id) &&
        inscripcion.estado_pago === 'CONFIRMADO'
    );

    if (cursoInscrito) {
      alert('Ya estás inscrito en este curso.');
      return;
    }

    // Verificar si el curso ha alcanzado el límite de estudiantes
    const inscripcionesConfirmadas = contarInscripcionesConfirmadas(curso.curso_id);
    if (inscripcionesConfirmadas >= curso.limite_estudiante) {
      alert('Este curso ha alcanzado el límite de estudiantes.');
      return;
    }

    setCarrito((prevCarrito) => {
      const cursoExistente = prevCarrito.find((c) => c.curso_id === curso.curso_id);
      if (!cursoExistente) {
        return [...prevCarrito, curso];
      }
      return prevCarrito;
    });
  };

  const eliminarDelCarrito = (cursoId: number) => {
    setCarrito((prevCarrito) => prevCarrito.filter((curso) => curso.curso_id !== cursoId));
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setError('');
  };

  const toggleCarrito = () => {
    setCarritoVisible(!carritoVisible);
  };

  return (
    <div className="flex flex-wrap gap-5 p-5 relative">
      <div className="absolute top-5 right-5">
        <FaShoppingCart className="text-2xl cursor-pointer" onClick={toggleCarrito} />
        {carrito.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-black rounded-full px-1 text-xs">
            {carrito.length}
          </span>
        )}
      </div>

      {courses.map((course) => {
        const cursoInscrito = cursosInscritos.find(
          (inscripcion) =>
            inscripcion.cedula === cedulaUsuario &&
            inscripcion.cursos_inscritos.includes(course.curso_id) &&
            inscripcion.estado_pago === 'CONFIRMADO'
        );

        // Verificar si el curso ha alcanzado el límite de estudiantes
        const inscripcionesConfirmadas = contarInscripcionesConfirmadas(course.curso_id);
        const cursoLleno = inscripcionesConfirmadas >= course.limite_estudiante;

        return (
          <div key={course.curso_id} className="border border-black-300 rounded-lg p-5 w-72 shadow-md">
            <h3 className="mt-0 text-lg font-semibold">{course.nombre}</h3>
            <p>Instructor: {course.cedula_instructor}</p>
            <p>Costo: {course.costo} Bolívares</p>
            <p>Duración: {course.duracion}</p>
            <p>Estado: {course.estado ? 'Activo' : 'Inactivo'}</p>
            <p>Límite de Estudiantes: {course.limite_estudiante}</p>
            <p>Modalidad: {course.modalidad_id}</p>
            <button 
              onClick={() => agregarAlCarrito(course)} 
              className="mt-3 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition"
              disabled={!!cursoInscrito || cursoLleno}
            >
              {cursoInscrito ? 'Inscrito' : cursoLleno ? 'Curso lleno' : 'Agregar al carrito'}
            </button>
          </div>
        );
      })}

      {carritoVisible && (
        <div className="absolute top-16 right-5 dark:bg-black bg-white border border-gray-300 rounded-lg shadow-lg p-5 w-80">
          <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p>No hay cursos en el carrito.</p>
          ) : (
            <div>
              {carrito.map((curso) => (
                <div key={curso.curso_id} className="border-b border-gray-200 py-2">
                  <h3 className="font-semibold">{curso.nombre}</h3>
                  <p>Costo: {curso.costo} Bolívares</p>
                  <button 
                    onClick={() => eliminarDelCarrito(curso.curso_id)} 
                    className="mt-1 inline-block bg-red-600 text-white py-1 px-2 rounded hover:bg-red-500 transition"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <div className="mt-4 font-bold text-lg">
                Total: {carrito.reduce((sum, curso) => sum + curso.costo, 0)} Bs
              </div>
              <button 
                onClick={() => setModalAbierto(true)} 
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition"
              >
                Proceder al Pago
              </button>
            </div>
          )}
        </div>
      )}

      {modalAbierto && (
        <ModalInscripcion
          carrito={carrito}
          onCerrar={handleCerrarModal}
          error={error}
          createCursoUsuario={createCursoUsuario} // Pasar la función como prop
        />
      )}
    </div>
  );
};

export default ListaCourses;