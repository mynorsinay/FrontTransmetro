import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 

export default function EliminarGuardia() {
  const [cui, setCui] = useState(""); // Guardar el CUI del guardia a eliminar
  const [modalOpen, setModalOpen] = useState(false); // Controlar la apertura del modal
  const [modalMessage, setModalMessage] = useState(""); // Mensaje que se mostrará en el modal

  const handleChange = (e) => {
    const { value } = e.target;
    setCui(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/Guardias/EliminarGuardias", { CUI: cui });
      
      // Mostrar el mensaje según la respuesta del backend
      if (res.status === 200) {
        setModalMessage("✅ Guardia eliminado exitosamente.");
      } else {
        setModalMessage("❌ No se pudo eliminar el guardia.");
      }
      setModalOpen(true); // Mostrar el modal con el mensaje
      setCui(""); // Limpiar el campo CUI
    } catch (err) {
      console.error("Error al eliminar el guardia:", err);
      setModalMessage("⚠️ Error al conectar con el servidor.");
      setModalOpen(true); // Mostrar el modal de error
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Eliminar Guardia" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CUI del Guardia"
              name="CUI"
              value={cui}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Eliminar Guardia</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Resultado de la Eliminación">
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}
