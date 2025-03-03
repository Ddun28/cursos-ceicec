import React, { useState } from 'react';

interface ModalInscripcionProps {
  nombreCurso: string;
  cedulaUsuario: number;
  onPago: (pago: string) => void;
  onCerrar: () => void;
  error?: string;
}

const ModalInscripcion: React.FC<ModalInscripcionProps> = ({
  nombreCurso,
  cedulaUsuario,
  onPago,
  onCerrar,
  error,
}) => {
  const [pago, setPago] = useState('');

  const handlePagoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPago(event.target.value);
  };

  const handleRealizarPago = () => {
    onPago(pago);
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-5 rounded-lg w-11/12 max-w-2xl">
    <h2 className="text-xl font-semibold">Confirmar Inscripción</h2>
    <p>Curso: {nombreCurso}</p>
    <p>Cédula: {cedulaUsuario}</p>
    <label className="block mt-4">
      Tipo de Pago:
      <select 
        value={pago} 
        onChange={handlePagoChange} 
        className="mt-1 block w-full bg-gray-200 border border-gray-300 rounded-md p-2"
      >
        <option value="">Selecciona...</option>
        <option value="Transferencia bancaria">Transferencia bancaria</option>
        <option value="Pago Movil">Pago Movil</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Divisa">Divisa</option>
      </select>
    </label>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    <div className="mt-4 flex justify-between">
      <button 
        onClick={handleRealizarPago} 
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition"
      >
        Pagar
      </button>
      <button 
        onClick={onCerrar} 
        className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition"
      >
        Cancelar
      </button>
    </div>
  </div>
</div>
  );
};

export default ModalInscripcion;