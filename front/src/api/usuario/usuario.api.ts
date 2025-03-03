import { AxiosResponse } from "axios";
import api from "../api"; 
import { Usuario } from "@/models/usuario.model";

/**
 * GET
 */
export const getUsers = async (): Promise<Usuario[]> => {
  try {
    const res: AxiosResponse = await api.get("/usuarios"); 

    if (res.status === 200) {
      return res.data; 
    } else {
      throw new Error("Error al obtener los usuarios");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; 
  }
};

export const getUsersByRole = async (role: string): Promise<Usuario[]> => {
  try {
    const res: AxiosResponse = await api.get(`/usuarios/por-rol?rol=${role}`); 

    if (res.status === 200) {
      return res.data; 
    } else {
      throw new Error("Error al obtener los usuarios por rol");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; 
  }
};