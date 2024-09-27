import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/app/App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    // это вызывало двойной запрос данных за новым id
    // сесии, дублировало сесиии на сервере
    // пока я не научился хранить это всё в куках, или
    // где то ещё, где это можно делать, не вызывая
    // запрос за новой сессией каждый раз при обновлении
    // страницы, это будет отключено
    // <React.StrictMode>
        <App />
    // </React.StrictMode>
);
