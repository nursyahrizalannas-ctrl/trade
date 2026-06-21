/* ==========================================================================
   UI.JS - KONTROL ANTARMUKA & TELEGRAM
   ========================================================================== */

// 1. Inisialisasi Telegram dengan Pengecekan Aman
if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
    const tg = window.Telegram.WebApp;
    tg.expand();
} else {
    console.warn("Telegram API tidak terdeteksi. Berjalan di mode browser biasa.");
}

// 2. Fungsi Navigasi Tab
function showTab(tabId, element) {
    // Sembunyikan semua konten
    document.querySelectorAll('.content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Tampilkan konten yang dipilih
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Ubah status active di bottom nav
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });

    if (element) {
        element.classList.add('active');
    }
}
