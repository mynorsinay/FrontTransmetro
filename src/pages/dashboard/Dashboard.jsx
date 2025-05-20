import { Card, CardContent } from "../../components/ui/card";
import { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import {
  TruckIcon,
  UserCircleIcon,
  MapIcon,
} from "@heroicons/react/24/solid";
import api from "../../services/api";

export default function Dashboard() {
  const [fechaHora, setFechaHora] = useState(new Date());
  const [buses, setBuses] = useState(0);
  const [pilotos, setPilotos] = useState(0);
  const [rutas, setRutas] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const busesResponse = await api.post("/Buses/BusesAsignados", {});
      setBuses(busesResponse.data.length || 0);

      const pilotosResponse = await api.post("/Pilotos/ConsultarPilotos", {});
      setPilotos(pilotosResponse.data.length || 0);

      const rutasResponse = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
      setRutas(rutasResponse.data.length || 0);
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
    }
  };

  const resumen = [
    {
      titulo: "Buses",
      cantidad: buses,
      icono: <TruckIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      titulo: "Pilotos",
      cantidad: pilotos,
      icono: <UserCircleIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      titulo: "Rutas",
      cantidad: rutas,
      icono: <MapIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <Header titulo="Panel de Control" fechaHora={fechaHora} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {resumen.map((item, idx) => (
          <Card
            key={idx}
            className="flex items-center justify-between p-6 rounded-2xl border border-[#01ff09] shadow-xl group"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{item.titulo}</h2>
              <p className="text-2xl font-bold text-black">{item.cantidad}</p>
            </div>
            <div>{item.icono}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}



