import { z } from "zod";

// Esquema para el instructor
const InstructorSchema = z.object({
  apellido: z.string().min(1, "El apellido es requerido"),
  cedula: z.number().min(1, "La cédula es requerida"),
  correo: z.string().email("El correo debe ser válido"),
  created_at: z.string().nullable(), 
  nombre: z.string().min(1, "El nombre es requerido"),
  rol_id: z.number().nullable(), 
  usuario_telegram: z.string().optional(),
});

// Esquema para la modalidad
const ModalidadSchema = z.object({
  modalidad_id: z.number().min(1, "El ID de la modalidad es requerido"),
  modalidad_nombre: z.string().min(1, "El nombre de la modalidad es requerido"),
});

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
  instructor: InstructorSchema, 
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