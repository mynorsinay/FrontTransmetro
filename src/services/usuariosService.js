import api from "./api";

export const crearUsuario = (data) => api.post("/Usuarios/CrearUsuario", data);
export const actualizarUsuario = (data) => api.post("/Usuarios/ActualizarUsuario", data);
export const consultarUsuarios = (data = {}) => api.post("/Usuarios/ConsultarUsuarios", data);
export const eliminarUsuario = (data) => api.post("/Usuarios/EliminarUsuario", data);
export const reiniciarPass = (data) => api.post("/Usuarios/ReinicioPass", data);
export const loginUsuario = (data) => api.post("/Usuarios/Login", data);