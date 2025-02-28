import { z } from "zod";


const ModalidadSchema = z.object({
  modalidad_id: z.number().min(1, "El ID de la modalidad es requerido"),
  modalidad_nombre: z.string().min(1, "El nombre de la modalidad es requerido"),
});

export type Modalidad = z.infer<typeof ModalidadSchema>;