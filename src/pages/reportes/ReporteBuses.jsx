import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
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

    const generarPDF = () => {
        const doc = new jsPDF();

        // Título y fecha
        doc.setFontSize(18);
        doc.text("Reporte de Buses Asignados", 14, 20);
        doc.setFontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 28);

        // Encabezados y datos
        const headers = [
            ["Placa", "Marca", "Modelo", "Fecha Alta", "Ruta", "Piloto Asignado"]
        ];

        const data = registros.map(bus => [
            bus.placa || "-",
            bus.marca || "-",
            bus.modelo || "-",
            bus.fechaAlta || "-",
            bus.ruta || "-",
            bus.pilotoAsignado || "-"
        ]);

        // Tabla
        doc.autoTable({
            head: headers,
            body: data,
            startY: 35,
            styles: { fontSize: 9 },
            headStyles: {
                fillColor: [1, 255, 9], // verde
                textColor: [255, 255, 255],
                fontStyle: "bold"
            },
            alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        // Guardar el archivo
        doc.save(`reporte_buses_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">🚌 Buses</h2>
                {registros.length > 0 && (
                    <button
                        onClick={generarPDF}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Descargar Reporte
                    </button>
                )}
            </div>

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
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{bus.placa || "-"}</td>
                                    <td className="px-4 py-2">{bus.marca || "-"}</td>
                                    <td className="px-4 py-2">{bus.modelo || "-"}</td>
                                    <td className="px-4 py-2">{bus.fechaAlta || "-"}</td>
                                    <td className="px-4 py-2">{bus.ruta || "-"}</td>
                                    <td className="px-4 py-2">{bus.pilotoAsignado || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && <p className="text-gray-600">No hay registros recientes de buses.</p>
            )}
        </div>
    );
}
