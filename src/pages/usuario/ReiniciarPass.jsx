import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 

export default function ReiniciarPass() {
  const [formData, setFormData] = useState({
    nombreUsuario: "", // Nombre de usuario para reiniciar la contraseña
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
      // Realizar la solicitud para reiniciar la contraseña
      const res = await api.post("/Usuarios/ReinicioPass", formData);
      console.log("Reinicio de contraseña exitoso: ", res.data); // Mostrar la respuesta del backend

      // Si el reinicio de contraseña es exitoso, mostramos el modal
      setModalMessage("La contraseña ha sido reiniciada exitosamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al reiniciar la contraseña:", error);
      setModalMessage("Error al reiniciar la contraseña.");
      setModalOpen(true); // Mostrar modal de error
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Reiniciar Contraseña" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
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
              <Button type="submit">Reiniciar Contraseña</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Resultado del Reinicio de Contraseña">
        <p>{modalMessage}</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}
