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

  const [modalOpen, setModalOpen] = useState({
    isOpen: false,
    isSuccess: false
  });
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [formEnabled, setFormEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones en tiempo real
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

  const consultarUsuario = async () => {
    if (!formData.nombreUsuario.trim()) {
      setModalMessage("Por favor ingrese un nombre de usuario para consultar");
      setModalOpen({ isOpen: true, isSuccess: false });
      return;
    }

    try {
      const res = await api.post("/Usuarios/ConsultarUsuarios", { 
        nombreUsuario: formData.nombreUsuario 
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
        setModalMessage("Usuario encontrado. Puede editar los campos habilitados.");
        setFormEnabled(true);
      } else {
        setModalMessage("No se encontró ningún usuario con ese nombre");
        setFormEnabled(false);
      }
      setModalOpen({ isOpen: true, isSuccess: false });
    } catch (error) {
      console.error("Error al consultar el usuario:", error);
      setModalMessage("Error al consultar el usuario");
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
      console.log("Usuario actualizado: ", res.data);
      setModalMessage("✅ El usuario ha sido actualizado correctamente.");
      setModalOpen({ isOpen: true, isSuccess: true });
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Nombre de Usuario *"
                  name="nombreUsuario"
                  value={formData.nombreUsuario}
                  onChange={handleChange}
                  error={errors.nombreUsuario}
                />
                {errors.nombreUsuario && <p className="text-red-500 text-sm mt-1">{errors.nombreUsuario}</p>}
              </div>
              <Button 
                type="button" 
                onClick={consultarUsuario}
                className="h-[42px]"
              >
                Consultar
              </Button>
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