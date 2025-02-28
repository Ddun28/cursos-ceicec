import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [cedula, setCedula] = useState("");
  const [usuario_telegram, setUsuario_telegram] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol_id, setRol_id] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cedulaError, setCedulaError] = useState("");
  const [contrasenaError, setContrasenaError] = useState("");

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputCedula = e.target.value;
    setCedula(inputCedula);

    const isValidCedula = /^\d*$/.test(inputCedula);
    if (!isValidCedula && inputCedula !== "") {
      setCedulaError("Cédula debe contener solo números");
    } else {
      setCedulaError("");
    }
  };

  const handleContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputContrasena = e.target.value;
    setContrasena(inputContrasena);

    const cedulaValue = cedula; // Obtén el valor actual de la cédula

    const regex = new RegExp(`^${cedulaValue}\\*$`); // Cédula seguida de *
    const isValidContrasena = regex.test(inputContrasena);

    if (!isValidContrasena && inputContrasena !== "") {
      setContrasenaError(
        `Debe ser la cédula (${cedulaValue}) seguida de un asterisco (*)`
      );
    } else {
      setContrasenaError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");

    if (
      !cedula ||
      !contrasena ||
      !nombre ||
      !apellido ||
      !correo ||
      !rol_id ||
      !usuario_telegram
    ) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (cedulaError || contrasenaError) {
      setError(cedulaError || contrasenaError);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          correo,
          cedula,
          usuario_telegram,
          contrasena,
          rol_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          setError(data.error || "Error en los datos de registro");
        } else if (res.status === 401) {
          setError(data.error || "Credenciales inválidas");
        } else {
          setError(data.error || `HTTP error! status: ${res.status}`);
        }
        return;
      }

      console.log(data);
      setSuccessMessage("Registro exitoso!");
      // Puedes redirigir o actualizar la UI aquí si es necesario
    } catch (error: any) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="registro">
      <h3 className="tituloregistro">Registrarse en Cursos CECCEIC</h3>
      <form onSubmit={handleSubmit} method="post">
        <div>
          <ul>
            <input
              className="inputs_register"
              type="text"
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
              placeholder="Nombre"
            />
            <br></br>
            <input
              className="inputs_register"
              type="text"
              onChange={(e) => setApellido(e.target.value)}
              value={apellido}
              placeholder="Apellido"
            />
            <br />
            <input
              className="inputs_register"
              type="text"
              onChange={(e) => setCorreo(e.target.value)}
              value={correo}
              placeholder="Correo"
            />
            <br></br>
            <input
              className="inputs_register"
              type="text"
              onChange={handleCedulaChange}
              value={cedula}
              placeholder="Cédula"
            />
            {cedulaError && <p style={{ color: "red" }}>{cedulaError}</p>}{" "}
            <br />
            <input
              className="inputs_register"
              type="text"
              onChange={(e) => setUsuario_telegram(e.target.value)}
              value={usuario_telegram}
              placeholder="Usuario telegram"
            />
            <br></br>
            <input
              className="inputs_register"
              type="password"
              onChange={handleContrasenaChange}
              value={contrasena}
              placeholder="Contraseña"
            />
            <br />
            {contrasenaError && (
              <p style={{ color: "red" }}>{contrasenaError}</p>
            )}{" "}
            <select value={rol_id} onChange={(e) => setRol_id(e.target.value)}>
              <option value="">Selecciona un rol</option>
              <option value="1">Administrador</option>
              <option value="2">Instructor</option>
              <option value="3">Estudiante</option>
              <option value="4">S/R</option>
            </select>
            <br />
            <br />
            <Link className="button" to="/">
              Iniciar
            </Link>
            <button className="button1" type="submit">
              Registrarme
            </button>
          </ul>
        </div>
      </form>
      <div className="error">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default Register;
