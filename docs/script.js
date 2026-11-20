(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("lab-theme");
  if (savedTheme === "light" || savedTheme === "dark") root.dataset.theme = savedTheme;
  themeButton.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("lab-theme", next);
  });

  const status = document.getElementById("copy-status");
  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        status.textContent = "SHA-256 copied to clipboard.";
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = "Copy"; }, 1400);
      } catch {
        status.textContent = "Clipboard unavailable. Select and copy the hash from the table.";
      }
    });
  });

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector(".lightbox-close");
  document.querySelectorAll(".gallery-image").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = button.closest("figure").querySelector("figcaption").textContent.trim();
      lightbox.showModal();
      closeButton.focus();
    });
  });
  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
})();
