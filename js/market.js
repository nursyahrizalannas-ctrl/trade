/* ==========================================================================
   MARKET.JS - LOGIKA TRADING & INSTITUTIONAL NEWS ANALYTICS
   ========================================================================== */

let globalNewsData = []; // Array untuk menyimpan data berita asli

// 1. Generate AI Macro Watchlist (Simulasi)
function generateRecommendations() {
    const container = document.getElementById('recom-container');
    setTimeout(() => {
        const aiData = [
            { asset: "XAUUSD", bias: "BULLISH", reason: "Sentimen pemangkasan suku bunga & pergerakan likuiditas menuju aset safe-haven." },
            { asset: "DXY", bias: "BEARISH", reason: "Pelemahan yield obligasi AS menekan kekuatan USD di area supply utama." }
        ];
        container.innerHTML = ''; 
        aiData.forEach(item => {
            let badgeClass = item.bias === 'BULLISH' ? 'bullish' : 'bearish';
            container.insertAdjacentHTML('beforeend', `
                <div class="recom-item" style="border-left-color: var(--accent-${item.bias==='BULLISH'?'blue':'red'});">
                    <div class="recom-top">
                        <div class="asset-name">${item.asset}</div>
                        <div class="badge ${badgeClass}">${item.bias}</div>
                    </div>
                    <div class="recom-reason"><strong>Smart Money Logic:</strong> ${item.reason}</div>
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
    else if (utcHour >= 8 && utcHour < 13) session = "🇬🇧 SESI LONDON - Menjemput Likuiditas";
    else if (utcHour >= 13 && utcHour < 17) session = "🔥 NEW YORK OVERLAP - Volatilitas Puncak";
    else if (utcHour >= 17 && utcHour < 22) session = "🇺🇸 SESI NEW YORK - Distribusi Harga";

    statusDiv.innerHTML = session;
}

// 3. Fetch Live News & Simpan ke Array
function fetchLiveNews() {
    const container = document.getElementById('live-news-container');
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 15px 0;">⏳ Sinkronisasi data institusi...</div>`;

    const rssUrl = 'https://id.investing.com/rss/news_285.rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                container.innerHTML = '';
                globalNewsData = data.items.slice(0, 5); // Ambil 5 berita dan simpan
                
                globalNewsData.forEach((article, index) => {
                    const pubDate = new Date(article.pubDate);
                    const timeString = pubDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    
                    // Passing Index (angka) ke fungsi onclick agar terhindar dari error kutipan teks
                    const html = `
                        <div class="news-item" onclick="openNewsModal(${index})">
                            <div class="news-time">🕒 Hari ini, ${timeString} WIB</div>
                            <div class="news-title">${article.title}</div>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', html);
                });
            }
        }).catch(() => {
            container.innerHTML = `<div style="text-align: center; color: var(--accent-red); font-size: 12px;">Koneksi terputus ke penyedia data.</div>`;
        });
}

// 4. Logika Profesional Analisis AI Institusi
function openNewsModal(newsIndex) {
    const article = globalNewsData[newsIndex]; // Ambil data dari array
    const modal = document.getElementById('news-modal');
    const titleEl = document.getElementById('modal-news-title');
    const excerptEl = document.getElementById('modal-news-excerpt');
    const contentEl = document.getElementById('modal-news-content');
    const btnLink = document.getElementById('modal-link-btn');

    modal.classList.add('show');
    titleEl.innerText = article.title;
    
    // Bersihkan deskripsi asli dari kode HTML gambar/link bawaan Investing
    let cleanDesc = article.description.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...";
    excerptEl.innerText = `"${cleanDesc}"`;

    contentEl.innerHTML = `<div style="text-align: center;">⏳ AI Sedang Menganalisis...</div>`;

    // Tombol untuk baca ke website asli
    btnLink.onclick = function() { window.open(article.link, '_blank'); };

    setTimeout(() => {
        const titleLower = article.title.toLowerCase();
        let sentiment = "Netral / Ranging";
        let sentimentColor = "var(--text-muted)";
        
        // Deteksi Keyword Profesional
        if (titleLower.match(/naik|tinggi|bullish|positif|lonjak|pertumbuhan/)) {
            sentiment = "Ekspansif (Bullish USD/Risk-On)"; 
            sentimentColor = "var(--accent-blue)";
        } else if (titleLower.match(/turun|anjlok|bearish|negatif|inflasi|krisis|lemah/)) {
            sentiment = "Tertekan (Bearish USD/Safe-Haven On)"; 
            sentimentColor = "var(--accent-red)";
        }

        // Susun 3 Paragraf Standar Institusi (Konteks, Dampak Aset, Eksekusi)
        const p1 = `<div><strong style="color: var(--accent-blue);">1. Konteks Makro:</strong><br> Berita ini mengonfirmasi arus data yang berpotensi memicu bias sentimen <span style="color: ${sentimentColor}; font-weight: bold;">${sentiment}</span>. Katalis ini kemungkinan besar akan digunakan oleh institusi sebagai alasan fundamental untuk menyesuaikan portofolio likuiditas mereka.</div>`;
        
        const p2 = `<div><strong style="color: var(--accent-red);">2. Dampak Aset (XAUUSD / DXY):</strong><br> Jika sentimen ini terbukti melemahkan indeks Dolar (DXY), maka terdapat probabilitas tinggi aliran dana (Smart Money) berpindah ke aset safe-haven seperti Gold. Sebaliknya, penguatan narasi pada data ini dapat menekan harga komoditas dalam jangka pendek.</div>`;
        
        const p3 = `<div><strong style="color: #fff;">3. Setup & Eksekusi:</strong><br> Antipraktis AI Logic menyarankan Anda untuk **TIDAK FOMO**. Tunggu hingga harga bereaksi, menciptakan manipulasi awal (Liquidity Sweep), lalu cari peluang entry hanya di area *Institutional Order Block* terdekat saat sesi London atau New York dibuka.</div>`;

        contentEl.innerHTML = p1 + p2 + p3;
    }, 1200);
}

// Tutup Modal
function closeNewsModal() {
    document.getElementById('news-modal').classList.remove('show');
}

// 5. Fitur Lain (Tanya AI / Combo)
function askAI(type, query = '') {
    const tg = window.Telegram.WebApp;
    tg.showAlert("Fitur " + type + " sedang diproses di server utama Antipraktis Academy...");
}

// Jalankan otomatis saat buka WebApp
document.addEventListener("DOMContentLoaded", () => {
    generateRecommendations();
    updateMarketSession();
    fetchLiveNews();
    
    // Auto-update waktu
    setInterval(updateMarketSession, 60000); 
    setInterval(fetchLiveNews, 300000); 
});
