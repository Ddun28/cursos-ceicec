import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Usuario {
  cedula: number;
  usuario_telegram: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol_id: number;
}

interface Rol {
  rol_id: number;
  rol_nombre: string;
}

const ListaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);

  // Estados para el formulario de creación de usuario
  const [cedula, setCedula] = useState('');
  const [usuario_telegram, setUsuarioTelegram] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol_id, setRolId] = useState<number | ''>('');
  const [cedulaError, setCedulaError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usuariosRes, rolesRes] = await Promise.all([
          axios.get('http://localhost:5000/usuarios'),
          axios.get('http://localhost:5000/listado_roles')
        ]);
        setUsuarios(usuariosRes.data);
        setRoles(rolesRes.data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al cargar datos');
        toast.error(error.response?.data?.error || 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputCedula = e.target.value;
    setCedula(inputCedula);

    const isValidCedula = /^\d*$/.test(inputCedula);
    if (!isValidCedula && inputCedula !== '') {
      setCedulaError('Cédula debe contener solo números');
    } else {
      setCedulaError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cedula || !nombre || !apellido || !correo || !usuario_telegram || !contrasena || !rol_id) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    if (cedulaError) {
      toast.error(cedulaError);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/usuario', {
        cedula: parseInt(cedula),
        usuario_telegram,
        nombre,
        apellido,
        correo,
        contrasena,
        rol_id,
      });

      if (res.status === 201) {
        toast.success('Usuario creado correctamente');
        setIsModalOpen(false);
        const response = await axios.get('http://localhost:5000/usuarios');
        setUsuarios(response.data);
        resetForm();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear el usuario');
    }
  };

  const resetForm = () => {
    setCedula('');
    setUsuarioTelegram('');
    setNombre('');
    setApellido('');
    setCorreo('');
    setContrasena('');
    setRolId('');
  };

  const openDeleteDialog = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setIsDeleteDialogOpen(true);
  };

  const handleEliminarUsuario = async () => {
    if (!usuarioToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/eliminar/${usuarioToDelete.cedula}`);
      toast.success('Usuario eliminado correctamente');
      setUsuarios(usuarios.filter(u => u.cedula !== usuarioToDelete.cedula));
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al eliminar el usuario');
    } finally {
      setIsDeleteDialogOpen(false);
      setUsuarioToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Lista de Usuarios</CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <span className="hidden md:inline">Crear Nuevo Usuario</span>
                <span className="md:hidden">+</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-900 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Complete todos los campos para registrar un nuevo usuario.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre*</Label>
                    <Input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido*</Label>
                    <Input
                      id="apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Apellido"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico*</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cedula">Cédula*</Label>
                  <Input
                    id="cedula"
                    value={cedula}
                    onChange={handleCedulaChange}
                    placeholder="12345678"
                    required
                  />
                  {cedulaError && <p className="text-red-500 text-sm">{cedulaError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuario_telegram">Usuario de Telegram*</Label>
                  <Input
                    id="usuario_telegram"
                    value={usuario_telegram}
                    onChange={(e) => setUsuarioTelegram(e.target.value)}
                    placeholder="@usuario"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contrasena">Contraseña*</Label>
                  <Input
                    id="contrasena"
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rol_id">Rol*</Label>
                  <select
                    id="rol_id"
                    value={rol_id}
                    onChange={(e) => setRolId(Number(e.target.value))}
                    className="w-full p-2 border rounded dark:bg-slate-900"
                    required
                  >
                    <option value="">Seleccione un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.rol_id} value={rol.rol_id}>
                        {rol.rol_nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Crear Usuario
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellido</TableHead>
                    <TableHead>Usuario Telegram</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.length > 0 ? (
                    usuarios.map((usuario) => (
                      <TableRow key={usuario.cedula}>
                        <TableCell>{usuario.nombre}</TableCell>
                        <TableCell>{usuario.apellido}</TableCell>
                        <TableCell>{usuario.usuario_telegram}</TableCell>
                        <TableCell>{usuario.correo}</TableCell>
                        <TableCell>{usuario.cedula}</TableCell>
                        <TableCell className="flex justify-end space-x-2">
                          <Link to={`/dashboard/actualizar/${usuario.cedula}`}>
                            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => openDeleteDialog(usuario)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación para eliminar usuario */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className='bg-white dark:bg-gray-900 max-w-md w-full'>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
              <span className="font-semibold">{usuarioToDelete?.nombre} {usuarioToDelete?.apellido}</span>{' '}
              con cédula <span className="font-semibold">{usuarioToDelete?.cedula}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleEliminarUsuario}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ListaUsuarios;