import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react"; // Importar íconos para mostrar/ocultar contraseña

function Register() {
  const [cedula, setCedula] = useState("");
  const [usuario_telegram, setUsuario_telegram] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cedulaError, setCedulaError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

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
      !usuario_telegram
    ) {
      setError("Todos los campos son requeridos");
      toast.error("Todos los campos son requeridos");
      return;
    }

    if (cedulaError) {
      setError(cedulaError);
      toast.error(cedulaError);
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
          rol_id: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          setError(data.error || "Error en los datos de registro");
          toast.error(data.error || "Error en los datos de registro");
        } else if (res.status === 401) {
          setError(data.error || "Credenciales inválidas");
          toast.error(data.error || "Credenciales inválidas");
        } else {
          setError(data.error || `HTTP error! status: ${res.status}`);
          toast.error(data.error || `HTTP error! status: ${res.status}`);
        }
        return;
      }

      setSuccessMessage("Registro exitoso!");
      toast.success("Usuario registrado correctamente");
      setCedula("");
      setUsuario_telegram("");
      setNombre("");
      setApellido("");
      setCorreo("");
      setContrasena("");
      setCedulaError("");

    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Registrarse en Cursos CECCEIC
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-slate-400">
            Completa el formulario para crear una cuenta de estudiante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-gray-700 dark:text-white">
                Nombre
              </Label>
              <Input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido" className="text-gray-700 dark:text-white">
                Apellido
              </Label>
              <Input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo" className="text-gray-700 dark:text-white">
                Correo
              </Label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Correo"
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-gray-700 dark:text-white">
                Cédula
              </Label>
              <Input
                id="cedula"
                type="text"
                value={cedula}
                onChange={handleCedulaChange}
                placeholder="Cédula"
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
              />
              {cedulaError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{cedulaError}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuario_telegram" className="text-gray-700 dark:text-white">
                Usuario de Telegram
              </Label>
              <Input
                id="usuario_telegram"
                type="text"
                value={usuario_telegram}
                onChange={(e) => setUsuario_telegram(e.target.value)}
                placeholder="Usuario de Telegram"
                required
                className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrasena" className="text-gray-700 dark:text-white">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="contrasena"
                  type={showPassword ? "text" : "password"} // Cambiar el tipo de entrada
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  required
                  className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
              Registrarme
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
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
}

export default Register;