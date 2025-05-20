import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

export default function ActualizarDistancia() {
  const navigate = useNavigate(); // <-- Hook de navegación

  const [formulario, setFormulario] = useState({
    idDistancia: "",
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
      const response = await axios.post("https://localhost:7293/api/Distancias/ActualizarDistancia", formulario);

      if (response.status === 200) {
        setMensaje("✅ Distancia actualizada correctamente.");
        setError("");
      } else {
        setMensaje("");
        setError("❌ No se pudo actualizar la distancia.");
      }
    } catch (err) {
      console.error(err);
      setMensaje("");
      setError("⚠️ Error al conectar con el servidor.");
    }
  };

  return (
    <div className="p-6 bg-blanco rounded-xl shadow-md text-negro">

      {/* Botón para regresar */}
      <button
        onClick={() => navigate("/distancias")}
        className="mb-6 px-4 py-2 bg-[#01ff09] text-black rounded-xl font-semibold hover:bg-[#00e607] transition"
      >
        ⬅️ Regresar
      </button>

      <h2 className="text-2xl font-semibold mb-4">Actualizar Distancia</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {["idDistancia", "Ruta", "EstacionInicio", "EstacionFin", "Recorrido"].map((campo) => (
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
          className="bg-[#01ff09] text-[#ffffff] px-4 py-2 rounded hover:bg-[#60ff40] transition-colors"
        >
          Actualizar
        </button>
      </form>

      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
