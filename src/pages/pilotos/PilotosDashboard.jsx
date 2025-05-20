import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { PencilIcon, UserPlusIcon, TrashIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function PilotosDashboard() {
  const navigate = useNavigate();

  const pilotosModules = [
    {
      titulo: "Actualizar Piloto",
      icono: <PencilIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/pilotos/actualizar",
    },
    {
      titulo: "Crear Piloto",
      icono: <UserPlusIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/pilotos/crear",
    },
    {
      titulo: "Deshabilitar Piloto",
      icono: <TrashIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/pilotos/eliminar",
    },
    {
      titulo: "Habilitar Piloto",
      icono: <CheckCircleIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/pilotos/habilitar",
    },
  ];

  // Estados para Lista de Pilotos
  const [formData, setFormData] = useState({ CUI: "" });
  const [pilotos, setPilotos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    
    try {
      const body = formData.CUI ? { CUI: formData.CUI } : {};
      const res = await api.post("/Pilotos/ConsultarPilotos", body);
      
      setPilotos(res.data);
      setMensaje(res.data.length > 0 
        ? `✅ Se encontraron ${res.data.length} pilotos` 
        : "ℹ️ No se encontraron pilotos con ese CUI");
    } catch (error) {
      console.error("Error al obtener los pilotos:", error);
      setMensaje("❌ Error al obtener los pilotos");
      setPilotos([]);
    } finally {
      setBusquedaRealizada(true);
      setCargando(false);
    }
  };

  const limpiarFiltros = () => {
    setFormData({ CUI: "" });
    setPilotos([]);
    setMensaje("");
    setBusquedaRealizada(false);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Header de sección */}
      <h2 className="text-xl font-semibold mb-6">🧑‍✈️ Gestión de Pilotos</h2>

      {/* Tarjetas de opciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {pilotosModules.map((module, idx) => (
          <Link key={idx} to={module.ruta}>
            <Card className="flex items-center justify-between p-6 rounded-2xl border border-[#01ff09] shadow-xl group hover:shadow-2xl transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{module.titulo}</h3>
              </div>
              <div>{module.icono}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Sección de búsqueda de Pilotos */}
      <Header titulo="Consultar Pilotos" fechaHora={new Date()} />

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="CUI del Piloto"
            name="CUI"
            value={formData.CUI}
            onChange={handleChange}
            placeholder="Ingrese CUI del piloto"
          />
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              onClick={limpiarFiltros}
              variant="secondary"
              className="flex items-center gap-2"
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={cargando}>
              {cargando ? "Buscando..." : "Buscar Piloto"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Mostrar mensaje si existe */}
      {mensaje && (
        <p className={`mt-4 ${
          mensaje.includes("✅") ? "text-green-600" : 
          mensaje.includes("❌") ? "text-red-600" : 
          "text-gray-600"
        }`}>
          {mensaje}
        </p>
      )}

      {/* Mostrar tabla de pilotos */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando pilotos...</p>
      ) : busquedaRealizada && pilotos.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <h3 className="font-semibold mb-4">Resultados de Pilotos:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">CUI</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Apellido</th>
                <th className="px-4 py-2">Tipo Licencia</th>
                <th className="px-4 py-2">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {pilotos.map((piloto, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{piloto.cui}</td>
                  <td className="px-4 py-2">{piloto.primerNombre}</td>
                  <td className="px-4 py-2">{piloto.primerApellido}</td>
                  <td className="px-4 py-2">{piloto.tipoLicencia}</td>
                  <td className="px-4 py-2">{piloto.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : busquedaRealizada && pilotos.length === 0 ? (
        <p className="mt-4 text-gray-600">No se encontraron pilotos con los criterios de búsqueda.</p>
      ) : null}
    </div>
  );
}