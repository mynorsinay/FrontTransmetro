import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function MandarAMantenimiento() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    Placa: "", // Placa del bus a mandar a mantenimiento
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // Mensaje para el modal

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
      const res = await api.post("/Buses/MandarBusMantenimiento", formData);
      console.log("Bus enviado a mantenimiento: ", res.data);
      setModalMessage("✅ El bus ha sido enviado a mantenimiento correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al enviar el bus a mantenimiento:", error);
      setModalMessage("⚠️ Error al enviar el bus a mantenimiento.");
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Mandar Bus a Mantenimiento" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/mantenimientos")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Placa del Bus"
              name="Placa"
              value={formData.Placa}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Mandar a Mantenimiento</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Resultado del Mantenimiento"
      >
        <p>{modalMessage}</p>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}
