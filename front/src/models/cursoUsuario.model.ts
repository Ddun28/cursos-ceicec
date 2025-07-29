import { z } from "zod";

// Definimos los posibles estados de pago como constante
const EstadosPago = ["EN_ESPERA", "CONFIRMADO", "CANCELADO"] as const;

// Esquema para POST (creación)
export const CursoUsuarioSchemaPost = z.object({
  cedula: z.number().int().positive(), 
  cursos_inscritos: z.array(
    z.number().int().positive().describe("IDs de cursos a inscribir")
  ).min(1, "Debe inscribirse al menos en un curso"),
  monto: z.number().positive("El monto debe ser positivo"),
  moneda: z.string().min(1, "La moneda es requerida"), 
  banco: z.string().min(2, "El nombre del banco es requerido").optional(),
  estado_pago: z.enum(EstadosPago).default("EN_ESPERA"),
  numero_referencia: z.number().int().positive().optional()
    .describe("Número de referencia del pago"),
});

// Esquema para PUT (actualización)
export const CursoUsuarioSchemaPut = z.object({
  estado_pago: z.enum(EstadosPago),
  banco: z.string().min(2).optional(),
  numero_referencia: z.number().int().positive().optional()
}).partial();

// Tipos TypeScript inferidos
export type CursoUsuarioPost = z.infer<typeof CursoUsuarioSchemaPost>;
export type CursoUsuarioPut = z.infer<typeof CursoUsuarioSchemaPut>;