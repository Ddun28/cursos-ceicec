import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UsuariosInscritosModal } from "./UsuariosInscritosModal";
import { SquarePen, Trash2, Eye } from "lucide-react"; 

interface CursoActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  cursoId: number;
}

export const CursoActions = ({ onEdit, onDelete, cursoId }: CursoActionsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUsuariosModalOpen, setIsUsuariosModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="dark:bg-green-900 bg-green-600 text-white hover:bg-green-900/90 rounded"
          size="icon"
          onClick={onEdit}
        >
          <SquarePen className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          className="bg-red-600 text-white hover:bg-red-800 rounded"
          size="icon"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          className="dark:bg-blue-900 bg-blue-600 text-white hover:bg-blue-900/90 rounded flex items-center gap-2" // Añadir flex y gap
          onClick={() => setIsUsuariosModalOpen(true)}
        >
          <Eye className="h-4 w-4" /> 
          <span>Ver Inscritos</span> 
        </Button>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="dark:bg-gray-900 bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              ¿Eliminar curso?
            </h3>
            <p className="dark:text-gray-300 mb-6 text-black">
              Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este curso?
            </p>
            
            <div className="flex flex-col space-y-2">
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white hover:bg-red-800"
              >
                Confirmar
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-300 bg-gray-800 border-gray-600 hover:bg-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <UsuariosInscritosModal
        cursoId={cursoId}
        isOpen={isUsuariosModalOpen}
        onClose={() => setIsUsuariosModalOpen(false)}
      />
    </>
  );
};