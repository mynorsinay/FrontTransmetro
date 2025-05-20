import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function ConsultarHorariosXEstacionesXRutas() {
  const navigate = useNavigate();
  const [horariosEstacionesRutas, setHorariosEstacionesRutas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const consultarHorariosXEstacionesXRutas = async () => {
    setCargando(true);
    try {
      const res = await api.post("/Horarios/HorariosXEstacionesXRutas", {});
      setHorariosEstacionesRutas(res.data || []);
      setMensaje(res.data.length > 0
        ? `✅ Se encontraron ${res.data.length} registros de horarios`
        : "No se encontraron horarios registrados");
    } catch (error) {
      console.error("Error al consultar horarios por estaciones y rutas:", error);
      setMensaje("❌ Error al consultar horarios por estaciones y rutas");
    } finally {
      setBusquedaRealizada(true);
      setCargando(false);
    }
  };

  const limpiarResultados = () => {
    setHorariosEstacionesRutas([]);
    setMensaje("");
    setBusquedaRealizada(false);
  };

  return (
    <div className="p-6">
      {/* Botón de regreso */}
      <button
        onClick={() => navigate("/horarios")}
        className="flex items-center gap-2 bg-[#01ff09] text-black font-semibold px-4 py-2 rounded-xl mb-6 hover:bg-[#60ff40] transition-all"
      >
        <span className="text-white p-1 rounded">⬅️</span> Regresar
      </button>

      {/* Header principal */}
      <Header titulo="🕑 Consultar Horarios x Estaciones x Rutas" fechaHora={new Date()} />

      {/* Botón de Consulta */}
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
              onClick={consultarHorariosXEstacionesXRutas}
              disabled={cargando}
            >
              {cargando ? "Buscando..." : "Consultar Horarios"}
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

      {/* Resultados */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando horarios...</p>
      ) : busquedaRealizada && horariosEstacionesRutas.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <h3 className="font-semibold mb-4">Horarios por Estaciones y Rutas:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Ruta</th>
                <th className="px-4 py-2">Estación</th>
                <th className="px-4 py-2">Lunes a Viernes</th>
                <th className="px-4 py-2">Sábado y Domingo</th>
              </tr>
            </thead>
            <tbody>
              {horariosEstacionesRutas.map((horario, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{horario.ruta || "-"}</td>
                  <td className="px-4 py-2">{horario.estacion || "-"}</td>
                  <td className="px-4 py-2">{horario.horaLV || "-"}</td>
                  <td className="px-4 py-2">{horario.horaSD || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : busquedaRealizada && horariosEstacionesRutas.length === 0 ? (
        <p className="mt-4 text-gray-600">No se encontraron horarios registrados.</p>
      ) : null}
    </div>
  );
}