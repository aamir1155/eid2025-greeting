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
  const userImage = document.getElementById("user-image");
  if (userImage.style.display !== "none") {
    userImage.style.transform = `scale(${zoomValue})`;
  }
}

// جعل العناصر قابلة للسحب
function makeDraggable(el) {
  el.onmousedown = function(event) {
    let shiftX = event.clientX - el.getBoundingClientRect().left;
    let shiftY = event.clientY - el.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      el.style.left = pageX - shiftX - el.parentElement.getBoundingClientRect().left + "px";
      el.style.top = pageY - shiftY - el.parentElement.getBoundingClientRect().top + "px";
    }

    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      el.onmouseup = null;
    };
  };
  el.ondragstart = function() {
    return false;
  };
}

// تفعيل إمكانية السحب للنص والصورة عند تحميل الصفحة
window.onload = function() {
  makeDraggable(document.getElementById("text-element"));
  makeDraggable(document.getElementById("user-image"));
};

// رفع صورة المستخدم وعرضها داخل دائرة
function uploadUserImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      let userImage = document.getElementById("user-image");
      userImage.src = e.target.result;
      userImage.style.display = "block";
      // إعادة تعيين التكبير للصورة إلى القيمة الافتراضية (1)
      document.getElementById("image-zoom").value = 1;
      userImage.style.transform = "scale(1)";
    }
    reader.readAsDataURL(file);
  }
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
