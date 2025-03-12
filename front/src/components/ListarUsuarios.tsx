import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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

  // Estados para el formulario de creación de usuario
  const [cedula, setCedula] = useState('');
  const [usuario_telegram, setUsuarioTelegram] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol_id, setRolId] = useState<number | ''>('');
  const [cedulaError, setCedulaError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios');
        setUsuarios(response.data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al obtener usuarios');
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/listado_roles');
        setRoles(response.data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al obtener roles');
      }
    };

    fetchUsuarios();
    fetchRoles();
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
  const navigate = useNavigate();
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
        cedula,
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
        navigate('/dashboard/usuarios');
        const response = await axios.get('http://localhost:5000/usuarios');
        setUsuarios(response.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear el usuario');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Botón para abrir el modal de creación de usuario */}
          <div className="mb-4">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className='bg-white dark:bg-slate-900 max-w-md w-full max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>Crear Usuario</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para crear un nuevo usuario.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Nombre"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Apellido"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo</Label>
                    <Input
                      id="correo"
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="Correo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input
                      id="cedula"
                      type="text"
                      value={cedula}
                      onChange={handleCedulaChange}
                      placeholder="Cédula"
                      required
                    />
                    {cedulaError && (
                      <p className="text-red-500 text-sm">{cedulaError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usuario_telegram">Usuario de Telegram</Label>
                    <Input
                      id="usuario_telegram"
                      type="text"
                      value={usuario_telegram}
                      onChange={(e) => setUsuarioTelegram(e.target.value)}
                      placeholder="Usuario de Telegram"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contrasena">Contraseña</Label>
                    <Input
                      id="contrasena"
                      type="password"
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      placeholder="Contraseña"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rol_id">Rol</Label>
                    <select
                      id="rol_id"
                      value={rol_id}
                      onChange={(e) => setRolId(Number(e.target.value))}
                      className="w-full dark:bg-slate-900 p-2 border rounded"
                      required
                    >
                      <option value="">Selecciona un rol</option>
                      {roles.map((rol) => (
                        <option key={rol.rol_id} value={rol.rol_id}>
                          {rol.rol_nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                      Crear Usuario
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Usuario Telegram</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.cedula}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.apellido}</TableCell>
                  <TableCell>{usuario.usuario_telegram}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell>{usuario.cedula}</TableCell>
                  <TableCell>
                    <Link to={`/dashboard/actualizar/${usuario.cedula}`}>
                      <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-500">
                        Editar
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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