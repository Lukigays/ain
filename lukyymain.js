(async function () {
  "use strict";

  if (typeof window.LUKYY_BOOKMARK_LOAD === "undefined") {
    console.log("%c[!] ACCESS DENIED [!]", "color:#00ffff;font-size:15px;font-weight:bold;background:#0a0a0a;padding:5px;border: 1px solid #00ffff;");
    return;
  }

  // ============================================================
  // CONFIG
  // ============================================================
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

  // ============================================================
  // UTILITY FUNCTIONS (sama)
  // ============================================================
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

  function redirectTo(url) { window.location.href = url; }

  // ============================================================
  // TOTP & API
  // ============================================================
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

  // ============================================================
  // MUSIC & AUDIO VISUALIZER
  // ============================================================
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
        let color = userTier === "premium" ? "255,215,0" : "0,240,255";
        input.style.borderColor = `rgba(${color}, ${opacity})`;
        input.style.boxShadow = `0 0 ${glow}px rgba(${color}, ${(intensity/255)*0.4}), inset 0 2px 10px rgba(0,0,0,0.5)`;
      }
      if (panel) {
        let shadowColor = userTier === "premium" ? "255,215,0,0.2" : "0,240,255,0.2";
        panel.style.boxShadow = `0 40px 100px rgba(0,0,0,0.8), 0 0 ${(intensity/255)*40}px rgba(${shadowColor}), inset 0 1px 1px rgba(255,255,255,0.05)`;
      }
      if (badge) badge.style.transform = `scale(${scale})`;
    }
    requestAnimationFrame(updateReactive);
  }

  // ============================================================
  // CYBER PARTICLES
  // ============================================================
  function initCyberParticles() {
    const old = document.getElementById("cyber-particles");
    if (old) old.remove();

    const canvas = document.createElement("canvas");
    canvas.id = "cyber-particles";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483645;";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let w, h;
    const dots = [];
    const COUNT = 60;
    const DIST = 120;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < COUNT; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < DIST) {
            const alpha = 1 - (dist / DIST);
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.25})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      for (let d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#00f0ff";
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ============================================================
  // HOLOGRAPHIC MODAL
  // ============================================================
  function showHoloModal(title, msg, icon, onConfirm) {
    const overlay = document.createElement("div");
    overlay.id = "holo-modal";
    overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;padding:20px;box-sizing:border-box;opacity:0;transition:opacity 0.6s;background:rgba(0,0,0,0.7);backdrop-filter:blur(12px);";
    overlay.innerHTML = `
      <div style="background:rgba(0,10,20,0.85);border:2px solid rgba(0,240,255,0.4);border-radius:24px;padding:36px 32px;width:min(420px,90vw);text-align:center;box-shadow:0 0 60px rgba(0,240,255,0.15),inset 0 0 60px rgba(0,240,255,0.05);transform:scale(0.9) rotateX(5deg);transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1);">
        <div style="font-size:68px;margin-bottom:10px;filter:drop-shadow(0 0 30px rgba(0,240,255,0.6));">${icon}</div>
        <h2 style="font-size:28px;font-weight:700;color:#fff;text-shadow:0 0 20px rgba(0,240,255,0.3);margin:0 0 8px;letter-spacing:2px;">${title}</h2>
        <p style="font-size:15px;line-height:1.8;color:#b0d0e0;margin:0 0 28px;text-align:left;">${msg}</p>
        <button id="holo-modal-btn" style="background:linear-gradient(135deg,#00f0ff,#ff00ff);border:none;padding:16px 32px;border-radius:40px;font-family:'Orbitron',sans-serif;font-weight:700;font-size:14px;color:#000;cursor:pointer;text-transform:uppercase;letter-spacing:2px;box-shadow:0 0 40px rgba(0,240,255,0.4);transition:all 0.3s;">⚡ Execute</button>
      </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = "1";
      const card = overlay.querySelector("div");
      card.style.transform = "scale(1) rotateX(0)";
    }, 50);
    document.getElementById("holo-modal-btn").addEventListener("click", () => {
      overlay.style.opacity = "0";
      overlay.querySelector("div").style.transform = "scale(0.9) rotateX(-5deg)";
      setTimeout(() => { overlay.remove(); if (onConfirm) onConfirm(); }, 500);
    });
  }

  // ============================================================
  // BUILD MAIN PANEL - perbaikan posisi
  // ============================================================
  function buildMainPanel() {
    const old = document.getElementById("lukyy-auth");
    if (old) old.remove();

    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');
      * { box-sizing: border-box; }
      #lukyy-auth {
        font-family: 'Rajdhani', sans-serif;
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) perspective(800px) rotateX(2deg);
        z-index: 2147483647;
        width: min(460px, 94vw);
        max-height: 92vh;
        overflow-y: auto;
        background: rgba(0, 10, 25, 0.75);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1.5px solid rgba(0, 240, 255, 0.25);
        border-radius: 32px;
        padding: 32px 28px 20px; /* kurangi padding bottom, biar lebih ke atas */
        box-shadow: 0 0 80px rgba(0, 240, 255, 0.08), inset 0 0 80px rgba(0, 240, 255, 0.02);
        color: #e0f0ff;
        scrollbar-width: thin;
        scrollbar-color: rgba(0,240,255,0.3) transparent;
        transition: all 0.4s ease;
      }
      #lukyy-auth::-webkit-scrollbar { width: 4px; }
      #lukyy-auth::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.3); border-radius: 10px; }

      .panel-content { position: relative; z-index: 2; }

      /* AVATAR - kiri atas, lebih ke atas */
      .holo-avatar {
        position: absolute;
        top: -24px;
        left: -24px;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 2px solid rgba(0,240,255,0.6);
        box-shadow: 0 0 40px rgba(0,240,255,0.3), inset 0 0 20px rgba(0,240,255,0.1);
        overflow: hidden;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
        animation: avatarPulse 3s infinite;
        margin: 0;
        padding: 0;
      }
      .holo-avatar:hover {
        transform: scale(1.15) rotate(0deg);
        box-shadow: 0 0 80px rgba(0,240,255,0.5);
        border-color: #ff00ff;
      }
      .holo-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      @keyframes avatarPulse {
        0%, 100% { box-shadow: 0 0 40px rgba(0,240,255,0.3), inset 0 0 20px rgba(0,240,255,0.1); }
        50% { box-shadow: 0 0 80px rgba(255,0,255,0.3), inset 0 0 40px rgba(255,0,255,0.1); }
      }

      .holo-music {
        position: absolute;
        top: -24px;
        right: -14px;
        background: rgba(0,10,25,0.8);
        border: 1px solid rgba(255,0,255,0.3);
        color: #ff00ff;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 30px rgba(255,0,255,0.15);
        transition: all 0.4s;
        z-index: 3;
      }
      .holo-music:hover { transform: scale(1.15) rotate(10deg); border-color: #00f0ff; color: #00f0ff; box-shadow: 0 0 60px rgba(0,240,255,0.3); }

      /* BADGE - di tengah, lebih ke atas */
      .holo-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: rgba(0,0,0,0.4);
        padding: 6px 18px;
        border-radius: 40px;
        border: 1px solid rgba(0,240,255,0.15);
        backdrop-filter: blur(6px);
        margin: 0 auto 12px; /* kurangi margin bottom */
        letter-spacing: 2px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        font-family: 'Orbitron', sans-serif;
      }
      .holo-badge-dot {
        width: 8px; height: 8px;
        background: #00f0ff;
        border-radius: 50%;
        box-shadow: 0 0 20px #00f0ff, 0 0 40px #00f0ff;
        animation: dotPulse 1.5s infinite;
      }
      @keyframes dotPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
      }

      .holo-title {
        font-family: 'Orbitron', sans-serif;
        font-size: 34px;
        font-weight: 900;
        text-align: center;
        background: linear-gradient(135deg, #00f0ff, #ff00ff, #00f0ff);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradShift 4s ease infinite;
        letter-spacing: 4px;
        margin: 0 0 2px;
        text-shadow: 0 0 40px rgba(0,240,255,0.2);
      }
      @keyframes gradShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .holo-quote {
        font-size: 15px;
        font-weight: 500;
        color: #90b8d0;
        text-align: center;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        margin: 4px 0 10px;
        border-top: 1px solid rgba(0,240,255,0.06);
        border-bottom: 1px solid rgba(0,240,255,0.06);
        padding: 8px 0;
        font-style: italic;
      }

      .holo-input-wrap {
        position: relative;
        width: 100%;
        margin: 12px 0 16px;
      }
      .holo-input {
        width: 100%;
        padding: 16px 90px 16px 24px;
        background: rgba(0,0,0,0.5);
        border: 1px solid rgba(0,240,255,0.15);
        border-radius: 40px;
        color: #e0f0ff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 16px;
        font-weight: 600;
        outline: none;
        backdrop-filter: blur(6px);
        transition: all 0.3s;
        letter-spacing: 1px;
      }
      .holo-input:focus {
        border-color: #ff00ff;
        box-shadow: 0 0 60px rgba(255,0,255,0.15), inset 0 0 20px rgba(255,0,255,0.05);
        background: rgba(0,0,0,0.7);
      }
      .holo-input::placeholder { color: rgba(255,255,255,0.2); letter-spacing: 1px; }
      .holo-input:disabled {
        background: rgba(255,215,0,0.04);
        color: #ffd700;
        border-color: #ffd700;
        text-align: center;
        -webkit-text-fill-color: #ffd700;
      }

      .holo-actions {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        gap: 4px;
        z-index: 5;
      }
      .holo-icon-btn {
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(0,240,255,0.08);
        border-radius: 50%;
        width: 34px; height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        color: #70b0d0;
        transition: all 0.25s;
      }
      .holo-icon-btn:hover {
        background: rgba(0,240,255,0.1);
        border-color: #00f0ff;
        color: #fff;
        transform: scale(1.1);
        box-shadow: 0 0 30px rgba(0,240,255,0.15);
      }

      .holo-btn-primary {
        width: 100%;
        padding: 18px;
        border: none;
        border-radius: 40px;
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        font-size: 15px;
        text-transform: uppercase;
        letter-spacing: 2px;
        cursor: pointer;
        background: linear-gradient(135deg, #00f0ff, #ff00ff);
        color: #000;
        box-shadow: 0 0 50px rgba(0,240,255,0.2);
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
      }
      .holo-btn-primary:hover {
        transform: scale(1.02) translateY(-3px);
        box-shadow: 0 0 80px rgba(0,240,255,0.4);
        filter: brightness(1.1);
      }
      .holo-btn-primary:active { transform: scale(0.98); }

      .holo-btn-secondary {
        width: 100%;
        padding: 14px;
        border-radius: 40px;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 1px;
        cursor: pointer;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(0,240,255,0.1);
        color: #90b8d0;
        transition: all 0.3s;
        text-align: center;
      }
      .holo-btn-secondary:hover {
        background: rgba(0,240,255,0.06);
        border-color: #00f0ff;
        color: #fff;
        box-shadow: 0 0 30px rgba(0,240,255,0.05);
      }

      .holo-status {
        margin-top: 18px;
        font-size: 11px;
        font-weight: 600;
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        text-transform: uppercase;
        letter-spacing: 2px;
        padding: 8px 16px;
        border-radius: 40px;
        border: 1px solid rgba(0,240,255,0.06);
        background: rgba(0,0,0,0.2);
        text-align: center;
        opacity: 0.8;
      }

      .holo-timer {
        font-size: 13px;
        font-weight: 700;
        color: #ffdd00;
        margin-top: 8px;
        display: none;
        background: rgba(255,215,0,0.04);
        padding: 6px 14px;
        border-radius: 40px;
        border: 1px solid rgba(255,215,0,0.08);
        text-align: center;
      }

      .holo-menu-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
        width: 100%;
      }
      .holo-menu-btn {
        padding: 16px;
        border-radius: 40px;
        border: none;
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        cursor: pointer;
        transition: all 0.3s;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(0,240,255,0.08);
        color: #b0d0e0;
        text-align: center;
        width: 100%;
        position: relative;
        overflow: hidden;
      }
      .holo-menu-btn::before {
        content: '';
        position: absolute;
        top: -50%; left: -50%;
        width: 200%; height: 200%;
        background: radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.5s;
      }
      .holo-menu-btn:hover { transform: scale(1.02); border-color: #00f0ff; color: #fff; box-shadow: 0 0 40px rgba(0,240,255,0.05); }
      .holo-menu-btn:hover::before { opacity: 1; }
      .holo-menu-btn.aincrad { border-color: rgba(120,80,255,0.3); }
      .holo-menu-btn.aincrad:hover { border-color: #7850ff; box-shadow: 0 0 60px rgba(120,80,255,0.2); }
      .holo-menu-btn.proxy { border-color: rgba(0,85,255,0.3); }
      .holo-menu-btn.proxy:hover { border-color: #0055ff; box-shadow: 0 0 60px rgba(0,85,255,0.2); }
      .holo-menu-btn.vipteam { border-color: rgba(255,0,234,0.3); }
      .holo-menu-btn.vipteam:hover { border-color: #ff00ea; box-shadow: 0 0 60px rgba(255,0,234,0.2); }
      .holo-menu-btn.universal { border-color: rgba(0,204,136,0.3); }
      .holo-menu-btn.universal:hover { border-color: #00cc88; box-shadow: 0 0 60px rgba(0,204,136,0.2); }
      .holo-menu-btn.premium-gold { border-color: #ffd700; color: #ffd700; }
      .holo-menu-btn.premium-gold:hover { border-color: #ffd700; box-shadow: 0 0 80px rgba(255,215,0,0.2); }

      .holo-speed-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 8px;
        width: 100%;
      }
      .holo-speed-btn {
        padding: 16px;
        border-radius: 40px;
        border: 1px solid rgba(255,255,255,0.04);
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        cursor: pointer;
        transition: all 0.3s;
        background: rgba(0,0,0,0.2);
        color: #b0d0e0;
        text-align: center;
        width: 100%;
      }
      .holo-speed-btn:hover { transform: scale(1.02); background: rgba(0,0,0,0.4); }
      .holo-speed-btn.fast { border-color: rgba(0,255,136,0.2); color: #00ff88; }
      .holo-speed-btn.fast:hover { border-color: #00ff88; box-shadow: 0 0 60px rgba(0,255,136,0.1); }
      .holo-speed-btn.secure { border-color: rgba(255,215,0,0.2); color: #ffd700; }
      .holo-speed-btn.secure:hover { border-color: #ffd700; box-shadow: 0 0 60px rgba(255,215,0,0.1); }
      .holo-speed-btn.slow { border-color: rgba(255,0,85,0.2); color: #ff0055; }
      .holo-speed-btn.slow:hover { border-color: #ff0055; box-shadow: 0 0 60px rgba(255,0,85,0.1); }

      .holo-back {
        position: absolute;
        top: 8px; left: 8px;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(0,240,255,0.08);
        border-radius: 50%;
        width: 36px; height: 36px;
        color: #70b0d0;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.25s;
        z-index: 10;
      }
      .holo-back:hover { background: rgba(0,240,255,0.1); border-color: #00f0ff; color: #fff; }

      .holo-uni-input {
        width: 100%;
        padding: 16px 24px;
        border-radius: 40px;
        border: 1px solid rgba(0,240,255,0.1);
        background: rgba(0,0,0,0.4);
        color: #e0f0ff;
        font-family: 'Rajdhani', sans-serif;
        font-size: 15px;
        margin-bottom: 20px;
        outline: none;
        transition: all 0.3s;
      }
      .holo-uni-input:focus { border-color: #00cc88; box-shadow: 0 0 40px rgba(0,204,136,0.1); }

      /* =========================================================
         NEW LOADING OVERLAY - SPINNER HOLOGRAPHIC
         ========================================================= */
      .holo-loader-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(20px);
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Orbitron', sans-serif;
      }
      .holo-loader-card {
        background: rgba(0,10,25,0.8);
        border: 2px solid rgba(0,240,255,0.2);
        border-radius: 40px;
        padding: 50px 40px;
        width: min(420px, 90vw);
        text-align: center;
        box-shadow: 0 0 120px rgba(0,240,255,0.05), inset 0 0 60px rgba(0,240,255,0.02);
        position: relative;
        overflow: hidden;
      }
      .holo-loader-spinner {
        width: 120px;
        height: 120px;
        margin: 0 auto 30px;
        position: relative;
        border-radius: 50%;
        border: 4px solid transparent;
        border-top: 4px solid #00f0ff;
        border-right: 4px solid #ff00ff;
        border-bottom: 4px solid #00f0ff;
        animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        box-shadow: 0 0 60px rgba(0,240,255,0.2);
      }
      .holo-loader-spinner::after {
        content: '';
        position: absolute;
        top: 6px; left: 6px;
        right: 6px; bottom: 6px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-left: 3px solid #ff00ff;
        border-bottom: 3px solid #00f0ff;
        animation: spin 0.8s linear infinite reverse;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .holo-loader-text {
        color: #e0f0ff;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin: 0 0 10px;
        text-shadow: 0 0 20px rgba(0,240,255,0.3);
      }
      .holo-loader-progress {
        width: 100%;
        height: 6px;
        background: rgba(0,240,255,0.1);
        border-radius: 10px;
        overflow: hidden;
        margin: 10px 0 16px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
      }
      .holo-loader-progress-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #00f0ff, #ff00ff);
        border-radius: 10px;
        transition: width 0.3s ease;
        box-shadow: 0 0 30px rgba(0,240,255,0.3);
      }
      .holo-loader-percent {
        font-size: 14px;
        color: #90b8d0;
        letter-spacing: 2px;
        font-weight: 600;
      }
      .holo-loader-sub {
        color: #70b0d0;
        font-size: 13px;
        margin-top: 6px;
        opacity: 0.6;
      }

      .holo-biodata {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        border-radius: 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 999;
        opacity: 0;
        pointer-events: none;
        transform: scale(0.95) translateY(20px);
        transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
        padding: 40px 28px;
        background: rgba(0,8,20,0.92);
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        border-radius: 32px;
      }
      .holo-biodata.active {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1) translateY(0);
      }
      .holo-biodata-title {
        font-family: 'Orbitron', sans-serif;
        font-size: 22px;
        font-weight: 700;
        color: #00f0ff;
        text-shadow: 0 0 30px rgba(0,240,255,0.3);
        margin: 0 0 20px;
        letter-spacing: 2px;
      }
      .holo-biodata-card {
        width: 100%;
        background: rgba(0,0,0,0.4);
        border: 1px solid rgba(0,240,255,0.06);
        padding: 20px 24px;
        border-radius: 20px;
        font-size: 15px;
        line-height: 2.2;
        color: #b0d0e0;
      }
      .holo-biodata-card strong { color: #ff00ff; }
      .holo-bio-close {
        width: 100%;
        background: rgba(255,0,85,0.06);
        color: #ff0055;
        border: 1px solid rgba(255,0,85,0.1);
        padding: 16px;
        border-radius: 40px;
        font-family: 'Orbitron', sans-serif;
        font-weight: 700;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 2px;
        cursor: pointer;
        margin-top: 24px;
        transition: all 0.3s;
      }
      .holo-bio-close:hover { background: rgba(255,0,85,0.12); border-color: rgba(255,0,85,0.3); }

      @media (max-width: 500px) {
        #lukyy-auth { padding: 24px 16px 16px; }
        .holo-title { font-size: 28px; }
        .holo-avatar { width: 54px; height: 54px; top: -20px; left: -20px; }
        .holo-music { width: 40px; height: 40px; font-size: 16px; top: -20px; right: -10px; }
        .holo-loader-spinner { width: 90px; height: 90px; }
        .holo-countdown-card { padding: 30px 20px; }
        .holo-countdown-circle { width: 110px; height: 110px; font-size: 38px; }
      }
    `;
    document.head.appendChild(style);

    // --- HTML ---
    const quote = CONFIG.quotesList[Math.floor(Math.random() * CONFIG.quotesList.length)];
    const panel = document.createElement("div");
    panel.id = "lukyy-auth";
    panel.innerHTML = `
      <div class="panel-content">
        <div class="holo-avatar" id="profile-trigger">
          <img src="https://raw.githubusercontent.com/Lukigays/ain/main/avatar.jpg" alt="Profile" onerror="this.src='https://api.dicebear.com/7.x/bottts/svg?seed=lukyyplr'">
        </div>
        <button class="holo-music" id="music-btn" title="Play/Pause/Skip">🎵</button>

        <div style="text-align:center; margin-top:14px;">
          <div class="holo-badge" id="system-badge">
            <span class="holo-badge-dot" id="badge-dot"></span>
            <span class="holo-badge-text" id="badge-text">SYSTEM STANDBY</span>
          </div>
          <h1 class="holo-title">LUKYYPLR</h1>
          <div class="holo-quote">${quote}</div>
          <div id="premium-timer-info" class="holo-timer"></div>
        </div>

        <div id="auth-form-area">
          <div class="holo-input-wrap">
            <input type="password" id="key-input" class="holo-input" placeholder="✦ INSERT ACCESS KEY ✦" autocomplete="off">
            <div class="holo-actions">
              <button id="toggle-visibility-btn" class="holo-icon-btn" title="View/Hide">👁</button>
              <button id="auto-paste-btn" class="holo-icon-btn" title="Paste">📋</button>
            </div>
          </div>
          <div id="interactive-area" style="margin-bottom:12px;">
            <button id="login-btn" class="holo-btn-primary">⚡ UNLOCK</button>
          </div>
        </div>

        <button id="support-btn" class="holo-btn-secondary">💬 JOIN TELEGRAM</button>
        <div id="status-msg" class="holo-status">⚙️ WONG_PUSAT_STANDBY</div>
      </div>

      <div id="biodata-panel" class="holo-biodata">
        <h4 class="holo-biodata-title">◈ OWNER BIODATA ◈</h4>
        <div class="holo-biodata-card">
          <div>📌 <strong>Nama:</strong> Luki / Lukyyplr</div>
          <div>🌐 <strong>Linktree:</strong> https://linktr.ee/lukyycuyy</div>
          <div>💻 <strong>Project:</strong> Bypass Key System</div>
          <div>💬 <strong>Status:</strong> Wong Pusat Standby 🔥</div>
        </div>
        <button id="close-biodata-btn" class="holo-bio-close">✖ CLOSE</button>
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

    // --- EVENTS (sama) ---
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
          statusMsg.style.color = "#00f0ff";
        } else {
          statusMsg.innerHTML = "📭 Clipboard kosong, Cuy";
          statusMsg.style.color = "#ff8c00";
        }
      } catch (err) {
        statusMsg.innerHTML = "🛑 Izin clipboard ditolak browser";
        statusMsg.style.color = "#ff0055";
      }
    });

    // --- UI FUNCTIONS ---

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
          keyInput.style.cssText += "background: rgba(255,215,0,0.04) !important; color: #ffd700 !important; border-color: #ffd700 !important;";
        } else {
          keyInput.style.cssText += "background: rgba(0,240,255,0.04) !important; color: #00f0ff !important; border-color: #00f0ff !important;";
        }
        if (toggleVisibilityBtn) { toggleVisibilityBtn.textContent = "👁️"; toggleVisibilityBtn.title = "Lihat Key"; }
      }
      if (autoPasteBtn) autoPasteBtn.remove();
      if (timerInfo) {
        timerInfo.innerText = `⏳ EXPIRED: ${formattedWIB}`;
        timerInfo.style.display = "block";
        if (userTier !== "premium") {
          timerInfo.style.color = "#00f0ff";
          timerInfo.style.background = "rgba(0,240,255,0.04)";
          timerInfo.style.borderColor = "rgba(0,240,255,0.08)";
        }
      }

      if (interactiveArea) {
        const btnClass = userTier === "premium" ? "holo-menu-btn premium-gold" : "holo-menu-btn aincrad";
        interactiveArea.innerHTML = `<button id="open-aincrad-btn" class="${btnClass}" style="width:100%;">🏰 Access Menu Bypass</button>`;
        document.getElementById("open-aincrad-btn").addEventListener("click", () => {
          if (userTier === "premium") showMainMenu();
          else triggerExecution(60, "2");
        });
      }
    }

    function showMainMenu() {
      isReactive = false;
      const container = document.querySelector(".panel-content");
      if (!container) return;

      container.innerHTML = `
        <div style="position:relative; width:100%;">
          <button id="mini-back-btn" class="holo-back" style="position:absolute; top:8px; left:8px;">❮</button>
          <h3 style="margin:20px 0 6px; font-family:'Orbitron',sans-serif; font-size:24px; font-weight:700; color:#00f0ff; text-align:center; text-shadow:0 0 30px rgba(0,240,255,0.3); letter-spacing:2px;">COMMAND CENTER</h3>
          <p style="font-size:14px; margin-bottom:20px; text-align:center; font-weight:500; color:#90b8d0;">Pilih target eksekusi</p>
          <div class="holo-menu-grid">
            <button class="holo-menu-btn aincrad" data-target="2">🏰 Aincrad Protocol</button>
            <button class="holo-menu-btn proxy" data-target="1">🌐 Aincrad Proxy</button>
            <button class="holo-menu-btn vipteam" data-target="vp">💎 VIP Team Byps</button>
            <button class="holo-menu-btn universal" data-target="uni_vp">🌍 Universal Vplink</button>
          </div>
        </div>
      `;

      document.getElementById("mini-back-btn").addEventListener("click", () => location.reload());

      container.querySelectorAll(".holo-menu-btn").forEach(btn => {
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

    function showUniversalPanel() {
      const container = document.querySelector(".panel-content");
      if (!container) return;

      container.innerHTML = `
        <div style="position:relative; width:100%;">
          <button id="uni-back-btn" class="holo-back" style="position:absolute; top:8px; left:8px;">❮</button>
          <h3 style="margin:20px 0 6px; font-family:'Orbitron',sans-serif; font-size:22px; font-weight:700; color:#00cc88; text-align:center; text-shadow:0 0 30px rgba(0,204,136,0.3); letter-spacing:2px;">UNIVERSAL VPLINK</h3>
          <p style="font-size:14px; margin-bottom:20px; text-align:center; font-weight:500; color:#90b8d0;">Paste link vplink.in</p>
          <input type="text" id="uni-vplink-input" class="holo-uni-input" placeholder="https://vplink.in/xxxxx">
          <button id="uni-submit-btn" class="holo-menu-btn universal" style="width:100%;">🔥 Execute</button>
          <p id="uni-error-msg" style="color:#ff0055; font-size:13px; margin-top:16px; display:none; font-weight:700; text-align:center;"></p>
        </div>
      `;

      document.getElementById("uni-back-btn").addEventListener("click", showMainMenu);

      const input = document.getElementById("uni-vplink-input");
      input.addEventListener("focus", () => {
        input.style.borderColor = "#00cc88";
        input.style.boxShadow = "0 0 40px rgba(0,204,136,0.15)";
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = "rgba(0,240,255,0.1)";
        input.style.boxShadow = "none";
      });

      document.getElementById("uni-submit-btn").addEventListener("click", () => {
        const val = input.value.trim();
        const err = document.getElementById("uni-error-msg");
        if (!val.includes("vplink.in")) {
          err.innerText = "Target invalid! Kudu vplink.in cuy.";
          err.style.display = "block";
          input.style.borderColor = "#ff0055";
          return;
        }
        const vpKey = extractVpKey(val);
        if (!vpKey) {
          err.innerText = "Gagal ekstrak key, cek format link.";
          err.style.display = "block";
          input.style.borderColor = "#ff0055";
          return;
        }
        if (userTier === "premium") showSpeedPanel("uni_vp", vpKey);
        else triggerExecution(60, "uni_vp", vpKey);
      });
    }

    function showSpeedPanel(targetType, customVpKey = null) {
      const container = document.querySelector(".panel-content");
      if (!container) return;

      container.innerHTML = `
        <div style="position:relative; width:100%;">
          <button id="speed-back-btn" class="holo-back" style="position:absolute; top:8px; left:8px;">❮</button>
          <h3 style="margin:20px 0 6px; font-family:'Orbitron',sans-serif; font-size:22px; font-weight:700; color:#ffd700; text-align:center; text-shadow:0 0 30px rgba(255,215,0,0.3); letter-spacing:2px;">VELOCITY SPEED</h3>
          <p style="font-size:14px; margin-bottom:20px; text-align:center; font-weight:500; color:#90b8d0;">Atur kecepatan injeksi</p>
          <div class="holo-speed-grid">
            <button class="holo-speed-btn fast" data-sec="20">💨 FAST</button>
            <button class="holo-speed-btn secure" data-sec="30">🛡️ SECURE</button>
            <button class="holo-speed-btn slow" data-sec="45">🐌 SLOW</button>
          </div>
        </div>
      `;

      document.getElementById("speed-back-btn").addEventListener("click", showMainMenu);

      container.querySelectorAll(".holo-speed-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const sec = parseInt(btn.dataset.sec, 10);
          triggerExecution(sec, targetType, customVpKey);
        });
      });
    }

    // ============================================================
    // NEW TRIGGER EXECUTION - dengan spinner + progress
    // ============================================================
    async function triggerExecution(seconds, targetType, customVpKey = null) {
      const panel = document.getElementById("lukyy-auth");
      if (panel) panel.remove();

      const overlay = document.createElement("div");
      overlay.className = "holo-loader-overlay";
      overlay.id = "lukyy-countdown";

      overlay.innerHTML = `
        <div class="holo-loader-card">
          <div class="holo-loader-spinner"></div>
          <div class="holo-loader-text" id="loader-status">EXECUTING</div>
          <div class="holo-loader-progress">
            <div class="holo-loader-progress-bar" id="loader-progress-bar"></div>
          </div>
          <div class="holo-loader-percent" id="loader-percent">0%</div>
          <div class="holo-loader-sub" id="loader-sub">Initializing...</div>
        </div>
      `;
      document.body.appendChild(overlay);

      if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();

      const statusEl = document.getElementById("loader-status");
      const progressBar = document.getElementById("loader-progress-bar");
      const percentEl = document.getElementById("loader-percent");
      const subEl = document.getElementById("loader-sub");

      let vpKey = customVpKey;
      let apiType = targetType;

      if (targetType === "vp" || targetType === "pc" || targetType === "uni_vp") apiType = "vp";

      // Ekstraksi vplink
      if (targetType === "vp") {
        statusEl.innerText = "SCANNING";
        subEl.innerText = "Mencari vplink.in...";
        const vpUrl = extractVpLinkUrl();
        if (vpUrl) vpKey = extractVpKey(vpUrl);
      } else if (targetType === "pc") {
        statusEl.innerText = "SCANNING";
        subEl.innerText = "Mencari PowerCheats...";
        const vpUrl = extractPowerCheatsUrl();
        if (vpUrl) vpKey = extractVpKey(vpUrl);
      } else if (targetType === "uni_vp") {
        statusEl.innerText = "PARSING";
        subEl.innerText = "Memproses link...";
      }

      if ((targetType === "vp" || targetType === "pc" || targetType === "uni_vp") && !vpKey) {
        statusEl.innerText = "❌ TARGET NOT FOUND";
        progressBar.style.width = "100%";
        progressBar.style.background = "#ff0055";
        percentEl.innerText = "FAILED";
        subEl.innerText = "Tidak ditemukan vplink.in di halaman ini";
        setTimeout(() => {
          overlay.remove();
          document.body.appendChild(panel);
          showMainMenu();
        }, 3500);
        return;
      }
      if (vpKey) {
        subEl.innerText = `Key: ${vpKey.substring(0,8)}...`;
      }

      let finalUrl = CONFIG.fallbackRedirectUrl;
      fetchDestination(apiType, 1, vpKey).then(url => { finalUrl = url; }).catch(() => {});

      const totalSteps = seconds;
      let currentStep = 0;
      const interval = 1000; // 1 detik per step

      const timer = setInterval(() => {
        currentStep++;
        const progress = Math.min((currentStep / totalSteps) * 100, 100);
        progressBar.style.width = progress + "%";
        percentEl.innerText = Math.round(progress) + "%";

        if (currentStep >= totalSteps) {
          clearInterval(timer);
          progressBar.style.width = "100%";
          percentEl.innerText = "100%";
          statusEl.innerText = "SUCCESS ✓";
          statusEl.style.color = "#00ff88";
          subEl.innerText = "Bypass berhasil, mengarahkan...";
          setTimeout(() => {
            overlay.remove();
            redirectTo(finalUrl);
          }, 1200);
        } else {
          // Update sub text dengan animasi titik
          const dots = ".".repeat((currentStep % 3) + 1);
          subEl.innerText = `Memproses${dots}`;
        }
      }, interval);

      // Update status awal
      statusEl.innerText = "EXECUTING";
      subEl.innerText = "Memulai...";
    }

    // ============================================================
    // VERIFY KEY (sama)
    // ============================================================
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
            document.getElementById("badge-text").innerText = "VIP ACTIVE";
            document.getElementById("badge-dot").style.background = "#ffd700";
            document.getElementById("badge-dot").style.boxShadow = "0 0 30px #ffd700, 0 0 60px #ffd700";
            statusMsg.innerText = "👑 WONG PUSAT PRIVILEGE";
            statusMsg.style.color = "#ffd700";
            statusMsg.style.borderColor = "rgba(255,215,0,0.15)";
            statusMsg.style.background = "rgba(255,215,0,0.03)";
            musicBtn.textContent = "⏭️";

            showHoloModal(
              "👑 SEPUH DETECTED",
              `Welcome back Wong Pusat!\n\nExpired: ${formatted}\n\n🚀 VIP FEATURES:\n• All-Access Menu Bypass\n• Velocity Speed Control\n• Premium Music Controller\n• Cyber-Gold Interface`,
              "👑",
              () => lockDashboard(formatted)
            );
          } else {
            statusMsg.innerText = "✅ STANDARD KEY OK!";
            statusMsg.style.color = "#00f0ff";
            showHoloModal(
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
          if (keyInput) {
            keyInput.classList.add("shake-error");
            setTimeout(() => keyInput.classList.remove("shake-error"), 500);
          }
        }
      } catch (err) {
        console.error("[✗] API error:", err);
        statusMsg.innerText = "❌ SERVER CONNECTION FAILED!";
        statusMsg.style.color = "#ff0055";
        loginBtn.disabled = supportBtn.disabled = true;
      }
    }

    // --- LOGIN ---
    loginBtn.addEventListener("click", async () => {
      const val = keyInput.value.trim();
      if (!val) {
        statusMsg.innerText = "🛑 KEY KOSONG CUY!";
        statusMsg.style.color = "#ff0055";
        keyInput.classList.add("shake-error");
        setTimeout(() => keyInput.classList.remove("shake-error"), 500);
        return;
      }
      statusMsg.innerText = "⏳ Validating secure signature...";
      statusMsg.style.color = "#00f0ff";
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

    // --- START MUSIC & PARTICLES ---
    playRandomMusic();
    initCyberParticles();
  }

  // ============================================================
  // RUN
  // ============================================================
  buildMainPanel();

})();