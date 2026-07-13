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

  // ========== Anime Character SVG ==========
  const ANIME_CHAR_SVG = `
<svg class="anime-char" viewBox="0 0 180 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff9a9e"/>
      <stop offset="50%" style="stop-color:#fad0c4"/>
      <stop offset="100%" style="stop-color:#a18cd1"/>
    </linearGradient>
    <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#6c5ce7"/>
      <stop offset="100%" style="stop-color:#4834d4"/>
    </linearGradient>
    <linearGradient id="outfitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fff"/>
      <stop offset="100%" style="stop-color:#e8e0f0"/>
    </linearGradient>
    <radialGradient id="blushGrad">
      <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:0.8"/>
      <stop offset="100%" style="stop-color:#ff9a9e;stop-opacity:0"/>
    </radialGradient>
  </defs>

  <!-- Body / Outfit -->
  <ellipse cx="90" cy="165" rx="28" ry="22" fill="url(#outfitGrad)" stroke="#d4c8e0" stroke-width="1"/>
  <!-- Skirt -->
  <path d="M62 165 L55 195 L125 195 L118 165 Z" fill="#7c4dff" opacity="0.7"/>
  <path d="M62 165 L58 180 L122 180 L118 165 Z" fill="#7c4dff" opacity="0.5"/>
  <!-- Collar ribbon -->
  <path d="M80 150 L90 160 L100 150" fill="none" stroke="#ff6b6b" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="90" cy="158" r="3" fill="#ff6b6b"/>

  <!-- Neck -->
  <rect x="82" y="140" width="16" height="10" rx="5" fill="#fce4d6"/>

  <!-- Head -->
  <ellipse cx="90" cy="108" rx="52" ry="56" fill="#fce4d6"/>

  <!-- Hair - Back -->
  <ellipse cx="90" cy="105" rx="55" ry="60" fill="url(#hairGrad)"/>
  <!-- Hair sides -->
  <path d="M38 100 Q30 120 32 155 Q36 148 40 140 Q42 120 40 100" fill="url(#hairGrad)"/>
  <path d="M142 100 Q150 120 148 155 Q144 148 140 140 Q138 120 140 100" fill="url(#hairGrad)"/>
  <!-- Hair bangs -->
  <path d="M38 80 Q45 65 60 58 Q75 50 90 48 Q105 50 120 58 Q135 65 142 80 Q130 72 110 68 Q95 65 80 68 Q60 72 38 80" fill="url(#hairGrad)"/>
  <!-- Hair strands -->
  <path d="M90 48 Q85 55 78 70" fill="none" stroke="#ff9a9e" stroke-width="1.5" opacity="0.6"/>
  <path d="M90 48 Q95 55 102 70" fill="none" stroke="#ff9a9e" stroke-width="1.5" opacity="0.6"/>
  <!-- Hair shine -->
  <ellipse cx="108" cy="78" rx="12" ry="18" fill="#fff" opacity="0.3" class="anime-hair-shine" transform="rotate(15 108 78)"/>
  <ellipse cx="72" cy="75" rx="8" ry="12" fill="#fff" opacity="0.2" class="anime-hair-shine" transform="rotate(-10 72 75)"/>

  <!-- Flower hair accessory -->
  <circle cx="65" cy="62" r="10" fill="#ff9a9e" opacity="0.8"/>
  <circle cx="58" cy="58" r="6" fill="#ffb3b3" opacity="0.7"/>
  <circle cx="72" cy="58" r="6" fill="#ffb3b3" opacity="0.7"/>
  <circle cx="65" cy="64" r="4" fill="#ffeb3b" opacity="0.9"/>

  <!-- Eyes -->
  <g class="anime-eye-blink">
    <!-- Left eye -->
    <ellipse cx="72" cy="100" rx="14" ry="16" fill="#fff"/>
    <ellipse cx="74" cy="100" rx="9" ry="11" fill="url(#eyeGrad)"/>
    <ellipse cx="76" cy="97" rx="4.5" ry="5" fill="#1a1a2e"/>
    <ellipse cx="78" cy="94" rx="2.5" ry="2.5" fill="#fff"/>
    <circle cx="70" cy="92" r="1.5" fill="#fff" opacity="0.7"/>
    <!-- Eyelashes -->
    <path d="M58 90 Q62 82 72 84" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M60 96 Q58 88 66 86" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Right eye -->
    <ellipse cx="108" cy="100" rx="14" ry="16" fill="#fff"/>
    <ellipse cx="106" cy="100" rx="9" ry="11" fill="url(#eyeGrad)"/>
    <ellipse cx="104" cy="97" rx="4.5" ry="5" fill="#1a1a2e"/>
    <ellipse cx="102" cy="94" rx="2.5" ry="2.5" fill="#fff"/>
    <circle cx="110" cy="92" r="1.5" fill="#fff" opacity="0.7"/>
    <!-- Eyelashes -->
    <path d="M122 90 Q118 82 108 84" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M120 96 Q122 88 114 86" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
  </g>

  <!-- Blush -->
  <ellipse cx="60" cy="112" rx="10" ry="5" fill="url(#blushGrad)" class="anime-blush"/>
  <ellipse cx="120" cy="112" rx="10" ry="5" fill="url(#blushGrad)" class="anime-blush"/>

  <!-- Mouth -->
  <path d="M84 118 Q90 124 96 118" fill="none" stroke="#e88b8b" stroke-width="2" stroke-linecap="round"/>
  <!-- Tiny fang -->
  <path d="M86 118 L87 122 L88 118" fill="#fff" stroke="#e88b8b" stroke-width="0.5"/>

  <!-- Eyebrows -->
  <path d="M62 82 Q72 78 82 80" fill="none" stroke="#8b7b8b" stroke-width="2" stroke-linecap="round"/>
  <path d="M118 82 Q108 78 98 80" fill="none" stroke="#8b7b8b" stroke-width="2" stroke-linecap="round"/>

  <!-- Arms -->
  <!-- Left arm -->
  <path d="M62 150 Q48 155 42 165" fill="none" stroke="#fce4d6" stroke-width="10" stroke-linecap="round"/>
  <!-- Right arm (waving hand) -->
  <path d="M118 150 Q132 142 140 135" fill="none" stroke="#fce4d6" stroke-width="10" stroke-linecap="round"/>
  <!-- Right hand -->
  <circle cx="140" cy="133" r="7" fill="#fce4d6"/>

  <!-- Legs -->
  <rect x="72" y="185" width="14" height="12" rx="4" fill="#fce4d6"/>
  <rect x="94" y="185" width="14" height="12" rx="4" fill="#fce4d6"/>
  <!-- Shoes -->
  <ellipse cx="79" cy="199" rx="10" ry="5" fill="#ff9a9e"/>
  <ellipse cx="101" cy="199" rx="10" ry="5" fill="#ff9a9e"/>
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
