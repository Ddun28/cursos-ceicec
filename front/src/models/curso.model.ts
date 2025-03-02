import { z } from "zod";
import { ModalidadSchema } from "./modalidad.model";
import { UsuarioSchema } from "./usuario.model";

// Esquema para el curso
export const CursoSchema = z.object({
  curso_id: z.number().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
  cedula_instructor: z.number().min(1, "La cédula del instructor es requerida"),
  costo: z.number().min(0, "El costo no puede ser negativo"),
  duracion: z.string().min(1, "La duración es requerida"),
  estado: z.boolean(),
  limite_estudiante: z.number().min(1, "El límite de estudiantes debe ser al menos 1"),
  modalidad_id: z.number().min(1, "El ID de la modalidad es requerido"),
  instructor: UsuarioSchema, 
  modalidad: ModalidadSchema, 
});

export const CursoSchemaPost = z.object({
  curso_id: z.number().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
  cedula_instructor: z.number().min(1, "La cédula del instructor es requerida"),
  costo: z.number().min(0, "El costo no puede ser negativo"),
  duracion: z.string().min(1, "La duración es requerida"),
  estado: z.boolean(),
  limite_estudiante: z.number().min(1, "El límite de estudiantes debe ser al menos 1"),
  modalidad_id: z.number().min(1, "El ID de la modalidad es requerido"),
});

export type Curso = z.infer<typeof CursoSchema>;
export type CursoPost = z.infer<typeof CursoSchemaPost>;