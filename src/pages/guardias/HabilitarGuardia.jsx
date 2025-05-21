import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 

export default function HabilitarGuardia() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    CUI: "", // CUI obligatorio para habilitar un guardia
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar que solo sean números y máximo 13 dígitos
    if (name === "CUI") {
      if (/^\d{0,13}$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.CUI) {
      setModalMessage("⚠️ Por favor ingrese el CUI del guardia a habilitar.");
      setModalOpen(true);
      return;
    }

    if (formData.CUI.length !== 13) {
      setModalMessage("⚠️ El CUI debe tener exactamente 13 dígitos.");
      setModalOpen(true);
      return;
    }

    try {
      const res = await api.post("/Guardias/HabilitarGuardia", formData);
      console.log("Guardia habilitado: ", res.data);
      setModalMessage("✅ El guardia ha sido habilitado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al habilitar el guardia:", error);
        let errorMsg = "❌Error al habilitar el guardia.";
        if (error.response && error.response.data && typeof error.response.data === "string") {
          errorMsg = `❌ ${error.response.data}`;
        } else if (error.response && error.response.data?.mensaje) {
          errorMsg = `❌ ${error.response.data.mensaje}`;
        }
        setModalMessage(errorMsg);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Recargar la página solo si fue un éxito
    if (modalMessage.includes("✅")) {
      window.location.reload();
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Habilitar Guardia" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/guardias")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CUI del Guardia"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
              maxLength={13}
            />
            <div className="flex justify-end">
              <Button type="submit">Habilitar Guardia</Button>
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
        <p>{modalMessage}</p>
        <div className="flex justify-end mt-4">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}