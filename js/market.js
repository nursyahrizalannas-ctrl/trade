/* ==========================================================================
   MARKET.JS - LOGIKA TRADING, SESI MARKET & SIMULASI AI
   ========================================================================== */

// 1. Fungsi Generate AI Macro Watchlist
function generateRecommendations() {
    const container = document.getElementById('recom-container');
    
    // Tampilkan status loading
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px 0;">🔄 Sinkronisasi dengan AI Logic...</div>`;

    // Simulasi delay 1.2 detik agar terlihat seperti AI sedang berpikir
    setTimeout(() => {
        // Data simulasi (Nanti bisa diganti dengan tarikan API dari backend Anda)
        const aiData = [
            {
                asset: "XAUUSD (GOLD)",
                bias: "BULLISH",
                reason: "Pelemahan DXY pasca rilis inflasi, memicu sentimen pemangkasan suku bunga The Fed.",
            },
            {
                asset: "USDJPY",
                bias: "BEARISH",
                reason: "Potensi intervensi halus BoJ di area resisten psikologis, meredam rally USD.",
            }
        ];

        // Bersihkan loading
        container.innerHTML = ''; 

        // Render data ke dalam HTML
        aiData.forEach(item => {
            let badgeClass = item.bias === 'BULLISH' ? 'bullish' : 'bearish';
            
            const html = `
                <div class="recom-item">
                    <div class="recom-top">
                        <div class="asset-name">${item.asset}</div>
                        <div class="badge ${badgeClass}">${item.bias}</div>
                    </div>
                    <div class="recom-reason">
                        <strong>Katalis Makro:</strong> ${item.reason}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });
    }, 1200);
}

// 2. Fungsi Cek Jam Sesi Market Global (Otomatis berdasarkan waktu user)
function updateMarketSession() {
    const statusDiv = document.getElementById('session-status');
    const now = new Date();
    const utcHour = now.getUTCHours(); 
    
    let session = "Sesi Market Tutup / Libur";
    
    // Logika pembagian waktu (Menggunakan pendekatan standar UTC)
    if (utcHour >= 22 || utcHour < 8) {
        session = "🇯🇵 Sesi Asia (Tokyo/Sydney) - Volatilitas Rendah";
    } else if (utcHour >= 8 && utcHour < 13) {
        session = "🇬🇧 Sesi London (Eropa) - Volatilitas Meningkat";
    } else if (utcHour >= 13 && utcHour < 17) {
        session = "🔥 Sesi Overlap (London & New York) - Volatilitas TINGGI";
    } else if (utcHour >= 17 && utcHour < 22) {
        session = "🇺🇸 Sesi New York (AS) - Volatilitas Sedang";
    }

    statusDiv.innerHTML = session;
}

// 3. Fungsi Simulasi Permintaan AI (Mading, Chat Bebas, Combo)
function askAI(type, query = '') {
    const tg = window.Telegram.WebApp;
    let message = "";
    
    if (type === 'MADING') {
        message = "📰 AI sedang menarik rangkuman Mading Harian dari database institusi...";
    } else if (type === 'FREE_CHAT') {
        if(!query) return tg.showAlert("⚠️ Ketik pertanyaanmu di kolom terlebih dahulu!");
        message = "🤖 Memproses pertanyaan:\n" + query;
    } else if (type === 'COMBO_NEWS') {
        message = "🔥 Menganalisis Combo Rilis Data untuk: \n" + query;
    }

    // Tampilkan pop-up peringatan khas Telegram
    tg.showAlert(message + "\n\n(Pesan ini akan terhubung ke Backend AI Anda nantinya)");
}

// 4. Fungsi Analisis Filter Berita AI
function processNews(action) {
    const tg = window.Telegram.WebApp;
    const name = document.getElementById('newsName').value;
    const act = document.getElementById('newsAct').value || "-";
    const prev = document.getElementById('newsPrev').value || "-";
    const fore = document.getElementById('newsFore').value || "-";

    if(!name) {
        return tg.showAlert("⚠️ Masukkan nama/teks berita terlebih dahulu!");
    }

    let alertMsg = `Aksi: ${action}\nBerita: ${name}\nAct: ${act} | Prev: ${prev} | Fore: ${fore}\n\n✅ Data siap dikirim ke AI Backend!`;
    tg.showAlert(alertMsg);
}

// ==========================================================================
// INISIALISASI SAAT APLIKASI DIBUKA
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Munculkan rekomendasi AI
    generateRecommendations();
    
    // 2. Cek jam market saat ini
    updateMarketSession();
    
    // 3. Update jam market secara otomatis setiap 1 menit (60000 ms)
    setInterval(updateMarketSession, 60000);
});
