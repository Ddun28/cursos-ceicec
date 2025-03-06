import { z } from "zod";
import { ModalidadSchema } from "./modalidad.model";
import { UsuarioSchema } from "./usuario.model";

// Esquema para el curso (incluye relaciones con Usuario y Modalidad)
export const CursoSchema = z.object({
  curso_id: z.number().optional(), // Opcional porque no se envía al crear un nuevo curso
  nombre: z.string().min(1, "El nombre es requerido"),
  cedula_instructor: z.number().min(1, "La cédula del instructor es requerida"),
  costo: z.number().min(0, "El costo no puede ser negativo"),
  duracion: z.string().min(1, "La duración es requerida"),
  estado: z.boolean(),
  limite_estudiante: z.number().min(1, "El límite de estudiantes debe ser al menos 1"),
  modalidad_id: z.number().min(1, "El ID de la modalidad es requerido"),
  instructor: UsuarioSchema, // Relación con el instructor
  modalidad: ModalidadSchema, // Relación con la modalidad
});

// Esquema para crear un nuevo curso (sin curso_id, instructor ni modalidad)
export const CursoSchemaPost = CursoSchema.omit({
  curso_id: true,
  instructor: true,
  modalidad: true,
});

// Tipos inferidos a partir de los esquemas
export type Curso = z.infer<typeof CursoSchema>;
export type CursoPost = z.infer<typeof CursoSchemaPost>;