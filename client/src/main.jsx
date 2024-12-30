import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain="cloud.appwrite.io" // Appwrite cloud domain
    clientId="793137501704-0l1q4pvm1rbrd8k79c5ik5r1pcogqjpa.apps.googleusercontent.com" // Google OAuth Client ID
    authorizationParams={{
      redirect_uri:
        "https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/675fcc1f000c7b70d9a4", // Google OAuth2 redirect URI for Appwrite
    }}
  >
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>
);
