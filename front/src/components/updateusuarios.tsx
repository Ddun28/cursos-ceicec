import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const UpdateUsuario: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Usuario>();

  // Obtener los datos del usuario desde el localStorage
  const usuarioLocalStorage = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      try {
        if (cedula) {
          // Si hay cédula en la URL, obtener los datos del backend
          const response = await axios.get(`http://localhost:5000/usuarios/${cedula}`);
          const usuarioData = response.data;

          // Rellenar el formulario con los datos del usuario
          setValue('cedula', usuarioData.cedula);
          setValue('usuario_telegram', usuarioData.usuario_telegram);
          setValue('nombre', usuarioData.nombre);
          setValue('apellido', usuarioData.apellido);
          setValue('correo', usuarioData.correo);
          setValue('rol_id', usuarioData.rol_id);
          setValue('rol_nombre', usuarioData.rol_nombre); // Nombre del rol
          setValue('contrasena', ''); // Dejar la contraseña vacía por defecto
        } else if (usuarioLocalStorage && usuarioLocalStorage.cedula) {
          // Si no hay cédula en la URL, usar los datos del localStorage
          setValue('cedula', usuarioLocalStorage.cedula);
          setValue('usuario_telegram', usuarioLocalStorage.usuario_telegram);
          setValue('nombre', usuarioLocalStorage.nombre);
          setValue('apellido', usuarioLocalStorage.apellido);
          setValue('correo', usuarioLocalStorage.correo);
          setValue('rol_id', usuarioLocalStorage.rol_id);
          setValue('rol_nombre', usuarioLocalStorage.rol_nombre); // Nombre del rol
          setValue('contrasena', ''); // Dejar la contraseña vacía por defecto
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

    fetchUsuario();
  }, [cedula, setValue, usuarioLocalStorage]);

  const onSubmit: SubmitHandler<Usuario> = async (data) => {
    setLoading(true);
    try {
      const { cedula, created_at, rol_nombre, ...formValuesWithoutCreatedAt } = data;

      // Determinar la cédula a usar (de la URL o del localStorage)
      const cedulaActual = cedula || usuarioLocalStorage.cedula;

      const response = await axios.put(
        `http://localhost:5000/actualizar/${cedulaActual}`,
        formValuesWithoutCreatedAt
      );

      if (response.status === 200) {
        toast.success('Usuario actualizado correctamente', {
          position: 'top-center',
          autoClose: 3000,
          theme: 'colored',
        });
        navigate('/usuarios');
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
            <Label htmlFor="rol_nombre">Rol:</Label>
            <Input
              id="rol_nombre"
              type="text"
              {...register('rol_nombre')}
              disabled
              className="bg-gray-100 dark:bg-gray-700"
            />
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