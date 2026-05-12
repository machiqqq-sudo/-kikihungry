const questions = [
    {
        question: "在一個悠閒的週末午後，你理想的下午茶氛圍是？",
        options: [
            { text: "熱情奔放，與好友大聲談笑聊天", type: "川菜" },
            { text: "精緻優雅，講究餐具與環境細節", type: "粵菜" },
            { text: "溫婉細膩，坐在河畔看風景", type: "蘇菜" },
            { text: "爽快乾脆，不需要太多裝飾", type: "湘菜" },
            { text: "低調內斂，品味深藏不露的韻味", type: "閩菜" },
            { text: "大氣豪邁，份量一定要足夠", type: "魯菜" },
            { text: "詩情畫意，講究食材的時令美感", type: "浙菜" },
            { text: "古樸自然，喜歡木質與山野氣息", type: "徽菜" }
        ]
    },
    {
        question: "當你面對挑戰時，你的態度通常是？",
        options: [
            { text: "正面硬剛，越挫越勇，火熱迎戰", type: "川菜" },
            { text: "冷靜分析，保留實力，追求最純粹的結果", type: "粵菜" },
            { text: "剛柔並濟，用耐心慢慢磨出成果", type: "蘇菜" },
            { text: "直接了當，不拖泥帶水地解決", type: "湘菜" },
            { text: "講究方法，注重內在底蘊的累積", type: "閩菜" },
            { text: "穩紮穩打，展現大將之風的實力", type: "魯菜" },
            { text: "優雅應對，不僅要贏，還要贏得漂亮", type: "浙菜" },
            { text: "刻苦耐勞，專注於火候與細節的打磨", type: "徽菜" }
        ]
    },
    {
        question: "如果要把你的人格比喻成一種色彩，你會選擇？",
        options: [
            { text: "烈火紅：充滿生命力與衝擊力", type: "川菜" },
            { text: "純淨白：回歸本真，層次分明", type: "粵菜" },
            { text: "琥珀金：溫潤飽滿，甜中帶鮮", type: "蘇菜" },
            { text: "朝陽橘：酸辣熱烈，個性鮮明", type: "湘菜" },
            { text: "山林綠：清幽和醇，餘味悠長", type: "閩菜" },
            { text: "玄鐵灰：厚重紮實，沉穩大氣", type: "魯菜" },
            { text: "湖水藍：清雅脫俗，婉約動人", type: "浙菜" },
            { text: "古木褐：沉穩質樸，歲月留香", type: "徽菜" }
        ]
    },
    {
        question: "朋友眼中的你，通常具備哪種特質？",
        options: [
            { text: "愛恨分明，性格火辣", type: "川菜" },
            { text: "品味高尚，不愛隨波逐流", type: "粵菜" },
            { text: "溫文儒雅，處事圓滑周到", type: "蘇菜" },
            { text: "真性情，相處起來毫無壓力", type: "湘菜" },
            { text: "知識淵博，深藏不露", type: "閩菜" },
            { text: "仗義執言，值得信賴的大哥/大姐", type: "魯菜" },
            { text: "心思細膩，生活有儀式感", type: "浙菜" },
            { text: "意志堅定，做事有板有眼", type: "徽菜" }
        ]
    }
];

let currentQuestion = 0;
let scores = {};
let bgMusic = null; // 用於儲存目前的音樂物件
let isMuted = false;

function initPage() {
    // 頁面載入時只顯示開始畫面
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');

    // 初始化滑鼠追蹤
    document.querySelector('.container').addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) createInkDot(e);
    });

    // 打字機效果實作
    const descElement = document.getElementById('start-description');
    const fullText = "味覺是靈魂的引路人。<br>準備好展開這場關於性格與中華八大菜系的古風之旅了嗎？";
    let charIndex = 0;

    function brushWrite() {
        if (charIndex < fullText.length) {
            // 檢查是否遇到換行標籤
            if (fullText.substring(charIndex, charIndex + 4) === "<br>") {
                descElement.innerHTML += "<br>";
                charIndex += 4;
            } else {
                // 建立帶有毛筆效果類別的 span
                const span = document.createElement('span');
                span.className = 'brush-char';
                span.innerText = fullText.charAt(charIndex);
                descElement.appendChild(span);
                charIndex++;
            }
            setTimeout(brushWrite, 100); 
        } else {
            // 書寫完成後，顯示開始按鈕並觸發其捲軸動畫
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                startBtn.classList.remove('hidden');
                // 強制重繪並確保動畫執行
                void startBtn.offsetWidth;
                startBtn.style.opacity = "1";
            }
        }
    }

    if (descElement) {
        descElement.innerHTML = ""; // 確保初始為空
        brushWrite();
    }
}

