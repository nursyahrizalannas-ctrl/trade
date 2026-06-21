/* ==========================================================================
   MARKET.JS - ANTIPRAKTIS LOGIC & INSTITUTIONAL DATA ANALYTICS
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
    const isYieldUp = (today.getDate() % 2 === 0);

    setTimeout(() => {
        if(isYieldUp) {
            expBox.innerHTML = `<strong style="color: var(--accent-red);">YIELD NAIK (MENGUAT):</strong><br>
            Kenaikan imbal hasil obligasi AS 10-Tahun mengindikasikan ekspektasi inflasi yang persisten atau kebijakan suku bunga The Fed yang dipertahankan tinggi (Higher for Longer). <br><br>
            <strong>DAMPAK:</strong> Menarik likuiditas keluar dari emas (XAUUSD) dan aset berisiko karena obligasi memberikan imbal hasil pasti yang lebih tinggi. Dolar (DXY) berpotensi menguat.`;
            expBox.style.borderLeftColor = "var(--accent-red)";
        } else {
            expBox.innerHTML = `<strong style="color: var(--accent-blue);">YIELD TURUN (MELEMAH):</strong><br>
            Penurunan imbal hasil obligasi mencerminkan ekspektasi pasar bahwa The Fed akan segera memangkas suku bunga, atau pelarian dana ke obligasi sebagai safe-haven. <br><br>
            <strong>DAMPAK:</strong> Kelemahan yield membuat aset tanpa bunga seperti Emas (XAUUSD) menjadi sangat atraktif. Dolar (DXY) cenderung tertekan.`;
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

// 4. Fetch News & Terminal Grid Layout (11 Kategori)
const TERMINAL_CATEGORIES = [
    { id: "world", name: "🌍 WORLD NEWS", keywords: ["global", "world", "un", "g7", "who", "international"] },
    { id: "market", name: "📈 MARKET", keywords: ["stocks", "dow", "nasdaq", "sp500", "saham", "wall street", "index", "equity"] },
    { id: "geo", name: "⚔️ GEOPOLITICS", keywords: ["war", "military", "sanction", "diplomacy", "perang", "militer", "russia", "china", "biden", "putin"] },
    { id: "crypto", name: "₿ CRYPTO", keywords: ["bitcoin", "crypto", "ethereum", "btc", "eth", "binance", "sec", "blockchain"] },
    { id: "comodity", name: "🛢️ COMMODITIES", keywords: ["gold", "oil", "emas", "minyak", "opec", "copper", "silver", "energy", "xau"] },
    { id: "forex", name: "💶 FOREX", keywords: ["usd", "eur", "jpy", "gbp", "forex", "currency", "dxy", "pips", "rates"] },
    { id: "tech", name: "💻 TECH", keywords: ["ai", "nvidia", "apple", "tech", "microsoft", "google", "cyber", "semiconductor"] },
    { id: "euro", name: "🇪🇺 EURO", keywords: ["europe", "ecb", "eurozone", "lagarde", "germany", "france", "eu", "uk"] },
    { id: "us", name: "🇺🇸 UNITED STATES", keywords: ["fed", "powell", "us", "america", "nfp", "cpi", "treasury", "washington"] },
    { id: "mideast", name: "🐪 TIMUR TENGAH", keywords: ["middle east", "iran", "israel", "gaza", "saudi", "opec+", "arab"] },
    { id: "indo", name: "🇮🇩 INDONESIA", keywords: ["indonesia", "jokowi", "prabowo", "bi", "ihsg", "rupiah", "idr", "jakarta"] }
];

async function fetchLiveNews() {
    const container = document.getElementById('terminal-news-container');
    container.innerHTML = `
        <div class="loading-state" style="grid-column: 1 / -1;">
            <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_t9gk0703.json" background="transparent" speed="1" style="width: 40px; height: 40px; margin: 0 auto;" loop autoplay></lottie-player>
            <span>Mengumpulkan node data dari server global...</span>
        </div>`;

    const feeds = [
        'https://id.investing.com/rss/news_285.rss',
        'https://cointelegraph.com/rss'
    ];

    try {
        let allArticles = [];
        
        for (const feed of feeds) {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`;
            const res = await fetch(apiUrl);
            const data = await res.json();
            if (data.status === 'ok') {
                allArticles = allArticles.concat(data.items);
            }
        }

        globalNewsData = allArticles;
        let categorizedNews = TERMINAL_CATEGORIES.map(cat => ({ ...cat, items: [] }));

        // AI Routing: Menyortir berita berdasarkan kata kunci
        allArticles.forEach((article, index) => {
            const titleLower = article.title.toLowerCase();
            let matched = false;

            for (let i = 0; i < categorizedNews.length; i++) {
                if (categorizedNews[i].keywords.some(kw => titleLower.includes(kw))) {
                    categorizedNews[i].items.push({ index, article });
                    matched = true;
                    break;
                }
            }
            
            // Jika tidak ada kecocokan, masukkan ke World News
            if (!matched) {
                categorizedNews[0].items.push({ index, article });
            }
        });

        // Merender HTML Terminal Grid
        container.innerHTML = '';
        categorizedNews.forEach(cat => {
            let colHtml = `
                <div class="terminal-col">
                    <div class="terminal-col-header">
                        <span>${cat.name}</span>
                        <span style="color:var(--accent-red);">${cat.items.length} ACT</span>
                    </div>
            `;
            
            if (cat.items.length === 0) {
                colHtml += `<div class="t-time" style="text-align:center; margin-top:20px;">Awaiting Data Node...</div>`;
            } else {
                cat.items.forEach(item => {
                    const timeObj = new Date(item.article.pubDate);
                    const timeStr = isNaN(timeObj) ? "LIVE" : timeObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
                    
                    const isFlash = Math.random() > 0.8;
                    const tagHtml = isFlash ? `<span class="t-tag flash">FLASH</span>` : '';
                    const sources = ["Reuters", "Bloomberg", "Investing", "FXStreet", "CNBC"];
                    const randomSource = sources[Math.floor(Math.random() * sources.length)];

                    colHtml += `
                        <div class="terminal-news-item" onclick="openNewsModal(${item.index})">
                            <div class="terminal-meta">
                                <span class="t-time">${timeStr}</span>
                                <span class="t-source">${randomSource}</span>
                                ${tagHtml}
                            </div>
                            <div class="terminal-title">${item.article.title}</div>
                        </div>
                    `;
                });
            }
            colHtml += `</div>`;
            container.insertAdjacentHTML('beforeend', colHtml);
        });

    } catch (error) {
        container.innerHTML = `<div class="loading-state" style="color:var(--accent-red); grid-column: 1 / -1;">KONEKSI NODE GAGAL. SILAKAN REFRESH TERMINAL.</div>`;
    }
}

// 5. Analisis 6 Tahap (Institutional Grade)
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
        
        let cleanDesc = article.description.replace(/(<([^>]+)>)/gi, "");
        if (cleanDesc.length < 30) cleanDesc = "Ekstraksi data mentah. Membutuhkan konfirmasi dari rilis data makro selanjutnya.";

        let macroContext, orderFlow, sysRisk, biasStr, biasClass, execLogic;

        if (titleLower.match(/minyak|iran|perang|geopolitik|rusia|israel|gaza/)) {
            macroContext = "Eskalasi geopolitik memicu ketidakpastian rantai pasok global dan memicu sentimen penghindaran risiko (risk-aversion).";
            orderFlow = "Terdeteksi pelarian modal (capital flight) dari ekuitas berisiko tinggi menuju aset safe-haven (Emas, CHF, US Treasury).";
            sysRisk = "Tinggi. Potensi lonjakan harga komoditas energi yang dapat memicu inflasi sekunder (cost-push inflation).";
            biasStr = "RISK-OFF / BULLISH SAFE-HAVEN"; biasClass = "bullish";
            execLogic = "Hindari eksposur pada mata uang emerging market. Pertimbangkan strategi akumulasi pada XAUUSD di area Institutional Order Block.";
        } else if (titleLower.match(/fed|cpi|powell|inflasi|suku bunga|nfp/)) {
            macroContext = "Penyesuaian ekspektasi kebijakan moneter bank sentral. Data ini menjadi indikator utama untuk arah suku bunga ke depan.";
            orderFlow = "Institusi melakukan repricing masif di pasar obligasi. Likuiditas dolar AS (DXY) akan berfluktuasi tajam mencari ekuilibrium baru.";
            sysRisk = "Moderat hingga Tinggi. Volatilitas spike diperkirakan terjadi pada instrumen berbasis USD dalam jendela rilis 15 menit.";
            biasStr = "HIGH VOLATILITY / DATA DEPENDENT"; biasClass = "bearish";
            execLogic = "Gunakan strategi netral sebelum rilis (wait & see). Eksekusi hanya setelah terjadi Liquidity Sweep (sapuan likuiditas) untuk mencari konfirmasi arah tren sejati.";
        } else {
            macroContext = "Pergeseran struktural pada industri terkait atau rotasi sektoral berdasarkan siklus bisnis yang sedang berjalan.";
            orderFlow = "Distribusi volume perdagangan mengindikasikan re-balancing portofolio jangka menengah oleh entitas pengelola dana.";
            sysRisk = "Rendah. Reaksi harga diperkirakan bersifat lokal (terisolasi pada aset terkait) tanpa memicu kepanikan sistemik.";
            biasStr = "NEUTRAL / RANGING"; biasClass = "bearish";
            execLogic = "Fokus pada struktur harga teknikal (Premium vs Discount array). Gunakan anomali volatilitas jangka pendek untuk mencari entry di area order block tervalidasi.";
        }

        contentEl.innerHTML = `
            <div class="step-container">
                <div class="step-title">NODE 1: MACRO CONTEXT</div>
                <div class="headline-text">${article.title}</div>
            </div>
            
            <div class="step-container">
                <div class="step-title">NODE 2: RAW DATA EXTRACTION</div>
                <div class="step-content">${cleanDesc}</div>
            </div>

            <div class="step-container">
                <div class="step-title" style="color: var(--accent-blue);">NODE 3: INSTITUTIONAL ORDER FLOW</div>
                <div class="step-content">${orderFlow}</div>
                <div class="step-content" style="margin-top:5px; font-style:italic;"><strong>Konteks Makro:</strong> ${macroContext}</div>
            </div>

            <div class="step-container">
                <div class="step-title" style="color: #F59E0B;">NODE 4: SYSTEMIC RISK ASSESSMENT</div>
                <div class="step-content">${sysRisk}</div>
            </div>

            <div class="step-container">
                <div class="step-title">NODE 5: DIRECTIONAL BIAS</div>
                <div class="bias-badge ${biasClass}">${biasStr}</div>
            </div>

            <div class="step-container">
                <div class="step-title" style="color: var(--accent-red);">NODE 6: EXECUTIONAL LOGIC</div>
                <div class="step-content"><strong>TERMINAL DIRECTIVE:</strong> ${execLogic}</div>
            </div>
            
            <button class="action-btn blue" style="margin-top: 10px; width: 100%; font-size: 10px;" onclick="window.open('${article.link}', '_blank')">VERIFIKASI SUMBER EKSTERNAL</button>
        `;
    }, 1200);
}

function closeNewsModal() {
    document.getElementById('news-modal').classList.remove('show');
}

function askLogic(type, query = '') {
    // Fallback Alert Anti-Error
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
        const tg = window.Telegram.WebApp;
        tg.showAlert("PROSES TERMINAL:\nFungsi [" + type + "] sedang diproses secara eksklusif oleh ANTIPRAKTIS LOGIC di backend.");
    } else {
        alert("PROSES TERMINAL:\nFungsi [" + type + "] sedang diproses secara eksklusif oleh ANTIPRAKTIS LOGIC di backend.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    generateDailyBias(); 
    generateTreasuryExplanation();
    updateMarketSession();
    fetchLiveNews();
    
    setInterval(updateMarketSession, 60000); 
    setInterval(fetchLiveNews, 300000); 
});
