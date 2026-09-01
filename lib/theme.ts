/** localStorage key holding an explicit "light" | "dark" choice. */
export const THEME_STORAGE_KEY = "recepie-theme";

/**
 * Runs in the document head, before first paint, to stamp `data-theme` on the
 * root element. Resolving the system preference here — rather than in a
 * `prefers-color-scheme` media query — means the stylesheet needs only one
 * dark block, so the two cannot drift apart.
 *
 * Serialised into an inline script tag, so it must stay self-contained and
 * free of anything that needs compiling.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;
