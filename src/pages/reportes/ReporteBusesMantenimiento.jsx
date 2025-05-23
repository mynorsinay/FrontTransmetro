import React, { useEffect, useState } from "react";
import api from "../../services/api"; 

export default function ReporteBusesMantenimiento() {
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState("");

  const obtenerHistorial = async () => {
    try {
      const res = await api.post("/Buses/HistorialMantenimientos", {});
      setRegistros(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setRegistros([]);
      setError("⚠️ Error al obtener el historial de mantenimiento.");
    }
  };

  useEffect(() => {
    obtenerHistorial();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🛠️ Buses en Mantenimiento</h2>

      {error && <p className="text-red-600">{error}</p>}

      {registros.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white text-black rounded">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2 text-left">Placa</th>
                <th className="px-4 py-2 text-left">Fecha Inicio</th>
                <th className="px-4 py-2 text-left">Fecha Fin</th>
                <th className="px-4 py-2 text-left">Costo</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((bus, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{bus.placa }</td>
                  <td className="px-4 py-2">{bus.fechaInicio }</td>
                  <td className="px-4 py-2">{bus.fechaFin }</td>
                  <td className="px-4 py-2">{bus.costoTotal }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p className="text-gray-600">No hay registros recientes de mantenimiento.</p>
      )}
    </div>
  );
}

