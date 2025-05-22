import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function ActualizarUsuarios() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    telefono: "",
  });

  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [modalOpen, setModalOpen] = useState({
    isOpen: false,
    isSuccess: false
  });
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formEnabled, setFormEnabled] = useState(false);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

  // Obtener usuarios disponibles al cargar el componente
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        setCargandoUsuarios(true);
        const res = await api.post("/Usuarios/UsuariosDispo", {});
        setUsuariosDisponibles(res.data || []);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setModalMessage("❌ Error al cargar la lista de usuarios");
        setModalOpen({ isOpen: true, isSuccess: false });
      } finally {
        setCargandoUsuarios(false);
      }
    };

    obtenerUsuarios();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    
    // Si es el select de nombreUsuario
    if (name === "nombreUsuario") {
      setFormData(prev => ({ ...prev, nombreUsuario: value }));
      
      if (value) {
        // Consultar usuario si se selecciona uno
        await consultarUsuario(value);
      } else {
        // Limpiar formulario si se selecciona "Seleccione un usuario"
        limpiarFormulario();
      }
      return;
    }
    
    // Validaciones en tiempo real para otros campos
    if (["primerNombre", "segundoNombre", "primerApellido", "segundoApellido"].includes(name)) {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }
    
    if (name === "telefono") {
      if (!/^\d*$/.test(value)) return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error si se corrige
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombreUsuario: "",
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      email: "",
      telefono: "",
    });
    setErrors({});
    setFormEnabled(false);
  };

  const consultarUsuario = async (nombreUsuario) => {
    try {
      const res = await api.post("/Usuarios/ConsultarUsuarios", { 
        nombreUsuario 
      });
      
      if (res.data && res.data.length > 0) {
        const usuario = res.data[0];
        setFormData({
          nombreUsuario: usuario.nombreUsuario,
          primerNombre: usuario.primerNombre || "",
          segundoNombre: usuario.segundoNombre || "",
          primerApellido: usuario.primerApellido || "",
          segundoApellido: usuario.segundoApellido || "",
          email: usuario.email || "",
          telefono: usuario.telefono || ""
        });
        setFormEnabled(true);
      } else {
        setModalMessage("No se encontró información para el usuario seleccionado");
        setModalOpen({ isOpen: true, isSuccess: false });
        setFormEnabled(false);
      }
    } catch (error) {
      console.error("Error al consultar el usuario:", error);
      setModalMessage(`Error al consultar el usuario: ${error.response?.data?.message || error.message}`);
      setModalOpen({ isOpen: true, isSuccess: false });
      setFormEnabled(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // Validar campos obligatorios
    if (!formData.nombreUsuario.trim()) newErrors.nombreUsuario = "Este campo es obligatorio";
    if (!formData.primerNombre.trim()) newErrors.primerNombre = "Este campo es obligatorio";
    if (!formData.primerApellido.trim()) newErrors.primerApellido = "Este campo es obligatorio";
    if (!formData.email.trim()) newErrors.email = "Este campo es obligatorio";
    if (!formData.telefono.trim()) newErrors.telefono = "Este campo es obligatorio";

    // Validar formato de email
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido";
    }

    // Validar formato de nombres
    if (formData.primerNombre && !nameRegex.test(formData.primerNombre)) {
      newErrors.primerNombre = "Solo se permiten letras";
    }
    if (formData.segundoNombre && !nameRegex.test(formData.segundoNombre)) {
      newErrors.segundoNombre = "Solo se permiten letras";
    }
    if (formData.primerApellido && !nameRegex.test(formData.primerApellido)) {
      newErrors.primerApellido = "Solo se permiten letras";
    }
    if (formData.segundoApellido && !nameRegex.test(formData.segundoApellido)) {
      newErrors.segundoApellido = "Solo se permiten letras";
    }

    // Validar teléfono (solo números)
    if (formData.telefono && !/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = "Solo se permiten números";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setModalMessage("⚠️ Por favor corrija los errores en el formulario");
      setModalOpen({ isOpen: true, isSuccess: false });
      return;
    }

    try {
      const res = await api.post("/Usuarios/ActualizarUsuario", formData);
      setModalMessage("✅ El usuario ha sido actualizado correctamente.");
      setModalOpen({ isOpen: true, isSuccess: true });
      
      // Actualizar lista de usuarios después de actualizar
      const updatedList = await api.post("/Usuarios/UsuariosDispo", {});
      setUsuariosDisponibles(updatedList.data || []);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setModalMessage(`⚠️ ${error.response?.data?.message || "Error al actualizar el usuario"}`);
      setModalOpen({ isOpen: true, isSuccess: false });
    }
  };

  const handleCloseModal = () => {
    setModalOpen({ isOpen: false, isSuccess: false });
    if (modalOpen.isSuccess) {
      navigate("/usuarios");
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Actualizar Usuario" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/usuarios")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccione el Usuario a Actualizar *
              </label>
              <select
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.nombreUsuario ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#01ff09] focus:border-[#01ff09]`}
                disabled={cargandoUsuarios}
              >
                <option value="">Seleccione un usuario</option>
                {usuariosDisponibles.map((usuario) => (
                  <option key={usuario.usuario} value={usuario.usuario}>
                    {usuario.usuario}
                  </option>
                ))}
              </select>
              {errors.nombreUsuario && <p className="text-red-500 text-sm mt-1">{errors.nombreUsuario}</p>}
              {cargandoUsuarios && <p className="text-sm text-gray-500">Cargando usuarios...</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Primer Nombre *"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  error={errors.primerNombre}
                  disabled={!formEnabled}
                />
                {errors.primerNombre && <p className="text-red-500 text-sm mt-1">{errors.primerNombre}</p>}
              </div>
              <div>
                <Input
                  label="Segundo Nombre"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleChange}
                  error={errors.segundoNombre}
                  disabled={!formEnabled}
                />
                {errors.segundoNombre && <p className="text-red-500 text-sm mt-1">{errors.segundoNombre}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Primer Apellido *"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  error={errors.primerApellido}
                  disabled={!formEnabled}
                />
                {errors.primerApellido && <p className="text-red-500 text-sm mt-1">{errors.primerApellido}</p>}
              </div>
              <div>
                <Input
                  label="Segundo Apellido"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                  error={errors.segundoApellido}
                  disabled={!formEnabled}
                />
                {errors.segundoApellido && <p className="text-red-500 text-sm mt-1">{errors.segundoApellido}</p>}
              </div>
            </div>

            <div>
              <Input
                label="Correo Electrónico *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={!formEnabled}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Input
                label="Teléfono *"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                error={errors.telefono}
                disabled={!formEnabled}
                maxLength="8" 
              />
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!formEnabled}
              >
                Actualizar Usuario
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <Modal
        isOpen={modalOpen.isOpen}
        onClose={handleCloseModal}
        title={modalOpen.isSuccess ? "¡Usuario Actualizado!" : "Resultado"}
      >
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}