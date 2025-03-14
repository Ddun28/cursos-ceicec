import { AxiosResponse } from "axios";
import api from "../api";
import { CursoSchema, CursoSchemaPost } from "@/models/curso.model";
import { Curso, CursoPost } from "@/models/curso.model";
import { z } from "zod";

/**
 * Crear un nuevo curso
 */
export const createCourse = async (curso: CursoPost): Promise<void> => {
  try {
    const validatedData = CursoSchemaPost.safeParse(curso);

    if (!validatedData.success) {
      console.error("Error de validación:", validatedData.error);
      throw new Error("Datos inválidos");
    }

    const res: AxiosResponse<Curso> = await api.post("/curso", validatedData.data);

    if (res.status === 201) {
      console.log("Curso creado:", res.data);
    } else {
      throw new Error("Error al crear el curso");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Actualizar un curso existente
 */

export const updateCourse = async (curso: Curso): Promise<void> => {
  try {
    const res: AxiosResponse<Curso> = await api.put(`/actualizar_cursos/${curso.curso_id}`, curso);

    if (res.status === 200) {
      console.log("Curso actualizado:", res.data);
    } else {
      throw new Error("Error al actualizar el curso");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * Eliminar un curso
 */
export const deleteCourse = async (id: string): Promise<void> => {
  if (!id) {
    console.error("ID del curso es requerido");
    throw new Error("ID del curso es requerido");
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
    throw error;
  }
};

/**
 * Obtener todos los cursos
 */
export const getCourses = async (): Promise<Curso[]> => {
  try {
    const res: AxiosResponse<Curso[]> = await api.get("/lista_cursos");

    if (res.status === 200) {
      const validatedData = z.array(CursoSchema).safeParse(res.data);

      if (!validatedData.success) {
        console.error("Error de validación:", validatedData.error);
        throw new Error("Datos inválidos recibidos del servidor");
      }

      return validatedData.data;
    } else {
      throw new Error("Error al obtener los cursos");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};