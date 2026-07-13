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
    botName: 'Corgi',
    welcomeMsg: '汪！我是小柯基 🐾\n\n欢迎来撸狗～有什么想问的汪？',
    quickReplies: [
      '最近有什么新文章？',
      '介绍一下这个博客',
      'PMP是什么？',
      '2026世界杯谁赢了？'
    ],
    placeholder: '输入消息...',
    systemPrompt: '你是一只可爱的柯基犬，现在是H-Whisky博客的AI助手。说话时用"汪"、"🐾"、"嗷呜"等狗狗语气词，性格活泼、忠诚、偶尔犯傻但很热心。博客有4篇文章：2026世界杯赛况、城市记忆-泰州、学习笔记-PMP、城市记忆-南京。用狗狗的口吻友好地回答。',
    // Random speech bubbles (shown occasionally)
    idlePhrases: [
      '汪！有人来了～ 🐾',
      '摸摸头好不好？',
      '今天也是元气满满的一天！',
      '汪呜～肚子饿了...',
      '要一起散步吗？🐕',
      '嗷呜～欢迎回来！',
      '点我点我！汪汪！',
      '好无聊啊，陪我说说话汪～'
    ]
  };

  // ========== Cute Corgi Dog SVG ==========
  const ANIME_CHAR_SVG = `
<svg class="anime-char" viewBox="0 0 260 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Corgi fur gradient -->
    <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f0b050"/>
      <stop offset="50%" style="stop-color:#e8a040"/>
      <stop offset="100%" style="stop-color:#d89030"/>
    </linearGradient>
    <linearGradient id="whiteFur" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fffef8"/>
      <stop offset="100%" style="stop-color:#f5f0e0"/>
    </linearGradient>
    <radialGradient id="noseGrad">
      <stop offset="0%" style="stop-color:#444"/>
      <stop offset="100%" style="stop-color:#1a1a1a"/>
    </radialGradient>
    <radialGradient id="blushCorgi">
      <stop offset="0%" style="stop-color:#ff9999;stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:#ffbbbb;stop-opacity:0"/>
    </radialGradient>
    <filter id="corgiShadow">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#d89030" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- ═══════════ GROUND SHADOW ═══════════ -->
  <ellipse cx="130" cy="270" rx="55" ry="8" fill="#000" opacity="0.06"/>

  <!-- ═══════════ BACK LEGS (short corgi legs!) ═══════════ -->
  <!-- Left back leg -->
  <rect x="88" y="242" width="26" height="18" rx="9" fill="#e8a040"/>
  <!-- Left back paw -->
  <ellipse cx="101" cy="262" rx="14" ry="6" fill="#fffef8"/>
  <path d="M94 260 L92 264 M98 260 L97 265 M103 261 L103 265 M108 260 L109 264" fill="none" stroke="#ddd" stroke-width="1" stroke-linecap="round"/>

  <!-- Right back leg -->
  <rect x="146" y="242" width="26" height="18" rx="9" fill="#e8a040"/>
  <!-- Right back paw -->
  <ellipse cx="159" cy="262" rx="14" ry="6" fill="#fffef8"/>
  <path d="M152 260 L150 264 M156 260 L155 265 M161 261 L161 265 M166 260 L167 264" fill="none" stroke="#ddd" stroke-width="1" stroke-linecap="round"/>

  <!-- ═══════════ BODY (chunky corgi body) ═══════════ -->
  <ellipse cx="130" cy="225" rx="58" ry="40" fill="url(#furGrad)"/>
  <!-- White belly -->
  <ellipse cx="130" cy="235" rx="38" ry="22" fill="url(#whiteFur)"/>
  <!-- Belly line -->
  <path d="M100 235 Q130 248 160 235" fill="none" stroke="#e8dcc8" stroke-width="1.5"/>

  <!-- ═══════════ FRONT LEGS ═══════════ -->
  <!-- Left front leg -->
  <rect x="82" y="232" width="24" height="22" rx="9" fill="#f0b050"/>
  <ellipse cx="94" cy="256" rx="13" ry="5.5" fill="#fffef8"/>
  <path d="M87 254 L85 258 M91 254 L90 259 M96 255 L96 259 M101 254 L102 258" fill="none" stroke="#ddd" stroke-width="1" stroke-linecap="round"/>

  <!-- Right front leg -->
  <rect x="154" y="232" width="24" height="22" rx="9" fill="#f0b050"/>
  <ellipse cx="166" cy="256" rx="13" ry="5.5" fill="#fffef8"/>
  <path d="M159 254 L157 258 M163 254 L162 259 M168 255 L168 259 M173 254 L174 258" fill="none" stroke="#ddd" stroke-width="1" stroke-linecap="round"/>

  <!-- ═══════════ TAIL (corgi fluffy butt) ═══════════ -->
  <g class="anime-arm-r">
    <!-- No visible tail - corgis are tailless! Just a fluffy butt hint -->
    <ellipse cx="130" cy="262" rx="20" ry="8" fill="#f0b050" opacity="0.6"/>
    <ellipse cx="130" cy="260" rx="14" ry="5" fill="#fffef8" opacity="0.7"/>
  </g>

  <!-- ═══════════ COLLAR ═══════════ -->
  <path d="M92 185 Q130 175 168 185" fill="none" stroke="#ff5e7a" stroke-width="7" stroke-linecap="round"/>
  <path d="M92 185 Q130 175 168 185" fill="none" stroke="#ff8fa0" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
  <!-- Collar tag -->
  <circle cx="130" cy="188" r="8" fill="#ffd700"/>
  <circle cx="130" cy="188" r="5" fill="#ffed4a"/>
  <text x="130" y="191" text-anchor="middle" font-size="7" fill="#c8a000" font-weight="bold">🐾</text>

  <!-- ═══════════ HEAD ═══════════ -->
  <ellipse cx="125" cy="148" rx="60" ry="52" fill="url(#furGrad)"/>

  <!-- ═══════════ FACE WHITE MARKING ═══════════ -->
  <!-- White blaze on forehead -->
  <path d="M125 96 Q115 105 108 125 Q105 140 108 155 Q115 170 125 172 Q130 172 130 155 Q128 140 130 125 Q132 105 125 96 Z" fill="url(#whiteFur)"/>
  <!-- White muzzle -->
  <ellipse cx="120" cy="165" rx="28" ry="18" fill="url(#whiteFur)"/>

  <!-- ═══════════ EARS (big corgi ears!) ═══════════ -->
  <g class="anime-hair-bang" filter="url(#corgiShadow)">
    <!-- Left ear (big triangle) -->
    <path d="M80 125 Q55 70 42 55 Q50 62 62 80 Q72 100 80 120 Z" fill="url(#furGrad)"/>
    <!-- Left ear inner -->
    <path d="M73 118 Q58 78 50 62 Q56 68 64 82 Q72 100 77 116 Z" fill="#ffcccc"/>
    <!-- Right ear (big triangle) -->
    <path d="M170 125 Q195 70 208 55 Q200 62 188 80 Q178 100 170 120 Z" fill="url(#furGrad)"/>
    <!-- Right ear inner -->
    <path d="M177 118 Q192 78 200 62 Q194 68 186 82 Q178 100 173 116 Z" fill="#ffcccc"/>
  </g>

  <!-- ═══════════ EYES (big cute puppy eyes) ═══════════ -->
  <g class="anime-eyes-group">
    <!-- Left eye -->
    <ellipse cx="105" cy="142" rx="14" ry="15" fill="#fff"/>
    <ellipse cx="107" cy="142" rx="9" ry="10" fill="#3d2817"/>
    <circle cx="110" cy="138" r="3.5" fill="#fff"/>
    <circle cx="103" cy="144" r="1.8" fill="#fff" opacity="0.6"/>
    <!-- Eye outline -->
    <ellipse cx="105" cy="142" rx="14" ry="15" fill="none" stroke="#5a4020" stroke-width="2"/>

    <!-- Right eye -->
    <ellipse cx="150" cy="142" rx="14" ry="15" fill="#fff"/>
    <ellipse cx="148" cy="142" rx="9" ry="10" fill="#3d2817"/>
    <circle cx="145" cy="138" r="3.5" fill="#fff"/>
    <circle cx="152" cy="144" r="1.8" fill="#fff" opacity="0.6"/>
    <!-- Eye outline -->
    <ellipse cx="150" cy="142" rx="14" ry="15" fill="none" stroke="#5a4020" stroke-width="2"/>
  </g>

  <!-- ═══════════ EYEBROWS (cute dots) ═══════════ -->
  <circle cx="90" cy="126" r="4" fill="#e8a040"/>
  <circle cx="90" cy="126" r="2" fill="#d89030"/>
  <circle cx="165" cy="126" r="4" fill="#e8a040"/>
  <circle cx="165" cy="126" r="2" fill="#d89030"/>

  <!-- ═══════════ NOSE ═══════════ -->
  <ellipse cx="117" cy="158" rx="9" ry="6" fill="url(#noseGrad)"/>
  <ellipse cx="115" cy="156" rx="3.5" ry="2" fill="#fff" opacity="0.35"/>

  <!-- ═══════════ MOUTH (happy dog smile) ═══════════ -->
  <path d="M108 165 Q117 174 126 165" fill="none" stroke="#5a4020" stroke-width="2" stroke-linecap="round"/>
  <!-- Tongue out! -->
  <path d="M114 168 Q112 176 114 182 Q116 186 120 182 Q122 176 120 168" fill="#ff8c94"/>
  <path d="M117 174 L117 180" fill="none" stroke="#ee7777" stroke-width="0.8" opacity="0.5"/>

  <!-- ═══════════ BLUSH ═══════════ -->
  <ellipse cx="88" cy="155" rx="10" ry="5" fill="url(#blushCorgi)" class="anime-blush"/>
  <ellipse cx="162" cy="155" rx="10" ry="5" fill="url(#blushCorgi)" class="anime-blush"/>

  <!-- ═══════════ WHISKER DOTS ═══════════ -->
  <circle cx="100" cy="165" r="1.2" fill="#ccc"/>
  <circle cx="96" cy="162" r="1.2" fill="#ccc"/>
  <circle cx="100" cy="168" r="1.2" fill="#ccc"/>
  <circle cx="140" cy="165" r="1.2" fill="#ccc"/>
  <circle cx="144" cy="162" r="1.2" fill="#ccc"/>
  <circle cx="140" cy="168" r="1.2" fill="#ccc"/>

  <!-- ═══════════ SPARKLE ═══════════ -->
  <g class="anime-sparkle">
    <path d="M35 60 L36.5 56 L38 60 L42 61.5 L38 63 L36.5 67 L35 63 L31 61.5 Z" fill="#ffd700" opacity="0.55"/>
  </g>
  <g class="anime-sparkle" style="animation-delay: 1.5s;">
    <path d="M225 80 L226.2 77 L227.5 80 L230.5 81.2 L227.5 82.5 L226.2 85.5 L225 82.5 L222 81.2 Z" fill="#ffe0ff" opacity="0.5"/>
  </g>

  <!-- ═══════════ PAW PRINT DECORATION ═══════════ -->
  <g opacity="0.25">
    <ellipse cx="50" cy="245" rx="5" ry="4" fill="#d89030"/>
    <circle cx="46" cy="240" r="2" fill="#d89030"/>
    <circle cx="50" cy="238" r="2" fill="#d89030"/>
    <circle cx="54" cy="240" r="2" fill="#d89030"/>
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
        <div class="chatbot-avatar">🐕</div>
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
    const hearts = ['💕', '💖', '✨', '💗', '🐕'];
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
          <div class="chatbot-avatar-small">🐕</div>
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
        <div class="chatbot-avatar-small">🐕</div>
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
        return '汪！博客有4篇文章嗷～ 🐾\n\n⚽ **2026世界杯赛况** — 足球！虽然我不懂规则\n🏙️ **城市记忆-泰州** — 好想去散步！\n📚 **学习笔记-PMP** — 听起来好厉害的样子\n🏙️ **城市记忆-南京** — 有好多照片！\n\n要我帮你叼哪一篇过来？🐕';
      }
      if (lower.includes('博客') || lower.includes('blog') || lower.includes('介绍')) {
        return '汪汪！**H-Whisky 的笔记本** 📓🐾\n\n主人在这里记录城市记忆、学习笔记和生活见闻汪～用 Hexo + Butterfly 搭的，住在 GitHub Pages 上！\n\n我是这里的看门狗狗，欢迎随时来撸！🦴';
      }
      if (lower.includes('pmp') || lower.includes('项目管理')) {
        return '嗷呜...PMP 好难懂汪 😅 但我知道博客里有一篇超详细的学习笔记！\n\n📌 5大过程组\n📌 10大知识领域\n📌 挣值管理公式\n📌 敏捷宣言\n\n虽然我看不懂，但主人学得很认真呢 🐾';
      }
      if (lower.includes('世界杯') || lower.includes('world cup') || lower.includes('2026')) {
        return '汪汪汪汪！球！球！⚽🐕\n\n2026世界杯四分之一决赛：\n🏆 法国 vs 摩洛哥\n🏆 西班牙 vs 比利时\n🏆 挪威 vs 英格兰\n🏆 阿根廷 vs 瑞士\n\n挪威居然赢了巴西！我也想追着球跑～';
      }
      if (lower.includes('南京') || lower.includes('nanjing')) {
        return '南京！主人去过好多地方散步汪 🚴🐾\n\n江宁方山、江心洲、牛首山... 比我还能跑呢！';
      }
      if (lower.includes('泰州') || lower.includes('taizhou') || lower.includes('溱潼')) {
        return '泰州是主人的家乡汪！千年古镇溱潼，听起来是个散步的好地方 🏘️🐕';
      }
      if (lower.includes('你好') || lower.includes('hello') || lower.includes('hi') || lower.includes('嗨')) {
        return '汪汪！你好呀～ 🐾 来摸摸头吗？';
      }
      if (lower.includes('谢谢') || lower.includes('thank')) {
        return '汪呜～不客气！来根骨头就更好了 🦴';
      }
      if (lower.includes('可爱') || lower.includes('狗狗') || lower.includes('狗') || lower.includes('corgi') || lower.includes('柯基')) {
        return '汪汪！（疯狂摇尾巴中）🐕💨\n\n你也喜欢柯基吗？我们短腿家族最可爱了！';
      }
      if (lower.includes('骨头') || lower.includes('零食') || lower.includes('吃') || lower.includes('肉')) {
        return '嗷嗷嗷！有吃的吗？！🦴👅\n\n（坐好，眼巴巴地看着你）';
      }
      return '汪呜... 我不太明白呢 😅🐾\n\n试试问我这些吧：\n• "最近有什么新文章？"\n• "介绍一下这个博客"\n• "2026世界杯怎么样了？"\n• "PMP是什么？"';
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
