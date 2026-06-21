/* ==========================================================================
   UI.JS - KONTROL ANTARMUKA & TELEGRAM
   ========================================================================== */

if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
    const tg = window.Telegram.WebApp;
    tg.expand();
} else {
    console.warn("SYSTEM: Running outside Telegram wrapper. Using browser execution mode.");
}

function showTab(tabId, element) {
    document.querySelectorAll('.content').forEach(tab => {
        tab.classList.remove('active');
    });

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });

    if (element) element.classList.add('active');
}
