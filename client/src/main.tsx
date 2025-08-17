import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/** Telegram WebApp init */
// @ts-ignore
const tg = (window as any).Telegram?.WebApp;

// Сообщаем Telegram, что UI готов, и разворачиваем на всю высоту
tg?.ready?.();
tg?.expand?.();

// Подхватываем цвета/тему из Telegram
try {
  const setTheme = () => {
    const bg = tg?.backgroundColor || "#ffffff";
    const text = tg?.colorScheme === "dark" ? "#ffffff" : "#111111";
    document.documentElement.style.setProperty("--tg-bg", bg);
    document.documentElement.style.setProperty("--tg-text", text);
    document.body.style.background = "var(--tg-bg)";
    document.body.style.color = "var(--tg-text)";
  };
  setTheme();
  // если тема меняется на лету
  tg?.onEvent?.("themeChanged", setTheme);
} catch { /* тихо игнорируем, если вне Telegram */ }

// (Опционально) пример использования MainButton
// tg?.MainButton.setText("Начать медитацию");
// tg?.MainButton.onClick(() => {
//   // startMeditation();
// });
// tg?.MainButton.show();

createRoot(document.getElementById("root")!).render(<App />);
