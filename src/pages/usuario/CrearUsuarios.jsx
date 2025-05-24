import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function CrearUsuarios() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    idEstado: 1,
    idRol: 1,
    nombreUsuario: "",
    contrasena: "",
    confirmarContrasena: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    telefono: "",
  });

  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones en tiempo real
    if (["primerNombre", "segundoNombre", "primerApellido", "segundoApellido"].includes(name)) {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }
    
    if (name === "telefono") {
      // Solo permite números y máximo 8 dígitos
      if (!/^\d{0,8}$/.test(value)) return;
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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // Validar campos obligatorios
    if (!formData.nombreUsuario.trim()) newErrors.nombreUsuario = "Este campo es obligatorio";
    if (!formData.contrasena) newErrors.contrasena = "Este campo es obligatorio";
    if (!formData.confirmarContrasena) newErrors.confirmarContrasena = "Este campo es obligatorio";
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

    // Validar contraseña
    if (formData.contrasena && !passwordRegex.test(formData.contrasena)) {
      newErrors.contrasena = "La contraseña debe tener mínimo 8 caracteres, incluyendo letras, números y caracteres especiales";
    }

    // Validar coincidencia de contraseñas
    if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
    }

    // Validar teléfono (exactamente 8 números)
    if (formData.telefono && !/^\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "Debe tener exactamente 8 dígitos numéricos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await api.post("/Usuarios/CrearUsuario", formData);
      console.log("Usuario creado: ", res.data);
      setModalOpen(true);
      // Limpiar formulario después de éxito
      setFormData({
        idEstado: 1,
        idRol: 1,
        nombreUsuario: "",
        contrasena: "",
        confirmarContrasena: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        email: "",
        telefono: "",
      });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      setModalOpen(true);
      setErrors({ submitError: "Error al crear el usuario. Por favor intente nuevamente." });
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
      {/* Header */}
      <Header titulo="Crear Usuario" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/app/usuarios")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Nombre de Usuario *"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                error={errors.nombreUsuario}
              />
              {errors.nombreUsuario && <p className="text-red-500 text-sm mt-1">{errors.nombreUsuario}</p>}
            </div>

            <div className="relative">
              <Input
                label="Contraseña *"
                name="contrasena"
                type={showPassword ? "text" : "password"}
                value={formData.contrasena}
                onChange={handleChange}
                error={errors.contrasena}              
              />
              <button
                type="button"
                className="absolute right-3 top-3/4 transform -translate-y-3/4 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              {errors.contrasena && <p className="text-red-500 text-sm mt-1">{errors.contrasena}</p>}
            </div>

            <div className="relative">
              <Input
                label="Confirmar Contraseña *"
                name="confirmarContrasena"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmarContrasena}
                onChange={handleChange}
                error={errors.confirmarContrasena}              
              />
              <button
                type="button"
                className="absolute right-3 top-3/4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
              {errors.confirmarContrasena && <p className="text-red-500 text-sm mt-1">{errors.confirmarContrasena}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Primer Nombre *"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  error={errors.primerNombre}
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
                maxLength="8"               
              />
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
            </div>

            {errors.submitError && (
              <div className="text-red-500 text-sm mb-4">{errors.submitError}</div>
            )}

            <div className="flex justify-end">
              <Button type="submit">Registrar Usuario</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={errors.submitError ? "Error" : "¡Usuario Registrado!"}
      >
        <p>{errors.submitError || "El usuario ha sido creado correctamente."}</p>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => {
            setModalOpen(false);
            if (!errors.submitError) {
              navigate("/usuarios");
            }
          }}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  );
}