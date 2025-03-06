import { z } from "zod";

// Esquema para CursoUsuario
export const CursoUsuarioSchemaPost = z.object({
  cedula: z.number().int().positive(), // Cédula del usuario
  cursos_inscritos: z.array(z.number().int().positive()), // Lista de IDs de cursos
  monto: z.number().positive(), // Monto total del pago
  moneda: z.string().min(1, "La moneda es requerida"), // Moneda del pago
  estado_pago: z.enum(["confirmado", "EN_ESPERA", "cancelado"]).default("EN_ESPERA"), // Estado del pago con valor predeterminado
  numero_referencia: z.number().int().positive().optional(), // Número de referencia opcional
});

// Tipo para CursoUsuario
export type CursoUsuarioPost = z.infer<typeof CursoUsuarioSchemaPost>;