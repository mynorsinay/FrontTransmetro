import React, { useState } from "react";
import ReporteGeneral from "./ReporteGeneral";
import ReporteBusesMantenimiento from "./ReporteBusesMantenimiento";
import ReportePilotosPorRuta from "./ReportePilotosPorRuta";
import ReportePorFecha from "./ReportePorFecha";

const tabs = [
  { id: "general", label: "📊 General" },
  { id: "buses", label: "🚌 Mantenimiento" },
  { id: "pilotos", label: "👨‍✈️ Pilotos por Ruta" },
  { id: "fecha", label: "🗓️ Por Fecha" }
];

export default function ReportesDashboard() {
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general":
        return <ReporteGeneral />;
      case "buses":
        return <ReporteBusesMantenimiento />;
      case "pilotos":
        return <ReportePilotosPorRuta />;
      case "fecha":
        return <ReportePorFecha />;
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
