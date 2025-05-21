import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function DeshabilitarBuses() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Placa: "", // Placa del bus a deshabilitar
  });

  const [buses, setBuses] = useState([]); // Lista de buses no disponibles
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchBusesNoDisponibles = async () => {
      try {
        const res = await api.post("/Buses/BusesNoDisponibles");
        const data = res.data || [];

        // Solo actualiza si hay datos
        if (Array.isArray(data) && data.length > 0) {
          setBuses(data);
        }
      } catch (error) {
        console.error("Error al cargar los buses no disponibles:", error);
        // Si ocurre un error en el fetch, puedes decidir ignorarlo por completo
        // o mostrar un mensaje de consola como arriba.
      }
    };

    fetchBusesNoDisponibles();
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

    try {
      const res = await api.post("/Buses/HabilitarBuses", formData);
      console.log("Bus habilitado: ", res.data);

      setModalMessage("✅ El bus ha sido habilitado correctamente.");
      setModalOpen(true);
      setFormData({ Placa: "" });
    } catch (error) {
      console.error("Error al habilitar el bus:", error);
      setModalMessage("❌ Error al habilitar el bus.");
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/buses")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      <Header titulo="Habilitar Bus" fechaHora={new Date()} />

      <Card>
        <CardContent>
          {buses.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="Placa" className="block font-medium mb-1">
                  Seleccione la placa del bus
                </label>
                <select
                  id="Placa"
                  name="Placa"
                  value={formData.Placa}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">-- Seleccione una placa --</option>
                  {buses.map((bus, idx) => (
                    <option key={idx} value={bus.placa}>
                      {bus.placa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Habilitar Bus</Button>
              </div>
            </form>
          ) : (
            <p className="text-gray-500">No hay buses para habilitar.</p>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Resultado de la Habilitación"
      >
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}
