const dialog = document.getElementById("info-dialog");
const openButton = document.getElementById("info-btn");
const closeButton = document.getElementById("close-dialog");

openButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});

// Close dialog only when clicking outside (not when selecting text)
dialog.addEventListener("mousedown", (event) => {
  const rect = dialog.getBoundingClientRect();
  const isInside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!isInside) {
    dialog.close();
  }
});
