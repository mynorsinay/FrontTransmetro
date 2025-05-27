import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    const [modalMessage, setModalMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (["primerNombre", "segundoNombre", "primerApellido", "segundoApellido"].includes(name)) {
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
        }

        if (name === "telefono") {
            if (!/^\d{0,8}$/.test(value)) return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!formData.nombreUsuario.trim()) newErrors.nombreUsuario = "Este campo es obligatorio";
        if (!formData.contrasena) newErrors.contrasena = "Este campo es obligatorio";
        if (!formData.confirmarContrasena) newErrors.confirmarContrasena = "Este campo es obligatorio";
        if (!formData.primerNombre.trim()) newErrors.primerNombre = "Este campo es obligatorio";
        if (!formData.primerApellido.trim()) newErrors.primerApellido = "Este campo es obligatorio";
        if (!formData.email.trim()) newErrors.email = "Este campo es obligatorio";
        if (!formData.telefono.trim()) newErrors.telefono = "Este campo es obligatorio";

        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Ingrese un correo electrónico válido";
        }

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

        if (formData.contrasena && !passwordRegex.test(formData.contrasena)) {
            newErrors.contrasena = "Mínimo 8 caracteres, incluyendo letras, números y caracteres especiales";
        }

        if (formData.contrasena !== formData.confirmarContrasena) {
            newErrors.confirmarContrasena = "Las contraseñas no coinciden";
        }

        if (formData.telefono && !/^\d{8}$/.test(formData.telefono)) {
            newErrors.telefono = "Debe tener exactamente 8 dígitos";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const res = await api.post("/Usuarios/CrearUsuario", formData);
            console.log("Usuario creado: ", res.data);
            setModalMessage("El usuario ha sido creado correctamente.");
            setModalOpen(true);
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
            setModalMessage("Error al crear el usuario. Por favor intente nuevamente.");
            setModalOpen(true);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black p-6">
            <div className="w-full max-w-md">
                <Header titulo="👤 Crear Nuevo Usuario" />

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

                            {/* Campo de contraseña con botón al lado */}
                            <div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Input
                                            label="Contraseña *"
                                            name="contrasena"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.contrasena}
                                            onChange={handleChange}
                                            error={errors.contrasena}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="h-10 px-3 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none border border-gray-300 rounded-md"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.contrasena && <p className="text-red-500 text-sm mt-1">{errors.contrasena}</p>}
                            </div>

                            {/* Campo de confirmar contraseña con botón al lado */}
                            <div>
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <Input
                                            label="Confirmar Contraseña *"
                                            name="confirmarContrasena"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmarContrasena}
                                            onChange={handleChange}
                                            error={errors.confirmarContrasena}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="h-10 px-3 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none border border-gray-300 rounded-md"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
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

                            <div className="flex justify-end">
                                <Button type="submit">Registrar Usuario</Button>
                            </div>

                            {/* Enlace para volver */}
                            <div className="text-center pt-4 border-t border-gray-200">
                                <Link
                                    to="/app/usuarios"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Modal de resultados */}
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    className="bg-black bg-opacity-50 flex items-center justify-center"
                >
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h2 className="text-xl font-bold text-center mb-4">
                            {errors.submitError ? "Error" : "¡Éxito!"}
                        </h2>
                        <p className="mb-4 text-center">{modalMessage}</p>
                        <div className="flex justify-end">
                            <Button onClick={() => {
                                setModalOpen(false);
                                if (!errors.submitError) {
                                    navigate("/app/usuarios");
                                }
                            }}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}