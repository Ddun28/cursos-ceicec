import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Registercourse from "./components/Registercourse";
import ListaUsuarios from "./components/ListarUsuarios";
import UpdateUsuario from "./components/updateusuarios"; // Importa UpdateUsuario
import "./App.css";
import Cursos from "./components/cursos/Cursos";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} /> {/* Usa element */}
                    <Route path="/login" element={<Login />} /> {/* Usa element */}
                    <Route path="/register" element={<Register />} /> {/* Usa element */}
                    <Route path="/registercourse" element={<Registercourse />} /> {/* Usa element */}
                    <Route path="/usuarios" element={<ListaUsuarios />} /> {/* Usa element */}
                    <Route path="/actualizar/:cedula" element={<UpdateUsuario />} /> {/* Ruta con parámetro */}
                    
                    <Route path="/cursos" element={<DashboardLayout><Cursos /></DashboardLayout>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;