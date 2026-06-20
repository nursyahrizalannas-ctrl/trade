// js/ui.js - Logika Antarmuka (UI)

// Fungsi untuk berpindah tab
function showTab(tabId, element) {
    // 1. Sembunyikan semua konten tab
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 2. Hapus status 'active' (warna biru) dari semua tombol di bawah
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 3. Tampilkan tab yang dipilih dengan jeda sedikit untuk animasi
    setTimeout(() => { 
        document.getElementById(tabId).classList.add('active'); 
    }, 50);
    
    // 4. Jadikan tombol yang diklik menjadi 'active' (biru)
    element.classList.add('active');
    
    // 5. Scroll ke atas & berikan getaran haptic jika dibuka di Telegram
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.Telegram && window.Telegram.WebApp) {
        Telegram.WebApp.HapticFeedback.selectionChanged();
    }
}
