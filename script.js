let selectedTemplate = "";
var imageConfirmed = false;
let currentZoom = 1;
let imageOffsetX = 0;
let imageOffsetY = 0;

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

function updateImageZoom(zoomValue) {
  currentZoom = zoomValue;
  const transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${zoomValue})`;
  document.getElementById("user-image-inner").style.transform = transform;
  if (imageConfirmed) {
    document.getElementById("image-crop-container").style.transform = `scale(${zoomValue})`;
  }
}

function makeDraggable(el) {
  let isDragging = false, startX, startY;

  function startDrag(e) {
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX - el.offsetLeft;
    startY = touch.clientY - el.offsetTop;
    isDragging = true;
  }

  function dragMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    el.style.left = `${touch.clientX - startX}px`;
    el.style.top = `${touch.clientY - startY}px`;
  }

  function endDrag() {
    isDragging = false;
  }

  el.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', endDrag);

  el.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', dragMove, { passive: false });
  document.addEventListener('touchend', endDrag, { passive: false });
}

window.onload = () => {
  makeDraggable(document.getElementById("text-element"));
};

function makeInnerImageDraggable(img) {
  let isDraggingImage = false, startX, startY;

  function startDrag(e) {
    if (imageConfirmed) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    isDraggingImage = true;
  }

  function moveDrag(e) {
    if (!isDraggingImage || imageConfirmed) return;
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    imageOffsetX += dx;
    imageOffsetY += dy;
    img.style.transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${currentZoom})`;
    startX = touch.clientX;
    startY = touch.clientY;
  }

  function endDrag() {
    isDraggingImage = false;
  }

  img.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', moveDrag);
  document.addEventListener('mouseup', endDrag);

  img.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', moveDrag, { passive: false });
  document.addEventListener('touchend', endDrag, { passive: false });
}

function uploadUserImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        document.getElementById("user-image-inner").src = e.target.result;
        document.getElementById("image-crop-container").style.display = "block";
        document.getElementById("confirm-image-group").style.display = "block";
        document.getElementById("image-zoom").value = currentZoom = 1;
        imageOffsetX = imageOffsetY = 0;
        makeInnerImageDraggable(document.getElementById("user-image-inner"));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function confirmImagePosition() {
  const container = document.getElementById("image-crop-container");
  html2canvas(container, { backgroundColor: null }).then(canvas => {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    const dataURL = canvas.toDataURL();
    document.getElementById("user-image-inner").src = dataURL;
    imageConfirmed = true;
    document.getElementById("confirm-image-group").style.display = "none";
    container.style.border = "none";
    document.getElementById("user-image-inner").style.pointerEvents = "none";
    makeDraggable(container);
  });
}
