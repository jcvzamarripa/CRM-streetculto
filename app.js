const themeButtons = document.querySelectorAll(".theme-button");
const body = document.body;

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = button.dataset.theme;
    body.classList.toggle("theme-neon", nextTheme === "neon");
    body.classList.toggle("theme-minimal", nextTheme === "minimal");

    themeButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });
  });
});
