import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function HabilitarBuses() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Placa: "", // Placa del bus a habilitar
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
      setFormData({ Placa: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al habilitar el bus:", error);
      setModalMessage("❌ Error al habilitar el bus.");
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    window.location.reload(); // Actualizar la página al cerrar el modal
  };

  return (
    <div className="p-6">
      {/* Botón para regresar */}
      <button
        onClick={() => navigate("/buses")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Habilitar Bus" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Placa del Bus"
              name="Placa"
              value={formData.Placa}
              onChange={handleChange}
              placeholder="Ingrese la placa del bus a habilitar"
            />
            <div className="flex justify-end">
              <Button type="submit">Habilitar Bus</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
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