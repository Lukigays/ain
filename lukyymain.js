(async function () {
  "use strict";

  if (typeof window.LUKYY_BOOKMARK_LOAD === "undefined") {
    console.log("%c[!] ACCESS DENIED [!]", "color:#00ffff;font-size:15px;font-weight:bold;background:#0a0a0a;padding:5px;border: 1px solid #00ffff;");
    return;
  }

  // --- CONFIGURATION SETUP ---
  const _0x439d89 = {
    keyUrl: "https://database-nine-flax.vercel.app/getkeys", 
    validKeys: null,

    // API AINCRAD BARU
    apiBaseUrl: "https://lol.a2mbd3.workers.dev",
    apiKey: "abdullah",
    totpSecret: "6ZQ4X3VPEK5XG2Q",
    fallbackRedirectUrl: "https://raw.githubusercontent.com/Lukigays/ain/main/index.html",
    
    telegramUrl: "https://t.me/lukyyarch",
    musicList: [
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(1).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(2).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(3).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(4).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(5).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(6).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(7).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(8).mp3",
      "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(9).mp3"
    ],
    quotesList: [
      "Drop key lu di bawah, jangan polosan, no cap! 🔥",
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
  let currentUserTier = "biasa"; 
  let originalPremiumKeyRaw = ""; 

  // --- VIP TEAM EXTRACTOR MODULE ---
  function extractVpLinkUrl() {
    try {
      const aTags = document.querySelectorAll("a");
      for (let a of aTags) {
        const href = a.getAttribute("href");
        if (href && href.includes("vplink.in")) {
          const match = href.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
          if (match) return match[0].replace(/[.,;:'")\]}]+$/, "");
        }
      }
      const elements = document.querySelectorAll("p, div, span, td, li, pre, code, strong, em, b, i, h1, h2, h3, h4, h5, h6");
      for (let el of elements) {
        const text = el.textContent || el.innerText || "";
        const match = text.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
        if (match) return match[0].replace(/[.,;:'")\]}]+$/, "");
      }
      const bodyText = document.body.innerText;
      const matchBody = bodyText.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
      if (matchBody) return matchBody[0].replace(/[.,;:'")\]}]+$/, "");
      
      const allElements = document.querySelectorAll("*");
      for (let el of allElements) {
        for (let attr of el.attributes) {
          if (attr.value && attr.value.includes("vplink.in")) {
            const match = attr.value.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
            if (match) return match[0].replace(/[.,;:'")\]}]+$/, "");
          }
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // --- POWERCHEATS EXTRACTOR MODULE ---
  function extractPowerCheatsUrl() {
    try {
      const href = window.location.href;
      if (href.includes("vplink.in")) {
        const match = href.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
        if (match) return match[0].replace(/[.,;:'")\]}]+$/, "");
        return href;
      }
      const scripts = document.querySelectorAll("script");
      for (let s of scripts) {
        const text = s.textContent || s.innerText || "";
        const match = text.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
        if (match && match[1] && match[1].includes("vplink.in")) {
          return match[1].replace(/[.,;:'")\]}]+$/, "");
        }
      }
      const html = document.documentElement.innerHTML;
      const matchHtml = html.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
      if (matchHtml) return matchHtml[0].replace(/[.,;:'")\]}]+$/, "");
      return null;
    } catch (e) {
      return null;
    }
  }

  function extractVpKey(urlStr) {
    try {
      let cleanUrl = urlStr.trim().split("?")[0].split("#")[0];
      const urlObj = new URL(cleanUrl);
      let path = urlObj.pathname.replace(/^\/+|\/+$/g, "");
      const key = path.split("/")[0];
      return key && key.length > 0 ? key : null;
    } catch (e) {
      try {
        const match = urlStr.match(/vplink\.in\/([^\/\s?#]+)/);
        if (match && match[1]) return match[1];
      } catch (err) {}
      return null;
    }
  }

  // --- TOTP & API SYSTEM INTEGRATION ---
  class TOTPGenerator {
    constructor(secret {
      this.secret = secret;
      this.timeStep = 30;
      this.digits = 6;
    }
    _sha1(data) {
      function rotl(n, s) { return (n << s) | (n >>> (32 - s)); }
      let h0 = 1732584193, h1 = 4023233417, h2 = 2562383102, h3 = 271733878, h4 = 3285377520;
      const ml = data.length * 8;
      data.push(128);
      while (data.length % 64 !== 56) data.push(0);
      data.push(0, 0, 0, 0);
      for (let i = 3; i >= 0; i--) data.push((ml >>> (i * 8)) & 255);
      for (let i = 0; i < data.length; i += 64) {
        const w = [];
        for (let j = 0; j < 16; j++) {
          w[j] = (data[i + j * 4] << 24) | (data[i + j * 4 + 1] << 16) | (data[i + j * 4 + 2] << 8) | data[i + j * 4 + 3];
        }
        for (let j = 16; j < 80; j++) {
          w[j] = rotl(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        }
        let a = h0, b = h1, c = h2, d = h3, e = h4;
        for (let j = 0; j < 80; j++) {
          let f, k;
          if (j < 20) { f = (b & c) | (~b & d); k = 1518500249; }
          else if (j < 40) { f = b ^ c ^ d; k = 1859775393; }
          else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 2400959708; }
          else { f = b ^ c ^ d; k = 3395469782; }
          const temp = (rotl(a, 5) + f + e + k + w[j]) >>> 0;
          e = d; d = c; c = rotl(b, 30); b = a; a = temp;
        }
        h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
      }
      const out = [];
      [h0, h1, h2, h3, h4].forEach(val => {
        for (let i = 3; i >= 0; i--) out.push((val >>> (i * 8)) & 255);
      });
      return out;
    }
    async hmacSha1(key, message) {
      const k = Array.from(key);
      const m = Array.from(new Uint8Array(message));
      const bs = 64;
      let kPad = k.length > bs ? this._sha1([...k]) : [...k];
      while (kPad.length < bs) kPad.push(0);
      const iKeyPad = kPad.map(val => val ^ 0x36);
      const oKeyPad = kPad.map(val => val ^ 0x5c);
      const innerHash = this._sha1([...iKeyPad, ...m]);
      const outerHash = this._sha1([...oKeyPad, ...innerHash]);
      return new Uint8Array(outerHash);
    }
    base32ToHex(base32) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      let bits = "", hex = "";
      base32 = base32.toUpperCase().replace(/=+$/, "");
      for (let i = 0; i < base32.length; i++) {
        const val = alphabet.indexOf(base32.charAt(i));
        if (val === -1) throw new Error("Invalid base32 character");
        bits += val.toString(2).padStart(5, "0");
      }
      for (let i = 0; i + 4 <= bits.length; i += 4) {
        hex += parseInt(bits.substr(i, 4), 2).toString(16);
      }
      return hex;
    }
    async generate(offset = 0) {
      const hexSecret = this.base32ToHex(this.secret);
      const epoch = Math.floor(Date.now() / 1000);
      const timeWindow = Math.floor(epoch / this.timeStep) + offset;
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setUint32(4, timeWindow, false);
      const keyArray = new Uint8Array(hexSecret.match(/.{2}/g).map(h => parseInt(h, 16)));
      const hmac = await this.hmacSha1(keyArray, buffer);
      const offsetVal = hmac[hmac.length - 1] & 0xf;
      const binary = ((hmac[offsetVal] & 0x7f) << 24) | ((hmac[offsetVal + 1] & 0xff) << 16) | ((hmac[offsetVal + 2] & 0xff) << 8) | (hmac[offsetVal + 3] & 0xff);
      const pin = binary % Math.pow(10, this.digits);
      return pin.toString().padStart(this.digits, "0");
    }
  }

  async function fetchDestinationUrl(type, attempt = 1, vpKey = null) {
    const totpGen = new TOTPGenerator(_0x439d89.totpSecret);
    const maxAttempts = 3;

    try {
      const pin = await totpGen.generate();
      let url = `${_0x439d89.apiBaseUrl}?file=crx.json&type=${type}&key=${_0x439d89.apiKey}&pin=${pin}`;
      if (vpKey) url += `&vp=${vpKey}`;

      const response = await fetch(url, { headers: { Accept: "application/json", "Cache-Control": "no-cache" } });

      if (!response.ok) {
        const prevPin = await totpGen.generate(-1);
        let retryUrl = `${_0x439d89.apiBaseUrl}?file=crx.json&type=${type}&key=${_0x439d89.apiKey}&pin=${prevPin}`;
        if (vpKey) retryUrl += `&vp=${vpKey}`;
        
        const retryResponse = await fetch(retryUrl, { headers: { Accept: "application/json" } });

        if (!retryResponse.ok) {
          if (attempt < maxAttempts) {
            await new Promise(r => setTimeout(r, 2000));
            return fetchDestinationUrl(type, attempt + 1, vpKey);
          }
          throw new Error("API completely rejected");
        }
        const data = await retryResponse.json();
        return processApiResponse(data, type, attempt, vpKey);
      }
      const data = await response.json();
      return processApiResponse(data, type, attempt, vpKey);
    } catch (err) {
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000));
        return fetchDestinationUrl(type, attempt + 1, vpKey);
      }
      return _0x439d89.fallbackRedirectUrl;
    }
  }

  function processApiResponse(data, type, attempt, vpKey) {
    const dest = data.destinationLink || _0x439d89.fallbackRedirectUrl;
    
    if (dest.includes("t.me/") || dest.includes("telegram.me/") || dest.includes("telegram.org/")) {
      if (attempt < 3) return fetchDestinationUrl(type, attempt + 1, vpKey);
      return _0x439d89.fallbackRedirectUrl;
    }

    try {
      const u = new URL(dest);
      if (u.protocol === "http:" || u.protocol === "https:") {
        return dest;
      }
    } catch (e) {}

    if (attempt < 3) return fetchDestinationUrl(type, attempt + 1, vpKey);
    return _0x439d89.fallbackRedirectUrl;
  }
  // --- END OF API SYSTEM ---

  function _0x58cd45() {
    const randomIndex = Math.floor(Math.random() * _0x439d89.musicList.length);
    const chosenMusic = _0x439d89.musicList[randomIndex];
    
    if (!_0x3e130f) { _0x3e130f = new Audio(chosenMusic); _0x3e130f.crossOrigin = "anonymous"; } 
    else { _0x3e130f.src = chosenMusic; }
    
    _0x3e130f.loop = false; _0x3e130f.volume = 1.0;
    _0x3e130f.onended = function() { _0x58cd45(); };
    _0x3e130f.play().then(() => { initAudioVisualizer(); }).catch(() => {});
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
    } catch (e) {}
  }

  function updateSoundReactiveElements() {
    if (!isReactiveRunning) return;
    if (audioAnalyser && audioDataArray) {
      audioAnalyser.getByteFrequencyData(audioDataArray);
      let bassSum = 0; const bassRange = 8;
      for (let i = 0; i < bassRange; i++) { bassSum += audioDataArray[i]; }
      let bassIntensity = bassSum / bassRange; 
      
      let multiplier = currentUserTier === "premium" ? 1.5 : 1.0;
      let glowRadius = ((bassIntensity / 255) * 35) * multiplier; 
      let borderOpacity = 0.3 + (bassIntensity / 255) * 0.7; 
      let scaleValue = 1 + ((bassIntensity / 255) * 0.02) * multiplier; 
      
      const keyInput = document.getElementById("key-input");
      const systemBadge = document.getElementById("system-badge");
      const mainPanel = document.getElementById("lukyy-auth");

      if (keyInput && document.activeElement !== keyInput && !keyInput.classList.contains("shake-error")) { 
        let glowColor = currentUserTier === "premium" ? "255, 215, 0" : "0, 243, 255"; 
        keyInput.style.borderColor = `rgba(${glowColor}, ${borderOpacity})`;
        keyInput.style.boxShadow = `0 0 ${glowRadius}px rgba(${glowColor}, ${(bassIntensity / 255) * 0.4}), inset 0 2px 10px rgba(0,0,0,0.5)`;
      }
      if (mainPanel && !mainPanel.classList.contains("panel-minimized")) {
        let shadowColor = currentUserTier === "premium" ? "255, 215, 0, 0.2" : "0, 243, 255, 0.2";
        mainPanel.style.boxShadow = `0 40px 100px rgba(0,0,0,0.8), 0 0 ${(bassIntensity / 255) * 40}px rgba(${shadowColor}), inset 0 1px 1px rgba(255,255,255,0.1)`;
      }
      if (systemBadge) { systemBadge.style.transform = `scale(${scaleValue})`; }
    }
    requestAnimationFrame(updateSoundReactiveElements);
  }

  function _0x51e42d(theme = "default") {
    const oldParticles = document.getElementById("lukyy-particles");
    if (oldParticles) oldParticles.remove();

    const _0x2e92fb = document.createElement("div");
    _0x2e92fb.id = "lukyy-particles";
    _0x2e92fb.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483646;overflow:hidden;";
    
    let emojis = ["💎", "⚡", "👾", "🌀", "🛸", "⚔️", "💠"];
    if (currentUserTier === "premium") emojis = ["👑", "🌟", "💎", "✨", "🔥", "🪙"]; 
    if (theme === "success") emojis = currentUserTier === "premium" ? ["👑", "✨", "🚀", "🔥", "🏆"] : ["🎉", "🔥", "✨", "🚀", "🟢"];
    else if (theme === "error") emojis = ["❌", "⚠️", "🛑", "💀", "💔"];

    const particleCount = window.innerWidth < 600 ? 25 : 45;
    let particleGlow = currentUserTier === "premium" ? "rgba(255, 215, 0, 0.6)" : "rgba(0, 243, 255, 0.5)";
    
    for (let _0x24f0fa = 0; _0x24f0fa < particleCount; _0x24f0fa++) {
      const _0x1de953 = document.createElement("div");
      _0x1de953.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      const fontSize = Math.random() * 16 + 10;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      _0x1de953.style.cssText = `position:absolute; font-size:${fontSize}px; left:${Math.random() * 100}%; bottom:-15%; user-select:none; pointer-events:none; filter: drop-shadow(0 0 10px ${particleGlow}); animation:lukyy-emoji-float ${duration}s linear infinite; animation-delay:${delay}s; opacity:${Math.random() * 0.5 + 0.3};`;
      _0x2e92fb.appendChild(_0x1de953);
    }
    document.body.appendChild(_0x2e92fb);
  }

  function showCustomModal(title, message, icon, onConfirm) {
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "lukyy-modal-overlay";
    modalOverlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;padding:20px;box-sizing:border-box;opacity:0;transition:opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1); background: rgba(5, 7, 12, 0.85); backdrop-filter: blur(8px);";
    
    let colorGradient = currentUserTier === "premium" ? "#ffd700,#ff8c00" : "#00f3ff,#0055ff";
    let btnGradient = currentUserTier === "premium" ? "linear-gradient(135deg,#ffd700,#ff8c00)" : "linear-gradient(135deg,#00f3ff,#0055ff)";
    let shadowColor = currentUserTier === "premium" ? "rgba(255,215,0,0.4)" : "rgba(0,243,255,0.4)";

    modalOverlay.innerHTML = `
      <div id="lukyy-modal-card" style="padding:35px 28px; border:1px solid rgba(255,255,255,0.1); border-radius:24px; width:min(380px,90vw); text-align:center; transform:scale(0.85) translateY(20px); transition:all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); box-sizing:border-box; background: rgba(15, 20, 35, 0.7); backdrop-filter:blur(30px); box-shadow: 0 30px 80px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1);">
        <div style="font-size:55px; margin-bottom:18px; filter:drop-shadow(0 0 20px ${shadowColor});">${icon}</div>
        <h4 style="margin:0 0 14px 0; font-family:'Space Grotesk',sans-serif; font-size:24px; font-weight:800; background:linear-gradient(135deg,${colorGradient}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:-0.5px;">${title}</h4>
        <p id="lukyy-modal-text" style="font-size:14px; line-height:1.7; margin:0 0 28px 0; font-weight:500; color:#94a3b8; white-space:pre-line; text-align:left;">${message}</p>
        <button id="modal-confirm-btn" class="genz-btn" style="width:100%; background:${btnGradient}; color:#000; border:none; padding:16px; border-radius:14px; font-weight:800; cursor:pointer; font-family:inherit; font-size:14px; box-shadow:0 10px 30px ${shadowColor}; transition:all 0.3s; text-transform:uppercase; letter-spacing:1px;">Gasskeun, Oke! ⚡</button>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    setTimeout(() => { 
      modalOverlay.style.opacity = "1"; 
      const card = document.getElementById("lukyy-modal-card");
      card.style.transform = "scale(1) translateY(0)"; 
    }, 50);

    document.getElementById("modal-confirm-btn").addEventListener("click", () => {
      modalOverlay.style.opacity = "0";
      document.getElementById("lukyy-modal-card").style.transform = "scale(0.9) translateY(-15px)";
      setTimeout(() => { modalOverlay.remove(); if (onConfirm) onConfirm(); }, 350);
    });
  }

  function fakeVisualizer(url) { window.location.href = url; }

  // ================================================================
  // 🔥 FITUR TAMBAHAN DARI DYNAMIC-BYPASS (DIADAPTASI UNTUK LUKYYMAIN)
  // ================================================================

  // --- CORS PROXY & JSONP FALLBACK ---
  async function corsFetch(url, options = {}) {
    try {
      const response = await fetch(url, { ...options, mode: 'cors', headers: { ...options.headers, 'Accept': 'application/json' } });
      if (response.ok) return response;
    } catch (e) {}

    try {
      const response = await fetch(url, { ...options, mode: 'no-cors', headers: { 'Accept': 'application/json' } });
      return response;
    } catch (e) {}

    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
      const response = await fetch(proxyUrl, { ...options, headers: { 'Accept': 'application/json' } });
      if (response.ok) return response;
    } catch (e) {}

    return new Promise((resolve, reject) => {
      const callbackName = 'nb_callback_' + Date.now();
      const script = document.createElement('script');
      const timeout = setTimeout(() => { cleanup(); reject(new Error('JSONP timeout')); }, 10000);
      function cleanup() { clearTimeout(timeout); delete window[callbackName]; if (script.parentNode) script.removeChild(script); }
      window[callbackName] = function(data) {
        cleanup();
        resolve({ ok: true, status: 200, json: () => Promise.resolve(data), text: () => Promise.resolve(JSON.stringify(data)) });
      };
      script.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;
      script.onerror = () => { cleanup(); reject(new Error('JSONP failed')); };
      document.head.appendChild(script);
    });
  }

  // --- NETWORK DETECTION ---
  function isMeteredConnection() {
    if (navigator.connection) {
      const conn = navigator.connection;
      if (conn.type === 'cellular') return true;
      if (conn.saveData === true) return true;
      if (conn.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return true;
    }
    return false;
  }

  // --- LOG QUEUE SYSTEM ---
  let logQueue = [];
  let isLoggingActive = false;
  let logInterval = null;

  function startLogQueue() {
    if (isLoggingActive) return;
    isLoggingActive = true;
    logInterval = setInterval(() => {
      if (logQueue.length > 0) {
        const entry = logQueue.shift();
        const statusMsg = document.getElementById('status-msg');
        if (statusMsg) {
          statusMsg.innerHTML = entry.icon + ' ' + entry.text;
          statusMsg.style.color = entry.color || '#00f3ff';
          statusMsg.style.borderColor = entry.color ? entry.color + '33' : 'rgba(0,243,255,0.2)';
          statusMsg.style.background = entry.color ? entry.color + '11' : 'rgba(0,243,255,0.05)';
        }
      }
    }, 150);
  }

  function stopLogQueue() {
    isLoggingActive = false;
    if (logInterval) { clearInterval(logInterval); logInterval = null; }
    while (logQueue.length > 0) logQueue.shift();
  }

  function queueLog(icon, text, color = '#94a3b8') {
    logQueue.push({ icon, text, color });
    if (!isLoggingActive) startLogQueue();
  }

  // --- FILLER LOGS (simulasi saat loading) ---
  let fillerLogsScheduled = false;
  let logTimers = [];

  function scheduleFillerLogs(remainingTime) {
    fillerLogsScheduled = true;
    const fillerBatches = [
      [{ icon: '🔍', text: 'SCANNING NETWORK INTERFACES...', color: '#4a5568' },
       { icon: '●', text: 'INTERFACE eth0: 192.168.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255), color: '#718096' },
       { icon: '●', text: 'INTERFACE wlan0: 10.0.' + Math.floor(Math.random()*255) + '.' + Math.floor(Math.random()*255), color: '#718096' },
       { icon: '🔒', text: 'ESTABLISHING SECURE TUNNEL...', color: '#00f2ff' }],
      [{ icon: '📊', text: 'ANALYZING RESPONSE HEADERS...', color: '#ffa500' },
       { icon: '●', text: 'CONTENT-TYPE: application/json', color: '#4a5568' },
       { icon: '●', text: 'CACHE-CONTROL: no-cache', color: '#4a5568' },
       { icon: '🛡', text: 'VERIFYING CORS POLICY...', color: '#00f2ff' }],
      [{ icon: '🔐', text: 'VALIDATING TOTP SIGNATURE...', color: '#ffa500' },
       { icon: '●', text: 'ALGORITHM: SHA-1 HMAC', color: '#4a5568' },
       { icon: '●', text: 'DIGITS: 6 | TIME STEP: 30s', color: '#4a5568' }]
    ];
    const batchInterval = remainingTime / (fillerBatches.length + 1);
    fillerBatches.forEach((batch, index) => {
      const timerId = setTimeout(() => {
        if (fillerLogsScheduled) batch.forEach(log => queueLog(log.icon, log.text, log.color));
      }, batchInterval * (index + 1));
      logTimers.push(timerId);
    });
  }

  function cancelFillerLogs() {
    fillerLogsScheduled = false;
    logTimers.forEach(t => clearTimeout(t));
    logTimers = [];
  }

  // --- TOAST NOTIFICATION ---
  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:2147483647;background:rgba(15,20,35,0.9);backdrop-filter:blur(20px);color:#fff;padding:10px 24px;border-radius:14px;font-size:12px;font-weight:600;letter-spacing:1px;pointer-events:none;border:1px solid rgba(0,243,255,0.3);box-shadow:0 10px 40px rgba(0,0,0,0.8);animation:fadeIn 0.3s ease;font-family:Plus Jakarta Sans,sans-serif;';
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 1500);
  }

  // --- SHAKE TO SKIP (goyang HP) ---
  let lastX = null, lastY = null, lastZ = null, shakeTimeout = null;

  function initShake() {
    if (!window.DeviceMotionEvent) return;
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(p => { if (p === 'granted') addShakeListener(); }).catch(() => {});
    } else addShakeListener();
  }

  function addShakeListener() {
    window.addEventListener('devicemotion', (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      if (lastX === null) { lastX = a.x; lastY = a.y; lastZ = a.z; return; }
      if (Math.abs(a.x - lastX) + Math.abs(a.y - lastY) + Math.abs(a.z - lastZ) > 15 && !shakeTimeout) {
        shakeTimeout = setTimeout(() => shakeTimeout = null, 1000);
        const musicBtn = document.getElementById('music-btn');
        if (musicBtn) { musicBtn.click(); showToast('🎵 SKIP TRACK!'); }
      }
      lastX = a.x; lastY = a.y; lastZ = a.z;
    });
  }

  // --- GLOW LAYER ANIMASI ---
  function createGlowLayers(wrapper) {
    const defaultGlow = document.createElement('div');
    defaultGlow.className = 'nb-glow-layer glow-default';
    wrapper.appendChild(defaultGlow);
    const focusGlow1 = document.createElement('div');
    focusGlow1.className = 'nb-glow-layer glow-focus-1';
    wrapper.appendChild(focusGlow1);
    const focusGlow2 = document.createElement('div');
    focusGlow2.className = 'nb-glow-layer glow-focus-2';
    wrapper.appendChild(focusGlow2);
    return { defaultGlow, focusGlow1, focusGlow2 };
  }

  function activateFocusGlow(f1, f2) { if (f1) f1.style.opacity = '1'; if (f2) f2.style.opacity = '1'; }
  function deactivateFocusGlow(f1, f2) { if (f1) f1.style.opacity = '0'; if (f2) f2.style.opacity = '0'; }

  // --- PROGRESS BAR DINAMIS ---
  let exploitProgressRAF = null;
  let exploitProgressActive = false;

  function startProgressBar(totalTime = 25000) {
    exploitProgressActive = true;
    const bar = document.getElementById('nb-progress-exploit');
    const pct = document.getElementById('nb-progress-pct');
    const t0 = Date.now();
    (function tick() {
      if (!exploitProgressActive) return;
      const elapsed = Date.now() - t0;
      const p = Math.min(elapsed / totalTime * 100, 100);
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = Math.floor(p) + '%';
      if (p >= 100) { exploitProgressActive = false; return; }
      exploitProgressRAF = requestAnimationFrame(tick);
    })();
  }

  // --- STATUS PANEL (ban/suspend/maintenance) ---
  function showStatusPanel(icon, title, desc, btnText, btnAction, countdown) {
    const ov = document.createElement('div');
    ov.className = 'nb-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:2147483647;display:grid;place-items:center;padding:20px;backdrop-filter:blur(10px);';
    const wrapper = document.createElement('div');
    wrapper.className = 'nb-electric-wrapper';
    wrapper.style.cssText = 'position:relative;padding:3px;border-radius:24px;background:rgba(0,0,0,0.05);overflow:hidden;width:400px;max-width:calc(100vw - 40px);';
    const glowLayers = createGlowLayers(wrapper);
    const container = document.createElement('div');
    container.className = 'nb-container';
    container.style.cssText = 'position:relative;background:#e0e5ec;padding:35px 28px;border-radius:21px;text-align:center;z-index:1;';
    container.innerHTML = `
      <div style="font-size:55px;margin-bottom:18px;">${icon}</div>
      <h3 style="font-family:Space Grotesk,sans-serif;font-size:24px;font-weight:800;color:#4a5568;margin:0 0 10px;">${title}</h3>
      <p style="color:#718096;font-size:14px;line-height:1.7;margin:0 0 20px;">${desc}</p>
      ${btnText ? `<button id="nb-status-btn" style="width:100%;padding:14px;border:none;border-radius:14px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 10px 30px rgba(102,126,234,0.4);">${btnText}</button>` : ''}
      ${countdown ? `<p style="color:#718096;font-size:10px;margin-top:12px;">Auto-redirect in <span id="nb-countdown" style="font-weight:700;">${countdown}</span>s</p>` : ''}
    `;
    wrapper.appendChild(container);
    ov.appendChild(wrapper);
    document.body.appendChild(ov);
    if (btnText && btnAction) document.getElementById('nb-status-btn')?.addEventListener('click', btnAction);
    if (countdown && btnAction) {
      let cd = countdown;
      const cdEl = document.getElementById('nb-countdown');
      const timer = setInterval(() => { cd--; if (cdEl) cdEl.textContent = cd; if (cd <= 0) { clearInterval(timer); btnAction(); } }, 1000);
    }
  }

  // --- STYLE TAMBAHAN UNTUK GLOW & PROGRESS ---
  function injectGlowStyles() {
    if (document.getElementById('nb-glow-styles')) return;
    const st = document.createElement('style');
    st.id = 'nb-glow-styles';
    st.textContent = `
      @keyframes nb-rotate-glow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes nb-rotate-glow-reverse { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
      @keyframes nb-glow-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 0.9; } }
      @keyframes nb-progress-glow { 0%,100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(180deg); } }
      @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      @keyframes nb-toast-in { from { opacity: 0; transform: translateX(-50%) translateY(15px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      .nb-glow-layer { position: absolute; inset: -50%; pointer-events: none; z-index: 0; animation: nb-glow-pulse 3s ease-in-out infinite; }
      .nb-glow-layer.glow-default { background: conic-gradient(transparent 0deg, #00f3ff 60deg, transparent 120deg, #ff00ff 180deg, transparent 240deg, #00f3ff 300deg, transparent 360deg); animation: nb-rotate-glow 4s linear infinite; opacity: 1; }
      .nb-glow-layer.glow-focus-1 { background: conic-gradient(transparent 0deg, #00f3ff 90deg, transparent 180deg, #ff00ff 270deg, transparent 360deg); animation: nb-rotate-glow 2.5s linear infinite; opacity: 0; transition: opacity 0.4s ease; }
      .nb-glow-layer.glow-focus-2 { background: conic-gradient(transparent 0deg, #ff00ff 90deg, transparent 180deg, #00f3ff 270deg, transparent 360deg); animation: nb-rotate-glow-reverse 3s linear infinite; opacity: 0; transition: opacity 0.4s ease; }
      .nb-overlay { animation: fadeIn 0.3s ease; }
      .nb-progress-bar-fill { transition: width 0.15s linear; background: linear-gradient(90deg, #00f3ff, #ff00ff, #2ecc71); background-size: 200% 100%; animation: nb-progress-glow 4s linear infinite; }
      .nb-progress-bar-fill.error-fill { background: linear-gradient(90deg, #ff4757, #ffa500, #ff4757) !important; }
      .nb-progress-bar-fill.vipteam-success { background: linear-gradient(90deg, #ff00ff, #2ecc71, #ff00ff) !important; background-size: 200% 100% !important; animation: nb-progress-glow 2s linear infinite !important; }
    `;
    document.head.appendChild(st);
  }
  injectGlowStyles();

  // --- ENHANCE AFTER LOGIN (integrasi ke flow utama) ---
  function enhanceAfterLogin() {
    startLogQueue();
    queueLog('⚡', 'SYSTEM BOOT COMPLETE', '#00f3ff');
    queueLog('🔐', 'SECURE CHANNEL ESTABLISHED', '#2ecc71');
    
    if (isMeteredConnection()) {
      queueLog('📱', 'MOBILE DATA DETECTED — MUSIC BLOCKED', '#ffa500');
      showToast('📱 Mobile data: Music disabled');
    } else {
      queueLog('📶', 'WIFI DETECTED — MUSIC ENABLED', '#2ecc71');
    }
    
    initShake();
    
    setTimeout(() => { stopLogQueue(); }, 5000);
  }

  // ================================================================
  // AKHIR FITUR TAMBAHAN
  // ================================================================

  (async function () {
    _0x51e42d("default");

    const _0x19bd78 = document.getElementById("lukyy-auth");
    if (_0x19bd78) { _0x19bd78.remove(); }

    const _0x143e8e = document.createElement("style");
    _0x143e8e.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700;800&display=swap');
      
      @keyframes lukyy-emoji-float { 
        0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; } 
        10% { opacity: 0.8; } 
        50% { transform: translateY(-50vh) translateX(30px) rotate(180deg); } 
        90% { opacity: 0.8; } 
        100% { transform: translateY(-115vh) translateX(-30px) rotate(360deg); opacity: 0; } 
      }
      @keyframes lukyy-shake { 
        0%, 100% { transform: translateX(0); } 
        20%, 60% { transform: translateX(-8px); } 
        40%, 80% { transform: translateX(8px); } 
      }
      @keyframes neonPulse {
        0%, 100% { filter: drop-shadow(0 0 15px rgba(0, 243, 255, 0.4)); }
        50% { filter: drop-shadow(0 0 25px rgba(0, 243, 255, 0.8)); }
      }
      
      .shake-error { animation: lukyy-shake 0.4s ease-in-out !important; border-color: #ff0055 !important; box-shadow: 0 0 30px rgba(255, 0, 85, 0.6) !important; }
      
      #key-input:focus { 
        border-color: #00f3ff !important; 
        box-shadow: 0 0 35px rgba(0, 243, 255, 0.5), inset 0 2px 10px rgba(0,0,0,0.5) !important; 
        background: rgba(10,15,30,0.8) !important; 
      }
      
      .genz-btn { 
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
        position: relative; 
        overflow: hidden; 
      }
      .genz-btn::after {
        content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
        opacity: 0; transform: scale(0.5); transition: opacity 0.3s, transform 0.3s;
      }
      .genz-btn:hover { transform: translateY(-3px); filter: brightness(1.2); }
      .genz-btn:hover::after { opacity: 1; transform: scale(1); }
      .genz-btn:active { transform: translateY(1px); filter: brightness(0.9); }
      
      .paste-input-container { position: relative; width: 100%; display: flex; align-items: center; }
      .input-actions-container { position: absolute; right: 12px; display: flex; align-items: center; gap: 6px; height: 100%; z-index: 5; }
      
      .action-icon-btn { 
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); 
        border-radius: 8px; font-size: 14px; cursor: pointer; color: #94a3b8; 
        transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; 
        padding: 6px; backdrop-filter: blur(5px);
      }
      .action-icon-btn:hover { background: rgba(0, 243, 255, 0.15); border-color: #00f3ff; color: #fff; transform: scale(1.1); box-shadow: 0 0 10px rgba(0, 243, 255, 0.3); }
      
      .profile-container { 
        position: absolute; top: -20px; left: -20px; width: 55px; height: 55px; 
        border-radius: 16px; overflow: hidden; border: 2px solid rgba(0, 243, 255, 0.5); 
        box-shadow: 0 10px 25px rgba(0, 243, 255, 0.4); backdrop-filter: blur(15px); 
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); transform: rotate(-5deg);
      }
      .profile-container:hover { transform: scale(1.15) rotate(0deg) translateY(-5px); box-shadow: 0 15px 35px rgba(0, 243, 255, 0.6); border-color: #00f3ff; }
      .profile-img { width: 100%; height: 100%; object-fit: cover; }
      
      .biodata-overlay { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 24px; 
        display: flex; flex-direction: column; align-items: center; justify-content: center; 
        z-index: 999; opacity: 0; pointer-events: none; transform: scale(0.95) translateY(10px); 
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); padding: 30px; box-sizing: border-box; 
        background: rgba(10, 15, 30, 0.9); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); 
      }
      .biodata-overlay.active { opacity: 1; pointer-events: auto; transform: scale(1) translateY(0); }
      
      .biodata-card { text-align: left; width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 16px; font-size: 14px; line-height: 1.8; color:#cbd5e1; box-sizing: border-box; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5); }
      .biodata-title { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #00f3ff, #ff00ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 20px 0; text-align: center; letter-spacing: 1px; filter: drop-shadow(0 0 10px rgba(255,0,234,0.3)); }
      
      #lukyy-auth { 
        background: linear-gradient(145deg, rgba(15,20,35,0.7), rgba(5,7,12,0.9)); 
        color: #ffffff; border: 1px solid rgba(0, 243, 255, 0.2); 
        box-shadow: 0 40px 100px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.1); 
      }
      #lukyy-auth p { color: #94a3b8; } 
      
      #key-input { 
        background: rgba(0,0,0,0.6) !important; color: #fff !important; 
        border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 14px !important; 
        letter-spacing: 0.5px;
      }
      #key-input::placeholder { color: rgba(255,255,255,0.3); font-weight: 500; }
      
      #support-btn { 
        background: rgba(255,255,255,0.03); color: #cbd5e1; 
        border: 1px solid rgba(255,255,255,0.08); 
      }
      #support-btn:hover { background: rgba(0, 243, 255, 0.1); border-color: rgba(0, 243, 255, 0.4); color: #fff; }
      
      #key-input:disabled { 
        background: rgba(255, 215, 0, 0.05) !important; color: #ffd700 !important; 
        border-color: rgba(255, 215, 0, 0.4) !important; cursor: not-allowed !important; 
        font-weight: 800 !important; text-align: center !important; padding-right: 50px !important; 
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.4); -webkit-text-fill-color: #ffd700 !important; 
      }
    `;
    document.head.appendChild(_0x143e8e);

    const randomQuote = _0x439d89.quotesList[Math.floor(Math.random() * _0x439d89.quotesList.length)];

    const _0x4e5c68 = document.createElement("div");
    _0x4e5c68.id = "lukyy-auth";
    _0x4e5c68.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);padding:40px 32px;border-radius:24px;z-index:2147483647;font-family:'Plus Jakarta Sans',sans-serif;text-align:center;width:min(400px,92vw);box-sizing:border-box;backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);";
    
    _0x4e5c68.innerHTML = `
      <div id="panel-content" style="position:relative;z-index:1;">
        <div class="profile-container" id="profile-trigger" style="cursor:pointer;" title="Liat Profil Sepuh">
          <img src="https://raw.githubusercontent.com/Lukigays/ain/main/avatar.jpg" alt="Profile" class="profile-img" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=lukyyplr'">
        </div>

        <button id="music-btn" style="position:absolute;top:-20px;right:-20px;background:rgba(10,15,30,0.8);border:1px solid rgba(0,243,255,0.4);color:#00f3ff;border-radius:14px;width:45px;height:45px;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(15px);transition:all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);box-shadow: 0 10px 25px rgba(0,243,255,0.3); transform: rotate(5deg);" title="Play/Pause/Skip Music">🎵</button>

        <div style="margin-bottom:28px;">
          <div id="system-badge" style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,0,0,0.5); padding:6px 14px; border-radius:8px; border:1px solid rgba(0, 243, 255, 0.3); margin-bottom:18px; transition: transform 0.1s ease; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);">
            <span id="badge-dot" style="width:8px; height:8px; background:#00f3ff; border-radius:50%; display:inline-block; box-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff;"></span>
            <span id="badge-text" style="font-size:10px; font-weight:800; color:#e2e8f0; letter-spacing:2px; text-transform:uppercase; font-family:'Space Grotesk';">SYSTEM STANDBY</span>
          </div>
          <h3 style="margin:0; font-size:38px; font-weight:800; font-family:'Space Grotesk',sans-serif; background:linear-gradient(135deg, #ffffff, #00f3ff); -webkit-background-clip:text;-webkit-text-fill-color:transparent; letter-spacing:-1.5px; filter: drop-shadow(0 0 15px rgba(0,243,255,0.2));">LUKYYPLR</h3>
          <p style="margin:10px 0 0 0; font-size:14px; font-weight:500; min-height:42px; display:flex; align-items:center; justify-content:center; line-height:1.5;">${randomQuote}</p>
          <div id="premium-timer-info" style="font-size: 12px; font-weight: 700; color: #ffd700; margin-top: 8px; display: none; background: rgba(255,215,0,0.1); padding: 6px; border-radius: 6px; border: 1px solid rgba(255,215,0,0.2);"></div>
        </div>

        <div id="auth-form-area">
          <div class="paste-input-container" style="margin-bottom:20px;">
            <input type="password" id="key-input" placeholder="Inject Access Key..." style="
              width:100%; padding:18px 85px 18px 22px; 
              text-align:left; font-family:inherit; font-size:14px; font-weight:600;
              outline:none; backdrop-filter:blur(10px); 
              transition: all 0.3s ease;
              box-sizing:border-box;">
            
            <div id="input-actions-wrapper" class="input-actions-container">
              <button id="toggle-visibility-btn" class="action-icon-btn" title="View/Hide Key">👁️</button>
              <button id="auto-paste-btn" class="action-icon-btn" title="Auto Paste">📋</button>
            </div>
          </div>

          <div id="interactive-area" style="margin-bottom:16px;">
            <button id="login-btn" class="genz-btn" style="width:100%; background:linear-gradient(135deg, #00f3ff, #0055ff); color:#000; border:none; padding:18px; border-radius:14px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 10px 30px rgba(0, 243, 255, 0.4);">Unlock Dashboard ⚡</button>
          </div>
        </div>

        <button id="support-btn" class="genz-btn" style="width:100%; padding:15px; border-radius:14px; font-weight:600; cursor:pointer; font-family:inherit; font-size:13px; letter-spacing:0.5px;">Join Telegram Circle 💬</button>

        <div id="status-msg" style="margin-top:26px; font-size:11px; font-weight:800; color:#00f3ff; font-family:'Space Grotesk'; text-transform:uppercase; letter-spacing:2px; opacity:0.9; background: rgba(0, 243, 255, 0.05); padding: 8px; border-radius: 8px; border: 1px dashed rgba(0, 243, 255, 0.2);">
          ⚙️ WONG_PUSAT_STANDBY
        </div>
      </div>

      <div id="biodata-panel" class="biodata-overlay">
        <h4 class="biodata-title">✨ OWNER BIODATA ✨</h4>
        <div class="biodata-card">
          <div style="margin-bottom:10px;">📌 <span style="color:#00f3ff; font-weight:700;">Nama:</span> Luki / Lukyyplr</div>
          <div style="margin-bottom:10px;">🌐 <span style="color:#00f3ff; font-weight:700;">Linktree:</span> https://linktr.ee/lukyycuyy</div>
          <div style="margin-bottom:10px;">💻 <span style="color:#00f3ff; font-weight:700;">Project:</span> Bypass Key System</div>
          <div>💬 <span style="color:#00f3ff; font-weight:700;">Status:</span> Wong Pusat Standby 🔥</div>
        </div>
        <button id="close-biodata-btn" class="genz-btn" style="width:100%; background:rgba(255, 0, 85, 0.15); color:#ff0055; border:1px solid rgba(255, 0, 85, 0.4); padding:16px; border-radius:14px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:13px; text-transform:uppercase; letter-spacing:1px; margin-top:24px; box-shadow: 0 10px 20px rgba(255,0,85,0.2);">Close Profile ✖️</button>
      </div>
    `;
    document.body.appendChild(_0x4e5c68);
    
    // Mencegah animasi hover profile nabrak music button
    document.getElementById("music-btn").addEventListener("mouseover", function(){ this.style.transform = "scale(1.15) rotate(0deg)"; });
    document.getElementById("music-btn").addEventListener("mouseout", function(){ this.style.transform = "rotate(5deg)"; });

    _0x58cd45();

    const _0x218e14 = document.getElementById("music-btn");
    const _0x224146 = document.getElementById("key-input");
    const _0x51b440 = document.getElementById("login-btn");
    const _0x2825ed = document.getElementById("support-btn");
    const _0x22304b = document.getElementById("status-msg");
    const profileTrigger = document.getElementById("profile-trigger");
    const biodataPanel = document.getElementById("biodata-panel");
    const closeBiodataBtn = document.getElementById("close-biodata-btn");
    const autoPasteBtn = document.getElementById("auto-paste-btn");
    const toggleVisibilityBtn = document.getElementById("toggle-visibility-btn");

    profileTrigger.addEventListener("click", () => { biodataPanel.classList.add("active"); });
    closeBiodataBtn.addEventListener("click", () => { biodataPanel.classList.remove("active"); });

    _0x218e14.addEventListener("click", () => {
      if (currentUserTier === "premium") { console.log("[🎵 VIP] Melewati lagu saat ini..."); _0x58cd45(); return; }
      if (!_0x3e130f) { _0x58cd45(); _0x218e14.textContent = "🎵"; return; }
      if (_0x3e130f.paused) { _0x3e130f.play().catch(() => {}); if(audioContext && audioContext.state === "suspended") audioContext.resume(); _0x218e14.textContent = "🎵"; } 
      else { _0x3e130f.pause(); _0x218e14.textContent = "🔇"; }
    });

    _0x2825ed.addEventListener("click", () => { window.open(_0x439d89.telegramUrl, "_blank"); });

    toggleVisibilityBtn.addEventListener("click", () => {
      if (_0x224146.type === "password") {
        _0x224146.type = "text"; toggleVisibilityBtn.textContent = "🙈"; toggleVisibilityBtn.title = "Sembunyikan Key";
        if (currentUserTier === "premium") _0x224146.value = "👑 VIP: " + originalPremiumKeyRaw;
      } else {
        _0x224146.type = "password"; toggleVisibilityBtn.textContent = "👁️"; toggleVisibilityBtn.title = "Lihat Key";
        if (currentUserTier === "premium") _0x224146.value = originalPremiumKeyRaw; 
      }
    });

    autoPasteBtn.addEventListener("click", async () => {
      try {
        const textFromClipboard = await navigator.clipboard.readText();
        if (textFromClipboard) { _0x224146.value = textFromClipboard.trim(); _0x22304b.innerHTML = "📋 Key di-paste, siap gas!"; _0x22304b.style.color = "#00f3ff"; } 
        else { _0x22304b.innerHTML = "📭 Clipboard lu kosong, Cuy"; _0x22304b.style.color = "#ff8c00"; }
      } catch (err) { _0x22304b.innerHTML = "🛑 Izin clipboard ditolak browser"; _0x22304b.style.color = "#ff0055"; }
    });

    function lockDashboardMenu(formattedWIB) {
      const keyInput = document.getElementById("key-input");
      const autoPasteBtn = document.getElementById("auto-paste-btn");
      const toggleVisibilityBtn = document.getElementById("toggle-visibility-btn");
      const interactiveArea = document.getElementById("interactive-area");
      const timerInfo = document.getElementById("premium-timer-info");

      if (keyInput) {
        keyInput.type = "password"; keyInput.value = originalPremiumKeyRaw; keyInput.disabled = true; 
        if (currentUserTier === "premium") keyInput.style.cssText += "background: rgba(255, 215, 0, 0.05) !important; color: #ffd700 !important; border-color: rgba(255, 215, 0, 0.5) !important;";
        else keyInput.style.cssText += "background: rgba(0, 243, 255, 0.05) !important; color: #00f3ff !important; border-color: rgba(0, 243, 255, 0.5) !important;";
        if (toggleVisibilityBtn) { toggleVisibilityBtn.textContent = "👁️"; toggleVisibilityBtn.title = "Lihat Key"; }
      }
      if (autoPasteBtn) autoPasteBtn.remove();
      if (timerInfo) { timerInfo.innerText = `⏳ EXPIRED: ${formattedWIB}`; timerInfo.style.display = "block"; if (currentUserTier !== "premium") { timerInfo.style.color = "#00f3ff"; timerInfo.style.background = "rgba(0,243,255,0.1)"; timerInfo.style.borderColor = "rgba(0,243,255,0.2)"; } }
      
      if (interactiveArea) {
        let btnGradient = currentUserTier === "premium" ? "linear-gradient(135deg, #ffd700, #ff8c00)" : "linear-gradient(135deg, #00f3ff, #0055ff)";
        let shadowColor = currentUserTier === "premium" ? "rgba(255,215,0,0.4)" : "rgba(0,243,255,0.4)";

        interactiveArea.innerHTML = `<button id="open-aincrad-btn" class="genz-btn" style="width:100%; background:${btnGradient}; color:#000; border:none; padding:18px; border-radius:14px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 10px 30px ${shadowColor};">Access Menu Bypass 🏰</button>`;
        document.getElementById("open-aincrad-btn").addEventListener("click", () => {
          if (currentUserTier === "premium") showMainOptionsPanel();
          else triggerAincradExecutionFlow(60, "2"); 
        });
      }
    }

    function showMainOptionsPanel() {
      isReactiveRunning = false; 
      const container = document.getElementById("panel-content");
      if (!container) return;
      
      let titleGradient = currentUserTier === "premium" ? "linear-gradient(135deg, #ffd700, #ff8c00)" : "linear-gradient(135deg, #00f3ff, #0055ff)";
      
      let btnAincradGrad = currentUserTier === "premium" ? "linear-gradient(135deg, #ffd700, #ff8c00)" : "linear-gradient(135deg, #00f3ff, #0055ff)";
      let btnProxyGrad = currentUserTier === "premium" ? "linear-gradient(135deg, #ff8c00, #d9534f)" : "linear-gradient(135deg, #0055ff, #6600ff)";
      let btnVipTeamGrad = currentUserTier === "premium" ? "linear-gradient(135deg, #ff00ea, #8a2be2)" : "linear-gradient(135deg, #ff00ff, #8a2be2)";
      let btnUniGrad = currentUserTier === "premium" ? "linear-gradient(135deg, #00ff88, #009955)" : "linear-gradient(135deg, #00ffcc, #009966)";

      let textCol = "#000"; // Black text on bright buttons for cyberpunk contrast
      let textColW = "#fff"; // White for darker buttons

      container.innerHTML = `
        <h3 style="margin:0 0 10px 0; font-family:'Space Grotesk',sans-serif; font-size:28px; font-weight:800; background:${titleGradient}; -webkit-background-clip:text; -webkit-text-fill-color:transparent; filter: drop-shadow(0 0 10px rgba(255,255,255,0.1));">COMMAND CENTER</h3>
        <p style="font-size:14px; margin-bottom:24px; font-weight:500; color:#94a3b8;">Pilih target eksekusi bypass lu</p>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <button id="aincrad-menu-btn" class="genz-btn" style="width:100%; background:${btnAincradGrad}; color:${textCol}; border:none; padding:16px; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 8px 25px rgba(255,255,255,0.1);">🏰 Aincrad Protocol</button>
          <button id="proxy-menu-btn" class="genz-btn" style="width:100%; background:${btnProxyGrad}; color:${textColW}; border:none; padding:16px; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 8px 25px rgba(255,255,255,0.1);">🌐 Aincrad Proxy</button>
          <button id="vipteam-menu-btn" class="genz-btn" style="width:100%; background:${btnVipTeamGrad}; color:${textColW}; border:none; padding:16px; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 8px 25px rgba(255,0,234,0.2);">💎 VIP Team Byps</button>
          <button id="uni-menu-btn" class="genz-btn" style="width:100%; background:${btnUniGrad}; color:${textCol}; border:none; padding:16px; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 8px 25px rgba(0,255,136,0.2);">🌍 Universal Vplink</button>
        </div>
      `;

      document.getElementById("aincrad-menu-btn").addEventListener("click", () => {
        if (currentUserTier === "premium") showAincradSpeedPanel("2"); 
        else triggerAincradExecutionFlow(60, "2"); 
      });

      document.getElementById("proxy-menu-btn").addEventListener("click", () => {
        if (currentUserTier === "premium") showAincradSpeedPanel("1"); 
        else triggerAincradExecutionFlow(60, "1");   
      });

      document.getElementById("vipteam-menu-btn").addEventListener("click", () => {
        if (currentUserTier === "premium") showAincradSpeedPanel("vp"); 
        else triggerAincradExecutionFlow(60, "vp");   
      });

      document.getElementById("uni-menu-btn").addEventListener("click", () => {
        showUniversalVplinkPanel();
      });
    }

    function showUniversalVplinkPanel() {
      const container = document.getElementById("panel-content");
      if (!container) return;
      
      let titleGradient = currentUserTier === "premium" ? "linear-gradient(135deg, #00ff88, #00cc66)" : "linear-gradient(135deg, #00ffcc, #009966)";
      let btnUniGrad = currentUserTier === "premium" ? "linear-gradient(135deg, #00ff88, #009955)" : "linear-gradient(135deg, #00ffcc, #009966)";

      container.innerHTML = `
        <div style="position:relative; width:100%">
          <button id="uni-back-btn" class="action-icon-btn" style="position:absolute; top:0; left:0; width:35px; height:35px; font-size:16px;">❮</button>
          <h3 style="margin:0 0 10px 0; font-family:'Space Grotesk',sans-serif; font-size:24px; font-weight:800; background:${titleGradient}; -webkit-background-clip:text;-webkit-text-fill-color:transparent; text-align:center;">UNIVERSAL VPLINK</h3>
          <p style="font-size:13px; margin-bottom:24px; text-align:center; font-weight:500; color:#94a3b8;">Paste link vplink.in lu di bawah</p>

          <input type="text" id="uni-vplink-input" placeholder="https://vplink.in/xxxxx" style="width:100%; padding:18px; border-radius:14px; border:1px solid rgba(255,255,255,0.15); background:rgba(0,0,0,0.6); color:#fff; font-family:inherit; font-size:14px; margin-bottom:20px; box-sizing:border-box; outline:none; transition: all 0.3s ease;">

          <button id="uni-submit-btn" class="genz-btn" style="width:100%; background:${btnUniGrad}; color:#000; border:none; padding:18px; border-radius:14px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:14px; text-transform:uppercase; letter-spacing:1px; box-shadow:0 10px 30px rgba(0, 255, 136, 0.3);">EXECUTE 🔥</button>
          <p id="uni-error-msg" style="color:#ff0055; font-size:12px; margin-top:14px; display:none; font-weight:700; text-align:center;"></p>
        </div>`;

      document.getElementById('uni-back-btn').addEventListener('click', showMainOptionsPanel);

      const inputField = document.getElementById('uni-vplink-input');
      inputField.addEventListener('focus', () => {
        inputField.style.border = "1px solid #00ff88";
        inputField.style.boxShadow = "0 0 20px rgba(0, 255, 136, 0.2)";
        document.getElementById('uni-error-msg').style.display = "none";
      });
      inputField.addEventListener('blur', () => {
        inputField.style.border = "1px solid rgba(255,255,255,0.15)";
        inputField.style.boxShadow = "none";
      });

      document.getElementById('uni-submit-btn').addEventListener('click', () => {
        const inputVal = inputField.value.trim();
        const err = document.getElementById('uni-error-msg');
        
        if(!inputVal.includes('vplink.in')) {
          err.innerText = "Target invalid! Kudu vplink.in cuy.";
          err.style.display = "block";
          inputField.style.border = "1px solid #ff0055";
          return;
        }
        
        const vpKey = extractVpKey(inputVal);
        if(!vpKey) {
          err.innerText = "Failed ekstrak key, cek format link.";
          err.style.display = "block";
          inputField.style.border = "1px solid #ff0055";
          return;
        }

        if (currentUserTier === "premium") showAincradSpeedPanel("uni_vp", vpKey);
        else triggerAincradExecutionFlow(60, "uni_vp", vpKey);
      });
    }

    function showAincradSpeedPanel(targetType, customVpKey = null) {
      const container = document.getElementById("panel-content");
      if (!container) return;

      let titleGradient = "linear-gradient(135deg, #ffd700, #ff8c00)";

      container.innerHTML = `
        <div style="position:relative; width:100%">
          <button id="speed-back-btn" class="action-icon-btn" style="position:absolute; top:0; left:0; width:35px; height:35px; font-size:16px;">❮</button>
          <h3 style="margin:0 0 10px 0; font-family:'Space Grotesk',sans-serif; font-size:24px; font-weight:800; background:${titleGradient}; -webkit-background-clip:text;-webkit-text-fill-color:transparent; text-align:center;">VELOCITY SPEED</h3>
          <p style="font-size:13px; margin-bottom:28px; text-align:center; font-weight:500; color:#94a3b8;">Atur setelan injeksi biar stabil</p>
          
          <div style="display:flex; flex-direction:column; gap:14px;">
            <button id="fast-mode-btn" class="genz-btn" style="width:100%; background:rgba(0, 255, 136, 0.1); color:#00ff88; border:1px solid rgba(0, 255, 136, 0.4); padding:16px; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:13px; text-transform:uppercase; letter-spacing:1px; box-shadow: inset 0 0 10px rgba(0,255,136,0.1);">💨 FAST (Senggol Dong)</button>
            <button id="medium-mode-btn" class="genz-btn" style="width:100%; background:rgba(255, 215, 0, 0.1); color:#ffd700; border:1px solid rgba(255, 215, 0, 0.4); padding:16px; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:13px; text-transform:uppercase; letter-spacing:1px; box-shadow: inset 0 0 10px rgba(255,215,0,0.1);">🛡️ SECURE (Main Aman)</button>
            <button id="slow-mode-btn" class="genz-btn" style="width:100%; background:rgba(255, 0, 85, 0.1); color:#ff0055; border:1px solid rgba(255, 0, 85, 0.4); padding:16px; border-radius:12px; font-weight:800; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:13px; text-transform:uppercase; letter-spacing:1px; box-shadow: inset 0 0 10px rgba(255,0,85,0.1);">🐌 SLOW (Alon-Alon)</button>
          </div>
        </div>`;
      document.getElementById('speed-back-btn').addEventListener('click', showMainOptionsPanel);
      
      document.getElementById("fast-mode-btn").addEventListener("click", () => triggerAincradExecutionFlow(20, targetType, customVpKey)); 
      document.getElementById("medium-mode-btn").addEventListener("click", () => triggerAincradExecutionFlow(30, targetType, customVpKey));
      document.getElementById("slow-mode-btn").addEventListener("click", () => triggerAincradExecutionFlow(45, targetType, customVpKey));
    }

    async function triggerAincradExecutionFlow(selectedSeconds, targetType, customVpKey = null) {
      const mainPanelContainer = document.getElementById("lukyy-auth");
      if (mainPanelContainer) { mainPanelContainer.remove(); }
      
      const checkOverlay = document.createElement('div');
      checkOverlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:#05070c; z-index:2147483647; display:flex; align-items:center; justify-content:center; font-family:'Plus Jakarta Sans', sans-serif;";
      
      let panelBorder = currentUserTier === "premium" ? "rgba(255,215,0,0.4)" : "rgba(0,243,255,0.4)";
      let numColor = currentUserTier === "premium" ? "#ffd700" : "#00f3ff";

      checkOverlay.innerHTML = `
        <div style="text-align:center; background:rgba(15,20,35,0.8); backdrop-filter:blur(20px); padding:55px 45px; border-radius:32px; border:1px solid ${panelBorder}; width:min(360px, 90vw); box-shadow: 0 40px 100px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.1); position:relative; overflow:hidden;">
          <canvas id="lukyy-lava-canvas" width="360" height="400" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:0; opacity:0.6; pointer-events:none;"></canvas>
          <div style="position:relative; z-index:2;">
            <div id="countdown-container" style="width: 115px; height: 115px; border-radius: 50%; border: 3px solid ${numColor}; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; font-size:45px; font-weight:800; color:${numColor}; margin:0 auto 30px auto; transition: all 0.15s ease; font-family:'Space Grotesk', sans-serif; box-shadow: inset 0 0 20px rgba(0,0,0,0.8);">
              <span id="countdown-text" style="filter: drop-shadow(0 0 10px ${numColor});">${selectedSeconds}</span>
            </div>
            <p id="lukyy-check-text" style="color:#fff; font-size:16px; font-weight:800; margin:0; font-family:'Space Grotesk'; text-transform:uppercase; letter-spacing:1px;">Injecting Payload...</p>
            <p style="color:#94a3b8; font-size:12px; margin-top:10px; font-weight:500;">Biarin kita memasak di dapur 🍳🔥</p>
          </div>
        </div>`;
      document.body.appendChild(checkOverlay);

      if (audioContext && audioContext.state === "suspended") { audioContext.resume(); }

      const countdownTextNode = document.getElementById('countdown-text');
      const checkTextNode = document.getElementById('lukyy-check-text');
      const countdownContainer = document.getElementById('countdown-container');
      const canvas = document.getElementById('lukyy-lava-canvas');
      const ctx = canvas.getContext('2d');
      
      let isTimerRunning = true;

      let vpKey = customVpKey;
      let apiTargetType = targetType;

      if (targetType === "vp" || targetType === "pc" || targetType === "uni_vp") {
        apiTargetType = "vp"; 
      }

      // EKSTRAKSI KHUSUS VPLINK (VIP, POWERCHEATS, UNIVERSAL)
      if (targetType === "vp") {
        checkTextNode.innerText = "Scanning vplink.in... 🔍";
        const vpUrl = extractVpLinkUrl();
        if (vpUrl) vpKey = extractVpKey(vpUrl);
      } else if (targetType === "pc") {
        checkTextNode.innerText = "Scanning PowerCheats... 🔍";
        const vpUrl = extractPowerCheatsUrl();
        if (vpUrl) vpKey = extractVpKey(vpUrl);
      } else if (targetType === "uni_vp") {
        checkTextNode.innerText = "Parsing Uni-Vplink... 🔍";
      }

      if ((targetType === "vp" || targetType === "pc" || targetType === "uni_vp") && !vpKey) {
        checkTextNode.innerText = "❌ TARGET NOT FOUND!";
        checkTextNode.style.color = "#ff0055";
        if (countdownTextNode) {
            countdownTextNode.innerText = "!";
            countdownTextNode.style.color = "#ff0055";
            countdownContainer.style.borderColor = "#ff0055";
        }
        isTimerRunning = false;
        setTimeout(() => { 
          checkOverlay.remove(); 
          document.body.appendChild(_0x4e5c68);
          showMainOptionsPanel(); 
        }, 3500);
        return;
      }
      if (vpKey) {
        checkTextNode.innerText = `Key Acquired: ${vpKey.substring(0, 8)}... 🔥`;
      }

      // MULAI KICK OFF API FETCH DI BACKGROUND
      let finalRedirectUrl = _0x439d89.fallbackRedirectUrl;
      fetchDestinationUrl(apiTargetType, 1, vpKey).then(fetchedUrl => {
          finalRedirectUrl = fetchedUrl;
      }).catch(err => {
          console.error("API Error: ", err);
      });

      let timeLeft = selectedSeconds;
      let globs = [];
      
      let lavaHue = currentUserTier === "premium" ? 45 : 180; 
      if (targetType === "vp" || targetType === "pc" || targetType === "uni_vp") lavaHue = 300; 

      for (let i = 0; i < 12; i++) {
        globs.push({ x: Math.random() * canvas.width, y: canvas.height + (Math.random() * 100), baseY: canvas.height + (Math.random() * 100), r: Math.random() * 30 + 15, speed: Math.random() * 0.6 + 0.2, color: `hsla(${Math.random() * 30 + lavaHue}, 100%, 50%, 0.7)`, phase: Math.random() * Math.PI * 2 });
      }

      function renderLavaLamp() {
        if (!isTimerRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let audioIntensity = 0; let bassIntensity = 0;

        if (audioAnalyser && audioDataArray) {
          audioAnalyser.getByteFrequencyData(audioDataArray);
          let sum = 0; for (let i = 0; i < audioDataArray.length; i++) { sum += audioDataArray[i]; }
          audioIntensity = sum / audioDataArray.length;
          let bassSum = 0; for (let i = 0; i < 8; i++) { bassSum += audioDataArray[i]; }
          bassIntensity = bassSum / 8;

          let scaleValue = 1.0 + (bassIntensity / 255) * 0.15;
          let glowValue = 20 + (bassIntensity / 255) * 40;
          if (countdownContainer) {
            let glowC = currentUserTier === "premium" ? "255,215,0" : "0,243,255";
            if (targetType === "vp" || targetType === "pc" || targetType === "uni_vp") glowC = "255,0,234";
            
            countdownContainer.style.transform = `scale(${scaleValue})`;
            countdownContainer.style.boxShadow = `0 0 ${glowValue}px rgba(${glowC},${0.3 + (bassIntensity/255)*0.5}), inset 0 0 20px rgba(0,0,0,0.8)`;
            countdownContainer.style.borderColor = `rgba(${glowC},${0.5 + (bassIntensity/255)*0.5})`;
          }
        }

        ctx.filter = 'blur(18px)';
        for (let i = 0; i < globs.length; i++) {
          let g = globs[i]; g.phase += 0.01; g.x += Math.sin(g.phase) * 0.5;
          let currentSpeed = g.speed + (audioIntensity / 255) * 2; g.y -= currentSpeed;
          let currentR = g.r + (audioIntensity / 255) * 12;
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
        if (countdownTextNode) { countdownTextNode.innerText = "✓"; countdownTextNode.style.color = "#00ff88"; countdownContainer.style.borderColor = "#00ff88"; }
        if (checkTextNode) { checkTextNode.innerText = "BYPASS SUCCESS 🔥"; checkTextNode.style.color = "#00ff88"; }
        setTimeout(() => {
            checkOverlay.remove();
            fakeVisualizer(finalRedirectUrl);
        }, 1500);
      }
    }

    // VALIDASI KEY KE API VERCEL (dimodifikasi untuk panggil enhanceAfterLogin)
    async function processKeyVerification(rawKey, isAutoLogin = false) {
      const inputKeyClean = rawKey.trim();
      originalPremiumKeyRaw = inputKeyClean;

      try {
        const response = await fetch(`${_0x439d89.keyUrl}?key=${encodeURIComponent(inputKeyClean)}`);
        const result = await response.json();

        // JIKA MENANG / SUKSES VALIDASI
        if (response.ok && result.status === "success") {
          currentUserTier = result.type ? result.type.toLowerCase().trim() : "biasa";
          localStorage.setItem("lukyy_saved_key", inputKeyClean);
          if (_0x224146) _0x224146.value = inputKeyClean;

          let formattedWIB = "LIFETIME / PERMANENT";
          if (result.expiry && result.expiry !== "permanent" && !isNaN(result.expiry)) {
            const expiryDate = new Date(Number(result.expiry));
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
            formattedWIB = `${expiryDate.getDate()} ${months[expiryDate.getMonth()]} ${expiryDate.getFullYear()} | ${String(expiryDate.getHours()).padStart(2, '0')}:${String(expiryDate.getMinutes()).padStart(2, '0')} WIB`;
          }

          if (currentUserTier === "premium") {
            document.getElementById("badge-text").innerText = "👑 VIP SYSTEM ACTIVE";
            document.getElementById("badge-dot").style.background = "#ffd700";
            document.getElementById("badge-dot").style.boxShadow = "0 0 10px #ffd700";
            document.getElementById("status-msg").innerText = "👑 WONG PUSAT PRIVILEGE";
            document.getElementById("status-msg").style.color = "#ffd700";
            document.getElementById("status-msg").style.borderColor = "rgba(255,215,0,0.3)";
            document.getElementById("status-msg").style.background = "rgba(255,215,0,0.1)";
            _0x218e14.textContent = "⏭️"; 

            _0x22304b.innerHTML = isAutoLogin ? "⚡ AUTO LOGIN VIP!" : "👑 ACCESS GRANTED!";
            _0x22304b.style.color = "#ffd700";
            _0x51b440.disabled = _0x2825ed.disabled = false;

            showCustomModal(
              "👑 SEPUH DETECTED", 
              `Welcome back Wong Pusat!\n\nExpired: ${formattedWIB}\n\n🚀 VIP FEATURES:\n• All-Access Menu Bypass\n• Velocity Speed Control\n• Premium Music Controller\n• Cyber-Gold Interface`, 
              "👑", 
              () => { 
                lockDashboardMenu(formattedWIB);
                enhanceAfterLogin(); 
              } 
            );
          } else {
            _0x22304b.innerHTML = "✅ STANDARD KEY OK!";
            _0x22304b.style.color = "#00f3ff";
            _0x51e42d("success"); 
            _0x51b440.disabled = _0x2825ed.disabled = false;

            showCustomModal(
              "⚡ ACCESS GRANTED", 
              `Key Biasa Valid.\n\nExpired: ${formattedWIB}\n\n🚀 EXECUTION INFO:\n• Default Auto Redirect\n• Waiting Time: 60s`, 
              "⚡", 
              () => { 
                lockDashboardMenu(formattedWIB);
                enhanceAfterLogin(); 
              } 
            );
          }

        } else {
          // JIKA SERVER VERCEL MENOLAK 
          localStorage.removeItem("lukyy_saved_key");
          _0x22304b.innerHTML = `❌ ${result.message || 'Key Invalid / Expired!'}`;
          _0x22304b.style.color = "#ff0055";
          _0x22304b.style.borderColor = "rgba(255,0,85,0.3)";
          _0x22304b.style.background = "rgba(255,0,85,0.1)";
          _0x51e42d("error"); 
          _0x51b440.disabled = _0x2825ed.disabled = false;
          if (_0x224146) { _0x224146.classList.add("shake-error"); setTimeout(() => { _0x224146.classList.remove("shake-error"); }, 400); }
        }

      } catch (err) {
        console.error("[✗] Terjadi error saat memanggil API Vercel: ", err);
        _0x22304b.innerHTML = "❌ SERVER CONNECTION FAILED!";
        _0x22304b.style.color = "#ff0055";
        _0x51e42d("error");
        _0x51b440.disabled = _0x2825ed.disabled = true;
      }
    }

    _0x51b440.addEventListener("click", async () => {
      const _0x428440 = _0x224146.value.trim();
      if (!_0x428440) {
        _0x22304b.innerHTML = "🛑 KEY KOSONG CUY!";
        _0x22304b.style.color = "#ff0055";
        _0x51e42d("error"); 
        if (_0x224146) { _0x224146.classList.add("shake-error"); setTimeout(() => { _0x224146.classList.remove("shake-error"); }, 400); }
        return;
      }
      _0x22304b.innerHTML = "⏳ Validating secure signature...";
      _0x22304b.style.color = "#00f3ff";
      _0x51b440.disabled = _0x2825ed.disabled = true;

      setTimeout(() => { processKeyVerification(_0x428440, false); }, 1200);
    });

    const savedKey = localStorage.getItem("lukyy_saved_key");
    if (savedKey) {
      _0x224146.value = savedKey;
      _0x22304b.innerHTML = "💾 SAVED KEY LOADED. CLICK UNLOCK!";
      _0x22304b.style.color = "#ff8c00";
    }

  })();
})();