function createInkDot(e) {
    const container = document.getElementById('mouse-ink-container');
    const rect = document.querySelector('.container').getBoundingClientRect();
    const dot = document.createElement('div');
    dot.className = 'ink-dot';
    dot.style.left = (e.clientX - rect.left) + 'px';
    dot.style.top = (e.clientY - rect.top) + 'px';
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 1000);
}

function startQuiz() {
    triggerHaptic();
    // 初始化狀態
    currentQuestion = 0;
    scores = {
        "川菜": 0, "粵菜": 0, "蘇菜": 0, "湘菜": 0,
        "閩菜": 0, "徽菜": 0, "浙菜": 0, "魯菜": 0
    };
    
    // 停止並重置正在播放的音樂
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }

    document.getElementById('start-screen').classList.add('hidden');
    document.querySelector('.progress-container').classList.remove('hidden');
    document.querySelector('.progress-bar').style.width = `0%`;
    document.getElementById('quiz-screen').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    const progress = (currentQuestion / questions.length) * 100;
    document.querySelector('.progress-bar').style.width = `${progress}%`;
    
    const quizScreen = document.getElementById('quiz-screen');
    
    // 移除動畫類別以便重新觸發
    quizScreen.classList.remove('fade-in-active');
    void quizScreen.offsetWidth; // 強制瀏覽器重繪 (Reflow)，確保動畫能再次觸發
    quizScreen.classList.add('fade-in-active');

    document.getElementById('question-text').innerText = q.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        // 設定交錯的動畫延遲，產生一個接一個展開的效果
        btn.style.animationDelay = `${index * 0.1}s`;

        // 監聽滑鼠移動，計算相對座標並更新 CSS 變數
        btn.onmousemove = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--x', x + 'px');
            btn.style.setProperty('--y', y + 'px');
        };

        btn.onclick = () => selectOption(opt.type);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(type) {
    triggerHaptic();

    if (currentQuestion < questions.length - 1) {
        // 題目切換轉場：觸發水墨遮罩
        const overlay = document.getElementById('transition-overlay');
        overlay.classList.remove('hidden', 'wipe-active');
        void overlay.offsetWidth; // 重置動畫
        overlay.classList.add('wipe-fast');

        scores[type] = (scores[type] || 0) + 1;
        currentQuestion++;

        // 在遮罩完全覆蓋時更換題目內容
        setTimeout(() => {
            showQuestion();
            // 為題目文字也加入揮毫效果，超精緻！
            const qText = questions[currentQuestion].question;
            animateBrushText('question-text', qText, 40);
        }, 400);

        // 動畫結束後隱藏遮罩
        setTimeout(() => {
            overlay.classList.remove('wipe-fast');
            overlay.classList.add('hidden');
        }, 800);
    } else {
        scores[type] = (scores[type] || 0) + 1;
        currentQuestion++;
        showLoading();
    }
}

