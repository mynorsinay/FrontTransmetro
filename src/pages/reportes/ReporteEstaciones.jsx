import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ReporteEstaciones() {
    const [registros, setRegistros] = useState([]);
    const [error, setError] = useState("");

    const obtenerHistorial = async () => {
        try {
            const res = await api.post("/Estaciones/ConsultarEstaciones", {});
            setRegistros(res.data || []);
            setError("");
        } catch (err) {
            console.error(err);
            setRegistros([]);
            setError("⚠️ Error al obtener el historial de estaciones.");
        }
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">🏛️ Estaciones</h2>

            {error && <p className="text-red-600">{error}</p>}

            {registros.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-white text-black rounded">
                        <thead>
                            <tr className="bg-[#01ff09] text-white">
                                <th className="px-4 py-2 text-left">Ruta</th>
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">Direccion</th>
                                <th className="px-4 py-2 text-left">Horario L-V</th>
                                <th className="px-4 py-2 text-left">Horario S-D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((estacion, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{estacion.ruta }</td>
                                    <td className="px-4 py-2">{estacion.nombre}</td>
                                    <td className="px-4 py-2">{estacion.direccion}</td>
                                    <td className="px-4 py-2">{estacion.idHorarioES }</td>
                                    <td className="px-4 py-2">{estacion.idHorarioFDS }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && (
                    <p className="text-gray-600">
                        No hay registros recientes de estaciones.
                    </p>
                )
            )}
        </div>
    );
}
