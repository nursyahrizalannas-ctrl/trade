/* ==========================================================================
   MARKET.JS - INSTITUTIONAL DATA & ANTIPRAKTIS LOGIC
   ========================================================================== */

let globalNewsData = []; 

// 1. Daily Bias (Bahasa Institusi Khusus)
function generateDailyBias() {
    const container = document.getElementById('bias-container');
    const today = new Date();
    const dateSeed = today.getFullYear() + today.getMonth() + today.getDate();

    const assets = [
        { name: "XAUUSD (GOLD)", bullishReason: "Konfirmasi struktur *Bullish Order Flow* di area H4 Discount. Rotasi kapital mengalir ke safe-haven akibat pelebaran yield obligasi riil.", bearishReason: "Likuiditas *Buy-Side* (BSL) telah tersapu di area premium. Algoritma diproyeksikan mendistribusikan harga ke *Fair Value Gap* (FVG) bawah." },
        { name: "DXY (US DOLLAR)", bullishReason: "Data makro mensponsori repricing *hawkish*. Institusi mengakumulasi USD di area *Breaker Block* menyusul arus kas yang masuk ke US Treasury.", bearishReason: "Momentum terdegradasi setelah manipulasi harga ke area penawaran (*Supply*). Aliran pesanan (*Order Flow*) mulai bergeser memburu *Sell-Side Liquidity*." }
    ];

    setTimeout(() => {
        container.innerHTML = ''; 
        assets.forEach((asset, index) => {
            const isBullish = (dateSeed + index) % 2 === 0;
            const bias = isBullish ? "LONG EXPOSURE" : "SHORT EXPOSURE";
            const reason = isBullish ? asset.bullishReason : asset.bearishReason;
            const badgeClass = isBullish ? "bullish" : "bearish";
            const borderColor = isBullish ? "var(--accent-blue)" : "var(--accent-red)";

            container.insertAdjacentHTML('beforeend', `
                <div class="recom-item" style="border-left-color: ${borderColor};">
                    <div class="recom-top">
                        <div class="asset-name">${asset.name}</div>
                        <div class="badge ${badgeClass}">${bias}</div>
                    </div>
                    <div class="recom-reason"><strong style="color:#fff;">QUANT LOGIC:</strong> ${reason}</div>
                </div>
            `);
        });
    }, 1200);
}

// 2. Animasi Bendera Sesi Market (Berdasarkan Waktu UTC)
function updateMarketSession() {
    const statusDiv = document.getElementById('session-status');
    const flagContainer = document.getElementById('session-flag-container');
    const utcHour = new Date().getUTCHours(); 
    
    let session, emoji, ringClass, textColor;

    // Logika Waktu Institusional
    if (utcHour >= 0 && utcHour < 8) {
        session = "ASIAN SESSION: ALGORITHMIC ACCUMULATION";
        emoji = "🇯🇵"; ringClass = "asia"; textColor = "#E11D48";
    } else if (utcHour >= 8 && utcHour < 13) {
        session = "LONDON SESSION: LIQUIDITY SWEEP & TREND CREATION";
        emoji = "🇬🇧"; ringClass = "uk"; textColor = "#F59E0B";
    } else if (utcHour >= 13 && utcHour < 17) {
        session = "NY OVERLAP: HIGH IMPACT MACRO RELEASE";
        emoji = "🇺🇸"; ringClass = "us"; textColor = "#3B82F6";
    } else {
        session = "NY LATE SESSION: DISTRIBUTION & RE-BALANCING";
        emoji = "🇺🇸"; ringClass = "us"; textColor = "#64748B";
    }

    statusDiv.innerHTML = session;
    statusDiv.style.color = textColor;
    statusDiv.style.borderColor = textColor;
    
    flagContainer.innerHTML = `
        <div class="radar-ring ${ringClass}"></div>
        <div class="radar-ring ${ringClass}" style="animation-delay: 1s;"></div>
        <div class="flag-emoji">${emoji}</div>
    `;
}

