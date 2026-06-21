/* ==========================================================================
   MARKET.JS - ANTIPRAKTIS LOGIC & DATA ANALYTICS
   ========================================================================== */

let globalNewsData = []; 

// 1. Generate Daily Bias Board 
function generateDailyBias() {
    const container = document.getElementById('bias-container');
    const today = new Date();
    const dateSeed = today.getFullYear() + today.getMonth() + today.getDate();

    const assets = [
        { name: "XAUUSD (GOLD)", bullishReason: "Likuiditas berpindah ke aset safe-haven akibat ketidakpastian makro dan pelemahan yield obligasi AS. Order block institusi mendukung fase akumulasi.", bearishReason: "Penguatan Dolar AS dan sentimen risk-on menekan daya tarik emas. Harga berpotensi menyapu likuiditas di level support bawah." },
        { name: "BTCUSD (BITCOIN)", bullishReason: "Volume akumulasi dari institusi meningkat seiring penyerapan likuiditas pasar. Struktur harga menunjukkan rotasi ke arah ekspansif.", bearishReason: "Aksi profit-taking terdeteksi di area premium. Likuiditas didistribusikan keluar menuju instrumen yang lebih aman." },
        { name: "DXY (US DOLLAR)", bullishReason: "Permintaan Dolar memuncak didorong katalis data ekonomi AS yang solid. Arus kas global kembali masuk menyokong kekuatan USD.", bearishReason: "Pelemahan momentum makro dan ekspektasi pergeseran kebijakan moneter menekan nilai tukar Dolar di area supply utama." },
        { name: "USDJPY", bullishReason: "Pelebaran divergensi suku bunga mempertahankan dominasi buyer. Area demand sebelumnya berhasil menahan tekanan jual.", bearishReason: "Risiko intervensi tersembunyi dan penyesuaian posisi carry trade memicu tekanan jual struktural. Yen menyerap likuiditas kembali." }
    ];

    setTimeout(() => {
        container.innerHTML = ''; 
        assets.forEach((asset, index) => {
            const isBullish = (dateSeed + index) % 2 === 0;
            const bias = isBullish ? "BULLISH" : "BEARISH";
            const reason = isBullish ? asset.bullishReason : asset.bearishReason;
            const badgeClass = isBullish ? "bullish" : "bearish";
            const borderColor = isBullish ? "var(--accent-blue)" : "var(--accent-red)";

            container.insertAdjacentHTML('beforeend', `
                <div class="recom-item" style="border-left-color: ${borderColor};">
                    <div class="recom-top">
                        <div class="asset-name">${asset.name}</div>
                        <div class="badge ${badgeClass}">${bias}</div>
                    </div>
                    <div class="recom-reason"><strong style="color:#fff;">LOGIC:</strong> ${reason}</div>
                </div>
            `);
        });
    }, 1200);
}

// 2. US Treasury Explanation Logic
function generateTreasuryExplanation() {
    const expBox = document.getElementById('treasury-explanation');
    const today = new Date();
    const isYieldUp = (today.getDate() % 2 === 0); // Simulasi trend berdasarkan ganjil/genap

    setTimeout(() => {
        if(isYieldUp) {
            expBox.innerHTML = `<strong style="color: var(--accent-red);">YIELD NAIK (MENGUAT):</strong><br>
            Kenaikan imbal hasil obligasi AS 10-Tahun mengindikasikan ekspektasi inflasi yang persisten atau kebijakan suku bunga The Fed yang dipertahankan tinggi (Higher for Longer). <br><br>
            <strong>DAMPAK:</strong> Menarik likuiditas keluar dari emas (XAUUSD) dan aset berisiko (Crypto/Saham) karena obligasi memberikan imbal hasil pasti yang lebih tinggi. Dolar (DXY) berpotensi menguat kuat.`;
            expBox.style.borderLeftColor = "var(--accent-red)";
        } else {
            expBox.innerHTML = `<strong style="color: var(--accent-blue);">YIELD TURUN (MELEMAH):</strong><br>
            Penurunan imbal hasil obligasi mencerminkan ekspektasi pasar bahwa The Fed akan segera memangkas suku bunga, atau terjadi kepanikan pasar yang memicu pelarian dana ke obligasi sebagai safe-haven. <br><br>
            <strong>DAMPAK:</strong> Kelemahan yield membuat aset tanpa bunga seperti Emas (XAUUSD) menjadi sangat atraktif. Dolar (DXY) cenderung tertekan, mendorong akumulasi pada Gold dan instrumen berisiko.`;
            expBox.style.borderLeftColor = "var(--accent-blue)";
        }
    }, 1000);
}

