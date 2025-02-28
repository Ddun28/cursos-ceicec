import { AxiosResponse } from "axios";
import api from "../api"; 
import { Modalidad } from "@/models/modalidad.model"; 

/**
 * GET
 */
export const getModalities = async (): Promise<Modalidad[]> => {
  try {
    const res: AxiosResponse = await api.get("/lista_modalidades");

    if (res.status === 200) {
      return res.data; 
    } else {
      throw new Error("Error al obtener las modalidades");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; 
  }
};