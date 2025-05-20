import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function BusesAsignados() {
  const [formData, setFormData] = useState({
    Placa: "", // Placa del bus para buscar
  });

  const [buses, setBuses] = useState([]);
  const [mensaje, setMensaje] = useState(""); // Mensaje de estado

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
      const body = formData.Placa ? { Placa: formData.Placa } : {}; // Si Placa está vacío, envía un objeto vacío
      const res = await api.post("/Buses/BusesAsignados", body);
      setBuses(res.data); // Guardar los datos de los buses en el estado
      setMensaje("Buses encontrados correctamente.");
    } catch (error) {
      console.error("Error al obtener los buses asignados:", error);
      setMensaje("Error al obtener los buses asignados.");
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Buses Asignados" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Placa del Bus"
              name="Placa"
              value={formData.Placa}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Consultar Buses Asignados</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Mensaje de resultado */}
      {mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>}

      {/* Tabla de resultados */}
      {buses.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Buses Asignados:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Placa</th>
                <th className="px-4 py-2">Marca</th>
                <th className="px-4 py-2">Modelo</th>
                <th className="px-4 py-2">Ruta</th>
                <th className="px-4 py-2">Piloto</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{bus.placa}</td>
                  <td className="px-4 py-2">{bus.marca}</td>
                  <td className="px-4 py-2">{bus.modelo}</td>
                  <td className="px-4 py-2">{bus.ruta}</td>
                  <td className="px-4 py-2">{bus.pilotoAsignado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Si no hay buses asignados */}
      {buses.length === 0 && <p className="mt-4 text-gray-600">No se encontraron buses asignados.</p>}
    </div>
  );
}