// 3. Market Session & Globe
function updateMarketSession() {
    const statusDiv = document.getElementById('session-status');
    const globe = document.getElementById('session-globe');
    const utcHour = new Date().getUTCHours(); 
    
    let session = "OFF-MARKET HOURS";
    let globeFilter = "grayscale(100%) opacity(0.5)"; 
    let textColor = "#fff";

    if (utcHour >= 22 || utcHour < 8) {
        session = "ASIAN SESSION - ACCUMULATION PHASE";
        globeFilter = "hue-rotate(45deg) drop-shadow(0 0 15px rgba(245, 176, 65, 0.8))"; 
        textColor = "#F5B041";
    } else if (utcHour >= 8 && utcHour < 13) {
        session = "LONDON SESSION - LIQUIDITY HUNT";
        globeFilter = "hue-rotate(190deg) drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))"; 
        textColor = "var(--accent-blue)";
    } else if (utcHour >= 13 && utcHour < 17) {
        session = "NEW YORK OVERLAP - HIGH VOLATILITY";
        globeFilter = "hue-rotate(330deg) saturate(2) drop-shadow(0 0 20px rgba(225, 29, 72, 1))"; 
        textColor = "var(--accent-red)";
    } else if (utcHour >= 17 && utcHour < 22) {
        session = "NEW YORK SESSION - DISTRIBUTION";
        globeFilter = "hue-rotate(15deg) saturate(1.5) drop-shadow(0 0 15px rgba(230, 126, 34, 0.8))"; 
        textColor = "#E67E22";
    }

    statusDiv.innerHTML = session;
    statusDiv.style.color = textColor;
    statusDiv.style.borderColor = textColor;
    
    if(globe) {
        globe.style.transition = "filter 1.5s ease-in-out";
        globe.style.filter = globeFilter;
    }
}

// 4. Fetch News & Terminal Grid Layout
function fetchLiveNews() {
    const container = document.getElementById('terminal-news-container');
    container.innerHTML = `
        <div class="loading-state" style="width: 100%;">
            <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_t9gk0703.json" background="transparent" speed="1" style="width: 40px; height: 40px; margin: 0 auto;" loop autoplay></lottie-player>
            <span>Sinkronisasi RSS Feed ke Terminal Grid...</span>
        </div>`;

    const rssUrl = 'https://id.investing.com/rss/news_285.rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                container.innerHTML = '';
                globalNewsData = data.items; 

                // Kategori Terminal
                const categories = [
                    { id: "forex", name: "💶 FOREX & MACRO", items: [] },
                    { id: "commodities", name: "🛢️ COMMODITIES", items: [] },
                    { id: "crypto", name: "₿ CRYPTO & TECH", items: [] },
                    { id: "geopolitics", name: "🌍 GEOPOLITICS", items: [] }
                ];

                // Distribusi berita ke kategori
                globalNewsData.forEach((article, index) => {
                    const titleLower = article.title.toLowerCase();
                    if (titleLower.match(/emas|minyak|oil|gold|xau/)) categories[1].items.push({index, article});
                    else if (titleLower.match(/bitcoin|kripto|crypto|btc|tech/)) categories[2].items.push({index, article});
                    else if (titleLower.match(/perang|iran|rusia|geopolitik|serangan/)) categories[3].items.push({index, article});
                    else categories[0].items.push({index, article});
                });

                // Render Kolom
                categories.forEach(cat => {
                    if(cat.items.length === 0) return; // Skip if empty
                    
                    let colHtml = `<div class="terminal-col"><div class="terminal-col-header">${cat.name}</div>`;
                    cat.items.forEach(item => {
                        const timeStr = new Date(item.article.pubDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                        colHtml += `
                            <div class="terminal-news-item" onclick="openNewsModal(${item.index})">
                                <div class="terminal-time">${timeStr} WIB</div>
                                <div class="terminal-title">${item.article.title}</div>
                            </div>
                        `;
                    });
                    colHtml += `</div>`;
                    container.insertAdjacentHTML('beforeend', colHtml);
                });
            }
        }).catch(() => {
            container.innerHTML = `<div class="loading-state" style="color:var(--accent-red); width: 100%;">KONEKSI NODE GAGAL. SILAKAN REFRESH.</div>`;
        });
}

