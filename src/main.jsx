import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div className="font-poppins">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);