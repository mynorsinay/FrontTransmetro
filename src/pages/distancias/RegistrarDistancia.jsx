import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../../services/api";
import Modal from "../../components/ui/Modal";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";

export default function RegistrarDistancia() {
  const navigate = useNavigate(); 

  const [formulario, setFormulario] = useState({
    Ruta: "",
    EstacionInicio: "",
    EstacionFin: "",
    Recorrido: ""
  });

  const [rutas, setRutas] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [cargandoRutas, setCargandoRutas] = useState(false);
  const [cargandoEstaciones, setCargandoEstaciones] = useState(false);

  // Cargar rutas al montar el componente
  useEffect(() => {
    const cargarRutas = async () => {
      setCargandoRutas(true);
      try {
        const res = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
        setRutas(res.data);
      } catch (error) {
        console.error("Error al cargar rutas:", error);
        setModalMessage("❌ Error al cargar las rutas disponibles");
        setModalOpen(true);
      } finally {
        setCargandoRutas(false);
      }
    };
    
    cargarRutas();
  }, []);

  // Cargar estaciones cuando se selecciona una ruta
  useEffect(() => {
    const cargarEstaciones = async () => {
      if (formulario.Ruta) {
        setCargandoEstaciones(true);
        try {
          const res = await api.post("/Estaciones/ConsultarEstaciones", {
            idRuta: parseInt(formulario.Ruta)
          });
          setEstaciones(res.data);
          // Resetear las estaciones seleccionadas al cambiar de ruta
          setFormulario(prev => ({
            ...prev,
            EstacionInicio: "",
            EstacionFin: ""
          }));
        } catch (error) {
          console.error("Error al cargar estaciones:", error);
          setModalMessage("❌ Error al cargar las estaciones de esta ruta");
          setModalOpen(true);
        } finally {
          setCargandoEstaciones(false);
        }
      }
    };

    cargarEstaciones();
  }, [formulario.Ruta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  // Validar que solo se ingresen números en el campo Recorrido
  const handleRecorridoChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setFormulario({ ...formulario, Recorrido: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las estaciones de inicio y fin sean diferentes
    if (formulario.EstacionInicio === formulario.EstacionFin) {
      setModalMessage("❌ Las estaciones de inicio y fin deben ser diferentes");
      setModalOpen(true);
      return;
    }

    try {
      const res = await api.post("/Distancias/guardarDistancias", formulario);

      if (res.status === 200) {
        setModalMessage("✅ Distancia registrada exitosamente.");
        setModalOpen(true);
        setFormulario({ 
          Ruta: "", 
          EstacionInicio: "", 
          EstacionFin: "", 
          Recorrido: "" 
        });
      } else {       
        let errorMsg = " ❌ No se pudo registrar la distancia.";
        if (error.response && error.response.data && typeof error.response.data === "string") {
          errorMsg = `❌ ${error.response.data}`;
        } else if (error.response && error.response.data?.mensaje) {
          errorMsg = `❌ ${error.response.data.mensaje}`;
        }
        setModalMessage(errorMsg);
        setModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      setModalMessage("⚠️ Error al conectar con el servidor.");
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Registrar Distancia</h2>

      <Header titulo="Registrar Distancia" fechaHora={new Date()} />
      
      <div className="mb-4">
        <Button onClick={() => navigate("/distancias")}>⬅️ Regresar</Button>
      </div>

      <Card className="border border-[#01ff09]/50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Ruta */}
            <div>
              <label className="block text-sm font-medium">Ruta</label>
              <select
                name="Ruta"
                value={formulario.Ruta}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={cargandoRutas}
              >
                <option value="">Seleccione una ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.idRuta} value={ruta.idRuta}>
                    {ruta.nombre}
                  </option>
                ))}
              </select>
              {cargandoRutas && <p className="text-sm text-gray-500">Cargando rutas...</p>}
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
                disabled={!formulario.Ruta || cargandoEstaciones}
              >
                <option value="">Seleccione estación de inicio</option>
                {estaciones.map((estacion) => (
                  <option key={estacion.idEstacion} value={estacion.idEstacion}>
                    {estacion.nombre}
                  </option>
                ))}
              </select>
              {cargandoEstaciones && <p className="text-sm text-gray-500">Cargando estaciones...</p>}
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
                disabled={!formulario.Ruta || cargandoEstaciones}
              >
                <option value="">Seleccione estación de fin</option>
                {estaciones.map((estacion) => (
                  <option key={estacion.idEstacion} value={estacion.idEstacion}>
                    {estacion.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Input de Recorrido (solo números) */}
            <div>
              <label className="block text-sm font-medium">Recorrido (km)</label>
              <input
                type="text"
                name="Recorrido"
                value={formulario.Recorrido}
                onChange={handleRecorridoChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="Ingrese la distancia en kilometros"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Registrar Distancia</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado de la Operación"
      >
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}