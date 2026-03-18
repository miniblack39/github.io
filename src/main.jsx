import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

async function renderApp() {
  const { Analytics } = await import("@vercel/analytics/react");

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
      <Analytics />
    </StrictMode>,
  );
}

renderApp();
