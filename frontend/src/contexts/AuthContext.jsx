import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axios'; // Importa la instancia configurada

const AuthContext = createContext();

// Función API separada (opcional pero recomendado)
const loginUserAPI = async (credentials) => {
  // Envía nombre_usuario y password
  const response = await axiosInstance.post('/login', credentials);
  return response.data; // Devuelve { message, token, user }
};

// Función API separada para obtener usuario
 const fetchUserProfileAPI = async () => {
    const response = await axiosInstance.get('/user');
    return response.data; // Devuelve el objeto Usuario
};

 // Función API separada para logout
const logoutUserAPI = async () => {
    await axiosInstance.post('/logout');
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setAuthData = useCallback((newToken, userData) => {
    if (newToken && userData) {
      localStorage.setItem('authToken', newToken);
      // El interceptor de axios ya maneja el header
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        // Llama a /api/user para validar el token y obtener datos frescos
        const userData = await fetchUserProfileAPI();
        setAuthData(storedToken, userData); // Token válido, actualiza estado
      } catch (error) {
        console.error("Token inválido o expirado al verificar", error);
        setAuthData(null, null); // Limpia token si es inválido
      }
    }
    setIsLoading(false);
  }, [setAuthData]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    // Asegúrate de que LoginPage envía { nombre_usuario: '...', password: '...' }
    try {
      const { token: apiToken, user: apiUser } = await loginUserAPI(credentials);
      setAuthData(apiToken, apiUser);
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      setAuthData(null, null); // Limpia en fallo
       const errorMessage = error.response?.data?.errors?.nombre_usuario?.[0] // Error de validación de Laravel
                         || error.response?.data?.message
                         || error.message
                         || 'Error de autenticación.';
       throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      if (token) { // Solo intenta desloguear si hay token
          await logoutUserAPI();
      }
    } catch (error) {
      console.error("Error en logout API:", error);
    } finally {
      setAuthData(null, null); // Siempre limpia el estado del frontend
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// src/hooks/useAuth.js permanece igual