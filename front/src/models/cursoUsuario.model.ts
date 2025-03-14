import { z } from "zod";

// Esquema para CursoUsuario
export const CursoUsuarioSchemaPost = z.object({
  cedula: z.number().int().positive(), 
  cursos_inscritos: z.array(z.number().int().positive()), 
  monto: z.number().positive(), 
  moneda: z.string().min(1, "La moneda es requerida"), 
  estado_pago: z.enum(["confirmado", "EN_ESPERA", "cancelado"]).default("EN_ESPERA"), 
  numero_referencia: z.number().int().positive().optional(), 
});

// Tipo para CursoUsuario
export type CursoUsuarioPost = z.infer<typeof CursoUsuarioSchemaPost>;