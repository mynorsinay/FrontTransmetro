import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card"; 
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 

export default function ConsultarUsuarios() {
  const [formData, setFormData] = useState({
    nombreUsuario: "", // Usuario para consulta
  });

  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState(""); // Mensaje para la consulta

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
      // Verifica si se especificó un nombre de usuario
      const endpoint = formData.nombreUsuario
        ? "/Usuarios/ConsultarUsuarios" // Consultar un usuario por nombre
        : "/Usuarios/ConsultarUsuarios"; // Consultar todos los usuarios (si no hay nombreUsuario)

      const res = await api.post(endpoint, { nombreUsuario: formData.nombreUsuario });
      setUsuarios(res.data); // Guarda la respuesta en el estado usuarios
      setMensaje("Usuarios consultados correctamente.");
    } catch (error) {
      console.error("Error al consultar usuarios:", error);
      setMensaje("Error al consultar usuarios.");
    }
  };

  return (
    <div className="p-6">
      {/* Header de la página */}
      <Header titulo="Consultar Usuario" fechaHora={new Date()} />

      {/* Formulario dentro de una tarjeta */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de Usuario"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Consultar Usuario</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Mensaje de resultado */}
      {mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>}

      {/* Tabla de resultados */}
      {usuarios.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-4">Usuarios Encontrados:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Nombre de Usuario</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, idx) => (
                <tr key={idx} className="border-t">
                          <td className="px-4 py-2">{usuario.primerNombre} {usuario.segundoNombre} {usuario.primerApellido} {usuario.segundoApellido}</td>
                          <td className="px-4 py-2">{usuario.nombreUsuario}</td>
                          <td className="px-4 py-2">{usuario.email}</td>
                          <td className="px-4 py-2">{usuario.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
