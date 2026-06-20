/* ==========================================================================
   MARKET.JS - LOGIKA TRADING & AI NEWS ANALYTICS
   ========================================================================== */

// 1. Generate AI Macro Watchlist
function generateRecommendations() {
    const container = document.getElementById('recom-container');
    setTimeout(() => {
        const aiData = [
            { asset: "XAUUSD", bias: "BULLISH", reason: "Sentimen pemangkasan suku bunga & de-dolarisasi memicu akumulasi buy institusi." },
            { asset: "DXY", bias: "BEARISH", reason: "Pelemahan imbal hasil obligasi AS menekan kekuatan indeks Dolar." }
        ];
        container.innerHTML = ''; 
        aiData.forEach(item => {
            let badgeClass = item.bias === 'BULLISH' ? 'bullish' : 'bearish';
            // Styling diubah agar sesuai dengan tema merah-biru
            container.insertAdjacentHTML('beforeend', `
                <div class="recom-item" style="border-left-color: var(--accent-${item.bias==='BULLISH'?'blue':'red'});">
                    <div class="recom-top">
                        <div class="asset-name">${item.asset}</div>
                        <div class="badge ${badgeClass}">${item.bias}</div>
                    </div>
                    <div class="recom-reason"><strong>AI Logic:</strong> ${item.reason}</div>
                </div>
            `);
        });
    }, 1000);
}

// 2. Cek Jam Sesi Market Global
function updateMarketSession() {
    const statusDiv = document.getElementById('session-status');
    const utcHour = new Date().getUTCHours(); 
    let session = "Sesi Market Tutup";
    
    if (utcHour >= 22 || utcHour < 8) session = "🇯🇵 SESI ASIA - Volatilitas Rendah";
    else if (utcHour >= 8 && utcHour < 13) session = "🇬🇧 SESI LONDON - Volatilitas Naik";
    else if (utcHour >= 13 && utcHour < 17) session = "🔥 NEW YORK OVERLAP - Volatilitas Tinggi";
    else if (utcHour >= 17 && utcHour < 22) session = "🇺🇸 SESI NEW YORK - Volatilitas Sedang";

    statusDiv.innerHTML = session;
}

// 3. Fetch Live News dari Investing.com
function fetchLiveNews() {
    const container = document.getElementById('live-news-container');
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 15px 0;">⏳ Menarik berita live...</div>`;

    const rssUrl = 'https://id.investing.com/rss/news_285.rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                container.innerHTML = '';
                const articles = data.items.slice(0, 5); // Ambil 5 berita
                
                articles.forEach(article => {
                    const pubDate = new Date(article.pubDate);
                    const timeString = pubDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    const title = article.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/'/g, "\\'");
                    
                    // Klik pada kotak berita langsung memanggil modal ringkasan AI
                    const html = `
                        <div class="news-item" onclick="openNewsModal('${title}')">
                            <div class="news-time">🕒 Hari ini, ${timeString} WIB</div>
                            <div class="news-title">${article.title}</div>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', html);
                });
            }
        }).catch(() => {
            container.innerHTML = `<div style="text-align: center; color: var(--accent-red); font-size: 12px;">Gagal terhubung ke Investing.com</div>`;
        });
}

// 4. LOGIKA MODAL POP-UP RINGKASAN BERITA (3 Paragraf Spesifik)
function openNewsModal(newsTitle) {
    const modal = document.getElementById('news-modal');
    const titleEl = document.getElementById('modal-news-title');
    const contentEl = document.getElementById('modal-news-content');

    // Tampilkan Modal
    modal.classList.add('show');
    titleEl.innerText = newsTitle;
    contentEl.innerHTML = `⏳ AI Antipraktis sedang menyusun ringkasan...`;

    // Simulasi AI memproses (Delay 1 detik)
    setTimeout(() => {
        // Logika sederhana mendeteksi sentimen berdasarkan kata di judul
        let sentiment = "Netral";
        let color = "var(--text-muted)";
        const lowerTitle = newsTitle.toLowerCase();
        
        if (lowerTitle.includes("naik") || lowerTitle.includes("tinggi") || lowerTitle.includes("bullish") || lowerTitle.includes("positif")) {
            sentiment = "Bullish / Ekspansif"; color = "var(--accent-blue)";
        } else if (lowerTitle.includes("turun") || lowerTitle.includes("anjlok") || lowerTitle.includes("bearish") || lowerTitle.includes("negatif") || lowerTitle.includes("inflasi")) {
            sentiment = "Bearish / Tertekan"; color = "var(--accent-red)";
        }

        // Generate 3 Paragraf Ringkasan
        const p1 = `<p><strong style="color: white;">1. Inti Sentimen:</strong> Berdasarkan analisis narasi, berita ini membawa dampak sentimen makro yang secara umum bersifat <span style="color: ${color}; font-weight: bold;">${sentiment}</span>. Rilis atau kejadian ini mencerminkan adanya pergeseran arus likuiditas yang diakibatkan oleh perubahan pandangan pelaku pasar terhadap risiko ekonomi saat ini.</p>`;
        
        const p2 = `<p><strong style="color: white;">2. Dampak Aset (Gold/USD):</strong> Kondisi ini secara spesifik memengaruhi indeks Dolar (DXY). Jika data ini memicu penguatan DXY, maka aset *safe-haven* seperti XAUUSD (Gold) berisiko mengalami tekanan jual dalam jangka pendek. Sebaliknya, pelemahan nilai aset AS akan membuka ruang bagi aliran dana masuk ke komoditas.</p>`;
        
        const p3 = `<p><strong style="color: white;">3. Tindakan Institusi (Smart Money):</strong> Algoritma Antipraktis mendeteksi bahwa area *supply* dan *demand* utama akan segera diuji ulang (re-test). Trader disarankan untuk tidak *entry* secara agresif saat volatilitas berlangsung, melainkan menunggu harga kembali ke level institusional *order block* di sesi Overlap London - New York.</p>`;

        contentEl.innerHTML = p1 + p2 + p3;
    }, 1000);
}

// Tutup Modal
function closeNewsModal() {
    document.getElementById('news-modal').classList.remove('show');
}

// 5. Alert AI Sederhana untuk Tab Lain
function askAI(type, query = '') {
    const tg = window.Telegram.WebApp;
    tg.showAlert("Fitur " + type + " sedang diproses oleh Backend AI Antipraktis...");
}

// Inisialisasi Saat Buka App
document.addEventListener("DOMContentLoaded", () => {
    generateRecommendations();
    updateMarketSession();
    fetchLiveNews();
    setInterval(updateMarketSession, 60000);
    setInterval(fetchLiveNews, 300000); // Refresh berita tiap 5 menit
});