// 3. Routing Berita Multi-Feed & Distribusi ke Layout 2 Kolom
const CATEGORIES = [
    { id: "world", name: "🌍 GLOBAL MACRO", keywords: ["global", "world", "g7", "who"] },
    { id: "market", name: "📈 EQUITY INDEX", keywords: ["stocks", "dow", "nasdaq", "sp500", "wall street"] },
    { id: "geo", name: "⚔️ GEOPOLITICS", keywords: ["war", "military", "sanction", "perang", "militer", "russia", "china"] },
    { id: "comodity", name: "🛢️ COMMODITIES", keywords: ["gold", "oil", "emas", "minyak", "opec", "energy", "xau"] },
    { id: "forex", name: "💶 FX LIQUIDITY", keywords: ["usd", "eur", "jpy", "gbp", "forex", "dxy", "ecb", "fed"] },
    { id: "crypto", name: "₿ DIGITAL ASSETS", keywords: ["bitcoin", "crypto", "ethereum", "btc", "binance"] }
];

async function fetchLiveNews() {
    const dashContainer = document.getElementById('dashboard-news-container');
    const termContainer = document.getElementById('terminal-news-grid');

    const feedUrl = 'https://id.investing.com/rss/news_285.rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        
        if (data.status === 'ok') {
            globalNewsData = data.items;
            
            // --- POPULATE DASHBOARD MINI FEED ---
            dashContainer.innerHTML = '';
            for(let i=0; i<3; i++) {
                if(!globalNewsData[i]) break;
                const time = new Date(globalNewsData[i].pubDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                dashContainer.insertAdjacentHTML('beforeend', `
                    <div class="news-item-mini" onclick="openNewsModal(${i})">
                        <div class="mini-meta"><span class="mini-time">${time} WIB</span></div>
                        <div class="mini-title">${globalNewsData[i].title}</div>
                    </div>
                `);
            }

            // --- POPULATE TERMINAL 2-COLUMNS ---
            termContainer.innerHTML = '';
            let catData = CATEGORIES.map(c => ({...c, items: []}));

            globalNewsData.forEach((article, index) => {
                const lowerTitle = article.title.toLowerCase();
                let matched = false;
                for (let i = 0; i < catData.length; i++) {
                    if (catData[i].keywords.some(kw => lowerTitle.includes(kw))) {
                        catData[i].items.push({ index, article });
                        matched = true; break;
                    }
                }
                if(!matched) catData[0].items.push({ index, article }); // Default to Global
            });

            catData.forEach(cat => {
                if (cat.items.length === 0) return;
                let colHtml = `<div class="news-cat-card"><div class="news-cat-header">${cat.name}</div>`;
                cat.items.slice(0, 5).forEach(item => { // Max 5 per kotak
                    const t = new Date(item.article.pubDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    colHtml += `
                        <div class="news-item-mini" onclick="openNewsModal(${item.index})">
                            <div class="mini-meta"><span class="mini-time">${t}</span></div>
                            <div class="mini-title">${item.article.title}</div>
                        </div>
                    `;
                });
                colHtml += `</div>`;
                termContainer.insertAdjacentHTML('beforeend', colHtml);
            });
        }
    } catch (error) {
        termContainer.innerHTML = `<div class="loading-action">NODE CONNECTION FAILED. RETRYING...</div>`;
    }
}

// 4. Analisis Berita Super Spesifik & Profesional (Hedge Fund Logic)
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
        const tLower = article.title.toLowerCase();
        
        let catalyst, liquidity, orderFlow, bias, execute;

        // Logika Kategorisasi Khusus
        if (tLower.match(/minyak|iran|perang|geopolitik|rusia|israel/)) {
            catalyst = "Katalis eksogen (Geopolitik Risk Premium) memicu penyesuaian kurva volatilitas dan lonjakan permintaan instrumen lindung nilai (hedging).";
            liquidity = "Penarikan likuiditas dari aset berisiko (Risk-Off). Dana institusi (Smart Money) dirotasi ke obligasi pemerintah dan emas fisik sebagai benteng perlindungan.";
            orderFlow = "Terdeteksi inefisiensi harga akibat gap agresif. Algoritma melakukan *Buy Program* pada instrumen safe-haven.";
            bias = "LONG XAUUSD / LONG CHF";
            execute = "Abaikan teknikal minor. Tunggu harga merespons *Institutional Order Block* terdekat di H1. Targetkan pengujian likuiditas *Buy-Side* eksternal.";
            
        } else if (tLower.match(/fed|cpi|powell|inflasi|suku bunga|nfp/)) {
            catalyst = "Rilis data ekonomi tier-1 (Makro Endogen) yang mendikte repricing suku bunga terminal (Terminal Rate) oleh Central Bank.";
            liquidity = "Menjelang rilis, institusi akan menarik *resting orders*, menyebabkan *thin liquidity*. Ini akan memicu *Liquidity Sweep* 15 menit awal untuk menjebak retail trader.";
            orderFlow = "Algoritma *High Frequency Trading* (HFT) akan menyapu level stop-loss di atas dan di bawah sebelum mencari *Fair Value* sejati.";
            bias = "DATA DEPENDENT (VOLATILE)";
            execute = "Terapkan *Clash Data Protocol*. Jangan entry sebelum rilis data. Tunggu terbentuknya *Market Structure Shift* (MSS) dengan *Displacement* yang jelas di M15 pasca rilis.";
            
        } else {
            catalyst = "Pergeseran mikrostuktur atau aliran berita sekunder yang memberikan sentimen minor terhadap kelas aset spesifik.";
            liquidity = "Dampak tidak sistemik. Likuiditas pasar berjalan normal mencari area keseimbangan internal (*Internal Range Liquidity*).";
            orderFlow = "Institusi melakukan re-balancing portofolio bertahap tanpa memicu spike volume yang masif.";
            bias = "MEAN REVERSION / RANGING";
            execute = "Fokus pada rentang harian (Daily Range). Beli di area Discount (di bawah 50%) dan Jual di area Premium (di atas 50%) dari struktur pergerakan terakhir.";
        }

        // Render Antarmuka Modal
        contentEl.innerHTML = `
            <div class="logic-node" style="border-left-color: var(--accent-blue);">
                <div class="node-title">I. PRIMARY CATALYST</div>
                <div class="headline-text">${article.title}</div>
                <div class="node-text" style="margin-top:8px;">${catalyst}</div>
            </div>

            <div class="logic-node" style="border-left-color: #F59E0B;">
                <div class="node-title">II. LIQUIDITY & SYSTEMIC RISK</div>
                <div class="node-text">${liquidity}</div>
            </div>

            <div class="logic-node" style="border-left-color: #10B981;">
                <div class="node-title">III. INSTITUTIONAL ORDER FLOW</div>
                <div class="node-text">${orderFlow}</div>
            </div>

            <div class="logic-node" style="border-left-color: var(--accent-red); background: rgba(225,29,72,0.1);">
                <div class="node-title" style="color:var(--accent-red);">IV. ANTIPRAKTIS EXECUTION MATRIX</div>
                <div class="badge ${bias.includes('LONG') ? 'bullish' : 'bearish'}" style="margin-bottom:8px;">DIRECTION: ${bias}</div>
                <div class="node-text" style="font-weight:600;">PROTOCOL: ${execute}</div>
            </div>
            
            <button class="action-btn blue" style="margin-top: 10px; width: 100%; font-size: 10px;" onclick="window.open('${article.link}', '_blank')">VERIFY EXTERNAL DATA SOURCE</button>
        `;
    }, 1500);
}

function closeNewsModal() { document.getElementById('news-modal').classList.remove('show'); }

function askLogic(type, query = '') {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
        window.Telegram.WebApp.showAlert("ANTIPRAKTIS TERMINAL:\nProtocol [" + type + "] is running strictly on backend servers.");
    } else {
        alert("ANTIPRAKTIS TERMINAL:\nProtocol [" + type + "] is running strictly on backend servers.");
    }
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
    generateDailyBias(); 
    updateMarketSession();
    fetchLiveNews();
    
    setInterval(updateMarketSession, 60000); 
    setInterval(fetchLiveNews, 300000); 
});
