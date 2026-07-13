/**
 * Chatbot Widget for H-Whisky's Notebook
 * Floating chat button + expandable AI chat panel
 */
(function () {
  'use strict';

  // ========== Configuration ==========
  const CONFIG = {
    // Set your API endpoint here. Supports OpenAI-compatible APIs.
    // Examples: DeepSeek, OpenAI, 通义千问, etc.
    apiEndpoint: '',          // e.g., 'https://api.deepseek.com/v1/chat/completions'
    apiKey: '',               // Your API key
    model: 'deepseek-chat',   // Model name
    botName: 'Whisky Bot',
    welcomeMsg: '你好！我是 Whisky Bot 👋\n\n你可以问我关于这个博客的任何问题，比如：',
    quickReplies: [
      '最近有什么新文章？',
      '介绍一下这个博客',
      'PMP是什么？',
      '2026世界杯谁赢了？'
    ],
    placeholder: '输入消息...',
    systemPrompt: '你是 H-Whisky 博客的智能助手。这个博客记录城市记忆、学习笔记和生活见闻。请用中文友好地回答用户问题。博客有4篇文章：2026世界杯赛况、城市记忆-泰州、学习笔记-PMP、城市记忆-南京。'
  };

  // ========== DOM Structure ==========
  function createChatbot() {
    // Toggle button
    const toggle = document.createElement('button');
    toggle.id = 'chatbot-toggle';
    toggle.setAttribute('aria-label', 'Open chat');
    toggle.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`;

    // Chat panel
    const panel = document.createElement('div');
    panel.id = 'chatbot-panel';
    panel.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-avatar">🤖</div>
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
    return { toggle, panel };
  }

  // ========== Chat Logic ==========
  function initChat() {
    const { toggle, panel } = createChatbot();
    const messagesEl = document.getElementById('chatbot-messages');
    const inputEl = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const closeBtn = panel.querySelector('.chatbot-close');
    let isOpen = false;
    let isTyping = false;

    // Toggle panel
    function openPanel() {
      isOpen = true;
      panel.classList.add('open');
      toggle.classList.add('active');
      inputEl.focus();
    }

    function closePanel() {
      isOpen = false;
      panel.classList.remove('open');
      toggle.classList.remove('active');
    }

    toggle.addEventListener('click', () => {
      isOpen ? closePanel() : openPanel();
    });

    closeBtn.addEventListener('click', closePanel);

    // Add message
    function addMessage(text, type) {
      const msg = document.createElement('div');
      msg.className = `chatbot-message ${type}`;

      if (type === 'bot') {
        msg.innerHTML = `
          <div class="chatbot-avatar-small">🤖</div>
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
          // Remove quick replies after selection
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
        <div class="chatbot-avatar-small">🤖</div>
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
      // If no API configured, use local responses
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
        return '抱歉，AI 服务暂时不可用。请检查 API 配置或稍后再试。\n\n你可以在聊天框配置中设置你的 API Key。';
      }
    }

    // Get recent message history (last 10 messages)
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

    // Local fallback responses
    function getLocalResponse(msg) {
      const lower = msg.toLowerCase();
      if (lower.includes('文章') || lower.includes('post') || lower.includes('最近')) {
        return '博客目前有 4 篇文章哦：\n\n⚽ **2026世界杯赛况** — 最新世界杯战报\n🏙️ **城市记忆-泰州** — 家乡千年古镇\n📚 **学习笔记-PMP** — PMP备考笔记\n🏙️ **城市记忆-南京** — 南京骑行记录\n\n你想了解哪一篇呢？';
      }
      if (lower.includes('博客') || lower.includes('blog') || lower.includes('介绍')) {
        return '这是 **H-Whisky 的笔记本** 📓\n\n一个记录城市记忆、学习笔记和生活见闻的个人博客。基于 Hexo + Butterfly 主题构建，托管在 GitHub Pages。';
      }
      if (lower.includes('pmp') || lower.includes('项目管理')) {
        return '博客里有一篇 **学习笔记-PMP** 文章，涵盖了：\n\n📌 5大过程组（启动、规划、执行、监控、收尾）\n📌 10大知识领域\n📌 挣值管理公式\n📌 敏捷宣言与十二大原则\n\n需要我详细解释某个概念吗？';
      }
      if (lower.includes('世界杯') || lower.includes('world cup') || lower.includes('2026')) {
        return '2026世界杯正在火热进行中！🔥\n\n目前已进入四分之一决赛阶段：\n🏆 法国 vs 摩洛哥\n🏆 西班牙 vs 比利时\n🏆 挪威 vs 英格兰\n🏆 阿根廷 vs 瑞士\n\n挪威队爆冷淘汰了巴西，C罗已经告别世界杯舞台...';
      }
      if (lower.includes('南京') || lower.includes('nanjing')) {
        return '博主在南京生活过，记录了江宁方山、江心洲骑行、牛首山等地的城市记忆 🚴';
      }
      if (lower.includes('泰州') || lower.includes('taizhou') || lower.includes('溱潼')) {
        return '泰州是博主的家乡，千年古镇溱潼就坐落于此 🏘️ 文章里有家乡的照片和回忆。';
      }
      if (lower.includes('你好') || lower.includes('hello') || lower.includes('hi')) {
        return '你好呀！😊 有什么我可以帮你的吗？';
      }
      if (lower.includes('谢谢') || lower.includes('thank')) {
        return '不客气！随时欢迎来聊天 💙';
      }
      return '收到你的消息了～不过我还不太理解 😅\n\n试试问我这些：\n• "最近有什么新文章？"\n• "介绍一下这个博客"\n• "2026世界杯怎么样了？"\n• "PMP是什么？"';
    }

    // Send message
    async function sendMessage(text) {
      if (!text.trim() || isTyping) return;

      // Clear quick replies
      const quickReplies = messagesEl.querySelectorAll('.chatbot-quick-replies');
      quickReplies.forEach(el => {
        const parent = el.closest('.chatbot-message');
        if (parent) parent.remove();
      });

      addMessage(text, 'user');
      inputEl.value = '';
      showTyping();

      // Small delay for natural feel
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

      const reply = await callAI(text);
      hideTyping();
      addMessage(reply, 'bot');
    }

    // Event listeners
    sendBtn.addEventListener('click', () => sendMessage(inputEl.value));
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value);
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
        toggle.focus();
      }
    });

    // Welcome message
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
