import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ReporteBusesMantenimiento() {
    const [registros, setRegistros] = useState([]);
    const [error, setError] = useState("");

    const obtenerHistorial = async () => {
        try {
            const res = await api.post("/Usuarios/ConsultarUsuarios", {});
            setRegistros(res.data || []);
            setError("");
        } catch (err) {
            console.error(err);
            setRegistros([]);
            setError("⚠️ Error al obtener el historial de usuarios.");
        }
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">👤 Usuarios</h2>

            {error && <p className="text-red-600">{error}</p>}

            {registros.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-white text-black rounded">
                        <thead>
                            <tr className="bg-[#01ff09] text-white">
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">Correo</th>
                                <th className="px-4 py-2 text-left">Teléfono</th>
                                <th className="px-4 py-2 text-left">Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((usuario, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{usuario.primerNombre} {usuario.primerApellido}</td>
                                    <td className="px-4 py-2">{usuario.email}</td>
                                    <td className="px-4 py-2">{usuario.telefono}</td>
                                    <td className="px-4 py-2">{usuario.nombreUsuario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && (
                    <p className="text-gray-600">
                        No hay registros recientes de usuarios.
                    </p>
                )
            )}
        </div>
    );
}
