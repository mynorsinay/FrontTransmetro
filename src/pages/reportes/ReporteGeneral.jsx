import React, { useEffect, useState } from "react";
import api from "../../services/api"; 

export default function ReporteGeneral() {
  const [datos, setDatos] = useState({
    buses: 0,
    pilotos: 0,
    mantenimiento: 0,
    rutas: 0
  });

  const obtenerDatos = async () => {
    try {
      const [busesRes, pilotosRes, mantenimientoRes, rutasRes] = await Promise.all([
        api.post("/Buses/BusesAsignados", {}),
        api.post("/pilotos/ConsultarPilotos", {}),
        api.post("/Buses/HistorialMantenimientos", {}),
        api.post("/Rutas/ConsuntarRutaConMunicipalidad", {})
      ]);

      setDatos({
        buses: busesRes.data?.length || 0,
        pilotos: pilotosRes.data?.length || 0,
        mantenimiento: mantenimientoRes.data?.length || 0,
        rutas: rutasRes.data?.length || 0
      });
    } catch (err) {
      console.error("⚠️ Error al obtener datos de reportes:", err);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const items = [
    { label: "Buses Registrados", valor: datos.buses },
    { label: "Pilotos Activos", valor: datos.pilotos },
    { label: "Buses en Mantenimiento", valor: datos.mantenimiento },
    { label: "Rutas Disponibles", valor: datos.rutas }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-lg shadow bg-[#01ff09] text-[#ffffff] text-center">
          <p className="text-lg font-semibold">{item.label}</p>
          <p className="text-3xl font-bold mt-2">{item.valor}</p>
        </div>
      ))}
    </div>
  );
}
