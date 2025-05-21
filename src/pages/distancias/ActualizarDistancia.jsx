import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function ActualizarDistancia() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    idDistancia: "",
    Ruta: "",
    EstacionInicio: "",
    EstacionFin: "",
    Recorrido: ""
  });

  const [distancias, setDistancias] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [cargando, setCargando] = useState({
    distancias: false,
    rutas: false,
    estaciones: false,
    general: false,
    seleccionando: false // Nuevo estado para controlar selección
  });

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargando(prev => ({...prev, distancias: true, rutas: true}));
        
        // Cargar distancias
        const resDistancias = await api.post("/Distancias/ConsultarDistancias", {});
        setDistancias(resDistancias.data || []);
        
        // Cargar rutas
        const resRutas = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
        setRutas(resRutas.data || []);
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setModalMessage("❌ Error al cargar los datos iniciales");
        setModalOpen(true);
      } finally {
        setCargando(prev => ({...prev, distancias: false, rutas: false}));
      }
    };

    cargarDatosIniciales();
  }, []);

  // Cargar estaciones cuando cambia la ruta seleccionada
  const cargarEstacionesPorRuta = async (idRuta) => {
    if (!idRuta) return;
    
    try {
      setCargando(prev => ({...prev, estaciones: true}));
      const res = await api.post("/Estaciones/ConsultarEstaciones", {
        idRuta: parseInt(idRuta)
      });
      setEstaciones(res.data || []);
      return res.data || []; // Devolver las estaciones cargadas
    } catch (error) {
      console.error("Error al cargar estaciones:", error);
      setModalMessage("❌ Error al cargar estaciones");
      setModalOpen(true);
      return [];
    } finally {
      setCargando(prev => ({...prev, estaciones: false}));
    }
  };

  // Manejar selección de distancia
  const handleSelectDistancia = async (e) => {
    const idDistancia = e.target.value;
    if (!idDistancia) {
      resetFormulario();
      return;
    }

    try {
      setCargando(prev => ({...prev, seleccionando: true}));

      const distanciaSeleccionada = distancias.find(d => d.idDistancia === parseInt(idDistancia));
      if (!distanciaSeleccionada) return;

      // 1. Primero actualizamos la ruta en el estado
      setFormulario(prev => ({
        ...prev,
        idDistancia: distanciaSeleccionada.idDistancia,
        Ruta: distanciaSeleccionada.idRuta,
        Recorrido: distanciaSeleccionada.recorrido,
        EstacionInicio: "", // Limpiar temporalmente
        EstacionFin: "" // Limpiar temporalmente
      }));

      // 2. Cargamos las estaciones para esa ruta (esperamos a que termine)
      const estacionesCargadas = await cargarEstacionesPorRuta(distanciaSeleccionada.idRuta);

      // 3. Verificamos que las estaciones de la distancia existan en las cargadas
      const estacionInicioValida = estacionesCargadas.some(e => e.idEstacion === distanciaSeleccionada.idEstacionInicio);
      const estacionFinValida = estacionesCargadas.some(e => e.idEstacion === distanciaSeleccionada.idEstacionFin);

      // 4. Actualizamos el formulario con los valores finales
      setFormulario(prev => ({
        ...prev,
        EstacionInicio: estacionInicioValida ? distanciaSeleccionada.idEstacionInicio : "",
        EstacionFin: estacionFinValida ? distanciaSeleccionada.idEstacionFin : ""
      }));

    } catch (error) {
      console.error("Error al seleccionar distancia:", error);
      setModalMessage("❌ Error al cargar los datos de la distancia");
      setModalOpen(true);
    } finally {
      setCargando(prev => ({...prev, seleccionando: false}));
    }
  };

  // Manejar cambio de ruta manual
  const handleChangeRuta = async (e) => {
    const nuevaRuta = e.target.value;
    setFormulario(prev => ({
      ...prev,
      Ruta: nuevaRuta,
      EstacionInicio: "",
      EstacionFin: ""
    }));
    
    await cargarEstacionesPorRuta(nuevaRuta);
  };

  const resetFormulario = () => {
    setFormulario({
      idDistancia: "",
      Ruta: "",
      EstacionInicio: "",
      EstacionFin: "",
      Recorrido: ""
    });
    setEstaciones([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleRecorridoChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setFormulario({ ...formulario, Recorrido: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formulario.EstacionInicio === formulario.EstacionFin) {
      setModalMessage("❌ Las estaciones de inicio y fin deben ser diferentes");
      setModalOpen(true);
      return;
    }

    try {
      setCargando(prev => ({...prev, general: true}));
      const res = await api.post("/Distancias/ActualizarDistancia", formulario);

      if (res.status === 200) {
        setModalMessage("✅ Distancia actualizada correctamente");
        setModalOpen(true);
        // Recargar distancias
        const resDistancias = await api.post("/Distancias/ConsultarDistancias", {});
        setDistancias(resDistancias.data || []);
      } else {        
        let errorMsg = " ❌  No se pudo actualizar la distancia.";
        if (error.response && error.response.data && typeof error.response.data === "string") {
          errorMsg = `❌ ${error.response.data}`;
        } else if (error.response && error.response.data?.mensaje) {
          errorMsg = `❌ ${error.response.data.mensaje}`;
        }
        setModalMessage(errorMsg);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setModalMessage("⚠️ Error al actualizar la distancia");
      setModalOpen(true);
    } finally {
      setCargando(prev => ({...prev, general: false}));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Actualizar Distancia</h2>

      <div className="mb-4">
        <Button onClick={() => navigate("/distancias")}>⬅️ Regresar</Button>
      </div>

      <Card className="border border-[#01ff09]/50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Distancia */}
            <div>
              <label className="block text-sm font-medium">Seleccionar Distancia</label>
              <select
                onChange={handleSelectDistancia}
                value={formulario.idDistancia || ""}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={cargando.distancias || cargando.seleccionando}
              >
                <option value="">Seleccione una distancia</option>
                {distancias.map(distancia => (
                  <option key={distancia.idDistancia} value={distancia.idDistancia}>
                    {distancia.ruta} - {distancia.estacionInicio} a {distancia.estacionFin} ({distancia.recorrido} km)
                  </option>
                ))}
              </select>
              {(cargando.distancias || cargando.seleccionando) && (
                <p className="text-sm text-gray-500">
                  {cargando.seleccionando ? "Cargando datos de la distancia..." : "Cargando distancias..."}
                </p>
              )}
            </div>

            {/* Selector de Ruta */}
            <div>
              <label className="block text-sm font-medium">Ruta</label>
              <select
                name="Ruta"
                value={formulario.Ruta}
                onChange={handleChangeRuta}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={cargando.rutas || !formulario.idDistancia || cargando.seleccionando}
              >
                <option value="">Seleccione ruta</option>
                {rutas.map(ruta => (
                  <option key={ruta.idRuta} value={ruta.idRuta}>
                    {ruta.nombre}
                  </option>
                ))}
              </select>
              {cargando.rutas && <p className="text-sm text-gray-500">Cargando rutas...</p>}
            </div>

            {/* Selector de Estación Inicio */}
            <div>
              <label className="block text-sm font-medium">Estación Inicio</label>
              <select
                name="EstacionInicio"
                value={formulario.EstacionInicio}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={cargando.estaciones || !formulario.Ruta || cargando.seleccionando}
              >
                <option value="">Seleccione estación</option>
                {estaciones.map(estacion => (
                  <option key={estacion.idEstacion} value={estacion.idEstacion}>
                    {estacion.nombre}
                  </option>
                ))}
              </select>
              {cargando.estaciones && <p className="text-sm text-gray-500">Cargando estaciones...</p>}
            </div>

            {/* Selector de Estación Fin */}
            <div>
              <label className="block text-sm font-medium">Estación Fin</label>
              <select
                name="EstacionFin"
                value={formulario.EstacionFin}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={cargando.estaciones || !formulario.Ruta || cargando.seleccionando}
              >
                <option value="">Seleccione estación</option>
                {estaciones.map(estacion => (
                  <option key={estacion.idEstacion} value={estacion.idEstacion}>
                    {estacion.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Recorrido */}
            <div>
              <label className="block text-sm font-medium">Recorrido (km)</label>
              <input
                type="text"
                name="Recorrido"
                value={formulario.Recorrido}
                onChange={handleRecorridoChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={!formulario.idDistancia || cargando.seleccionando}
                placeholder="Ingrese distancia en kilometros"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!formulario.idDistancia || cargando.general || cargando.seleccionando}
              >
                {cargando.general ? "Actualizando..." : 
                 cargando.seleccionando ? "Cargando datos..." : "Actualizar Distancia"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado de operación"
      >
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}