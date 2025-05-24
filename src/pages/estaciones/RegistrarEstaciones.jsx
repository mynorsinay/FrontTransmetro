import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";

export default function RegistrarEstacion() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    idRuta: 1,
    idHorarioES: 1,
    idHorarioFDS: 3,
    nombre: "",
    direccion: "",
  });

  const [rutas, setRutas] = useState([]);
  const [horarios, setHorarios] = useState([]);
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

  useEffect(() => {
    obtenerRutas();
    obtenerHorarios();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Estaciones/GuardarEstacion", formData);
      setModalMessage("✅ Estación registrada correctamente.");
      setModalOpen(true);
      setFormData({
        idRuta: 1,
        idHorarioES: 1,
        idHorarioFDS: 3,
        nombre: "",
        direccion: "",
      });
    } catch (error) {
      console.error("Error al guardar la estación", error);     
        let errorMsg = "❌ No se pudo registrar la estación.";
        if (error.response && error.response.data && typeof error.response.data === "string") {
          errorMsg = `❌ ${error.response.data}`;
        } else if (error.response && error.response.data?.mensaje) {
          errorMsg = `❌ ${error.response.data.mensaje}`;
        }
  setModalMessage(errorMsg);
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Registrar Estación</h2>

      <Header titulo="Registrar Estación" fechaHora={new Date()} /> 

      <div className="mb-4">
        <Button onClick={() => navigate("/app/estaciones")}>⬅️ Regresar</Button>
      </div>

      <Card className="border border-[#01ff09]/50 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
        <CardContent>
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
              <Button type="submit">Guardar Estación</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado de la Operación"
      >
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}
