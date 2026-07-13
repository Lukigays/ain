(async function () {
  "use strict";

  if (typeof window.LUKYY_BOOKMARK_LOAD === "undefined") {
    console.log("%c[!] ACCESS DENIED [!]", "color:#00ffff;font-size:15px;font-weight:bold;background:#0a0a0a;padding:5px;border: 1px solid #00ffff;");
    return;
  }

  // --- CONFIGURATION ---
  const CONFIG = {
    keyUrl: "https://database-nine-flax.vercel.app/getkeys",
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

  let audioPlayer = null;
  let audioCtx = null;
  let audioAnalyser = null;
  let audioData = null;
  let audioSource = null;
  let isReactive = true;
  let userTier = "biasa";
  let rawPremiumKey = "";
  let currentMusicIndex = 0;

  // --- UTILITY FUNCTIONS (SAME) ---
  function extractVpLinkUrl() {
    try {
      const anchors = document.querySelectorAll("a");
      for (let a of anchors) {
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
    } catch (e) { return null; }
  }

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
    } catch (e) { return null; }
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

  // --- TOTP & API (SAME) ---
  class TOTP {
    constructor(secret) {
      this.secret = secret;
      this.step = 30;
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
      const timeWindow = Math.floor(epoch / this.step) + offset;
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

  async function fetchDestination(type, attempt = 1, vpKey = null) {
    const totp = new TOTP(CONFIG.totpSecret);
    const maxAttempts = 3;
    try {
      const pin = await totp.generate();
      let url = `${CONFIG.apiBaseUrl}?file=crx.json&type=${type}&key=${CONFIG.apiKey}&pin=${pin}`;
      if (vpKey) url += `&vp=${vpKey}`;
      const resp = await fetch(url, { headers: { Accept: "application/json", "Cache-Control": "no-cache" } });
      if (!resp.ok) {
        const prevPin = await totp.generate(-1);
        let retryUrl = `${CONFIG.apiBaseUrl}?file=crx.json&type=${type}&key=${CONFIG.apiKey}&pin=${prevPin}`;
        if (vpKey) retryUrl += `&vp=${vpKey}`;
        const retryResp = await fetch(retryUrl, { headers: { Accept: "application/json" } });
        if (!retryResp.ok) {
          if (attempt < maxAttempts) {
            await new Promise(r => setTimeout(r, 2000));
            return fetchDestination(type, attempt + 1, vpKey);
          }
          throw new Error("API rejected");
        }
        const data = await retryResp.json();
        return processApiResponse(data, type, attempt, vpKey);
      }
      const data = await resp.json();
      return processApiResponse(data, type, attempt, vpKey);
    } catch (err) {
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, 2000));
        return fetchDestination(type, attempt + 1, vpKey);
      }
      return CONFIG.fallbackRedirectUrl;
    }
  }

  function processApiResponse(data, type, attempt, vpKey) {
    const dest = data.destinationLink || CONFIG.fallbackRedirectUrl;
    if (dest.includes("t.me/") || dest.includes("telegram.me/") || dest.includes("telegram.org/")) {
      if (attempt < 3) return fetchDestination(type, attempt + 1, vpKey);
      return CONFIG.fallbackRedirectUrl;
    }
    try {
      const u = new URL(dest);
      if (u.protocol === "http:" || u.protocol === "https:") return dest;
    } catch (e) {}
    if (attempt < 3) return fetchDestination(type, attempt + 1, vpKey);
    return CONFIG.fallbackRedirectUrl;
  }

  // --- MUSIC ---
  function playRandomMusic() {
    const idx = Math.floor(Math.random() * CONFIG.musicList.length);
    const src = CONFIG.musicList[idx];
    if (!audioPlayer) {
      audioPlayer = new Audio(src);
      audioPlayer.crossOrigin = "anonymous";
    } else {
      audioPlayer.src = src;
    }
    audioPlayer.loop = false;
    audioPlayer.volume = 1.0;
    audioPlayer.onended = playRandomMusic;
    audioPlayer.play().then(() => initAudioVisualizer()).catch(() => {});
  }

  function initAudioVisualizer() {
    if (audioCtx || !audioPlayer) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
      audioAnalyser = audioCtx.createAnalyser();
      audioAnalyser.fftSize = 256;
      audioSource = audioCtx.createMediaElementSource(audioPlayer);
      audioSource.connect(audioAnalyser);
      audioAnalyser.connect(audioCtx.destination);
      audioData = new Uint8Array(audioAnalyser.frequencyBinCount);
      requestAnimationFrame(updateReactive);
    } catch (e) {}
  }

  function updateReactive() {
    if (!isReactive) return;
    if (audioAnalyser && audioData) {
      audioAnalyser.getByteFrequencyData(audioData);
      let bassSum = 0;
      for (let i = 0; i < 8; i++) bassSum += audioData[i];
      let intensity = bassSum / 8;
      let mult = userTier === "premium" ? 1.5 : 1.0;
      let glow = ((intensity / 255) * 35) * mult;
      let opacity = 0.3 + (intensity / 255) * 0.7;
      let scale = 1 + ((intensity / 255) * 0.02) * mult;

      const input = document.getElementById("key-input");
      const badge = document.getElementById("system-badge");
      const panel = document.getElementById("lukyy-auth");

      if (input && document.activeElement !== input && !input.classList.contains("shake-error")) {
        let color = userTier === "premium" ? "255,215,0" : "120,80,255";
        input.style.borderColor = `rgba(${color}, ${opacity})`;
        input.style.boxShadow = `0 0 ${glow}px rgba(${color}, ${(intensity/255)*0.4}), inset 0 2px 10px rgba(0,0,0,0.5)`;
      }
      if (panel) {
        let shadowColor = userTier === "premium" ? "255,215,0,0.2" : "120,80,255,0.2";
        panel.style.boxShadow = `0 40px 100px rgba(0,0,0,0.8), 0 0 ${(intensity/255)*40}px rgba(${shadowColor}), inset 0 1px 1px rgba(255,255,255,0.05)`;
      }
      if (badge) badge.style.transform = `scale(${scale})`;
    }
    requestAnimationFrame(updateReactive);
  }

  // --- PARTICLES (NEW) ---
  function spawnParticles(theme = "default") {
    const old = document.getElementById("lukyy-particles");
    if (old) old.remove();

    const container = document.createElement("div");
    container.id = "lukyy-particles";
    container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483646;overflow:hidden;";

    let chars = ["✦", "◈", "◇", "❖", "✧", "✦", "◈"];
    if (userTier === "premium") chars = ["✦", "◆", "◈", "◉", "✦", "✧", "◆"];
    if (theme === "success") chars = ["✦", "✦", "✦", "✦", "✦"];
    if (theme === "error") chars = ["✖", "✖", "✖", "✖", "✖"];

    const count = window.innerWidth < 600 ? 20 : 35;
    const color = userTier === "premium" ? "rgba(255,215,0,0.5)" : "rgba(120,80,255,0.4)";

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.textContent = chars[Math.floor(Math.random() * chars.length)];
      const size = Math.random() * 14 + 8;
      const dur = Math.random() * 12 + 8;
      const delay = Math.random() * 6;
      const x = Math.random() * 100;
      const drift = (Math.random() - 0.5) * 80;
      el.style.cssText = `position:absolute; font-size:${size}px; left:${x}%; bottom:-10%; user-select:none; pointer-events:none; color:${color}; filter: drop-shadow(0 0 8px ${color}); animation:float-${i} ${dur}s linear infinite; animation-delay:${delay}s; opacity:${Math.random()*0.4+0.3};`;
      const style = document.createElement("style");
      style.textContent = `
        @keyframes float-${i} {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(0.6); opacity: 0; }
          15% { opacity: 0.9; transform: translateY(10px) scale(1); }
          50% { transform: translateY(-45vh) translateX(${drift}px) rotate(180deg) scale(1.2); }
          85% { opacity: 0.7; }
          100% { transform: translateY(-110vh) translateX(${-drift*0.5}px) rotate(360deg) scale(0.8); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      container.appendChild(el);
    }
    document.body.appendChild(container);
  }

  // --- MODAL (NEW) ---
  function showModal(title, msg, icon, onConfirm) {
    const overlay = document.createElement("div");
    overlay.id = "lukyy-modal";
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;padding:20px;box-sizing:border-box;opacity:0;transition:opacity 0.5s;background:rgba(0,0,0,0.8);backdrop-filter:blur(20px);";
    const grad = userTier === "premium" ? "#ffd700,#f7971e" : "#7850ff,#4a2c8a";
    const btnGrad = userTier === "premium" ? "linear-gradient(135deg,#ffd700,#f7971e)" : "linear-gradient(135deg,#7850ff,#4a2c8a)";
    const shadow = userTier === "premium" ? "rgba(255,215,0,0.4)" : "rgba(120,80,255,0.4)";
    const border = userTier === "premium" ? "rgba(255,215,0,0.2)" : "rgba(120,80,255,0.2)";

    overlay.innerHTML = `
      <div style="padding:40px 32px;border:1px solid ${border};border-radius:40px;width:min(420px,90vw);text-align:center;transform:scale(0.9) translateY(30px);transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1);box-sizing:border-box;background:rgba(10,12,28,0.92);backdrop-filter:blur(40px);box-shadow:0 40px 120px rgba(0,0,0,0.9),inset 0 1px 1px rgba(255,255,255,0.05);">
        <div style="font-size:72px;margin-bottom:12px;filter:drop-shadow(0 0 40px ${shadow});">${icon}</div>
        <h4 style="margin:0 0 10px 0;font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:800;background:linear-gradient(135deg,${grad});-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px;">${title}</h4>
        <p style="font-size:15px;line-height:1.9;margin:0 0 28px 0;font-weight:500;color:#a0b4d0;white-space:pre-line;text-align:left;">${msg}</p>
        <button id="modal-ok" style="width:100%;background:${btnGrad};color:#000;border:none;padding:18px;border-radius:20px;font-weight:800;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:15px;text-transform:uppercase;letter-spacing:1.5px;box-shadow:0 10px 40px ${shadow};transition:all 0.3s;">⚡ Gaskeun</button>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = "1";
      const card = overlay.querySelector("div");
      card.style.transform = "scale(1) translateY(0)";
    }, 50);
    document.getElementById("modal-ok").addEventListener("click", () => {
      overlay.style.opacity = "0";
      overlay.querySelector("div").style.transform = "scale(0.95) translateY(-20px)";
      setTimeout(() => { overlay.remove(); if (onConfirm) onConfirm(); }, 400);
    });
  }

  function redirectTo(url) { window.location.href = url; }

  // ============================================================
  // MAIN UI - BRAND NEW
  // ============================================================
  (function init() {
    spawnParticles("default");

    const oldPanel = document.getElementById("lukyy-auth");
    if (oldPanel) oldPanel.remove();

    // --- STYLES ---
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap');
      * { box-sizing: border-box; }
      #lukyy-auth {
        font-family: 'Inter', sans-serif;
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2147483647;
        width: min(440px, 94vw);
        max-height: 95vh;
        overflow-y: auto;
        background: radial-gradient(ellipse at 30% 20%, rgba(40,20,80,0.7), rgba(8,6,18,0.95));
        backdrop-filter: blur(40px);
        -webkit-backdrop-filter: blur(40px);
        border: 1px solid rgba(120,80,255,0.2);
        border-radius: 40px;
        padding: 40px 32px 32px;
        box-shadow: 0 60px 160px rgba(0,0,0,0.95), 0 0 80px rgba(120,80,255,0.05), inset 0 1px 1px rgba(255,255,255,0.04);
        transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
        color: #fff;
        scrollbar-width: thin;
        scrollbar-color: rgba(120,80,255,0.3) transparent;
      }
      #lukyy-auth::-webkit-scrollbar { width: 4px; }
      #lukyy-auth::-webkit-scrollbar-track { background: transparent; }
      #lukyy-auth::-webkit-scrollbar-thumb { background: rgba(120,80,255,0.3); border-radius: 20px; }

      .panel-content { position: relative; z-index: 1; }

      .neo-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: rgba(0,0,0,0.5);
        padding: 8px 20px;
        border-radius: 40px;
        border: 1px solid rgba(120,80,255,0.15);
        backdrop-filter: blur(8px);
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
        margin-bottom: 18px;
        transition: all 0.3s ease;
      }
      .neo-badge-dot {
        width: 10px; height: 10px;
        border-radius: 50%;
        background: #7850ff;
        box-shadow: 0 0 20px #7850ff, 0 0 40px #7850ff;
        animation: neonPulse 2s infinite;
      }
      .neo-badge-text {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2.5px;
        color: #cbd5e1;
        text-transform: uppercase;
        font-family: 'Space Grotesk', sans-serif;
      }

      .neo-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 40px;
        font-weight: 900;
        background: linear-gradient(135deg, #ffffff 0%, #7850ff 50%, #4a2c8a 100%);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -2px;
        margin: 0 0 6px 0;
        filter: drop-shadow(0 0 30px rgba(120,80,255,0.2));
        animation: gradientShift 6s ease infinite;
        text-align: center;
      }
      .neo-quote {
        font-size: 15px;
        font-weight: 500;
        color: #94a3b8;
        margin: 8px 0 4px 0;
        line-height: 1.6;
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        text-align: center;
      }
      .neo-input-wrapper {
        position: relative;
        width: 100%;
        margin-bottom: 22px;
      }
      .neo-input {
        width: 100%;
        padding: 18px 90px 18px 24px;
        background: rgba(0,0,0,0.6);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 20px;
        color: #fff;
        font-family: 'Inter', sans-serif;
        font-size: 15px;
        font-weight: 600;
        outline: none;
        backdrop-filter: blur(12px);
        transition: all 0.3s ease;
        letter-spacing: 0.5px;
        box-sizing: border-box;
        text-align: left;
      }
      .neo-input:focus {
        border-color: #7850ff;
        box-shadow: 0 0 50px rgba(120,80,255,0.25), inset 0 2px 15px rgba(0,0,0,0.6);
        transform: scale(1.01);
        background: rgba(8,6,18,0.9);
      }
      .neo-input::placeholder {
        color: rgba(255,255,255,0.2);
        font-weight: 500;
        letter-spacing: 0.5px;
      }
      .neo-input:disabled {
        background: rgba(255,215,0,0.04) !important;
        color: #ffd700 !important;
        border-color: rgba(255,215,0,0.2) !important;
        cursor: not-allowed;
        font-weight: 700;
        text-align: center;
        -webkit-text-fill-color: #ffd700 !important;
        text-shadow: 0 0 20px rgba(255,215,0,0.1);
      }
      .neo-input-actions {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        gap: 6px;
        z-index: 5;
      }
      .neo-icon-btn {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.04);
        border-radius: 12px;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        cursor: pointer;
        color: #94a3b8;
        transition: all 0.25s ease;
        backdrop-filter: blur(8px);
        padding: 0;
      }
      .neo-icon-btn:hover {
        background: rgba(120,80,255,0.12);
        border-color: #7850ff;
        color: #fff;
        transform: scale(1.1) rotate(-3deg);
        box-shadow: 0 0 25px rgba(120,80,255,0.2);
      }

      .neo-btn-primary {
        width: 100%;
        padding: 20px;
        border: none;
        border-radius: 20px;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 800;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1);
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, #7850ff, #4a2c8a);
        color: #fff;
        box-shadow: 0 15px 45px rgba(120,80,255,0.35);
        text-align: center;
      }
      .neo-btn-primary::after {
        content: '';
        position: absolute;
        top: -50%; left: -50%;
        width: 200%; height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
        opacity: 0;
        transform: scale(0.5);
        transition: opacity 0.4s, transform 0.4s;
      }
      .neo-btn-primary:hover {
        transform: translateY(-4px) scale(1.02);
        filter: brightness(1.15);
        box-shadow: 0 20px 60px rgba(120,80,255,0.5);
      }
      .neo-btn-primary:hover::after { opacity: 1; transform: scale(1); }
      .neo-btn-primary:active { transform: translateY(2px) scale(0.98); filter: brightness(0.9); }
      .neo-btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        filter: none !important;
        box-shadow: 0 5px 20px rgba(120,80,255,0.15);
      }

      .neo-btn-secondary {
        width: 100%;
        padding: 16px;
        border-radius: 18px;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.5px;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.04);
        color: #cbd5e1;
        transition: all 0.3s ease;
        text-align: center;
      }
      .neo-btn-secondary:hover {
        background: rgba(120,80,255,0.08);
        border-color: rgba(120,80,255,0.25);
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(120,80,255,0.08);
      }

      .neo-status {
        margin-top: 28px;
        font-size: 12px;
        font-weight: 700;
        color: #7850ff;
        font-family: 'Space Grotesk', sans-serif;
        text-transform: uppercase;
        letter-spacing: 2.5px;
        opacity: 0.7;
        padding: 10px 16px;
        border-radius: 16px;
        border: 1px dashed rgba(120,80,255,0.08);
        background: rgba(120,80,255,0.02);
        backdrop-filter: blur(5px);
        text-align: center;
      }

      .neo-avatar {
        position: absolute;
        top: -26px;
        left: -26px;
        width: 64px;
        height: 64px;
        border-radius: 24px;
        overflow: hidden;
        border: 2px solid rgba(120,80,255,0.4);
        box-shadow: 0 15px 40px rgba(120,80,255,0.25);
        backdrop-filter: blur(15px);
        transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
        transform: rotate(-6deg) scale(0.95);
        cursor: pointer;
      }
      .neo-avatar:hover {
        transform: scale(1.15) rotate(0deg) translateY(-6px);
        box-shadow: 0 25px 60px rgba(120,80,255,0.45);
        border-color: #7850ff;
      }
      .neo-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; }

      .neo-music-btn {
        position: absolute;
        top: -28px;
        right: -28px;
        background: rgba(8,6,18,0.85);
        border: 1.5px solid rgba(120,80,255,0.25);
        color: #7850ff;
        border-radius: 18px;
        width: 54px;
        height: 54px;
        cursor: pointer;
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(15px);
        transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
        box-shadow: 0 15px 35px rgba(120,80,255,0.15);
        transform: rotate(6deg) scale(0.95);
      }
      .neo-music-btn:hover {
        transform: scale(1.15) rotate(0deg);
        box-shadow: 0 20px 60px rgba(120,80,255,0.3);
        border-color: #7850ff;
        color: #fff;
      }

      .neo-biodata {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        border-radius: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 999;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.92) translateY(15px);
        transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
        padding: 40px 32px;
        box-sizing: border-box;
        background: rgba(8,6,18,0.94);
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
      }
      .neo-biodata.active {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1) translateY(0);
      }
      .neo-biodata-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 26px;
        font-weight: 800;
        background: linear-gradient(135deg, #7850ff, #ff00ea);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 0 22px 0;
        text-align: center;
        letter-spacing: 2px;
        filter: drop-shadow(0 0 30px rgba(255,0,234,0.2));
      }
      .neo-biodata-card {
        text-align: left;
        width: 100%;
        background: rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.04);
        padding: 22px 26px;
        border-radius: 20px;
        font-size: 15px;
        line-height: 2.2;
        color: #cbd5e1;
        box-sizing: border-box;
        box-shadow: inset 0 4px 20px rgba(0,0,0,0.5);
      }
      .neo-biodata-card strong { color: #7850ff; font-weight: 700; }
      .neo-btn-close-bio {
        width: 100%;
        background: rgba(255,0,85,0.08);
        color: #ff0055;
        border: 1px solid rgba(255,0,85,0.15);
        padding: 18px;
        border-radius: 18px;
        font-weight: 800;
        cursor: pointer;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-top: 24px;
        transition: all 0.3s ease;
        text-align: center;
      }
      .neo-btn-close-bio:hover {
        background: rgba(255,0,85,0.15);
        border-color: rgba(255,0,85,0.3);
        transform: scale(1.02);
        box-shadow: 0 10px 30px rgba(255,0,85,0.1);
      }

      .neo-timer {
        font-size: 13px;
        font-weight: 700;
        color: #ffd700;
        margin-top: 10px;
        display: none;
        background: rgba(255,215,0,0.04);
        padding: 8px 16px;
        border-radius: 14px;
        border: 1px solid rgba(255,215,0,0.08);
        backdrop-filter: blur(5px);
        text-align: center;
      }

      .neo-menu-grid {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-top: 6px;
        width: 100%;
      }
      .neo-menu-btn {
        padding: 18px;
        border-radius: 18px;
        border: none;
        font-weight: 800;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 15px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1);
        position: relative;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        color: #fff;
        text-align: center;
        width: 100%;
      }
      .neo-menu-btn::after {
        content: '';
        position: absolute;
        top: -50%; left: -50%;
        width: 200%; height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        opacity: 0;
        transform: scale(0.5);
        transition: opacity 0.4s, transform 0.4s;
      }
      .neo-menu-btn:hover { transform: translateY(-3px) scale(1.02); filter: brightness(1.1); }
      .neo-menu-btn:hover::after { opacity: 1; transform: scale(1); }
      .neo-menu-btn:active { transform: translateY(2px) scale(0.98); }

      .neo-menu-btn.aincrad { background: linear-gradient(135deg, #7850ff, #4a2c8a); color: #fff; }
      .neo-menu-btn.proxy { background: linear-gradient(135deg, #0055ff, #0033aa); color: #fff; }
      .neo-menu-btn.vipteam { background: linear-gradient(135deg, #ff00ea, #8a2be2); color: #fff; }
      .neo-menu-btn.universal { background: linear-gradient(135deg, #00cc88, #008855); color: #fff; }
      .neo-menu-btn.premium-gold { background: linear-gradient(135deg, #ffd700, #f7971e); color: #000; }

      .neo-speed-grid {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-top: 6px;
        width: 100%;
      }
      .neo-speed-btn {
        padding: 18px;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.06);
        font-weight: 700;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 15px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: rgba(255,255,255,0.02);
        color: #cbd5e1;
        text-align: center;
        width: 100%;
      }
      .neo-speed-btn:hover {
        transform: translateY(-3px) scale(1.02);
        background: rgba(255,255,255,0.06);
      }
      .neo-speed-btn.fast { border-color: rgba(0,255,136,0.2); color: #00ff88; }
      .neo-speed-btn.fast:hover { background: rgba(0,255,136,0.06); border-color: rgba(0,255,136,0.4); }
      .neo-speed-btn.secure { border-color: rgba(255,215,0,0.2); color: #ffd700; }
      .neo-speed-btn.secure:hover { background: rgba(255,215,0,0.06); border-color: rgba(255,215,0,0.4); }
      .neo-speed-btn.slow { border-color: rgba(255,0,85,0.2); color: #ff0055; }
      .neo-speed-btn.slow:hover { background: rgba(255,0,85,0.06); border-color: rgba(255,0,85,0.4); }

      .neo-back-btn {
        position: absolute;
        top: 0; left: 0;
        width: 40px; height: 40px;
        border-radius: 14px;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.04);
        color: #94a3b8;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.25s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .neo-back-btn:hover {
        background: rgba(120,80,255,0.1);
        border-color: #7850ff;
        color: #fff;
        transform: scale(1.05);
      }

      .neo-uni-input {
        width: 100%;
        padding: 18px 24px;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.06);
        background: rgba(0,0,0,0.5);
        color: #fff;
        font-family: 'Inter', sans-serif;
        font-size: 15px;
        margin-bottom: 22px;
        box-sizing: border-box;
        outline: none;
        transition: all 0.3s ease;
        text-align: left;
      }
      .neo-uni-input:focus {
        border-color: #00cc88;
        box-shadow: 0 0 40px rgba(0,204,136,0.15);
      }

      .neo-countdown-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: radial-gradient(ellipse at center, rgba(8,6,18,0.95), rgba(0,0,0,0.98));
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', sans-serif;
        backdrop-filter: blur(20px);
      }
      .neo-countdown-card {
        text-align: center;
        background: rgba(10,12,28,0.85);
        backdrop-filter: blur(30px);
        padding: 60px 50px;
        border-radius: 40px;
        border: 1px solid rgba(120,80,255,0.15);
        width: min(400px, 90vw);
        box-shadow: 0 60px 180px rgba(0,0,0,0.95), inset 0 1px 2px rgba(255,255,255,0.03);
        position: relative;
        overflow: hidden;
      }
      .neo-countdown-circle {
        width: 140px; height: 140px;
        border-radius: 50%;
        border: 3px solid #7850ff;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 52px;
        font-weight: 900;
        color: #7850ff;
        margin: 0 auto 28px auto;
        font-family: 'Space Grotesk', sans-serif;
        box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
        transition: all 0.15s ease;
      }
      .neo-countdown-text {
        color: #fff;
        font-size: 18px;
        font-weight: 800;
        margin: 0;
        font-family: 'Space Grotesk', sans-serif;
        text-transform: uppercase;
        letter-spacing: 1.5px;
      }
      .neo-countdown-sub {
        color: #94a3b8;
        font-size: 13px;
        margin-top: 10px;
        font-weight: 500;
      }

      @keyframes neonPulse {
        0%, 100% { box-shadow: 0 0 20px #7850ff, 0 0 40px #7850ff; }
        50% { box-shadow: 0 0 40px #7850ff, 0 0 80px #7850ff; }
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-10px); }
        40%, 80% { transform: translateX(10px); }
      }
      .shake-error { animation: shake 0.5s ease-in-out !important; border-color: #ff0055 !important; box-shadow: 0 0 40px rgba(255,0,85,0.5) !important; }

      @media (max-width: 500px) {
        #lukyy-auth { padding: 30px 20px 24px; border-radius: 32px; }
        .neo-title { font-size: 32px; }
        .neo-avatar { width: 54px; height: 54px; top: -20px; left: -20px; }
        .neo-music-btn { width: 44px; height: 44px; font-size: 18px; top: -22px; right: -22px; }
        .neo-countdown-card { padding: 40px 24px; }
        .neo-countdown-circle { width: 110px; height: 110px; font-size: 40px; }
      }
    `;
    document.head.appendChild(style);

    // --- BUILD PANEL ---
    const quote = CONFIG.quotesList[Math.floor(Math.random() * CONFIG.quotesList.length)];

    const panel = document.createElement("div");
    panel.id = "lukyy-auth";
    panel.innerHTML = `
      <div class="panel-content">
        <div class="neo-avatar" id="profile-trigger" title="Profil Owner">
          <img src="https://raw.githubusercontent.com/Lukigays/ain/main/avatar.jpg" alt="Profile" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=lukyyplr'">
        </div>
        <button id="music-btn" class="neo-music-btn" title="Play / Pause / Skip">🎵</button>

        <div style="text-align:center; margin-bottom:24px;">
          <div class="neo-badge" id="system-badge">
            <span class="neo-badge-dot" id="badge-dot"></span>
            <span class="neo-badge-text" id="badge-text">SYSTEM STANDBY</span>
          </div>
          <h1 class="neo-title">LUKYYPLR</h1>
          <div class="neo-quote" id="quote-display">${quote}</div>
          <div id="premium-timer-info" class="neo-timer"></div>
        </div>

        <div id="auth-form-area">
          <div class="neo-input-wrapper">
            <input type="password" id="key-input" class="neo-input" placeholder="✦ Inject Access Key ✦" autocomplete="off">
            <div class="neo-input-actions">
              <button id="toggle-visibility-btn" class="neo-icon-btn" title="View/Hide Key">👁️</button>
              <button id="auto-paste-btn" class="neo-icon-btn" title="Auto Paste">📋</button>
            </div>
          </div>
          <div id="interactive-area" style="margin-bottom:18px;">
            <button id="login-btn" class="neo-btn-primary">⚡ Unlock Dashboard</button>
          </div>
        </div>

        <button id="support-btn" class="neo-btn-secondary">💬 Join Telegram Circle</button>
        <div id="status-msg" class="neo-status">⚙️ WONG_PUSAT_STANDBY</div>
      </div>

      <div id="biodata-panel" class="neo-biodata">
        <h4 class="neo-biodata-title">✨ OWNER BIODATA ✨</h4>
        <div class="neo-biodata-card">
          <div>📌 <strong>Nama:</strong> Luki / Lukyyplr</div>
          <div>🌐 <strong>Linktree:</strong> https://linktr.ee/lukyycuyy</div>
          <div>💻 <strong>Project:</strong> Bypass Key System</div>
          <div>💬 <strong>Status:</strong> Wong Pusat Standby 🔥</div>
        </div>
        <button id="close-biodata-btn" class="neo-btn-close-bio">✖ Close Profile</button>
      </div>
    `;
    document.body.appendChild(panel);

    // --- ELEMENTS ---
    const musicBtn = document.getElementById("music-btn");
    const keyInput = document.getElementById("key-input");
    const loginBtn = document.getElementById("login-btn");
    const supportBtn = document.getElementById("support-btn");
    const statusMsg = document.getElementById("status-msg");
    const profileTrigger = document.getElementById("profile-trigger");
    const biodataPanel = document.getElementById("biodata-panel");
    const closeBiodataBtn = document.getElementById("close-biodata-btn");
    const autoPasteBtn = document.getElementById("auto-paste-btn");
    const toggleVisibilityBtn = document.getElementById("toggle-visibility-btn");

    // --- EVENTS ---
    profileTrigger.addEventListener("click", () => biodataPanel.classList.add("active"));
    closeBiodataBtn.addEventListener("click", () => biodataPanel.classList.remove("active"));

    musicBtn.addEventListener("click", () => {
      if (userTier === "premium") { playRandomMusic(); return; }
      if (!audioPlayer) { playRandomMusic(); musicBtn.textContent = "🎵"; return; }
      if (audioPlayer.paused) {
        audioPlayer.play().catch(() => {});
        if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
        musicBtn.textContent = "🎵";
      } else {
        audioPlayer.pause();
        musicBtn.textContent = "🔇";
      }
    });

    supportBtn.addEventListener("click", () => window.open(CONFIG.telegramUrl, "_blank"));

    toggleVisibilityBtn.addEventListener("click", () => {
      if (keyInput.type === "password") {
        keyInput.type = "text";
        toggleVisibilityBtn.textContent = "🙈";
        toggleVisibilityBtn.title = "Sembunyikan Key";
        if (userTier === "premium") keyInput.value = "👑 VIP: " + rawPremiumKey;
      } else {
        keyInput.type = "password";
        toggleVisibilityBtn.textContent = "👁️";
        toggleVisibilityBtn.title = "Lihat Key";
        if (userTier === "premium") keyInput.value = rawPremiumKey;
      }
    });

    autoPasteBtn.addEventListener("click", async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          keyInput.value = text.trim();
          statusMsg.innerHTML = "📋 Key di-paste, siap gas!";
          statusMsg.style.color = "#7850ff";
        } else {
          statusMsg.innerHTML = "📭 Clipboard kosong, Cuy";
          statusMsg.style.color = "#ff8c00";
        }
      } catch (err) {
        statusMsg.innerHTML = "🛑 Izin clipboard ditolak browser";
        statusMsg.style.color = "#ff0055";
      }
    });

    // --- LOCK DASHBOARD ---
    function lockDashboard(formattedWIB) {
      const keyInput = document.getElementById("key-input");
      const autoPasteBtn = document.getElementById("auto-paste-btn");
      const toggleVisibilityBtn = document.getElementById("toggle-visibility-btn");
      const interactiveArea = document.getElementById("interactive-area");
      const timerInfo = document.getElementById("premium-timer-info");

      if (keyInput) {
        keyInput.type = "password";
        keyInput.value = rawPremiumKey;
        keyInput.disabled = true;
        if (userTier === "premium") {
          keyInput.style.cssText += "background: rgba(255,215,0,0.04) !important; color: #ffd700 !important; border-color: rgba(255,215,0,0.2) !important;";
        } else {
          keyInput.style.cssText += "background: rgba(120,80,255,0.04) !important; color: #7850ff !important; border-color: rgba(120,80,255,0.2) !important;";
        }
        if (toggleVisibilityBtn) { toggleVisibilityBtn.textContent = "👁️"; toggleVisibilityBtn.title = "Lihat Key"; }
      }
      if (autoPasteBtn) autoPasteBtn.remove();
      if (timerInfo) {
        timerInfo.innerText = `⏳ EXPIRED: ${formattedWIB}`;
        timerInfo.style.display = "block";
        if (userTier !== "premium") {
          timerInfo.style.color = "#7850ff";
          timerInfo.style.background = "rgba(120,80,255,0.04)";
          timerInfo.style.borderColor = "rgba(120,80,255,0.08)";
        }
      }

      if (interactiveArea) {
        const btnClass = userTier === "premium" ? "neo-menu-btn premium-gold" : "neo-menu-btn aincrad";
        interactiveArea.innerHTML = `<button id="open-aincrad-btn" class="${btnClass}" style="width:100%;">🏰 Access Menu Bypass</button>`;
        document.getElementById("open-aincrad-btn").addEventListener("click", () => {
          if (userTier === "premium") showMainMenu();
          else triggerExecution(60, "2");
        });
      }
    }

    // --- MAIN MENU (Command Center) ---
    function showMainMenu() {
      isReactive = false;
      const container = document.querySelector(".panel-content");
      if (!container) return;

      const titleGrad = userTier === "premium"
        ? "linear-gradient(135deg, #ffd700, #f7971e)"
        : "linear-gradient(135deg, #7850ff, #4a2c8a)";

      container.innerHTML = `
        <div style="position:relative; width:100%;">
          <button id="mini-back-btn" class="neo-back-btn" style="position:absolute; top:0; left:0;">❮</button>
          <h3 style="margin:0 0 6px 0; font-family:'Space Grotesk',sans-serif; font-size:28px; font-weight:900; background:${titleGrad}; -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-align:center; filter: drop-shadow(0 0 20px rgba(0,0,0,0.3));">COMMAND CENTER</h3>
          <p style="font-size:14px; margin-bottom:24px; text-align:center; font-weight:500; color:#94a3b8;">Pilih target eksekusi bypass</p>
          <div class="neo-menu-grid">
            <button class="neo-menu-btn aincrad" data-target="2">🏰 Aincrad</button>
            <button class="neo-menu-btn proxy" data-target="1">🌐 Aincrad Proxy</button>
            <button class="neo-menu-btn vipteam" data-target="vp">💎 VIP Team Byps</button>
            <button class="neo-menu-btn universal" data-target="uni_vp">🌍 Universal Vplink</button>
          </div>
        </div>
      `;

      document.getElementById("mini-back-btn").addEventListener("click", () => location.reload());

      container.querySelectorAll(".neo-menu-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const target = btn.dataset.target;
          if (target === "uni_vp") showUniversalPanel();
          else {
            if (userTier === "premium") showSpeedPanel(target);
            else triggerExecution(60, target);
          }
        });
      });
    }

    // --- UNIVERSAL VPLINK PANEL ---
    function showUniversalPanel() {
      const container = document.querySelector(".panel-content");
      if (!container) return;

      container.innerHTML = `
        <div style="position:relative; width:100%;">
          <button id="uni-back-btn" class="neo-back-btn" style="position:absolute; top:0; left:0;">❮</button>
          <h3 style="margin:0 0 6px 0; font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:800; background:linear-gradient(135deg,#00cc88,#008855); -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-align:center;">UNIVERSAL VPLINK</h3>
          <p style="font-size:14px; margin-bottom:22px; text-align:center; font-weight:500; color:#94a3b8;">Paste link vplink.in di bawah</p>
          <input type="text" id="uni-vplink-input" class="neo-uni-input" placeholder="https://vplink.in/xxxxx">
          <button id="uni-submit-btn" class="neo-menu-btn universal" style="width:100%;">🔥 Execute</button>
          <p id="uni-error-msg" style="color:#ff0055; font-size:13px; margin-top:16px; display:none; font-weight:700; text-align:center;"></p>
        </div>
      `;

      document.getElementById("uni-back-btn").addEventListener("click", showMainMenu);

      const input = document.getElementById("uni-vplink-input");
      input.addEventListener("focus", () => {
        input.style.border = "1px solid #00cc88";
        input.style.boxShadow = "0 0 30px rgba(0,204,136,0.15)";
      });
      input.addEventListener("blur", () => {
        input.style.border = "1px solid rgba(255,255,255,0.06)";
        input.style.boxShadow = "none";
      });

      document.getElementById("uni-submit-btn").addEventListener("click", () => {
        const val = input.value.trim();
        const err = document.getElementById("uni-error-msg");
        if (!val.includes("vplink.in")) {
          err.innerText = "Target invalid! Kudu vplink.in cuy.";
          err.style.display = "block";
          input.style.border = "1px solid #ff0055";
          return;
        }
        const vpKey = extractVpKey(val);
        if (!vpKey) {
          err.innerText = "Gagal ekstrak key, cek format link.";
          err.style.display = "block";
          input.style.border = "1px solid #ff0055";
          return;
        }
        if (userTier === "premium") showSpeedPanel("uni_vp", vpKey);
        else triggerExecution(60, "uni_vp", vpKey);
      });
    }

    // --- SPEED PANEL (VIP) ---
    function showSpeedPanel(targetType, customVpKey = null) {
      const container = document.querySelector(".panel-content");
      if (!container) return;

      container.innerHTML = `
        <div style="position:relative; width:100%;">
          <button id="speed-back-btn" class="neo-back-btn" style="position:absolute; top:0; left:0;">❮</button>
          <h3 style="margin:0 0 6px 0; font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:800; background:linear-gradient(135deg,#ffd700,#f7971e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; text-align:center;">VELOCITY SPEED</h3>
          <p style="font-size:14px; margin-bottom:24px; text-align:center; font-weight:500; color:#94a3b8;">Atur kecepatan injeksi</p>
          <div class="neo-speed-grid">
            <button class="neo-speed-btn fast" data-sec="20">💨 FAST (Senggol Dong)</button>
            <button class="neo-speed-btn secure" data-sec="30">🛡️ SECURE (Main Aman)</button>
            <button class="neo-speed-btn slow" data-sec="45">🐌 SLOW (Alon-Alon)</button>
          </div>
        </div>
      `;

      document.getElementById("speed-back-btn").addEventListener("click", showMainMenu);

      container.querySelectorAll(".neo-speed-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const sec = parseInt(btn.dataset.sec, 10);
          triggerExecution(sec, targetType, customVpKey);
        });
      });
    }

    // --- EXECUTION (COUNTDOWN) ---
    async function triggerExecution(seconds, targetType, customVpKey = null) {
      const panel = document.getElementById("lukyy-auth");
      if (panel) panel.remove();

      const overlay = document.createElement("div");
      overlay.className = "neo-countdown-overlay";
      overlay.id = "lukyy-countdown";

      let borderColor = userTier === "premium" ? "#ffd700" : "#7850ff";
      let numColor = userTier === "premium" ? "#ffd700" : "#7850ff";

      overlay.innerHTML = `
        <div class="neo-countdown-card">
          <canvas id="lukyy-lava-canvas" width="400" height="440" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;opacity:0.3;pointer-events:none;"></canvas>
          <div style="position:relative;z-index:2;">
            <div class="neo-countdown-circle" id="countdown-container">
              <span id="countdown-text">${seconds}</span>
            </div>
            <p class="neo-countdown-text" id="lukyy-check-text">Injecting Payload...</p>
            <p class="neo-countdown-sub">Biarin kita memasak di dapur 🍳🔥</p>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();

      const countdownText = document.getElementById("countdown-text");
      const checkText = document.getElementById("lukyy-check-text");
      const countdownContainer = document.getElementById("countdown-container");
      const canvas = document.getElementById("lukyy-lava-canvas");
      const ctx = canvas.getContext("2d");

      let isRunning = true;
      let vpKey = customVpKey;
      let apiType = targetType;

      if (targetType === "vp" || targetType === "pc" || targetType === "uni_vp") apiType = "vp";

      if (targetType === "vp") {
        checkText.innerText = "Scanning vplink.in... 🔍";
        const vpUrl = extractVpLinkUrl();
        if (vpUrl) vpKey = extractVpKey(vpUrl);
      } else if (targetType === "pc") {
        checkText.innerText = "Scanning PowerCheats... 🔍";
        const vpUrl = extractPowerCheatsUrl();
        if (vpUrl) vpKey = extractVpKey(vpUrl);
      } else if (targetType === "uni_vp") {
        checkText.innerText = "Parsing Uni-Vplink... 🔍";
      }

      if ((targetType === "vp" || targetType === "pc" || targetType === "uni_vp") && !vpKey) {
        checkText.innerText = "❌ TARGET NOT FOUND!";
        checkText.style.color = "#ff0055";
        countdownText.innerText = "!";
        countdownText.style.color = "#ff0055";
        countdownContainer.style.borderColor = "#ff0055";
        isRunning = false;
        setTimeout(() => {
          overlay.remove();
          document.body.appendChild(panel);
          showMainMenu();
        }, 3500);
        return;
      }
      if (vpKey) checkText.innerText = `Key Acquired: ${vpKey.substring(0,8)}... 🔥`;

      let finalUrl = CONFIG.fallbackRedirectUrl;
      fetchDestination(apiType, 1, vpKey).then(url => { finalUrl = url; }).catch(() => {});

      let timeLeft = seconds;
      let globs = [];
      let hue = userTier === "premium" ? 45 : 240;
      if (targetType === "vp" || targetType === "pc" || targetType === "uni_vp") hue = 300;

      for (let i = 0; i < 14; i++) {
        globs.push({
          x: Math.random() * canvas.width,
          y: canvas.height + (Math.random() * 120),
          baseY: canvas.height + (Math.random() * 120),
          r: Math.random() * 32 + 14,
          speed: Math.random() * 0.7 + 0.2,
          color: `hsla(${Math.random() * 30 + hue}, 100%, 55%, 0.6)`,
          phase: Math.random() * Math.PI * 2
        });
      }

      function renderLava() {
        if (!isRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let audioIntensity = 0, bassIntensity = 0;
        if (audioAnalyser && audioData) {
          audioAnalyser.getByteFrequencyData(audioData);
          let sum = 0;
          for (let i = 0; i < audioData.length; i++) sum += audioData[i];
          audioIntensity = sum / audioData.length;
          let bSum = 0;
          for (let i = 0; i < 8; i++) bSum += audioData[i];
          bassIntensity = bSum / 8;

          let scaleVal = 1.0 + (bassIntensity / 255) * 0.15;
          let glowVal = 20 + (bassIntensity / 255) * 40;
          let glowC = userTier === "premium" ? "255,215,0" : "120,80,255";
          if (targetType === "vp" || targetType === "pc" || targetType === "uni_vp") glowC = "255,0,234";
          countdownContainer.style.transform = `scale(${scaleVal})`;
          countdownContainer.style.boxShadow = `0 0 ${glowVal}px rgba(${glowC},${0.3 + (bassIntensity/255)*0.5}), inset 0 0 40px rgba(0,0,0,0.8)`;
          countdownContainer.style.borderColor = `rgba(${glowC},${0.5 + (bassIntensity/255)*0.5})`;
        }

        ctx.filter = "blur(22px)";
        for (let g of globs) {
          g.phase += 0.01;
          g.x += Math.sin(g.phase) * 0.6;
          let speed = g.speed + (audioIntensity / 255) * 2.2;
          g.y -= speed;
          let r = g.r + (audioIntensity / 255) * 14;
          if (g.y < -r * 2) { g.y = g.baseY; g.x = Math.random() * canvas.width; }
          ctx.beginPath();
          ctx.arc(g.x, g.y, r, 0, Math.PI * 2);
          ctx.fillStyle = g.color;
          ctx.fill();
        }
        ctx.filter = "none";
        requestAnimationFrame(renderLava);
      }
      requestAnimationFrame(renderLava);

      const timer = setInterval(() => {
        timeLeft--;
        if (countdownText) countdownText.innerText = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timer);
          isRunning = false;
          countdownText.innerText = "✓";
          countdownText.style.color = "#00ff88";
          countdownContainer.style.borderColor = "#00ff88";
          checkText.innerText = "BYPASS SUCCESS 🔥";
          checkText.style.color = "#00ff88";
          setTimeout(() => {
            overlay.remove();
            redirectTo(finalUrl);
          }, 1500);
        }
      }, 1000);
    }

    // --- KEY VERIFICATION ---
    async function verifyKey(rawKey, isAuto = false) {
      const clean = rawKey.trim();
      rawPremiumKey = clean;

      try {
        const resp = await fetch(`${CONFIG.keyUrl}?key=${encodeURIComponent(clean)}`);
        const result = await resp.json();

        if (resp.ok && result.status === "success") {
          userTier = result.type ? result.type.toLowerCase().trim() : "biasa";
          localStorage.setItem("lukyy_saved_key", clean);
          if (keyInput) keyInput.value = clean;

          let formatted = "LIFETIME / PERMANENT";
          if (result.expiry && result.expiry !== "permanent" && !isNaN(result.expiry)) {
            const d = new Date(Number(result.expiry));
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
            formatted = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} | ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
          }

          if (userTier === "premium") {
            document.getElementById("badge-text").innerText = "👑 VIP SYSTEM ACTIVE";
            document.getElementById("badge-dot").style.background = "#ffd700";
            document.getElementById("badge-dot").style.boxShadow = "0 0 30px #ffd700, 0 0 60px #ffd700";
            statusMsg.innerText = "👑 WONG PUSAT PRIVILEGE";
            statusMsg.style.color = "#ffd700";
            statusMsg.style.borderColor = "rgba(255,215,0,0.15)";
            statusMsg.style.background = "rgba(255,215,0,0.03)";
            musicBtn.textContent = "⏭️";

            showModal(
              "👑 SEPUH DETECTED",
              `Welcome back Wong Pusat!\n\nExpired: ${formatted}\n\n🚀 VIP FEATURES:\n• All-Access Menu Bypass\n• Velocity Speed Control\n• Premium Music Controller\n• Cyber-Gold Interface`,
              "👑",
              () => lockDashboard(formatted)
            );
          } else {
            statusMsg.innerText = "✅ STANDARD KEY OK!";
            statusMsg.style.color = "#7850ff";
            spawnParticles("success");
            showModal(
              "⚡ ACCESS GRANTED",
              `Key Biasa Valid.\n\nExpired: ${formatted}\n\n🚀 Default Auto Redirect (60s)`,
              "⚡",
              () => lockDashboard(formatted)
            );
          }
        } else {
          localStorage.removeItem("lukyy_saved_key");
          statusMsg.innerText = `❌ ${result.message || 'Key Invalid / Expired!'}`;
          statusMsg.style.color = "#ff0055";
          statusMsg.style.borderColor = "rgba(255,0,85,0.12)";
          statusMsg.style.background = "rgba(255,0,85,0.03)";
          spawnParticles("error");
          if (keyInput) {
            keyInput.classList.add("shake-error");
            setTimeout(() => keyInput.classList.remove("shake-error"), 500);
          }
        }
      } catch (err) {
        console.error("[✗] API error:", err);
        statusMsg.innerText = "❌ SERVER CONNECTION FAILED!";
        statusMsg.style.color = "#ff0055";
        spawnParticles("error");
        loginBtn.disabled = supportBtn.disabled = true;
      }
    }

    // --- LOGIN ---
    loginBtn.addEventListener("click", async () => {
      const val = keyInput.value.trim();
      if (!val) {
        statusMsg.innerText = "🛑 KEY KOSONG CUY!";
        statusMsg.style.color = "#ff0055";
        spawnParticles("error");
        keyInput.classList.add("shake-error");
        setTimeout(() => keyInput.classList.remove("shake-error"), 500);
        return;
      }
      statusMsg.innerText = "⏳ Validating secure signature...";
      statusMsg.style.color = "#7850ff";
      loginBtn.disabled = supportBtn.disabled = true;

      setTimeout(() => verifyKey(val, false), 1200);
    });

    // --- AUTO LOAD ---
    const saved = localStorage.getItem("lukyy_saved_key");
    if (saved) {
      keyInput.value = saved;
      statusMsg.innerText = "💾 SAVED KEY LOADED. CLICK UNLOCK!";
      statusMsg.style.color = "#ff8c00";
    }

    // --- START MUSIC ---
    playRandomMusic();

  })();
})();