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

  // ========== Faye Valentine Character Image ==========
  const FAYE_IMAGE = `<img class="anime-char" src="/img/faye_valentine.png" alt="Faye Valentine" onerror="this.style.display='none'">`;

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
    toggle.innerHTML = FAYE_IMAGE;

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
