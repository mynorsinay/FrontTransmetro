import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    contrasena: ""
  });
  const [errors, setErrors] = useState({});
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.nombreUsuario || !formData.contrasena) {
      setErrors({ submitError: "Todos los campos son obligatorios" });
      return;
    }

    try {
      const response = await api.post("/Usuarios/Login", {
        nombreUsuario: formData.nombreUsuario,
        contrasena: formData.contrasena
      });

      // Guardar datos del usuario
      login({
        usuario: response.data.usuario,
        nombre: response.data.nombre,
        apellido: response.data.apellido,
        rol: response.data.rol
      });

      // Mostrar modal de bienvenida
      setWelcomeMessage(`¡Bienvenido ${response.data.nombre} ${response.data.apellido}!`);
      setShowWelcomeModal(true);

      // Redirigir a la ruta principal (/) después de 2 segundos
      setTimeout(() => {
        setShowWelcomeModal(false);
        navigate("/app"); // Esta es la ruta que carga el Dashboard dentro del Layout
      }, 2000);

    } catch (error) {
      console.error("Error de login:", error);
      
      let errorMessage = "Error al iniciar sesión";
      
      if (error.response) {
        // Extraer mensaje de error del backend
        errorMessage = error.response.data?.message || 
                      error.response.data?.Message ||
                      error.response.data?.error ||
                      (error.response.status === 400 ? "Credenciales inválidas" : "Error del servidor");
      }

      setErrors({ submitError: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-6">
      <div className="w-full max-w-md">
        <Header titulo="🔐 Iniciar Sesión" />

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de Usuario"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                onChange={handleChange}
                error={errors.nombreUsuario}
              />
              
              <Input
                label="Contraseña"
                name="contrasena"
                type="password"
                value={formData.contrasena}
                onChange={handleChange}
                error={errors.contrasena}
              />

              {errors.submitError && (
                <div className="text-red-500 text-sm text-center">
                  {errors.submitError}
                </div>
              )}

              <div className="text-right">
                <Link to="/usuarios/reiniciar" className="text-sm text-blue-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Entrar al Sistema</Button>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
                <Link to="/usuarios/crear" className="text-sm text-blue-600 hover:underline">
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Modal de Bienvenida */}
        <Modal
          isOpen={showWelcomeModal}
          onClose={() => {}}
          className="bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold text-center mb-4">¡Bienvenido!</h2>
            <p className="text-lg text-center">{welcomeMessage}</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}