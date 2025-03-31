let molds = [];
let num = 5000;
let d;
let cnv;
let hideTimeout;
let settingsVisible = false;
let settingsButton;
let baseWidth = 600;
let baseHeight = 400;
let isRunning = true;
let bgColor = "rgba(70, 56, 31, 0.02)";

function setup() {
  cnv = createCanvas(baseWidth, baseHeight);
  cnv.parent("canvas-container");
  // let newCanvasX = (windowWidth - width) / 2;
  // let newCanvasY = 100;
  // cnv.position(newCanvasX, newCanvasY);
  // windowResized();

  angleMode(DEGREES);
  d = pixelDensity();

  for (let i = 0; i < num; i++) {
    molds[i] = new Mold();
  }
  // Button functionality
  const togglePlayButton = document.getElementById("play-toggle-btn");
  // const startButton = select("#start-btn");
  // const stopButton = select("#stop-btn");
  const restartCenterBtn = select("#restartCenter");
  const restartEverywhereBtn = select("#restartEverywhere");
  const fullscreenBtn = select("#fullscreen-btn");

  // startButton.mousePressed(() => keyPressed("true"));
  // stopButton.mousePressed(() => keyPressed("false"));
  togglePlayButton.addEventListener("click", togglePlayPause);

  restartCenterBtn.mousePressed(restartCenter);
  restartEverywhereBtn.mousePressed(restartEverywhere);
  fullscreenBtn.mousePressed(toggleFullscreen);
}

function draw() {
  //black
  // background("rgba(0, 0, 0, 0.02)");
  // background(0, 5);
  // background("rgba(138, 154, 91, 0.1)");
  //the slaps brown + white
  // background("rgba(164, 121, 100, 0.02)");
  if (bgColor) {
    background(bgColor);
  } else {
    background("rgba(70, 56, 31, 0.02)");
  }

  loadPixels();

  for (let i = 0; i < num; i++) {
    molds[i].r = moldSize;
    molds[i].update();
    molds[i].display();
  }
}

function togglePlayPause() {
  isRunning = !isRunning; // Toggle state
  let togglePlayButton = document.getElementById("play-toggle-btn");

  if (isRunning) {
    togglePlayButton.innerText = "Stop"; // Change text to "Stop"
    for (let i = 0; i < num; i++) {
      molds[i].stop = false;
    }
    loop();
  } else {
    togglePlayButton.innerText = "Start"; // Change text to "Start"
    for (let i = 0; i < num; i++) {
      molds[i].stop = true;
    }
    noLoop();
  }
}
function windowResized() {
  if (fullscreen()) {
    // If in fullscreen, make the canvas fill the entire screen
    resizeCanvas(windowWidth, windowHeight);
  } else {
    // Apply the original scaling behavior
    let scaleFactor = min(windowWidth / baseWidth, windowHeight / baseHeight);
    let newWidth = baseWidth * scaleFactor;
    let newHeight = baseHeight * scaleFactor;

    if (baseWidth <= windowWidth && baseHeight <= windowHeight) {
      return; // Do nothing if the canvas fits within the screen
    }

    // Ensure the canvas does not go below the minimum size
    newWidth = max(newWidth, 320);
    newHeight = max(newHeight, 213.333);

    resizeCanvas(newWidth, newHeight);
  }
}

