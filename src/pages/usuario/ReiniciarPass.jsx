import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { Link } from "react-router-dom"; // Importa Link para el botón de volver

export default function ReiniciarPass() {
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

    try {
      const res = await api.post("/Usuarios/ReinicioPass", formData);
      console.log("Reinicio de contraseña exitoso: ", res.data);
      setModalMessage("La contraseña ha sido reiniciada exitosamente.");
      setModalOpen(true);
    } catch (error) {
      console.error("Error al reiniciar la contraseña:", error);
      setModalMessage("Error al reiniciar la contraseña. Verifique su nombre de usuario.");
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-6">
      <div className="w-full max-w-md">
        <Header titulo="🔒 Reiniciar Contraseña" />

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de Usuario"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                placeholder="Ingrese su nombre de usuario"
              />

              <div className="flex justify-end">
                <Button type="submit">Reiniciar Contraseña</Button>
              </div>

              {/* Enlace para volver al Login */}
              <div className="text-center pt-4 border-t border-gray-200">
                <Link 
                  to="/login" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Modal de resultados */}
        <Modal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          title="Resultado del Reinicio"
        >
          <p className="mb-4">{modalMessage}</p>
          <div className="flex justify-end">
            <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}