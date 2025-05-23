import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ReporteBusesMantenimiento() {
    const [registros, setRegistros] = useState([]);
    const [error, setError] = useState("");

    const obtenerHistorial = async () => {
        try {
            const res = await api.post("/Guardias/GuardiasAsignados", {});
            setRegistros(res.data || []);
            setError("");
        } catch (err) {
            console.error(err);
            setRegistros([]);
            setError("⚠️ Error al obtener el historial de guardias.");
        }
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">🛡️ Guardias</h2>

            {error && <p className="text-red-600">{error}</p>}

            {registros.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-white text-black rounded">
                        <thead>
                            <tr className="bg-[#01ff09] text-white">
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">CUI</th>
                                <th className="px-4 py-2 text-left">Ruta Asignada</th>
                                <th className="px-4 py-2 text-left">Estación</th>
                                <th className="px-4 py-2 text-left">Horario L-V</th>
                                <th className="px-4 py-2 text-left">Horario S-D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((guardias, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{guardias.nombre }</td>
                                    <td className="px-4 py-2">{guardias.cui }</td>
                                    <td className="px-4 py-2">{guardias.ruta }</td>
                                    <td className="px-4 py-2">{guardias.estacion }</td>
                                    <td className="px-4 py-2">{guardias.horaLV }</td>
                                    <td className="px-4 py-2">{guardias.horaSD }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && (
                    <p className="text-gray-600">
                        No hay registros recientes de guardias.
                    </p>
                )
            )}
        </div>
    );
}
