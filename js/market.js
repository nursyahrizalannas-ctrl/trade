/* ==========================================================================
   MARKET.JS - ANTIPRAKTIS LOGIC & DATA ANALYTICS
   ========================================================================== */

let globalNewsData = []; 

// 1. Generate Daily Bias Board (Diperbarui Otomatis Setiap Hari)
function generateDailyBias() {
    const container = document.getElementById('bias-container');
    
    // Algoritma rotasi berdasarkan tanggal harian
    const today = new Date();
    const dateSeed = today.getFullYear() + today.getMonth() + today.getDate();

    // Database Penjelasan Bullish & Bearish Institusional
    const assets = [
        {
            name: "XAUUSD (GOLD)",
            bullishReason: "Likuiditas berpindah ke aset safe-haven akibat ketidakpastian makro dan pelemahan yield obligasi AS. Order block institusi mendukung fase akumulasi.",
            bearishReason: "Penguatan Dolar AS dan sentimen risk-on menekan daya tarik emas sebagai lindung nilai. Harga berpotensi menyapu likuiditas di level support bawah."
        },
        {
            name: "BTCUSD (BITCOIN)",
            bullishReason: "Volume akumulasi dari institusi meningkat seiring penyerapan likuiditas pasar. Struktur harga menunjukkan rotasi ke arah ekspansif (Bullish).",
            bearishReason: "Aksi profit-taking terdeteksi di area premium. Likuiditas sedang didistribusikan ke luar dari aset berisiko tinggi menuju instrumen yang lebih aman."
        },
        {
            name: "DXY (US DOLLAR)",
            bullishReason: "Permintaan Dolar memuncak didorong oleh katalis data ekonomi AS yang solid. Arus kas global (capital flow) kembali masuk menyokong kekuatan USD.",
            bearishReason: "Pelemahan momentum makro dan ekspektasi pergeseran kebijakan moneter menekan nilai tukar Dolar di area supply utama harian."
        },
        {
            name: "USDJPY",
            bullishReason: "Pelebaran divergensi suku bunga terus mempertahankan struktur dominasi pembeli (buyer). Area demand sebelumnya berhasil menahan tekanan jual.",
            bearishReason: "Risiko intervensi tersembunyi dan penyesuaian posisi carry trade memicu tekanan jual struktural. Yen mulai menyerap likuiditas kembali."
        }
    ];

    setTimeout(() => {
        container.innerHTML = ''; 
        
        assets.forEach((asset, index) => {
            // Logika untuk menentukan bias harian yang berubah-ubah secara rotasi
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

// 3. Fetch News dari Investing.com
function fetchLiveNews() {
    const container = document.getElementById('live-news-container');
    container.innerHTML = `
        <div class="loading-state">
            <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_t9gk0703.json" background="transparent" speed="1" style="width: 40px; height: 40px; margin: 0 auto;" loop autoplay></lottie-player>
            <span>Sinkronisasi RSS Feed...</span>
        </div>`;

    const rssUrl = 'https://id.investing.com/rss/news_285.rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                container.innerHTML = '';
                globalNewsData = data.items.slice(0, 7); 
                
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
            container.innerHTML = `<div class="loading-state" style="color:var(--accent-red);">KONEKSI NODE GAGAL. SILAKAN REFRESH.</div>`;
        });
}

// 4. Analisis Profesional (Naratif Institusi Mendalam 3 Paragraf)
function openNewsModal(newsIndex) {
    const article = globalNewsData[newsIndex]; 
    const modal = document.getElementById('news-modal');
    const titleEl = document.getElementById('modal-news-title');
    const contentEl = document.getElementById('modal-news-content');
    const loaderEl = document.getElementById('modal-loader');
    const btnLink = document.getElementById('modal-link-btn');

    modal.classList.add('show');
    titleEl.innerText = article.title;
    contentEl.innerHTML = '';
    loaderEl.style.display = 'block';
    btnLink.style.display = 'none';

    btnLink.onclick = function() { window.open(article.link, '_blank'); };

    setTimeout(() => {
        loaderEl.style.display = 'none';
        btnLink.style.display = 'block';

        const titleLower = article.title.toLowerCase();
        let p1, p2, p3;
        
        if (titleLower.match(/minyak|iran|perang|geopolitik|rusia|opec|energi/)) {
            p1 = "Perkembangan terbaru terkait geopolitik dan regulasi energi ini memicu pergeseran besar dalam sentimen risiko global. Peristiwa ini meningkatkan (atau meredakan) kekhawatiran atas stabilitas jalur pasokan energi utama, yang secara langsung memengaruhi proyeksi inflasi global di kuartal mendatang.";
            p2 = "Respons pasar sangat agresif. Jika narasi ini mereda, kita akan melihat harga minyak mentah mengalami koreksi tajam seiring langkah investor menghapus (unwind) risk premium yang sebelumnya terbangun. Sebaliknya, eskalasi akan memicu lonjakan harga yang memaksa pasar melakukan repricing besar-besaran terhadap aset safe-haven seperti Emas (XAUUSD).";
            p3 = "Perubahan harga energi ini langsung memicu rotasi sektor di pasar ekuitas. Penurunan harga minyak biasanya menguntungkan sektor transportasi dan consumer discretionary karena beban biaya menurun, sementara sektor energi akan mengalami profit taking. Smart money saat ini sedang melakukan re-balancing portofolio menyesuaikan arah likuiditas terbaru.";
        } else if (titleLower.match(/inflasi|cpi|fed|suku bunga|pce|powell|bunga/)) {
            p1 = "Rilis berita ini sangat krusial karena menyentuh inti dari kebijakan moneter global saat ini. Pasar secara aktif membedah data ini untuk mencari petunjuk apakah bank sentral memiliki ruang yang cukup untuk memulai atau menahan siklus pemangkasan suku bunga pada pertemuan berikutnya.";
            p2 = "Terjadi repricing yang signifikan di pasar obligasi. Angka yang lebih dovish dari perkiraan langsung menekan imbal hasil (yield) US Treasury dan melemahkan Indeks Dolar (DXY), memicu aliran dana institusional masuk secara masif ke aset berisiko dan emas. Sebaliknya, data yang hawkish akan menopang kekuatan Dolar dan memukul harga komoditas.";
            p3 = "Dari perspektif institusional, momentum ini digunakan untuk menyapu area likuiditas (liquidity sweep). Algoritma High-Frequency Trading mengeksekusi order di level support/resistance kunci sesaat setelah rilis. Sangat disarankan menunggu terbentuknya struktur harga baru di sesi New York sebelum mengambil posisi.";
        } else {
            p1 = "Berita ini menyoroti pergeseran struktural dalam landasan ekonomi riil, yang memberikan indikasi awal mengenai kekuatan daya beli konsumen dan prospek pertumbuhan GDP. Institusi menganggap data tier ini sebagai leading indicator untuk memproyeksikan stabilitas ekonomi beberapa kuartal ke depan.";
            p2 = "Dampak terbesarnya terlihat pada penyesuaian aliran modal (capital flow). Data yang solid akan menarik likuiditas kembali ke pasar saham AS, mendorong indeks utama menguat. Sementara di pasar valas, data ini menentukan apakah Dolar AS masih layak memegang status yield advantage dibandingkan mata uang major lainnya.";
            p3 = "Pergerakan harga saat ini didominasi oleh penyesuaian posisi (positioning adjustment) dari para manajer aset besar. Menjelang penutupan sesi, area fair value gap (FVG) yang tercipta dari volatilitas berita ini kemungkinan besar akan diuji kembali. Sangat disarankan untuk tidak entry secara agresif saat volatilitas awal masih berlangsung.";
        }

        contentEl.innerHTML = `
            <div class="news-article-format">
                <p>${p1}</p>
                <p>${p2}</p>
                <p>${p3}</p>
            </div>
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
    generateDailyBias(); // Menjalankan fitur Bias otomatis harian
    updateMarketSession();
    fetchLiveNews();
    
    setInterval(updateMarketSession, 60000); 
    setInterval(fetchLiveNews, 300000); 
});
