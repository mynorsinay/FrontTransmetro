import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";

export default function ActualizarEstacion() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idEstacion: "",
    idRuta: 1,
    idHorarioES: 3,
    idHorarioFDS: 1,
    nombre: "",
    direccion: "",
  });

  const [rutas, setRutas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const obtenerRutas = async () => {
    try {
      const res = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
      setRutas(res.data);
    } catch (error) {
      console.error("Error al obtener rutas", error);
    }
  };

  const obtenerHorarios = async () => {
    try {
      const res = await api.post("/Horarios/ConsultarHorarios", {});
      setHorarios(res.data);
    } catch (error) {
      console.error("Error al obtener horarios", error);
    }
  };

  const obtenerEstaciones = async () => {
    try {
      const res = await api.post("/Estaciones/ConsultarEstaciones", {});
      setEstaciones(res.data);
    } catch (error) {
      console.error("Error al obtener estaciones", error);
    }
  };

  useEffect(() => {
    obtenerRutas();
    obtenerHorarios();
    obtenerEstaciones();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "idEstacion") {
      const estacionSeleccionada = estaciones.find(
        (est) => est.idEstacion.toString() === value
      );

      if (estacionSeleccionada) {
        setFormData({
          idEstacion: value,
          idRuta: estacionSeleccionada.idRuta || 1,
          idHorarioES: estacionSeleccionada.idHorarioES || 3,
          idHorarioFDS: estacionSeleccionada.idHorarioFDS || 1,
          nombre: estacionSeleccionada.nombre || "",
          direccion: estacionSeleccionada.direccion || "",
        });
      } else {
        setFormData({
          idEstacion: "",
          idRuta: 1,
          idHorarioES: 3,
          idHorarioFDS: 1,
          nombre: "",
          direccion: "",
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        idEstacion: Number(formData.idEstacion),
        idRuta: Number(formData.idRuta),
        idHorarioES: Number(formData.idHorarioES),
        idHorarioFDS: Number(formData.idHorarioFDS),
      };

      const res = await api.post("/Estaciones/ActualizarEstacion", payload);
      if (res.status === 200) {
        setModalMessage("✅ Estación actualizada correctamente.");
      } else {       
        let errorMsg = "❌ No se pudo actualizar la estación.";
        if (error.response && error.response.data && typeof error.response.data === "string") {
          errorMsg = `❌ ${error.response.data}`;
        } else if (error.response && error.response.data?.mensaje) {
          errorMsg = `❌ ${error.response.data.mensaje}`;
        }
  setModalMessage(errorMsg);
      }
      setModalOpen(true);
      setFormData({
        idEstacion: "",
        idRuta: 1,
        idHorarioES: 3,
        idHorarioFDS: 1,
        nombre: "",
        direccion: "",
      });
    } catch (error) {
      console.error("Error al actualizar la estación", error);
      console.log("Respuesta del servidor:", error.response?.data);
      setModalMessage("⚠️ Error al conectar con el servidor.");
      setModalOpen(true);
    }
  };

  // Aquí el handler para cerrar modal y refrescar la página
  const handleCloseModal = () => {
    setModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Actualizar Estación</h2>

    <Header titulo="Actualizar Estación" fechaHora={new Date()} /> 

      <div className="mb-4">
        <Button onClick={() => navigate("/estaciones")}>⬅️ Regresar</Button>
      </div>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Seleccione la Estación a Actualizar</h3>
          <select
            name="idEstacion"
            value={formData.idEstacion}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Seleccione una estación</option>
            {estaciones.map((estacion) => (
              <option key={estacion.idEstacion} value={estacion.idEstacion}>
                {estacion.nombre}
              </option>
            ))}
          </select>

          {formData.idEstacion && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de la Estación"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />

              <Input
                label="Dirección de la Estación"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-medium">Ruta</label>
                <select
                  name="idRuta"
                  value={formData.idRuta}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {rutas.map((ruta) => (
                    <option key={ruta.idRuta} value={ruta.idRuta}>
                      {ruta.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Horario Estación</label>
                  <select
                    name="idHorarioES"
                    value={formData.idHorarioES}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {horarios.map((horario) => (
                      <option key={horario.idHorario} value={horario.idHorario}>
                        {horario.horario}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Horario Fin de Semana</label>
                  <select
                    name="idHorarioFDS"
                    value={formData.idHorarioFDS}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {horarios.map((horario) => (
                      <option key={horario.idHorario} value={horario.idHorario}>
                        {horario.horario}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Actualizar Estación</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Resultado de la Actualización"
      >
        <p>{modalMessage}</p>
        <Button onClick={handleCloseModal}>Cerrar</Button>
      </Modal>
    </div>
  );
}
