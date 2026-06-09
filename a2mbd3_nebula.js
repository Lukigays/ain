(function () {
  "use strict";

  if (typeof window.LUKYY_BOOKMARK_LOAD === "undefined") {
    console.log("%c[!] ACCESS DENIED [!]", "color:#f00;font-size:15px;font-weight:bold;background:#000;padding:5px;");
    return;
  }

  const _0x439d89 = {
    statusUrl: "https://raw.githubusercontent.com/Lukigays/ain/main/status.txt",
    keyUrl: "https://raw.githubusercontent.com/lukyyanim24-oss/apaya/main/key.txt?v=" + new Date().getTime(),
    validKeys: null,
    redirectUrl: "https://aincradmods.com/getkey?token=7e6d3dc2a446411c870605827719f7d2",
    telegramUrl: "https://t.me/lukyyarch",
    musicList: [
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/a2mbd3-background.mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(1).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(2).mp3"
    ],
    quotesList: [
      "Drop key lu di bawah, jangan polosan, no cap! 🤫",
      "Tetap putus asa, jangan pernah semangat! 🧠",
      "Bypass lancar, jaya jaya jaya! 🔥",
      "Vibe lu hari ini agak berbeda ya, cuy.. 🤔",
      "Jangan lupa bernapas, lu bukan robot! 🤖",
      "Wong pusat selalu memantau pergerakanmu. 👀",
      "Kunci sukses itu dikit bicara, banyak bypass. ⚡",
      "Masa depan lu tergantung key yang lu masukin. 🔮"
    ]
  };

  let _0x3e130f = null;
  let audioContext = null;
  let audioAnalyser = null;
  let audioDataArray = null;
  let audioSourceNode = null;
  let isReactiveRunning = true; 

  async function _0x225a2e() {
    try {
      const _0x39a9df = await fetch(_0x439d89.statusUrl + "?t=" + Date.now());
      const _0x1d785e = (await _0x39a9df.text()).trim();
      return _0x1d785e === "1";
    } catch (_0x74758b) {
      console.error("[✗] Status check failed:", _0x74758b);
      return false;
    }
  }

  async function fetchValidKeys() {
    try {
      const response = await fetch(_0x439d89.keyUrl + "?t=" + Date.now());
      const data = await response.json();
      
      let tempKeys = {};
      if (data && data.keys) {
        for (const [key, value] of Object.entries(data.keys)) {
          let processedValue = value;
          if (value !== "permanent" && !isNaN(value)) {
            processedValue = Number(value);
          }
          tempKeys[key.toLowerCase().trim()] = processedValue;
        }
      }
      _0x439d89.validKeys = tempKeys;
    } catch (err) {
      console.error("[✗] Failed to fetch JSON keys from GitHub:", err);
    }
  }

  function _0x58cd45() {
    if (!_0x3e130f) {
      const randomIndex = Math.floor(Math.random() * _0x439d89.musicList.length);
      const chosenMusic = _0x439d89.musicList[randomIndex];
      
      _0x3e130f = new Audio(chosenMusic);
      _0x3e130f.loop = true;
      _0x3e130f.volume = 1.0;
      _0x3e130f.crossOrigin = "anonymous";
    }
    _0x3e130f.play().then(() => {
      initAudioVisualizer();
    }).catch(() => {});
  }

  function initAudioVisualizer() {
    if (audioContext || !_0x3e130f) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
      audioAnalyser = audioContext.createAnalyser();
      audioAnalyser.fftSize = 256;

      audioSourceNode = audioContext.createMediaElementSource(_0x3e130f);
      audioSourceNode.connect(audioAnalyser);
      audioAnalyser.connect(audioContext.destination);

      const bufferLength = audioAnalyser.frequencyBinCount;
      audioDataArray = new Uint8Array(bufferLength);
      
      requestAnimationFrame(updateSoundReactiveElements);
    } catch (e) {
      console.error("Visualizer audio setup failed:", e);
    }
  }

  function updateSoundReactiveElements() {
    if (!isReactiveRunning) return;
    
    if (audioAnalyser && audioDataArray) {
      audioAnalyser.getByteFrequencyData(audioDataArray);
      
      let bassSum = 0;
      const bassRange = 8;
      for (let i = 0; i < bassRange; i++) { 
        bassSum += audioDataArray[i]; 
      }
      let bassIntensity = bassSum / bassRange; 
      
      let glowRadius = (bassIntensity / 255) * 25; 
      let borderOpacity = 0.15 + (bassIntensity / 255) * 0.65; 
      let scaleValue = 1 + (bassIntensity / 255) * 0.02; 
      
      const keyInput = document.getElementById("key-input");
      const systemBadge = document.getElementById("system-badge");

      if (keyInput && document.activeElement !== keyInput && !keyInput.classList.contains("shake-error")) { 
        keyInput.style.borderColor = `rgba(59, 130, 246, ${borderOpacity})`;
        keyInput.style.boxShadow = `0 0 ${glowRadius}px rgba(37, 99, 235, ${(bassIntensity / 255) * 0.4}), inset 0 2px 4px rgba(0,0,0,0.25)`;
        keyInput.style.transform = `scale(${scaleValue})`;
      }
      
      if (systemBadge) {
        systemBadge.style.opacity = `${0.4 + (bassIntensity / 255) * 0.6}`;
      }
    }
    
    requestAnimationFrame(updateSoundReactiveElements);
  }

  // Opsi 5: Fungsi partikel adaptif mengikuti tema/vibe status
  function _0x51e42d(theme = "default") {
    const oldParticles = document.getElementById("lukyy-particles");
    if (oldParticles) oldParticles.remove();

    const _0x2e92fb = document.createElement("div");
    _0x2e92fb.id = "lukyy-particles";
    _0x2e92fb.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483646;overflow:hidden;";
    
    let emojis = ["💎", "⚡", "🎮", "🎧", "💻", "🌀", "🛸", "⚔️", "🕶️", "🔵"];
    if (theme === "success") {
      emojis = ["🎉", "🔥", "✨", "👑", "🚀", "💰", "🟢"];
    } else if (theme === "error") {
      emojis = ["❌", "⚠️", "🛑", "💀", "💔"];
    }

    const particleCount = window.innerWidth < 600 ? 25 : 40;
    
    for (let _0x24f0fa = 0; _0x24f0fa < particleCount; _0x24f0fa++) {
      const _0x1de953 = document.createElement("div");
      _0x1de953.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      
      const fontSize = Math.random() * 16 + 12;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 8;
      
      _0x1de953.style.cssText = `
        position:absolute; font-size:${fontSize}px; left:${Math.random() * 100}%; bottom:-15%;
        user-select:none; pointer-events:none; filter: drop-shadow(0 0 8px rgba(37,99,235,0.5));
        animation:lukyy-emoji-float ${duration}s linear infinite; animation-delay:${delay}s;
        opacity:${Math.random() * 0.4 + 0.2};
      `;
      _0x2e92fb.appendChild(_0x1de953);
    }
    document.body.appendChild(_0x2e92fb);
  }

  function showCustomModal(title, message, icon, onConfirm) {
    const modalOverlay = document.createElement("div");
    modalOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(2,6,23,0.75);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;padding:20px;box-sizing:border-box;opacity:0;transition:opacity 0.3s ease-in-out;";
    
    modalOverlay.innerHTML = `
      <div style="background:linear-gradient(165deg, rgba(15,23,42,0.95), rgba(2,6,23,0.98));padding:30px 24px;border:1px solid rgba(59,130,246,0.25);border-radius:28px;width:min(360px,90vw);box-shadow:0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(37,99,235,0.15);text-align:center;transform:scale(0.85);transition:transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);box-sizing:border-box;">
        <div style="font-size:45px;margin-bottom:12px;filter:drop-shadow(0 0 10px rgba(59,130,246,0.35));">${icon}</div>
        <h4 style="margin:0 0 10px 0;font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:800;background:linear-gradient(135deg,#60a5fa,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px;">${title}</h4>
        <p style="color:#cbd5e1;font-size:13px;line-height:1.6;margin:0 0 24px 0;font-weight:500;white-space:pre-line;">${message}</p>
        <button id="modal-confirm-btn" class="genz-btn" style="width:100%;background:linear-gradient(135deg,#2563eb,#06b6d4);color:#fff;border:none;padding:14px;border-radius:18px;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px;box-shadow:0 8px 20px rgba(37,99,235,0.25);transition:all 0.2s;">Gasskeun, Oke! ⚡</button>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    setTimeout(() => {
      modalOverlay.style.opacity = "1";
      modalOverlay.children[0].style.transform = "scale(1)";
    }, 50);

    document.getElementById("modal-confirm-btn").addEventListener("click", () => {
      modalOverlay.style.opacity = "0";
      modalOverlay.children[0].style.transform = "scale(0.85)";
      setTimeout(() => {
        modalOverlay.remove();
        if (onConfirm) onConfirm();
      }, 250);
    });
  }

  function _0x231278() {
    const _0x143bf5 = document.createElement("div");
    _0x143bf5.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(2,6,23,0.96);z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans','Inter',sans-serif;padding:20px;";
    _0x143bf5.innerHTML = `<div style="text-align:center;background:rgba(255,255,255,0.02);padding:35px 25px;border:1px solid rgba(59,130,246,0.25);border-radius:32px;width:min(380px,90vw);box-shadow:0 20px 50px rgba(0,0,0,0.4);backdrop-filter:blur(20px);"><div style="font-size:50px;margin-bottom:10px;filter:drop-shadow(0 0 10px rgba(59,130,246,0.4));">⚙️</div><h3 style="margin:0 0 10px 0;background:linear-gradient(135deg,#2563eb,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:22px;font-weight:800;letter-spacing:-0.5px;">App Outdated, Real!</h3><p style="color:#94a3b8;font-size:13px;margin-bottom:25px;font-weight:500;">Vibe check failed, bro. Lu harus update dulu.</p><button id=\"update-btn\" style=\"width:100%;background:linear-gradient(135deg,#2563eb,#06b6d4);color:#fff;border:none;padding:14px;border-radius:18px;font-weight:700;cursor:pointer;font-family:inherit;font-size:14px;box-shadow:0 10px 20px rgba(37,99,235,0.25);transition:transform 0.2s;\">Gas Update Dimari ⚡</button></div>`;
    document.body.appendChild(_0x143bf5);
    document.getElementById("update-btn").addEventListener("click", () => { window.open(_0x439d89.telegramUrl, "_blank"); });
  }

  function fakeVisualizer(url) { window.location.href = url; }

  (async function () {
    const _0x253f1b = await _0x225a2e();
    if (!_0x253f1b) { _0x231278(); return; }
    
    await fetchValidKeys();
    _0x51e42d("default");

    const _0x19bd78 = document.getElementById("lukyy-auth");
    if (_0x19bd78) { _0x19bd78.remove(); }

    const _0x143e8e = document.createElement("style");
    _0x143e8e.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
      @keyframes lukyy-emoji-float {
        0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.5; }
        50% { transform: translateY(-50vh) translateX(20px) rotate(180deg); }
        90% { opacity: 0.5; }
        100% { transform: translateY(-115vh) translateX(-20px) rotate(360deg); opacity: 0; }
      }
      @keyframes lukyy-pulse-glow{0%,100%{box-shadow:0 0 40px rgba(37,99,235,0.15), inset 0 0 15px rgba(255,255,255,0.01)}50%{box-shadow:0 0 60px rgba(6,180,212,0.25), inset 0 0 25px rgba(255,255,255,0.03)}}
      
      @keyframes lukyy-shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-6px); }
        40%, 80% { transform: translateX(6px); }
      }
      .shake-error {
        animation: lukyy-shake 0.4s ease-in-out !important;
        border-color: #ef4444 !important;
        box-shadow: 0 0 25px rgba(239, 68, 68, 0.6) !important;
      }

      #key-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 25px rgba(37,99,235,0.45) !important; scale: 1.03 !important; }
      .genz-btn:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 10px 25px rgba(37,99,235,0.3); }
      .genz-btn:active { transform: translateY(1px); }
      
      /* Opsi 1: Style khusus container input field & button paste */
      .paste-input-container { position: relative; width: 100%; }
      .paste-btn { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 16px; cursor: pointer; opacity: 0.6; transition: all 0.2s; user-select: none; z-index: 5; }
      .paste-btn:hover { opacity: 1; transform: translateY(-50%) scale(1.1); }

      .profile-container { position: absolute; top: -12px; left: -12px; width: 38px; height: 38px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(59,130,246,0.25); box-shadow: 0 0 15px rgba(37,99,235,0.3); backdrop-filter: blur(10px); transition: all 0.3s ease; }
      .profile-container:hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(6,180,212,0.5); border-color: #06b6d4; }
      .profile-img { width: 100%; height: 100%; object-fit: cover; }
      .biodata-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(165deg, rgba(5,10,25,0.99), rgba(2,6,23,1)); border-radius: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; opacity: 0; pointer-events: none; transform: scale(0.9); transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); padding: 25px; box-sizing: border-box; }
      .biodata-overlay.active { opacity: 1; pointer-events: auto; transform: scale(1); }
      .biodata-card { text-align: left; width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(59,130,246,0.15); padding: 18px; border-radius: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.7; box-sizing: border-box; }
      .biodata-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #00ffcc, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 15px 0; text-align: center; letter-spacing: 1px; }
    `;
    document.head.appendChild(_0x143e8e);

    const randomQuote = _0x439d89.quotesList[Math.floor(Math.random() * _0x439d89.quotesList.length)];

    const _0x4e5c68 = document.createElement("div");
    _0x4e5c68.id = "lukyy-auth";
    _0x4e5c68.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background: linear-gradient(165deg, rgba(10,17,40,0.88), rgba(2,6,23,0.97));backdrop-filter:blur(25px);-webkit-backdrop-filter:blur(25px);color:#fff;padding:35px 30px;border-radius:32px;z-index:2147483647;font-family:'Plus Jakarta Sans',sans-serif;text-align:center;width:min(390px,92vw);box-sizing:border-box;border: 1px solid rgba(59,130,246,0.12);animation:lukyy-pulse-glow 6s ease-in-out infinite;";
    
    // Opsi 1: Diubah dengan membungkus elemen #key-input ke .paste-input-container & diselipin tombol #auto-paste-btn 📋
    _0x4e5c68.innerHTML = `
      <div id="panel-content" style="position:relative;z-index:1;">
        <div class="profile-container" id="profile-trigger" style="cursor:pointer;">
          <img src="https://raw.githubusercontent.com/Lukigays/ain/main/avatar.jpg" alt="Profile" class="profile-img" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=lukyy'">
        </div>

        <button id="music-btn" style="position:absolute;top:-12px;right:-12px;background:rgba(255,255,255,0.05);border:1px solid rgba(59,130,246,0.2);color:#93c5fd;border-radius:50%;width:38px;height:38px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);transition:all 0.3s ease;">🎵</button>

        <div style="margin-bottom:20px;">
          <div id="system-badge" style="display:inline-flex; align-items:center; gap:6px; background:rgba(37,99,235,0.15); padding:6px 14px; border-radius:100px; border:1px solid rgba(37,99,235,0.3); margin-bottom:14px; transition: opacity 0.1s ease;">
            <span style="width:6px; height:6px; background:#60a5fa; border-radius:50%; display:inline-block;"></span>
            <span style="font-size:10px; font-weight:700; color:#bfdbfe; letter-spacing:1.5px; text-transform:uppercase; font-family:'Space Grotesk';">SYSTEM ACTIVE, BRO</span>
          </div>
          <h3 style="margin:0; font-size:32px; font-weight:800; font-family:'Space Grotesk',sans-serif; background:linear-gradient(135deg, #3b82f6, #06b6d4, #1d4ed8); -webkit-background-clip:text;-webkit-text-fill-color:transparent; letter-spacing:-1px;">lukyyplr</h3>
          <p style="margin:6px 0 0 0; color:#94a3b8; font-size:13px; font-weight:500; min-height:38px; display:flex; align-items:center; justify-content:center;">${randomQuote}</p>
        </div>

        <div class="paste-input-container" style="margin-bottom:16px;">
          <input type="text" id="key-input" placeholder="tOmBoL cEpAt kEy dImArI..." style="
            width:100%; padding:16px 45px 16px 16px; 
            border:1.5px solid rgba(59,130,246,0.15); border-radius:20px;
            background:rgba(0,0,0,0.3); color:#fff; text-align:center;
            font-family:inherit; font-size:14px; font-weight:600;
            outline:none; backdrop-filter:blur(10px); 
            transition: border-color 0.1s ease, box-shadow 0.1s ease, transform 0.1s ease;
            box-sizing:border-box;">
          <button id="auto-paste-btn" class="paste-btn" title="Paste dari clipboard">📋</button>
        </div>

        <button id="login-btn" class="genz-btn" style="width:100%; background:linear-gradient(135deg, #2563eb, #1d4ed8);color:#fff; border:none; padding:16px;border-radius:20px; font-weight:700; cursor:pointer;font-family:inherit; font-size:14px; letter-spacing:0.5px;margin-bottom:12px; transition:all 0.2s ease;box-shadow:0 8px 20px rgba(37,99,235,0.25);">Unlock Dashboard, Gas! ⚡</button>
        <button id="support-btn" class="genz-btn" style="width:100%; background:rgba(255,255,255,0.03); color:#94a3b8;border:1px solid rgba(59,130,246,0.2); padding:13px;border-radius:18px; font-weight:600; cursor:pointer;font-family:inherit; font-size:13px; transition:all 0.2s ease;">Join Telegram Circle 💬</button>

        <div id="status-msg" style="margin-top:20px; font-size:11px; font-weight:700; color:#60a5fa; font-family:'Space Grotesk'; text-transform:uppercase; letter-spacing:2px; opacity:0.9;">
          ⚙️ WONG_PUSAT_STANDBY
        </div>
      </div>

      <div id="biodata-panel" class="biodata-overlay">
        <h4 class="biodata-title">✨ OWNER BIODATA ✨</h4>
        <div class="biodata-card">
          📌 <b>Nama:</b> Luki / Lukyyplr<br>
          🌐 <b>Linktree:</b> https://linktr.ee/lukyycuyy<br>
          💻 <b>Project:</b> Bypass Key System <br>
          💬 <b>Status:</b> Wong Pusat Standby 🔥
        </div>
        <button id="close-biodata-btn" class="genz-btn" style="width:100%; background:rgba(239,68,68,0.15); color:#ef4444;border:1px solid rgba(239,68,68,0.3); padding:13px;border-radius:18px; font-weight:700; cursor:pointer;font-family:inherit; font-size:13px; margin-top:20px; transition:all 0.2s;">Close Profile ✖️</button>
      </div>
    `;
    document.body.appendChild(_0x4e5c68);
    _0x58cd45();

    const _0x218e14 = document.getElementById("music-btn");
    const _0x224146 = document.getElementById("key-input");
    const _0x51b440 = document.getElementById("login-btn");
    const _0x2825ed = document.getElementById("support-btn");
    const _0x22304b = document.getElementById("status-msg");
    const profileTrigger = document.getElementById("profile-trigger");
    const biodataPanel = document.getElementById("biodata-panel");
    const closeBiodataBtn = document.getElementById("close-biodata-btn");
    
    // Opsi 1: Deklarasi handler tombol Auto-Paste Clipboard
    const autoPasteBtn = document.getElementById("auto-paste-btn");

    profileTrigger.addEventListener("click", () => { biodataPanel.classList.add("active"); });
    closeBiodataBtn.addEventListener("click", () => { biodataPanel.classList.remove("active"); });

    _0x218e14.addEventListener("click", () => {
      if (!_0x3e130f) { _0x58cd45(); _0x218e14.textContent = "🎵"; return; }
      if (_0x3e130f.paused) { 
        _0x3e130f.play().catch(() => {}); 
        if(audioContext && audioContext.state === "suspended") audioContext.resume();
        _0x218e14.textContent = "🎵"; 
      } 
      else { _0x3e130f.pause(); _0x218e14.textContent = "🔇"; }
    });

    _0x2825ed.addEventListener("click", () => { window.open(_0x439d89.telegramUrl, "_blank"); });

    // Opsi 1: Logika membaca clipboard sistem
    autoPasteBtn.addEventListener("click", async () => {
      try {
        const textFromClipboard = await navigator.clipboard.readText();
        if (textFromClipboard) {
          _0x224146.value = textFromClipboard.trim();
          _0x22304b.innerHTML = "📋 Key berhasil di-paste, gas log in!";
          _0x22304b.style.color = "#60a5fa";
        } else {
          _0x22304b.innerHTML = "📭 Clipboard lu kosong, Cuy";
          _0x22304b.style.color = "#f59e0b";
        }
      } catch (err) {
        console.error("Gagal membaca clipboard:", err);
        _0x22304b.innerHTML = "🛑 Izin clipboard ditolak browser";
        _0x22304b.style.color = "#ef4444";
      }
    });

    function showMainOptionsPanel() {
      isReactiveRunning = false; 
      const container = document.getElementById("panel-content");
      if (!container) return;
      
      container.innerHTML = `
        <h3 style="margin:0 0 8px 0; font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:800; background:linear-gradient(135deg, #3b82f6, #00ffcc); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Pilih Mode, Cuy</h3>
        <p style="color:#94a3b8; font-size:13px; margin-bottom:24px; font-weight:500;">Tentukan arah eksekusi lu sekarang</p>
        <button id="aincrad-flow-btn" class="genz-btn" style="width:100%; background:linear-gradient(135deg, #1d4ed8, #2563eb); color:#fff; border:none; padding:16px; border-radius:20px; font-weight:700; cursor:pointer; font-family:inherit; font-size:14px; box-shadow:0 8px 20px rgba(37,99,235,0.25); transition:all 0.2s;">🏰 AINCRAD MODE</button>
      `;
      document.getElementById("aincrad-flow-btn").addEventListener("click", () => { showAincradSpeedPanel(); });
    }

    function showAincradSpeedPanel() {
      const container = document.getElementById("panel-content");
      if (!container) return;
      container.innerHTML = `<div style="position:relative; width:100%;"><button id="speed-back-btn" style="position:absolute; top:-4px; left:0; background:none; border:none; color:#64748b; cursor:pointer; font-size:18px; font-weight:bold;">❮</button><h3 style="margin:0 0 6px 0; font-family:'Space Grotesk',sans-serif; font-size:24px; font-weight:800; background:linear-gradient(135deg, #00ffcc, #3b82f6); -webkit-background-clip:text;-webkit-text-fill-color:transparent; text-align:center;">Set Velocity Speed</h3><p style="color:#94a3b8; font-size:12px; margin-bottom:24px; text-align:center; font-weight:500;">Atur setelan injeksi biar ga loss</p><button id="fast-mode-btn" class="genz-btn" style="width:100%; background:rgba(16,185,129,0.1); color:#10b981; border:1px solid rgba(16,185,129,0.25); padding:14px; border-radius:18px; font-weight:700; cursor:pointer; font-family:inherit; font-size:13px; margin-bottom:12px; transition:all 0.2s;">💨 FAST MODE (SENGGOL DONG)</button><button id="medium-mode-btn" class="genz-btn" style="width:100%; background:rgba(245,158,11,0.1); color:#f59e0b; border:1px solid rgba(245,158,11,0.25); padding:14px; border-radius:18px; font-weight:700; cursor:pointer; font-family:inherit; font-size:13px; margin-bottom:12px; transition:all 0.2s;">🛡️ SECURE MODE (MAIN AMAN)</button><button id="slow-mode-btn" class="genz-btn" style="width:100%; background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.25); padding:14px; border-radius:18px; font-weight:700; cursor:pointer; font-family:inherit; font-size:13px; transition:all 0.2s;">🐌 SLOW MODE (ALON-ALON)</button></div>`;
      document.getElementById('speed-back-btn').addEventListener('click', showMainOptionsPanel);
      
      document.getElementById("fast-mode-btn").addEventListener("click", () => triggerAincradExecutionFlow(30));
      document.getElementById("medium-mode-btn").addEventListener("click", () => triggerAincradExecutionFlow(45));
      document.getElementById("slow-mode-btn").addEventListener("click", () => triggerAincradExecutionFlow(60));
    }

    async function triggerAincradExecutionFlow(selectedSeconds, customRedirectUrl) {
      const mainPanelContainer = document.getElementById("lukyy-auth");
      if (mainPanelContainer) { mainPanelContainer.remove(); }
      
      const checkOverlay = document.createElement('div');
      checkOverlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,6,23,0.97); backdrop-filter:blur(15px); -webkit-backdrop-filter:blur(15px); z-index:2147483647; display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans', sans-serif;";
      checkOverlay.innerHTML = `<div style="text-align:center; background:rgba(255,255,255,0.02); padding:50px 40px; border-radius:32px; border:1px solid rgba(59,130,246,0.2); width:340px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); position:relative; overflow:hidden;"><canvas id="lukyy-lava-canvas" width="340" height="400" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:0; opacity:0.5; pointer-events:none;"></canvas><div style="position:relative; z-index:2;"><div id="countdown-container" style="width: 100px; height: 100px; border-radius: 50%; border: 2px solid rgba(59,130,246,0.4); background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; font-size:36px; font-weight:800; color:#60a5fa; margin:0 auto 25px auto; transition: all 0.1s ease; font-family:'Space Grotesk', sans-serif;"><span id="countdown-text">${selectedSeconds}</span></div><p id="lukyy-check-text" style="color:#fff; font-size:15px; font-weight:700; margin:0; font-family:'Space Grotesk';">Lagi Ngaburit Bypass, Slow...</p><p style="color:#64748b; font-size:11px; margin-top:6px; font-weight:500;">Jangan di-close, biarkan kami memasak 🔥</p></div></div>`;
      document.body.appendChild(checkOverlay);

      if (audioContext && audioContext.state === "suspended") { audioContext.resume(); }

      const countdownTextNode = document.getElementById('countdown-text');
      const checkTextNode = document.getElementById('lukyy-check-text');
      const countdownContainer = document.getElementById('countdown-container');
      const canvas = document.getElementById('lukyy-lava-canvas');
      const ctx = canvas.getContext('2d');

      let timeLeft = selectedSeconds;
      let isTimerRunning = true;
      let globs = [];
      for (let i = 0; i < 10; i++) {
        globs.push({ x: Math.random() * canvas.width, y: canvas.height + (Math.random() * 100), baseY: canvas.height + (Math.random() * 100), r: Math.random() * 25 + 15, speed: Math.random() * 0.5 + 0.2, color: `hsl(${Math.random() * 40 + 200}, 90%, 55%)`, phase: Math.random() * Math.PI * 2 });
      }

      function renderLavaLamp() {
        if (!isTimerRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let audioIntensity = 0;
        let bassIntensity = 0;

        if (audioAnalyser && audioDataArray) {
          audioAnalyser.getByteFrequencyData(audioDataArray);
          let sum = 0;
          for (let i = 0; i < audioDataArray.length; i++) { sum += audioDataArray[i]; }
          audioIntensity = sum / audioDataArray.length;

          let bassSum = 0;
          for (let i = 0; i < 8; i++) { bassSum += audioDataArray[i]; }
          bassIntensity = bassSum / 8;

          let scaleValue = 1.0 + (bassIntensity / 255) * 0.15;
          let glowValue = 15 + (bassIntensity / 255) * 35;
          if (countdownContainer) {
            countdownContainer.style.transform = `scale(${scaleValue})`;
            countdownContainer.style.boxShadow = `0 0 ${glowValue}px rgba(37,99,235,${0.2 + (bassIntensity/255)*0.6})`;
            countdownContainer.style.borderColor = `rgba(6,180,212,${0.4 + (bassIntensity/255)*0.6})`;
          }
        }

        ctx.filter = 'blur(15px)';
        for (let i = 0; i < globs.length; i++) {
          let g = globs[i]; g.phase += 0.01; g.x += Math.sin(g.phase) * 0.3;
          let currentSpeed = g.speed + (audioIntensity / 255) * 1.5; g.y -= currentSpeed;
          let currentR = g.r + (audioIntensity / 255) * 10;
          if (g.y < -currentR * 2) { g.y = g.baseY; g.x = Math.random() * canvas.width; }
          ctx.beginPath(); ctx.arc(g.x, g.y, currentR, 0, Math.PI * 2); ctx.fillStyle = g.color; ctx.fill();
        }
        ctx.filter = 'none';
        requestAnimationFrame(renderLavaLamp);
      }
      requestAnimationFrame(renderLavaLamp);

      const timerInterval = setInterval(() => {
        timeLeft--;
        if (countdownTextNode) countdownTextNode.innerText = timeLeft;
        if (timeLeft <= 0) { clearInterval(timerInterval); isTimerRunning = false; executeFinalRedirectFlow(); }
      }, 1000);

      function executeFinalRedirectFlow() {
        if (countdownTextNode) { countdownTextNode.innerText = "✓"; countdownTextNode.style.color = "#10b981"; }
        if (checkTextNode) { checkTextNode.innerText = "Bypass Berhasil, Menyala Abangkuh! 🔥"; checkTextNode.style.color = "#10b981"; }
        setTimeout(() => {
            checkOverlay.remove();
            if (customRedirectUrl) { fakeVisualizer(customRedirectUrl); return; }
            fakeVisualizer(_0x439d89.redirectUrl);
        }, 1500);
      }
    }

    _0x51b440.addEventListener("click", async () => {
      const _0x428440 = _0x224146.value.trim();
      if (!_0x428440) {
        _0x22304b.innerHTML = "🛑 Key Kosong, Lu Malas Amat Dah";
        _0x22304b.style.color = "#ef4444";
        _0x51e42d("error"); // Opsi 5: Partikel ganti tema error ⚠️
        if (_0x224146) {
          _0x224146.classList.add("shake-error");
          setTimeout(() => { _0x224146.classList.remove("shake-error"); }, 400);
        }
        return;
      }

      _0x22304b.innerHTML = "⏳ Lagi vibe-check secure signature...";
      _0x22304b.style.color = "#3b82f6";
      _0x51b440.disabled = _0x2825ed.disabled = true;

      if (!_0x439d89.validKeys) {
        await fetchValidKeys();
      }

      setTimeout(() => {
        const _0x218b79 = _0x428440.toLowerCase().trim();
        
        if (_0x439d89.validKeys && _0x439d89.validKeys.hasOwnProperty(_0x218b79)) {
          const expiryCondition = _0x439d89.validKeys[_0x218b79];
          const currentTime = Date.now();

          if (expiryCondition === "permanent") {
            _0x22304b.innerHTML = "✅ Key Permanent Active, Selamanya Sepuh!";
            _0x22304b.style.color = "#10b981";
            _0x51e42d("success"); // Opsi 5: Partikel langsung ganti perayaan 🎉
            showCustomModal("ACCESS GRANTED", "Lu dapet akses Permanent, abangkuh!\nGak ada expired, bebas limit seumur hidup.", "✨", () => { showMainOptionsPanel(); });
          } 
          else {
            const parsedExpiry = Number(expiryCondition);
            
            if (!isNaN(parsedExpiry) && currentTime < parsedExpiry) {
              const expiryDate = new Date(parsedExpiry);
              const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
              
              const day = expiryDate.getDate();
              const month = months[expiryDate.getMonth()];
              const year = expiryDate.getFullYear();
              
              const hours = String(expiryDate.getHours()).padStart(2, '0');
              const minutes = String(expiryDate.getMinutes()).padStart(2, '0');
              const seconds = String(expiryDate.getSeconds()).padStart(2, '0');
              
              const formattedWIB = `WIB (UTC+7): ${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;

              _0x22304b.innerHTML = `✅ Key Valid!`;
              _0x22304b.style.color = "#10b981";
              _0x51e42d("success"); // Opsi 5: Partikel ganti tema sukses ✨
              showCustomModal(
                "ACCESS TEMPORARY", 
                `Key aktif.\n\nExpired pada:\n${formattedWIB}`, 
                "⏰", 
                () => { showMainOptionsPanel(); }
              );
            } 
            else {
              _0x22304b.innerHTML = "❌ Key Lu Dah Expired, Ngab!";
              _0x22304b.style.color = "#ef4444";
              _0x51e42d("error"); // Opsi 5: Partikel ganti tema error ❌
              _0x51b440.disabled = _0x2825ed.disabled = false;
              if (_0x224146) {
                _0x224146.classList.add("shake-error");
                setTimeout(() => { _0x224146.classList.remove("shake-error"); }, 400);
              }
            }
          }
        } else {
          _0x22304b.innerHTML = "❌ Key-nya L, Coba Lagi Cuy";
          _0x22304b.style.color = "#ef4444";
          _0x51e42d("error"); // Opsi 5: Partikel ganti tema salah 💀
          _0x51b440.disabled = _0x2825ed.disabled = false;
          if (_0x224146) {
            _0x224146.classList.add("shake-error");
            setTimeout(() => { _0x224146.classList.remove("shake-error"); }, 400);
          }
        }
      }, 1200);
    });

  })();
})();