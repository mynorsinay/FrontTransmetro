import React, { useEffect, useState } from "react";
import api from "../../services/api"; 
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";

export default function Rutas() {
  const [rutas, setRutas] = useState([]);
  const [formData, setFormData] = useState({ IdMunicipalidad: 1, Nombre: "" });
  const [modalOpen, setModalOpen] = useState(false);

  // Función para obtener rutas según los criterios de búsqueda
  const ConsuntarRutaConMunicipalidad = async () => {
    try {
      // Si el nombre de la ruta está vacío, se envía un objeto vacío para obtener todas las rutas
      const res = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", formData.Nombre ? { Nombre: formData.Nombre } : {});
      setRutas(res.data); // Guardar los datos de las rutas obtenidas
    } catch (error) {
      console.error("Error al obtener rutas", error);
    }
  };

  useEffect(() => {
    ConsuntarRutaConMunicipalidad(); // Obtener las rutas al cargar el componente
  }, []); // Solo se ejecuta una vez al montar el componente

  // Función para manejar el cambio de los inputs
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Función para manejar el formulario de creación de ruta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/Rutas/CrearRuta", formData); // Crear nueva ruta
      alert("Ruta creada correctamente");
      ConsuntarRutaConMunicipalidad(); // Refrescar lista de rutas después de crear una nueva
      setModalOpen(false); // Cerrar el modal
    } catch (error) {
      alert("Error al crear la ruta");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-black">Listado de Rutas</h2>
        <Button onClick={() => setModalOpen(true)}>+ Agregar Ruta</Button>
      </div>

      {/* Filtro para buscar rutas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Buscar Ruta</h3>
        <form onSubmit={(e) => { e.preventDefault(); ConsuntarRutaConMunicipalidad(); }} className="space-y-4">
          <Input
            label="Nombre de la Ruta"
            name="Nombre"
            value={formData.Nombre}
            onChange={handleChange}
          />
          <Input
            label="ID Municipalidad"
            name="IdMunicipalidad"
            type="number"
            value={formData.IdMunicipalidad}
            onChange={handleChange}
          />
          <div className="flex justify-end">
            <Button type="submit">Buscar Rutas</Button>
          </div>
        </form>
      </div>

      {/* Tabla de Rutas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black rounded-xl">
          <thead className="bg-[#01ff09] text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">ID Municipalidad</th>
            </tr>
          </thead>
          <tbody>
            {rutas.map((ruta, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{ruta.nombre}</td>
                <td className="px-4 py-2">{ruta.nombreMuni}</td>
              </tr>
            ))}
            {rutas.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  No hay rutas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar nueva ruta */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Ruta">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de la Ruta"
            name="Nombre"
            value={formData.Nombre}
            onChange={handleChange}
          />
          <Input
            label="ID Municipalidad"
            name="IdMunicipalidad"
            type="number"
            value={formData.IdMunicipalidad}
            onChange={handleChange}
          />
          <div className="flex justify-end">
            <Button type="submit">Guardar Ruta</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}