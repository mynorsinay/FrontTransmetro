import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../../services/api";

export default function ReporteUsuarios() {
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

    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Reporte de Usuarios", 14, 20);
        doc.setFontSize(10);
        doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 28);

        const headers = [["Nombre", "Correo", "Teléfono", "Usuario"]];

        const data = registros.map(usuario => [
            `${usuario.primerNombre || "-"} ${usuario.primerApellido || "-"}`,
            usuario.email || "-",
            usuario.telefono || "-",
            usuario.nombreUsuario || "-"
        ]);

        doc.autoTable({
            head: headers,
            body: data,
            startY: 35,
            styles: { fontSize: 9 },
            headStyles: {
                fillColor: [1, 255, 9],
                textColor: [255, 255, 255],
                fontStyle: "bold"
            },
            alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        doc.save(`reporte_usuarios_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    useEffect(() => {
        obtenerHistorial();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">👤 Usuarios</h2>
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
                                <th className="px-4 py-2 text-left">Correo</th>
                                <th className="px-4 py-2 text-left">Teléfono</th>
                                <th className="px-4 py-2 text-left">Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((usuario, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{`${usuario.primerNombre} ${usuario.primerApellido}`}</td>
                                    <td className="px-4 py-2">{usuario.email}</td>
                                    <td className="px-4 py-2">{usuario.telefono}</td>
                                    <td className="px-4 py-2">{usuario.nombreUsuario}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !error && <p className="text-gray-600">No hay registros recientes de usuarios.</p>
            )}
        </div>
    );
}
