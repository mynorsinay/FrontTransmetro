import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

// Importación de páginas públicas
import Login from "../pages/usuario/Login";

// Importación de páginas protegidas (requieren autenticación)
// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Buses
import AsignarBus from "../pages/buses/AsignarBus";
import DeshabilitarBus from "../pages/buses/DeshabilitarBus";
import HabilitarBus from "../pages/buses/HabilitarBus";
import ReasignarBus from "../pages/buses/ReasignarBus";
import BusesDashboard from "../pages/buses/BusesDashboard";

// Mantenimientos
import HistorialMantenimientos from "../pages/mantenimientos/HistorialMantenimientos";
import MandarAMantenimiento from "../pages/mantenimientos/MandarAMantenimiento";
import MantenimientosDashboard from "../pages/mantenimientos/MantenimientosDashboard";

// Distancias
import ActualizarDistancia from "../pages/distancias/ActualizarDistancia";
import ConsultarDistancias from "../pages/distancias/ConsultarDistancias";
import RegistrarDistancia from "../pages/distancias/RegistrarDistancia";

// Estaciones
import ActualizarEstacion from "../pages/estaciones/ActualizarEstacion";
import ConsultarEstaciones from "../pages/estaciones/ConsultarEstaciones";
import RegistrarEstaciones from "../pages/estaciones/RegistrarEstaciones";

// Guardias
import DeshabilitarGuardia from "../pages/guardias/DeshabilitarGuardia";
import EliminarGuardia from "../pages/guardias/EliminarGuardia";
import HabilitarGuardia from "../pages/guardias/HabilitarGuardia";
import ReasignarGuardia from "../pages/guardias/ReasignarGuardia";
import RegistrarGuardia from "../pages/guardias/RegistrarGuardia";
import GuardiasDashboard from "../pages/guardias/GuardiasDashboard";

// Pilotos
import ActualizarPiloto from "../pages/pilotos/ActualizarPiloto";
import CrearPiloto from "../pages/pilotos/CrearPiloto";
import EliminarPiloto from "../pages/pilotos/EliminarPiloto";
import HabilitarPiloto from "../pages/pilotos/HabilitarPiloto";
import ListaPilotos from "../pages/pilotos/ListaPilotos";
import PilotosDashboard from "../pages/pilotos/PilotosDashboard";

// Reportes
import ReporteGeneral from "../pages/reportes/ReporteGeneral";
import ReporteBusesMantenimiento from "../pages/reportes/ReporteBusesMantenimiento";
import ReportePilotosPorRuta from "../pages/reportes/ReportePilotosPorRuta";
import ReportePorFecha from "../pages/reportes/ReportePorFecha";
import ReportesDashboard from "../pages/reportes/ReportesDashboard";

// Rutas
import CrearRuta from "../pages/rutas/CrearRuta";
import ActualizarRuta from "../pages/rutas/ActualizarRuta";
import Rutas from "../pages/rutas/Rutas";
import RutasDashboard from "../pages/rutas/RutasDashboard";

// Usuarios
import CrearUsuarios from "../pages/usuario/CrearUsuarios";
import ActualizarUsuarios from "../pages/usuario/ActualizarUsuarios";
import ConsultarUsuarios from "../pages/usuario/ConsultarUsuarios";
import EliminarUsuarios from "../pages/usuario/EliminarUsuarios";
import ReiniciarPass from "../pages/usuario/ReiniciarPass";
import UsuariosDashboard from "../pages/usuario/UsuariosDashboard";
import UsuarioLogin from "../pages/usuario/UsuarioNuevoLogin";

// Horarios
import ConsultarHorarios from "../pages/Horarios/ConsultarHorarios";
import ConsultarHorariosxEstacionesxRutas from "../pages/Horarios/ConsultarHorariosXEstacionesXRutas";

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/usuarios/reiniciar" element={<ReiniciarPass />} />
      <Route path="/usuarios/crear" element={<UsuarioLogin />} />
      {/* --- Rutas Protegidas --- */}
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Buses */}
        <Route path="buses" element={<BusesDashboard />} />
        <Route path="buses/asignar" element={<AsignarBus />} />
        <Route path="buses/deshabilitar" element={<DeshabilitarBus />} />
        <Route path="buses/habilitar" element={<HabilitarBus />} />
        <Route path="buses/reasignar" element={<ReasignarBus />} />

        {/* Mantenimientos */}
        <Route path="mantenimientos" element={<MantenimientosDashboard />} />
        <Route path="mantenimientos/historial" element={<HistorialMantenimientos />} />
        <Route path="mantenimientos/mandaramantenimiento" element={<MandarAMantenimiento />} />

        {/* Distancias */}
        <Route path="distancias" element={<ConsultarDistancias />} />
        <Route path="distancias/actualizar" element={<ActualizarDistancia />} />
        <Route path="distancias/registrar" element={<RegistrarDistancia />} />

        {/* Estaciones */}
        <Route path="estaciones" element={<ConsultarEstaciones />} />
        <Route path="estaciones/actualizar" element={<ActualizarEstacion />} />
        <Route path="estaciones/registrar" element={<RegistrarEstaciones />} />

        {/* Guardias */}
        <Route path="guardias" element={<GuardiasDashboard />} />
        <Route path="guardias/deshabilitar" element={<DeshabilitarGuardia />} />
        <Route path="guardias/eliminar" element={<EliminarGuardia />} />
        <Route path="guardias/habilitar" element={<HabilitarGuardia />} />
        <Route path="guardias/reasignar" element={<ReasignarGuardia />} />
        <Route path="guardias/registrar" element={<RegistrarGuardia />} />

        {/* Pilotos */}
        <Route path="pilotos" element={<ListaPilotos />} />
        <Route path="pilotos/dashboard" element={<PilotosDashboard />} />
        <Route path="pilotos/actualizar" element={<ActualizarPiloto />} />
        <Route path="pilotos/crear" element={<CrearPiloto />} />
        <Route path="pilotos/eliminar" element={<EliminarPiloto />} />
        <Route path="pilotos/habilitar" element={<HabilitarPiloto />} />

        {/* Reportes */}
        <Route path="reportes" element={<ReportesDashboard />} />
        <Route path="reportes/general" element={<ReporteGeneral />} />
        <Route path="reportes/buses" element={<ReporteBusesMantenimiento />} />
        <Route path="reportes/pilotos" element={<ReportePilotosPorRuta />} />
        <Route path="reportes/fecha" element={<ReportePorFecha />} />

        {/* Rutas */}
        <Route path="rutas" element={<Rutas />} />
        <Route path="rutas/dashboard" element={<RutasDashboard />} />
        <Route path="rutas/crear" element={<CrearRuta />} />
        <Route path="rutas/actualizar" element={<ActualizarRuta />} />

        {/* Usuarios */}
        <Route path="usuarios" element={<UsuariosDashboard />} />
        <Route path="usuarios/crear" element={<CrearUsuarios />} />
        <Route path="usuarios/actualizar" element={<ActualizarUsuarios />} />
        <Route path="usuarios/eliminar" element={<EliminarUsuarios />} />
        <Route path="usuarios/reiniciar" element={<ReiniciarPass />} />

        {/* Horarios */}
        <Route path="horarios" element={<ConsultarHorarios />} />
        <Route path="horarios/consultar" element={<ConsultarHorariosxEstacionesxRutas />} />
      </Route>

      {/* Ruta para páginas no encontradas (redirige al login) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}