function showLoading() {
    const overlay = document.getElementById('transition-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('wipe-active');

    setTimeout(() => {
        document.getElementById('quiz-screen').classList.add('hidden');
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('hidden');
        loadingScreen.classList.add('fade-in-active');
    }, 600); // 在擦拭動畫中間切換畫面

    setTimeout(() => {
        overlay.classList.remove('wipe-active');
        overlay.classList.add('hidden');
    }, 1200);

    // 模擬分析過程，2 秒後顯示結果
    setTimeout(() => {
        showResult();
    }, 2000);
}

function showResult() {
    const overlay = document.getElementById('transition-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('wipe-active');

    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('result-screen').classList.remove('hidden');
        document.getElementById('result-screen').classList.add('fade-in-active');
    }, 600);

    setTimeout(() => {
        overlay.classList.remove('wipe-active');
        overlay.classList.add('hidden');
    }, 1200);

    const topCuisine = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    document.getElementById('cuisine-name').innerText = topCuisine;
    document.querySelector('.progress-bar').style.width = `100%`;
    
    const descriptions = {
        "川菜": "尚滋味，好辛香。以麻辣鮮香著稱，代表作如麻婆豆腐、宮保雞丁。",
        "粵菜": "追求食材本味，清而不淡，鮮而不俗。代表作如白切雞、點心。",
        "蘇菜": "製作精細，風格高雅，擅長燉燜煨。代表作如獅子頭。",
        "湘菜": "重油、色濃、鮮辣，香氣四溢。代表作如剁椒魚頭。",
        "閩菜": "清鮮、和醇、葷香不膩。以湯菜、海鮮和甜酸口味見長，代表作如佛跳牆、荔枝肉。",
        "徽菜": "重油、重色、重火功。以山珍野味為特色，代表作如臭鱖魚、毛豆腐。",
        "浙菜": "清鮮、脆嫩、注重原味。菜品精緻雅麗，代表作如西湖醋魚、龍井蝦仁。",
        "魯菜": "鹹鮮、脆嫩、注重湯頭。北方菜系的代表，代表作如糖醋鯉魚、德州扒雞。"
    };

    const sealTexts = {
        "川菜": "熱辣", "粵菜": "鮮活", "蘇菜": "雅緻", "湘菜": "火烈",
        "閩菜": "和醇", "徽菜": "淳厚", "浙菜": "清麗", "魯菜": "豪邁"
    };

    const imageUrls = {
        "川菜": "images/川菜.png",
        "粵菜": "images/粵菜.png",
        "蘇菜": "images/蘇菜.png",
        "湘菜": "images/湘菜.png",
        "閩菜": "images/閩菜.png",
        "徽菜": "images/徽菜.png",
        "浙菜": "images/浙菜.png",
        "魯菜": "images/魯菜.png"
    };

    const musicUrls = {
        "川菜": "music/chuan.mp3",
        "粵菜": "music/yue.mp3",
        "蘇菜": "music/su.mp3",
        "湘菜": "music/xiang.mp3",
        "閩菜": "music/min.mp3",
        "徽菜": "music/hui.mp3",
        "浙菜": "music/zhe.mp3",
        "魯菜": "music/lu.mp3"
    };

    document.getElementById('cuisine-desc').innerText = descriptions[topCuisine] || "這是中華美食的瑰寶。";
    document.querySelector('.result-seal').innerText = sealTexts[topCuisine] || "合格";
    
    const resultScreen = document.getElementById('result-screen');
    resultScreen.classList.add('result-shake');

    const imgElement = document.getElementById('cuisine-img');
    // 404 容錯：找不到圖片時隱藏，不報錯
    imgElement.onerror = () => { imgElement.style.display = 'none'; };

    // 針對所有人物圖優化樣式：移除邊框與背景，改用濾鏡陰影
    if (["浙菜", "徽菜", "粵菜", "川菜", "蘇菜", "湘菜", "閩菜", "魯菜"].includes(topCuisine)) {
        imgElement.classList.add('character-mode');
    } else {
        imgElement.classList.remove('character-mode');
    }

    imgElement.src = imageUrls[topCuisine];
    imgElement.style.display = 'block';

    triggerResultAnimation(topCuisine);
    playCuisineMusic(musicUrls[topCuisine]);
}

function toggleMusic() {
    isMuted = !isMuted;
    const btn = document.getElementById('music-toggle');
    btn.innerText = isMuted ? "🔇" : "🎵";

    if (bgMusic) {
        bgMusic.muted = isMuted;
    }
}

function playCuisineMusic(url) {
    if (url) {
        // 如果已有播放中的音樂先停止
        if (bgMusic) {
            bgMusic.pause();
        }
        bgMusic = new Audio(url);
        bgMusic.loop = true; // 設定循環播放
        bgMusic.muted = isMuted; // 繼承目前的靜音狀態
        bgMusic.play().catch(err => console.log("播放被瀏覽器阻擋，需使用者互動後才能播放:", err));
    }
}

