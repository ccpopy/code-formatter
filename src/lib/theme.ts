export type ThemeMode = "light" | "dark";
const STORAGE_KEY = "formatter:theme";

export const prefersDark = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

export function getStoredTheme(): ThemeMode {
  const v = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  return v ?? "light";
}

export function storeTheme(mode: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, mode);
}

export function applyTheme(mode: ThemeMode) {
  const isDark = mode === "dark" || prefersDark();
  document.documentElement.classList.toggle("dark", isDark);
}

export function setupThemeWatcher() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    const mode = getStoredTheme();
    if (mode === "light") applyTheme(mode);
  };
  media.addEventListener("change", handler);
  return () => media.removeEventListener("change", handler);
}
