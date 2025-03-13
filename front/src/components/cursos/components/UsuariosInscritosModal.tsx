import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import api from "@/api/api";
import { format } from 'date-fns';

interface UsuarioInscrito {
  cedula: number;
  cursos_inscritos: number[];
  estado_pago: string;
  fecha_inscripcion: string;
  id: number;
  moneda: string;
  monto: number;
  numero_referencia: number;
  usuario: {
    apellido: string;
    cedula: number;
    correo: string;
    created_at: string;
    nombre: string;
    rol_id: number;
    usuario_telegram: string;
    updated_at: string;
  };
}

interface UsuariosInscritosModalProps {
  cursoId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const UsuariosInscritosModal = ({ cursoId, isOpen, onClose }: UsuariosInscritosModalProps) => {
  const [usuarios, setUsuarios] = useState<UsuarioInscrito[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioInscrito | null>(null);
  const [isPagoDialogOpen, setIsPagoDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsuariosInscritos();
    }
  }, [isOpen]);

  const fetchUsuariosInscritos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/curso/${cursoId}/usuarios`);
      if (response.data.length === 0) {
        toast.error("No hay usuarios inscritos en este curso");
      } else {
        setUsuarios(response.data);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error al obtener los usuarios inscritos");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPagoDialog = (usuario: UsuarioInscrito) => {
    setSelectedUsuario(usuario);
    setIsPagoDialogOpen(true);
  };

  const handleClosePagoDialog = () => {
    setIsPagoDialogOpen(false);
    setSelectedUsuario(null);
  };

  const handleVerificarPago = async (estado: "CONFIRMADO" | "CANCELADO") => {
    if (selectedUsuario) {
      try {
        await api.put(`/actualizar_estado_pago/${selectedUsuario.id}/${selectedUsuario.cedula}`, {
          estado_pago: estado,
        });

        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.cedula === selectedUsuario.cedula
              ? {
                  ...usuario,
                  estado_pago: estado,
                  usuario: {
                    ...usuario.usuario,
                    updated_at: new Date().toISOString(), 
                  },
                }
              : usuario
          )
        );

        toast.success(`Pago ${estado === "CONFIRMADO" ? "confirmado" : "rechazado"} correctamente`);
        handleClosePagoDialog();
      } catch (error) {
        console.error("Error al actualizar el estado del pago:", error);
        toast.error("Error al actualizar el estado del pago");
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl bg-white dark:bg-black">
          <DialogHeader>
            <DialogTitle>Usuarios Inscritos</DialogTitle>
          </DialogHeader>

          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : usuarios.length === 0 ? (
            <p className="text-center">No hay usuarios inscritos en este curso.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Usuario de Telegram</TableHead>
                  <TableHead>Fecha de Inscripción</TableHead>
                  <TableHead>Estado de Pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.cedula}>
                    <TableCell>{usuario.usuario.nombre}</TableCell>
                    <TableCell>{usuario.usuario.apellido}</TableCell>
                    <TableCell>{usuario.cedula}</TableCell>
                    <TableCell>{usuario.usuario.correo}</TableCell>
                    <TableCell>{usuario.usuario.usuario_telegram}</TableCell>
                    <TableCell>{format(new Date(usuario.fecha_inscripcion), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                    <TableCell>
                      {usuario.estado_pago === "EN_ESPERA"
                        ? "En espera"
                        : usuario.estado_pago === "CONFIRMADO"
                        ? "Confirmado"
                        : "Cancelado"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};