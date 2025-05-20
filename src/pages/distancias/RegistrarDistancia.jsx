import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../../services/api";

export default function RegistrarDistancia() {
  const navigate = useNavigate(); 

  const [formulario, setFormulario] = useState({
    Ruta: "",
    EstacionInicio: "",
    EstacionFin: "",
    Recorrido: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/Distancias/guardarDistancias", formulario);

      if (res.status === 200) {
        setMensaje("✅ Distancia registrada exitosamente.");
        setError("");
        setFormulario({ Ruta: "", EstacionInicio: "", EstacionFin: "", Recorrido: "" });
      } else {
        setError("❌ No se pudo registrar la distancia.");
        setMensaje("");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Error al conectar con el servidor.");
      setMensaje("");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md text-black">

      {/* Botón de regreso */}
      <button
        onClick={() => navigate("/distancias")}
        className="flex items-center gap-2 bg-[#01ff09] text-black font-semibold px-4 py-2 rounded-xl mb-6 hover:bg-[#60ff40] transition-all"
      >
        <div >
          <span className="text-white text-sm">⬅️</span>
        </div>
        Regresar
      </button>

      {/* Título */}
      <h2 className="text-2xl font-semibold mb-4">Registrar Distancia</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {["Ruta", "EstacionInicio", "EstacionFin", "Recorrido"].map((campo) => (
          <div key={campo}>
            <label className="block text-sm font-medium">{campo}</label>
            <input
              type="number"
              name={campo}
              value={formulario[campo]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-[#01ff09] text-white px-4 py-2 rounded hover:bg-[#60ff40] transition-colors"
        >
          Registrar
        </button>
      </form>

      {/* Mensajes */}
      {mensaje && <p className="mt-4 text-[#01ff09]">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
