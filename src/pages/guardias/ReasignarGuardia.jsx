import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function ReasignarGuardia() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idHorario: "",
    idEstacion: "",
    cui: "",
  });

  const [estaciones, setEstaciones] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [assignedGuard, setAssignedGuard] = useState(null);
  const [cargandoEstaciones, setCargandoEstaciones] = useState(false);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  // Cargar estaciones y horarios al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      setCargandoEstaciones(true);
      setCargandoHorarios(true);
      
      try {
        // Cargar estaciones
        const resEstaciones = await api.post("/Estaciones/ConsultarEstaciones", {});
        setEstaciones(resEstaciones.data || []);

        // Cargar horarios
        const resHorarios = await api.post("/Horarios/ConsultarHorarios", {});
        setHorarios(resHorarios.data || []);
        
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setModalMessage("❌ Error al cargar los datos necesarios");
        setModalOpen(true);
      } finally {
        setCargandoEstaciones(false);
        setCargandoHorarios(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar que solo sean números para el CUI y máximo 13 dígitos
    if (name === "cui") {
      if (/^\d{0,13}$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.idHorario || !formData.idEstacion || !formData.cui) {
      setModalMessage("⚠️ Todos los campos son obligatorios para reasignar.");
      setModalOpen(true);
      return;
    }

    if (formData.cui.length !== 13) {
      setModalMessage("⚠️ El CUI debe tener exactamente 13 dígitos.");
      setModalOpen(true);
      return;
    }

    try {
      const res = await api.post("/Guardias/ReasignarGuardia", {
        IdHorario: parseInt(formData.idHorario),
        IdEstacion: parseInt(formData.idEstacion),
        CUI: formData.cui
      });

      if (res.data.guardiaAsignado) {
        setAssignedGuard(res.data.guardiaAsignado);
        setModalMessage("⚠️ La estación está ocupada. El guardia asignado es:");
      } else {
        setAssignedGuard(null);
        setModalMessage("✅ El guardia ha sido reasignado correctamente.");
      }

      setModalOpen(true);
    } catch (error) {
      console.error("Error al reasignar el guardia:", error);
      setModalMessage("⚠️ Error al reasignar el guardia.");
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Recargar la página solo si fue un éxito
    if (modalMessage.includes("✅")) {
      window.location.reload();
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Reasignar Guardia" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/guardias")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector de Estación */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Estación *
              </label>
              <select
                name="idEstacion"
                value={formData.idEstacion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]"
                disabled={cargandoEstaciones}
                required
              >
                <option value="">Seleccione una estación</option>
                {estaciones.map((estacion) => (
                  <option key={estacion.idEstacion} value={estacion.idEstacion}>
                    {estacion.nombre}
                  </option>
                ))}
              </select>
              {cargandoEstaciones && (
                <p className="text-sm text-gray-500">Cargando estaciones...</p>
              )}
            </div>

            {/* Selector de Horario */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Horario *
              </label>
              <select
                name="idHorario"
                value={formData.idHorario}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]"
                disabled={cargandoHorarios}
                required
              >
                <option value="">Seleccione un horario</option>
                {horarios.map((horario) => (
                  <option key={horario.idHorario} value={horario.idHorario}>
                    {horario.horario}
                  </option>
                ))}
              </select>
              {cargandoHorarios && (
                <p className="text-sm text-gray-500">Cargando horarios...</p>
              )}
            </div>

            <Input
              label="CUI del Guardia (13 dígitos) *"
              name="cui"
              value={formData.cui}
              onChange={handleChange}
              maxLength={13}
              required
            />

            <div className="flex justify-end">
              <Button type="submit">Reasignar Guardia</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title="Resultado de la Reasignación"
      >
        <p>{modalMessage}</p>

        {assignedGuard && (
          <div className="mt-4 text-left space-y-2">
            <p><strong>Nombre:</strong> {assignedGuard.primerNombre} {assignedGuard.segundoNombre} {assignedGuard.primerApellido} {assignedGuard.segundoApellido}</p>
            <p><strong>CUI:</strong> {assignedGuard.cui}</p>
            <p><strong>Estación:</strong> {assignedGuard.idEstacion}</p>
            <p><strong>Horario:</strong> {assignedGuard.idHorario}</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}