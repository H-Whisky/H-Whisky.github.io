/**
 * Enhancement Scripts for H-Whisky's Notebook
 * Reading progress bar, scroll animations, and UX improvements
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========== 1. Reading Progress Bar ==========
  const createProgressBar = () => {
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.prepend(bar);

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  };

  // ========== 2. Scroll-triggered Fade-in Animation ==========
  const initScrollReveal = () => {
    const targets = document.querySelectorAll(
      '.recent-post-item, .card-widget, .article-sort-item, .aside-list-item'
    );

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('visible'));
      return;
    }

    // Add fade-in-up class
    targets.forEach(el => {
      if (!el.classList.contains('fade-in-up')) {
        el.classList.add('fade-in-up');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach(el => observer.observe(el));
  };

  // ========== 3. Hero Parallax Effect ==========
  const initParallax = () => {
    const header = document.getElementById('page-header');
    if (!header || !header.classList.contains('full_page')) return;

    const handleParallax = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > window.innerHeight) return;

      const speed = 0.4;
      const yPos = scrollTop * speed;
      const opacity = 1 - scrollTop / (window.innerHeight * 0.8);

      header.style.backgroundPositionY = yPos + 'px';

      const siteInfo = document.getElementById('site-info');
      if (siteInfo) {
        siteInfo.style.opacity = Math.max(0, opacity);
        siteInfo.style.transform = `translateY(${scrollTop * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
  };

  // ========== 4. Enhanced Back-to-Top Button ==========
  const enhanceBackToTop = () => {
    const goUpBtn = document.getElementById('go-up');
    if (!goUpBtn) return;

    // Show/hide with smooth opacity
    const toggleVisibility = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const shouldShow = scrollTop > 300;

      if (shouldShow) {
        goUpBtn.style.opacity = '0.8';
        goUpBtn.style.pointerEvents = 'auto';
      } else {
        goUpBtn.style.opacity = '0';
        goUpBtn.style.pointerEvents = 'none';
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  };

  // ========== 5. Dark Mode Toggle Animation ==========
  const enhanceDarkModeToggle = () => {
    const darkBtn = document.getElementById('darkmode');
    if (!darkBtn) return;

    darkBtn.addEventListener('click', () => {
      // Add a brief transition overlay to prevent flash
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 99999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.15s ease;
      `;
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = '0.08';
      });

      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 150);
      }, 150);
    });
  };

  // ========== 6. External Link Handling ==========
  const handleExternalLinks = () => {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.hostname.includes('h-whisky.github.io') &&
          !link.hostname.includes('github.com/H-Whisky')) {
        link.setAttribute('rel', 'noopener noreferrer');
        if (!link.hasAttribute('target')) {
          link.setAttribute('target', '_blank');
        }
      }
    });
  };

  // ========== 7. Image Loading Enhancement ==========
  const enhanceImages = () => {
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  };

  // ========== 8. Keyboard Navigation Enhancement ==========
  const enhanceKeyboardNav = () => {
    document.addEventListener('keydown', (e) => {
      // Escape to close sidebar
      if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar-menus');
        if (sidebar && sidebar.classList.contains('open')) {
          document.getElementById('menu-mask').click();
        }
      }
    });
  };

  // ========== Initialize All Enhancements ==========
  createProgressBar();
  initScrollReveal();
  initParallax();
  enhanceBackToTop();
  enhanceDarkModeToggle();
  handleExternalLinks();
  enhanceImages();
  enhanceKeyboardNav();
});
