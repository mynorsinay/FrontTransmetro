import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function DeshabilitarGuardia() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    CUI: "", // CUI obligatorio
  });

  const [guardiasDisponibles, setGuardiasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Obtener guardias disponibles al cargar el componente
  useEffect(() => {
    const obtenerGuardiasDisponibles = async () => {
      try {
        setCargando(true);
        const res = await api.post("/Guardias/GuardiasDispo", {});
        setGuardiasDisponibles(res.data || []);
      } catch (error) {
        console.error("Error al obtener guardias disponibles:", error);
        setModalMessage("❌ Error al cargar la lista de guardias");
        setModalOpen(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerGuardiasDisponibles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.CUI) {
      setModalMessage("⚠️ Por favor seleccione un guardia de la lista");
      setModalOpen(true);
      return;
    }

    try {
      setCargando(true);
      const res = await api.post("/Guardias/DeshabilitarGuardias", formData);
      
      if (res.status === 200) {
        setModalMessage("✅ El guardia ha sido deshabilitado correctamente.");
        // Actualizar la lista después de deshabilitar
        const updatedList = await api.post("/Guardias/GuardiasDispo", {});
        setGuardiasDisponibles(updatedList.data || []);
      } else {
        setModalMessage("❌ No se pudo deshabilitar el guardia.");
      }
      
      setModalOpen(true);
      setFormData({ CUI: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al deshabilitar el guardia:", error);
      setModalMessage(`⚠️ ${error.response?.data?.message || "Error al deshabilitar el guardia"}`);
      setModalOpen(true);
    } finally {
      setCargando(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Deshabilitar Guardia" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/guardias")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccione el Guardia a Deshabilitar *
              </label>
              <select
                name="CUI"
                value={formData.CUI}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]"
                disabled={cargando}
              >
                <option value="">Seleccione un guardia</option>
                {guardiasDisponibles.map((guardia) => (
                  <option key={guardia.cuiGuardia} value={guardia.cuiGuardia}>
                    {guardia.cuiGuardia} - {guardia.nombre}
                  </option>
                ))}
              </select>
              {cargando && (
                <p className="text-sm text-gray-500">Cargando guardias disponibles...</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={cargando}>
                {cargando ? "Deshabilitando..." : "Deshabilitar Guardia"}
              </Button>
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