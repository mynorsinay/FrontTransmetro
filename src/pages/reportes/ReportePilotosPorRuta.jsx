import React, { useEffect, useState } from "react";
import api from "../../services/api"; 

export default function ReportePilotosPorRuta() {
  const [agrupados, setAgrupados] = useState({});
  const [error, setError] = useState("");

  const obtenerPilotos = async () => {
    try {
      const res = await api.post("/pilotos/ConsultarPilotos", {});
      const pilotos = res.data || [];

      const porRuta = {};

      pilotos.forEach((p) => {
        const ruta = p.idRuta || "Sin Ruta";
        if (!porRuta[ruta]) {
          porRuta[ruta] = [];
        }
        porRuta[ruta].push(p);
      });

      setAgrupados(porRuta);
    } catch (err) {
      console.error(err);
      setError("⚠️ No se pudo obtener el listado de pilotos.");
    }
  };

  useEffect(() => {
    obtenerPilotos();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">👨‍✈️ Pilotos por Ruta</h2>

      {error && <p className="text-red-600">{error}</p>}

      {Object.keys(agrupados).length > 0 ? (
        Object.entries(agrupados).map(([ruta, pilotos]) => (
          <div key={ruta} className="mb-6">
            <h3 className="text-lg font-bold text-[#01ff09] mb-2">Ruta: {ruta}</h3>
            <ul className="list-disc ml-6 text-[#000000]">
              {pilotos.map((p, index) => (
                <li key={index}>
                  {`${p.primerNombre} ${p.segundoNombre} ${p.primerApellido} ${p.segundoApellido}`} — CUI: {p.cui}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        !error && <p className="text-gray-600">No hay pilotos registrados con rutas.</p>
      )}
    </div>
  );
}

