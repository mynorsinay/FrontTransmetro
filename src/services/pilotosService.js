import api from "./api";

export const crearPiloto = (data) => api.post("/Pilotos/CrearPilotos", data);
export const actualizarPiloto = (data) => api.post("/Pilotos/ActualizarPilotos", data);
export const eliminarPiloto = (data) => api.post("/Pilotos/EliminarPilotos", data);
export const habilitarPiloto = (data) => api.post("/Pilotos/HabilitarPilotos", data);
export const consultarPilotos = (data = {}) => api.post("/pilotos/ConsultarPilotos", data);