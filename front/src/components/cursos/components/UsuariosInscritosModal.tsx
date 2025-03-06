import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import api from "@/api/api";

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

  // Obtener los usuarios inscritos
  useEffect(() => {
    if (isOpen) {
      fetchUsuariosInscritos();
    }
  }, [isOpen]);

  const fetchUsuariosInscritos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/curso/${cursoId}/usuarios`);
      
      // Si la respuesta no tiene usuarios, mostrar el mensaje de error
      if (response.data.length === 0) {
        toast.error("No hay usuarios inscritos en este curso");
      } else {
        setUsuarios(response.data);
      }
    } catch (error) {
      // Si hay un error en la solicitud, mostrar el mensaje de error del servidor
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        // Mensaje genérico si no hay un mensaje específico
        toast.error("Error al obtener los usuarios inscritos");
      }
    } finally {
      setLoading(false);
    }
  };

  // Abrir diálogo de verificación de pago
  const handleOpenPagoDialog = (usuario: UsuarioInscrito) => {
    setSelectedUsuario(usuario);
    setIsPagoDialogOpen(true);
  };

  // Cerrar diálogo de verificación de pago
  const handleClosePagoDialog = () => {
    setIsPagoDialogOpen(false);
    setSelectedUsuario(null);
  };

  // Verificar pago (confirmar o rechazar)
  const handleVerificarPago = async (estado: "CONFIRMADO" | "CANCELADO") => {
    if (selectedUsuario) {
      try {
        // Enviar la solicitud PUT al backend para actualizar el estado del pago
        await api.put(`/actualizar_estado_pago/${selectedUsuario.cedula}`, {
          estado_pago: estado,
        });

        // Actualizar el estado en el frontend
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.cedula === selectedUsuario.cedula
              ? { ...usuario, estado_pago: estado }
              : usuario
          )
        );

        // Mostrar mensaje de éxito
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
                  <TableHead>Estado de Pago</TableHead>
                  <TableHead>Acciones</TableHead>
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
                    <TableCell>
                    {usuario.estado_pago === "EN_ESPERA"
                         ? "En espera"
                         : usuario.estado_pago === "CONFIRMADO"
                        ? "Confirmado"
                        : "Cancelado"}
                    </TableCell>
                    <TableCell>
                      {usuario.estado_pago === "EN_ESPERA" && (
                        <Button
                          variant="default"
                          onClick={() => handleOpenPagoDialog(usuario)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Verificar Pago
                        </Button>
                      )}
                      {usuario.estado_pago === "CONFIRMADO" && (
                        <Button variant="default" disabled className="bg-gray-400 text-white">
                          Confirmado
                        </Button>
                      )}
                      {usuario.estado_pago === "CANCELADO" && (
                        <Button variant="default" disabled className="bg-red-400 text-white">
                          Cancelado
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de verificación de pago */}
      <Dialog open={isPagoDialogOpen} onOpenChange={handleClosePagoDialog}>
        <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Verificar Pago
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
              Detalles del pago para{" "}
              <span className="font-semibold">
                {selectedUsuario?.usuario.nombre} {selectedUsuario?.usuario.apellido}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedUsuario && (
            <div className="space-y-4 mt-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="block text-gray-900 dark:text-white">Moneda:</strong>
                  <span className="text-gray-600 dark:text-gray-400">{selectedUsuario.moneda}</span>
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="block text-gray-900 dark:text-white">Monto:</strong>
                  <span className="text-gray-600 dark:text-gray-400">{selectedUsuario.monto}</span>
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="block text-gray-900 dark:text-white">Número de Referencia:</strong>
                  <span className="text-gray-600 dark:text-gray-400">
                    {selectedUsuario.numero_referencia}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="default"
              onClick={() => handleVerificarPago("CANCELADO")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Rechazar Pago
            </Button>
            <Button
              variant="default"
              onClick={() => handleVerificarPago("CONFIRMADO")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Confirmar Pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};