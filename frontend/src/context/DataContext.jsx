// src/context/DataContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getData } from "../services/api";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export function DataProvider({ children }) {
  const { token, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return; // wait until JWT is loaded

    setLoadingData(true);

    getData()
      .then(response => {
        console.debug("Loaded initial data:", response);
        setData(response);
      })
      .catch(err => {
        console.error("Failed loading initial data", err);
        setError(err);
        if (err.message.includes("401")) {
          // Token expired or invalid: force logout
          logout();
        }
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [token, logout]);

  return (
    <DataContext.Provider value={{ data, loadingData, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
