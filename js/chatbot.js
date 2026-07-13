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
    botName: '小咲',
    welcomeMsg: 'こんにちは！我是小咲 (Saki) ~ ✨\n\n有什么我可以帮你的吗？',
    quickReplies: [
      '最近有什么新文章？',
      '介绍一下这个博客',
      'PMP是什么？',
      '2026世界杯谁赢了？'
    ],
    placeholder: '输入消息...',
    systemPrompt: '你是小咲，H-Whisky 博客的AI看板娘。你是一个活泼可爱的动漫风格助手，用"~"、"✨"、"呢"、"哦"等卖萌语气词。博客有4篇文章：2026世界杯赛况、城市记忆-泰州、学习笔记-PMP、城市记忆-南京。请用中文友好地回答。',
    // Random speech bubbles (shown occasionally)
    idlePhrases: [
      '今天天气真好呢～☀️',
      '来看看新文章吧 ✨',
      '有什么想问的吗？',
      '点我可以聊天哦 💬',
      '欢迎来到博客～',
      '今天也要加油呀！',
      '一起学习吧 📚',
      '要不要聊聊天？'
    ]
  };

  // ========== Anime Character SVG (High-Detail Chibi) ==========
  const ANIME_CHAR_SVG = `
<svg class="anime-char" viewBox="0 0 260 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Hair gradient - Sakura pink -->
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8a4c8"/>
      <stop offset="30%" style="stop-color:#f7b2c5"/>
      <stop offset="60%" style="stop-color:#e893b8"/>
      <stop offset="100%" style="stop-color:#d4789f"/>
    </linearGradient>
    <!-- Hair shadow -->
    <linearGradient id="hairShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#d4789f;stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:#d4789f;stop-opacity:0"/>
    </linearGradient>
    <!-- Eyes - deep violet -->
    <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#7c5ce7"/>
      <stop offset="40%" style="stop-color:#5b3cc4"/>
      <stop offset="100%" style="stop-color:#2d1b69"/>
    </linearGradient>
    <!-- Eye highlight ring -->
    <linearGradient id="eyeRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a78bfa"/>
      <stop offset="100%" style="stop-color:#6d4fc9"/>
    </linearGradient>
    <!-- Skin base -->
    <radialGradient id="skinGrad" cx="50%" cy="40%">
      <stop offset="0%" style="stop-color:#fff5ee"/>
      <stop offset="70%" style="stop-color:#fde8d8"/>
      <stop offset="100%" style="stop-color:#f5d5c3"/>
    </radialGradient>
    <!-- Blush -->
    <radialGradient id="blushGrad">
      <stop offset="0%" style="stop-color:#ff9292;stop-opacity:0.7"/>
      <stop offset="60%" style="stop-color:#ffb3b3;stop-opacity:0.2"/>
      <stop offset="100%" style="stop-color:#ffb3b3;stop-opacity:0"/>
    </radialGradient>
    <!-- Uniform top -->
    <linearGradient id="uniformGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fafafa"/>
      <stop offset="100%" style="stop-color:#ece6f0"/>
    </linearGradient>
    <!-- Skirt -->
    <linearGradient id="skirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#2d1b69"/>
      <stop offset="100%" style="stop-color:#1a0f3c"/>
    </linearGradient>
    <!-- Shadow filter -->
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#d4789f" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- ═══════════ SHADOW ON GROUND ═══════════ -->
  <ellipse cx="130" cy="285" rx="55" ry="10" fill="#000" opacity="0.08"/>

  <!-- ═══════════ LEGS & SHOES ═══════════ -->
  <!-- Left leg -->
  <rect x="107" y="248" width="18" height="20" rx="6" fill="#fde8d8"/>
  <!-- Left sock -->
  <rect x="107" y="260" width="18" height="14" rx="4" fill="#fff" opacity="0.9"/>
  <rect x="107" y="260" width="18" height="2" rx="1" fill="#7c4dff" opacity="0.3"/>
  <!-- Left shoe (loafer) -->
  <path d="M105 272 Q105 268 112 267 L122 267 Q127 267 127 272 L127 278 Q127 282 122 282 L112 282 Q105 282 105 278 Z" fill="#5c3d3d"/>
  <ellipse cx="116" cy="275" rx="8" ry="2.5" fill="#4a2d2d"/>

  <!-- Right leg -->
  <rect x="135" y="248" width="18" height="20" rx="6" fill="#fde8d8"/>
  <!-- Right sock -->
  <rect x="135" y="260" width="18" height="14" rx="4" fill="#fff" opacity="0.9"/>
  <rect x="135" y="260" width="18" height="2" rx="1" fill="#7c4dff" opacity="0.3"/>
  <!-- Right shoe -->
  <path d="M133 272 Q133 268 140 267 L150 267 Q155 267 155 272 L155 278 Q155 282 150 282 L140 282 Q133 282 133 278 Z" fill="#5c3d3d"/>
  <ellipse cx="144" cy="275" rx="8" ry="2.5" fill="#4a2d2d"/>

  <!-- ═══════════ SKIRT (pleated) ═══════════ -->
  <g filter="url(#softShadow)">
    <path d="M90 228 L75 272 L185 272 L170 228 Z" fill="url(#skirtGrad)"/>
    <!-- Pleat lines -->
    <line x1="95" y1="230" x2="82" y2="272" stroke="#3d2878" stroke-width="0.8" opacity="0.5"/>
    <line x1="108" y1="230" x2="100" y2="272" stroke="#3d2878" stroke-width="0.8" opacity="0.5"/>
    <line x1="121" y1="230" x2="118" y2="272" stroke="#3d2878" stroke-width="0.8" opacity="0.3"/>
    <line x1="134" y1="230" x2="136" y2="272" stroke="#3d2878" stroke-width="0.8" opacity="0.3"/>
    <line x1="147" y1="230" x2="154" y2="272" stroke="#3d2878" stroke-width="0.8" opacity="0.5"/>
    <line x1="160" y1="230" x2="172" y2="272" stroke="#3d2878" stroke-width="0.8" opacity="0.5"/>
  </g>

  <!-- ═══════════ TORSO / UNIFORM ═══════════ -->
  <path d="M95 180 Q90 220 88 232 L172 232 Q170 220 165 180 Z" fill="url(#uniformGrad)"/>
  <!-- Uniform side shadows for depth -->
  <path d="M95 180 Q90 220 88 232 L105 232 Q108 210 108 180 Z" fill="#e8e0f0" opacity="0.5"/>
  <path d="M165 180 Q170 220 172 232 L155 232 Q152 210 152 180 Z" fill="#e8e0f0" opacity="0.5"/>
  <!-- Waistband -->
  <rect x="90" y="226" width="80" height="6" rx="2" fill="#7c4dff" opacity="0.4"/>

  <!-- ═══════════ SAILOR COLLAR ═══════════ -->
  <path d="M130 175 L78 195 Q76 200 82 208 L130 190 Z" fill="#f0f0f5"/>
  <path d="M130 175 L182 195 Q184 200 178 208 L130 190 Z" fill="#f0f0f5"/>
  <!-- Collar stripes -->
  <path d="M85 198 L128 182" fill="none" stroke="#7c4dff" stroke-width="2" opacity="0.4"/>
  <path d="M175 198 L132 182" fill="none" stroke="#7c4dff" stroke-width="2" opacity="0.4"/>
  <!-- Collar edge -->
  <path d="M130 175 L78 195" fill="none" stroke="#ddd" stroke-width="1"/>
  <path d="M130 175 L182 195" fill="none" stroke="#ddd" stroke-width="1"/>

  <!-- ═══════════ RIBBON / BOW ═══════════ -->
  <g class="anime-ribbon">
    <!-- Ribbon left -->
    <path d="M128 188 Q115 185 108 192 Q112 198 125 192" fill="#ff5e7a"/>
    <!-- Ribbon right -->
    <path d="M132 188 Q145 185 152 192 Q148 198 135 192" fill="#ff5e7a"/>
    <!-- Ribbon tails -->
    <path d="M125 192 Q118 200 115 212 Q117 215 122 210 Q124 200 128 192" fill="#ff3d5c"/>
    <path d="M135 192 Q142 200 145 212 Q143 215 138 210 Q136 200 132 192" fill="#ff3d5c"/>
    <!-- Ribbon center -->
    <circle cx="130" cy="190" r="5" fill="#ff5e7a"/>
    <circle cx="130" cy="190" r="2.5" fill="#ff8fa0"/>
  </g>

  <!-- ═══════════ ARMS ═══════════ -->
  <!-- Left arm (down, slightly bent) -->
  <path d="M95 188 Q78 200 72 215 Q70 220 73 222" fill="none" stroke="#fde8d8" stroke-width="14" stroke-linecap="round"/>
  <!-- Left hand -->
  <ellipse cx="74" cy="224" rx="9" ry="7" fill="#fde8d8"/>
  <!-- Left fingers hint -->
  <path d="M68 226 L66 229 M72 228 L70 231 M76 228 L75 231" fill="none" stroke="#f0d0c0" stroke-width="1.2" stroke-linecap="round"/>

  <!-- Right arm (slightly raised) -->
  <g class="anime-arm-r">
    <path d="M165 188 Q178 195 185 200 Q190 203 188 206" fill="none" stroke="#fde8d8" stroke-width="14" stroke-linecap="round"/>
    <!-- Right hand -->
    <ellipse cx="187" cy="208" rx="9" ry="7" fill="#fde8d8"/>
    <!-- Right fingers -->
    <path d="M182 204 L181 200 M186 203 L185 198 M190 205 L190 200 M193 208 L195 205" fill="none" stroke="#f0d0c0" stroke-width="1.2" stroke-linecap="round"/>
  </g>

  <!-- ═══════════ NECK ═══════════ -->
  <rect x="118" y="164" width="24" height="18" rx="8" fill="#fde8d8"/>
  <!-- Neck shadow -->
  <path d="M118 170 Q118 164 130 164 Q142 164 142 170" fill="none" stroke="#f0d0c0" stroke-width="2"/>

  <!-- ═══════════ HEAD ═══════════ -->
  <ellipse cx="130" cy="120" rx="68" ry="72" fill="url(#skinGrad)"/>

  <!-- ═══════════ HAIR - BACK LAYER ═══════════ -->
  <g class="anime-hair-back">
    <!-- Main back hair mass -->
    <path d="M62 120 Q58 90 70 60 Q85 32 130 28 Q175 32 190 60 Q202 90 198 120 Q200 85 188 58 Q175 35 130 32 Q85 35 72 58 Q60 85 62 120 Z" fill="url(#hairGrad)"/>
    <!-- Back hair flowing down -->
    <path d="M62 120 Q58 150 65 185 Q68 200 70 215" fill="none" stroke="url(#hairShadow)" stroke-width="12" stroke-linecap="round"/>
    <path d="M198 120 Q202 150 195 185 Q192 200 190 215" fill="none" stroke="url(#hairShadow)" stroke-width="12" stroke-linecap="round"/>
    <path d="M65 120 Q60 160 68 200 Q70 220 75 240" fill="none" stroke="url(#hairShadow)" stroke-width="16" stroke-linecap="round"/>
    <path d="M195 120 Q200 160 192 200 Q190 220 185 240" fill="none" stroke="url(#hairShadow)" stroke-width="16" stroke-linecap="round"/>
  </g>

  <!-- ═══════════ HAIR - SIDE STRANDS ═══════════ -->
  <g class="anime-hair-side-l">
    <path d="M64 100 Q55 120 52 150 Q50 170 54 190 Q56 200 60 215" fill="url(#hairGrad)" stroke="#e893b8" stroke-width="0.5"/>
    <path d="M62 108 Q56 130 54 155 Q52 175 55 198" fill="none" stroke="#c87090" stroke-width="1.5" opacity="0.3"/>
  </g>
  <g class="anime-hair-side-r">
    <path d="M196 100 Q205 120 208 150 Q210 170 206 190 Q204 200 200 215" fill="url(#hairGrad)" stroke="#e893b8" stroke-width="0.5"/>
    <path d="M198 108 Q204 130 206 155 Q208 175 205 198" fill="none" stroke="#c87090" stroke-width="1.5" opacity="0.3"/>
  </g>

  <!-- ═══════════ HAIR - BANGS ═══════════ -->
  <g class="anime-hair-bang">
    <!-- Main bangs block -->
    <path d="M62 95 Q58 75 70 55 Q80 40 100 35 Q115 32 130 31 Q145 32 160 35 Q180 40 190 55 Q202 75 198 95 Q195 82 185 72 Q175 60 160 52 Q145 46 130 45 Q115 46 100 52 Q85 60 75 72 Q65 82 62 95 Z" fill="url(#hairGrad)"/>
    <!-- Individual bang locks -->
    <path d="M68 90 Q62 70 75 52 Q85 42 98 36" fill="url(#hairGrad)" stroke="#e893b8" stroke-width="0.5"/>
    <path d="M90 88 Q85 60 95 42 Q105 34 118 31" fill="url(#hairGrad)" stroke="#e893b8" stroke-width="0.5"/>
    <path d="M130 88 Q128 55 130 33" fill="url(#hairGrad)" stroke="#e893b8" stroke-width="0.5"/>
    <path d="M170 88 Q175 60 165 42 Q155 34 142 31" fill="url(#hairGrad)" stroke="#e893b8" stroke-width="0.5"/>
    <path d="M192 90 Q198 70 185 52 Q175 42 162 36" fill="url(#hairGrad)" stroke="#e893b8" stroke-width="0.5"/>
    <!-- Bang highlight lines -->
    <path d="M80 42 Q90 38 100 36" fill="none" stroke="#fcd0e0" stroke-width="1.5" opacity="0.5"/>
    <path d="M120 34 Q135 33 150 34" fill="none" stroke="#fcd0e0" stroke-width="1.5" opacity="0.5"/>
    <path d="M175 42 Q185 48 192 58" fill="none" stroke="#fcd0e0" stroke-width="1.5" opacity="0.5"/>
  </g>

  <!-- ═══════════ AHOOGE (antenna hair) ═══════════ -->
  <g class="anime-hair-bang">
    <path d="M128 31 Q125 18 122 10 Q120 5 124 2" fill="none" stroke="#f0a0b8" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M124 2 Q128 0 130 2" fill="none" stroke="#f0a0b8" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Tiny ahoge highlight -->
    <circle cx="123" cy="8" r="2" fill="#fcd0e0" opacity="0.7"/>
  </g>

  <!-- ═══════════ HAIR SHINE / HIGHLIGHTS ═══════════ -->
  <ellipse cx="145" cy="75" rx="16" ry="28" fill="#fff" class="anime-hair-shine" transform="rotate(18 145 75)"/>
  <ellipse cx="100" cy="68" rx="10" ry="16" fill="#fff" class="anime-hair-shine" transform="rotate(-12 100 68)" opacity="0.6"/>

  <!-- ═══════════ HAIR ORNAMENT (cherry blossom clips) ═══════════ -->
  <!-- Left clip -->
  <circle cx="68" cy="68" r="8" fill="#ff9cb0"/>
  <circle cx="63" cy="63" r="5" fill="#ffb8c8"/>
  <circle cx="73" cy="63" r="5" fill="#ffb8c8"/>
  <circle cx="68" cy="66" r="3" fill="#ffe066"/>
  <circle cx="68" cy="66" r="1.5" fill="#ffc800"/>
  <!-- Right clip -->
  <circle cx="190" cy="72" r="6" fill="#c9b1ff"/>
  <circle cx="186" cy="68" r="4" fill="#ddd0ff"/>
  <circle cx="194" cy="68" r="4" fill="#ddd0ff"/>
  <circle cx="190" cy="70" r="2.5" fill="#ffe066"/>

  <!-- ═══════════ FACE DETAILS ═══════════ -->
  <!-- Nose (tiny triangle) -->
  <path d="M128 128 L130 132 L132 128" fill="none" stroke="#e8c8b4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- ═══════════ EYES ═══════════ -->
  <g class="anime-eyes-group">
    <!-- ── LEFT EYE ── -->
    <!-- Eye white -->
    <ellipse cx="100" cy="114" rx="20" ry="22" fill="#fff"/>
    <!-- Upper lash shadow -->
    <path d="M80 102 Q90 94 100 92 Q110 94 120 102" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
    <!-- Upper lash line thick -->
    <path d="M78 108 Q88 96 100 93 Q112 96 122 108" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
    <!-- Eyelashes individual -->
    <path d="M82 104 Q80 98 84 95" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M90 94 Q88 88 92 86" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M100 92 Q100 86 103 85" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M110 94 Q112 88 110 86" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M118 104 Q120 98 118 95" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <!-- Iris -->
    <ellipse cx="102" cy="116" rx="12" ry="15" fill="url(#eyeGrad)"/>
    <ellipse cx="102" cy="116" rx="12" ry="15" fill="none" stroke="url(#eyeRing)" stroke-width="1"/>
    <!-- Pupil -->
    <ellipse cx="103" cy="115" rx="6.5" ry="7.5" fill="#0a0a1a"/>
    <!-- Main highlight -->
    <ellipse cx="106" cy="109" rx="4" ry="4.5" fill="#fff"/>
    <!-- Secondary highlight -->
    <circle cx="98" cy="120" r="2.5" fill="#fff" opacity="0.7"/>
    <!-- Tiny sparkle highlight -->
    <circle cx="109" cy="106" r="1.5" fill="#fff" opacity="0.9"/>
    <!-- Lower lash line -->
    <path d="M84 123 Q92 130 100 130 Q108 130 116 123" fill="none" stroke="#333" stroke-width="1.2" opacity="0.5"/>

    <!-- ── RIGHT EYE ── -->
    <!-- Eye white -->
    <ellipse cx="160" cy="114" rx="20" ry="22" fill="#fff"/>
    <!-- Upper lash shadow -->
    <path d="M140 102 Q150 94 160 92 Q170 94 180 102" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
    <!-- Upper lash line thick -->
    <path d="M138 108 Q148 96 160 93 Q172 96 182 108" fill="none" stroke="#222" stroke-width="4" stroke-linecap="round"/>
    <!-- Eyelashes individual -->
    <path d="M142 104 Q140 98 144 95" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M150 94 Q148 88 152 86" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M160 92 Q160 86 163 85" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M170 94 Q172 88 170 86" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M178 104 Q180 98 178 95" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <!-- Iris -->
    <ellipse cx="158" cy="116" rx="12" ry="15" fill="url(#eyeGrad)"/>
    <ellipse cx="158" cy="116" rx="12" ry="15" fill="none" stroke="url(#eyeRing)" stroke-width="1"/>
    <!-- Pupil -->
    <ellipse cx="157" cy="115" rx="6.5" ry="7.5" fill="#0a0a1a"/>
    <!-- Main highlight -->
    <ellipse cx="154" cy="109" rx="4" ry="4.5" fill="#fff"/>
    <!-- Secondary highlight -->
    <circle cx="162" cy="120" r="2.5" fill="#fff" opacity="0.7"/>
    <!-- Tiny sparkle highlight -->
    <circle cx="151" cy="106" r="1.5" fill="#fff" opacity="0.9"/>
    <!-- Lower lash line -->
    <path d="M144 123 Q152 130 160 130 Q168 130 176 123" fill="none" stroke="#333" stroke-width="1.2" opacity="0.5"/>
  </g>

  <!-- ═══════════ EYEBROWS ═══════════ -->
  <path d="M82 94 Q92 88 105 90 Q112 91 118 90" fill="none" stroke="#8b7080" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M178 94 Q168 88 155 90 Q148 91 142 90" fill="none" stroke="#8b7080" stroke-width="2.5" stroke-linecap="round"/>

  <!-- ═══════════ BLUSH ═══════════ -->
  <ellipse cx="82" cy="130" rx="14" ry="7" fill="url(#blushGrad)" class="anime-blush"/>
  <ellipse cx="178" cy="130" rx="14" ry="7" fill="url(#blushGrad)" class="anime-blush"/>

  <!-- ═══════════ MOUTH ═══════════ -->
  <!-- Mouth line -->
  <path d="M122 138 Q130 144 138 138" fill="none" stroke="#e89595" stroke-width="2.2" stroke-linecap="round"/>
  <!-- Mouth interior (slightly open) -->
  <path d="M124 139 Q130 144 136 139" fill="#ffaaaa" opacity="0.3"/>
  <!-- Small fang (left) -->
  <path d="M124 138 L123 141.5 L126 138" fill="#fff" stroke="#e89595" stroke-width="0.6"/>

  <!-- ═══════════ SPARKLE PARTICLES ═══════════ -->
  <!-- Sparkle 1 -->
  <g class="anime-sparkle">
    <path d="M45 85 L47 80 L49 85 L54 87 L49 89 L47 94 L45 89 L40 87 Z" fill="#ffd700" opacity="0.7"/>
  </g>
  <!-- Sparkle 2 -->
  <g class="anime-sparkle" style="animation-delay: 1.2s;">
    <path d="M210 50 L211.5 46 L213 50 L217 51.5 L213 53 L211.5 57 L210 53 L206 51.5 Z" fill="#ffd700" opacity="0.5"/>
  </g>
  <!-- Sparkle 3 -->
  <g class="anime-sparkle" style="animation-delay: 2.5s;">
    <path d="M220 95 L221 92 L222 95 L225 96 L222 97 L221 100 L220 97 L217 96 Z" fill="#ffe0ff" opacity="0.6"/>
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
    toggle.setAttribute('aria-label', '和小咲聊天');
    toggle.innerHTML = ANIME_CHAR_SVG;

    // Chat panel
    const panel = document.createElement('div');
    panel.id = 'chatbot-panel';
    panel.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-avatar">🌸</div>
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
    const hearts = ['💕', '💖', '✨', '💗', '🌸'];
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
          <div class="chatbot-avatar-small">🌸</div>
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
        <div class="chatbot-avatar-small">🌸</div>
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
        return '博客目前有 4 篇文章哦～ ✨\n\n⚽ **2026世界杯赛况** — 最新战报\n🏙️ **城市记忆-泰州** — 家乡古镇\n📚 **学习笔记-PMP** — 备考笔记\n🏙️ **城市记忆-南京** — 骑行记录\n\n想了解哪一篇呢？';
      }
      if (lower.includes('博客') || lower.includes('blog') || lower.includes('介绍')) {
        return '这里是 **H-Whisky 的笔记本** 📓✨\n\n一个记录城市记忆、学习笔记和生活见闻的个人博客～ 基于 Hexo + Butterfly 主题构建，托管在 GitHub Pages 上呢！';
      }
      if (lower.includes('pmp') || lower.includes('项目管理')) {
        return '博客里的 **学习笔记-PMP** 超详细的！📚\n\n📌 5大过程组\n📌 10大知识领域\n📌 挣值管理公式\n📌 敏捷宣言与十二大原则\n\n需要小咲详细解释哪个概念呢？';
      }
      if (lower.includes('世界杯') || lower.includes('world cup') || lower.includes('2026')) {
        return '2026世界杯太精彩了！🔥✨\n\n四分之一决赛对阵：\n🏆 法国 vs 摩洛哥\n🏆 西班牙 vs 比利时\n🏆 挪威 vs 英格兰\n🏆 阿根廷 vs 瑞士\n\n挪威爆冷淘汰巴西，C罗已告别舞台...';
      }
      if (lower.includes('南京') || lower.includes('nanjing')) {
        return '博主在南京留下了很多美好回忆呢 🚴✨\n\n江宁方山、江心洲骑行、牛首山... 文章里有好多照片哦！';
      }
      if (lower.includes('泰州') || lower.includes('taizhou') || lower.includes('溱潼')) {
        return '泰州是博主的家乡～千年古镇溱潼就在那里 🏘️✨ 文章里记录了很多家乡的故事呢！';
      }
      if (lower.includes('你好') || lower.includes('hello') || lower.includes('hi') || lower.includes('嗨')) {
        return '你好呀！我是小咲～ 🌸✨\n\n有什么可以帮你的吗？';
      }
      if (lower.includes('谢谢') || lower.includes('thank')) {
        return '不客气啦～随时来找小咲聊天哦 💕';
      }
      if (lower.includes('可爱') || lower.includes('漂亮') || lower.includes('卡哇伊')) {
        return '诶嘿嘿～谢谢夸奖！好开心 💕✨';
      }
      return '唔... 小咲还不太明白呢 😅🌸\n\n试试问我这些吧：\n• "最近有什么新文章？"\n• "介绍一下这个博客"\n• "2026世界杯怎么样了？"\n• "PMP是什么？"';
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
