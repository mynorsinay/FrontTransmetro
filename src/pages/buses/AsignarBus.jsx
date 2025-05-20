import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AsignarBuses() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    IdEstado: 1,
    IdRuta: "",
    IdPiloto: "",
    IdParqueo: "",
    Placa: "",
    Marca: "",
    Modelo: "",
  });

  const [rutas, setRutas] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [parqueos, setParqueos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Obtener listas de rutas, pilotos y parqueos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener rutas
        const resRutas = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
        setRutas(resRutas.data);
        
        // Obtener pilotos (necesitarías el endpoint correcto)
        const resPilotos = await api.post("/Pilotos/ConsultarPilotos", {});
        setPilotos(resPilotos.data);
        
        // Obtener parqueos
        const resParqueos = await api.post("/Parqueos/ConsultarParqueos", {});
        setParqueos(resParqueos.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/Buses/AsignarBus", formData);
      console.log("Bus asignado: ", res.data);

      setModalMessage("✅ El bus ha sido asignado correctamente.");
      setModalOpen(true);
      setFormData({
        IdEstado: 1,
        IdRuta: "",
        IdPiloto: "",
        IdParqueo: "",
        Placa: "",
        Marca: "",
        Modelo: "",
      });
    } catch (error) {
      console.error("Error al asignar el bus:", error);
      setModalMessage("❌ Error al asignar el bus.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="p-6">
      {/* Botón para regresar */}
      <button
        onClick={() => navigate("/buses")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      {/* Header de la página */}
      <Header titulo="Asignar Bus" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Ruta</label>
              <select
                name="IdRuta"
                value={formData.IdRuta}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Seleccione una ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.idRuta} value={ruta.idRuta}>
                    {ruta.nombre} 
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Piloto</label>
              <select
                name="IdPiloto"
                value={formData.IdPiloto}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Seleccione un piloto</option>
                {pilotos.map((piloto) => (
                  <option key={piloto.idPiloto} value={piloto.idPiloto}>
                    {piloto.primerNombre} {piloto.primerApellido} - {piloto.cui}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Parqueo</label>
              <select
                name="IdParqueo"
                value={formData.IdParqueo}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Seleccione un parqueo</option>
                {parqueos.map((parqueo) => (
                  <option key={parqueo.idParqueo} value={parqueo.idParqueo}>
                    {parqueo.ubicacion}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Placa"
              name="Placa"
              value={formData.Placa}
              onChange={handleChange}
              required
            />
            <Input
              label="Marca"
              name="Marca"
              value={formData.Marca}
              onChange={handleChange}
              required
            />
            <Input
              label="Modelo"
              name="Modelo"
              value={formData.Modelo}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Asignando..." : "Asignar Bus"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de resultados */}
      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        title="Resultado de la Asignación"
      >
        <p className="mb-4">{modalMessage}</p>
        <div className="flex justify-end">
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  );
}