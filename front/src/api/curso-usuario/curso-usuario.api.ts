import { AxiosResponse } from "axios";
import api from "../api";
import { CursoUsuarioPost, CursoUsuarioSchemaPost } from "@/models/cursoUsuario.model";

/**
 * Crear un nuevo registro en CursoUsuario
 */
export const createCursoUsuario = async (cursoUsuario: CursoUsuarioPost): Promise<void> => {
  try {
    // Validar los datos con Zod
    const validatedData = CursoUsuarioSchemaPost.safeParse(cursoUsuario);

    if (!validatedData.success) {
      console.error("Error de validación:", validatedData.error);
      return;
    }

    // Enviar la solicitud POST al backend
    const res: AxiosResponse = await api.post("/pago", validatedData.data);

    if (res.status === 201) {
      console.log("Registro creado:", res.data);
    } else {
      throw new Error("Error al crear el registro");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Obtener todos los registros de CursoUsuario
 */
export const getCursoUsuarios = async (): Promise<any> => {
  try {
    const res: AxiosResponse = await api.get("/listado-pago");

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Error al obtener los registros");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * Actualizar un registro en CursoUsuario
 */
export const updateCursoUsuario = async (id: number, cedula: string, estado_pago: string): Promise<void> => {
  try {
    const res: AxiosResponse = await api.put(`/actualizar_estado_pago/${id}/${cedula}`, {
      estado_pago: estado_pago,
    });

    if (res.status === 200) {
      console.log("Registro actualizado:", res.data);
    } else {
      throw new Error("Error al actualizar el registro");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
/**
 * Eliminar un registro en CursoUsuario
 */
export const deleteCursoUsuario = async (cedula: string): Promise<void> => {
  try {
    const res: AxiosResponse = await api.delete(`/eliminar_curso/${cedula}`);

    if (res.status === 200) {
      console.log("Registro eliminado:", res.data);
    } else {
      throw new Error("Error al eliminar el registro");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};