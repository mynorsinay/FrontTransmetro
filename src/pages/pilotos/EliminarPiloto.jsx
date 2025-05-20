import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function EliminarPiloto() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    CUI: "", 
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación: solo permite números
    if (name === "CUI" && !/^\d*$/.test(value)) {
      return; // No actualiza el estado si no es un número
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/Pilotos/EliminarPilotos", formData);
      console.log("Piloto eliminado: ", res.data);

      setModalMessage("El piloto ha sido eliminado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al eliminar el piloto:", error);
      setModalMessage("Error al eliminar el piloto.");
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
        onClick={() => navigate("/pilotos/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      <Header titulo="Eliminar Piloto" fechaHora={new Date()} />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CUI del Piloto"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
              type="text" // Mantenemos type="text" para mejor control
              inputMode="numeric" // Muestra teclado numérico en dispositivos móviles
              pattern="[0-9]*" // Ayuda en algunos navegadores
            />
            <div className="flex justify-end">
              <Button type="submit">Eliminar Piloto</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Resultado de la Eliminación"
      >
        <p>{modalMessage}</p>
        <Button onClick={handleCloseModal}>Cerrar</Button>
      </Modal>
    </div>
  );
}