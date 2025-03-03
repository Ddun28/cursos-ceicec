import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, SquarePen } from "lucide-react";
import { toast } from "react-toastify";
import { CursoPost } from "@/models/curso.model";

interface CursoActionsProps {
  curso: CursoPost;
  onEdit: () => void;
  onDelete: () => void;
}

export const CursoActions = ({ onEdit, onDelete }: CursoActionsProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
    toast.success("Curso eliminado correctamente", {
      style: {
        backgroundColor: 'black',
        color: 'white',
      },
    });
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
      </div>

      {/* Modal de confirmación */}
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
    </>
  );
};