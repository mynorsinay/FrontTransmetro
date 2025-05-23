import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ReporteBuses() {
    const [registros, setRegistros] = useState([]);
    const [error, setError] = useState("");

    const obtenerHistorial = async () => {
        try {
            const res = await api.post("/Buses/BusesAsignados", {});
            setRegistros(res.data || []);
            setError("");
        } catch (err) {
            console.error(err);
            setRegistros([]);
            setError("⚠️ Error al obtener el historial de buses.");
        }
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">🚌 Buses</h2>

            {error && <p className="text-red-600">{error}</p>}

            {registros.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm bg-white text-black rounded">
                        <thead>
                            <tr className="bg-[#01ff09] text-white">
                                <th className="px-4 py-2 text-left">Placa</th>
                                <th className="px-4 py-2 text-left">Marca</th>
                                <th className="px-4 py-2 text-left">Modelo</th>
                                <th className="px-4 py-2 text-left">Fecha Alta</th>
                                <th className="px-4 py-2 text-left">Ruta</th>
                                <th className="px-4 py-2 text-left">Piloto Asignado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((bus, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{bus.placa }</td>
                                    <td className="px-4 py-2">{bus.marca }</td>
                                    <td className="px-4 py-2">{bus.modelo }</td>
                                    <td className="px-4 py-2">{bus.fechaAlta }</td>
                                    <td className="px-4 py-2">{bus.ruta }</td>
                                    <td className="px-4 py-2">{bus.pilotoAsignado }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && (
                    <p className="text-gray-600">
                        No hay registros recientes de buses.
                    </p>
                )
            )}
        </div>
    );
}
