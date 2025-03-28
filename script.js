let selectedTemplate = "";
var imageConfirmed = false;  // لتعقب ما إذا تم تأكيد الصورة أم لا

// اختيار القالب وعرض قسم التعديل
function selectTemplate(templateSrc) {
  selectedTemplate = templateSrc;
  document.getElementById("template-image").src = templateSrc;
  document.getElementById("template-selection").style.display = "none";
  document.getElementById("editor").style.display = "block";
}

// العودة للصفحة الرئيسية مع إعادة تحميل الإعدادات (reset)
function goHome() {
  location.reload(); // يعيد تحميل الصفحة لإعادة تعيين جميع الإعدادات
}

// تحديث النص المعروض على القالب
function updateText() {
  const text = document.getElementById("user-text").value;
  document.getElementById("text-element").innerText = text;
}

// تغيير حجم الخط
function updateFontSize(size) {
  document.getElementById("text-element").style.fontSize = size + "px";
}

// تغيير لون الخط
function updateFontColor(color) {
  document.getElementById("text-element").style.color = color;
}

// تغيير نوع الخط
function updateFontType(font) {
  document.getElementById("text-element").style.fontFamily = font;
}

// تحديث تكبير/تصغير الصورة
function updateImageZoom(zoomValue) {
  currentZoom = zoomValue;
  if (!imageConfirmed) {
    // قبل التأكيد، نقوم بتعديل الصورة الداخلية فقط
    const userImageInner = document.getElementById("user-image-inner");
    userImageInner.style.transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${zoomValue})`;
  } else {
    // بعد التأكيد، نقوم بتكبير/تصغير الحاوية الدائرية (الصورة مع الإطار)
    const container = document.getElementById("image-crop-container");
    container.style.transform = `scale(${zoomValue})`;
  }
}

// لجعل العناصر قابلة للسحب (النص أو الحاوية)
function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // للماوس
  el.addEventListener('mousedown', function(e) {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - el.getBoundingClientRect().left;
    offsetY = e.clientY - el.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    let parentRect = el.parentElement.getBoundingClientRect();
    let x = e.clientX - parentRect.left - offsetX;
    let y = e.clientY - parentRect.top - offsetY;
    el.style.left = x + "px";
    el.style.top = y + "px";
  });

  document.addEventListener('mouseup', function(e) {
    isDragging = false;
  });

  // للّمس على الجوال
  el.addEventListener('touchstart', function(e) {
    e.preventDefault();
    isDragging = true;
    let touch = e.touches[0];
    offsetX = touch.clientX - el.getBoundingClientRect().left;
    offsetY = touch.clientY - el.getBoundingClientRect().top;
  }, { passive: false });

  el.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    e.preventDefault();
    let touch = e.touches[0];
    let parentRect = el.parentElement.getBoundingClientRect();
    let x = touch.clientX - parentRect.left - offsetX;
    let y = touch.clientY - parentRect.top - offsetY;
    el.style.left = x + "px";
    el.style.top = y + "px";
  }, { passive: false });

  el.addEventListener('touchend', function(e) {
    isDragging = false;
  }, { passive: false });
}

// دعم السحب للنص عند تحميل الصفحة
window.onload = function() {
  makeDraggable(document.getElementById("text-element"));
};

// آلية سحب الصورة داخل الإطار الدائري
let isDraggingImage = false;
let imageOffsetX = 0;
let imageOffsetY = 0;
let currentZoom = 1;

function makeInnerImageDraggable(img) {
  // للماوس
  img.addEventListener('mousedown', function(e) {
    e.preventDefault();
    isDraggingImage = true;
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDraggingImage) return;
    e.preventDefault();
    moveDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', function(e) {
    isDraggingImage = false;
  });

  // للّمس على الجوال
  img.addEventListener('touchstart', function(e) {
    e.preventDefault();
    isDraggingImage = true;
    let touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: false });

  img.addEventListener('touchmove', function(e) {
    if (!isDraggingImage) return;
    e.preventDefault();
    let touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
  }, { passive: false });

  img.addEventListener('touchend', function(e) {
    isDraggingImage = false;
  }, { passive: false });
}

let startX, startY;

function startDrag(clientX, clientY) {
  startX = clientX;
  startY = clientY;
}

function moveDrag(clientX, clientY) {
  let dx = clientX - startX;
  let dy = clientY - startY;
  startX = clientX;
  startY = clientY;
  
  imageOffsetX += dx;
  imageOffsetY += dy;

  const img = document.getElementById("user-image-inner");
  img.style.transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${currentZoom})`;
}

// رفع صورة المستخدم وعرضها داخل الإطار الدائري
function uploadUserImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      let container = document.getElementById("image-crop-container");
      let userImageInner = document.getElementById("user-image-inner");
      
      userImageInner.src = e.target.result;
      container.style.display = "block";
      
      // إعادة القيم الافتراضية
      document.getElementById("image-zoom").value = 1;
      imageOffsetX = 0;
      imageOffsetY = 0;
      currentZoom = 1;
      userImageInner.style.transform = "translate(0,0) scale(1)";
      
      // إظهار زر "تم"
      document.getElementById("confirm-image-group").style.display = "block";
      
      // جعل الصورة الداخلية قابلة للسحب داخل الإطار
      makeInnerImageDraggable(userImageInner);
    }
    reader.readAsDataURL(file);
  }
}

// عند الضغط على زر "تم" لإقرار موضع الصورة
function confirmImagePosition() {
  // إخفاء زر "تم"
  document.getElementById("confirm-image-group").style.display = "none";
  let container = document.getElementById("image-crop-container");
  // إزالة الإطار الأبيض من الحاوية بعد التأكيد
  container.style.border = "none";
  imageConfirmed = true;
  // جعل الحاوية الدائرية نفسها قابلة للسحب
  makeDraggable(container);
}

// تحميل الصورة المجمعة للمعايدة باستخدام html2canvas
function downloadImage() {
  let container = document.getElementById("canvas-container");
  html2canvas(container).then(canvas => {
    let link = document.createElement("a");
    link.download = "معايدة_عيد_الفطر_2025.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

// مشاركة المعايدة (مثال توضيحي)
function shareImage() {
  downloadImage();
  alert("تم إنشاء الصورة، قم بمشاركتها عبر وسائل التواصل الاجتماعي");
}

// وظائف المشاركة على وسائل التواصل
function shareWhatsApp() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://api.whatsapp.com/send?text=${url}`, '_blank');
}

function shareInstagram() {
  alert("يرجى نسخ الرابط ومشاركته على إنستقرام");
}

function shareSnapchat() {
  alert("يرجى نسخ الرابط ومشاركته على سناب شات");
}

function shareFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}
