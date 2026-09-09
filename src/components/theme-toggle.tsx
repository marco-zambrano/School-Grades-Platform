"use client";

import { useSyncExternalStore } from "react";

const themeChangeEvent = "themechange";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(themeChangeEvent, onStoreChange);
  return () => window.removeEventListener(themeChangeEvent, onStoreChange);
}

function getThemeIsDark() {
  return !document.documentElement.classList.contains("light");
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getThemeIsDark, () => true);

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <button type="button" onClick={toggleTheme} className="theme-toggle inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold" aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}>
      <span aria-hidden="true">{dark ? "☀" : "◐"}</span>
      <span className="hidden sm:inline">{dark ? "Claro" : "Oscuro"}</span>
    </button>
  );
}
