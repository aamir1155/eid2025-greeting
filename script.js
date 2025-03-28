let selectedTemplate = "";
var imageConfirmed = false;

function selectTemplate(templateSrc) {
  selectedTemplate = templateSrc;
  document.getElementById("template-image").src = templateSrc;
  document.getElementById("template-selection").style.display = "none";
  document.getElementById("editor").style.display = "block";
}

function goHome() {
  location.reload();
}

function updateText() {
  const text = document.getElementById("user-text").value;
  document.getElementById("text-element").innerText = text;
}

function updateFontSize(size) {
  document.getElementById("text-element").style.fontSize = size + "px";
}

function updateFontColor(color) {
  document.getElementById("text-element").style.color = color;
}

function updateFontType(font) {
  document.getElementById("text-element").style.fontFamily = font;
}

let currentZoom = 1;
let imageOffsetX = 0, imageOffsetY = 0;

function updateImageZoom(zoomValue) {
  currentZoom = zoomValue;
  if (!imageConfirmed) {
    document.getElementById("user-image-inner").style.transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${zoomValue})`;
  } else {
    document.getElementById("image-crop-container").style.transform = `scale(${zoomValue})`;
  }
}

function makeDraggable(el) {
  let isDragging = false, offsetX, offsetY;

  const startDragging = e => {
    e.preventDefault();
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    offsetX = touch.clientX - el.getBoundingClientRect().left;
    offsetY = touch.clientY - el.getBoundingClientRect().top;
  };

  const duringDragging = e => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const parentRect = el.parentElement.getBoundingClientRect();
    el.style.left = (touch.clientX - parentRect.left - offsetX) + "px";
    el.style.top = (touch.clientY - parentRect.top - offsetY) + "px";
  };

  const stopDragging = () => { isDragging = false; };

  el.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', duringDragging);
  document.addEventListener('mouseup', stopDragging);

  el.addEventListener('touchstart', startDragging, { passive: false });
  document.addEventListener('touchmove', duringDragging, { passive: false });
  document.addEventListener('touchend', stopDragging, { passive: false });
}

window.onload = () => {
  makeDraggable(document.getElementById("text-element"));
};

function makeInnerImageDraggable(img) {
  let isDraggingImage = false, startX, startY;

  img.onmousedown = img.ontouchstart = e => {
    if (imageConfirmed) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    isDraggingImage = true;
  };

  document.onmousemove = document.ontouchmove = e => {
    if (!isDraggingImage || imageConfirmed) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    imageOffsetX += dx;
    imageOffsetY += dy;
    img.style.transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${currentZoom})`;
    startX = touch.clientX;
    startY = touch.clientY;
  };

  document.onmouseup = document.ontouchend = () => isDraggingImage = false;
}

function uploadUserImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;

        const ctx = canvas.getContext('2d');
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx.clip();

        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);

        document.getElementById("user-image-inner").src = canvas.toDataURL();
        document.getElementById("image-crop-container").style.display = "block";
        document.getElementById("image-zoom").value = currentZoom = 1;
        imageOffsetX = imageOffsetY = 0;

        document.getElementById("confirm-image-group").style.display = "block";
        makeInnerImageDraggable(document.getElementById("user-image-inner"));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function confirmImagePosition() {
  document.getElementById("confirm-image-group").style.display = "none";
  document.getElementById("image-crop-container").style.border = "none";
  imageConfirmed = true;
  document.getElementById("user-image-inner").style.pointerEvents = "none";
  makeDraggable(document.getElementById("image-crop-container"));
}
