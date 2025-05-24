import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function MandarAMantenimiento() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    Placa: "",
  });

  const [busesDisponibles, setBusesDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const obtenerBusesParaMantenimiento = async () => {
      try {
        setCargando(true);
        const res = await api.post("/Buses/BusesParaMante", {});
        setBusesDisponibles(res.data || []);
      } catch (error) {
        console.error("Error al obtener buses:", error);
        const errorMsg = error.response?.data?.message || 
                        "Error al cargar la lista de buses";
        setModalMessage(`❌ ${errorMsg}`);
        setModalOpen(true);
      } finally {
        setCargando(false);
      }
    };
    obtenerBusesParaMantenimiento();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Placa) {
      setModalMessage("⚠️ Por favor seleccione un bus de la lista");
      setModalOpen(true);
      return;
    }

    try {
      setCargando(true);
      const res = await api.post("/Buses/MandarBusMantenimiento", formData);
      
      // Verificar respuesta exitosa
      if (res.status === 200) {
        setModalMessage("✅ Bus enviado a mantenimiento correctamente");
        // Actualizar lista
        const updatedList = await api.post("/Buses/BusesParaMante", {});
        setBusesDisponibles(updatedList.data || []);
      } else {
        // Si el endpoint devuelve un mensaje de error en el cuerpo
        const errorMsg = res.data?.message || "Operación no completada";
        setModalMessage(`⚠️ ${errorMsg}`);
      }
      
      setModalOpen(true);
      setFormData({ Placa: "" });
    } catch (error) {
      console.error("Error en la solicitud:", error);
      // Extraer mensaje de error del endpoint si está disponible
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error ||
                      error.response?.data ||
                      error.message ||
                      "Error al procesar la solicitud";
      
      setModalMessage(`⚠️ ${errorMsg}`);
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
      <Header titulo="Mandar Bus a Mantenimiento" fechaHora={new Date()} />

      <div className="mb-4">
        <Button onClick={() => navigate("/app/mantenimientos")}>⬅️ Regresar</Button>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccione el Bus a Enviar a Mantenimiento *
              </label>
              <select
                name="Placa"
                value={formData.Placa}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]"
                disabled={cargando}
              >
                <option value="">Seleccione un bus</option>
                {busesDisponibles.map((bus) => (
                  <option key={bus.placa} value={bus.placa}>
                    {bus.placa} 
                  </option>
                ))}
              </select>
              {cargando && <p className="text-sm text-gray-500">Cargando buses...</p>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={cargando}>
                {cargando ? "Enviando..." : "Mandar a Mantenimiento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title="Resultado">
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}