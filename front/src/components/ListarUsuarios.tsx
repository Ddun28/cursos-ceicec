import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Usuario {
  cedula: number;
  usuario_telegram: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol_id: number;
}

const ListaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/usuarios'); // No token needed
        setUsuarios(response.data);
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al obtener usuarios');
      }
    };

    fetchUsuarios();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center">{error}</p>}
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
    </div>
  );
};

export default ListaUsuarios;