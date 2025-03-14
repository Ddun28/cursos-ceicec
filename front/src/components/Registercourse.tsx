import React, { useState } from 'react';

function Registercourse() {
    const [cedula_instructor, setCedula_instructor] = useState('');
    const [costo, setCosto] = useState('');
    const [duracion, setDuracion] = useState('');
    const [estado, setEstado] = useState('');
    const [limite_estudiante, setLimite_estudiante] = useState('');
    const [modalidad_id, setModalidad_id] = useState('');
    const [nombre, setNombre] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage("");
        setError("");

        if (!cedula_instructor || !costo  || !duracion || !estado || !limite_estudiante || !modalidad_id || !nombre) {
            setError("Todos los campos son requeridos");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/curso", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cedula_instructor,
                    costo,
                    duracion,
                    estado,
                    limite_estudiante,
                    modalidad_id,
                    nombre,
                }),
            });

            if (!res.ok) {
                const data = await res.json(); 
                setError(data.error || `Error ${res.status} al registrar el curso`); 
                return;
            }

            setSuccessMessage("Curso registrado exitosamente!");
            setCedula_instructor("");
            setCosto("");
            setDuracion("");
            setEstado("");
            setLimite_estudiante("");
            setModalidad_id("");
            setNombre("");

        } catch (error) {
            setError("Error al registrar el curso: " + error); 
            console.error("Error en la solicitud:", error); 
        }
    };

    return (
        <div>
            <h3>Registrar Curso</h3>
            <form onSubmit={handleSubmit} method="post">
                <ul>
                    <label>Cedula Instructor:</label>
                    <input type="text" onChange={(e) => setCedula_instructor(e.target.value)} value={cedula_instructor} placeholder='Cedula Instructor' /><br /><br />
                    <label>Costo:</label>
                    <input type="text" onChange={(e) => setCosto(e.target.value)} value={costo} placeholder='Costo' /><br /><br />
                    <label>Duración:</label>
                    <input type="text" onChange={(e) => setDuracion(e.target.value)} value={duracion} placeholder='Duracion' /><br /><br />
                    <label>Estado:</label>
                    <input type="text" onChange={(e) => setEstado(e.target.value)} value={estado} placeholder='Estado' /><br /><br />
                    <label>Límite Estudiantes:</label> 
                    <input type="text" onChange={(e) => setLimite_estudiante(e.target.value)} value={limite_estudiante} placeholder='Limite estudiantes' /><br /><br />
                    <label>Modalidad:</label>
                    <input type="text" onChange={(e) => setModalidad_id(e.target.value)} value={modalidad_id} placeholder='Modalidad' /><br /><br />
                    <label>Nombre Curso:</label>
                    <input type="text" onChange={(e) => setNombre(e.target.value)} value={nombre} placeholder='Nombre Curso' /><br /><br /> {/* Corregido placeholder */}
                    <button type="submit">Registrar Curso</button>
                </ul>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}

export default Registercourse;