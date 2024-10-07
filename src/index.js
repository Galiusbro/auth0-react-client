import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-w4mhfi5sg7rm3bcl.us.auth0.com"
      clientId="GeRAAW6QNNOjkxWIVfpSIwCFKuUCQN2N"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "http://localhost:3033", // Должен совпадать с вашим API Identifier
      }}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
