import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api"; 

export default function ConsultarPiloto() {
  const [formData, setFormData] = useState({
    CUI: "", // El CUI es opcional para buscar un piloto
  });

  const [pilotos, setPilotos] = useState([]);
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
      // Si el CUI está vacío, enviamos un objeto vacío para obtener todos los pilotos
      const body = formData.CUI ? { CUI: formData.CUI } : {};
      const res = await api.post("/Pilotos/ConsultarPilotos", body);
      setPilotos(res.data); // Guardar los datos de los pilotos en el estado
      setMensaje("Pilotos consultados correctamente.");
    } catch (error) {
      console.error("Error al consultar los pilotos:", error);
      setMensaje("Error al consultar los pilotos.");
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Consultar Piloto" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CUI del Piloto"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Consultar Piloto</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Mensaje de resultado */}
      {mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>}

      {/* Tabla de resultados */}
      {pilotos.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Pilotos Encontrados:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Nombre Completo</th>
                <th className="px-4 py-2">CUI</th>
                <th className="px-4 py-2">Tipo Licencia</th>
                <th className="px-4 py-2">Horas Activo</th>
              </tr>
            </thead>
            <tbody>
              {pilotos.map((piloto, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{piloto.primerNombre} {piloto.segundoNombre} {piloto.primerApellido} {piloto.segundoApellido}</td>
                  <td className="px-4 py-2">{piloto.cui}</td>
                  <td className="px-4 py-2">{piloto.tipoLicencia}</td>
                  <td className="px-4 py-2">{piloto.horasActivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Si no hay pilotos encontrados */}
      {pilotos.length === 0 && <p className="mt-4 text-gray-600">No se encontraron resultados para el CUI proporcionado.</p>}
    </div>
  );
}
