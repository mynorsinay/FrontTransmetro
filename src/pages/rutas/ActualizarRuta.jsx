import { useState, useEffect } from "react";
import api from "../../services/api";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";

export default function ActualizarRuta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    IdRuta: "", 
    IdMunicipalidad: 1, 
    Nombre: "" 
  });
  const [rutas, setRutas] = useState([]);
  const [modalOpen, setModalOpen] = useState({ 
    isOpen: false, 
    isSuccess: false 
  });
  const [modalMessage, setModalMessage] = useState("");

  // Cargar rutas disponibles al cargar el componente
  const cargarRutas = async () => {
    try {
      const res = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
      setRutas(res.data);
    } catch (error) {
      console.error("Error al obtener rutas", error);
    }
  };

  useEffect(() => {
    cargarRutas();
  }, []);

  // Función para manejar el cambio de los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //manejo de actualizacion
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/Rutas/ActualizarRuta", formData);
      if (res.status === 200) {
        setModalMessage("✅ Ruta actualizada correctamente.");
        setModalOpen({ isOpen: true, isSuccess: true });
      } else {
        setModalMessage("❌ No se pudo actualizar la ruta.");
        setModalOpen({ isOpen: true, isSuccess: false });
      }
      cargarRutas();
    } catch (error) {
      console.error("Error al actualizar la ruta:", error);
      setModalMessage("⚠️ Error al conectar con el servidor.");
      setModalOpen({ isOpen: true, isSuccess: false });
    }
  };

  const handleCloseModal = () => {
    setModalOpen({ isOpen: false, isSuccess: false });
    if (modalOpen.isSuccess) {
      window.location.reload();
    }
  };
  //fin manejo de actualizacion

  return (
    <div className="p-6">
      {/* Botón de regresar */}
      <button
        onClick={() => navigate("/app/rutas/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Actualizar Ruta" fechaHora={new Date()} />

      {/* Formulario para seleccionar la ruta a actualizar */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Seleccione la Ruta a Actualizar</h3>
          <select
            name="IdRuta"
            value={formData.IdRuta}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">Seleccione una ruta</option>
            {rutas.map((ruta) => (
              <option key={ruta.idRuta} value={ruta.idRuta}>
                {ruta.nombre}
              </option>
            ))}
          </select>

          {/* Si se seleccionó una ruta, permitir actualización de su nombre y municipalidad */}
          {formData.IdRuta && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre de la Ruta"
                name="Nombre"
                value={formData.Nombre}
                onChange={handleChange}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Municipalidad</label>
                <select
                  name="IdMunicipalidad"
                  value={formData.IdMunicipalidad}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="1">Municipalidad de Guatemala</option>
                  {/* Agrega más opciones si es necesario */}
                </select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Actualizar Ruta</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal 
        isOpen={modalOpen.isOpen} 
        onClose={handleCloseModal} 
        title="Resultado de la Actualización"
      >
        <p>{modalMessage}</p>
        <Button onClick={handleCloseModal}>Cerrar</Button>
      </Modal>
    </div>
  );
}