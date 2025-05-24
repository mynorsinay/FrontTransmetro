import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon,
  TruckIcon,
  MapIcon,
  ChartPieIcon,
  UsersIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  ShieldExclamationIcon,
  Bars3Icon,
  UserPlusIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated, user } = useAuth(); 

  const links = [
    { to: "/app", icon: <HomeIcon className="w-6 h-6" />, label: "Inicio" },
    { to: "/app/buses", icon: <TruckIcon className="w-6 h-6" />, label: "Buses" },
    { to: "/app/pilotos/dashboard", icon: <ClipboardDocumentListIcon className="w-6 h-6" />, label: "Pilotos" },
    { to: "/app/rutas/dashboard", icon: <MapIcon className="w-6 h-6" />, label: "Rutas" },
    { to: "/app/reportes", icon: <ChartPieIcon className="w-6 h-6" />, label: "Reportes" },
    { to: "/app/usuarios", icon: <UsersIcon className="w-6 h-6" />, label: "Usuarios" },
    { to: "/app/guardias", icon: <ShieldExclamationIcon className="w-6 h-6" />, label: "Guardias" },
    { to: "/app/mantenimientos", icon: <WrenchScrewdriverIcon className="w-6 h-6" />, label: "Mantenimientos" },
    { to: "/app/estaciones", icon: <BuildingLibraryIcon className="w-6 h-6" />, label: "Estaciones" },
    { to: "/app/distancias", icon: <MapPinIcon className="w-6 h-6" />, label: "Distancias" },
    { to: "/app/horarios", icon: <ClockIcon className="w-6 h-6" />, label: "Horarios" },
  ];

  return (
    <aside
      className={`bg-black text-white p-4 shadow-md h-screen flex flex-col transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Botón de hamburguesa */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:text-[#01ff09] transition"
        >
          <Bars3Icon className="w-8 h-8" />
        </button>
        {isExpanded && (
          <h1 className="text-xl font-bold text-[#01ff09] flex items-center gap-2">
            <BuildingOfficeIcon className="w-6 h-6" />
            Transmetro
          </h1>
        )}
      </div>

      {/* Foto de perfil y botón de agregar usuario */}
      {isExpanded && (
        <div className="flex flex-col items-center mb-6">
          <img
            src="/default-user.png"
            alt="Foto de usuario"
            className="w-16 h-16 rounded-full border-2 border-[#01ff09] object-cover"
          />
          {user && (
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-white">
                {user.nombre} {user.apellido}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navegación simple */}
      <nav className="flex flex-col gap-4 flex-grow">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-[#01ff09] text-black font-semibold"
                  : "hover:text-[#01ff09]"
              }`
            }
          >
            {link.icon}
            {isExpanded && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}