import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ReporteBusesMantenimiento() {
    const [registros, setRegistros] = useState([]);
    const [error, setError] = useState("");

    const obtenerHistorial = async () => {
        try {
            const res = await api.post("/Rutas/ConsuntarRutaConMunicipalidad", {});
            setRegistros(res.data || []);
            setError("");
        } catch (err) {
            console.error(err);
            setRegistros([]);
            setError("⚠️ Error al obtener el historial de rutas.");
        }
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">🛣️ Rutas</h2>

            {error && <p className="text-red-600">{error}</p>}

            {registros.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-white text-black rounded">
                        <thead>
                            <tr className="bg-[#01ff09] text-white">
                                <th className="px-4 py-2 text-left">Ruta</th>
                                <th className="px-4 py-2 text-left">Municipalidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((rutas, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{rutas.nombre }</td>
                                    <td className="px-4 py-2">{rutas.nombreMuni }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && (
                    <p className="text-gray-600">
                        No hay registros recientes de rutas.
                    </p>
                )
            )}
        </div>
    );
}
