import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function EliminarUsuarios() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreUsuario: "",
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

    // Mostrar confirmación antes de eliminar
    const confirmacion = window.confirm(`¿Estás seguro de eliminar el usuario "${formData.nombreUsuario}"?`);

    if (!confirmacion) {
      return; // Si cancela, no hace nada
    }

    try {
      const res = await api.post("/Usuarios/EliminarUsuario", formData);
      setModalMessage("El usuario ha sido eliminado correctamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setModalMessage("Error al eliminar el usuario.");
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <Header titulo="Eliminar Usuario" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/usuarios")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de Usuario"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Eliminar Usuario</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultado */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Resultado de Eliminación">
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}
