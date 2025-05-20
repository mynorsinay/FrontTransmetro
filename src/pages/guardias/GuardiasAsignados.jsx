import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api"; 

export default function GuardiasAsignados() {
  const [formData, setFormData] = useState({
    CUI: "", // El CUI es opcional para buscar guardias asignados
  });

  const [guardias, setGuardias] = useState([]);
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
      const body = formData.CUI ? { CUI: formData.CUI } : {}; // Si hay CUI, se usa, sino, se envía vacío
      const res = await api.post("/Guardias/GuardiasAsignados", body);
      setGuardias(res.data); // Guardar los datos de los guardias en el estado
      setMensaje("Guardias asignados consultados correctamente.");
    } catch (error) {
      console.error("Error al consultar los guardias asignados:", error);
      setMensaje("Error al consultar los guardias asignados.");
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Guardias Asignados" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CUI del Guardia"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Consultar Guardias Asignados</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Mensaje de resultado */}
      {mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>}

      {/* Tabla de Guardias Asignados */}
      <div className="mt-6">
        {guardias.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-black rounded-xl">
              <thead className="bg-[#01ff09] text-white">
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">CUI</th>
                  <th className="px-4 py-2">Estación</th>
                  <th className="px-4 py-2">Horario L - V</th>
                  <th className="px-4 py-2">Horario S- D</th>
                  <th className="px-4 py-2">Ruta</th>
                </tr>
              </thead>
              <tbody>
                {guardias.map((guardia, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">
                      {guardia.primerNombre} {guardia.segundoNombre} {guardia.primerApellido} {guardia.segundoApellido}
                    </td>
                        <td className="px-4 py-2">{guardia.nombre}</td>
                        <td className="px-4 py-2">{guardia.cui}</td>
                        <td className="px-4 py-2">{guardia.estacion}</td>
                        <td className="px-4 py-2">{guardia.horaLV}</td>
                        <td className="px-4 py-2">{guardia.horaSD}</td>
                        <td className="px-4 py-2">{guardia.ruta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No se encontraron resultados o no hay guardias asignados activos.</p>
        )}
      </div>
    </div>
  );
}
