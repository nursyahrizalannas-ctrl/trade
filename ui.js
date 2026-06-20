/* ==========================================================================
   UI.JS - KONTROL ANTARMUKA & TELEGRAM
   ========================================================================== */
const tg = window.Telegram.WebApp;
tg.expand(); // Layar penuh

function showTab(tabId, element) {
    document.querySelectorAll('.content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    element.classList.add('active');
}
