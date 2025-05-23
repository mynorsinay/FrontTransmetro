import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../../services/api";

export default function ReporteGuardias() {
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

    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Reporte de Guardias", 14, 20);
        doc.setFontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 28);

        const headers = [
            ["Nombre", "CUI", "Ruta Asignada", "Estación", "Horario L-V", "Horario S-D"],
        ];

        const data = registros.map(guardia => [
            guardia.nombre || "-",
            guardia.cui || "-",
            guardia.ruta || "-",
            guardia.estacion || "-",
            guardia.horaLV || "-",
            guardia.horaSD || "-",
        ]);

        doc.autoTable({
            head: headers,
            body: data,
            startY: 35,
            styles: { fontSize: 9 },
            headStyles: {
                fillColor: [1, 255, 9],
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        doc.save(`reporte_guardias_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">🛡️ Guardias</h2>
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
                                <th className="px-4 py-2 text-left">Nombre</th>
                                <th className="px-4 py-2 text-left">CUI</th>
                                <th className="px-4 py-2 text-left">Ruta Asignada</th>
                                <th className="px-4 py-2 text-left">Estación</th>
                                <th className="px-4 py-2 text-left">Horario L-V</th>
                                <th className="px-4 py-2 text-left">Horario S-D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((guardia, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{guardia.nombre}</td>
                                    <td className="px-4 py-2">{guardia.cui}</td>
                                    <td className="px-4 py-2">{guardia.ruta}</td>
                                    <td className="px-4 py-2">{guardia.estacion}</td>
                                    <td className="px-4 py-2">{guardia.horaLV}</td>
                                    <td className="px-4 py-2">{guardia.horaSD}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && (
                    <p className="text-gray-600">No hay registros recientes de guardias.</p>
                )
            )}
        </div>
    );
}
