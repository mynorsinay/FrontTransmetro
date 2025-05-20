import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function ConsultarEstaciones() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ idRuta: "", nombre: "" });
  const [estaciones, setEstaciones] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoRutas, setCargandoRutas] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const estacionesModules = [
    {
      titulo: "Actualizar Estación",
      icono: (
        <PencilSquareIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />
      ),
      ruta: "/estaciones/actualizar",
    },
    {
      titulo: "Registrar Estación",
      icono: (
        <PlusCircleIcon className="w-10 h-10 text-[#01ff09] transition-transform duration-300 group-hover:scale-110" />
      ),
      ruta: "/estaciones/registrar",
    },
  ];

  useEffect(() => {
    const cargarRutas = async () => {
      setCargandoRutas(true);
      try {
        const res = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
        setRutas(res.data);
      } catch (error) {
        console.error("Error al cargar rutas:", error);
        setMensaje("Error al cargar las rutas disponibles");
      } finally {
        setCargandoRutas(false);
      }
    };
    
    cargarRutas();
  }, []);

  const handleNavigate = (e, ruta) => {
    e.stopPropagation();
    navigate(ruta);
  };

  const consultarEstaciones = async () => {
    setCargando(true);
    setBusquedaRealizada(true);
    try {
      // Construimos el cuerpo de la petición según los campos completados
      const body = {};
      
      if (formData.idRuta) {
        body.idRuta = parseInt(formData.idRuta);
      }
      
      if (formData.nombre && formData.nombre.trim() !== "") {
        body.nombre = formData.nombre.trim();
      }

      console.log("Enviando body:", body); // Para depuración

      const res = await api.post("/Estaciones/ConsultarEstaciones", body);
      setEstaciones(res.data);
      
      if (res.data.length === 0) {
        setMensaje("No se encontraron estaciones con los criterios especificados");
      } else {
        setMensaje(`Se encontraron ${res.data.length} estaciones`);
      }
    } catch (error) {
      console.error("Error al consultar estaciones:", error);
      setMensaje("Error al consultar las estaciones");
      setEstaciones([]);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const limpiarFiltros = () => {
    setFormData({ idRuta: "", nombre: "" });
    setEstaciones([]);
    setMensaje("");
    setBusquedaRealizada(false);
  };

  return (
    <div className="p-6">
      {/* Header principal */}
      <Header titulo="🏛️ Gestión de Estaciones" fechaHora={new Date()} />

      {/* Tarjetas de acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {estacionesModules.map((module, idx) => (
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
      </div>

      {/* Header de formulario */}
      <Header titulo="Consultar Estaciones" fechaHora={new Date()} />

      {/* Formulario de Consulta */}
      <section>
        <Card className="mb-8">
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                consultarEstaciones();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ruta
                </label>
                <select
                  name="idRuta"
                  value={formData.idRuta}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]"
                  disabled={cargandoRutas}
                >
                  <option value="">Todas las rutas</option>
                  {rutas.map((ruta) => (
                    <option key={ruta.idRuta} value={ruta.idRuta}>
                      {ruta.nombre}
                    </option>
                  ))}
                </select>
                {cargandoRutas && (
                  <p className="text-sm text-gray-500">Cargando rutas...</p>
                )}
              </div>
              
              <Input
                label="Nombre de la Estación"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingrese nombre de estación"
              />
              
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  onClick={limpiarFiltros}
                  variant="secondary"
                >
                  Limpiar
                </Button>
                <Button type="submit" disabled={cargando}>
                  {cargando ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Mensaje de resultado */}
      {mensaje && (
        <p className={`mt-4 ${
          mensaje.includes("Error") ? "text-red-600" : "text-green-600"
        }`}>
          {mensaje}
        </p>
      )}

      {/* Tabla de resultados */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando estaciones...</p>
      ) : estaciones.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Nombre Estación</th>
                <th className="px-4 py-2">Ruta</th>
                <th className="px-4 py-2">Dirección</th>
                <th className="px-4 py-2">Horario L-V</th>
                <th className="px-4 py-2">Horario S-D</th>
              </tr>
            </thead>
            <tbody>
              {estaciones.map((estacion, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{estacion.nombre}</td>
                  <td className="px-4 py-2">{estacion.ruta}</td>
                  <td className="px-4 py-2">{estacion.direccion || "No asignada"}</td>
                  <td className="px-4 py-2">{estacion.idHorarioES}</td>
                  <td className="px-4 py-2">{estacion.idHorarioFDS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        busquedaRealizada && (
          <p className="mt-4 text-gray-600">No se encontraron estaciones.</p>
        )
      )}
    </div>
  );
}