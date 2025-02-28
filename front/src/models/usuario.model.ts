import { z } from "zod";


const UsuarioSchema = z.object({
  apellido: z.string().min(1, "El apellido es requerido"),
  cedula: z.number().min(1, "La cédula es requerida"),
  correo: z.string().email("El correo debe ser válido"),
  created_at: z.string().nullable(), 
  nombre: z.string().min(1, "El nombre es requerido"),
  rol_id: z.number().nullable(), 
  usuario_telegram: z.string().optional(),
});

export type Usuario = z.infer<typeof UsuarioSchema>;
