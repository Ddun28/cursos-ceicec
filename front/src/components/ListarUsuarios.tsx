import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        <div className='listausuarios'>
            <h2>Lista de Usuarios</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
  <thead>
    <tr>
      <th>Nombre:</th>
      <th>Apellido:</th>
      <th>Usuario telegram:</th>
      <th>Correo:</th>
      <th>Cedula:</th>
      <th></th> {/* Columna para el botón Editar */}
    </tr>
  </thead>
  <tbody>
    {usuarios.map((usuario) => (
      <tr key={usuario.cedula}>
        <td>{usuario.nombre}</td>
        <td>{usuario.apellido}</td>
        <td>{usuario.usuario_telegram}</td>
        <td>{usuario.correo}</td>
        <td className='cedula'>{usuario.cedula}</td>
        <div className='button2'>
        <td ><Link to={`/actualizar/${usuario.cedula}` }>Editar</Link></td>
        </div>
      </tr>
    ))}
  </tbody>
</table>
        </div>
    );
};

export default ListaUsuarios;