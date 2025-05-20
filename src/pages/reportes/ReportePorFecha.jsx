import React, { useState } from "react";
import axios from "axios";

export default function ReportePorFecha() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");

  const buscarPorFecha = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://localhost:7293/api/Buses/HistorialMantenimientos", {});
      const data = response.data || [];

      const filtrados = data.filter((item) => {
        const fecha = new Date(item.fecha);
        return (
          (!fechaInicio || fecha >= new Date(fechaInicio)) &&
          (!fechaFin || fecha <= new Date(fechaFin))
        );
      });

      setResultados(filtrados);
      setError("");
    } catch (err) {
      console.error(err);
      setResultados([]);
      setError("⚠️ Error al filtrar por fechas.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🗓️ Reporte por Fecha</h2>

      <form onSubmit={buscarPorFecha} className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Fecha Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-black focus:ring-[#01ff09] focus:border-[#01ff09]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-black focus:ring-[#01ff09] focus:border-[#01ff09]"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="bg-[#01ff09] text-white px-4 py-2 rounded hover:bg-azulMarino transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {resultados.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white text-black rounded">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2 text-left">Placa</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{item.placa}</td>
                  <td className="px-4 py-2">{item.fecha}</td>
                  <td className="px-4 py-2">{item.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p className="text-gray-600">No se encontraron resultados en ese rango.</p>
      )}
    </div>
  );
}

