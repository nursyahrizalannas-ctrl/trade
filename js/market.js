/* ==========================================================================
   MARKET.JS - INSTITUTIONAL DATA ANALYTICS & LOGIC
   ========================================================================== */

let globalNewsData = []; 

// 1. Generate Watchlist
function generateRecommendations() {
    const container = document.getElementById('recom-container');
    setTimeout(() => {
        const aiData = [
            { asset: "XAUUSD", bias: "BULLISH", reason: "Akumulasi terdeteksi pada level discount pasca-rilis data makro. Likuiditas bergerak menuju safe-haven." },
            { asset: "DXY", bias: "BEARISH", reason: "Penolakan (rejection) pada area supply premium harian. Yield obligasi mengkonfirmasi pelemahan." }
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
                    <div class="recom-reason"><strong style="color:#fff;">LOGIC:</strong> ${item.reason}</div>
                </div>
            `);
        });
    }, 1200);
}

// 2. Market Session
function updateMarketSession() {
    const statusDiv = document.getElementById('session-status');
    const utcHour = new Date().getUTCHours(); 
    let session = "OFF-MARKET HOURS";
    
    if (utcHour >= 22 || utcHour < 8) session = "ASIAN SESSION - ACCUMULATION PHASE";
    else if (utcHour >= 8 && utcHour < 13) session = "LONDON SESSION - LIQUIDITY HUNT";
    else if (utcHour >= 13 && utcHour < 17) session = "NEW YORK OVERLAP - HIGH VOLATILITY";
    else if (utcHour >= 17 && utcHour < 22) session = "NEW YORK SESSION - DISTRIBUTION";

    statusDiv.innerHTML = session;
}

// 3. Fetch News 
function fetchLiveNews() {
    const container = document.getElementById('live-news-container');
    container.innerHTML = `
        <div class="loading-state">
            <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_t9gk0703.json" background="transparent" speed="1" style="width: 40px; height: 40px; margin: 0 auto;" loop autoplay></lottie-player>
            <span>Sinkronisasi RSS Feed...</span>
        </div>`;

    // Menggabungkan beberapa kata kunci dalam analisis, kita ambil feed general ekonomi
    const rssUrl = 'https://id.investing.com/rss/news_285.rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                container.innerHTML = '';
                globalNewsData = data.items.slice(0, 7); // Ambil 7 berita
                
                globalNewsData.forEach((article, index) => {
                    const pubDate = new Date(article.pubDate);
                    const timeString = pubDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    
                    const html = `
                        <div class="news-item" onclick="openNewsModal(${index})">
                            <div class="news-time">PUBLISHED: ${timeString} WIB</div>
                            <div class="news-title">${article.title}</div>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', html);
                });
            }
        }).catch(() => {
            container.innerHTML = `<div style="loading-state">KONEKSI NODE GAGAL. SILAKAN REFRESH.</div>`;
        });
}

