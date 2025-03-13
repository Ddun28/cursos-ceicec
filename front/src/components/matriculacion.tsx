import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import { jsPDF } from 'jspdf'; // Importamos jsPDF
import { createCursoUsuario } from '@/api/curso-usuario/curso-usuario.api';
import ModalInscripcion from './modalinscripcion';

interface Courses {
  curso_id: number;
  nombre: string;
  cedula_instructor: string;
  costo: number;
  duracion: number;
  estado: boolean;
  limite_estudiante: number;
  modalidad_id: string;
  descripcion: string;
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
        setError(error.response?.data?.error || '');
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

  // Función para generar el reporte en PDF
  const generarReportePDF = (curso: Courses, estadoPago: string) => {
    const doc = new jsPDF();

    // Configuración inicial
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Reporte de Pago del Curso", 20, 20);

    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Detalles del Curso
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    let yOffset = 35;

    // Función para asegurar que el valor sea un string válido
    const asegurarString = (valor: any): string => {
      return valor !== undefined && valor !== null ? String(valor) : "N/A";
    };

    // Obtener el nombre completo del instructor
    const nombreInstructor = curso.instructor
      ? `${curso.instructor.nombre} ${curso.instructor.apellido}`
      : "N/A";

    doc.text(`Curso: ${asegurarString(curso.nombre)}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Instructor: ${nombreInstructor}`, 20, yOffset); // Mostrar nombre y apellido
    yOffset += 10;
    doc.text(`Costo: ${asegurarString(curso.costo)} Bolívares`, 20, yOffset);
    yOffset += 10;
    doc.text(`Duración: ${asegurarString(curso.duracion)}`, 20, yOffset); // Duración ya es un string
    yOffset += 10;
    doc.text(`Descripción: ${asegurarString(curso.descripcion)}`, 20, yOffset); // Nueva línea para la descripción
    yOffset += 10;
    doc.text(`Estado del Curso: ${curso.estado ? "Activo" : "Inactivo"}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Límite de Estudiantes: ${asegurarString(curso.limite_estudiante)}`, 20, yOffset);
    yOffset += 15;

    // Estado del Pago
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(estadoPago === "CONFIRMADO" ? 0 : 255, estadoPago === "CONFIRMADO" ? 128 : 0, 0);
    doc.text(`Estado del Pago: ${estadoPago === "CONFIRMADO" ? "Pagado" : "En espera"}`, 20, yOffset);
    yOffset += 20;

    // Tabla de Detalles del Pago
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Detalles del Pago", 20, yOffset);
    yOffset += 10;

    // Crear una tabla
    const headers = ["Concepto", "Valor"];
    const data = [
      ["Curso", asegurarString(curso.nombre)],
      ["Instructor", nombreInstructor], // Usar nombre completo del instructor
      ["Costo", `${asegurarString(curso.costo)} Bolívares`],
      ["Duración", asegurarString(curso.duracion)], // Duración ya es un string
      ["Descripción", asegurarString(curso.descripcion)], // Nueva fila para la descripción
      ["Estado del Curso", curso.estado ? "Activo" : "Inactivo"],
      ["Límite de Estudiantes", asegurarString(curso.limite_estudiante)],
      ["Estado del Pago", estadoPago === "CONFIRMADO" ? "Pagado" : "En espera"],
    ];

    // Dibujar la tabla
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.setDrawColor(150, 150, 150);

    let startY = yOffset;
    let rowHeight = 10;
    let colWidth = 85;

    // Dibujar encabezados de la tabla
    doc.setFillColor(230, 230, 230);
    doc.rect(20, startY, colWidth, rowHeight, "F");
    doc.rect(20 + colWidth, startY, colWidth, rowHeight, "F");
    doc.text(headers[0], 25, startY + 7);
    doc.text(headers[1], 25 + colWidth, startY + 7);
    startY += rowHeight;

    // Dibujar filas de la tabla
    data.forEach((row) => {
      doc.rect(20, startY, colWidth, rowHeight, "S");
      doc.rect(20 + colWidth, startY, colWidth, rowHeight, "S");
      doc.text(row[0], 25, startY + 7); // Concepto
      doc.text(row[1], 25 + colWidth, startY + 7); // Valor
      startY += rowHeight;
    });

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Gracias por su compra.", 20, startY + 20);
    doc.text("Fecha de generación: " + new Date().toLocaleDateString(), 20, startY + 30);

    // Guardar el PDF
    doc.save(`reporte_pago_curso_${curso.curso_id}.pdf`);
  };

