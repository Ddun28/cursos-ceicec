import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react"; 

function Login() {
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");

    if (!cedula || !contrasena) {
      setError("Cédula y contraseña son requeridas");
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
        setError(data.error || "Error en el inicio de sesión");
        return;
      }

      // Guardar el token en localStorage
      localStorage.setItem("access_token", data.access_token);

      const rolRes = await fetch(`http://localhost:5000/rol/${data.usuario.rol_id}`);
      const rolData = await rolRes.json();

      if (!rolRes.ok) {
        setError("No se pudo obtener el nombre del rol");
        return;
      }

      const usuarioActualizado = {
        ...data.usuario, 
        rol_nombre: rolData.rol_nombre, 
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      // Mostrar toast de éxito
      toast.success("Inicio de sesión exitoso", {
        position: "top-center",
        autoClose: 1000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored", 
        style: {
          backgroundColor: 'green', 
          color: 'white', 
        },
      });

      setTimeout(() => {
        switch (rolData.rol_nombre.toLowerCase()) {
          case "estudiante":
            navigate('/dashboard/estudiante');
            break;
          case "administrativo":
            navigate('/dashboard/docente');
            break;
          case "superusuario":
            navigate('/dashboard/usuarios');
            break;
          default:
            navigate('/');
        }
      }, 1000); // 1000 ms = 1 segundo

    } catch (error: any) {
      setError(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-96">
        <h3 className="text-2xl font-bold text-center mb-6">INICIAR SESIÓN</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              onChange={(e) => setCedula(e.target.value)}
              value={cedula}
              placeholder="Cédula"
              className="input_login"
            />
          </div>
          <div className="mb-4 relative">
            <Input
              type={showPassword ? "text" : "password"}
              onChange={(e) => setContrasena(e.target.value)}
              value={contrasena}
              placeholder="Contraseña"
              className="input_login pr-10" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          <div className="flex justify-between mb-4">
            <Link to="/register" className="text-blue-600 hover:underline">
              Registrar
            </Link>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-500 transition">
              Iniciar Sesion
            </Button>
          </div>
        </form>
        <div className="error">
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;