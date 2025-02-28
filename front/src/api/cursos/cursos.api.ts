import { AxiosResponse } from "axios";
import api from "../api"; 
import { CursoPost, CursoSchemaPost } from "@/models/curso.model";

/**
 * Crear un nuevo curso
 */
export const createCourse = async (curso: Omit<CursoPost, 'curso_id'>): Promise<void> => {
  try {

    const validatedData = CursoSchemaPost.safeParse(curso);

    if (!validatedData.success) {
      console.error("Error de validación:", validatedData.error);
      return;
    }

    const res: AxiosResponse = await api.post("/curso", validatedData.data);

    if (res.status === 201) {
      console.log("Curso creado:", res.data);
    } else {
      throw new Error("Error al crear el curso");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Actualizar un curso existente
 */
export const updateCourse = async (curso: CursoPost): Promise<void> => {
  try {

    const validatedData = CursoSchemaPost.safeParse(curso);

    if (!validatedData.success) {
      console.error("Error de validación:", validatedData.error);
      return;
    }

    const res: AxiosResponse = await api.put(`/actualizar_cursos/${curso.curso_id}`, {
      curso_id: curso.curso_id,
      nombre: curso.nombre,
      cedula_instructor: curso.cedula_instructor,
      costo: curso.costo,
      duracion: curso.duracion,
      estado: curso.estado,
      limite_estudiante: curso.limite_estudiante,
      modalidad_id: curso.modalidad_id,
    });

    if (res.status === 200) {
      console.log("Curso actualizado:", res.data);
    } else {
      throw new Error("Error al actualizar el curso");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Eliminar un curso
 */
export const deleteCourse = async (id: string): Promise<void> => {
  if (!id) {
    console.error("ID del curso es requerido");
    return;
  }

  try {
    const res: AxiosResponse = await api.delete(`/eliminar_curso/${id}`);

    if (res.status === 200) {
      console.log("Curso eliminado:", res.data);
    } else {
      throw new Error("Error al eliminar el curso");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Obtener todos los cursos
 */
export const getCourses = async (): Promise<any> => {
  try {
    const res: AxiosResponse = await api.get("/lista_cursos");

    if (res.status === 200) {
      return res.data; 
    } else {
      throw new Error("Error al obtener los cursos");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};