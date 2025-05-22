import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";

export default function EliminarUsuarios() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreUsuario: "",
  });
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Obtener usuarios disponibles al cargar el componente
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        setCargando(true);
        const res = await api.post("/Usuarios/UsuariosDispo", {});
        setUsuariosDisponibles(res.data || []);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setModalMessage("❌ Error al cargar la lista de usuarios");
        setModalOpen(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombreUsuario) {
      setModalMessage("⚠️ Por favor seleccione un usuario de la lista");
      setModalOpen(true);
      return;
    }

    // Mostrar modal de confirmación en lugar de alert
    setConfirmModalOpen(true);
  };

  const confirmarEliminacion = async () => {
    setConfirmModalOpen(false);
    
    try {
      const res = await api.post("/Usuarios/EliminarUsuario", formData);
      setModalMessage("✅ El usuario ha sido eliminado correctamente.");
      // Actualizar lista después de eliminar
      const updatedList = await api.post("/Usuarios/UsuariosDispo", {});
      setUsuariosDisponibles(updatedList.data || []);
      setFormData({ nombreUsuario: "" }); // Limpiar selección
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setModalMessage(`⚠️ ${error.response?.data?.message || "Error al eliminar el usuario"}`);
    } finally {
      setModalOpen(true);
    }
  };

  const cancelarEliminacion = () => {
    setConfirmModalOpen(false);
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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccione el Usuario a Eliminar *
              </label>
              <select
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]"
                disabled={cargando}
              >
                <option value="">Seleccione un usuario</option>
                {usuariosDisponibles.map((usuario) => (
                  <option key={usuario.usuario} value={usuario.usuario}>
                    {usuario.usuario}
                  </option>
                ))}
              </select>
              {cargando && (
                <p className="text-sm text-gray-500">Cargando usuarios disponibles...</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={!formData.nombreUsuario || cargando}>
                Eliminar Usuario
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <Modal 
        isOpen={confirmModalOpen} 
        onClose={cancelarEliminacion}
        title="Confirmar Eliminación"
      >
        <p className="mb-4">¿Estás seguro de eliminar el usuario "{formData.nombreUsuario}"?</p>
        <div className="flex justify-end space-x-2">
          <Button onClick={cancelarEliminacion} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmarEliminacion} variant="danger">
            Eliminar
          </Button>
        </div>
      </Modal>

      {/* Modal de resultado */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Resultado de Eliminación"
      >
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}