function toggleFullscreen() {
  let fs = fullscreen();
  fullscreen(!fs); // Toggle fullscreen mode

  let canvasContainer = document.getElementById("canvas-container");
  let uiElements = document.querySelectorAll("h1, .footer-container");
  let buttonContainer = document.getElementById("button-container");
  let settingsContainer = document.querySelector(".adjust-settings-container");
  let labels = document.querySelectorAll(".adjust-settings-container label");
  let fullscreenBtn = document.getElementById("fullscreen-btn");

  if (!fs) {
    fullscreenBtn.innerText = "Exit Full Screen";

    // Entering fullscreen: Hide UI elements
    uiElements.forEach((el) => (el.style.display = "none"));

    canvasContainer.style.position = "absolute";
    canvasContainer.style.top = "0";
    canvasContainer.style.left = "0";
    canvasContainer.style.width = "100vw";
    canvasContainer.style.height = "100vh";

    let fullscreenSettings = document.createElement("div");
    fullscreenSettings.id = "fullscreen-ui";
    fullscreenSettings.style.position = "absolute";
    fullscreenSettings.style.bottom = "10px";
    fullscreenSettings.style.left = "50%";
    fullscreenSettings.style.transform = "translateX(-50%)";
    fullscreenSettings.style.display = "flex";
    fullscreenSettings.style.alignItems = "flex-end";
    fullscreenSettings.style.gap = "20px";
    fullscreenSettings.style.zIndex = "10";
    fullscreenSettings.style.background = "rgba(0, 0, 0, 0.5)";
    fullscreenSettings.style.padding = "15px";
    // fullscreenSettings.style.marginTop = "0px";
    fullscreenSettings.style.borderRadius = "10px";
    fullscreenSettings.style.transition = "opacity 0.5s ease-in-out"; // Smooth transition
    fullscreenSettings.style.opacity = "1";
    fullscreenSettings.style.width = "max-content";

    fullscreenSettings.appendChild(buttonContainer);
    // fullscreenSettings.appendChild(settingsContainer);

    // Create "Settings" button if it doesn't exist
    if (!settingsButton) {
      settingsButton = document.createElement("button");
      settingsButton.id = "toggle-settings-btn";
      settingsButton.innerText = "Settings";
      settingsButton.style.display = "block";
      settingsButton.addEventListener("click", toggleSettingsPanel);
    }
    fullscreenSettings.appendChild(settingsButton);

    // Adjust settings container styling
    settingsContainer.style.position = "absolute";
    settingsContainer.style.bottom = "61px"; // Right above the settings button
    settingsContainer.style.left = "75%";
    // settingsContainer.style.transform = "translateX(-50%)";
    settingsContainer.style.background = "rgba(0, 0, 0, 0.7)";
    settingsContainer.style.padding = "10px";
    settingsContainer.style.borderRadius = "8px";
    // settingsContainer.style.color = "white";
    settingsContainer.style.display = "none"; // Hidden by default
    settingsContainer.style.zIndex = "11";

    fullscreenSettings.appendChild(settingsContainer);
    document.body.appendChild(fullscreenSettings);

    // Reset individual styles for button & settings containers
    // buttonContainer.style.position = "static";
    // settingsContainer.style.position = "static";

    // buttonContainer.style.display = "flex";
    // buttonContainer.style.alignItems = "center";

    labels.forEach((label) => (label.style.color = "white"));

    hideTimeout = setTimeout(() => {
      fullscreenSettings.style.opacity = "0";
    }, 2000);

    document.addEventListener("mousemove", showUI);

    resizeCanvas(windowWidth, windowHeight);
  } else {
    fullscreenBtn.innerText = "Full Screen";

    // Exiting fullscreen: Show UI elements again
    uiElements.forEach((el) => el.style.removeProperty("display"));

    canvasContainer.style.position = "";
    canvasContainer.style.top = "";
    canvasContainer.style.left = "";
    canvasContainer.style.width = "";
    canvasContainer.style.height = "";

    let contentWrapper = document.querySelector(".buttons-wrapper");
    contentWrapper.appendChild(buttonContainer);
    contentWrapper.appendChild(settingsContainer);

    // Remove the fullscreen container
    let fullscreenSettings = document.getElementById("fullscreen-ui");
    if (fullscreenSettings) fullscreenSettings.remove();

    // let buttonContainer = document.getElementById("button-container");
    // buttonContainer.style.position = "";

    // buttonContainer.style.opacity = "1"; // Ensure visibility
    // settingsContainer.style.opacity = "1";

    settingsContainer.style.display = "flex"; // Restore adjust settings visibility
    buttonContainer.style.opacity = "1";
    settingsContainer.style.position = "";
    settingsContainer.style.background = "";

    labels.forEach((label) => (label.style.color = ""));

    clearTimeout(hideTimeout);
    document.removeEventListener("mousemove", showUI);

    // Resize canvas back to the base size
    resizeCanvas(baseWidth, baseHeight);
  }
}
// Toggle settings panel when clicking the "Settings" button
function toggleSettingsPanel() {
  let settingsContainer = document.querySelector(".adjust-settings-container");
  settingsVisible = !settingsVisible;

  if (settingsVisible) {
    settingsContainer.style.display = "flex";
    settingsContainer.style.opacity = "1";
  } else {
    settingsContainer.style.display = "none";
  }
}

function showUI() {
  let fullscreenSettings = document.getElementById("fullscreen-ui");
  let settingsContainer = document.querySelector(".adjust-settings-container");

  if (!fullscreenSettings) return;

  fullscreenSettings.style.opacity = "1";

  // Reset the hide timeout
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    // Only hide if the user is NOT hovering over adjust-settings-container
    if (!settingsContainer.matches(":hover")) {
      fullscreenSettings.style.opacity = "0";
    }
  }, 2000);
}

function restartCenter() {
  if (bgColor != "rgba(0, 0, 0, 0.02)") {
    background(55, 55, 29);
    bgColor = "rgba(70, 56, 31, 0.02)";
  } else {
    background(0);
    bgColor = "rgba(0, 0, 0, 0.02)";
  }

  molds = []; // Empty the molds array
  for (let i = 0; i < num; i++) {
    molds[i] = new Mold(); // Reinitialize molds
  }

  isRunning = true;
  document.getElementById("play-toggle-btn").innerText = "Stop";
  loop(); // Restart the loop
}

function restartEverywhere() {
  if (bgColor != "rgba(0, 0, 0, 0.02)") {
    background(55, 55, 29);
    bgColor = "rgba(70, 56, 31, 0.02)";
  } else {
    background(0);
    bgColor = "rgba(0, 0, 0, 0.02)";
  }

  molds = []; // Empty the molds array
  for (let i = 0; i < num; i++) {
    molds[i] = new Mold(true); // Reinitialize molds
  }

  isRunning = true;
  document.getElementById("play-toggle-btn").innerText = "Stop";
  loop(); // Restart the loop
}

function updateMoldQuantity(newQuantity) {
  num = newQuantity; // Update global quantity

  // Ensure the molds array has the correct number of instances
  if (molds.length < num) {
    for (let i = molds.length; i < num; i++) {
      molds.push(new Mold());
    }
  } else if (molds.length > num) {
    molds = molds.slice(0, num); // Reduce the array size
  }
}

// Listen for background color selection changes
document
  .getElementById("background-color")
  .addEventListener("change", function (event) {
    bgColor = event.target.value || "rgba(70, 56, 31, 0.02)"; // Default to green if no selection
  });

document
  .getElementById("mold-quantity")
  .addEventListener("input", function (event) {
    let newQuantity = parseInt(event.target.value, 10); // Convert input value to a number
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= 50000) {
      updateMoldQuantity(newQuantity);
    }
  });

document
  .getElementById("screenshot-button")
  .addEventListener("click", function () {
    saveCanvas("mold_screenshot", "png"); // Saves the canvas as 'mold_screenshot.png'
  });