  // Función para contar las inscripciones confirmadas de un curso
  const contarInscripcionesConfirmadasPorCurso = (cursoId: number) => {
    return cursosInscritos.filter(
      (inscripcion) =>
        inscripcion.cursos_inscritos.includes(cursoId) && // Verificamos si el curso está en la inscripción
        inscripcion.estado_pago.toUpperCase() === 'CONFIRMADO' // Solo contamos las confirmadas
    ).length;
  };

  // Función para verificar si el curso está en estado "EN_ESPERA"
  const cursoEnEspera = (cursoId: number) => {
    return cursosInscritos.some(
      (inscripcion) =>
        inscripcion.cedula === cedulaUsuario &&
        inscripcion.cursos_inscritos.includes(cursoId) &&
        inscripcion.estado_pago.toUpperCase() === 'EN_ESPERA'
    );
  };

  const agregarAlCarrito = (curso: Courses) => {
    // Verificar si el curso está en estado "EN_ESPERA"
    if (cursoEnEspera(curso.curso_id)) {
      alert('Este curso está en espera de confirmación de pago.');
      return;
    }

    // Verificar si el usuario ya está inscrito en el curso
    const cursoInscrito = cursosInscritos.find(
      (inscripcion) =>
        inscripcion.cedula === cedulaUsuario &&
        inscripcion.cursos_inscritos.includes(curso.curso_id) &&
        inscripcion.estado_pago.toUpperCase() === 'CONFIRMADO'
    );

    if (cursoInscrito) {
      alert('Ya estás inscrito en este curso.');
      return;
    }

    // Contar las inscripciones confirmadas para este curso
    const inscripcionesConfirmadasPorCurso = contarInscripcionesConfirmadasPorCurso(curso.curso_id);

    // Verificar si el curso ha alcanzado su límite de estudiantes
    if (inscripcionesConfirmadasPorCurso >= curso.limite_estudiante) {
      alert('Este curso ha alcanzado el límite de estudiantes.');
      return;
    }

    // Si el curso no está lleno, lo agregamos al carrito
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
        const inscripcionesConfirmadasPorCurso = contarInscripcionesConfirmadasPorCurso(course.curso_id);
        const cursoLleno = inscripcionesConfirmadasPorCurso >= course.limite_estudiante;
        const cursoInscrito = cursosInscritos.find(
          (inscripcion) =>
            inscripcion.cedula === cedulaUsuario &&
            inscripcion.cursos_inscritos.includes(course.curso_id) &&
            inscripcion.estado_pago.toUpperCase() === 'CONFIRMADO'
        );
        const enEspera = cursoEnEspera(course.curso_id);

        return (
          <div key={course.curso_id} className="border border-black-300 rounded-lg p-5 w-72 shadow-md">
            <h3 className="mt-0 text-lg font-semibold">{course.nombre}</h3>
            <p>Instructor: {course.instructor?.nombre || 'No disponible'}</p>
            <p>Costo: {course.costo} Bolívares</p>
            <p>Duración: {course.duracion}</p>
            <p>Estado: {course.estado ? 'Activo' : 'Inactivo'}</p>
            <p>Límite de Estudiantes: {course.limite_estudiante}</p>
            <p>Descripción: {course.descripcion}</p>
            <button
              onClick={() => agregarAlCarrito(course)}
              className="mt-3 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 transition"
              disabled={!!cursoInscrito || cursoLleno || enEspera}
            >
              {cursoInscrito
                ? 'Inscrito'
                : enEspera
                ? 'En espera'
                : cursoLleno
                ? 'Curso lleno'
                : 'Agregar al carrito'}
            </button>
            {cursoInscrito && (
              <button
                onClick={() => generarReportePDF(course, 'CONFIRMADO')} // Pasar el estado de pago
                className="mt-3 ml-2 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
              >
                Descargar PDF
              </button>
            )}
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
          createCursoUsuario={createCursoUsuario}
        />
      )}
    </div>
  );
};

export default ListaCourses;