(() => {
  const storageKey = "saba-theme";
  const root = document.documentElement;

  const readTheme = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : "auto";
    } catch {
      return "auto";
    }
  };

  const applyTheme = (theme) => {
    if (theme === "light" || theme === "dark") {
      root.dataset.theme = theme;
    } else {
      delete root.dataset.theme;
    }
  };

  const saveTheme = (theme) => {
    try {
      if (theme === "auto") {
        window.localStorage.removeItem(storageKey);
      } else {
        window.localStorage.setItem(storageKey, theme);
      }
    } catch {
      // Storage may be unavailable; the current page still reflects the choice.
    }
  };

  applyTheme(readTheme());

  const setupSwitchers = () => {
    document.querySelectorAll("[data-saba-theme-switcher]").forEach((switcher) => {
      const buttons = switcher.querySelectorAll("button[data-theme-value]");

      const updateState = (theme) => {
        buttons.forEach((button) => {
          button.setAttribute("aria-pressed", String(button.dataset.themeValue === theme));
        });
      };

      switcher.hidden = false;
      updateState(readTheme());

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const theme = button.dataset.themeValue;
          applyTheme(theme);
          saveTheme(theme);
          updateState(theme);
        });
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSwitchers, { once: true });
  } else {
    setupSwitchers();
  }
})();