// 5. Analisis 6 Tahap (HEADLINE -> RINGKASAN -> DAMPAK -> EDUKASI -> BIAS -> KESIMPULAN)
function openNewsModal(newsIndex) {
    const article = globalNewsData[newsIndex]; 
    const modal = document.getElementById('news-modal');
    const contentEl = document.getElementById('modal-news-content');
    const loaderEl = document.getElementById('modal-loader');

    modal.classList.add('show');
    contentEl.innerHTML = '';
    loaderEl.style.display = 'block';

    setTimeout(() => {
        loaderEl.style.display = 'none';

        const titleLower = article.title.toLowerCase();
        
        // Logika Ekstraksi Fakta
        let cleanDesc = article.description.replace(/(<([^>]+)>)/gi, "");
        if (cleanDesc.length < 30) cleanDesc = "Tidak ada detail lanjutan pada sumber utama. Sentimen diekstraksi dari judul.";
        
        // Logika Dinamis
        let impact, edu, biasStr, biasClass, conclusion;

        if (titleLower.match(/minyak|iran|perang|geopolitik|rusia/)) {
            impact = "Memicu fluktuasi pada risk premium global. Aset safe-haven (Emas) berpotensi diakumulasi, sementara ekuitas tertekan.";
            edu = "Dalam situasi krisis geopolitik, institusi akan melikuidasi aset berisiko tinggi dan memindahkan kapital ke instrumen likuiditas aman seperti US Treasury dan Emas.";
            biasStr = "BULLISH SAFE-HAVEN"; biasClass = "bullish";
            conclusion = "Hindari entry agresif di pair berisiko. Pantau reaksi harga XAUUSD di area Institutional Order Block terdekat.";
        } else if (titleLower.match(/inflasi|cpi|fed|suku bunga|pce|powell/)) {
            impact = "Repricing masif di pasar obligasi yang secara langsung mendikte kekuatan Dolar AS (DXY) dan pergerakan aset berdenominasi USD.";
            edu = "Suku bunga yang dipertahankan tinggi (Hawkish) meningkatkan yield obligasi, menarik uang keluar dari Emas. Sebaliknya, pemangkasan suku bunga (Dovish) membuat Emas atraktif.";
            biasStr = "HIGH VOLATILITY"; biasClass = "bearish"; // Neutral/Volatile
            conclusion = "Tunggu fase manipulasi likuiditas (Liquidity Sweep) pasca-rilis selesai sebelum mencari pijakan entry.";
        } else {
            impact = "Mempengaruhi arus kas jangka pendek (capital flow) dan ekspektasi daya beli konsumen secara makro.";
            edu = "Data ekonomi riil memberikan pandangan (leading indicator) bagi institusi untuk menempatkan portofolio mereka kuartal mendatang.";
            biasStr = "NEUTRAL / RANGING"; biasClass = "bearish";
            conclusion = "Reaksi pasar kemungkinan bersifat sementara. Fokus pada level teknikal Premium & Discount harian.";
        }

        // Render 6 Tahap
        contentEl.innerHTML = `
            <div class="step-container">
                <div class="step-title">1. HEADLINE</div>
                <div class="headline-text">${article.title}</div>
            </div>
            
            <div class="step-container">
                <div class="step-title">2. RINGKASAN DATA</div>
                <div class="step-content">${cleanDesc}</div>
            </div>

            <div class="step-container">
                <div class="step-title" style="color: var(--accent-blue);">3. DAMPAK MARKET</div>
                <div class="step-content">${impact}</div>
            </div>

            <div class="step-container">
                <div class="step-title">4. EDUKASI MAKRO</div>
                <div class="step-content" style="font-style: italic; color: var(--text-muted);">${edu}</div>
            </div>

            <div class="step-container">
                <div class="step-title">5. BIAS SENTIMEN</div>
                <div class="bias-badge ${biasClass}">${biasStr}</div>
            </div>

            <div class="step-container">
                <div class="step-title" style="color: var(--accent-red);">6. KESIMPULAN & EKSEKUSI</div>
                <div class="step-content"><strong>ANTIPRAKTIS LOGIC:</strong> ${conclusion}</div>
            </div>
            
            <button class="action-btn blue" style="margin-top: 10px; width: 100%;" onclick="window.open('${article.link}', '_blank')">BACA SUMBER ASLI</button>
        `;
    }, 1500);
}

function closeNewsModal() {
    document.getElementById('news-modal').classList.remove('show');
}

function askLogic(type, query = '') {
    const tg = window.Telegram.WebApp;
    tg.showAlert("PROSES TERMINAL:\nFungsi [" + type + "] sedang diproses secara eksklusif oleh ANTIPRAKTIS LOGIC di backend.");
}

document.addEventListener("DOMContentLoaded", () => {
    generateDailyBias(); 
    generateTreasuryExplanation();
    updateMarketSession();
    fetchLiveNews();
    
    setInterval(updateMarketSession, 60000); 
    setInterval(fetchLiveNews, 300000); 
});
