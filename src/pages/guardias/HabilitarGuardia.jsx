import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function HabilitarGuardia() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    CUI: "", // CUI obligatorio
  });

  const [guardiasNoDisponibles, setGuardiasNoDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Obtener guardias no disponibles al cargar el componente
  useEffect(() => {
    const obtenerGuardiasNoDisponibles = async () => {
      try {
        setCargando(true);
        const res = await api.post("/Guardias/GuardiasNoDispo", {});
        setGuardiasNoDisponibles(res.data || []);
      } catch (error) {
        console.error("Error al obtener guardias no disponibles:", error);
        setModalMessage("❌ Error al cargar la lista de guardias inhabilitados");
        setModalOpen(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerGuardiasNoDisponibles();
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
      const res = await api.post("/Guardias/HabilitarGuardia", formData);
      
      if (res.status === 200) {
        setModalMessage("✅ El guardia ha sido habilitado correctamente.");
        // Actualizar la lista después de habilitar
        const updatedList = await api.post("/Guardias/GuardiasNoDispo", {});
        setGuardiasNoDisponibles(updatedList.data || []);
      } else {
        setModalMessage("❌ No se pudo habilitar el guardia.");
      }
      
      setModalOpen(true);
      setFormData({ CUI: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al habilitar el guardia:", error);
      let errorMsg = "❌ Error al habilitar el guardia.";
      if (error.response && error.response.data && typeof error.response.data === "string") {
        errorMsg = `❌ ${error.response.data}`;
      } else if (error.response && error.response.data?.mensaje) {
        errorMsg = `❌ ${error.response.data.mensaje}`;
      }
      setModalMessage(errorMsg);
      setModalOpen(true);
    } finally {
      setCargando(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
        <Button onClick={() => navigate("/app/guardias")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccione el Guardia a Habilitar *
              </label>
              <select
                name="CUI"
                value={formData.CUI}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]"
                disabled={cargando}
              >
                <option value="">Seleccione un guardia</option>
                {guardiasNoDisponibles.map((guardia) => (
                  <option key={guardia.cuiGuardia} value={guardia.cuiGuardia}>
                    {guardia.cuiGuardia} - {guardia.nombre}
                  </option>
                ))}
              </select>
              {cargando && (
                <p className="text-sm text-gray-500">Cargando guardias inhabilitados...</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={cargando}>
                {cargando ? "Habilitando..." : "Habilitar Guardia"}
              </Button>
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
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}