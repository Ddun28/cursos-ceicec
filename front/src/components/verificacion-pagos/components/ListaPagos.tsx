import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getCursoUsuarios, updateCursoUsuario } from "@/api/curso-usuario/curso-usuario.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ListaPagos() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPagoDialogOpen, setIsPagoDialogOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState<any>(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError("No estás autenticado. Por favor, inicia sesión.");
          return;
        }

        const data = await getCursoUsuarios();
        if (data) {
          setPagos(data);
        } else {
          setError("No se pudieron cargar los pagos.");
        }
      } catch (error) {
        console.error("Error al obtener los pagos:", error);
        setError("Error al cargar los pagos. Verifica tu conexión o intenta nuevamente.");
      }
    };

    fetchPagos();
  }, []);

  const handleVerificarPago = async (id: number, cedula: string, estado_pago: string) => {
    try {
      await updateCursoUsuario(id, cedula, estado_pago);

      // Actualizar solo el pago con el id específico
      setPagos((prevPagos) =>
        prevPagos.map((pago) =>
          pago.id === id ? { ...pago, estado_pago } : pago
        )
      );
      setIsPagoDialogOpen(false);
    } catch (error) {
      console.error("Error al verificar el pago:", error);
    }
  };

  const handleOpenPagoDialog = (pago: any) => {
    setSelectedPago(pago);
    setIsPagoDialogOpen(true);
  };

  const handleClosePagoDialog = () => {
    setIsPagoDialogOpen(false);
    setSelectedPago(null);
  };

  const getEstadoPagoTexto = (estado: string) => {
    switch (estado) {
      case "EN_ESPERA":
        return "Por confirmar";
      case "CANCELADO":
        return "Pago rechazado";
      case "CONFIRMADO":
        return "Pago confirmado";
      default:
        return estado;
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Pagos</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Cursos Inscritos</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado de Pago</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagos.map((pago) => (
            <TableRow key={pago.cedula}>
              <TableCell>{pago.usuario?.nombre || "N/A"}</TableCell>
              <TableCell>{pago.cedula}</TableCell>
              <TableCell>
                {pago.cursos.map((curso: any) => curso.nombre).join(", ")}
              </TableCell>
              <TableCell>{pago.monto} {pago.moneda}</TableCell>
              <TableCell>{getEstadoPagoTexto(pago.estado_pago)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleOpenPagoDialog(pago)}
                  disabled={pago.estado_pago !== "EN_ESPERA"}
                >
                  Verificar Pago
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal para verificar el pago */}
      <Dialog open={isPagoDialogOpen} onOpenChange={handleClosePagoDialog}>
        <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Verificar Pago
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
              Detalles del pago para{" "}
              <span className="font-semibold">
                {selectedPago?.usuario?.nombre} {selectedPago?.usuario?.apellido}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedPago && (
            <div className="space-y-4 mt-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="block text-gray-900 dark:text-white">Moneda:</strong>
                  <span className="text-gray-600 dark:text-gray-400">{selectedPago.moneda}</span>
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="block text-gray-900 dark:text-white">Monto:</strong>
                  <span className="text-gray-600 dark:text-gray-400">{selectedPago.monto}</span>
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="block text-gray-900 dark:text-white">Fecha del Pago:</strong>
                  <span className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedPago.fecha_inscripcion).toLocaleString()}
                  </span>
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="block text-gray-900 dark:text-white">Número de Referencia:</strong>
                  <span className="text-gray-600 dark:text-gray-400">
                    {selectedPago.numero_referencia}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="default"
              onClick={() => handleVerificarPago(selectedPago.id, selectedPago.cedula, "CANCELADO")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Rechazar Pago
            </Button>
            <Button
              variant="default"
              onClick={() => handleVerificarPago(selectedPago.id, selectedPago.cedula, "CONFIRMADO")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Confirmar Pago
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}