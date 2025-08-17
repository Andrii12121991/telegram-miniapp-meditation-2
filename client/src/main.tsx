import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Проверяем, что Telegram WebApp доступен
const tg = (window as any).Telegram?.WebApp;

if (tg) {
  tg.ready(); // Сообщаем Telegram, что приложение готово
  tg.expand(); // Разворачиваем на весь экран
} else {
  console.warn("Telegram WebApp API не найден. Запустите в Telegram.");
}

createRoot(document.getElementById("root")!).render(<App />);
