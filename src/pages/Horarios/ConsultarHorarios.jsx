import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function ConsultarHorarios() {
  const navigate = useNavigate();
  const [horarios, setHorarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const horariosModules = [
    {
      titulo: "Consultar Horarios x Estaciones x Rutas",
      icono: (
        <ClipboardDocumentListIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />
      ),
      ruta: "/app/horarios/consultar",
    },
  ];

  const handleNavigate = (e, ruta) => {
    e.stopPropagation();
    navigate(ruta);
  };

  const consultarHorarios = async () => {
    setCargando(true);
    try {
      const res = await api.post("/Horarios/ConsultarHorarios", {});
      setHorarios(res.data || []);
      setMensaje(res.data.length > 0 
        ? `✅ Se encontraron ${res.data.length} horarios` 
        : "No se encontraron horarios registrados");
    } catch (error) {
      console.error("Error al consultar los horarios:", error);
      setMensaje("❌ Error al consultar los horarios");
    } finally {
      setBusquedaRealizada(true);
      setCargando(false);
    }
  };

  const limpiarResultados = () => {
    setHorarios([]);
    setMensaje("");
    setBusquedaRealizada(false);
  };

  return (
    <div className="p-6">
      {/* Header principal */}
      <Header titulo="🕑 Gestión de Horarios"  />

      {/* Tarjetas de acciones */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {horariosModules.map((module, idx) => (
          <div
            key={idx}
            className="cursor-pointer"
            onClick={(e) => handleNavigate(e, module.ruta)}
          >
            <Card className="flex items-center justify-between p-6 rounded-2xl border border-[#01ff09] shadow-xl group hover:shadow-2xl transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{module.titulo}</h3>
              </div>
              <div>{module.icono}</div>
            </Card>
          </div>
        ))}
      </section>

      {/* Header de formulario */}
      <Header titulo="Consultar Horarios" fechaHora={new Date()} />

      {/* Botón de consulta */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex justify-end gap-4">
            {busquedaRealizada && (
              <Button 
                type="button" 
                onClick={limpiarResultados}
                variant="secondary"
              >
                Limpiar
              </Button>
            )}
            <Button 
              onClick={consultarHorarios}
              disabled={cargando}
            >
              {cargando ? "Cargando..." : "Consultar Horarios"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje de estado */}
      {mensaje && (
        <p className={`mt-4 ${
          mensaje.includes("✅") ? "text-green-600" : 
          mensaje.includes("❌") ? "text-red-600" : "text-gray-600"
        }`}>
          {mensaje}
        </p>
      )}

      {/* Tabla de resultados */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando horarios...</p>
      ) : busquedaRealizada && horarios.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <h3 className="font-semibold mb-4">Horarios Disponibles:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Nombre Ruta</th>
                <th className="px-4 py-2">Horario</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{horario.nombre || "-"}</td>
                  <td className="px-4 py-2">{horario.horario || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : busquedaRealizada && horarios.length === 0 ? (
        <p className="mt-4 text-gray-600">No se encontraron horarios registrados.</p>
      ) : null}
    </div>
  );
}