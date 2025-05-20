import api from "./api";

// Función para login
export const login = async (credentials) => {
  try {
    const response = await api.post("/Usuarios/Login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Función para registro
export const register = async (userData) => {
  try {
    const response = await api.post("/Usuarios/CrearUsuarios", userData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

// Función para validar token
export const validateToken = async (token) => {
  try {
    const response = await api.post("/Usuarios/ValidateToken", { token });
    return response.data;
  } catch (error) {
    console.error("Error al validar token:", error);
    throw error;
  }
};
