import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ReasignarBuses() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    IdRuta: "",
    IdPiloto: "",
    Placa: "",
  });

  const [rutas, setRutas] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [busesDisponibles, setBusesDisponibles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para obtener rutas, pilotos y placas disponibles
  const fetchData = async () => {
    try {
      setLoading(true);

      const resRutas = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
      setRutas(resRutas.data);

      const resPilotos = await api.post("/Pilotos/ConsultarPilotos", {});
      setPilotos(resPilotos.data);

      const resBuses = await api.post("/Buses/BusesDispoAsignacion", {});
      setBusesDisponibles(resBuses.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/Buses/ReasignarBus", formData);
      console.log("Bus reasignado: ", res.data);

      setModalMessage("✅ El bus ha sido reasignado correctamente.");
      setModalOpen(true);
      setFormData({
        IdRuta: "",
        IdPiloto: "",
        Placa: "",
      });
    } catch (error) {
  console.error("Error al reasignar el bus:", error);

  // Extraer mensaje del backend si existe
  let errorMsg = "❌ Error al reasignar el bus.";
  if (error.response && error.response.data && typeof error.response.data === "string") {
    errorMsg = `❌ ${error.response.data}`;
  } else if (error.response && error.response.data?.mensaje) {
    errorMsg = `❌ ${error.response.data.mensaje}`;
  }

  setModalMessage(errorMsg);
  setModalOpen(true);
} finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      IdRuta: "",
      IdPiloto: "",
      Placa: "",
    });
    fetchData(); // Refresca las listas actualizadas
  };

  return (
    <div className="p-6">
      {/* Botón para regresar */}
      <button
        onClick={() => navigate("/app/buses")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Reasignar Bus" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Ruta */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ruta</label>
              <select
                name="IdRuta"
                value={formData.IdRuta}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Seleccione una ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.idRuta} value={ruta.idRuta}>
                    {ruta.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Piloto */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Piloto</label>
              <select
                name="IdPiloto"
                value={formData.IdPiloto}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Seleccione un piloto</option>
                {pilotos.map((piloto) => (
                  <option key={piloto.idPiloto} value={piloto.idPiloto}>
                    {piloto.primerNombre} {piloto.primerApellido} - {piloto.cui}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Placa (en lugar de Input) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Placa del Bus</label>
              <select
                name="Placa"
                value={formData.Placa}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Seleccione una placa</option>
                {busesDisponibles.map((bus) => (
                  <option key={bus.idBus} value={bus.placa}>
                    {bus.placa}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Reasignando..." : "Reasignar Bus"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Resultado de la Reasignación"
      >
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}
