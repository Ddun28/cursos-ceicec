import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Registercourse from "./components/Registercourse";
import ListaUsuarios from "./components/ListarUsuarios";
import UpdateUsuario from "./components/updateusuarios";
import "./App.css";
import Cursos from "./components/cursos/Cursos";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import { ThemeProvider } from "./components/DashboardLayout/components-test/theme-provider";
import ListaCourses from "./components/matriculacion";
import VerificacionPagos from "./components/verificacion-pagos/VerificacionPagos";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <div>
                    <Routes>
                        {/* Rutas públicas (sin DashboardLayout) */}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/registercourse" element={<Registercourse />} />
                        <Route path="/usuarios" element={<ListaUsuarios />} />
                        <Route path="/actualizar/:cedula" element={<UpdateUsuario />} />

                        <Route path="/dashboard">

                            <Route path="estudiante" element={<DashboardLayout><ListaCourses /></DashboardLayout>} />
                            <Route path="editar-perfil" element={<DashboardLayout><UpdateUsuario /></DashboardLayout>} />
                            <Route path="actualizar/:cedula" element={<DashboardLayout><UpdateUsuario /></DashboardLayout>} />
                            <Route path="docente" element={<DashboardLayout><Cursos /></DashboardLayout>} />
                            <Route path="usuarios" element={<DashboardLayout><ListaUsuarios /></DashboardLayout>} />
                            <Route path="Verificacion-Pagos" element={<DashboardLayout><VerificacionPagos /></DashboardLayout>} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;