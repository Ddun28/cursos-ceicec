import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Usuario {
  cedula: number;
  usuario_telegram: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol_id: number;
  rol_nombre: string;
  contrasena?: string;
  created_at?: string;
}

interface Rol {
  rol_id: number;
  rol_nombre: string;
}

const UpdateUsuario: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Rol[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Usuario>();

  const usuarioLocalStorage = JSON.parse(localStorage.getItem('usuario') || '{}');

  const isSuperusuario = usuarioLocalStorage.rol_nombre === 'superusuario';

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      try {
        if (cedula) {
          const response = await axios.get(`http://localhost:5000/usuarios/${cedula}`);
          const usuarioData = response.data;

          setValue('cedula', usuarioData.cedula);
          setValue('usuario_telegram', usuarioData.usuario_telegram);
          setValue('nombre', usuarioData.nombre);
          setValue('apellido', usuarioData.apellido);
          setValue('correo', usuarioData.correo);
          setValue('rol_id', usuarioData.rol_id);
          setValue('rol_nombre', usuarioData.rol_nombre);
        } else if (usuarioLocalStorage && usuarioLocalStorage.cedula) {

          setValue('cedula', usuarioLocalStorage.cedula);
          setValue('usuario_telegram', usuarioLocalStorage.usuario_telegram);
          setValue('nombre', usuarioLocalStorage.nombre);
          setValue('apellido', usuarioLocalStorage.apellido);
          setValue('correo', usuarioLocalStorage.correo);
          setValue('rol_id', usuarioLocalStorage.rol_id);
          setValue('rol_nombre', usuarioLocalStorage.rol_nombre); 
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error al cargar los datos del usuario', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/listado_roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Error al cargar los roles', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    };

    fetchUsuario();
    fetchRoles();
  }, [cedula, setValue]);

  const onSubmit: SubmitHandler<Usuario> = async (data) => {
    setLoading(true);
    try {
      const { cedula, created_at, rol_nombre, contrasena, ...formValuesWithoutCreatedAt } = data;
  
      const cedulaActual = cedula || usuarioLocalStorage.cedula;
  
      const datosActualizados = { ...formValuesWithoutCreatedAt };
  
      if (contrasena) {
        datosActualizados.contrasena = contrasena;
      }
  
      const response = await axios.put(
        `http://localhost:5000/actualizar/${cedulaActual}`,
        datosActualizados
      );
  
      if (response.status === 200) {
        toast.success('Usuario actualizado correctamente', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        });
  
        // Actualizar el localStorage con los nuevos datos del usuario
        const usuarioActualizado = {
          ...usuarioLocalStorage,
          ...datosActualizados,
          contrasena: undefined, // Excluir la contraseña
        };
  
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
  
        // Redirigir según el rol
        if (usuarioLocalStorage.rol_nombre === 'superusuario') {
          navigate('/dashboard/usuarios');
        } else if (usuarioLocalStorage.rol_nombre === 'administrador') {
          navigate('/dashboard/docente');
        } else if (usuarioLocalStorage.rol_nombre === 'estudiante') {
          navigate('/dashboard/estudiante');
        } else {
          navigate('/login');
        }
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message || 'Error al actualizar usuario', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Editar Usuario</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="cedula">Cédula:</Label>
            <Input
              id="cedula"
              type="number"
              {...register('cedula', { required: 'La cédula es requerida' })}
              disabled
              className="bg-gray-100 dark:bg-gray-700"
            />
            {errors.cedula && <p className="text-red-500 text-sm">{errors.cedula.message}</p>}
          </div>

          <div>
            <Label htmlFor="usuario_telegram">Usuario Telegram:</Label>
            <Input
              id="usuario_telegram"
              type="text"
              {...register('usuario_telegram')}
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <div>
            <Label htmlFor="nombre">Nombre:</Label>
            <Input
              id="nombre"
              type="text"
              {...register('nombre', { required: 'El nombre es requerido' })}
              className="bg-gray-100 dark:bg-gray-700"
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
          </div>

          <div>
            <Label htmlFor="apellido">Apellido:</Label>
            <Input
              id="apellido"
              type="text"
              {...register('apellido', { required: 'El apellido es requerido' })}
              className="bg-gray-100 dark:bg-gray-700"
            />
            {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido.message}</p>}
          </div>

          <div>
            <Label htmlFor="correo">Correo:</Label>
            <Input
              id="correo"
              type="email"
              {...register('correo', { required: 'El correo es requerido' })}
              className="bg-gray-100 dark:bg-gray-700"
            />
            {errors.correo && <p className="text-red-500 text-sm">{errors.correo.message}</p>}
          </div>

          <div>
            <Label htmlFor="rol_id">Rol:</Label>
            {isSuperusuario ? (
              <Select
                onValueChange={(value) => setValue('rol_id', Number(value))}
                defaultValue={watch('rol_id')?.toString()}
              >
                <SelectTrigger className="bg-white dark:bg-slate-900">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  {roles.map((rol) => (
                    <SelectItem key={rol.rol_id} value={rol.rol_id.toString()}>
                      {rol.rol_nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="rol_nombre"
                type="text"
                {...register('rol_nombre')}
                disabled
                className="bg-gray-100 dark:bg-gray-700"
              />
            )}
          </div>

          <div>
            <Label htmlFor="contrasena">Contraseña:</Label>
            <Input
              id="contrasena"
              type="password"
              {...register('contrasena')}
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUsuario;