import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function HistorialMantenimientos() {
  const [formData, setFormData] = useState({
    Placa: "", // Placa del bus para buscar el historial
  });

  const [mantenimientos, setMantenimientos] = useState([]);
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
      // Si la Placa está vacía, enviamos un objeto vacío para obtener todos los mantenimientos
      const body = formData.Placa ? { Placa: formData.Placa } : {};
      const res = await api.post("/Buses/HistorialMantenimientos", body);
      setMantenimientos(res.data); // Guardar los datos de los mantenimientos en el estado
      setModalMessage("Historial de mantenimientos obtenido correctamente.");
      setModalOpen(true); // Mostrar el modal con los resultados
    } catch (error) {
      console.error("Error al obtener el historial de mantenimientos:", error);
      setModalMessage("Error al obtener el historial de mantenimientos.");
      setModalOpen(true); // Mostrar modal de error
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Historial de Mantenimiento" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Placa del Bus (opcional)"
              name="Placa"
              value={formData.Placa}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Consultar Historial</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Resultado de la Consulta">
        <p>{modalMessage}</p>
        {mantenimientos.length > 0 ? (
          <div>
            <h3 className="font-semibold mb-2">Historial de Mantenimientos:</h3>
            <ul>
              {mantenimientos.map((mantenimiento, idx) => (
                <li key={idx} className="mb-2">
                  <p><strong>Placa:</strong> {mantenimiento.placa}</p>
                  <p><strong>Fecha Inicio Mantenimiento:</strong> {mantenimiento.fechaInicio}</p>
                  <p><strong>Descripción:</strong> {mantenimiento.fechaFin}</p>
                  <hr className="my-2" />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No se encontraron resultados para la placa proporcionada.</p>
        )}
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}
