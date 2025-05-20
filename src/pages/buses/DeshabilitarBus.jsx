import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function DeshabilitarBuses() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Placa: "", // Placa del bus a deshabilitar
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
      // Realizar la solicitud a la API para deshabilitar el bus
      const res = await api.post("/Buses/DeshabilitarBuses", formData);
      console.log("Bus deshabilitado: ", res.data); // Mostrar la respuesta del backend

      // Si la deshabilitación es exitosa, mostramos el modal
      setModalMessage("✅ El bus ha sido deshabilitado correctamente.");
      setModalOpen(true);
      setFormData({ Placa: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al deshabilitar el bus:", error);
      setModalMessage("❌ Error al deshabilitar el bus.");
      setModalOpen(true); // Mostrar modal de error
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
      <Header titulo="Deshabilitar Bus" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Placa del Bus"
              name="Placa"
              value={formData.Placa}
              onChange={handleChange}
              placeholder="Ingrese la placa del bus a deshabilitar"
            />
            <div className="flex justify-end">
              <Button type="submit">Deshabilitar Bus</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
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