import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Usuario {
    cedula: number;
    usuario_telegram: string;
    nombre: string;
    apellido: string;
    correo: string;
    rol_id: number;
    contrasena?: string;
    created_at?: string;
}

const UpdateUsuario: React.FC = () => {
    const { cedula } = useParams<{ cedula: string }>();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [formValues, setFormValues] = useState<Usuario>({
        cedula: 0,
        usuario_telegram: '',
        nombre: '',
        apellido: '',
        correo: '',
        rol_id: 0,
        contrasena: '',
    });
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUsuario = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/usuarios/${cedula}`);
                const userData = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : response.data;
                const parsedUserData = {
                    ...userData,
                    cedula: parseInt(userData.cedula, 10),
                    rol_id: parseInt(userData.rol_id, 10),
                };
                setUsuario(parsedUserData);
                setFormValues(parsedUserData);
            } catch (error: any) {
                setError(error.response?.data?.error || 'Error al obtener usuario');
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        if (cedula) {
            fetchUsuario();
        }
    }, [cedula]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'cedula' || name === 'rol_id' ? parseInt(value, 10) : value;
        setFormValues({ ...formValues, [name]: newValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setLoading(true);

        try {
            if (!usuario) {
                throw new Error("No user data to update.");
            }

            const { cedula, created_at, ...formValuesWithoutCreatedAt } = formValues;

            const response = await axios.put(
                `http://localhost:5000/actualizar/${cedula}`,
                formValuesWithoutCreatedAt
            );

            if (response.status === 200) {
                setMensaje('Usuario actualizado correctamente');
                navigate('/usuarios');
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }

        } catch (error: any) {
            setError(error.response?.data?.error || error.message || 'Error al actualizar usuario');
            console.error("Error updating user:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!usuario) {
        return <div>No se encontró el usuario.</div>;
    }

    return (
        <div className='update'>
            <h2 className='tituloeditar'>Editar Usuario</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="cedula">Cédula:</label>
                <input
                className="inputcedula"
                    type="text"
                    id="cedula"
                    name="cedula"
                    value={formValues.cedula}
                    onChange={handleChange}
                    required
                /><br></br>
                <label htmlFor="usuario_telegram">Usuario Telegram:</label>
                <input
                    className="inputtelegram"
                    type="text"
                    id="usuario_telegram"
                    name="usuario_telegram"
                    value={formValues.usuario_telegram}
                    onChange={handleChange}
                /><br></br>
                <label htmlFor="nombre">Nombre:</label>
                <input
                className="inputnombre"
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formValues.nombre}
                    onChange={handleChange}
                    required
                /><br></br>
                <label htmlFor="apellido">Apellido:</label>
                <input
                className="inputnombre" 
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formValues.apellido}
                    onChange={handleChange}
                    required
                /><br></br>
                <label htmlFor="correo">Correo:</label>
                <input
                className="inputcedula"
                    type="email"
                    id="correo"
                    name="correo"
                    value={formValues.correo}
                    onChange={handleChange}
                    required
                /><br></br>
                <label htmlFor="rol_id">Rol:</label>
                <input
                className="inputrol"
                    type="text"
                    id="rol_id"
                    name="rol_id"
                    value={formValues.rol_id}
                    onChange={handleChange}
                    required
                /><br></br>
                <label htmlFor="contrasena">Contraseña:</label>
                <input
                    className="inputupdate"
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    value={formValues.contrasena}
                    onChange={handleChange}
                />
                <br></br>
                <button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
            </form>
        </div>
    );
};

export default UpdateUsuario;