// 4. Analisis Profesional AI (Fakta, Kesinambungan, Proyeksi)
function openNewsModal(newsIndex) {
    const article = globalNewsData[newsIndex]; 
    const modal = document.getElementById('news-modal');
    const titleEl = document.getElementById('modal-news-title');
    const contentEl = document.getElementById('modal-news-content');
    const loaderEl = document.getElementById('modal-loader');
    const btnLink = document.getElementById('modal-link-btn');

    // Setup Tampilan Awal
    modal.classList.add('show');
    titleEl.innerText = article.title;
    contentEl.innerHTML = '';
    loaderEl.style.display = 'block';
    btnLink.style.display = 'none';

    // Event Tombol Asli
    btnLink.onclick = function() { window.open(article.link, '_blank'); };

    // Proses Logika AI (Simulasi Delay)
    setTimeout(() => {
        loaderEl.style.display = 'none';
        btnLink.style.display = 'block';

        const titleLower = article.title.toLowerCase();
        
        // 1. EKSTRAKSI FAKTA (Membaca deskripsi asli berita)
        let rawDesc = article.description.replace(/(<([^>]+)>)/gi, ""); // Hapus tag HTML
        if (rawDesc.length < 20) rawDesc = "Tidak ada detail lanjutan pada sumber utama. Sentimen didasarkan murni pada tajuk/judul rilis data.";
        let cleanDesc = rawDesc.substring(0, 250) + "...";

        // 2. KESINAMBUNGAN MAKRO (Logika Korelasi)
        let continuityText = "";
        let continuityColor = "var(--accent-blue)";
        
        if (titleLower.match(/inflasi|cpi|pce|harga/)) {
            continuityText = "Data ini menindaklanjuti tren inflasi kuartal sebelumnya yang masih menjadi fokus utama. Hasil ini akan digunakan pasar untuk memperkirakan probabilitas pemangkasan suku bunga (Rate Cut) pada pertemuan Federal Reserve (FOMC) bulan depan.";
        } else if (titleLower.match(/kerja|pengangguran|nfp|gaji/)) {
            continuityText = "Rilis sektor ketenagakerjaan ini krusial sebagai indikator kekuatan ekonomi riil. Angka ini berhubungan langsung dengan tingkat daya beli konsumen di kuartal berikutnya, serta memvalidasi tren NFP sebelumnya.";
            continuityColor = "var(--text-main)";
        } else if (titleLower.match(/emas|xau|logam/)) {
            continuityText = "Pergerakan harga mencerminkan rotasi aset akibat kondisi makro saat ini. Harga saat ini sedang menyesuaikan diri dengan arah imbal hasil (yield) obligasi AS dan tingkat permintaan safe-haven secara global.";
        } else if (titleLower.match(/minyak|oil|komoditas/)) {
            continuityText = "Fluktuasi energi ini berkaitan erat dengan isu geopolitik dan kuota suplai OPEC+ sebelumnya. Harga energi ini ke depannya akan menyumbang persentase besar pada pembacaan inflasi (Headline CPI) bulan depan.";
        } else {
            continuityText = "Secara struktural, rilis ini memengaruhi likuiditas harian pasar. Institusi menggunakan narasi ini sebagai landasan penyesuaian portofolio jangka pendek sebelum masuknya rilis data Tier-1 berikutnya di kalender ekonomi.";
        }

        // 3. PROYEKSI SMART MONEY
        let projectionText = "Area manipulasi (Liquidity Sweep) berpotensi terjadi. Rekomendasi Antipraktis: Menunggu hingga volatilitas awal mereda, dan fokus pada eksekusi di area Institutional Order Block yang relevan pada sesi overlap London-New York.";

        // RENDER KONTEN
        const p1 = `
            <div class="analysis-block factual">
                <span class="block-title" style="color: var(--text-muted);">1. FAKTA AKTUAL</span>
                ${cleanDesc}
            </div>`;
        
        const p2 = `
            <div class="analysis-block correlation">
                <span class="block-title" style="color: ${continuityColor};">2. KESINAMBUNGAN MAKRO</span>
                ${continuityText}
            </div>`;
        
        const p3 = `
            <div class="analysis-block projection">
                <span class="block-title" style="color: var(--accent-red);">3. INSTITUTIONAL OUTLOOK</span>
                ${projectionText}
            </div>`;

        contentEl.innerHTML = p1 + p2 + p3;
    }, 1500); // 1.5 detik loading lottie
}

function closeNewsModal() {
    document.getElementById('news-modal').classList.remove('show');
}

// 5. Alert
function askAI(type, query = '') {
    const tg = window.Telegram.WebApp;
    tg.showAlert("PROSES TERMINAL:\nFitur [" + type + "] sedang dieksekusi di node backend Antipraktis.");
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
    generateRecommendations();
    updateMarketSession();
    fetchLiveNews();
    
    setInterval(updateMarketSession, 60000); 
    setInterval(fetchLiveNews, 300000); 
});
