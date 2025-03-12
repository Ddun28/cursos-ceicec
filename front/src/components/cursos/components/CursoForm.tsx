import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CursoSchemaPost, CursoPost } from "@/models/curso.model";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Modalidad } from "@/models/modalidad.model";
import { Usuario } from "@/models/usuario.model";

interface CursoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (curso: Omit<CursoPost, "curso_id">) => void;
  initialData?: CursoPost;
  instructors: Usuario[];
  modalities: Modalidad[];
}

export const CursoForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  instructors,
  modalities,
}: CursoFormProps) => {
  const defaultEmptyValues = {
    nombre: "",
    cedula_instructor: 0,
    costo: 0,
    duracion: "",
    estado: true,
    limite_estudiante: 0,
    modalidad_id: 1,
    descripcion: "", // Nuevo campo
  };

  const form = useForm<z.infer<typeof CursoSchemaPost>>({
    resolver: zodResolver(CursoSchemaPost),
    defaultValues: initialData || defaultEmptyValues,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset(defaultEmptyValues);
    }
  }, [initialData, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = (data: z.infer<typeof CursoSchemaPost>) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-black dark:text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Curso" : "Crear Curso"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del curso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cedula_instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <select
                      className="dark:bg-black bg-white w-full border p-2 dark:border-white border-black rounded"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <option value="">Selecciona un instructor</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.cedula} value={instructor.cedula}>
                          {instructor.nombre} {instructor.apellido}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="costo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Costo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Costo del curso"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duracion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración</FormLabel>
                  <FormControl>
                    <Input placeholder="Duración del curso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormLabel className="mb-0">Estado</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 ml-6 rounded focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limite_estudiante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Límite de Estudiantes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Límite de estudiantes"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modalidad_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidad</FormLabel>
                  <FormControl>
                    <select
                      className="dark:bg-black p-2 bg-white border w-full border-black dark:border-white rounded"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <option value="">Selecciona una modalidad</option>
                      {modalities.map((modalidad) => (
                        <option key={modalidad.modalidad_id} value={modalidad.modalidad_id}>
                          {modalidad.modalidad_nombre}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nuevo campo: Descripción */}
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción del curso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="dark:bg-blue-800 w-[50%] bg-blue-400 hover:bg-blue-950 rounded">
                {initialData ? "Guardar Cambios" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};