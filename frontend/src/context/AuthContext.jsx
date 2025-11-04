// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setToken, clearToken } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, _setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("smartco-jwt");
    if (t) {
      _setToken(t);
      setToken(t);
    }
    setLoading(false);
  }, []);

  const login = useCallback((t) => {
    localStorage.setItem("smartco-jwt", t);
    setToken(t);
    _setToken(t);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("smartco-jwt");
    clearToken();
    _setToken(null);
  }, []);

  const requestCode = useCallback((phone) => api.sendCode(phone), []);
  const verifyCode = useCallback((phone, code) => api.verifyCode(phone, code), []);

  return (
    <AuthContext.Provider value={{ token, loading, login, logout, requestCode, verifyCode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
