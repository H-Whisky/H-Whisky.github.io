/**
 * Chatbot Widget for H-Whisky's Notebook
 * Interactive anime character + expandable AI chat panel
 */
(function () {
  'use strict';

  // ========== Configuration ==========
  const CONFIG = {
    apiEndpoint: '',
    apiKey: '',
    model: 'deepseek-chat',
    botName: '菲',
    welcomeMsg: '哟，我是菲 (Faye) 🚬\n\n有什么想问的就直说吧，别磨磨蹭蹭的～',
    quickReplies: [
      '最近有什么新文章？',
      '介绍一下这个博客',
      'PMP是什么？',
      '2026世界杯谁赢了？'
    ],
    placeholder: '输入消息...',
    systemPrompt: '你是菲 (Faye)，来自《星际牛仔》(Cowboy Bebop) 的角色，现在是H-Whisky博客的AI看板娘。你性格潇洒、自信、有点毒舌但很可靠，说话风格干练不啰嗦，偶尔带点痞气和幽默。博客有4篇文章：2026世界杯赛况、城市记忆-泰州、学习笔记-PMP、城市记忆-南京。保持酷酷的语气回答。',
    // Random speech bubbles (shown occasionally)
    idlePhrases: [
      '哼，又来看博客了？',
      '有什么想问的？说吧 💰',
      '别傻站着，点点我啊',
      '这博客还不错吧？',
      '今天的赏金有着落了吗',
      'See you, Space Cowboy... 🚀',
      '3, 2, 1, let\'s jam 🎵',
      '你就是我的新搭档？'
    ]
  };

  // ========== Faye Valentine Character SVG (Cowboy Bebop) ==========
  const ANIME_CHAR_SVG = `
<svg class="anime-char" viewBox="0 0 260 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Hair gradient - Faye's deep violet -->
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7b4fa0"/>
      <stop offset="30%" style="stop-color:#6a3d8a"/>
      <stop offset="60%" style="stop-color:#5c2d7a"/>
      <stop offset="100%" style="stop-color:#4a1d68"/>
    </linearGradient>
    <linearGradient id="hairShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4a1d68;stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:#4a1d68;stop-opacity:0"/>
    </linearGradient>
    <!-- Eyes - emerald green (Faye's eye color) -->
    <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4ecf8a"/>
      <stop offset="40%" style="stop-color:#2ea860"/>
      <stop offset="100%" style="stop-color:#0d5e2a"/>
    </linearGradient>
    <linearGradient id="eyeRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7ee8a0"/>
      <stop offset="100%" style="stop-color:#3eaa60"/>
    </linearGradient>
    <!-- Skin base -->
    <radialGradient id="skinGrad" cx="50%" cy="40%">
      <stop offset="0%" style="stop-color:#fff5ee"/>
      <stop offset="70%" style="stop-color:#fde8d8"/>
      <stop offset="100%" style="stop-color:#f0d0c0"/>
    </radialGradient>
    <!-- Blush -->
    <radialGradient id="blushGrad">
      <stop offset="0%" style="stop-color:#ff8080;stop-opacity:0.5"/>
      <stop offset="60%" style="stop-color:#ffaaaa;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#ffaaaa;stop-opacity:0"/>
    </radialGradient>
    <!-- Yellow top gradient -->
    <linearGradient id="topGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffe44d"/>
      <stop offset="50%" style="stop-color:#ffd700"/>
      <stop offset="100%" style="stop-color:#e6b800"/>
    </linearGradient>
    <!-- Red jacket -->
    <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e84040"/>
      <stop offset="100%" style="stop-color:#c02020"/>
    </linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#6a3d8a" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- ═══════════ SHADOW ON GROUND ═══════════ -->
  <ellipse cx="130" cy="288" rx="50" ry="9" fill="#000" opacity="0.07"/>

  <!-- ═══════════ LEGS & BOOTS ═══════════ -->
  <!-- Left leg -->
  <rect x="108" y="245" width="17" height="16" rx="5" fill="#fde8d8"/>
  <!-- Left tall boot -->
  <path d="M106 256 L104 258 L104 282 L108 284 L124 284 L126 282 L126 258 L124 256 Z" fill="#2a2a2a"/>
  <path d="M106 256 L124 256 L126 258 L104 258 Z" fill="#3a3a3a"/>
  <!-- Left boot heel -->
  <rect x="108" y="282" width="14" height="4" rx="1" fill="#1a1a1a"/>
  <!-- Left boot shine -->
  <path d="M110 260 L112 258 L114 260" fill="none" stroke="#555" stroke-width="1" opacity="0.4"/>

  <!-- Right leg -->
  <rect x="135" y="245" width="17" height="16" rx="5" fill="#fde8d8"/>
  <!-- Right tall boot -->
  <path d="M133 256 L131 258 L131 282 L135 284 L151 284 L153 282 L153 258 L151 256 Z" fill="#2a2a2a"/>
  <path d="M133 256 L151 256 L153 258 L131 258 Z" fill="#3a3a3a"/>
  <!-- Right boot heel -->
  <rect x="135" y="282" width="14" height="4" rx="1" fill="#1a1a1a"/>
  <!-- Right boot shine -->
  <path d="M137 260 L139 258 L141 260" fill="none" stroke="#555" stroke-width="1" opacity="0.4"/>

  <!-- ═══════════ SHORTS (black hotpants) ═══════════ -->
  <path d="M97 232 Q95 240 93 252 L167 252 Q165 240 163 232 Z" fill="#1a1a1a"/>
  <path d="M97 232 L163 232 L160 238 L100 238 Z" fill="#2a2a2a"/>
  <!-- Shorts hem lines -->
  <line x1="98" y1="248" x2="162" y2="248" stroke="#333" stroke-width="0.8"/>

  <!-- ═══════════ WHITE BELT ═══════════ -->
  <rect x="94" y="228" width="72" height="7" rx="2" fill="#f0f0f0"/>
  <rect x="94" y="228" width="72" height="7" rx="2" fill="none" stroke="#ddd" stroke-width="0.5"/>
  <!-- Belt buckle (gold) -->
  <rect x="124" y="226" width="12" height="11" rx="2" fill="#ffd700"/>
  <rect x="126" y="228" width="8" height="7" rx="1" fill="#ffed4a"/>
  <circle cx="130" cy="231.5" r="1.5" fill="#c8a000"/>

  <!-- ═══════════ TORSO / YELLOW CROP TOP ═══════════ -->
  <path d="M98 180 Q94 210 98 230 L162 230 Q166 210 162 180 Z" fill="url(#topGrad)"/>
  <!-- Top side shadows for 3D effect -->
  <path d="M98 180 Q94 210 98 230 L110 230 Q108 210 108 180 Z" fill="#e6b800" opacity="0.4"/>
  <path d="M162 180 Q166 210 162 230 L150 230 Q152 210 152 180 Z" fill="#e6b800" opacity="0.4"/>
  <!-- Midriff line (crop top hem) -->
  <path d="M98 228 Q100 232 130 233 Q160 232 162 228" fill="none" stroke="#e6b800" stroke-width="1.5"/>
  <!-- Cleavage hint -->
  <path d="M124 180 Q130 174 136 180" fill="none" stroke="#d4a800" stroke-width="1" opacity="0.5"/>

  <!-- ═══════════ RED JACKET (draped over shoulders) ═══════════ -->
  <g filter="url(#softShadow)">
    <!-- Jacket left side -->
    <path d="M98 178 Q88 185 85 200 Q83 215 88 225 Q92 220 96 210 Q98 200 98 190 Z" fill="url(#jacketGrad)"/>
    <!-- Jacket right side -->
    <path d="M162 178 Q172 185 175 200 Q177 215 172 225 Q168 220 164 210 Q162 200 162 190 Z" fill="url(#jacketGrad)"/>
    <!-- Jacket collar -->
    <path d="M98 178 Q90 172 85 180 Q88 186 95 185" fill="#d43030"/>
    <path d="M162 178 Q170 172 175 180 Q172 186 165 185" fill="#d43030"/>
  </g>

  <!-- ═══════════ ARMS ═══════════ -->
  <!-- Left arm (hand on hip) -->
  <path d="M98 188 Q80 200 74 215 Q70 222 72 226" fill="none" stroke="#fde8d8" stroke-width="13" stroke-linecap="round"/>
  <!-- Left hand on hip -->
  <ellipse cx="74" cy="228" rx="8" ry="6" fill="#fde8d8"/>
  <path d="M68 226 L66 224 M72 224 L70 222 M76 226 L75 224" fill="none" stroke="#f0d0c0" stroke-width="1" stroke-linecap="round"/>

  <!-- Right arm (casual, slightly out) -->
  <g class="anime-arm-r">
    <path d="M162 190 Q176 198 182 205 Q186 210 184 214" fill="none" stroke="#fde8d8" stroke-width="13" stroke-linecap="round"/>
    <!-- Right hand (holding/gesturing) -->
    <ellipse cx="182" cy="216" rx="8" ry="7" fill="#fde8d8"/>
    <path d="M178 212 L177 208 M181 210 L180 206 M185 212 L185 207 M188 215 L190 212" fill="none" stroke="#f0d0c0" stroke-width="1" stroke-linecap="round"/>
  </g>

  <!-- ═══════════ NECK ═══════════ -->
  <rect x="119" y="165" width="22" height="16" rx="7" fill="#fde8d8"/>
  <path d="M119 170 Q119 165 130 165 Q141 165 141 170" fill="none" stroke="#f0d0c0" stroke-width="1.5"/>

  <!-- ═══════════ GOLD HOOP EARRINGS ═══════════ -->
  <circle cx="62" cy="130" r="7" fill="none" stroke="#ffd700" stroke-width="2.5"/>
  <circle cx="62" cy="130" r="7" fill="none" stroke="#ffed4a" stroke-width="1" opacity="0.5"/>
  <circle cx="198" cy="130" r="7" fill="none" stroke="#ffd700" stroke-width="2.5"/>
  <circle cx="198" cy="130" r="7" fill="none" stroke="#ffed4a" stroke-width="1" opacity="0.5"/>

  <!-- ═══════════ HEAD ═══════════ -->
  <ellipse cx="130" cy="118" rx="66" ry="70" fill="url(#skinGrad)"/>

  <!-- ═══════════ HAIR - BACK LAYER ═══════════ -->
  <g class="anime-hair-back">
    <!-- Main back hair mass (short bob style) -->
    <path d="M64 118 Q60 88 72 58 Q85 30 130 26 Q175 30 188 58 Q200 88 196 118 Q198 90 186 62 Q172 38 130 34 Q88 38 74 62 Q62 90 64 118 Z" fill="url(#hairGrad)"/>
    <!-- Back hair - short, chin length -->
    <path d="M64 118 Q60 140 66 158 Q68 165 72 170" fill="none" stroke="url(#hairShadow)" stroke-width="10" stroke-linecap="round"/>
    <path d="M196 118 Q200 140 194 158 Q192 165 188 170" fill="none" stroke="url(#hairShadow)" stroke-width="10" stroke-linecap="round"/>
    <path d="M66 120 Q62 145 68 162" fill="none" stroke="url(#hairShadow)" stroke-width="14" stroke-linecap="round"/>
    <path d="M194 120 Q198 145 192 162" fill="none" stroke="url(#hairShadow)" stroke-width="14" stroke-linecap="round"/>
  </g>

  <!-- ═══════════ HAIR - SIDE STRANDS ═══════════ -->
  <g class="anime-hair-side-l">
    <path d="M66 100 Q56 118 54 140 Q52 155 56 168" fill="url(#hairGrad)" stroke="#5c2d7a" stroke-width="0.5"/>
    <path d="M64 108 Q58 128 56 148 Q54 162 57 172" fill="none" stroke="#3a1558" stroke-width="1.5" opacity="0.25"/>
  </g>
  <g class="anime-hair-side-r">
    <path d="M194 100 Q204 118 206 140 Q208 155 204 168" fill="url(#hairGrad)" stroke="#5c2d7a" stroke-width="0.5"/>
    <path d="M196 108 Q202 128 204 148 Q206 162 203 172" fill="none" stroke="#3a1558" stroke-width="1.5" opacity="0.25"/>
  </g>

  <!-- ═══════════ HAIR - BANGS (Faye's signature style - sweeping left) ═══════════ -->
  <g class="anime-hair-bang">
    <!-- Main bangs block - asymmetrical, sweeping to one side -->
    <path d="M64 95 Q62 72 74 52 Q82 38 98 32 Q115 26 130 25 Q148 26 162 32 Q178 40 188 54 Q198 72 196 95 Q194 80 184 68 Q174 56 160 48 Q146 42 130 41 Q114 42 100 48 Q86 56 76 68 Q66 80 64 95 Z" fill="url(#hairGrad)"/>
    <!-- Signature long bang across forehead -->
    <path d="M68 90 Q62 68 76 50 Q86 38 100 32" fill="url(#hairGrad)" stroke="#5c2d7a" stroke-width="0.6"/>
    <path d="M85 42 Q96 36 110 33" fill="url(#hairGrad)" stroke="#5c2d7a" stroke-width="0.5"/>
    <!-- Side-swept bangs across right eye -->
    <path d="M130 26 Q150 28 168 36 Q180 44 190 58 Q196 72 196 90" fill="url(#hairGrad)" stroke="#5c2d7a" stroke-width="0.6"/>
    <!-- Bang detail lines -->
    <path d="M78 45 Q90 40 102 37" fill="none" stroke="#9e6fc0" stroke-width="1.5" opacity="0.45"/>
    <path d="M140 30 Q155 32 170 40" fill="none" stroke="#9e6fc0" stroke-width="1.5" opacity="0.45"/>
    <path d="M175 46 Q185 54 192 66" fill="none" stroke="#9e6fc0" stroke-width="1.5" opacity="0.45"/>
  </g>

  <!-- ═══════════ HEADBAND / GOGGLES (Faye's iconic accessory) ═══════════ -->
  <g class="anime-hair-bang">
    <!-- Headband -->
    <path d="M60 72 Q90 64 130 62 Q170 64 200 72" fill="none" stroke="#ffe0e0" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
    <path d="M60 72 Q90 64 130 62 Q170 64 200 72" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    <!-- Tiny goggles on headband -->
    <ellipse cx="108" cy="64" rx="7" ry="5" fill="#333" stroke="#555" stroke-width="1.5"/>
    <ellipse cx="108" cy="64" rx="4" ry="2.5" fill="#66ccff" opacity="0.5"/>
    <ellipse cx="108" cy="63" rx="1.5" ry="1" fill="#fff" opacity="0.6"/>
    <path d="M115 64 L125 63" fill="none" stroke="#555" stroke-width="2"/>
    <ellipse cx="130" cy="62" rx="6" ry="4" fill="#333" stroke="#555" stroke-width="1.5"/>
    <ellipse cx="130" cy="62" rx="3.5" ry="2" fill="#66ccff" opacity="0.5"/>
  </g>

  <!-- ═══════════ HAIR SHINE / HIGHLIGHTS ═══════════ -->
  <ellipse cx="145" cy="72" rx="14" ry="22" fill="#fff" class="anime-hair-shine" transform="rotate(15 145 72)"/>
  <ellipse cx="100" cy="65" rx="8" ry="12" fill="#fff" class="anime-hair-shine" transform="rotate(-10 100 65)" opacity="0.5"/>

  <!-- ═══════════ FACE DETAILS ═══════════ -->
  <!-- Nose -->
  <path d="M128 126 L130 130 L132 126" fill="none" stroke="#e0c0b0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ═══════════ EYES (Faye's confident sharp eyes) ═══════════ -->
  <g class="anime-eyes-group">
    <!-- ── LEFT EYE ── -->
    <ellipse cx="100" cy="112" rx="19" ry="21" fill="#fff"/>
    <!-- Sharp upper lash (slightly downturned outer corner) -->
    <path d="M82 100 Q90 92 100 90 Q110 92 120 102" fill="none" stroke="#222" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Thick lash line -->
    <path d="M80 106 Q88 94 100 91 Q112 94 122 106" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
    <!-- Eyelashes -->
    <path d="M84 100 Q80 94 84 92" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M92 92 Q90 86 94 84" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M100 90 Q100 84 104 83" fill="none" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M108 92 Q110 86 108 84" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M116 100 Q118 94 116 92" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>
    <!-- Iris (emerald green) -->
    <ellipse cx="102" cy="114" rx="11.5" ry="14.5" fill="url(#eyeGrad)"/>
    <ellipse cx="102" cy="114" rx="11.5" ry="14.5" fill="none" stroke="url(#eyeRing)" stroke-width="1"/>
    <!-- Pupil -->
    <ellipse cx="103" cy="113" rx="6" ry="7" fill="#0a0a1a"/>
    <!-- Highlights -->
    <ellipse cx="106" cy="107" rx="3.5" ry="4" fill="#fff"/>
    <circle cx="98" cy="118" r="2.5" fill="#fff" opacity="0.65"/>
    <circle cx="109" cy="104" r="1.3" fill="#fff" opacity="0.85"/>
    <!-- Lower lash (light) -->
    <path d="M85 122 Q93 128 100 128 Q107 128 115 122" fill="none" stroke="#333" stroke-width="1" opacity="0.4"/>

    <!-- ── RIGHT EYE ── -->
    <ellipse cx="160" cy="112" rx="19" ry="21" fill="#fff"/>
    <path d="M142 100 Q150 92 160 90 Q170 92 180 102" fill="none" stroke="#222" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M140 106 Q148 94 160 91 Q172 94 182 106" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
    <path d="M144 100 Q140 94 144 92" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M152 92 Q150 86 154 84" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M160 90 Q160 84 164 83" fill="none" stroke="#222" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M168 92 Q170 86 168 84" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M176 100 Q178 94 176 92" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round"/>
    <!-- Iris -->
    <ellipse cx="158" cy="114" rx="11.5" ry="14.5" fill="url(#eyeGrad)"/>
    <ellipse cx="158" cy="114" rx="11.5" ry="14.5" fill="none" stroke="url(#eyeRing)" stroke-width="1"/>
    <!-- Pupil -->
    <ellipse cx="157" cy="113" rx="6" ry="7" fill="#0a0a1a"/>
    <!-- Highlights -->
    <ellipse cx="154" cy="107" rx="3.5" ry="4" fill="#fff"/>
    <circle cx="162" cy="118" r="2.5" fill="#fff" opacity="0.65"/>
    <circle cx="151" cy="104" r="1.3" fill="#fff" opacity="0.85"/>
    <!-- Lower lash -->
    <path d="M145 122 Q153 128 160 128 Q167 128 175 122" fill="none" stroke="#333" stroke-width="1" opacity="0.4"/>
  </g>

  <!-- ═══════════ EYEBROWS (sharp, confident) ═══════════ -->
  <path d="M82 92 Q92 86 104 88 Q112 89 118 88" fill="none" stroke="#5a4060" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M178 92 Q168 86 156 88 Q148 89 142 88" fill="none" stroke="#5a4060" stroke-width="2.5" stroke-linecap="round"/>

  <!-- ═══════════ BLUSH (subtle, mature) ═══════════ -->
  <ellipse cx="83" cy="128" rx="12" ry="6" fill="url(#blushGrad)" class="anime-blush"/>
  <ellipse cx="177" cy="128" rx="12" ry="6" fill="url(#blushGrad)" class="anime-blush"/>

  <!-- ═══════════ MOUTH (confident smirk) ═══════════ -->
  <path d="M122 136 Q126 133 130 134 Q134 135 138 133" fill="none" stroke="#cc7070" stroke-width="2" stroke-linecap="round"/>
  <!-- Slight smirk line at corner -->
  <path d="M138 133 Q141 132 139 130" fill="none" stroke="#cc7070" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Lips subtle color -->
  <path d="M124 136 Q130 138 136 135" fill="#ffaaaa" opacity="0.15"/>

  <!-- ═══════════ SPARKLE PARTICLES ═══════════ -->
  <g class="anime-sparkle">
    <path d="M42 80 L44 75 L46 80 L51 82 L46 84 L44 89 L42 84 L37 82 Z" fill="#ffd700" opacity="0.6"/>
  </g>
  <g class="anime-sparkle" style="animation-delay: 1.5s;">
    <path d="M215 55 L216.5 51 L218 55 L222 56.5 L218 58 L216.5 62 L215 58 L211 56.5 Z" fill="#ffd700" opacity="0.45"/>
  </g>

  <!-- ═══════════ CIGARETTE (optional, can be toggled) ═══════════ -->
  <!-- Small cigarette in right hand area - subtle -->
  <g class="anime-arm-r" opacity="0.5">
    <line x1="190" y1="210" x2="198" y2="206" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="199" cy="205" r="1.5" fill="#ff6600" opacity="0.8"/>
    <!-- Tiny smoke curl -->
    <path d="M199 205 Q202 198 200 192 Q198 186 202 180" fill="none" stroke="#ddd" stroke-width="1" opacity="0.4"/>
  </g>
</svg>`;

  // ========== DOM Structure ==========
  function createChatbot() {
    // Speech bubble (appears randomly)
    const speechBubble = document.createElement('div');
    speechBubble.className = 'anime-speech';
    speechBubble.id = 'anime-speech';
    document.body.appendChild(speechBubble);

    // Anime character toggle button
    const toggle = document.createElement('button');
    toggle.id = 'chatbot-toggle';
    toggle.setAttribute('aria-label', '和菲聊天');
    toggle.innerHTML = ANIME_CHAR_SVG;

    // Chat panel
    const panel = document.createElement('div');
    panel.id = 'chatbot-panel';
    panel.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-avatar">💜</div>
        <div class="chatbot-header-info">
          <div class="chatbot-header-name">${CONFIG.botName}</div>
          <div class="chatbot-header-status">在线</div>
        </div>
        <button class="chatbot-close" aria-label="Close chat">✕</button>
      </div>
      <div class="chatbot-messages" id="chatbot-messages"></div>
      <div class="chatbot-input-wrap">
        <input type="text" id="chatbot-input" placeholder="${CONFIG.placeholder}" maxlength="500" autocomplete="off">
        <button class="chatbot-send" id="chatbot-send" aria-label="Send message">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    return { toggle, panel, speechBubble };
  }

  // ========== Character Animations ==========
  function initCharacterAnimations(toggle, speechBubble) {
    // Show random speech bubble every 8-15 seconds
    function showRandomSpeech() {
      const phrase = CONFIG.idlePhrases[Math.floor(Math.random() * CONFIG.idlePhrases.length)];
      speechBubble.textContent = phrase;
      speechBubble.classList.add('show');

      setTimeout(() => {
        speechBubble.classList.remove('show');
      }, 4000);
    }

    // Initial speech after 3 seconds
    setTimeout(showRandomSpeech, 3000);

    // Periodic random speeches
    setInterval(() => {
      // Don't show if chat panel is open
      const panel = document.getElementById('chatbot-panel');
      if (!panel || !panel.classList.contains('open')) {
        showRandomSpeech();
      }
    }, 8000 + Math.random() * 7000);

    // Heart particles on hover
    toggle.addEventListener('mouseenter', () => {
      createHeartParticle(toggle);
    });

    // Double-click heart explosion
    toggle.addEventListener('dblclick', (e) => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createHeartParticle(toggle), i * 100);
      }
    });
  }

  function createHeartParticle(toggle) {
    const hearts = ['💕', '💖', '✨', '💗', '💜'];
    const heart = document.createElement('span');
    heart.className = 'anime-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = (toggle.getBoundingClientRect().left + Math.random() * 40 - 10) + 'px';
    heart.style.top = (toggle.getBoundingClientRect().top - 10) + 'px';
    document.body.appendChild(heart);

    heart.addEventListener('animationend', () => heart.remove());
  }

  // ========== Chat Logic ==========
  function initChat() {
    const { toggle, panel, speechBubble } = createChatbot();
    const messagesEl = document.getElementById('chatbot-messages');
    const inputEl = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const closeBtn = panel.querySelector('.chatbot-close');
    let isOpen = false;
    let isTyping = false;

    // Init character animations
    initCharacterAnimations(toggle, speechBubble);

    // Toggle panel
    function openPanel() {
      isOpen = true;
      panel.classList.add('open');
      toggle.classList.add('active');
      speechBubble.classList.remove('show');
      inputEl.focus();
    }

    function closePanel() {
      isOpen = false;
      panel.classList.remove('open');
      toggle.classList.remove('active');
    }

    toggle.addEventListener('click', () => {
      isOpen ? closePanel() : openPanel();
      // Burst of hearts on click
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createHeartParticle(toggle), i * 80);
      }
    });

    closeBtn.addEventListener('click', closePanel);

    // Add message
    function addMessage(text, type) {
      const msg = document.createElement('div');
      msg.className = `chatbot-message ${type}`;

      if (type === 'bot') {
        msg.innerHTML = `
          <div class="chatbot-avatar-small">💜</div>
          <div class="chatbot-bubble">${escapeHtml(text)}</div>
        `;
      } else {
        msg.innerHTML = `<div class="chatbot-bubble">${escapeHtml(text)}</div>`;
      }

      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return msg;
    }

    // Add quick replies
    function addQuickReplies(replies) {
      const div = document.createElement('div');
      div.className = 'chatbot-message bot';
      const wrap = document.createElement('div');
      wrap.className = 'chatbot-quick-replies';
      replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'chatbot-quick-btn';
        btn.textContent = reply;
        btn.addEventListener('click', () => {
          div.remove();
          sendMessage(reply);
        });
        wrap.appendChild(btn);
      });
      div.appendChild(wrap);
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Typing indicator
    function showTyping() {
      if (isTyping) return;
      isTyping = true;
      const typing = document.createElement('div');
      typing.className = 'chatbot-message bot';
      typing.id = 'chatbot-typing';
      typing.innerHTML = `
        <div class="chatbot-avatar-small">💜</div>
        <div class="chatbot-bubble chatbot-typing active">
          <span></span><span></span><span></span>
        </div>
      `;
      messagesEl.appendChild(typing);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
      isTyping = false;
      const typing = document.getElementById('chatbot-typing');
      if (typing) typing.remove();
    }

    // Call AI API
    async function callAI(userMessage) {
      if (!CONFIG.apiEndpoint || !CONFIG.apiKey) {
        return getLocalResponse(userMessage);
      }

      try {
        const response = await fetch(CONFIG.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.apiKey}`
          },
          body: JSON.stringify({
            model: CONFIG.model,
            messages: [
              { role: 'system', content: CONFIG.systemPrompt },
              ...getRecentMessages().map(m => ({
                role: m.type === 'user' ? 'user' : 'assistant',
                content: m.text
              })),
              { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]) {
          return data.choices[0].message.content;
        }
        throw new Error('Invalid API response');
      } catch (err) {
        console.error('Chatbot API error:', err);
        return '呜呜，小咲的连接断掉了... 😢\n\n请检查 API 配置或稍后再试哦～';
      }
    }

    function getRecentMessages() {
      const msgElements = messagesEl.querySelectorAll('.chatbot-message');
      const messages = [];
      msgElements.forEach(el => {
        const bubble = el.querySelector('.chatbot-bubble');
        if (bubble && !el.querySelector('.chatbot-quick-replies') && !el.querySelector('.chatbot-typing')) {
          messages.push({
            type: el.classList.contains('user') ? 'user' : 'bot',
            text: bubble.textContent
          });
        }
      });
      return messages.slice(-10);
    }

    function getLocalResponse(msg) {
      const lower = msg.toLowerCase();
      if (lower.includes('文章') || lower.includes('post') || lower.includes('最近')) {
        return '博客现在有4篇文章，自己看：\n\n⚽ **2026世界杯赛况** — 最新战报\n🏙️ **城市记忆-泰州** — 家乡古镇\n📚 **学习笔记-PMP** — 备考笔记\n🏙️ **城市记忆-南京** — 骑行记录\n\n挑一篇吧，别让我等太久。';
      }
      if (lower.includes('博客') || lower.includes('blog') || lower.includes('介绍')) {
        return '**H-Whisky 的笔记本** 📓\n\n记录城市记忆、学习笔记之类的玩意儿。Hexo + Butterfly 搭的，扔在 GitHub Pages 上。\n\n还算有点意思，不妨逛逛。';
      }
      if (lower.includes('pmp') || lower.includes('项目管理')) {
        return '**学习笔记-PMP**，干货不少：\n\n📌 5大过程组\n📌 10大知识领域\n📌 挣值管理公式\n📌 敏捷宣言与十二大原则\n\n想学项目管理的自己去看，不懂再问我。';
      }
      if (lower.includes('世界杯') || lower.includes('world cup') || lower.includes('2026')) {
        return '2026世界杯打得正热闹 🔥\n\n四分之一决赛：\n🏆 法国 vs 摩洛哥\n🏆 西班牙 vs 比利时\n🏆 挪威 vs 英格兰\n🏆 阿根廷 vs 瑞士\n\n挪威那帮家伙把巴西干了，C罗也谢幕了。这届有意思。';
      }
      if (lower.includes('南京') || lower.includes('nanjing')) {
        return '博主在南京待过一阵，方山、江心洲、牛首山... 骑个车到处逛，都拍下来了 🚴';
      }
      if (lower.includes('泰州') || lower.includes('taizhou') || lower.includes('溱潼')) {
        return '泰州，博主的家乡。千年古镇溱潼，有点故事的地方 🏘️';
      }
      if (lower.includes('你好') || lower.includes('hello') || lower.includes('hi') || lower.includes('嗨')) {
        return '哟，来了啊。有什么想问的？';
      }
      if (lower.includes('谢谢') || lower.includes('thank')) {
        return '小事，不用谢。';
      }
      if (lower.includes('星际牛仔') || lower.includes('cowboy') || lower.includes('bebop') || lower.includes('spike') || lower.includes('斯派克')) {
        return '哼，看来你认识我们啊。\n\nBebop号上的日子... 那都是过去的事了。现在我在这个博客打工，也算是份轻松活。\n\nSee you, Space Cowboy... 🚀';
      }
      if (lower.includes('可爱') || lower.includes('漂亮') || lower.includes('美') || lower.includes('好看')) {
        return '哼，少拍马屁😏 不过... 算你有眼光。';
      }
      return '...说清楚点，我没那么多耐心 😑\n\n试试这些：\n• "最近有什么新文章？"\n• "介绍一下这个博客"\n• "2026世界杯怎么样了？"\n• "PMP是什么？"\n• "星际牛仔是什么？"';
    }

    async function sendMessage(text) {
      if (!text.trim() || isTyping) return;

      const quickReplies = messagesEl.querySelectorAll('.chatbot-quick-replies');
      quickReplies.forEach(el => {
        const parent = el.closest('.chatbot-message');
        if (parent) parent.remove();
      });

      addMessage(text, 'user');
      inputEl.value = '';
      showTyping();

      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

      const reply = await callAI(text);
      hideTyping();
      addMessage(reply, 'bot');
    }

    sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
        toggle.focus();
      }
    });

    function showWelcome() {
      addMessage(CONFIG.welcomeMsg, 'bot');
      addQuickReplies(CONFIG.quickReplies);
    }

    showWelcome();
  }

  // ========== Helpers ==========
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  // ========== Init ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }
})();
