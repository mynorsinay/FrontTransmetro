import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function EliminarPiloto() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    CUI: "", 
  });

  const [pilotosDisponibles, setPilotosDisponibles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [cargando, setCargando] = useState(false);

  // Obtener pilotos disponibles al cargar el componente
  useEffect(() => {
    const obtenerPilotosDisponibles = async () => {
      try {
        setCargando(true);
        const res = await api.post("/Pilotos/PilotosNoDispo", {});
        setPilotosDisponibles(res.data || []);
      } catch (error) {
        console.error("Error al obtener pilotos deshabilitados:", error);
        setModalMessage("❌ Error al cargar la lista de pilotos");
        setModalOpen(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerPilotosDisponibles();
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
      setModalMessage("⚠️ Por favor seleccione un piloto de la lista");
      setModalOpen(true);
      return;
    }

    try {
      setCargando(true);
      const res = await api.post("/Pilotos/HabilitarPilotos", formData);
      
      if (res.status === 200) {
        setModalMessage("✅ El piloto ha sido habilitado correctamente.");
        // Actualizar la lista después de eliminar
        const updatedList = await api.post("/Pilotos/PilotosNoDispo", {});
        setPilotosDisponibles(updatedList.data || []);
      } else {
        setModalMessage("❌ No se pudo habilitar el piloto.");
      }
      
      setModalOpen(true);
      setFormData({ CUI: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al habilitar el piloto:", error);
      setModalMessage("⚠️ Error al conectar con el servidor.");
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
      <button
        onClick={() => navigate("/pilotos/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      <Header titulo="Habilitar Piloto" fechaHora={new Date()} />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccione el Piloto a Habilitar *
              </label>
              <select
                name="CUI"
                value={formData.CUI}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]"
                disabled={cargando}
              >
                <option value="">Seleccione un piloto</option>
                {pilotosDisponibles.map((piloto) => (
                  <option key={piloto.cuiPiloto} value={piloto.cuiPiloto}>
                    {piloto.cuiPiloto} - {piloto.nombre}
                  </option>
                ))}
              </select>
              {cargando && (
                <p className="text-sm text-gray-500">Cargando pilotos disponibles...</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={cargando}>
                {cargando ? "Habilitando..." : "Habilitar Piloto"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Resultado de la habilitacion"
      >
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}