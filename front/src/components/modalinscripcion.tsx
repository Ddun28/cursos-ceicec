import React, { useState, useEffect } from 'react';
import { CursoUsuarioPost } from '@/models/cursoUsuario.model';
import { toast } from "react-toastify";

interface Courses {
  curso_id: number;
  nombre: string;
  costo: number;
}

interface ModalProps {
  carrito: Courses[];
  onCerrar: () => void;
  error: string;
  createCursoUsuario: (data: CursoUsuarioPost) => Promise<void>;
  onPagoExitoso: () => void;
}

const ModalInscripcion: React.FC<ModalProps> = ({ 
  carrito, 
  onCerrar, 
  error,
  createCursoUsuario,
  onPagoExitoso, 
}) => {
  const [metodoPago, setMetodoPago] = useState('');
  const [tipoMoneda, setTipoMoneda] = useState('Bs');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    vencimiento: '',
    cvv: ''
  });
  const [cedula, setCedula] = useState<number | null>(null); 

  const total = carrito.reduce((sum, curso) => sum + curso.costo, 0);


  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario'); 
    if (usuarioStorage) {
      const usuario = JSON.parse(usuarioStorage); 
      setCedula(usuario.cedula); 
    } else {
      toast.error('Por favor, inicie sesión nuevamente.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!cedula) {
      toast.error('No se pudo obtener la cédula. Por favor, inicie sesión nuevamente.');
      return;
    }
  
    if (!metodoPago) {
      toast.error('Seleccione un método de pago');
      return;
    }
  
    const cursosInscritosIds = carrito.map(curso => curso.curso_id);
  
    const cursoUsuarioData: CursoUsuarioPost = {
      cedula: cedula,
      cursos_inscritos: cursosInscritosIds, 
      monto: total,
      moneda: tipoMoneda,
      estado_pago: 'EN_ESPERA',
      numero_referencia: metodoPago === 'movil' ? parseInt(datosTarjeta.numero) : undefined,
    };
  
    try {

      await createCursoUsuario(cursoUsuarioData);
  
      localStorage.removeItem('carrito');
  
      toast.success("Se registró el pago correctamente");
  
      onPagoExitoso();
  
      onCerrar();
    } catch (error) {
      console.error("Error al crear el registro:", error);
      toast.error("Hubo un error al procesar el pago. Inténtelo de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 dark:bg-black bg-white text-black border border-black dark:text-white bg-opacity-50 flex items-center justify-center">
      <div className="dark:bg-black bg-white border border-gray-300 p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Proceso de Pago</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Resumen de Compra</h3>
          <div className="space-y-2 mb-3">
            {carrito.map((curso) => (
              <div key={curso.curso_id} className="flex justify-between">
                <span>{curso.nombre}</span>
                <span>{curso.costo.toLocaleString()} Bs</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 font-bold">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>
                {tipoMoneda === 'Bs'
                  ? total.toLocaleString() + ' Bs'
                  : `$${total.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Método de Pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="w-full p-2 border dark:bg-black rounded-md"
              required
            >
              <option value="">Seleccionar...</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="movil">Pago Móvil</option>
              <option value="efectivo">Pago en Efectivo</option>
            </select>
          </div>

          {metodoPago === 'movil' && (
            <div className="mb-4">
              <p className="text-sm dark:bg-black bg-gray-100 p-3 rounded-md">
                Realice el pago móvil al siguiente número:
                <br />
                <strong>Banco de Venezuela (0102)</strong>
                <br />
                <strong>Número de teléfono: 0424-7382322</strong>
                <br />
                <strong>Cédula: 1277301</strong>
              </p>
              <label className="block mb-2 font-medium">Número de Referencia</label>
              <input
                type="text"
                placeholder="Ingrese el número de referencia"
                className="w-full p-2 border dark:bg-black rounded-md"
                required
                value={datosTarjeta.numero}
                onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })}
              />
            </div>
          )}

          {metodoPago === 'efectivo' && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">Tipo de Moneda</label>
              <select
                value={tipoMoneda}
                onChange={(e) => setTipoMoneda(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Bs">Bolívares (Bs)</option>
                <option value="$">Dólares ($)</option>
              </select>
            </div>
          )}

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Confirmar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalInscripcion;