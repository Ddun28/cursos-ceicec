import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function Login() {
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cedulaError, setCedulaError] = useState(""); // State for cedula error
  const navigate=useNavigate()

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Correct type for e
    const inputCedula = e.target.value;
    setCedula(inputCedula);

    const isValidCedula = /^\d*$/.test(inputCedula);
    if (!isValidCedula && inputCedula !== "") {
      setCedulaError("Cédula debe contener solo números");
    } else {
      setCedulaError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setError(""); // Limpiar el mensaje de error antes de enviar

    if (!cedula || !contrasena) {
      // Client-side check for empty fields (optional but good UX)
      setError("Cédula y contraseña son requeridas");
      return; // Stop further submission
    }
    if (!cedula || !contrasena) {
      setError("Cédula y contraseña son requeridas");
      return;
    }

    if (cedulaError) {
      // Check for cedula error before submission
      setError(cedulaError);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cedula,
          contrasena,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Handle different status codes
        if (res.status === 400) {
          setError(data.error || "Cédula y contraseña son requeridas"); // Specific message for 400
        } else if (res.status === 401) {
          setError(data.error || "Credenciales inválidas"); // Specific message for 401
        } else {
          setError(data.error || `HTTP error! status: ${res.status}`); // Generic error
        }
        return; // Important: Stop here after setting the error
      }
      // Handle successful login
      console.log(data);
      setSuccessMessage("Login successful!"); // Set success message
      navigate('/usuarios')
      // Optionally redirect or update UI
    } catch (error: any) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };
  return (
    <div className="form-container">
        <div className="form">
      <h3 className="titulologin">INICIAR SESION</h3>
      <form onSubmit={handleSubmit} method="post">
        <ul>
          <input
            className="input_login"
            type="text"
            onChange={handleCedulaChange}
            value={cedula}
            placeholder="Cédula"
          />
          <input
            className="input_login"
            type="password"
            onChange={(e) => setContrasena(e.target.value)}
            value={contrasena}
            placeholder="Contraseña"
          />
          <br></br>
          <br></br>
          <Link className="button" to="/register">
            Registrar
          </Link>
          <button className="button1" type="submit">
            Iniciar
          </button>
        </ul>
      </form>
      <div className="error">
        {" "}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "green" }}>{successMessage}</p>
        )}{" "}
        {/* Display success message */}
      </div>
    </div>
    </div>
  );
}

export default Login;
