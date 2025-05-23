import React, { useState } from "react";
import ReporteGeneral from "./ReporteGeneral";
import ReporteBusesMantenimiento from "./ReporteBusesMantenimiento";
import ReportePilotosPorRuta from "./ReportePilotosPorRuta";
import ReportePorFecha from "./ReportePorFecha";
import ReporteBuses from "./ReporteBuses";
import ReporteRutas from "./ReporteRutas";
import ReporteUsuarios from "./ReporteUsuarios";
import ReporteGuardias from "./ReporteGuardias";
import ReporteEstaciones from "./ReporteEstaciones";

const tabs = [
  { id: "general", label: "📊 General" },
  { id: "buses", label: "🚌 Buses" },
  { id: "pilotos", label: "👨‍✈️ Pilotos " },
  { id: "Mantenimientos", label: "🛠️ Mantenimientos" },
  { id: "rutas", label: "🛣️ Rutas" },
  { id: "usuarios", label: " 👤 Usuarios" },
  { id: "guardias", label: " 🛡️ Guardias" },
  { id: "estaciones", label: "🏛️ Estaciones" }
];

export default function ReportesDashboard() {
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <ReporteGeneral />;
      case "buses":
        return <ReporteBuses />;
      case "pilotos":
        return <ReportePilotosPorRuta />;
      case "Mantenimientos":
        return <ReporteBusesMantenimiento />;
      case "rutas":
        return <ReporteRutas />;
      case "usuarios":
        return <ReporteUsuarios />;
      case "guardias":
        return <ReporteGuardias />;
      case "estaciones":
        return <ReporteEstaciones />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-blanco rounded-xl shadow text-negro">
      <h1 className="text-2xl font-bold mb-4">📈 Dashboard de Reportes</h1>
      <div className="flex space-x-4 mb-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold rounded-t ${
              activeTab === tab.id ? "bg-[#01ff09] text-blanco" : "bg-gray-200 text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{renderTab()}</div>
    </div>
  );
}
