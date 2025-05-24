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
    // Cargar las placas disponibles al montar
    const fetchBusesNoDisponibles = async () => {
      try {
        const res = await api.post("/Buses/BusesDisponibles");
        setBuses(res.data || []);
      } catch (error) {
        console.error("Error al cargar los buses no disponibles:", error);
        setModalMessage("❌ Error al cargar los buses no disponibles.");
        setModalOpen(true);
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
      const res = await api.post("/Buses/DeshabilitarBuses", formData);
      console.log("Bus deshabilitado: ", res.data);

      setModalMessage("✅ El bus ha sido deshabilitado correctamente.");
      setModalOpen(true);
      setFormData({ Placa: "" });
    } catch (error) {
      console.error("Error al deshabilitar el bus:", error);
      setModalMessage("❌ Error al deshabilitar el bus.");
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    window.location.reload(); // o puedes volver a consultar los buses disponibles
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/app/buses")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      <Header titulo="Deshabilitar Bus" fechaHora={new Date()} />

      <Card>
        <CardContent>
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
              <Button type="submit">Deshabilitar Bus</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        title="Resultado de la Deshabilitación"
      >
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}
