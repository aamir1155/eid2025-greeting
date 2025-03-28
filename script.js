let selectedTemplate = "";
var imageConfirmed = false;  // لتتبع تأكيد موضع الصورة

// اختيار القالب وعرض قسم التعديل
function selectTemplate(templateSrc) {
  selectedTemplate = templateSrc;
  document.getElementById("template-image").src = templateSrc;
  document.getElementById("template-selection").style.display = "none";
  document.getElementById("editor").style.display = "block";
}

// العودة للصفحة الرئيسية مع إعادة تحميل الإعدادات (reset)
function goHome() {
  location.reload(); // يعيد تحميل الصفحة بالكامل لإعادة تعيين الإعدادات
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

// -----------------------------------------------------------------------------------
// التعامل مع تكبير/تصغير الصورة (قبل/بعد التأكيد)
let currentZoom = 1;

function updateImageZoom(zoomValue) {
  currentZoom = zoomValue;
  if (!imageConfirmed) {
    // قبل التأكيد، نعدّل الصورة الداخلية فقط
    const userImageInner = document.getElementById("user-image-inner");
    userImageInner.style.transform = `translate(${imageOffsetX}px, ${imageOffsetY}px) scale(${zoomValue})`;
  } else {
    // بعد التأكيد، نعدّل الحاوية الدائرية ككل
    const container = document.getElementById("image-crop-container");
    container.style.transform = `scale(${zoomValue})`;
  }
}

// -----------------------------------------------------------------------------------
// جعل العناصر قابلة للسحب (للنص أو للحاوية بعد التأكيد)
function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // أحداث الماوس
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

  // أحداث اللمس
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

// -----------------------------------------------------------------------------------
// تفعيل سحب النص عند تحميل الصفحة
window.onload = function() {
  makeDraggable(document.getElementById("text-element"));
};

// -----------------------------------------------------------------------------------
// سحب الصورة داخل الإطار الدائري قبل التأكيد
let isDraggingImage = false;
let imageOffsetX = 0;
let imageOffsetY = 0;

function makeInnerImageDraggable(img) {
  // أحداث الماوس
  img.addEventListener('mousedown', function(e) {
    if (imageConfirmed) return; // منع السحب بعد التأكيد
    e.preventDefault();
    isDraggingImage = true;
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDraggingImage || imageConfirmed) return;
    e.preventDefault();
    moveDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', function(e) {
    isDraggingImage = false;
  });

  // أحداث اللمس
  img.addEventListener('touchstart', function(e) {
    if (imageConfirmed) return;
    e.preventDefault();
    isDraggingImage = true;
    let touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: false });

  img.addEventListener('touchmove', function(e) {
    if (!isDraggingImage || imageConfirmed) return;
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

// -----------------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------------
// عند الضغط على زر "تم" لإقرار موضع الصورة
function confirmImagePosition() {
  document.getElementById("confirm-image-group").style.display = "none"; // إخفاء زر "تم"
  let container = document.getElementById("image-crop-container");
  container.style.border = "none"; // إزالة الإطار الأبيض من الحاوية بعد التأكيد

  imageConfirmed = true;
  // تعطيل سحب الصورة الداخلية بعد التأكيد
  document.getElementById("user-image-inner").style.pointerEvents = "none";

  // تمكين سحب الحاوية الدائرية ككل داخل القالب
  makeDraggable(container);
}

// -----------------------------------------------------------------------------------
// تحميل الصورة المجمعة للمعايدة باستخدام html2canvas
// مع إعادة رسم المنطقة الدائرية بضبط موضعها وأبعادها بناءً على معامل التحجيم
function downloadImage() {
  // إخفاء تلميح السحب قبل الالتقاط
  let mobileHint = document.querySelector('.mobile-hint');
  let originalDisplay = mobileHint.style.display;
  mobileHint.style.display = "none";

  let container = document.getElementById("canvas-container");
  html2canvas(container).then(canvas => {
    let containerRect = container.getBoundingClientRect();

    // أبعاد الـ canvas التي أُنشئت من html2canvas (قد تكون أكبر بسبب devicePixelRatio)
    let cWidth = canvas.width;
    let cHeight = canvas.height;

    // حساب معامل التحجيم (scale) بين حجم العنصر الفعلي وحجم الـ canvas
    let scaleX = cWidth / containerRect.width;
    let scaleY = cHeight / containerRect.height;

    // الحصول على معلومات الحاوية الدائرية
    let circElement = document.getElementById("image-crop-container");
    let circRect = circElement.getBoundingClientRect();

    // حساب موضع الحاوية الدائرية على الـ canvas
    // (استخدام الفرق بين إحداثيات الحاوية والديف الرئيسي، مع ضربها في معامل التحجيم)
    let relX = (circRect.left - containerRect.left) * scaleX;
    let relY = (circRect.top - containerRect.top) * scaleY;
    let relWidth = circRect.width * scaleX; // يفترض أن العرض = الارتفاع

    // إنشاء canvas مؤقتة
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = cWidth;
    tempCanvas.height = cHeight;
    let tempCtx = tempCanvas.getContext('2d');

    // رسم الصورة الكاملة كما هي
    tempCtx.drawImage(canvas, 0, 0);

    // إنشاء canvas للدائرة
    let circCanvas = document.createElement('canvas');
    circCanvas.width = relWidth;
    circCanvas.height = relWidth;
    let circCtx = circCanvas.getContext('2d');

    // إنشاء قناع دائري
    circCtx.beginPath();
    circCtx.arc(relWidth/2, relWidth/2, relWidth/2, 0, Math.PI * 2, true);
    circCtx.closePath();
    circCtx.clip();

    // رسم الجزء الخاص بالحاوية الدائرية من الصورة الأصلية
    circCtx.drawImage(
      canvas,
      relX, relY,       // موضع البداية في الصورة الأصل
      relWidth, relWidth, // حجم الجزء المقتطع من الصورة
      0, 0,             // موضع البداية على circCanvas
      relWidth, relWidth // حجم الرسم على circCanvas
    );

    // استبدال المنطقة الدائرية في tempCanvas بالصورة الدائرية
    tempCtx.clearRect(relX, relY, relWidth, relWidth);
    tempCtx.drawImage(circCanvas, relX, relY);

    // تحويل النتيجة إلى رابط تحميل
    let link = document.createElement("a");
    link.download = "معايدة_عيد_الفطر_2025.png";
    link.href = tempCanvas.toDataURL();
    link.click();

    // استعادة تلميح السحب بعد الالتقاط
    mobileHint.style.display = originalDisplay;
  });
}

// -----------------------------------------------------------------------------------
// مشاركة المعايدة: مشاركة الصورة النهائية نفسها باستخدام Web Share API (إذا كانت مدعومة)
function shareImage() {
  html2canvas(document.getElementById("canvas-container")).then(canvas => {
      canvas.toBlob(blob => {
          const filesArray = [new File([blob], 'greeting.png', { type: blob.type })];
          if (navigator.canShare && navigator.canShare({ files: filesArray })) {
              navigator.share({
                  files: filesArray,
                  title: 'معايدة عيد الفطر 2025',
                  text: 'شارك المعايدة'
              }).then(() => console.log('تمت المشاركة بنجاح'))
              .catch((error) => console.error('خطأ في المشاركة:', error));
          } else {
              alert("مشاركة الصورة غير مدعومة في هذا المتصفح.");
          }
      }, 'image/png');
  });
}

// -----------------------------------------------------------------------------------
// وظائف المشاركة على وسائل التواصل (في حال عدم دعم Web Share API)
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
