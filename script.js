let selectedTemplate = "";

// اختيار القالب وعرض قسم التعديل
function selectTemplate(templateSrc) {
  selectedTemplate = templateSrc;
  document.getElementById("template-image").src = templateSrc;
  document.getElementById("template-selection").style.display = "none";
  document.getElementById("editor").style.display = "block";
}

// العودة للصفحة الرئيسية (عرض قسم اختيار القالب)
function goHome() {
  document.getElementById("editor").style.display = "none";
  document.getElementById("template-selection").style.display = "flex";
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

// تحديث تكبير/تصغير الصورة المرفوعة
function updateImageZoom(zoomValue) {
  const userImageInner = document.getElementById("user-image-inner");
  userImageInner.style.transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${zoomValue})`;
  currentZoom = zoomValue;
}

// لجعل العناصر قابلة للسحب (النص والإطار الدائري بعد تأكيد)
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

// ---------------------------------------------------
// آلية سحب الصورة داخل الإطار الدائري
// ---------------------------------------------------
let isDraggingImage = false;
let imageOffsetX = 0;
let imageOffsetY = 0;
let currentZoom = 1;

function makeInnerImageDraggable(img) {
  const container = document.getElementById("image-crop-container");

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

// ---------------------------------------------------

window.onload = function() {
  // تفعيل إمكانية السحب للنص
  makeDraggable(document.getElementById("text-element"));
};

// رفع صورة المستخدم وعرضها داخل دائرة
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
      
      // نجعل الصورة الداخلية قابلة للتحريك داخل الإطار
      makeInnerImageDraggable(userImageInner);
    }
    reader.readAsDataURL(file);
  }
}

// عند الضغط على زر "تم" لإقرار موضع الصورة
function confirmImagePosition() {
  // إخفاء زر "تم"
  document.getElementById("confirm-image-group").style.display = "none";
  
  // الآن نجعل الحاوية الدائرية نفسها قابلة للسحب
  makeDraggable(document.getElementById("image-crop-container"));
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
  // لا يوجد رابط مشاركة مباشر لإنستقرام، يمكنك توجيه المستخدم إلى صفحة إنستقرام الخاصة بك أو عرض رسالة
  alert("يرجى نسخ الرابط ومشاركته على إنستقرام");
}

function shareSnapchat() {
  // لا يوجد رابط مشاركة مباشر لسناب شات، يمكنك توجيه المستخدم إلى التطبيق أو عرض رسالة
  alert("يرجى نسخ الرابط ومشاركته على سناب شات");
}

function shareFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}