function triggerResultAnimation(cuisine) {
    const container = document.getElementById('result-animation-container');
    container.innerHTML = ''; // 清除舊動畫
    
    // 定義各菜系的雲霧氛圍顏色
    const cloudColors = {
        "川菜": "rgba(255, 182, 193, 0.5)", // 淡粉紅 (熱辣感)
        "粵菜": "rgba(173, 216, 230, 0.5)", // 淡藍 (海洋鮮活感)
        "蘇菜": "rgba(230, 230, 250, 0.5)", // 淡紫 (雅緻江南)
        "湘菜": "rgba(255, 99, 71, 0.5)",   // 番茄紅 (火烈感)
        "閩菜": "rgba(255, 215, 0, 0.3)",    // 淡金 (和醇高貴)
        "徽菜": "rgba(169, 169, 169, 0.5)", // 淡灰 (山水墨韻)
        "浙菜": "rgba(144, 238, 144, 0.5)", // 淡綠 (清麗春色)
        "魯菜": "rgba(255, 255, 224, 0.5)"  // 淡黃 (豪邁大氣)
    };
    const selectedColor = cloudColors[cuisine] || "rgba(255, 255, 255, 0.8)";

    let particleClass = '';
    if (["川菜", "湘菜"].includes(cuisine)) particleClass = 'fire-particle';
    else if (["蘇菜", "浙菜"].includes(cuisine)) particleClass = 'petal-particle';
    else if (["粵菜", "閩菜"].includes(cuisine)) particleClass = 'mist-particle';
    else particleClass = 'ink-particle';

    // 生成背景緩緩流動的雲霧
    for (let i = 0; i < 6; i++) {
        createCloud(container, selectedColor);
    }

    for (let i = 0; i < 15; i++) {
        createParticle(container, particleClass);
    }
}

function createCloud(container, color) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud-particle';
    cloud.style.setProperty('--cloud-color', color);
    
    const top = Math.random() * 80;
    const size = 250 + Math.random() * 250;
    const duration = 30 + Math.random() * 30;
    const delay = Math.random() * -60; // 負值延遲讓雲霧在畫面載入時就已經分佈在各處

    cloud.style.top = `${top}%`;
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size * 0.6}px`; // 橢圓形狀
    cloud.style.animationDuration = `${duration}s`;
    cloud.style.animationDelay = `${delay}s`;
    container.appendChild(cloud);
}

function createParticle(container, className) {
    const particle = document.createElement('div');
    particle.className = `particle ${className}`;
    
    // 隨機位置與動畫延遲
    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 5;
    const delay = Math.random() * 3;
    const size = 4 + Math.random() * 12;

    particle.style.left = `${left}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = 0.2 + Math.random() * 0.5;
    
    container.appendChild(particle);
}

function saveResultImage() {
    triggerHaptic();
    
    // 1. 建立酷炫的快門閃光特效
    const flash = document.createElement('div');
    Object.assign(flash.style, {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'white', zIndex: 2000, opacity: 1, pointerEvents: 'none',
        transition: 'opacity 0.6s ease-out'
    });
    document.body.appendChild(flash);
    requestAnimationFrame(() => flash.style.opacity = 0);
    setTimeout(() => flash.remove(), 600);

    // 2. 準備捕捉：暫時隱藏按鈕
    const container = document.querySelector('.container');
    const buttons = document.querySelectorAll('.option-btn, .music-btn');
    buttons.forEach(btn => btn.style.visibility = 'hidden');

    // 3. 執行捕捉
    html2canvas(container, {
        useCORS: true,           // 允許跨網域圖片
        backgroundColor: '#f2ede4', // 確保背景是宣紙色
        scale: 2                 // 提高解析度讓分享更清晰
    }).then(canvas => {
        // 4. 觸發下載
        const cuisineName = document.getElementById('cuisine-name').innerText;
        const link = document.createElement('a');
        link.download = `我的菜系人格_${cuisineName}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 5. 恢復按鈕顯示
        buttons.forEach(btn => btn.style.visibility = 'visible');
    });
}

function triggerHaptic() {
    // 檢查瀏覽器是否支援振動功能 (主要支援 Android 設備)
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(20); // 震動 20 毫秒，產生輕微的回饋感
    }
}

window.onload = initPage;
