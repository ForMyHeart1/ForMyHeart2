/* ============================================================
   lock.js — قفل ماشین‌حساب با یه رمز مخفی ساده
   صفحه‌ی اول همیشه یه ماشین‌حساب واقعیه.
   با محاسبه‌ی یه عبارت خاص (مثلاً 1207+0=)، مستقیم اپ اصلی باز می‌شه.
   ============================================================ */

// این رمز رو به هرچی دوست داری تغییر بده (فقط رقم و عملگر ساده: + - * /)
const SECRET_TRIGGER = "1207+0";

let display = "";

const calcDisplay = document.getElementById("calc-display");

// ---------- منطق ماشین‌حساب واقعی ----------
function calcPress(val){
  if(val === "C"){
    display = "";
  } else if(val === "="){
    evaluateExpression();
    return;
  } else if(val === "⌫"){
    display = display.slice(0, -1);
  } else {
    display += val;
  }
  calcDisplay.textContent = display || "0";
}

function normalized(str){
  return str.trim().replace(/\s/g, "");
}

function evaluateExpression(){
  const raw = normalized(display);

  // ---------- چک کردن رمز مخفی ----------
  if(raw === SECRET_TRIGGER){
    calcDisplay.textContent = "";
    setTimeout(()=>{
      document.getElementById("calc-screen").style.display = "none";
      if(typeof window.unlockRealApp === "function"){
        window.unlockRealApp();
      }
    }, 250);
    return;
  }

  // ---------- محاسبه‌ی واقعی و عادی (همیشه اجرا می‌شه، برای اینکه شبیه ماشین‌حساب واقعی بمونه) ----------
  try{
    if(!/^[0-9+\-*/.() ]+$/.test(raw)){
      calcDisplay.textContent = "Error";
      display = "";
      return;
    }
    const result = Function('"use strict"; return (' + raw + ")")();
    display = String(result);
    calcDisplay.textContent = display;
  } catch(err){
    calcDisplay.textContent = "Error";
    display = "";
  }
}

// ---------- سازگاری با WebViewهای قدیمی ----------
// بعضی WebViewهای اپ‌های APK-شده از CSS aspect-ratio پشتیبانی نمی‌کنن،
// برای همین با جاوااسکریپت مطمئن می‌شیم دکمه‌های ماشین‌حساب همیشه دایره‌ی درست بمونن
function fixCalcButtonSizes(){
  document.querySelectorAll(".calc-btn:not(.zero)").forEach(btn=>{
    const w = btn.offsetWidth;
    if(w > 0){
      btn.style.height = w + "px";
    }
  });
  const zeroBtn = document.querySelector(".calc-btn.zero");
  if(zeroBtn && zeroBtn.offsetWidth > 0){
    zeroBtn.style.height = (zeroBtn.offsetWidth / 2) + "px";
  }
}

window.addEventListener("load", fixCalcButtonSizes);
window.addEventListener("resize", fixCalcButtonSizes);
// یه بار با تاخیر کوچیک هم اجرا می‌شه، چون بعضی WebViewها دیر اندازه‌ی واقعی رو گزارش می‌دن
setTimeout(fixCalcButtonSizes, 200);
