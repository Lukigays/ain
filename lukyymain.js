// ╔══════════════════════════════════════════════════════════╗
// ║  AUTHOR: Abdullah Al Mamun                             ║
// ║  GITHUB: @LUKYYPLR                                       ║
// ║  NEBULA /b6 — VELVET ROSE                     ║
// ║  CREDITS: Abdullah Al Mamun (@LUKYYPLR)                  ║
// ║  PORTFOLIO: lukyyplr.paged.dev                           ║
// ╚══════════════════════════════════════════════════════════╝

(function () {
  "use strict";

  const __NEBULA_SECURE_TOKEN__ = "ABDULLAH-OPWWIZNVMOIQUOMZSVPNGMPKXYVQUKOC";


  // ═══════════════════ APP INFO ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  const APP_NAME = "LUKYYPLR";
  const APP_VERSION = "27.0";
  const APP_FULL_NAME = APP_NAME + " v" + APP_VERSION;

  // ═══════════════════ DEBUG LOGGER ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  const DBG = {
    _logs: [],
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    log: function(tag, msg, data) {
      const entry = {
        time: new Date().toISOString().split('T')[1].split('.')[0],
        tag: tag,
        msg: msg,
        data: data || null
      };
      this._logs.push(entry);
      if (this._logs.length > 500) this._logs.shift();
      console.log(`[${entry.time}] [${tag}] ${msg}`, data || '');
    },
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    error: function(tag, msg, data) {
      const entry = {
        time: new Date().toISOString().split('T')[1].split('.')[0],
        tag: tag,
        msg: msg,
        data: data || null,
        error: true
      };
      this._logs.push(entry);
      if (this._logs.length > 500) this._logs.shift();
      console.error(`[${entry.time}] [${tag}] ${msg}`, data || '');
    },
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    getLogs: function(count) {
      return this._logs.slice(-(count || 50));
    },
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    dump: function() {
      console.table(this._logs);
    }
  };

  // ═══════════════════ TARGET DETECTION ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  const DIRECT_TARGETS = {
    'aincrad': { target: 'aincrad', name: 'Aincrad', apiType: '2', moduleType: 'standard' },
    'aincrad-proxy': { target: 'aincrad-proxy', name: 'AINCRAD PROXY', apiType: '1', moduleType: 'standard' },
    'vipteam': { target: 'vipteam', name: 'VIPTEAM', apiType: 'vp', moduleType: 'vipteam' },
    'powercheats': { target: 'powercheats', name: 'POWERCHEATS', apiType: 'vp', moduleType: 'powercheats' },
    'universal-vplink': { target: 'universal-vplink', name: 'UNIVERSAL VPLINK.IN', apiType: 'vp', moduleType: 'universal-vplink' }
  };

  let USER_ID = 0;
  let directTarget = null;

  // Accept window.LUKYYPLR (preferred) or legacy window.ABDULLAH_BOOKMARK_LOAD
  const __BOOKMARK_RAW__ = (typeof window.LUKYYPLR !== "undefined")
    ? window.LUKYYPLR
    : (typeof window.ABDULLAH_BOOKMARK_LOAD !== "undefined" ? window.ABDULLAH_BOOKMARK_LOAD : undefined);

  if (typeof __BOOKMARK_RAW__ !== "undefined") {
    const raw = __BOOKMARK_RAW__;
    
    // Check if it's a target name string
    if (typeof raw === 'string') {
      const targetKey = raw.trim().toLowerCase();
      if (DIRECT_TARGETS[targetKey]) {
        // It's a target name -> directTarget mode, USER_ID remains 0
        directTarget = DIRECT_TARGETS[targetKey];
        USER_ID = 0;
        DBG.log('INIT', 'Direct target detected: ' + targetKey + ', USER_ID=0 (default)');
      } else {
        // Try parsing as number (for formats like "0/7/42")
        const parts = raw.split('/');
        const lastPart = parts[parts.length - 1];
        const parsed = parseInt(lastPart);
        if (!isNaN(parsed)) {
          USER_ID = parsed;
          DBG.log('INIT', 'USER_ID parsed from string: ' + USER_ID);
        } else {
          USER_ID = 0;
          DBG.log('INIT', 'Unrecognized string, USER_ID=0');
        }
      }
    } else if (typeof raw === 'number') {
      USER_ID = raw;
      DBG.log('INIT', 'USER_ID set from number: ' + USER_ID);
    } else {
      USER_ID = 0;
      DBG.log('INIT', 'Unknown type, USER_ID=0');
    }
  }
  DBG.log('INIT', 'Final USER_ID=' + USER_ID + ', directTarget=' + (directTarget ? directTarget.name : 'none'));

  // ═══════════════════ CONFIGURATION (beta /b — no secrets, no /conf) ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr)
  // __NEBULA_SECURE_TOKEN__ is injected by server on each GET /b
  let CONFIG = {
    status: 1,
    musicListUrl: "https://raw.githubusercontent.com/Lukigays/music-ain/main/audio%20(1).mp3",
    apiBaseUrl: "https://nebula-bot-g8ey.onrender.com",
    keyUrl: "https://database-nine-flax.vercel.app/getkeys",
    userDataApiUrl: "https://nebula-bot-g8ey.onrender.com",
    fallbackRedirectUrl: "",
    initProgressTime: 8000,
    autoInitDelay: 10000,
    exploitProgressTime: 0,
    minProgressTime: 0,
    selectedTimeMode: null,
    selectedTimeMs: 0,
    targets: {
      "aincrad": {
        "id": "aincrad",
        "name": "AINCRAD",
        "apiType": "2",
        "moduleType": "standard",
        "timeModes": {
          "fast": 20000,
          "smart": 50000,
          "safe": 80000
        },
        "defaultMode": "smart"
      },
      "aincrad-proxy": {
        "id": "aincrad-proxy",
        "name": "AINCRAD PROXY",
        "apiType": "1",
        "moduleType": "standard",
        "redirectTime": 0
      },
      "vipteam": {
        "id": "vipteam",
        "name": "VIPTEAM",
        "apiType": "vp",
        "moduleType": "vipteam",
        "redirectTime": 0
      },
      "powercheats": {
        "id": "powercheats",
        "name": "POWERCHEATS",
        "apiType": "vp",
        "moduleType": "powercheats",
        "redirectTime": 0
      },
      "universal-vplink": {
        "id": "universal-vplink",
        "name": "UNIVERSAL VPLINK.IN",
        "apiType": "vp",
        "moduleType": "universal-vplink",
        "redirectTime": 0
      }
    },
    ui: {"glass": true, "rain": true, "rainDensity": 28}
  };


  // ═══════════════════ USER DATA ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  const DEFAULT_USER_DATA = {
    id: 1,
    name: "LUKYYPLR",
    password: "0",
    tgChannel: "t.me/lukyyplr",
    banned: 0,
    creator: "@lukyyplr",
    chatId: "",
    createdAt: "2026-09-15"
  };
  let USER_DATA = { ...DEFAULT_USER_DATA };
  let ACCESS_KEY_DATA = null;

  let audioPlayer = null, musicList = [], currentTrackIndex = -1;
  let lastX = null, lastY = null, lastZ = null, shakeTimeout = null;
  let updateTrackDisplay = function () { };
  let autoInitTimeout = null, banRedirectTimeout = null, isRedirecting = false;
  let initProgressActive = false, exploitProgressActive = false;
  let initProgressRAF = null, exploitProgressRAF = null;
  let logTimers = [], redirectUrlCache = null, isBanned = false;
  let selectedTarget = null, selectedTargetName = null, selectedModuleType = null;
  let targetSelectionActive = false;
  let authVerified = false;
  let apiResponseCache = null;
  let currentPinCache = '------';
  let currentRedirectUrl = null;
  let isRealRedirectUrl = false;
  let fetchStartTime = null;
  let fetchEndTime = null;
  let actualProgressTime = null;
  let logQueue = [];
  let logInterval = null;
  let isLoggingActive = false;
  let fetchCompleted = false;
  let fetchResult = null;
  let progressCompleted = false;
  let fillerLogTimer = null;
  let fillerLogsScheduled = false;
  let musicAutoPlay = true;      // Auto-play on WiFi
  let musicUserEnabled = false;  // User manually enabled music on metered

  // TOTP API credential from Nebula: 6 digits, 30-second window.
  // API credit: @LUKYYPLR
  const NEBULA_TOTP_SECRET = "MG3FNS6P4TPBOPZH";

  function base32ToBytes(value) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const clean = String(value).toUpperCase().replace(/=+$/, '');
    let bits = '';
    for (const ch of clean) {
      const n = alphabet.indexOf(ch);
      if (n < 0) throw new Error('Invalid TOTP secret');
      bits += n.toString(2).padStart(5, '0');
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
  }

  const totpGenerator = {
    secret: NEBULA_TOTP_SECRET,
    async generate(offset = 0) {
      const key = await crypto.subtle.importKey(
        'raw',
        base32ToBytes(this.secret),
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
      );
      const counter = Math.floor(Date.now() / 1000 / 30) + Number(offset || 0);
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setUint32(4, counter, false);
      const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, buffer));
      const index = digest[digest.length - 1] & 15;
      const binary = ((digest[index] & 127) << 24) |
        ((digest[index + 1] & 255) << 16) |
        ((digest[index + 2] & 255) << 8) |
        (digest[index + 3] & 255);
      return String(binary % 1000000).padStart(6, '0');
    }
  };

  // ═══════════════════ STYLES ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function injectStyles() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (document.getElementById('nb-dynamic-styles-b6')) return;
    const st = document.createElement("style");
    st.id = 'nb-dynamic-styles-b6';
    st.textContent = `
      @keyframes nb-fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes nb-slideUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
      @keyframes nb-toast-in{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      @keyframes nb-pulse{0%,100%{opacity:0.4}50%{opacity:1}}
      @keyframes nb-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}

      :root{
        --bg:#07070d; --panel:#10101b; --rose:#b8ff00; --gold:#7c5cff;
        --text-color:#f7f7ff; --text-muted:rgba(235,235,255,0.62);
        --danger-color:#ff3b81; --success-color:#b8ff00; --warning-color:#ffd166; --info-color:#00f5ff;
        --font-ui: Inter, ui-sans-serif, system-ui, sans-serif;
        --font-ui-sans: Inter, ui-sans-serif, system-ui, sans-serif;
      }
      .nb-overlay{
        position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:18px;
        background:
          radial-gradient(ellipse at 25% 20%, rgba(232,121,169,0.14), transparent 45%),
          radial-gradient(ellipse at 80% 70%, rgba(232,196,124,0.08), transparent 40%),
          var(--bg);
        animation:nb-fadeIn .3s ease;font-family:var(--font-ui-sans);overflow:hidden;
      }
      .nb-overlay::before,.nb-overlay::after{content:none!important;display:none!important}
      .nb-electric-wrapper{
        position:relative;z-index:1;width:420px;max-width:calc(100vw - 36px);
        border-radius:20px;background:var(--panel);
        border:1px solid rgba(232,121,169,0.3);
        box-shadow:0 24px 48px rgba(0,0,0,0.5), 0 0 48px rgba(232,121,169,0.08);
        overflow:hidden;
      }
      .nb-electric-wrapper::before{
        content:'';position:absolute;inset:0;border-radius:20px;pointer-events:none;z-index:3;
        background:linear-gradient(145deg, rgba(232,121,169,0.08), transparent 40%, rgba(232,196,124,0.06));
      }
      .nb-electric-wrapper::after,.nb-glow-layer{content:none!important;display:none!important}
      .nb-container{position:relative;z-index:2;padding:26px 22px;text-align:center;width:100%;box-sizing:border-box;max-height:calc(100vh - 42px);overflow-y:auto}
      .nb-container::before,.nb-container::after{content:none!important;display:none!important}
      .nb-title{color:var(--text-color);margin:0 0 6px;font-weight:600;font-size:22px;letter-spacing:0.3px;font-family:var(--font-ui)}
      .nb-subtitle{color:var(--text-muted);font-size:12px;margin:0 0 16px;font-family:var(--font-ui-sans)}
      .nb-uid{display:none!important}
      .nb-divider{height:1px;background:linear-gradient(90deg, transparent, rgba(232,121,169,0.4), rgba(232,196,124,0.3), transparent);margin:14px 0;border:none}
      .nb-track{color:var(--text-muted);font-size:11px;margin:6px 0 12px;min-height:14px;font-family:var(--font-ui-sans)}
      .nb-track.metered{color:var(--danger-color)}
      .nb-footer{color:var(--text-muted);font-size:10px;margin-top:16px;font-family:var(--font-ui-sans)}
      .nb-footer a{color:var(--gold);text-decoration:none}
      .nb-emboss-btn{
        width:100%;padding:13px;margin-bottom:10px;border-radius:14px;cursor:pointer;font-family:var(--font-ui-sans);
        font-weight:600;font-size:13px;color:var(--text-color)!important;
        background:rgba(232,121,169,0.08)!important;border:1px solid rgba(232,121,169,0.3)!important;box-shadow:none!important;
        transition:border-color .15s, box-shadow .15s, transform .12s;
      }
      .nb-emboss-btn:hover{border-color:rgba(184,255,0,0.85)!important;box-shadow:0 8px 28px rgba(0,245,255,0.18)!important;transform:translateY(-1px)}
      .nb-emboss-btn:active{transform:scale(.99)}
      .nb-emboss-btn:disabled{opacity:.4;cursor:not-allowed}
      .nb-emboss-input{
        width:100%;padding:13px;box-sizing:border-box;border-radius:14px;text-align:center;font-size:14px;font-weight:600;
        color:var(--text-color)!important;background:rgba(0,0,0,0.3)!important;border:1px solid rgba(232,121,169,0.25)!important;
        outline:none;font-family:var(--font-ui-sans);
      }
      .nb-emboss-input:focus{border-color:rgba(232,121,169,0.6)!important;box-shadow:0 0 0 3px rgba(232,121,169,0.12)}
      .nb-emboss-input.error{border-color:var(--danger-color)!important;animation:nb-shake .35s ease}
      .nb-emboss-input.success{border-color:var(--success-color)!important}
      .nb-error-text{color:var(--danger-color);font-size:11px;font-weight:600;margin:6px 0 10px;display:none;font-family:var(--font-ui-sans)}
      .nb-music-btn,.nb-back-btn{
        position:absolute;top:12px;z-index:3;width:34px;height:34px;border-radius:50%;cursor:pointer;
        display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--rose);
        background:rgba(0,0,0,0.3);border:1px solid rgba(232,121,169,0.3);
      }
      .nb-music-btn{right:12px}.nb-back-btn{left:12px}
      .nb-music-btn.metered{color:var(--danger-color)}
      .nb-target-list{display:flex;flex-direction:column;gap:8px;margin:14px 0 4px}
      .nb-mode-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:14px 0 16px}
      .nb-mode-btn{
        border:1px solid rgba(232,121,169,0.25);background:rgba(0,0,0,0.22);color:var(--text-color);
        border-radius:14px;padding:12px 6px;font-size:11px;font-weight:600;cursor:pointer;font-family:var(--font-ui-sans);
      }
      .nb-mode-btn span{display:block;margin-top:4px;font-size:9px;color:var(--text-muted)}
      .nb-mode-active{border-color:rgba(232,196,124,0.55);background:rgba(232,121,169,0.12);box-shadow:0 0 16px rgba(232,121,169,0.1)}
      .nb-log-area{
        background:rgba(0,0,0,0.35)!important;border:1px solid rgba(232,121,169,0.2)!important;border-radius:14px;
        text-align:left;padding:10px 12px;max-height:180px;overflow-y:auto;margin:10px 0;font-size:11px;font-family:var(--font-ui-sans);
      }
      .nb-log-entry{display:flex;align-items:flex-start;gap:6px;padding:3px 0;margin:0;line-height:1.4}
      .nb-log-icon{flex-shrink:0}.nb-log-text{flex:1;font-size:11px;font-weight:500;word-break:break-word;color:#fbcfe8}
      .nb-progress-bar-bg{height:5px;border-radius:99px;margin-top:6px;background:rgba(232,121,169,0.12);overflow:hidden}
      .nb-progress-bar-fill{height:100%;width:0%;border-radius:99px;background:linear-gradient(90deg,var(--rose),var(--gold));transition:width .2s linear}
      .nb-progress-bar-fill.error-fill{background:var(--danger-color)}
      .nb-progress-label{display:flex;justify-content:space-between;color:var(--text-muted);font-size:11px;margin-top:10px;font-family:var(--font-ui-sans)}
      .nb-exploit-header{display:flex;align-items:center;gap:6px;margin-bottom:10px;flex-wrap:wrap}
      .nb-exploit-title{color:var(--rose);font-size:12px;font-weight:600;font-family:var(--font-ui-sans)}
      .nb-live-dot{width:7px;height:7px;border-radius:50%;background:var(--rose);box-shadow:0 0 10px rgba(232,121,169,0.6);flex-shrink:0;animation:nb-pulse 1.3s ease infinite}
      .nb-status-icon,.nb-suspended-icon{font-size:32px;margin-bottom:8px}
      .nb-status-user{color:var(--text-muted);font-size:12px;font-family:var(--font-ui-sans)}
      .nb-toast{
        position:fixed;left:50%;bottom:28px;transform:translateX(-50%);
        background:rgba(26,16,24,0.96);color:var(--text-color);padding:11px 16px;border-radius:14px;
        border:1px solid rgba(232,121,169,0.35);z-index:2147483647;animation:nb-toast-in .25s ease;font-size:12px;font-family:var(--font-ui-sans);
      }
`;

    // Gen-Z loading visual: animated aurora, glass card, neon progress shimmer.
    st.textContent += `
      .nb-overlay{
        background:
          radial-gradient(circle at 18% 15%, rgba(0,245,255,.16), transparent 28%),
          radial-gradient(circle at 86% 22%, rgba(184,255,0,.12), transparent 25%),
          radial-gradient(circle at 55% 92%, rgba(124,92,255,.18), transparent 32%),
          #07070d;
      }
      .nb-overlay::before{
        content:"";position:absolute;inset:-30%;pointer-events:none;opacity:.32;
        background:conic-gradient(from 180deg,transparent,#00f5ff22,transparent,#b8ff001c,transparent,#7c5cff22,transparent);
        filter:blur(35px);animation:nb-aurora 9s linear infinite;
      }
      @keyframes nb-aurora{to{transform:rotate(360deg) scale(1.08)}}
      .nb-electric-wrapper{
        border:1px solid rgba(0,245,255,.48)!important;
        border-radius:28px!important;
        background:linear-gradient(145deg,rgba(18,20,38,.88),rgba(9,10,20,.82))!important;
        box-shadow:0 0 0 1px rgba(124,92,255,.16),0 20px 70px rgba(0,0,0,.52),0 0 44px rgba(0,245,255,.12)!important;
        backdrop-filter:blur(24px) saturate(1.35)!important;
      }
      .nb-container{border-radius:26px!important;padding:26px 22px!important}
      .nb-exploit-header{padding:4px 2px 14px;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:14px}
      .nb-exploit-title{color:#f7f7ff!important;font-size:13px!important;letter-spacing:1.5px!important;font-family:ui-monospace,SFMono-Regular,monospace!important}
      .nb-live-dot{background:#b8ff00!important;box-shadow:0 0 14px #b8ff00!important}
      .nb-log-area{border:1px solid rgba(0,245,255,.16)!important;background:rgba(2,3,12,.62)!important;border-radius:18px!important;padding:13px!important;box-shadow:inset 0 0 30px rgba(0,245,255,.025)}
      .nb-progress-label{margin:16px 2px 9px!important;color:#aeb3d0!important;font-size:11px!important;letter-spacing:2px!important;font-weight:800}
      .nb-progress-bar-bg{height:11px!important;border:1px solid rgba(0,245,255,.3)!important;border-radius:99px!important;background:rgba(255,255,255,.06)!important;padding:2px;box-shadow:0 0 20px rgba(0,245,255,.08)}
      .nb-progress-bar-fill{height:100%;border-radius:99px!important;background:linear-gradient(90deg,#00f5ff,#7c5cff 48%,#b8ff00)!important;box-shadow:0 0 14px rgba(0,245,255,.75)!important;position:relative;overflow:hidden}
      .nb-progress-bar-fill::after{content:"";position:absolute;inset:0;width:38%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.8),transparent);animation:nb-shimmer 1.15s linear infinite}
      @keyframes nb-shimmer{from{transform:translateX(-140%)}to{transform:translateX(320%)}}
      .nb-loading-dots{color:#00f5ff;letter-spacing:2px;animation:nb-blink 1s steps(2,end) infinite}
      @keyframes nb-blink{50%{opacity:.2}}
      .nb-footer{color:rgba(235,235,255,.58)!important;line-height:1.8!important}
    `;

    // Complete Gen-Z UI skin: streetwear / social-app inspired neon glass.
    st.textContent += `
      :root{
        --bg:#08080b;--panel:#111118;--rose:#ff3cac;--gold:#d6ff00;
        --text-color:#fffaff;--text-muted:rgba(255,250,255,.62);
        --danger-color:#ff3864;--success-color:#d6ff00;--warning-color:#ffb000;--info-color:#49f8ff;
      }
      .nb-overlay{
        background:#08080b!important;
        background-image:radial-gradient(circle at 15% 12%,rgba(255,60,172,.24),transparent 28%),radial-gradient(circle at 92% 22%,rgba(73,248,255,.16),transparent 25%),radial-gradient(circle at 55% 100%,rgba(214,255,0,.10),transparent 28%)!important;
        font-family:Inter,ui-sans-serif,system-ui,sans-serif!important;
      }
      .nb-overlay::after{content:"✦  LUKYYPLR  ✦"!important;display:block!important;position:absolute;top:28px;left:0;width:100%;text-align:center;color:rgba(255,255,255,.15);font-size:10px;font-weight:900;letter-spacing:5px;pointer-events:none;z-index:0}
      .nb-electric-wrapper{
        width:440px!important;max-width:calc(100vw - 28px)!important;
        border:0!important;border-radius:30px!important;padding:1px!important;
        background:linear-gradient(135deg,#ff3cac,#794cff 42%,#49f8ff 72%,#d6ff00)!important;
        box-shadow:0 24px 90px rgba(0,0,0,.7),0 0 42px rgba(255,60,172,.16)!important;
        overflow:hidden!important;
      }
      .nb-electric-wrapper::before{content:""!important;display:block!important;position:absolute!important;inset:0!important;background:linear-gradient(120deg,transparent 20%,rgba(255,255,255,.18),transparent 42%);transform:translateX(-120%);animation:plr-card-sheen 5s ease-in-out infinite;pointer-events:none;z-index:1}
      @keyframes plr-card-sheen{55%,100%{transform:translateX(120%)}}
      .nb-container{
        background:linear-gradient(145deg,rgba(18,18,27,.97),rgba(10,10,16,.97))!important;
        border-radius:29px!important;padding:25px 20px 20px!important;position:relative!important;z-index:2!important;
        max-height:calc(100vh - 34px)!important;
      }
      .nb-title{font-family:Inter,ui-sans-serif,sans-serif!important;font-weight:950!important;font-size:24px!important;letter-spacing:-.7px!important;text-transform:uppercase!important;color:#fff!important}
      .nb-subtitle{font-size:11px!important;letter-spacing:2px!important;text-transform:uppercase!important;color:#49f8ff!important}
      .nb-divider{height:2px!important;background:linear-gradient(90deg,transparent,#ff3cac,#49f8ff,transparent)!important;opacity:.7}
      .nb-uid{color:#d6ff00!important;font-weight:800!important;letter-spacing:2px!important}
      .nb-emboss-btn{border:1px solid rgba(255,255,255,.18)!important;border-radius:16px!important;background:rgba(255,255,255,.06)!important;color:#fff!important;box-shadow:0 8px 22px rgba(0,0,0,.25)!important;text-transform:uppercase!important;font-weight:900!important;letter-spacing:1.5px!important;transition:all .2s ease!important}
      .nb-emboss-btn:hover{transform:translateY(-3px) rotate(-.4deg)!important;border-color:#49f8ff!important;background:linear-gradient(135deg,rgba(255,60,172,.18),rgba(73,248,255,.12))!important;box-shadow:0 12px 30px rgba(73,248,255,.18)!important}
      .nb-emboss-btn:active{transform:scale(.97)!important}
      .nb-emboss-input{border:1px solid rgba(255,255,255,.22)!important;border-radius:16px!important;background:rgba(0,0,0,.28)!important;color:#fff!important;box-shadow:inset 0 0 0 1px rgba(255,60,172,.08)!important}
      .nb-emboss-input:focus{border-color:#ff3cac!important;box-shadow:0 0 0 4px rgba(255,60,172,.12),0 0 24px rgba(255,60,172,.18)!important}
      .nb-music-btn,.nb-back-btn{border:1px solid rgba(255,255,255,.2)!important;background:rgba(255,255,255,.07)!important;box-shadow:0 8px 20px rgba(0,0,0,.3)!important}
      .nb-exploit-header{padding:5px 3px 15px!important;margin-bottom:14px!important;border-bottom:1px solid rgba(255,255,255,.10)!important}
      .nb-exploit-title{font-size:12px!important;letter-spacing:1px!important;color:#fff!important;font-weight:900!important}
      .nb-live-dot{background:#d6ff00!important;box-shadow:0 0 13px #d6ff00!important}
      .nb-log-area{height:230px!important;max-height:230px!important;background:#09090f!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:20px!important;padding:14px!important;box-shadow:inset 0 0 35px rgba(255,60,172,.04)!important}
      .nb-log-entry{padding:5px 0!important;line-height:1.35!important}
      .nb-log-text{font-size:11px!important;font-weight:750!important;letter-spacing:.1px!important}
      .nb-progress-label{margin:16px 2px 8px!important;font-size:10px!important;letter-spacing:2px!important;font-weight:950!important;color:rgba(255,255,255,.7)!important}
      .nb-progress-bar-bg{height:13px!important;border:0!important;border-radius:999px!important;background:rgba(255,255,255,.09)!important;padding:3px!important;box-shadow:inset 0 2px 5px rgba(0,0,0,.4)!important}
      .nb-progress-bar-fill{height:100%!important;border-radius:999px!important;background:linear-gradient(90deg,#ff3cac,#794cff,#49f8ff,#d6ff00)!important;box-shadow:0 0 18px rgba(255,60,172,.55)!important;position:relative!important;overflow:hidden!important}
      .nb-progress-bar-fill::after{content:"";position:absolute;inset:0;width:35%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);animation:plr-progress 1s linear infinite}
      @keyframes plr-progress{from{transform:translateX(-180%)}to{transform:translateX(360%)}}
      .nb-footer{font-size:10px!important;color:rgba(255,255,255,.55)!important;line-height:1.8!important}
      .nb-footer a{color:#49f8ff!important;font-weight:900!important}
      .nb-status-icon,.nb-suspended-icon{filter:drop-shadow(0 0 14px #ff3cac)!important}
    `;

    st.textContent += `
      /* Full loading layout: visual loader instead of a scrolling log. */
      .plr-loader-stage{
        position:relative;min-height:285px;padding:32px 18px 28px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        overflow:hidden;border-radius:26px;
        background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.015));
        border:1px solid rgba(255,255,255,.12);
      }
      .plr-loader-stage::before{content:"";position:absolute;width:240px;height:240px;border-radius:50%;background:conic-gradient(from 90deg,transparent,#ff3cac,#49f8ff,transparent);filter:blur(35px);opacity:.18;animation:plr-loader-bg 5s linear infinite}
      @keyframes plr-loader-bg{to{transform:rotate(360deg)}}
      .plr-orbit{position:relative;width:112px;height:112px;border-radius:50%;border:1px solid rgba(73,248,255,.4);box-shadow:0 0 35px rgba(73,248,255,.18),inset 0 0 24px rgba(255,60,172,.12);animation:plr-orbit-spin 4s linear infinite;z-index:1}
      .plr-orbit::before,.plr-orbit::after{content:"";position:absolute;border-radius:50%;inset:10px;border:2px solid transparent;border-top-color:#ff3cac;border-right-color:#49f8ff;animation:plr-orbit-spin 1.6s linear infinite reverse}
      .plr-orbit::after{inset:25px;border-width:1px;border-top-color:#d6ff00;border-right-color:transparent;animation-duration:1s}
      .plr-orbit-dot{position:absolute;width:9px;height:9px;border-radius:50%;background:#d6ff00;box-shadow:0 0 18px #d6ff00;top:7px;left:50%;transform:translateX(-50%)}
      @keyframes plr-orbit-spin{to{transform:rotate(360deg)}}
      .plr-loader-kicker{z-index:1;margin-top:22px;color:#49f8ff;font-size:10px;font-weight:900;letter-spacing:3px;text-transform:uppercase}
      .plr-loader-title{z-index:1;margin-top:7px;color:#fff;font-size:20px;font-weight:950;letter-spacing:-.5px;text-align:center}
      .plr-loader-dots{display:inline-block;width:24px;text-align:left;color:#d6ff00;animation:plr-dots 1s steps(4,end) infinite}
      @keyframes plr-dots{0%{opacity:.15}50%{opacity:1}100%{opacity:.15}}
      .plr-loader-subtitle{z-index:1;margin-top:8px;color:rgba(255,255,255,.52);font-size:11px;text-align:center;letter-spacing:.4px}
      .plr-loader-stage .nb-log-area{display:none!important}
      .nb-exploit-header{border:0!important;margin-bottom:10px!important;padding-bottom:4px!important}
      .nb-progress-label{margin-top:16px!important}
      .nb-footer{margin-top:14px!important}
    `;

    st.textContent += `
      /* Final complete UI skin: all screens use a different app-like layout. */
      .nb-container{padding:28px 20px 22px!important}
      .nb-title{font-size:28px!important;line-height:1.05!important;letter-spacing:-1.4px!important;text-align:left!important}
      .nb-title::before{content:"✦ ";color:#ff3cac}
      .nb-subtitle{text-align:left!important;margin-top:8px!important}
      .nb-divider{margin:18px 0!important;opacity:.4}
      #nebula-auth .nb-container::before{content:"WELCOME TO THE AFTERPARTY";display:block;text-align:left;color:#d6ff00;font-size:9px;font-weight:950;letter-spacing:2px;margin-bottom:16px}
      #nebula-auth .nb-title{font-size:34px!important;text-align:left!important}
      #nebula-auth .nb-emboss-input{height:58px!important;text-align:left!important;padding-left:18px!important;font-size:14px!important;letter-spacing:1px!important}
      #nebula-auth #init-btn{height:58px!important;background:linear-gradient(100deg,#ff3cac,#794cff)!important;border:0!important;font-size:14px!important}
      #nebula-auth #support-btn{height:48px!important;background:transparent!important}
      .nb-target-list{display:grid!important;grid-template-columns:1fr 1fr!important;gap:12px!important;margin-top:20px!important}
      .nb-target-list .nb-emboss-btn{min-height:104px!important;text-align:left!important;padding:17px!important;font-size:12px!important;display:flex!important;align-items:flex-end!important;justify-content:flex-start!important;background:linear-gradient(145deg,rgba(255,60,172,.16),rgba(73,248,255,.05))!important}
      .nb-target-list .nb-emboss-btn:nth-child(even){background:linear-gradient(145deg,rgba(73,248,255,.15),rgba(214,255,0,.05))!important}
      #target-selection .nb-title{text-align:center!important}
      #target-selection .nb-title::before{content:""}
      #target-back-btn{top:16px!important;left:16px!important}
      #target-music-btn{top:16px!important;right:16px!important}
      #nebula-time-mode .nb-title{text-align:center!important}
      #nebula-time-mode .nb-title::before{content:""}
      #nebula-time-mode .nb-mode-grid{display:grid!important;grid-template-columns:1fr!important;gap:12px!important;margin:22px 0!important}
      #nebula-time-mode .nb-mode-btn{min-height:64px!important;text-align:left!important;padding:15px 18px!important;font-size:13px!important;display:flex!important;align-items:center!important;justify-content:space-between!important}
      #nebula-time-mode .nb-mode-btn span{display:inline!important;margin:0!important;color:#d6ff00!important}
      #nebula-time-mode #time-go-btn{height:56px!important;background:linear-gradient(100deg,#49f8ff,#794cff)!important;border:0!important}
      .nb-status-icon,.nb-suspended-icon{font-size:56px!important;align-self:flex-start!important}
      .nb-status-user{text-align:left!important}
      .nb-status-user:first-of-type{color:#d6ff00!important;font-weight:900!important}
      #nebula-exploit .nb-container{padding-top:20px!important}
      #nebula-exploit .nb-footer{border-top:1px solid rgba(255,255,255,.1);padding-top:12px}
      @media(max-width:480px){.nb-target-list{grid-template-columns:1fr 1fr!important}.nb-target-list .nb-emboss-btn{min-height:96px!important;font-size:11px!important}#nebula-auth .nb-title{font-size:30px!important}}
    `;

    st.textContent += `
      .key-expiry-display{display:inline-flex;align-items:center;justify-content:center;margin:8px 0 2px;padding:9px 13px;border-radius:999px;background:rgba(214,255,0,.08);border:1px solid rgba(214,255,0,.28);color:#d6ff00;font-size:10px;font-weight:950;letter-spacing:1px;text-align:center;box-shadow:0 0 20px rgba(214,255,0,.08)}
      .key-expiry-display.key-permanent{color:#49f8ff;border-color:rgba(73,248,255,.3);background:rgba(73,248,255,.08)}
      .key-expiry-display.key-expired{color:#ff3864;border-color:rgba(255,56,100,.4);background:rgba(255,56,100,.1);animation:nb-shake .35s ease}
    `;

    st.textContent += `
      /* LIQUID GLASS SKIN - high contrast, readable in dark mode */
      .nb-overlay{
        background:linear-gradient(135deg,#0b1020e8,#17233de6 48%,#27133be8)!important;
        backdrop-filter:blur(28px) saturate(145%)!important;
        -webkit-backdrop-filter:blur(28px) saturate(145%)!important;
      }
      .nb-electric-wrapper{
        background:linear-gradient(135deg,#ffffff2b,#ffffff0d 42%,#9bdcff18)!important;
        border:1px solid #ffffff52!important;
        box-shadow:0 20px 80px #00000080,0 0 0 1px #ffffff18 inset,0 0 32px #9bdcff20!important;
        backdrop-filter:blur(32px) saturate(155%)!important;
        -webkit-backdrop-filter:blur(32px) saturate(155%)!important;
      }
      .nb-container{
        background:linear-gradient(145deg,#ffffff1f,#ffffff09 52%,#8bd7ff0e)!important;
        border:1px solid #ffffff2e!important;
        box-shadow:0 1px 0 #ffffff26 inset,0 -1px 0 #00000030 inset!important;
        backdrop-filter:blur(26px) saturate(150%)!important;
        -webkit-backdrop-filter:blur(26px) saturate(150%)!important;
      }
      .nb-title{color:#ffffff!important;text-shadow:0 2px 18px #00000080!important}
      .nb-subtitle,.nb-status-user,.nb-footer{color:#e8f1ffff!important;text-shadow:0 1px 8px #00000080!important}
      .nb-divider{background:linear-gradient(90deg,#ffffff00,#ffffff80,#ffffff00)!important}
      .nb-emboss-btn{
        color:#ffffff!important;background:linear-gradient(135deg,#ffffff24,#ffffff0d)!important;
        border:1px solid #ffffff45!important;box-shadow:0 8px 24px #00000030,0 1px 0 #ffffff30 inset!important;
        backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important;
      }
      .nb-emboss-btn:hover{color:#ffffff!important;background:linear-gradient(135deg,#ffffff3d,#b8e6ff1f)!important;border-color:#ffffffa0!important}
      .nb-emboss-input{color:#ffffff!important;background:#07101fcc!important;border:1px solid #ffffff55!important;box-shadow:0 1px 0 #ffffff24 inset,0 8px 22px #00000028!important}
      .nb-emboss-input::placeholder{color:#dbeaffd9!important}
      .nb-emboss-input:focus{border-color:#a8e8ffff!important;box-shadow:0 0 0 4px #a8e8ff26,0 1px 0 #ffffff42 inset!important}
      .nb-log-area{background:#050914b8!important;border:1px solid #ffffff28!important;box-shadow:0 1px 0 #ffffff1c inset!important}
      .nb-log-text{color:#f5f8ffff!important;text-shadow:0 1px 5px #000000aa!important}
      .nb-progress-label{color:#f4f7ffff!important}
      .nb-progress-bar-bg{background:#ffffff26!important;border:1px solid #ffffff35!important}
      .nb-progress-bar-fill{background:linear-gradient(90deg,#a8e8ff,#c7b8ff,#ffffff)!important;box-shadow:0 0 18px #a8e8ffb0!important}
      .key-expiry-display{
        color:#faffffff!important;background:#d6ff0030!important;border:1px solid #eaff78b8!important;
        box-shadow:0 8px 24px #00000035,0 1px 0 #ffffff40 inset!important;text-shadow:0 1px 7px #000000b0!important;
      }
      .key-expiry-display.key-permanent{color:#dff9ffff!important;background:#49f8ff32!important;border-color:#b9f5ffb8!important}
      .key-expiry-display.key-expired{color:#ffffffff!important;background:#ff3864b8!important;border-color:#ffb0c2ff!important;box-shadow:0 0 24px #ff386480,0 1px 0 #ffffff55 inset!important;text-shadow:0 2px 8px #5b0015ff!important}
      .nb-error-text{color:#ffdce5ff!important;text-shadow:0 1px 6px #000000aa!important}
      .nb-music-btn,.nb-back-btn{color:#ffffff!important;background:#ffffff20!important;border:1px solid #ffffff55!important;box-shadow:0 8px 20px #00000040!important}
    `;
    document.head.appendChild(st);
  }

  // ═══════════════════ GLOW MANAGEMENT ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function createGlowLayers(wrapper) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const defaultGlow = document.createElement("div");
    defaultGlow.className = "nb-glow-layer glow-default";
    wrapper.appendChild(defaultGlow);
    const focusGlow1 = document.createElement("div");
    focusGlow1.className = "nb-glow-layer glow-focus-1";
    wrapper.appendChild(focusGlow1);
    const focusGlow2 = document.createElement("div");
    focusGlow2.className = "nb-glow-layer glow-focus-2";
    wrapper.appendChild(focusGlow2);
    return { defaultGlow, focusGlow1, focusGlow2 };
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function activateFocusGlow(focusGlow1, focusGlow2) {
    if (focusGlow1) focusGlow1.style.opacity = "1";
    if (focusGlow2) focusGlow2.style.opacity = "1";
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function deactivateFocusGlow(focusGlow1, focusGlow2) {
    if (focusGlow1) focusGlow1.style.opacity = "0";
    if (focusGlow2) focusGlow2.style.opacity = "0";
  }

  // ═══════════════════ NETWORK DETECTION ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function isMeteredConnection() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (navigator.connection) {
      const conn = navigator.connection;
      if (conn.type === 'cellular') {
        DBG.log('NET', 'Cellular connection detected -> metered');
        return true;
      }
      if (conn.saveData === true) {
        DBG.log('NET', 'saveData enabled -> metered');
        return true;
      }
      if (conn.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) {
        DBG.log('NET', 'Slow connection (' + conn.effectiveType + ') -> metered');
        return true;
      }
    }
    DBG.log('NET', 'Connection appears unmetered (WiFi)');
    return false;
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function shouldPlayMusic() {
    return musicAutoPlay || musicUserEnabled;
  }

  // ═══════════════════ LOG QUEUE SYSTEM ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function startLogQueue() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (isLoggingActive) return;
    isLoggingActive = true;
    DBG.log('UI', 'Log queue started');
    
    logInterval = setInterval(() => {
      if (logQueue.length > 0) {
        const logEntry = logQueue.shift();
        displayLogEntry(logEntry);
      }
    }, 150);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function stopLogQueue() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    isLoggingActive = false;
    DBG.log('UI', 'Log queue stopped, remaining: ' + logQueue.length);
    if (logInterval) {
      clearInterval(logInterval);
      logInterval = null;
    }
    while (logQueue.length > 0) {
      const logEntry = logQueue.shift();
      displayLogEntry(logEntry);
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function queueLog(icon, text, color, className = '') {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    logQueue.push({ icon, text, color, className });
    if (!isLoggingActive) {
      startLogQueue();
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function displayLogEntry(logEntry) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const lo = document.getElementById("log-output");
    if (!lo) return;
    
    const entry = document.createElement('div');
    entry.className = `nb-log-entry ${logEntry.className}`;
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'nb-log-icon';
    iconSpan.textContent = logEntry.icon;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'nb-log-text';
    textSpan.style.color = logEntry.color;
    textSpan.textContent = logEntry.text;
    
    entry.appendChild(iconSpan);
    entry.appendChild(textSpan);
    lo.appendChild(entry);
    lo.scrollTop = lo.scrollHeight;
  }

  // corsFetch proxy chain removed — direct fetch only

  // ═══════════════════ USER DATA FETCH ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev


  // ═══════════════════ API INTEGRATION ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function isValidRedirectUrl(url) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (!url) return false;
    if (url.includes('t.me/') || url.includes('telegram.me/') || url.includes('telegram.org/')) return false;
    if (url === CONFIG.fallbackRedirectUrl) return false;
    if (url.includes('lukyyplr.pages.dev')) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function isTelegramLink(url) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    return url && (url.includes('t.me/') || url.includes('telegram.me/'));
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function isHoneypotUrl(url) {
    if (!url) return true;
    const u = String(url).toLowerCase();
    return u.includes('lukyyplr.pages.dev') || u.includes('crxx.pages.dev') || u === String(CONFIG.fallbackRedirectUrl || '').toLowerCase();
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  // Nebula Render API: POST /A2MBD3 with headers pin, mode, vp (no Cloudflare)
  function getA2MBD3Endpoint() {
    return String(CONFIG.apiBaseUrl || CONFIG.userDataApiUrl || '').replace(/\/+$/, '') + '/A2MBD3';
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function getRequestPin(fallbackPin) {
    return fallbackPin == null ? '' : String(fallbackPin);
  }

  async function callA2MBD3Api({ mode, vp, pin, signal }) {
    const modeStr = String(mode || '');
    const pinStr = getRequestPin(pin);
    const bodyObj = { pin: pinStr, mode: modeStr, type: modeStr };
    if (vp) bodyObj.vp = String(vp);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'pin': pinStr,
      'mode': modeStr
    };
    if (vp) headers['vp'] = String(vp);
    return fetch(getA2MBD3Endpoint(), {
      method: 'POST',
      signal: signal,
      headers: headers,
      body: JSON.stringify(bodyObj)
    });
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function fetchRedirectUrlFromAPI(type, attempt = 1) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const maxRetries = 3;
    DBG.log('API', `fetchRedirectUrlFromAPI: type=${type}, attempt=${attempt}/${maxRetries}`);
    
    try {
      DBG.log('API', typeof __NEBULA_SECURE_TOKEN__ !== 'undefined' && __NEBULA_SECURE_TOKEN__ ? 'Using secure token (beta /b)...' : 'Generating TOTP pin...');
      const pin = getRequestPin(await totpGenerator.generate(0));
      currentPinCache = pin;
      DBG.log('API', 'PIN: ' + pin);
      
      if (attempt > 1) {
        queueLog('🔄', `ATTEMPT ${attempt} OF ${maxRetries}`, '#ffa500', 'log-highlight');
      }
      
      queueLog('📡', `POST ${getA2MBD3Endpoint()} | mode=${type} | pin=******`, '#7dd3fc');
      
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        DBG.log('API', 'Request timeout, aborting...');
        controller.abort();
      }, 15000);
      
      const fetchStart = performance.now();
      const response = await callA2MBD3Api({
        mode: type,
        pin: pin,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      DBG.log('API', `Response: ${response.status} (${(performance.now() - fetchStart).toFixed(0)}ms)`);
      
      queueLog('📡', `RESPONSE: ${response.status} ${response.statusText}`, response.ok ? '#2ecc71' : '#ff4757');
      
      if (!response.ok) {
        DBG.log('API', 'Trying previous TOTP window...');
        const prevPin = getRequestPin(await totpGenerator.generate(-1));
        currentPinCache = prevPin;
        
        queueLog('🔐', 'CHECKING PREVIOUS WINDOW...', '#00f2ff');
        
        const retryResponse = await callA2MBD3Api({ mode: type, pin: prevPin });
        
        DBG.log('API', `Retry response: ${retryResponse.status}`);
        queueLog('📡', `RETRY RESPONSE: ${retryResponse.status}`, retryResponse.ok ? '#2ecc71' : '#ff4757');
        
        if (!retryResponse.ok) {
          if (attempt < maxRetries) {
            DBG.log('API', `Retrying (${attempt + 1}/${maxRetries})...`);
            queueLog('⏳', `RETRYING (${attempt + 1}/${maxRetries})...`, '#ffa500');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchRedirectUrlFromAPI(type, attempt + 1);
          }
          throw new Error(`FAILED AFTER ${maxRetries} ATTEMPTS`);
        }
        
        const retryData = await retryResponse.json();
        apiResponseCache = retryData;
        return processApiResponse(retryData, prevPin, attempt, type);
      }
      
      let data = await response.json();
      DBG.log('API', 'Response data received');
      apiResponseCache = data;

      // Honeypot => try adjacent TOTP windows before failing
      if (data && isHoneypotUrl(data.destinationLink)) {
        for (const off of [-1, 1]) {
          try {
            const altPin = getRequestPin(await totpGenerator.generate(off));
            currentPinCache = altPin;
            queueLog('🔐', `TRYING TOTP OFFSET ${off}...`, '#00f2ff');
            const altRes = await callA2MBD3Api({ mode: type, pin: altPin });
            if (altRes.ok) {
              const altData = await altRes.json();
              if (altData && !isHoneypotUrl(altData.destinationLink) && isValidRedirectUrl(altData.destinationLink)) {
                apiResponseCache = altData;
                return processApiResponse(altData, altPin, attempt, type);
              }
              data = altData;
              apiResponseCache = altData;
            }
          } catch (e) {}
        }
      }

      return processApiResponse(data, pin, attempt, type);
      
    } catch (error) {
      DBG.error('API', 'Error: ' + error.message);
      queueLog('❌', `ERROR: ${error.message}`, '#ff4757', 'log-error');
      
      if (attempt < maxRetries) {
        DBG.log('API', `Retrying after error (${attempt + 1}/${maxRetries})...`);
        queueLog('⏳', `RETRYING (${attempt + 1}/${maxRetries})...`, '#ffa500');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchRedirectUrlFromAPI(type, attempt + 1);
      }
      
      DBG.error('API', `All ${maxRetries} attempts exhausted`);
      queueLog('❌', `ALL ${maxRetries} ATTEMPTS EXHAUSTED`, '#ff4757', 'log-error');
      return handleFetchFailure('❌ SERVER REJECTED AFTER MAX ATTEMPTS');
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function processApiResponse(data, pin, attempt, originalType) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const maxRetries = 3;
    const modeForRetry = originalType || '1';
    const destinationUrl = data && data.destinationLink ? data.destinationLink : null;
    
    DBG.log('API', 'Processing response, destination: ' + (destinationUrl || 'N/A').substring(0, 60));
    
    queueLog('📋', 'PARSING SERVER RESPONSE...', '#00f2ff', 'log-highlight');
    queueLog('●', `TYPE: ${((data && data.type) || 'N/A')}`.toUpperCase(), '#7dd3fc');
    queueLog('●', `VERIFIED: ${data && data.verified ? '✅ YES' : '❌ NO'}`, data && data.verified ? '#2ecc71' : '#ff4757');
    queueLog('●', `OWNER: ${(data && data.owner) || '@LUKYYPLR'}`, '#c4b5fd');
    if (data && data.client) {
      queueLog('●', `CLIENT: ${data.client}`, '#c4b5fd');
    }
    
    if (data && data.success === false) {
      queueLog('❌', `SERVER ERROR: ${(data.error || 'failed')}`, '#ff4757', 'log-error');
      if (attempt < maxRetries) {
        queueLog('🔄', `RETRYING... Attempt ${attempt + 1} of ${maxRetries}`, '#ffa500', 'log-highlight');
        return fetchRedirectUrlFromAPI(modeForRetry, attempt + 1);
      }
      return handleFetchFailure('❌ SERVER ERROR — ' + (data.error || 'FAILED'));
    }
    
    if (data && data.destinationLink) {
      const truncated = data.destinationLink.length > 50 ? data.destinationLink.substring(0, 50) + '...' : data.destinationLink;
      queueLog('🔗', `DESTINATION: ${truncated}`, '#7dd3fc');
    }
    
    if (isHoneypotUrl(destinationUrl) || isTelegramLink(destinationUrl)) {
      DBG.log('API', 'Honeypot/fake URL — PIN may be wrong or expired');
      queueLog('⚠', `AUTH REJECTED / HONEYPOT (Attempt ${attempt}/${maxRetries})`, '#ffa500', 'log-highlight');
      queueLog('🔐', 'TIP: PIN expires every 30s — check TOTP secret', '#ffa500');
      
      if (attempt < maxRetries) {
        queueLog('🔄', `RETRYING WITH FRESH PIN... ${attempt + 1}/${maxRetries}`, '#ffa500', 'log-highlight');
        return fetchRedirectUrlFromAPI(modeForRetry, attempt + 1);
      }
      
      queueLog('❌', `ALL ${maxRetries} ATTEMPTS FAILED — INVALID PIN OR SECRET`, '#ff4757', 'log-error');
      return handleFetchFailure('❌ AUTH FAILED — INVALID OR EXPIRED PIN');
    } 
    else if (isValidRedirectUrl(destinationUrl)) {
      DBG.log('API', 'Valid redirect URL found!');
      queueLog('✅', 'AUTHENTIC REDIRECT URL FOUND!', '#2ecc71', 'log-success');
      return handleFetchSuccess(destinationUrl, data, pin);
    } 
    else {
      DBG.log('API', 'Invalid URL format');
      queueLog('⚠', `INVALID URL FORMAT (Attempt ${attempt}/${maxRetries})`, '#ffa500', 'log-highlight');
      
      if (attempt < maxRetries) {
        queueLog('🔄', `RETRYING... Attempt ${attempt + 1} of ${maxRetries}`, '#ffa500', 'log-highlight');
        return fetchRedirectUrlFromAPI(modeForRetry, attempt + 1);
      }
      
      queueLog('❌', `ALL ${maxRetries} ATTEMPTS FAILED — INVALID URLS`, '#ff4757', 'log-error');
      return handleFetchFailure('❌ SERVER REJECTED — INVALID URLS AFTER MAX ATTEMPTS');
    }
  }


  function handleFetchSuccess(url, data, pin) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('API', 'SUCCESS, redirect: ' + url.substring(0, 60));
    isRealRedirectUrl = true;
    fetchEndTime = Date.now();
    const elapsed = fetchEndTime - fetchStartTime;
    
    queueLog('✅', 'AUTHENTIC REDIRECT URL CONFIRMED', '#2ecc71', 'log-success');
    queueLog('🎯', 'TARGET ACQUIRED SUCCESSFULLY', '#2ecc71', 'log-success');
    
    const remainingTime = Math.max(0, CONFIG.minProgressTime - elapsed);
    
    fetchCompleted = true;
    fetchResult = {
      url: url,
      apiData: data,
      pin: pin,
      isReal: true,
      serverMessage: '✅ REAL REDIRECT CONFIRMED',
      isError: false,
      isFakeUrl: false
    };
    
    if (selectedModuleType === "vipteam" || selectedModuleType === "powercheats" || selectedModuleType === "universal-vplink") {
      queueLog('⚡', 'LINK VERIFIED — SKIPPING FILLER LOGS', '#ff00ff', 'log-highlight');
      actualProgressTime = elapsed;
      completeProgressNow();
    } else {
      if (elapsed >= CONFIG.minProgressTime) {
        actualProgressTime = elapsed;
        completeProgressNow();
      } else {
        actualProgressTime = CONFIG.minProgressTime;
        scheduleFillerLogs(remainingTime);
      }
    }
    
    return fetchResult;
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function handleFetchFailure(message) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.error('API', 'FAILURE: ' + message);
    isRealRedirectUrl = false;
    fetchEndTime = Date.now();
    
    queueLog('❌', message, '#ff4757', 'log-error');
    queueLog('⚠', 'NO FALLBACK — STAYING ON PANEL', '#ffa500', 'log-highlight');
    queueLog('●', 'Fix PIN/secret or retry target', '#c4b5fd');
    
    fetchCompleted = true;
    fetchResult = {
      url: null,
      apiData: apiResponseCache,
      pin: currentPinCache,
      isReal: false,
      serverMessage: message,
      isError: true,
      isFakeUrl: true
    };
    
    actualProgressTime = Math.max(0, fetchEndTime - (fetchStartTime || fetchEndTime));
    completeProgressNow();
    
    return fetchResult;
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function scheduleFillerLogs(remainingTime) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('FILLER', 'Scheduling for ' + remainingTime + 'ms');
    fillerLogsScheduled = true;
    
    const fillerBatches = [
      [
        { icon: '🔍', text: 'SCANNING NETWORK INTERFACES...', color: '#4a5568' },
        { icon: '●', text: `INTERFACE eth0: 192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`, color: '#718096' },
        { icon: '●', text: `INTERFACE wlan0: 10.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`, color: '#718096' },
        { icon: '🔒', text: 'ESTABLISHING SECURE TUNNEL...', color: '#00f2ff' },
        { icon: '●', text: `SSL CIPHER: TLS_AES_256_GCM_SHA384`, color: '#4a5568' },
      ],
      [
        { icon: '📊', text: 'ANALYZING RESPONSE HEADERS...', color: '#ffa500' },
        { icon: '●', text: `CONTENT-TYPE: application/json`, color: '#4a5568' },
        { icon: '●', text: `CACHE-CONTROL: no-cache`, color: '#4a5568' },
        { icon: '●', text: `X-FRAME-OPTIONS: DENY`, color: '#4a5568' },
        { icon: '🛡', text: 'VERIFYING CORS POLICY...', color: '#00f2ff' },
      ],
      [
        { icon: '🔐', text: 'VALIDATING TOTP SIGNATURE...', color: '#ffa500' },
        { icon: '●', text: `ALGORITHM: SHA-1 HMAC`, color: '#4a5568' },
        { icon: '●', text: `DIGITS: 6 | TIME STEP: 30s`, color: '#4a5568' },
        { icon: '📡', text: 'CHECKING ENDPOINT AVAILABILITY...', color: '#00f2ff' },
        { icon: '●', text: `PING: ${Math.floor(Math.random()*50+20)}ms`, color: '#2ecc71' },
      ],
      [
        { icon: '🔍', text: 'INSPECTING PAYLOAD INTEGRITY...', color: '#ffa500' },
        { icon: '●', text: `CHECKSUM: ${Math.random().toString(36).substring(2, 10).toUpperCase()}`, color: '#4a5568' },
        { icon: '●', text: `SIZE: ${Math.floor(Math.random()*500+200)} bytes`, color: '#4a5568' },
        { icon: '⚡', text: 'OPTIMIZING CONNECTION ROUTING...', color: '#00f2ff' },
        { icon: '●', text: `ROUTE: direct | LATENCY: ${Math.floor(Math.random()*30+10)}ms`, color: '#2ecc71' },
      ],
    ];
    
    const batchCount = fillerBatches.length;
    const batchInterval = remainingTime / (batchCount + 1);
    
    fillerBatches.forEach((batch, index) => {
      const delay = batchInterval * (index + 1);
      const timerId = setTimeout(() => {
        if (!isRedirecting && !progressCompleted && fillerLogsScheduled) {
          batch.forEach(log => queueLog(log.icon, log.text, log.color));
        }
      }, delay);
      logTimers.push(timerId);
    });
    
    const finalTimerId = setTimeout(() => {
      if (!isRedirecting && !progressCompleted && fillerLogsScheduled) {
        queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
        queueLog('🛡', 'SECURITY VERIFICATION COMPLETE', '#00f2ff', 'log-highlight');
        queueLog('●', `HTTPS: ${window.location.protocol === 'https:' ? '✅ SECURE' : '⚠ INSECURE'}`, window.location.protocol === 'https:' ? '#2ecc71' : '#ff4757');
        queueLog('●', `NETWORK: ${navigator.onLine ? '✅ CONNECTED' : '❌ OFFLINE'}`, navigator.onLine ? '#2ecc71' : '#ff4757');
        queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
        queueLog('✅', `FINAL: ${selectedTargetName} — SUCCESS`, '#2ecc71', 'log-success');
        queueLog('🔗', `REDIRECT: ${fetchResult.url.substring(0, 50)}...`, '#00f2ff', 'log-highlight');
      }
    }, remainingTime - 500);
    logTimers.push(finalTimerId);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function cancelFillerLogs() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    fillerLogsScheduled = false;
    logTimers.forEach(t => clearTimeout(t));
    logTimers = [];
    DBG.log('FILLER', 'All filler logs cancelled');
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function completeProgressNow() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('PROGRESS', 'Completing now');
    progressCompleted = true;
    exploitProgressActive = false;
    
    cancelFillerLogs();
    
    const bar = document.getElementById("nb-progress-exploit");
    const pct = document.getElementById("nb-progress-pct");
    
    if (bar) {
      bar.style.transition = "width 0.5s ease-out";
      bar.style.width = "100%";
      if (fetchResult && (fetchResult.isError || fetchResult.isFakeUrl)) {
        bar.classList.add('error-fill');
      } else if ((selectedModuleType === "vipteam" || selectedModuleType === "powercheats" || selectedModuleType === "universal-vplink") && fetchResult && fetchResult.isReal) {
        bar.classList.add('vipteam-success');
      }
    }
    if (pct) pct.textContent = "100%";
    
    const statusEl = document.getElementById("nb-live-status");
    if (statusEl) {
      if (fetchResult && (fetchResult.isError || fetchResult.isFakeUrl)) {
        statusEl.textContent = '● REJECTED';
        statusEl.style.color = 'var(--danger-color)';
      } else if (selectedModuleType === "vipteam" || selectedModuleType === "powercheats" || selectedModuleType === "universal-vplink") {
        statusEl.textContent = '● VERIFIED';
        statusEl.style.color = '#ff00ff';
      } else {
        statusEl.textContent = '● SUCCESS';
        statusEl.style.color = 'var(--success-color)';
      }
    }
    
    stopLogQueue();
    
    setTimeout(() => {
      if (fetchResult && !isRedirecting) {
        if (fetchResult.isError || fetchResult.isFakeUrl || !fetchResult.url) {
          handleExploitComplete(null, document.getElementById("nebula-exploit"), false);
        } else {
          handleExploitComplete(fetchResult.url, document.getElementById("nebula-exploit"), !!fetchResult.isReal);
        }
      }
    }, 800);
  }

  // ═══════════════════ HELPERS ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function createWrapper(innerHTML, extraContainerStyle) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const wrapper = document.createElement("div");
    wrapper.className = "nb-electric-wrapper";
    const glowLayers = createGlowLayers(wrapper);
    const container = document.createElement("div");
    container.className = "nb-container" + (extraContainerStyle ? " " + extraContainerStyle : "");
    container.innerHTML = innerHTML;
    wrapper.appendChild(container);
    return { wrapper, container, ...glowLayers };
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function fetchConfig() {
    // Beta /b: config is embedded in this template — never call /conf
    DBG.log('CONFIG', 'Beta template — embedded config, skip /conf');
  }

  function getTargetConfig(id) {
    return (CONFIG.targets && CONFIG.targets[id]) || null;
  }

  function applyTargetTiming(targetId, modeKey) {
    const t = getTargetConfig(targetId);
    if (!t) {
      CONFIG.selectedTimeMs = 0;
      CONFIG.minProgressTime = 0;
      CONFIG.exploitProgressTime = 0;
      return 0;
    }
    if (t.timeModes && typeof t.timeModes === 'object') {
      const key = modeKey || t.defaultMode || 'smart';
      const ms = Number(t.timeModes[key] != null ? t.timeModes[key] : 50000);
      CONFIG.selectedTimeMode = key;
      CONFIG.selectedTimeMs = ms;
      CONFIG.minProgressTime = ms;
      CONFIG.exploitProgressTime = ms;
      return ms;
    }
    const ms = Number(t.redirectTime != null ? t.redirectTime : 0);
    CONFIG.selectedTimeMode = null;
    CONFIG.selectedTimeMs = ms;
    CONFIG.minProgressTime = ms;
    CONFIG.exploitProgressTime = ms;
    return ms;
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function isBannedUser() { return USER_DATA.banned === 1 || USER_DATA.banned === "1"; }
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function isSuspendedUser() { return USER_DATA.banned === 2 || USER_DATA.banned === "2"; }
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function validateAccessKey(rawKey) {
    const key = String(rawKey || '').trim();
    if (!key) throw new Error('Key wajib diisi');
    const url = `${CONFIG.keyUrl}?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, { headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' } });
    let data;
    try { data = await response.json(); } catch { throw new Error(`Respons API tidak valid (${response.status})`); }
    if (!response.ok || data.status !== 'success') {
      throw new Error(data.message || 'Key tidak valid atau sudah expired');
    }
    ACCESS_KEY_DATA = data;
    return data;
  }

  function needPassword() { return USER_DATA.password !== "0" && USER_DATA.password !== 0 && USER_DATA.password !== ""; }
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function hasChannel() { return USER_DATA.tgChannel !== "0" && USER_DATA.tgChannel !== 0 && USER_DATA.tgChannel !== ""; }
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function getChannelUrl() {
    const c = USER_DATA.tgChannel;
    if (!c || c === "0") return null;
    return c.startsWith("http") ? c : "https://" + c;
  }
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function checkPassword(input) {
    if (!needPassword()) return true;
    return input.replace(/\s/g, '').toLowerCase() === USER_DATA.password.replace(/\s/g, '').toLowerCase();
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function fetchMusicList() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('MUSIC', 'Fetching...');
    try {
      const r = await fetch(CONFIG.musicListUrl + "?t=" + Date.now());
      const t = await r.text();
      musicList = t.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
      DBG.log('MUSIC', 'Loaded ' + musicList.length + ' tracks');
      return musicList.length > 0;
    } catch (e) { DBG.error('MUSIC', e.message); return false; }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function getRandomMusic() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (!musicList.length) return null;
    let i;
    if (musicList.length === 1) i = 0;
    else { do { i = Math.floor(Math.random() * musicList.length); } while (i === currentTrackIndex && musicList.length > 1); }
    currentTrackIndex = i;
    return musicList[i];
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function initAudioConditionally() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (!shouldPlayMusic()) {
      DBG.log('MUSIC', 'Music blocked (metered + user not enabled)');
      updateTrackDisplay();
      return;
    }
    
    const url = getRandomMusic();
    if (!url) return;
    
    if (audioPlayer) { 
      try { audioPlayer.pause(); audioPlayer.onended = null; audioPlayer.onerror = null; } catch (e) {} 
    }
    
    audioPlayer = new Audio(url);
    audioPlayer.loop = false;
    audioPlayer.volume = 0.35;
    audioPlayer.preload = "auto";
    audioPlayer.onended = () => nextTrackAuto();
    audioPlayer.onerror = () => {
      if (musicList[currentTrackIndex]) musicList.splice(currentTrackIndex, 1);
      setTimeout(() => { if (musicList.length && !isRedirecting) nextTrackAuto(); }, 500);
    };
    
    audioPlayer.play().catch(() => {});
    DBG.log('MUSIC', 'Playing: ' + url.substring(url.lastIndexOf('/')+1));
    
    updateTrackDisplay();
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function nextTrackAuto() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (!shouldPlayMusic()) {
      DBG.log('MUSIC', 'Next track blocked (metered)');
      return;
    }
    if (!musicList.length) return;
    const url = getRandomMusic();
    if (!url) return;
    if (audioPlayer) { try { audioPlayer.pause(); } catch (e) {} }
    audioPlayer.src = url;
    audioPlayer.load();
    audioPlayer.play().catch(() => {});
    updateTrackDisplay();
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function nextTrackManual() { 
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (!shouldPlayMusic()) {
      showToast("📵 Music blocked on mobile data");
      return;
    }
    nextTrackAuto(); 
    showToast("📳 NEXT TRACK!"); 
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function setupMusicToggle(btnId) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const musicBtn = document.getElementById(btnId);
    if (!musicBtn) return;
    
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const updateMusicBtnAppearance = () => {
      if (!shouldPlayMusic()) {
        musicBtn.textContent = "✕";
        musicBtn.style.boxShadow = "inset 3px 3px 6px var(--emboss-shadow),inset -3px -3px 6px var(--emboss-light)";
        musicBtn.style.color = "var(--danger-color)";
        musicBtn.classList.add('metered');
        musicBtn.title = "Music blocked (mobile data) - Click to enable";
        return;
      }
      
      musicBtn.classList.remove('metered');
      musicBtn.style.color = "var(--text-color)";
      
      if (!audioPlayer) {
        musicBtn.textContent = "♪";
        musicBtn.style.boxShadow = "3px 3px 6px var(--emboss-shadow),-3px -3px 6px var(--emboss-light)";
        musicBtn.title = "Play music";
      } else if (audioPlayer.paused) {
        musicBtn.textContent = "✕";
        musicBtn.style.boxShadow = "inset 3px 3px 6px var(--emboss-shadow),inset -3px -3px 6px var(--emboss-light)";
        musicBtn.title = "Music paused - Click to play";
      } else {
        musicBtn.textContent = "♪";
        musicBtn.style.boxShadow = "3px 3px 6px var(--emboss-shadow),-3px -3px 6px var(--emboss-light)";
        musicBtn.title = "Music playing - Click to pause";
      }
    };
    
    updateMusicBtnAppearance();
    
    musicBtn.addEventListener("click", () => {
      if (!shouldPlayMusic()) {
        musicUserEnabled = true;
        DBG.log('MUSIC', 'User manually enabled music on metered connection');
        showToast("🎵 Music enabled (mobile data)");
        initAudioConditionally();
        updateMusicBtnAppearance();
        updateTrackDisplay();
        return;
      }
      
      if (!audioPlayer) { 
        initAudioConditionally(); 
        updateMusicBtnAppearance();
        return; 
      }
      if (audioPlayer.paused) { 
        audioPlayer.play().catch(()=>{}); 
      } else { 
        audioPlayer.pause(); 
      }
      updateMusicBtnAppearance();
    });
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function initShake() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (!window.DeviceMotionEvent) return;
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then(p => { if (p === "granted") addShakeListener(); }).catch(() => {});
    } else addShakeListener();
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function applySnowDrift(dx, dy) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const x = Math.max(-48, Math.min(48, dx));
    const y = Math.max(-36, Math.min(36, dy));
    document.querySelectorAll('.nb-overlay').forEach(ov => {
      ov.style.setProperty('--snow-x', x.toFixed(1) + 'px');
      ov.style.setProperty('--snow-y', y.toFixed(1) + 'px');
    });
  }

  function addShakeListener() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    window.addEventListener("devicemotion", (e) => {
      const a = e.accelerationIncludingGravity;
      if (!a) return;
      if (lastX === null) { lastX = a.x; lastY = a.y; lastZ = a.z; return; }
      // Drift snow toward tilt / shake direction
      if (a.x != null && a.y != null) {
        applySnowDrift(-(a.x || 0) * 4.5, (a.y || 0) * 2.2);
      }
      if (Math.abs(a.x - lastX) + Math.abs(a.y - lastY) + Math.abs(a.z - lastZ) > 15 && !shakeTimeout) {
        shakeTimeout = setTimeout(() => shakeTimeout = null, 1000);
        nextTrackManual();
      }
      lastX = a.x; lastY = a.y; lastZ = a.z;
    }, { passive: true });

    // Continuous tilt parallax when available
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma == null && e.beta == null) return;
      const gx = (e.gamma || 0); // left-right -90..90
      const gy = (e.beta || 0);  // front-back
      applySnowDrift(gx * 1.1, (gy - 45) * 0.55);
    }, { passive: true });
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function showToast(msg) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:2147483647;background:var(--bg-color);border:none;color:var(--text-color);padding:10px 24px;border-radius:14px;font-size:12px;font-weight:600;letter-spacing:1px;pointer-events:none;box-shadow:6px 6px 12px var(--emboss-shadow),-6px -6px 12px var(--emboss-light);animation:nb-toast-in 0.3s ease;font-family:'Segoe UI',Roboto,sans-serif;";
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity 0.3s"; setTimeout(() => t.remove(), 300); }, 1500);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function cleanupAll() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (autoInitTimeout) clearTimeout(autoInitTimeout);
    if (banRedirectTimeout) clearTimeout(banRedirectTimeout);
    if (initProgressRAF) cancelAnimationFrame(initProgressRAF);
    if (exploitProgressRAF) cancelAnimationFrame(exploitProgressRAF);
    if (fillerLogTimer) clearTimeout(fillerLogTimer);
    logTimers.forEach(t => clearTimeout(t));
    logTimers = [];
    cancelFillerLogs();
    stopLogQueue();
  }

  // ═══════════════════ EXPLOIT COMPLETE HANDLER ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function handleExploitComplete(url, overlayEl, isReal) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    if (isRedirecting) return;
    // No fallback redirect — only leave on real success URL
    if (!url || !isReal || (fetchResult && (fetchResult.isError || fetchResult.isFakeUrl))) {
      DBG.log('REDIRECT', 'Skipped — error or empty URL (no fallback)');
      isRedirecting = false;
      queueLog('⏸', 'PANEL HELD — NO REDIRECT', '#ffa500', 'log-highlight');
      return;
    }
    isRedirecting = true;
    DBG.log('REDIRECT', 'Redirecting to: ' + String(url).substring(0, 60));

    if (audioPlayer) { try { audioPlayer.pause(); } catch(e) {} }

    if (overlayEl) {
      overlayEl.style.transition = "opacity 0.4s";
      overlayEl.style.opacity = "0";
      setTimeout(() => { overlayEl.remove(); }, 400);
    }

    setTimeout(() => {
      window.location.href = url;
    }, 500);
  }

  // ═══════════════════ STATUS PANELS ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function showStatusPanel(icon, title, descLines, btnText, btnAction, countdown, isSuspended = false) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('UI', 'Showing panel: ' + title);
    cleanupAll();
    document.querySelector(".nb-overlay")?.remove();
    injectStyles();
    const ov = document.createElement("div");
    ov.className = "nb-overlay";
    const descHTML = Array.isArray(descLines) ? descLines.map(l => `<p class="nb-status-user" style="margin:2px 0;">${l}</p>`).join('') : `<p class="nb-subtitle">${descLines}</p>`;
    
    const iconClass = isSuspended ? "nb-suspended-icon" : "nb-status-icon";
    const btnClass = isSuspended ? "nb-emboss-btn nb-unban-btn" : "nb-emboss-btn";
    
    const { wrapper } = createWrapper(`
      <div class="${iconClass}">${icon}</div>
      <h3 class="nb-title">${title}</h3>
      ${descHTML}
      ${btnText ? `<button class="${btnClass}" id="nb-status-btn" style="margin-top:14px;">${btnText}</button>` : ''}
      ${countdown ? `<p style="color:var(--text-muted);font-size:10px;margin-top:12px;">Auto-redirect in <span id="nb-countdown" style="font-weight:700;">${countdown}</span>s</p>` : ''}
      <p class="nb-footer" style="margin-top:12px;"><a href="https://crxx.netlify.app" target="_blank">© LUKYYPLR</a> | ${APP_FULL_NAME} | API @LUKYYPLR | 📳 Shake to change track 🎵</p>
    `, "overflow-visible");
    ov.appendChild(wrapper);
    document.body.appendChild(ov);
    if (btnText && btnAction) document.getElementById("nb-status-btn")?.addEventListener("click", btnAction);
    if (countdown && btnAction) {
      let cd = countdown;
      const cdEl = document.getElementById("nb-countdown");
      banRedirectTimeout = setInterval(() => { cd--; if (cdEl) cdEl.textContent = cd; if (cd <= 0) { clearInterval(banRedirectTimeout); btnAction(); } }, 1000);
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function showBanPanel() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    isBanned = true;
    showStatusPanel("🚫", "ACCESS BANNED", ["USER: " + USER_DATA.name, "ID: " + USER_DATA.id, "Contact developer for access"], "⚡ DEVELOPER CHANNEL", () => window.open("https://t.me/HQcrx", "_blank"), 10);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function showSuspendedPanel() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    isBanned = true;
    showStatusPanel("⛔", "ACCOUNT SUSPENDED", ["USER: " + USER_DATA.name, "ID: " + USER_DATA.id, "This custom bypass has been suspended.", "Bypass creator didn't subscribed to required channel. Click below to Restore."], "🔓 Regain Access", () => window.open("https://t.me/yournebulabot/start", "_blank"), null, true);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function showOutdated() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    showStatusPanel("⚠", "NEBULA OUTDATED", "SIGNATURE MISMATCH", hasChannel() ? "⬇ DOWNLOAD LATEST" : null, hasChannel() ? () => window.open(getChannelUrl(), "_blank") : null);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function showMaintenance() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    showStatusPanel("🔧", "MAINTENANCE", "SYSTEM UPDATE IN PROGRESS", hasChannel() ? "⚡ JOIN CHANNEL" : null, hasChannel() ? () => window.open(getChannelUrl(), "_blank") : null);
  }

  // ═══════════════════ INIT PANEL ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function renderInitPanel() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('UI', 'Rendering INIT panel');
    document.getElementById("nebula-auth")?.remove();
    targetSelectionActive = false;
    authVerified = false;
    injectStyles();

    const ov = document.createElement("div");
    ov.id = "nebula-auth";
    ov.className = "nb-overlay";

    const passHTML = `
      <div style="margin-bottom:8px;">
        <input id="nb-pass-input" class="nb-emboss-input" type="password" autocomplete="off" placeholder="DROP YOUR KEY">
      </div>
      <p id="nb-pass-error" class="nb-error-text">⛔ KEY TIDAK VALID</p>
    `;

    const { wrapper, focusGlow1, focusGlow2 } = createWrapper(`
      <button id="music-btn" class="nb-music-btn">♪</button>
      <div class="nb-uid">${APP_FULL_NAME} [UID:${USER_DATA.id}]</div>
      <h3 class="nb-title">${USER_DATA.name}</h3>
      <div class="nb-divider"></div>
      <p style="color:var(--text-color);font-size:10px;letter-spacing:3px;">◆ SYSTEM READY</p>
      <div id="nb-track-name" class="nb-track"></div>
      ${passHTML}
      <button id="init-btn" class="nb-emboss-btn">⬡ START ✦</button>
      ${hasChannel() ? '<button id="support-btn" class="nb-emboss-btn">JOIN THE CREW</button>' : ''}
      <div class="nb-footer"><a href="https://crxx.netlify.app" target="_blank">© LUKYYPLR</a> | ${APP_FULL_NAME} | API @LUKYYPLR | 📳 Shake to change track 🎵</div>
    `, "overflow-visible");
    ov.appendChild(wrapper);
    document.body.appendChild(ov);

    const passInput = document.getElementById("nb-pass-input");
    if (passInput) {
      passInput.addEventListener("focus", () => activateFocusGlow(focusGlow1, focusGlow2));
      passInput.addEventListener("blur", () => deactivateFocusGlow(focusGlow1, focusGlow2));
    }

    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    updateTrackDisplay = () => {
      const el = document.getElementById("nb-track-name");
      if (!el || !musicList.length) {
        if (el) {
          if (!shouldPlayMusic()) {
            el.textContent = "♫ Music blocked (tap ♪ to enable)";
            el.className = "nb-track metered";
          } else {
            el.textContent = "";
            el.className = "nb-track";
          }
        }
        return;
      }
      if (!shouldPlayMusic()) {
        if (el) {
          el.textContent = "♫ Music blocked (tap ♪ to enable)";
          el.className = "nb-track metered";
        }
        return;
      }
      try { 
        const n = decodeURIComponent(musicList[currentTrackIndex].split('/').pop().replace(/\.[^.]+$/,'').replace(/[-_]/g,' ')); 
        if (el) {
          el.textContent = "♫ " + (n.length > 20 ? n.slice(0,20)+'…' : n);
          el.className = "nb-track";
        }
      } catch { 
        if (el) {
          el.textContent = "♫ Track " + (currentTrackIndex+1);
          el.className = "nb-track";
        }
      }
    };
    
    if (musicList.length && shouldPlayMusic()) {
      initAudioConditionally();
    } else {
      updateTrackDisplay();
    }
    
    initShake();
    
    setupMusicToggle("music-btn");

    const suppBtn = document.getElementById("support-btn");
    if (suppBtn) suppBtn.addEventListener("click", () => window.open(getChannelUrl(), "_blank"));

    const initBtn = document.getElementById("init-btn");
    const passError = document.getElementById("nb-pass-error");

    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    async function handleInitClick() {
      if (initBtn.disabled || targetSelectionActive) return;
      initBtn.disabled = true;
      if (suppBtn) suppBtn.disabled = true;

      try {
        await validateAccessKey(passInput ? passInput.value : '');
        if (passError) passError.style.display = "none";
        if (passInput) { passInput.classList.remove("error"); passInput.classList.add("success"); }
        authVerified = true;
      } catch (error) {
        if (passError) {
          passError.textContent = `⛔ ${error.message}`;
          passError.style.display = "block";
        }
        if (passInput) {
          passInput.classList.add("error");
          setTimeout(() => passInput.classList.remove("error"), 400);
        }
        initBtn.disabled = false;
        if (suppBtn) suppBtn.disabled = false;
        return;
      }
      if (suppBtn) suppBtn.disabled = true;
      if (autoInitTimeout) clearTimeout(autoInitTimeout);
      deactivateFocusGlow(focusGlow1, focusGlow2);
      
      if (directTarget) {
        selectedTarget = directTarget.target;
        selectedTargetName = directTarget.name;
        selectedModuleType = directTarget.moduleType;
        
        ov.style.transition = "opacity 0.3s";
        ov.style.opacity = "0";
        setTimeout(() => {
          ov.remove();
          if (directTarget.moduleType === "vipteam") {
            renderExploitPanelForVipteam(directTarget.apiType);
          } else if (directTarget.moduleType === "powercheats") {
            renderExploitPanelForPowerCheats(directTarget.apiType);
          } else if (directTarget.moduleType === "universal-vplink") {
            renderUniversalVplinkPanel(directTarget.apiType);
          } else {
            renderExploitPanel(directTarget.apiType);
          }
        }, 300);
      } else {
        showTargetSelection(ov);
      }
    }

    initBtn.addEventListener("click", handleInitClick);
    if (passInput) {
      passInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); handleInitClick(); } });
      passInput.addEventListener("input", () => { if (passError && passError.style.display === "block") { passError.style.display = "none"; passInput.classList.remove("error"); } });
    }
    autoInitTimeout = setTimeout(() => { const b = document.getElementById("init-btn"); if (b && !b.disabled && !targetSelectionActive) handleInitClick(); }, CONFIG.autoInitDelay);
  }

  // ═══════════════════ TARGET SELECTION ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function startKeyExpiryDisplay(element) {
    if (!element) return;
    const expiry = ACCESS_KEY_DATA && ACCESS_KEY_DATA.expiry;
    if (!expiry || String(expiry).toLowerCase() === 'permanent') {
      element.textContent = '♾️ KEY LIFETIME · PERMANENT';
      element.classList.add('key-permanent');
      return;
    }

    const expiryMs = Number(expiry);
    if (!Number.isFinite(expiryMs)) {
      element.textContent = `⏳ EXPIRED: ${String(expiry)}`;
      return;
    }

    const update = () => {
      const remaining = expiryMs - Date.now();
      if (remaining <= 0) {
        element.textContent = '⛔ KEY EXPIRED';
        element.classList.add('key-expired');
        return;
      }
      const days = Math.floor(remaining / 86400000);
      const hours = Math.floor((remaining % 86400000) / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      element.textContent = `⏳ EXPIRES IN  ${days}d ${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m ${String(seconds).padStart(2,'0')}s`;
    };
    update();
    const timer = setInterval(() => {
      if (!document.body.contains(element)) return clearInterval(timer);
      update();
    }, 1000);
  }

  function showTargetSelection(authOverlay) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    document.getElementById("target-selection")?.remove();
    targetSelectionActive = true;

    const targets = CONFIG.targets || {};
    const order = Object.keys(targets);
    const buttonsHtml = order.map(id => {
      const t = targets[id];
      const label = (t && t.name) ? t.name : id;
      return `<button id="target-btn-${id}" class="nb-emboss-btn" data-target="${id}">⬡ ${label}</button>`;
    }).join('');

    const ov = document.createElement("div");
    ov.id = "target-selection";
    ov.className = "nb-overlay";
    ov.style.zIndex = "2147483648";

    const { wrapper } = createWrapper(`
      <button id="target-back-btn" class="nb-back-btn">←</button>
      <button id="target-music-btn" class="nb-music-btn">♪</button>
      <h3 class="nb-title">PICK YOUR VIBE</h3>
      <div id="key-expiry-display" class="key-expiry-display">⏳ CHECKING KEY STATUS...</div>
      <div class="nb-divider"></div>
      <div class="nb-target-list">
      ${buttonsHtml}
      </div>
      <div class="nb-footer"><a href="https://t.me/LUKYYPLR" target="_blank">@LUKYYPLR</a> · ${APP_FULL_NAME} | API @LUKYYPLR</div>
    `, "overflow-visible");
    ov.appendChild(wrapper);
    document.body.appendChild(ov);
    startKeyExpiryDisplay(document.getElementById("key-expiry-display"));

    document.getElementById("target-back-btn").addEventListener("click", function() {
      if (!targetSelectionActive) return;
      targetSelectionActive = false;
      ov.style.transition = "opacity 0.3s";
      ov.style.opacity = "0";
      setTimeout(() => {
        ov.remove();
        authVerified = false;
        renderInitPanel();
      }, 300);
    });

    setupMusicToggle("target-music-btn");

    order.forEach(id => {
      const el = document.getElementById("target-btn-" + id);
      if (!el) return;
      el.addEventListener("click", async function() {
        if (!targetSelectionActive) return;
        const t = targets[id] || {};
        const name = t.name || id;
        const apiType = t.apiType || "2";
        const moduleType = t.moduleType || "standard";
        DBG.log('UI', 'Selected: ' + name);
        await handleTargetSelect(id, name, apiType, moduleType, ov, authOverlay);
      });
    });
  }

  function renderTargetSelection(authOverlay) {
    return showTargetSelection(authOverlay);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function handleTargetSelect(target, targetName, apiType, moduleType, selectionOverlay, authOverlay) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const tcfg = getTargetConfig(target);
    // Only Aincrad shows time mode picker (3 modes). Others = 0s ASAP.
    if (tcfg && tcfg.timeModes && target === 'aincrad') {
      return renderTimeModePicker(target, targetName, apiType, moduleType, selectionOverlay, authOverlay);
    }
    applyTargetTiming(target, null);
    return launchTarget(target, targetName, apiType, moduleType, selectionOverlay, authOverlay);
  }

  function renderTimeModePicker(target, targetName, apiType, moduleType, selectionOverlay, authOverlay) {
    const tcfg = getTargetConfig(target) || {};
    const modes = tcfg.timeModes || { fast: 20000, smart: 50000, safe: 80000 };
    targetSelectionActive = true;
    if (selectionOverlay) {
      selectionOverlay.style.transition = "opacity 0.25s";
      selectionOverlay.style.opacity = "0";
      setTimeout(() => selectionOverlay.remove(), 250);
    }
    document.getElementById("nebula-time-mode")?.remove();
    const ov = document.createElement("div");
    ov.id = "nebula-time-mode";
    ov.className = "nb-overlay";
    const { wrapper } = createWrapper(`
      <button id="time-back-btn" class="nb-emboss-btn" style="margin-bottom:12px;">← BACK</button>
      <div class="nb-uid">${APP_FULL_NAME} | API @LUKYYPLR</div>
      <h3 class="nb-title">${targetName}</h3>
      <p class="nb-subtitle">CHOOSE YOUR SPEED</p>
      <div class="nb-mode-grid">
        <button class="nb-mode-btn" data-mode="fast">⚡ FAST<br><span>${Math.round((modes.fast||20000)/1000)}s</span></button>
        <button class="nb-mode-btn nb-mode-active" data-mode="smart">◆ SMART<br><span>${Math.round((modes.smart||50000)/1000)}s</span></button>
        <button class="nb-mode-btn" data-mode="safe">🛡 SAFE<br><span>${Math.round((modes.safe||80000)/1000)}s</span></button>
      </div>
      <button id="time-go-btn" class="nb-emboss-btn">RUN IT →</button>
      <div class="nb-footer">@LUKYYPLR · ${APP_FULL_NAME} | API @LUKYYPLR</div>
    `, "overflow-visible");
    ov.appendChild(wrapper);
    document.body.appendChild(ov);
    let chosen = tcfg.defaultMode || 'smart';
    ov.querySelectorAll('.nb-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ov.querySelectorAll('.nb-mode-btn').forEach(b => b.classList.remove('nb-mode-active'));
        btn.classList.add('nb-mode-active');
        chosen = btn.getAttribute('data-mode');
      });
    });
    document.getElementById('time-back-btn').addEventListener('click', () => {
      ov.remove();
      if (authOverlay) authOverlay.style.opacity = '1';
      renderTargetSelection(authOverlay || document.getElementById('nebula-auth'));
    });
    document.getElementById('time-go-btn').addEventListener('click', () => {
      applyTargetTiming(target, chosen);
      launchTarget(target, targetName, apiType, moduleType, ov, authOverlay);
    });
  }

  function launchTarget(target, targetName, apiType, moduleType, selectionOverlay, authOverlay) {
    selectedTarget = target;
    selectedTargetName = targetName;
    selectedModuleType = moduleType;
    targetSelectionActive = false;
    document.querySelectorAll('[id^="target-"]').forEach(b => { try { b.disabled = true; } catch(e) {} });
    
    if (selectionOverlay) {
      selectionOverlay.style.transition = "opacity 0.3s";
      selectionOverlay.style.opacity = "0";
    }
    if (authOverlay) {
      authOverlay.style.transition = "opacity 0.3s";
      authOverlay.style.opacity = "0";
    }
    
    setTimeout(() => {
      if (selectionOverlay) selectionOverlay.remove();
      if (authOverlay) authOverlay.remove();
      document.getElementById("nebula-time-mode")?.remove();
      
      if (moduleType === "vipteam") {
        renderExploitPanelForVipteam(apiType);
      } else if (moduleType === "powercheats") {
        renderExploitPanelForPowerCheats(apiType);
      } else if (moduleType === "universal-vplink") {
        renderUniversalVplinkPanel(apiType);
      } else {
        renderExploitPanel(apiType);
      }
    }, 280);
  }

  // ═══════════════════ STANDARD EXPLOIT PANEL ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function renderExploitPanel(apiType) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('UI', 'Rendering STANDARD EXPLOIT panel, apiType=' + apiType);
    document.getElementById("nebula-exploit")?.remove();
    
    fetchCompleted = false;
    fetchResult = null;
    progressCompleted = false;
    logQueue = [];
    fillerLogsScheduled = false;
    
    const ov = document.createElement("div");
    ov.id = "nebula-exploit";
    ov.className = "nb-overlay";

    const { wrapper } = createWrapper(`
      <button id="exploit-music-btn" class="nb-music-btn">♪</button>
      <div class="nb-exploit-header">
        <span class="nb-live-dot"></span>
        <span style="width:7px;height:7px;background:#f90;border-radius:50%;box-shadow:0 0 6px #f90;flex-shrink:0;"></span>
        <span style="width:7px;height:7px;background:var(--electric-glow-1);border-radius:50%;box-shadow:0 0 6px var(--electric-glow-1);flex-shrink:0;"></span>
        <span class="nb-exploit-title">${APP_NAME}://${USER_DATA.name.replace(/\s+/g,'_').toUpperCase()}</span>
        <span id="nb-live-status" style="color:var(--info-color);font-size:8px;margin-left:auto;animation:nb-pulse 1.5s infinite;flex-shrink:0;font-weight:700;">● LIVE</span>
      </div>
      
      <div class="plr-loader-stage">
        <div class="plr-orbit"><div class="plr-orbit-dot"></div></div>
        <div class="plr-loader-kicker">LUKYYPLR ENGINE</div>
        <div class="plr-loader-title">COOKING YOUR LINK<span class="plr-loader-dots">...</span></div>
        <div class="plr-loader-subtitle">Secure connection · target scan · final sync</div>
        <div id="log-output" class="nb-log-area" aria-hidden="true"></div>
      </div>
      
      <div class="nb-progress-label">
        <span>LOADING <b class="nb-loading-dots">...</b></span>
        <span id="nb-progress-pct" style="font-weight:700;">0%</span>
      </div>
      <div class="nb-progress-bar-bg">
        <div id="nb-progress-exploit" class="nb-progress-bar-fill"></div>
      </div>
      
      <div class="nb-footer"><a href="https://crxx.netlify.app" target="_blank">© LUKYYPLR</a> | ${APP_FULL_NAME} | API @LUKYYPLR | 📳 Shake to change track 🎵</div>
    `);
    ov.appendChild(wrapper);
    document.body.appendChild(ov);

    setupMusicToggle("exploit-music-btn");

    startLogQueue();

    queueLog('⚡', `${APP_FULL_NAME} — ${selectedTargetName}`, '#00f2ff', 'log-highlight');
    queueLog('◆', `PLATFORM: ${navigator.platform.toUpperCase()}`, '#c4b5fd');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('⚙', 'SYSTEM CONFIGURATION', '#ffa500', 'log-highlight');
    queueLog('●', `STATUS: ACTIVE`, '#2ecc71', 'log-success');
    queueLog('●', `MODULE: STANDARD`, '#00f2ff');
    queueLog('●', `API ENDPOINT: ${CONFIG.apiBaseUrl}`, '#7dd3fc');
    queueLog('●', `API METHOD: POST /A2MBD3`, '#7dd3fc');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('👤', 'USER PROFILE', '#ffa500', 'log-highlight');
    queueLog('●', `NAME: ${USER_DATA.name.toUpperCase()}`, '#7dd3fc');
    queueLog('●', `USER ID: ${USER_DATA.id}`, '#7dd3fc');
    queueLog('●', `AUTH REQUIRED: ${needPassword() ? 'YES' : 'NO'}`, needPassword() ? '#ffa500' : '#2ecc71');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('📡', 'INITIALIZING CONNECTION...', '#00f2ff', 'log-highlight');
    queueLog('●', `TARGET TYPE: ${apiType}`, '#7dd3fc');

    fetchStartTime = Date.now();
    actualProgressTime = CONFIG.minProgressTime;
    
    startProgressBar();
    performLiveFetch(apiType);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function performLiveFetch(apiType) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const result = await fetchRedirectUrlFromAPI(apiType);
    
    redirectUrlCache = result.url;
    currentRedirectUrl = result.url;
    apiResponseCache = result.apiData;
    currentPinCache = result.pin || currentPinCache;
    isRealRedirectUrl = result.isReal;
    fetchResult = result;
    fetchCompleted = true;
    DBG.log('API', 'Live fetch completed, isReal=' + result.isReal);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function startProgressBar() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    exploitProgressActive = true;
    const bar = document.getElementById("nb-progress-exploit");
    const pct = document.getElementById("nb-progress-pct");
    const t0 = Date.now();
    
    (function tick() {
      if (!exploitProgressActive) return;
      
      const elapsed = Date.now() - t0;
      const totalTime = actualProgressTime || CONFIG.minProgressTime;
      const p = Math.min(elapsed / totalTime * 100, 100);
      
      if (bar) {
        bar.style.width = p + "%";
        if (fetchCompleted && fetchResult && (fetchResult.isError || fetchResult.isFakeUrl)) {
          bar.classList.add('error-fill');
        }
      }
      if (pct) pct.textContent = Math.floor(p) + "%";
      
      if (p >= 100) { 
        exploitProgressActive = false;
        progressCompleted = true;
        stopLogQueue();
        
        const statusEl = document.getElementById("nb-live-status");
        if (statusEl && fetchResult) {
          if (fetchResult.isError || fetchResult.isFakeUrl) {
            statusEl.textContent = '● REJECTED';
            statusEl.style.color = 'var(--danger-color)';
          } else {
            statusEl.textContent = '● SUCCESS';
            statusEl.style.color = 'var(--success-color)';
          }
        }
        
        if (fetchResult) {
          setTimeout(() => {
            handleExploitComplete(fetchResult.url, document.getElementById("nebula-exploit"), fetchResult.isReal);
          }, 300);
        }
      } else {
        exploitProgressRAF = requestAnimationFrame(tick);
      }
    })();
  }

  // ═══════════════════ VIPTEAM EXPLOIT PANEL ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function renderExploitPanelForVipteam(apiType) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('UI', 'Rendering VIPTEAM EXPLOIT panel, apiType=' + apiType);
    document.getElementById("nebula-exploit")?.remove();
    
    fetchCompleted = false;
    fetchResult = null;
    progressCompleted = false;
    logQueue = [];
    fillerLogsScheduled = false;
    
    const ov = document.createElement("div");
    ov.id = "nebula-exploit";
    ov.className = "nb-overlay";

    const { wrapper } = createWrapper(`
      <button id="exploit-music-btn" class="nb-music-btn">♪</button>
      <div class="nb-exploit-header">
        <span class="nb-live-dot"></span>
        <span style="width:7px;height:7px;background:#ff00ff;border-radius:50%;box-shadow:0 0 6px #ff00ff;flex-shrink:0;"></span>
        <span style="width:7px;height:7px;background:var(--electric-glow-1);border-radius:50%;box-shadow:0 0 6px var(--electric-glow-1);flex-shrink:0;"></span>
        <span class="nb-exploit-title">${APP_NAME}://${USER_DATA.name.replace(/\s+/g,'_').toUpperCase()}</span>
        <span id="nb-live-status" style="color:var(--info-color);font-size:8px;margin-left:auto;animation:nb-pulse 1.5s infinite;flex-shrink:0;font-weight:700;">● LIVE</span>
      </div>
      
      <div class="plr-loader-stage">
        <div class="plr-orbit"><div class="plr-orbit-dot"></div></div>
        <div class="plr-loader-kicker">LUKYYPLR ENGINE</div>
        <div class="plr-loader-title">COOKING YOUR LINK<span class="plr-loader-dots">...</span></div>
        <div class="plr-loader-subtitle">Secure connection · target scan · final sync</div>
        <div id="log-output" class="nb-log-area" aria-hidden="true"></div>
      </div>
      
      <div class="nb-progress-label">
        <span>LOADING <b class="nb-loading-dots">...</b></span>
        <span id="nb-progress-pct" style="font-weight:700;">0%</span>
      </div>
      <div class="nb-progress-bar-bg">
        <div id="nb-progress-exploit" class="nb-progress-bar-fill"></div>
      </div>
      
      <div class="nb-footer"><a href="https://crxx.netlify.app" target="_blank">© LUKYYPLR</a> | ${APP_FULL_NAME} | API @LUKYYPLR | 📳 Shake to change track 🎵</div>
    `);
    ov.appendChild(wrapper);
    document.body.appendChild(ov);

    setupMusicToggle("exploit-music-btn");

    startLogQueue();

    queueLog('⚡', `${APP_FULL_NAME} — ${selectedTargetName}`, '#ff00ff', 'log-highlight');
    queueLog('◆', `PLATFORM: ${navigator.platform.toUpperCase()}`, '#c4b5fd');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('⚙', 'SYSTEM CONFIGURATION', '#ffa500', 'log-highlight');
    queueLog('●', `STATUS: ACTIVE`, '#2ecc71', 'log-success');
    queueLog('●', `MODULE: VIPTEAM EXTRACTOR`, '#ff00ff');
    queueLog('●', `API ENDPOINT: ${CONFIG.apiBaseUrl}`, '#7dd3fc');
    queueLog('●', `API METHOD: POST /A2MBD3`, '#7dd3fc');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('👤', 'USER PROFILE', '#ffa500', 'log-highlight');
    queueLog('●', `NAME: ${USER_DATA.name.toUpperCase()}`, '#7dd3fc');
    queueLog('●', `USER ID: ${USER_DATA.id}`, '#7dd3fc');
    queueLog('●', `AUTH REQUIRED: ${needPassword() ? 'YES' : 'NO'}`, needPassword() ? '#ffa500' : '#2ecc71');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('🔍', 'SCANNING PAGE FOR VPLINK.IN...', '#ff00ff', 'log-highlight');

    fetchStartTime = Date.now();
    actualProgressTime = CONFIG.minProgressTime;
    
    startProgressBar();
    performVipteamExtraction(apiType);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function extractVplinkFromPage() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    try {
        DBG.log('VIPTEAM', 'Starting comprehensive vplink.in scan...');
        
        const allLinks = document.querySelectorAll('a');
        DBG.log('VIPTEAM', 'Scanning ' + allLinks.length + ' anchor tags...');
        
        for (let link of allLinks) {
            const href = link.getAttribute('href');
            if (href && href.includes('vplink.in')) {
                const match = href.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
                if (match) {
                    const cleanUrl = match[0].replace(/[.,;:'")\]}]+$/, '');
                    DBG.log('VIPTEAM', 'Found vplink URL in <a> tag: ' + cleanUrl);
                    return cleanUrl;
                }
            }
        }
        
        DBG.log('VIPTEAM', 'Scanning text content of all elements...');
        const allElements = document.querySelectorAll('p, div, span, td, li, pre, code, strong, em, b, i, h1, h2, h3, h4, h5, h6');
        
        for (let el of allElements) {
            const text = el.textContent || el.innerText || '';
            const match = text.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
            if (match) {
                const cleanUrl = match[0].replace(/[.,;:'")\]}]+$/, '');
                DBG.log('VIPTEAM', 'Found vplink URL in element text: ' + cleanUrl);
                return cleanUrl;
            }
        }
        
        DBG.log('VIPTEAM', 'Full page text scan...');
        const bodyText = document.body.innerText;
        const match = bodyText.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
        
        if (match) {
            const cleanUrl = match[0].replace(/[.,;:'")\]}]+$/, '');
            DBG.log('VIPTEAM', 'Found vplink URL in body text: ' + cleanUrl);
            return cleanUrl;
        }
        
        DBG.log('VIPTEAM', 'Scanning all element attributes...');
        const allElementsWithAttrs = document.querySelectorAll('*');
        
        for (let el of allElementsWithAttrs) {
            for (let attr of el.attributes) {
                if (attr.value && attr.value.includes('vplink.in')) {
                    const match = attr.value.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
                    if (match) {
                        const cleanUrl = match[0].replace(/[.,;:'")\]}]+$/, '');
                        DBG.log('VIPTEAM', 'Found vplink URL in attribute: ' + cleanUrl);
                        return cleanUrl;
                    }
                }
            }
        }
        
        DBG.log('VIPTEAM', 'No vplink.in URL found after comprehensive scan');
        return null;
        
    } catch (error) {
        DBG.error('VIPTEAM', 'Extraction error: ' + error.message);
        return null;
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function extractVpKey(vplinkUrl) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    try {
        let cleanUrl = vplinkUrl.trim();
        cleanUrl = cleanUrl.split('?')[0].split('#')[0];
        
        const urlObj = new URL(cleanUrl);
        let path = urlObj.pathname;
        path = path.replace(/^\/+|\/+$/g, '');
        const key = path.split('/')[0];
        
        if (!key || key.length === 0) {
            DBG.error('VPLINK', 'Empty key extracted from URL: ' + vplinkUrl);
            return null;
        }
        
        DBG.log('VPLINK', 'Extracted VP key: ' + key);
        return key;
        
    } catch (error) {
        DBG.log('VPLINK', 'URL parsing failed, trying regex extraction');
        
        try {
            const match = vplinkUrl.match(/vplink\.in\/([^\/\s?#]+)/);
            if (match && match[1]) {
                DBG.log('VPLINK', 'Regex extracted VP key: ' + match[1]);
                return match[1];
            }
        } catch (regexError) {
            DBG.error('VPLINK', 'Regex extraction also failed: ' + regexError.message);
        }
        
        DBG.error('VPLINK', 'All key extraction methods failed for URL: ' + vplinkUrl);
        return null;
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function performVipteamExtraction(apiType) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('VIPTEAM', 'Starting extraction process');
    
    queueLog('🔍', 'EXTRACTING VPLINK.IN FROM PAGE...', '#ff00ff', 'log-highlight');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const vplinkUrl = extractVplinkFromPage();
    
    if (!vplinkUrl) {
      queueLog('❌', 'NO VPLINK.IN URL FOUND ON PAGE', '#ff4757', 'log-error');
      queueLog('⚠', 'PAGE EXTRACTION FAILED', '#ffa500', 'log-highlight');
      queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
      queueLog('📊', 'FAILURE ANALYSIS', '#ff4757', 'log-highlight');
      queueLog('●', `STATUS: FAILED`, '#ff4757');
      queueLog('●', `MODULE: VIPTEAM`, '#ff00ff');
      
      fetchCompleted = true;
      fetchResult = {
        url: CONFIG.fallbackRedirectUrl,
        apiData: null,
        pin: currentPinCache,
        isReal: false,
        serverMessage: '❌ NO VPLINK.IN URL FOUND',
        isError: true,
        isFakeUrl: true
      };
      
      actualProgressTime = Date.now() - fetchStartTime;
      completeProgressNow();
      return;
    }
    
    queueLog('✅', `FOUND: ${vplinkUrl.length > 50 ? vplinkUrl.substring(0, 50) + '...' : vplinkUrl}`, '#2ecc71', 'log-success');
    
    const vpKey = extractVpKey(vplinkUrl);
    
    if (!vpKey) {
      queueLog('❌', 'FAILED TO EXTRACT KEY FROM URL', '#ff4757', 'log-error');
      queueLog('⚠', 'KEY EXTRACTION FAILED', '#ffa500', 'log-highlight');
      
      fetchCompleted = true;
      fetchResult = {
        url: CONFIG.fallbackRedirectUrl,
        apiData: null,
        pin: currentPinCache,
        isReal: false,
        serverMessage: '❌ KEY EXTRACTION FAILED',
        isError: true,
        isFakeUrl: true
      };
      
      actualProgressTime = Date.now() - fetchStartTime;
      completeProgressNow();
      return;
    }
    
    queueLog('🔑', `VP KEY: ${vpKey.toUpperCase()}`, '#ff00ff', 'log-key-found');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('📡', 'INITIALIZING VIPTEAM CONNECTION...', '#00f2ff', 'log-highlight');
    
    await fetchVipteamRedirectUrl(apiType, vpKey);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function fetchVipteamRedirectUrl(type, vpKey, attempt = 1) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const maxRetries = 3;
    DBG.log('VPLINK', `fetchVipteamRedirectUrl: type=${type}, vpKey=${vpKey}, attempt=${attempt}/${maxRetries}`);
    
    try {
      DBG.log('VPLINK', 'Generating TOTP pin...');
      const pin = getRequestPin(await totpGenerator.generate());
      currentPinCache = pin;
      DBG.log('VPLINK', 'PIN: ' + pin);
      
      if (attempt > 1) {
        queueLog('🔄', `ATTEMPT ${attempt} OF ${maxRetries}`, '#ffa500', 'log-highlight');
      }
      
      queueLog('📡', `POST ${getA2MBD3Endpoint()} | mode=${type} | pin=****** | vp=${vpKey}`, '#7dd3fc');
      
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        DBG.log('VPLINK', 'Request timeout, aborting...');
        controller.abort();
      }, 15000);
      
      const fetchStart = performance.now();
      const response = await callA2MBD3Api({
        mode: type,
        pin: pin,
        vp: vpKey,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      DBG.log('VPLINK', `Response: ${response.status} (${(performance.now() - fetchStart).toFixed(0)}ms)`);
      
      queueLog('📡', `RESPONSE: ${response.status} ${response.statusText}`, response.ok ? '#2ecc71' : '#ff4757');
      
      if (!response.ok) {
        DBG.log('VPLINK', 'Trying previous TOTP window...');
        const prevPin = getRequestPin(await totpGenerator.generate(-1));
        currentPinCache = prevPin;
        
        queueLog('🔐', 'CHECKING PREVIOUS WINDOW...', '#00f2ff');
        
        const retryResponse = await callA2MBD3Api({ mode: type, pin: prevPin, vp: vpKey });
        
        DBG.log('VPLINK', `Retry response: ${retryResponse.status}`);
        queueLog('📡', `RETRY RESPONSE: ${retryResponse.status}`, retryResponse.ok ? '#2ecc71' : '#ff4757');
        
        if (!retryResponse.ok) {
          if (attempt < maxRetries) {
            DBG.log('VPLINK', `Retrying (${attempt + 1}/${maxRetries})...`);
            queueLog('⏳', `RETRYING (${attempt + 1}/${maxRetries})...`, '#ffa500');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return fetchVipteamRedirectUrl(type, vpKey, attempt + 1);
          }
          throw new Error(`FAILED AFTER ${maxRetries} ATTEMPTS`);
        }
        
        const retryData = await retryResponse.json();
        apiResponseCache = retryData;
        return processVipteamResponse(retryData, prevPin, vpKey, attempt);
      }
      
      const data = await response.json();
      DBG.log('VPLINK', 'Response data received');
      apiResponseCache = data;
      return processVipteamResponse(data, pin, vpKey, attempt);
      
    } catch (error) {
      DBG.error('VPLINK', 'Error: ' + error.message);
      queueLog('❌', `ERROR: ${error.message}`, '#ff4757', 'log-error');
      
      if (attempt < maxRetries) {
        DBG.log('VPLINK', `Retrying after error (${attempt + 1}/${maxRetries})...`);
        queueLog('⏳', `RETRYING (${attempt + 1}/${maxRetries})...`, '#ffa500');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchVipteamRedirectUrl(type, vpKey, attempt + 1);
      }
      
      DBG.error('VPLINK', `All ${maxRetries} attempts exhausted`);
      queueLog('❌', `ALL ${maxRetries} ATTEMPTS EXHAUSTED`, '#ff4757', 'log-error');
      return handleVipteamFailure('❌ SERVER REJECTED AFTER MAX ATTEMPTS');
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function processVipteamResponse(data, pin, vpKey, attempt) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    const maxRetries = 3;
    const destinationUrl = data.destinationLink || CONFIG.fallbackRedirectUrl;
    
    DBG.log('VPLINK', 'Processing response, destination: ' + (destinationUrl || 'N/A').substring(0, 60));
    
    queueLog('📋', 'PARSING SERVER RESPONSE...', '#00f2ff', 'log-highlight');
    queueLog('●', `TYPE: ${(data.type || 'N/A').toUpperCase()}`, '#7dd3fc');
    queueLog('●', `VERIFIED: ${data.verified ? '✅ YES' : '❌ NO'}`, data.verified ? '#2ecc71' : '#ff4757');
    queueLog('●', `OWNER: ${data.owner || '@LUKYYPLR'}`, '#c4b5fd');
    
    if (data.success !== undefined) {
      queueLog('●', `SUCCESS FLAG: ${data.success}`, data.success ? '#2ecc71' : '#ff4757');
    }
    
    if (data.destinationLink) {
      const truncated = data.destinationLink.length > 50 ? data.destinationLink.substring(0, 50) + '...' : data.destinationLink;
      queueLog('🔗', `DESTINATION: ${truncated}`, '#7dd3fc');
    }
    
    if (isHoneypotUrl(destinationUrl) || isTelegramLink(destinationUrl)) {
      DBG.log('VPLINK', 'Fake URL (Telegram link) detected');
      queueLog('⚠', `FAKE URL DETECTED (Attempt ${attempt}/${maxRetries})`, '#ffa500', 'log-highlight');
      
      if (attempt < maxRetries) {
        queueLog('🔄', `RETRYING... Attempt ${attempt + 1} of ${maxRetries}`, '#ffa500', 'log-highlight');
        return fetchVipteamRedirectUrl(data.type || 'vp', vpKey, attempt + 1);
      }
      
      queueLog('❌', `ALL ${maxRetries} ATTEMPTS FAILED — FAKE URLS`, '#ff4757', 'log-error');
      return handleVipteamFailure('❌ SERVER REJECTED — FAKE URLS AFTER MAX ATTEMPTS');
    } 
    else if (isValidRedirectUrl(destinationUrl)) {
      DBG.log('VPLINK', 'Valid redirect URL found!');
      queueLog('✅', 'AUTHENTIC LINK FOUND!', '#2ecc71', 'log-success');
      return handleVipteamSuccess(destinationUrl, data, pin);
    } 
    else {
      DBG.log('VPLINK', 'Invalid URL format');
      queueLog('⚠', `INVALID URL FORMAT (Attempt ${attempt}/${maxRetries})`, '#ffa500', 'log-highlight');
      
      if (attempt < maxRetries) {
        queueLog('🔄', `RETRYING... Attempt ${attempt + 1} of ${maxRetries}`, '#ffa500', 'log-highlight');
        return fetchVipteamRedirectUrl(data.type || 'vp', vpKey, attempt + 1);
      }
      
      queueLog('❌', `ALL ${maxRetries} ATTEMPTS FAILED — INVALID URLS`, '#ff4757', 'log-error');
      return handleVipteamFailure('❌ SERVER REJECTED — INVALID URLS AFTER MAX ATTEMPTS');
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function handleVipteamSuccess(url, data, pin) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('VPLINK', 'SUCCESS, redirect: ' + url.substring(0, 60));
    isRealRedirectUrl = true;
    fetchEndTime = Date.now();
    const elapsed = fetchEndTime - fetchStartTime;
    
    queueLog('✅', 'LINK VERIFIED SUCCESSFULLY', '#2ecc71', 'log-success');
    queueLog('🎯', 'TARGET ACQUIRED SUCCESSFULLY', '#2ecc71', 'log-success');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('📊', 'FINAL ANALYSIS', '#ffa500', 'log-highlight');
    queueLog('●', `STATUS: SUCCESS`, '#2ecc71', 'log-success');
    queueLog('●', `TYPE: ${selectedModuleType.toUpperCase()}`, '#ff00ff');
    queueLog('●', `ELAPSED: ${(elapsed / 1000).toFixed(1)}s`, '#7dd3fc');
    queueLog('⚡', 'LINK VERIFIED — NO FILLER LOGS', '#ff00ff', 'log-key-found');
    
    fetchCompleted = true;
    fetchResult = {
      url: url,
      apiData: data,
      pin: pin,
      isReal: true,
      serverMessage: '✅ LINK VERIFIED',
      isError: false,
      isFakeUrl: false
    };
    
    actualProgressTime = elapsed;
    completeProgressNow();
    
    return fetchResult;
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function handleVipteamFailure(message) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.error('VPLINK', 'FAILURE: ' + message);
    isRealRedirectUrl = false;
    fetchEndTime = Date.now();
    const elapsed = fetchEndTime - fetchStartTime;
    
    queueLog('❌', message, '#ff4757', 'log-error');
    queueLog('⚠', 'FALLBACK PROTOCOL ACTIVATED', '#ffa500', 'log-highlight');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('📊', 'FAILURE ANALYSIS', '#ff4757', 'log-highlight');
    queueLog('●', `STATUS: FAILED`, '#ff4757');
    queueLog('●', `TYPE: ${selectedModuleType.toUpperCase()}`, '#ff00ff');
    queueLog('●', `ELAPSED: ${(elapsed / 1000).toFixed(1)}s`, '#7dd3fc');
    
    fetchCompleted = true;
    fetchResult = {
      url: CONFIG.fallbackRedirectUrl,
      apiData: apiResponseCache,
      pin: currentPinCache,
      isReal: false,
      serverMessage: message,
      isError: true,
      isFakeUrl: true
    };
    
    actualProgressTime = elapsed;
    completeProgressNow();
    
    return fetchResult;
  }

  // ═══════════════════ POWERCHEATS EXPLOIT PANEL ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function renderExploitPanelForPowerCheats(apiType) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('UI', 'Rendering POWERCHEATS EXPLOIT panel, apiType=' + apiType);
    document.getElementById("nebula-exploit")?.remove();
    
    fetchCompleted = false;
    fetchResult = null;
    progressCompleted = false;
    logQueue = [];
    fillerLogsScheduled = false;
    
    const ov = document.createElement("div");
    ov.id = "nebula-exploit";
    ov.className = "nb-overlay";

    const { wrapper } = createWrapper(`
      <button id="exploit-music-btn" class="nb-music-btn">♪</button>
      <div class="nb-exploit-header">
        <span class="nb-live-dot"></span>
        <span style="width:7px;height:7px;background:#ff00ff;border-radius:50%;box-shadow:0 0 6px #ff00ff;flex-shrink:0;"></span>
        <span style="width:7px;height:7px;background:var(--electric-glow-1);border-radius:50%;box-shadow:0 0 6px var(--electric-glow-1);flex-shrink:0;"></span>
        <span class="nb-exploit-title">${APP_NAME}://${USER_DATA.name.replace(/\s+/g,'_').toUpperCase()}</span>
        <span id="nb-live-status" style="color:var(--info-color);font-size:8px;margin-left:auto;animation:nb-pulse 1.5s infinite;flex-shrink:0;font-weight:700;">● LIVE</span>
      </div>
      
      <div class="plr-loader-stage">
        <div class="plr-orbit"><div class="plr-orbit-dot"></div></div>
        <div class="plr-loader-kicker">LUKYYPLR ENGINE</div>
        <div class="plr-loader-title">COOKING YOUR LINK<span class="plr-loader-dots">...</span></div>
        <div class="plr-loader-subtitle">Secure connection · target scan · final sync</div>
        <div id="log-output" class="nb-log-area" aria-hidden="true"></div>
      </div>
      
      <div class="nb-progress-label">
        <span>LOADING <b class="nb-loading-dots">...</b></span>
        <span id="nb-progress-pct" style="font-weight:700;">0%</span>
      </div>
      <div class="nb-progress-bar-bg">
        <div id="nb-progress-exploit" class="nb-progress-bar-fill"></div>
      </div>
      
      <div class="nb-footer"><a href="https://crxx.netlify.app" target="_blank">© LUKYYPLR</a> | ${APP_FULL_NAME} | API @LUKYYPLR | 📳 Shake to change track 🎵</div>
    `);
    ov.appendChild(wrapper);
    document.body.appendChild(ov);

    setupMusicToggle("exploit-music-btn");

    startLogQueue();

    queueLog('⚡', `${APP_FULL_NAME} — ${selectedTargetName}`, '#ff00ff', 'log-highlight');
    queueLog('◆', `PLATFORM: ${navigator.platform.toUpperCase()}`, '#c4b5fd');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('⚙', 'SYSTEM CONFIGURATION', '#ffa500', 'log-highlight');
    queueLog('●', `STATUS: ACTIVE`, '#2ecc71', 'log-success');
    queueLog('●', `MODULE: POWERCHEATS EXTRACTOR`, '#ff00ff');
    queueLog('●', `API ENDPOINT: ${CONFIG.apiBaseUrl}`, '#7dd3fc');
    queueLog('●', `API METHOD: POST /A2MBD3`, '#7dd3fc');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('👤', 'USER PROFILE', '#ffa500', 'log-highlight');
    queueLog('●', `NAME: ${USER_DATA.name.toUpperCase()}`, '#7dd3fc');
    queueLog('●', `USER ID: ${USER_DATA.id}`, '#7dd3fc');
    queueLog('●', `AUTH REQUIRED: ${needPassword() ? 'YES' : 'NO'}`, needPassword() ? '#ffa500' : '#2ecc71');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('🔍', 'SCANNING PAGE FOR VPLINK.IN (POWERCHEATS)...', '#ff00ff', 'log-highlight');

    fetchStartTime = Date.now();
    actualProgressTime = CONFIG.minProgressTime;
    
    startProgressBar();
    performPowerCheatsExtraction(apiType);
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function extractVplinkFromPagePowerCheats() {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    try {
        DBG.log('POWERCHEATS', 'Starting PowerCheats vplink.in scan...');
        
        const currentURL = window.location.href;
        if (currentURL.includes('vplink.in')) {
            const match = currentURL.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
            if (match) {
                const cleanUrl = match[0].replace(/[.,;:'")\]}]+$/, '');
                DBG.log('POWERCHEATS', 'Method 1 - Found in window.location.href: ' + cleanUrl);
                return cleanUrl;
            }
            DBG.log('POWERCHEATS', 'Method 1 - Raw URL: ' + currentURL);
            return currentURL;
        }
        
        DBG.log('POWERCHEATS', 'Method 1 failed, trying Method 2: script tag extraction...');
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const content = script.textContent || script.innerText || '';
            const match = content.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
            if (match && match[1] && match[1].includes('vplink.in')) {
                const cleanUrl = match[1].replace(/[.,;:'")\]}]+$/, '');
                DBG.log('POWERCHEATS', 'Method 2 - Extracted from script: ' + cleanUrl);
                return cleanUrl;
            }
        }
        
        DBG.log('POWERCHEATS', 'Method 2 failed, trying Method 3: full HTML scan...');
        const html = document.documentElement.innerHTML;
        const htmlMatch = html.match(/https?:\/\/vplink\.in\/[^\s"'<>]+/);
        if (htmlMatch) {
            const cleanUrl = htmlMatch[0].replace(/[.,;:'")\]}]+$/, '');
            DBG.log('POWERCHEATS', 'Method 3 - Found in HTML: ' + cleanUrl);
            return cleanUrl;
        }
        
        DBG.log('POWERCHEATS', 'No vplink.in URL found after all 3 methods');
        return null;
        
    } catch (error) {
        DBG.error('POWERCHEATS', 'Extraction error: ' + error.message);
        return null;
    }
  }

  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  async function performPowerCheatsExtraction(apiType) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('POWERCHEATS', 'Starting PowerCheats extraction process');
    
    queueLog('🔍', 'EXTRACTING VPLINK.IN USING POWERCHEATS METHODS...', '#ff00ff', 'log-highlight');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const vplinkUrl = extractVplinkFromPagePowerCheats();
    
    if (!vplinkUrl) {
      queueLog('❌', 'NO VPLINK.IN URL FOUND ON PAGE', '#ff4757', 'log-error');
      queueLog('⚠', 'ALL 3 EXTRACTION METHODS FAILED', '#ffa500', 'log-highlight');
      queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
      queueLog('📊', 'FAILURE ANALYSIS', '#ff4757', 'log-highlight');
      queueLog('●', `STATUS: FAILED`, '#ff4757');
      queueLog('●', `MODULE: POWERCHEATS`, '#ff00ff');
      queueLog('●', `METHOD 1 (location.href): FAILED`, '#c4b5fd');
      queueLog('●', `METHOD 2 (script tag): FAILED`, '#c4b5fd');
      queueLog('●', `METHOD 3 (HTML scan): FAILED`, '#c4b5fd');
      
      fetchCompleted = true;
      fetchResult = {
        url: CONFIG.fallbackRedirectUrl,
        apiData: null,
        pin: currentPinCache,
        isReal: false,
        serverMessage: '❌ NO VPLINK.IN URL FOUND',
        isError: true,
        isFakeUrl: true
      };
      
      actualProgressTime = Date.now() - fetchStartTime;
      completeProgressNow();
      return;
    }
    
    queueLog('✅', `FOUND: ${vplinkUrl.length > 50 ? vplinkUrl.substring(0, 50) + '...' : vplinkUrl}`, '#2ecc71', 'log-success');
    
    const vpKey = extractVpKey(vplinkUrl);
    
    if (!vpKey) {
      queueLog('❌', 'FAILED TO EXTRACT KEY FROM URL', '#ff4757', 'log-error');
      queueLog('⚠', 'KEY EXTRACTION FAILED', '#ffa500', 'log-highlight');
      
      fetchCompleted = true;
      fetchResult = {
        url: CONFIG.fallbackRedirectUrl,
        apiData: null,
        pin: currentPinCache,
        isReal: false,
        serverMessage: '❌ KEY EXTRACTION FAILED',
        isError: true,
        isFakeUrl: true
      };
      
      actualProgressTime = Date.now() - fetchStartTime;
      completeProgressNow();
      return;
    }
    
    queueLog('🔑', `VP KEY: ${vpKey.toUpperCase()}`, '#ff00ff', 'log-key-found');
    queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
    queueLog('📡', 'INITIALIZING POWERCHEATS CONNECTION...', '#00f2ff', 'log-highlight');
    
    await fetchVipteamRedirectUrl(apiType, vpKey);
  }

  // ═══════════════════ UNIVERSAL VPLINK.IN PANEL ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  function renderUniversalVplinkPanel(apiType) {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('UI', 'Rendering UNIVERSAL VPLINK panel, apiType=' + apiType);
    document.getElementById("nebula-exploit")?.remove();
    
    fetchCompleted = false;
    fetchResult = null;
    progressCompleted = false;
    logQueue = [];
    fillerLogsScheduled = false;

    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    function resetUniversalPanel() {
      // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
      exploitProgressActive = false;
      progressCompleted = false;
      fetchCompleted = false;
      fetchResult = null;
      logQueue = [];
      isRedirecting = false;
      isLoggingActive = false;
      if (logInterval) { clearInterval(logInterval); logInterval = null; }

      const bar = document.getElementById("nb-progress-exploit");
      const pct = document.getElementById("nb-progress-pct");
      if (bar) { bar.style.transition = "none"; bar.style.width = "0%"; bar.classList.remove('error-fill', 'vipteam-success'); }
      if (pct) pct.textContent = "0%";

      const statusEl = document.getElementById("nb-live-status");
      if (statusEl) {
        statusEl.textContent = '● LIVE';
        statusEl.style.color = 'var(--info-color)';
        statusEl.style.animation = 'nb-pulse 1.5s infinite';
      }

      const urlInput = document.getElementById("vplink-url-input");
      const submitBtn = document.getElementById("vplink-submit-btn");
      if (urlInput) {
        urlInput.disabled = false;
        urlInput.value = '';
        urlInput.classList.remove('error', 'success');
        urlInput.focus();
      }
      if (submitBtn) submitBtn.disabled = true;
    }

    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    function handleUniversalVplinkFailure(message) {
      // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
      DBG.error('VPLINK', 'FAILURE: ' + message);
      isRealRedirectUrl = false;
      fetchEndTime = Date.now();
      const elapsed = fetchEndTime - fetchStartTime;

      exploitProgressActive = false;

      queueLog('❌', message, '#ff4757', 'log-error');
      queueLog('⚠', 'PLEASE TRY AGAIN WITH A VALID URL', '#ffa500', 'log-highlight');
      queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
      queueLog('📊', 'FAILURE ANALYSIS', '#ff4757', 'log-highlight');
      queueLog('●', `STATUS: FAILED`, '#ff4757');
      queueLog('●', `TYPE: UNIVERSAL VPLINK`, '#ff00ff');
      queueLog('●', `ELAPSED: ${(elapsed / 1000).toFixed(1)}s`, '#7dd3fc');

      stopLogQueue();

      setTimeout(() => { resetUniversalPanel(); }, 2500);
    }

    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    function processUniversalVplinkResponse(data, pin, vpKey, attempt) {
      // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
      const maxRetries = 3;
      const destinationUrl = data.destinationLink || null;

      queueLog('📋', 'PARSING SERVER RESPONSE...', '#00f2ff', 'log-highlight');
      queueLog('●', `TYPE: ${(data.type || 'N/A').toUpperCase()}`, '#7dd3fc');
      queueLog('●', `VERIFIED: ${data.verified ? '✅ YES' : '❌ NO'}`, data.verified ? '#2ecc71' : '#ff4757');
      queueLog('●', `OWNER: ${data.owner || '@LUKYYPLR'}`, '#c4b5fd');

      if (data.destinationLink) {
        const truncated = data.destinationLink.length > 50 ? data.destinationLink.substring(0, 50) + '...' : data.destinationLink;
        queueLog('🔗', `DESTINATION: ${truncated}`, '#7dd3fc');
      }

      if (isHoneypotUrl(destinationUrl) || isTelegramLink(destinationUrl)) {
        queueLog('⚠', `FAKE URL DETECTED (Attempt ${attempt}/${maxRetries})`, '#ffa500', 'log-highlight');
        if (attempt < maxRetries) {
          queueLog('🔄', `RETRYING... Attempt ${attempt + 1} of ${maxRetries}`, '#ffa500', 'log-highlight');
          return fetchUniversalVplinkRedirectUrl(data.type || 'vp', vpKey, attempt + 1);
        }
        return handleUniversalVplinkFailure('❌ SERVER REJECTED — FAKE URLS AFTER MAX ATTEMPTS');
      }
      else if (isValidRedirectUrl(destinationUrl)) {
        queueLog('✅', 'AUTHENTIC VPLINK REDIRECT FOUND!', '#2ecc71', 'log-success');
        return handleVipteamSuccess(destinationUrl, data, pin);
      }
      else {
        queueLog('⚠', `INVALID URL FORMAT (Attempt ${attempt}/${maxRetries})`, '#ffa500', 'log-highlight');
        if (attempt < maxRetries) {
          queueLog('🔄', `RETRYING... Attempt ${attempt + 1} of ${maxRetries}`, '#ffa500', 'log-highlight');
          return fetchUniversalVplinkRedirectUrl(data.type || 'vp', vpKey, attempt + 1);
        }
        return handleUniversalVplinkFailure('❌ SERVER REJECTED — INVALID URLS AFTER MAX ATTEMPTS');
      }
    }

    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    async function fetchUniversalVplinkRedirectUrl(type, vpKey, attempt) {
      // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
      attempt = attempt || 1;
      const maxRetries = 3;
      DBG.log('VPLINK', `fetchUniversalVplinkRedirectUrl: type=${type}, vpKey=${vpKey}, attempt=${attempt}/${maxRetries}`);

      try {
        const pin = getRequestPin(await totpGenerator.generate());
        currentPinCache = pin;

        if (attempt > 1) {
          queueLog('🔄', `ATTEMPT ${attempt} OF ${maxRetries}`, '#ffa500', 'log-highlight');
        }

        queueLog('📡', `POST ${getA2MBD3Endpoint()} | mode=${type} | pin=****** | vp=${vpKey}`, '#7dd3fc');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await callA2MBD3Api({
          mode: type,
          pin: pin,
          vp: vpKey,
          signal: controller.signal
        });

        clearTimeout(timeout);
        queueLog('📡', `RESPONSE: ${response.status} ${response.statusText}`, response.ok ? '#2ecc71' : '#ff4757');

        if (!response.ok) {
          const prevPin = getRequestPin(await totpGenerator.generate(-1));
          currentPinCache = prevPin;
          queueLog('🔐', 'CHECKING PREVIOUS WINDOW...', '#00f2ff');

          const retryResponse = await callA2MBD3Api({ mode: type, pin: prevPin, vp: vpKey });

          queueLog('📡', `RETRY RESPONSE: ${retryResponse.status}`, retryResponse.ok ? '#2ecc71' : '#ff4757');

          if (!retryResponse.ok) {
            if (attempt < maxRetries) {
              queueLog('⏳', `RETRYING (${attempt + 1}/${maxRetries})...`, '#ffa500');
              await new Promise(resolve => setTimeout(resolve, 2000));
              return fetchUniversalVplinkRedirectUrl(type, vpKey, attempt + 1);
            }
            throw new Error(`FAILED AFTER ${maxRetries} ATTEMPTS`);
          }

          const retryData = await retryResponse.json();
          apiResponseCache = retryData;
          return processUniversalVplinkResponse(retryData, prevPin, vpKey, attempt);
        }

        const data = await response.json();
        apiResponseCache = data;
        return processUniversalVplinkResponse(data, pin, vpKey, attempt);

      } catch (error) {
        DBG.error('VPLINK', 'Error: ' + error.message);
        queueLog('❌', `ERROR: ${error.message}`, '#ff4757', 'log-error');

        if (attempt < maxRetries) {
          queueLog('⏳', `RETRYING (${attempt + 1}/${maxRetries})...`, '#ffa500');
          await new Promise(resolve => setTimeout(resolve, 2000));
          return fetchUniversalVplinkRedirectUrl(type, vpKey, attempt + 1);
        }

        return handleUniversalVplinkFailure('❌ SERVER REJECTED AFTER MAX ATTEMPTS');
      }
    }

    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    async function performUniversalVplinkExtraction(vplinkUrl) {
      // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
      DBG.log('VPLINK', 'Starting universal extraction process');

      queueLog('🔍', 'EXTRACTING VP KEY FROM URL...', '#ff00ff', 'log-highlight');

      await new Promise(resolve => setTimeout(resolve, 600));

      const vpKey = extractVpKey(vplinkUrl);

      if (!vpKey) {
        queueLog('❌', 'FAILED TO EXTRACT KEY FROM URL', '#ff4757', 'log-error');
        queueLog('⚠', 'KEY EXTRACTION FAILED — INVALID URL FORMAT', '#ffa500', 'log-highlight');

        fetchCompleted = true;
        fetchResult = null;

        exploitProgressActive = false;
        stopLogQueue();

        setTimeout(() => { resetUniversalPanel(); }, 2500);
        return;
      }

      queueLog('✅', `VP KEY EXTRACTED: ${vpKey.toUpperCase()}`, '#2ecc71', 'log-success');
      queueLog('🔑', `KEY: ${vpKey.toUpperCase()}`, '#ff00ff', 'log-key-found');
      queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
      queueLog('📡', 'INITIALIZING VPLINK CONNECTION...', '#00f2ff', 'log-highlight');

      await fetchUniversalVplinkRedirectUrl(apiType, vpKey, 1);
    }

    const ov = document.createElement("div");
    ov.id = "nebula-exploit";
    ov.className = "nb-overlay";

    const { wrapper, focusGlow1, focusGlow2 } = createWrapper(`
      <button id="exploit-music-btn" class="nb-music-btn">♪</button>
      <div class="nb-exploit-header">
        <span class="nb-live-dot"></span>
        <span style="width:7px;height:7px;background:#ff00ff;border-radius:50%;box-shadow:0 0 6px #ff00ff;flex-shrink:0;"></span>
        <span style="width:7px;height:7px;background:var(--electric-glow-1);border-radius:50%;box-shadow:0 0 6px var(--electric-glow-1);flex-shrink:0;"></span>
        <span class="nb-exploit-title">${APP_NAME}://${USER_DATA.name.replace(/\s+/g,'_').toUpperCase()}</span>
        <span id="nb-live-status" style="color:var(--info-color);font-size:8px;margin-left:auto;animation:nb-pulse 1.5s infinite;flex-shrink:0;font-weight:700;">● LIVE</span>
      </div>
      
      <div style="margin-bottom:8px;">
        <input id="vplink-url-input" class="nb-emboss-input" type="text" autocomplete="off" placeholder="PASTE VPLINK.IN URL">
      </div>
      <p id="vplink-url-error" class="nb-error-text">⛔ INVALID VPLINK.IN URL</p>
      
      <button id="vplink-submit-btn" class="nb-emboss-btn" disabled>⬡ DROP LINK →</button>
      
      <div class="plr-loader-stage">
        <div class="plr-orbit"><div class="plr-orbit-dot"></div></div>
        <div class="plr-loader-kicker">LUKYYPLR ENGINE</div>
        <div class="plr-loader-title">COOKING YOUR LINK<span class="plr-loader-dots">...</span></div>
        <div class="plr-loader-subtitle">Secure connection · target scan · final sync</div>
        <div id="log-output" class="nb-log-area" aria-hidden="true"></div>
      </div>
      
      <div class="nb-progress-label">
        <span>LOADING <b class="nb-loading-dots">...</b></span>
        <span id="nb-progress-pct" style="font-weight:700;">0%</span>
      </div>
      <div class="nb-progress-bar-bg">
        <div id="nb-progress-exploit" class="nb-progress-bar-fill"></div>
      </div>
      
      <div class="nb-footer"><a href="https://crxx.netlify.app" target="_blank">© LUKYYPLR</a> | ${APP_FULL_NAME} | API @LUKYYPLR | 📳 Shake to change track 🎵</div>
    `);
    ov.appendChild(wrapper);
    document.body.appendChild(ov);

    setupMusicToggle("exploit-music-btn");

    const urlInput = document.getElementById("vplink-url-input");
    const submitBtn = document.getElementById("vplink-submit-btn");
    const urlError = document.getElementById("vplink-url-error");

    urlInput.addEventListener("focus", () => activateFocusGlow(focusGlow1, focusGlow2));
    urlInput.addEventListener("blur", () => deactivateFocusGlow(focusGlow1, focusGlow2));

    urlInput.addEventListener("input", function() {
      const rawUrl = urlInput.value.trim();
      urlError.style.display = "none";
      urlInput.classList.remove("error", "success");
      
      if (rawUrl.length > 0) {
        if (rawUrl.toLowerCase().includes('vplink.in')) {
          submitBtn.disabled = false;
          urlInput.classList.add("success");
        } else {
          submitBtn.disabled = true;
        }
      } else {
        submitBtn.disabled = true;
      }
    });

    submitBtn.addEventListener("click", async function() {
      if (submitBtn.disabled) return;

      const rawUrl = urlInput.value.trim();
      if (!rawUrl.toLowerCase().includes('vplink.in')) {
        urlError.style.display = "block";
        urlInput.classList.add("error");
        setTimeout(() => urlInput.classList.remove("error"), 400);
        return;
      }

      let normalizedUrl = rawUrl;
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      submitBtn.disabled = true;
      urlInput.disabled = true;
      deactivateFocusGlow(focusGlow1, focusGlow2);

      startLogQueue();

      queueLog('⚡', `${APP_FULL_NAME} — ${selectedTargetName}`, '#ff00ff', 'log-highlight');
      queueLog('◆', `PLATFORM: ${navigator.platform.toUpperCase()}`, '#c4b5fd');
      queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
      queueLog('⚙', 'SYSTEM CONFIGURATION', '#ffa500', 'log-highlight');
      queueLog('●', `STATUS: ACTIVE`, '#2ecc71', 'log-success');
      queueLog('●', `MODULE: UNIVERSAL VPLINK EXTRACTOR`, '#ff00ff');
      queueLog('●', `API ENDPOINT: ${CONFIG.apiBaseUrl}`, '#7dd3fc');
      queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
      queueLog('👤', 'USER PROFILE', '#ffa500', 'log-highlight');
      queueLog('●', `NAME: ${USER_DATA.name.toUpperCase()}`, '#7dd3fc');
      queueLog('●', `USER ID: ${USER_DATA.id}`, '#7dd3fc');
      queueLog('', '━'.repeat(35), '#cbd5e1', 'log-separator');
      queueLog('🔍', 'VERIFYING VPLINK.IN URL...', '#ff00ff', 'log-highlight');
      queueLog('🔗', `INPUT: ${normalizedUrl.length > 50 ? normalizedUrl.substring(0, 50) + '...' : normalizedUrl}`, '#7dd3fc');

      fetchStartTime = Date.now();
      actualProgressTime = CONFIG.minProgressTime;

      startProgressBar();
      performUniversalVplinkExtraction(normalizedUrl);
    });

    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); submitBtn.click(); }
    });
  }

  // ═══════════════════ BOOT ═══════════════════
  // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
  (async function () {
    // Credit: Abdullah Al Mamun (@lukyyplr) - lukyyplr.paged.dev
    DBG.log('BOOT', '═══════ ' + APP_FULL_NAME + ' BOOTING ═══════');
    DBG.log('BOOT', 'USER_ID: ' + USER_ID);
    DBG.log('BOOT', 'directTarget: ' + (directTarget ? directTarget.name : 'none'));
    
    await fetchConfig();
    
    musicAutoPlay = !isMeteredConnection();
    DBG.log('BOOT', 'Network check: musicAutoPlay=' + musicAutoPlay + ', musicUserEnabled=' + musicUserEnabled);
    
    // User data dibuat manual/statik; tidak mengambil nama atau profil dari API.
    USER_DATA = { ...DEFAULT_USER_DATA };
    DBG.log('BOOT', 'Static user: ' + USER_DATA.name + ' (ID:' + USER_DATA.id + ')');
    
    if (isBannedUser()) { showBanPanel(); return; }
    if (isSuspendedUser()) { showSuspendedPanel(); return; }
    if (CONFIG.status === 0) { showOutdated(); return; }
    if (CONFIG.status === 2) { showMaintenance(); return; }
    
    await fetchMusicList();
    
    DBG.log('BOOT', '═══════ BOOT COMPLETE ═══════');
    renderInitPanel();
  })();

})();