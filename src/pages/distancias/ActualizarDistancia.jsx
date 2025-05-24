import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function ActualizarDistancia() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    idDistancia: "",
    idRuta: "",
    idEstacionInicio: "",
    idEstacionFin: "",
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
    guardando: false,
    cargandoDetalle: false
  });

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setCargando(prev => ({...prev, distancias: true, rutas: true}));
        
        // Cargar distancias para el select
        const resDistancias = await api.post("/Distancias/ConsultarDistancias", {});
        setDistancias(resDistancias.data || []);
        
        // Cargar todas las rutas
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

  // Manejar selección de distancia
  const handleSelectDistancia = async (e) => {
    const idDistancia = e.target.value;
    
    if (!idDistancia) {
      resetFormulario();
      return;
    }

    try {
      setCargando(prev => ({...prev, cargandoDetalle: true}));
      setEstaciones([]); // Limpiar estaciones anteriores

      // Consultar el endpoint específico
      const response = await api.post("/Distancias/DistanciasXID", {
        idDistancia: parseInt(idDistancia)
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No se encontraron datos para la distancia seleccionada");
      }

      const distanciaDetalle = response.data[0];

      // Buscar la ruta correspondiente por nombre
      const rutaSeleccionada = rutas.find(r => r.nombre === distanciaDetalle.ruta);
      if (!rutaSeleccionada) {
        throw new Error(`No se encontró la ruta: ${distanciaDetalle.ruta}`);
      }

      // Cargar estaciones para la ruta seleccionada
      const resEstaciones = await api.post("/Estaciones/ConsultarEstaciones", {
        idRuta: parseInt(rutaSeleccionada.idRuta)
      });

      const estacionesCargadas = resEstaciones.data || [];
      setEstaciones(estacionesCargadas);

      // Buscar estaciones por nombre (eliminando duplicados)
      const estacionesUnicas = estacionesCargadas.filter(
        (estacion, index, self) =>
          index === self.findIndex(e => e.nombre === estacion.nombre)
      );

      // Buscar IDs de estaciones
      const estacionInicio = estacionesUnicas.find(e => e.nombre === distanciaDetalle.estacionInicio);
      const estacionFin = estacionesUnicas.find(e => e.nombre === distanciaDetalle.estacionFin);

      if (!estacionInicio || !estacionFin) {
        throw new Error("No se encontraron las estaciones correspondientes");
      }

      // Actualizar formulario
      setFormulario({
        idDistancia: idDistancia,
        idRuta: rutaSeleccionada.idRuta.toString(),
        idEstacionInicio: estacionInicio.idEstacion.toString(),
        idEstacionFin: estacionFin.idEstacion.toString(),
        Recorrido: distanciaDetalle.recorrido || ""
      });

    } catch (error) {
      console.error("Error al cargar detalles:", error);
      setModalMessage(`❌ Error: ${error.message}`);
      setModalOpen(true);
      resetFormulario();
    } finally {
      setCargando(prev => ({...prev, cargandoDetalle: false}));
    }
  };

  const resetFormulario = () => {
    setFormulario({
      idDistancia: "",
      idRuta: "",
      idEstacionInicio: "",
      idEstacionFin: "",
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

    if (formulario.idEstacionInicio === formulario.idEstacionFin) {
      setModalMessage("❌ Las estaciones de inicio y fin deben ser diferentes");
      setModalOpen(true);
      return;
    }

    try {
      setCargando(prev => ({...prev, guardando: true}));
      const res = await api.post("/Distancias/ActualizarDistancia", formulario);

      if (res.status === 200) {
        setModalMessage("✅ Distancia actualizada correctamente");
        setModalOpen(true);
        // Recargar lista de distancias
        const resDistancias = await api.post("/Distancias/ConsultarDistancias", {});
        setDistancias(resDistancias.data || []);
        resetFormulario();
      } else {        
        let errorMsg = "❌ No se pudo actualizar la distancia.";
        if (res.data && typeof res.data === "string") {
          errorMsg = `❌ ${res.data}`;
        } else if (res.data?.mensaje) {
          errorMsg = `❌ ${res.data.mensaje}`;
        }
        setModalMessage(errorMsg);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setModalMessage("⚠️ Error al actualizar la distancia");
      setModalOpen(true);
    } finally {
      setCargando(prev => ({...prev, guardando: false}));
    }
  };

  // Obtener la ruta seleccionada
  const getRutaSeleccionada = () => {
    return rutas.find(r => r.idRuta === parseInt(formulario.idRuta)) || { nombre: "" };
  };

  // Filtrar estaciones únicas por nombre
  const getEstacionesUnicas = () => {
    return estaciones.filter(
      (estacion, index, self) =>
        index === self.findIndex(e => e.nombre === estacion.nombre)
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Actualizar Distancia</h2>

      <Header titulo="Actualizar Distancia" fechaHora={new Date()} />

      <div className="mb-4">
        <Button onClick={() => navigate("/app/distancias")}>⬅️ Regresar</Button>
      </div>

      <Card className="border border-[#01ff09]/50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Distancia */}
            <div>
              <label className="block text-sm font-medium">Seleccionar Distancia</label>
              <select
                onChange={handleSelectDistancia}
                value={formulario.idDistancia}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={cargando.distancias || cargando.cargandoDetalle}
              >
                <option value="">Seleccione una distancia</option>
                {distancias.map(distancia => (
                  <option key={distancia.idDistancia} value={distancia.idDistancia}>
                    {distancia.ruta} - {distancia.estacionInicio} a {distancia.estacionFin} ({distancia.recorrido} km)
                  </option>
                ))}
              </select>
              {cargando.distancias && <p className="text-sm text-gray-500">Cargando distancias...</p>}
            </div>

            {/* Selector de Ruta (solo lectura) */}
            <div>
              <label className="block text-sm font-medium">Ruta</label>
              <select
                className="w-full p-2 border border-gray-300 rounded "
                disabled
              >
                <option value="">{formulario.idRuta ? getRutaSeleccionada().nombre : "Seleccione una distancia primero"}</option>
              </select>
            </div>

            {/* Selector de Estación Inicio */}
            <div>
              <label className="block text-sm font-medium">Estación Inicio</label>
              <select
                name="idEstacionInicio"
                value={formulario.idEstacionInicio}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={!formulario.idRuta || cargando.cargandoDetalle}
              >
                <option value="">Seleccione estación</option>
                {getEstacionesUnicas().map(estacion => (
                  <option key={`inicio-${estacion.idEstacion}`} value={estacion.idEstacion}>
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
                name="idEstacionFin"
                value={formulario.idEstacionFin}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={!formulario.idRuta || cargando.cargandoDetalle}
              >
                <option value="">Seleccione estación</option>
                {getEstacionesUnicas().map(estacion => (
                  <option key={`fin-${estacion.idEstacion}`} value={estacion.idEstacion}>
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
                disabled={!formulario.idDistancia || cargando.cargandoDetalle}
                placeholder="Ingrese distancia en kilometros"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!formulario.idDistancia || cargando.guardando || cargando.cargandoDetalle}
              >
                {cargando.guardando ? "Actualizando..." : 
                 cargando.cargandoDetalle ? "Cargando datos..." : "Actualizar Distancia"}
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