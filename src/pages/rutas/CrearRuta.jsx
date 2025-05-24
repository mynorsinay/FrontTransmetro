import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 
import { useNavigate } from "react-router-dom"; 

export default function CrearRuta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    IdMunicipalidad: 1, // Valor predeterminado
    Nombre: "",
  });

  // Estado modificado para el modal
  const [modalOpen, setModalOpen] = useState({ 
    isOpen: false, 
    isSuccess: false 
  });
  const [modalMessage, setModalMessage] = useState("");

  // Lista de municipalidades (puedes obtenerla de una API si es necesario)
  const municipalidades = [
    { id: 1, nombre: "Municipalidad de Guatemala" },

    // Agrega más según necesites
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/Rutas/CrearRuta", formData);

      if (res.status === 200) {
        setModalMessage("✅ Ruta creada exitosamente.");
        setModalOpen({ isOpen: true, isSuccess: true });
      } else {
        setModalMessage("❌ No se pudo crear la ruta.");
        setModalOpen({ isOpen: true, isSuccess: false });
      }

      // Limpiar el formulario solo si fue exitoso
      if (res.status === 200) {
        setFormData({ IdMunicipalidad: 1, Nombre: "" });
      }
    } catch (err) {
      console.error("Error al crear la ruta:", err);
      setModalMessage("⚠️ Error al conectar con el servidor.");
      setModalOpen({ isOpen: true, isSuccess: false });
    }
  };

  const handleCloseModal = () => {
    setModalOpen({ isOpen: false, isSuccess: false });
    // Refrescar solo si fue exitoso
    if (modalOpen.isSuccess) {
      window.location.reload();
    }
  };

  return (
    <div className="p-6">
      {/* Botón para regresar */}
      <button
        onClick={() => navigate("/app/rutas/dashboard")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Crear Ruta" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de la Ruta"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
            />
            
            {/* Select para municipalidades */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Municipalidad
              </label>
              <select
                name="IdMunicipalidad"
                value={formData.IdMunicipalidad}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {municipalidades.map((muni) => (
                  <option key={muni.id} value={muni.id}>
                    {muni.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Crear Ruta</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal
        isOpen={modalOpen.isOpen}
        onClose={handleCloseModal}
        title="Resultado de la Creación"
      >
        <p>{modalMessage}</p>
        <Button onClick={handleCloseModal}>Cerrar</Button>
      </Modal>
    </div>
  );
}