import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import content from "./data/content.json";
import "./styles.css";

document.title = content.metadata.title;
document
  .querySelector('meta[name="description"]')
  .setAttribute("content", content.metadata.description);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
