/**
 * SNDR. Outbound Assistant Landing Page Scripts
 * Premium Interactivity, Animations, and Simulations
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCustomCursor();
  initThemeToggle();
  initSimulator();
  initSandbox();
  initBentoWidgets();
  initCVMatcher();
  initModals();
  initScrollReveal();
});

/* ==========================================
   1. Canvas Particle Background
   ========================================== */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(0, 90, 194, 0.2)';
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(Math.floor((width * height) / 15000), 80);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const connectionColor = isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0, 90, 194, 0.03)';
    const maxDistance = 120;

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = connectionColor;
          ctx.lineWidth = 1 - dist / maxDistance;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   2. Magnetic Custom Cursor
   ========================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Follower lag animation loop
  function updateFollower() {
    const dx = mouseX - followerX;
    const dy = mouseY - followerY;
    
    followerX += dx * 0.15;
    followerY += dy * 0.15;
    
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Highlight effect on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, [draggable="true"]');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });
  });
}

/* ==========================================
   3. Light/Dark Theme Switcher
   ========================================== */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  toggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ==========================================
   4. Campaign Outbound Simulator
   ========================================== */
function initSimulator() {
  const startBtn = document.getElementById('start-sim-btn');
  const resetBtn = document.getElementById('reset-sim-btn');
  const composer = document.getElementById('sim-composer');
  const stream = document.getElementById('sim-stream');
  const analytics = document.getElementById('sim-analytics');
  const statusEl = document.getElementById('sim-status');
  const counterEl = document.getElementById('stream-counter');
  const cardsContainer = document.getElementById('stream-cards-container');
  const progressBar = document.getElementById('analytics-progress');
  const percentageEl = document.getElementById('analytics-percentage');

  if (!startBtn) return;

  const sampleLeads = [
    { name: 'Arnav', role: 'Founder @ SaaSFlow', delay: 1000 },
    { name: 'Saksham', role: 'HR Lead @ Razorpay', delay: 2200 },
    { name: 'Manit', role: 'Professor @ IIT Bombay', delay: 3400 }
  ];

  let simTimeouts = [];

  startBtn.addEventListener('click', () => {
    // Phase 1: Sending -> Stream phase
    composer.classList.add('hidden');
    stream.classList.remove('hidden');
    statusEl.textContent = 'Active';
    statusEl.style.color = '#10b981';
    statusEl.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';

    cardsContainer.innerHTML = '';
    counterEl.textContent = '0/3';

    // Simulate lead generation cards sequentially
    sampleLeads.forEach((lead, index) => {
      let t = setTimeout(() => {
        const card = document.createElement('div');
        card.className = 'sim-lead-card';
        card.innerHTML = `
          <div class="lead-pfp">${lead.name[0]}</div>
          <div class="lead-body">
            <h5>${lead.name}</h5>
            <p>${lead.role}</p>
          </div>
          <div class="lead-status" id="lead-status-${index}">Processing</div>
        `;
        cardsContainer.appendChild(card);
        cardsContainer.scrollTop = cardsContainer.scrollHeight;
        counterEl.textContent = `${index + 1}/3`;

        // Mock pitch validation success status
        let tStatus = setTimeout(() => {
          const statusNode = document.getElementById(`lead-status-${index}`);
          if (statusNode) {
            statusNode.textContent = 'Delivered';
            statusNode.classList.add('success');
          }
        }, 800);
        simTimeouts.push(tStatus);

      }, lead.delay);
      simTimeouts.push(t);
    });

    // Phase 2: Transits to Analytics
    let tEnd = setTimeout(() => {
      stream.classList.add('hidden');
      analytics.classList.remove('hidden');
      statusEl.textContent = 'Complete';
      
      // Animate progress circle & number percentage counters
      let percent = 0;
      let interval = setInterval(() => {
        percent += 2;
        percentageEl.textContent = `${percent}%`;
        if (progressBar) {
          // Calculate circle path circumference dash offset
          const dashLen = 2 * Math.PI * 15.9155; // ~100
          progressBar.style.strokeDasharray = `${(percent / 100) * dashLen}, 100`;
        }
        if (percent >= 100) {
          clearInterval(interval);
        }
      }, 20);

    }, 4800);
    simTimeouts.push(tEnd);
  });

  resetBtn.addEventListener('click', () => {
    // Clear timeouts
    simTimeouts.forEach(clearTimeout);
    simTimeouts = [];

    analytics.classList.add('hidden');
    stream.classList.add('hidden');
    composer.classList.remove('hidden');
    statusEl.textContent = 'Idle';
    statusEl.style.color = 'var(--primary)';
    statusEl.style.backgroundColor = 'var(--pfp-bg)';
    percentageEl.textContent = '0%';
    if (progressBar) progressBar.style.strokeDasharray = '0, 100';
  });
}

/* ==========================================
   5. Drag-and-Drop Outreach Sandbox
   ========================================== */
function initSandbox() {
  const shelf = document.getElementById('leads-shelf');
  const core = document.getElementById('engine-core');
  const outputPlaceholder = document.querySelector('.output-placeholder');
  const outputCard = document.getElementById('output-card');

  if (!shelf || !core) return;

  const outboundHooks = {
    Arnav: {
      email: 'arnav@saasflow.com',
      hook: 'Hi Arnav, saw SaaSFlow\'s recent update about scaling outbounds. I built a Raft consensus visualization that resolves distributed locks directly. Would love to contribute frontend skills as an intern.'
    },
    Manit: {
      email: 'manit@cse.iitb.ac.in',
      hook: 'Dear Dr. Manit, read your paper on distributed compiler optimization. I\'ve put together a local WebAssembly parser that speeds up code transformations. Hope to explore research assistance opportunities under your guidance.'
    },
    Saksham: {
      email: 'saksham.singh@razorpay.com',
      hook: 'Hi Saksham, noticed you\'re looking for active frontend React interns who build side projects. I built a consensus dashboard utilizing Outfit design grids. I\'d love to sync and pitch my skills for the team.'
    }
  };

  const leads = shelf.querySelectorAll('.drag-lead');

  leads.forEach(lead => {
    lead.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', lead.getAttribute('data-name'));
      document.body.classList.add('dragging-active');
    });

    lead.addEventListener('dragend', () => {
      document.body.classList.remove('dragging-active');
    });
  });

  core.addEventListener('dragover', (e) => {
    e.preventDefault();
    core.classList.add('dragover');
  });

  core.addEventListener('dragleave', () => {
    core.classList.remove('dragover');
  });

  core.addEventListener('drop', (e) => {
    e.preventDefault();
    core.classList.remove('dragover');
    
    const name = e.dataTransfer.getData('text/plain');
    const data = outboundHooks[name];

    if (data) {
      // Hide placeholder and reveal custom card content
      if (outputPlaceholder) outputPlaceholder.classList.add('hidden');
      if (outputCard) {
        outputCard.classList.remove('hidden');
        document.getElementById('out-avatar').textContent = name[0];
        document.getElementById('out-name').textContent = name;
        document.getElementById('out-role').textContent = name === 'Manit' ? 'Professor @ IIT Bombay' : name === 'Arnav' ? 'Founder @ SaaSFlow' : 'HR Lead @ Razorpay';
        document.getElementById('out-email').textContent = data.email;
        document.getElementById('out-hook').textContent = `"${data.hook}"`;
      }

      // Add cool mini bounce animation
      core.style.transform = 'scale(0.95)';
      setTimeout(() => { core.style.transform = 'scale(1)'; }, 150);
    }
  });
}

/* ==========================================
   6. Bento Grid Feature Widgets
   ========================================== */
function initBentoWidgets() {
  // Widget A: Smart Limits Slider
  const slider = document.getElementById('limit-slider');
  const sliderVal = document.getElementById('slider-val');
  const speedBars = document.querySelectorAll('.speed-bar');

  if (slider && sliderVal) {
    slider.addEventListener('input', function() {
      const val = this.value;
      sliderVal.textContent = `${val} emails`;
      
      // Update speedometer indicator bars
      const activeCount = Math.ceil((val / 500) * speedBars.length);
      speedBars.forEach((bar, idx) => {
        if (idx < activeCount) {
          bar.classList.add('active');
        } else {
          bar.classList.remove('active');
        }
      });
    });
  }

  // Widget B: Rates Toggle Chart
  const chartToggles = document.querySelectorAll('.chart-toggle-btn');
  const bars = document.querySelectorAll('.bar-fill');
  const metricNumber = document.getElementById('metric-number');

  const chartData = {
    open: {
      rates: ['92%', '88%', '95%', '98%'],
      avg: '98%',
      heights: ['92%', '88%', '95%', '98%']
    },
    reply: {
      rates: ['58%', '62%', '68%', '64%'],
      avg: '64%',
      heights: ['58%', '62%', '68%', '64%']
    }
  };

  chartToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      chartToggles.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const metric = this.getAttribute('data-metric');
      const data = chartData[metric];

      if (data) {
        metricNumber.textContent = data.avg;
        bars.forEach((bar, idx) => {
          bar.style.height = data.heights[idx];
        });
      }
    });
  });

  // Widget C: Directory Scraper Mockup
  const scrapeBtn = document.getElementById('scrape-elon-btn');
  const detailsBox = document.getElementById('scraped-elon-details');

  if (scrapeBtn && detailsBox) {
    scrapeBtn.addEventListener('click', function() {
      const btn = this;
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined placeholder-pulse">sync</span><span>Scraping...</span>`;

      setTimeout(() => {
        btn.innerHTML = `<span class="material-symbols-outlined">verified</span><span>Scraped</span>`;
        btn.style.background = 'linear-gradient(135deg, var(--tertiary) 0%, #10b981 100%)';
        
        detailsBox.innerHTML = `
          <div class="mock-detail-row">
            <span class="label">Direct:</span>
            <span class="value" style="color:var(--primary); font-weight:700;">mayank@razorpay.com</span>
          </div>
          <div class="mock-detail-row">
            <span class="label">Department:</span>
            <span class="value">Talent Operations</span>
          </div>
        `;
      }, 1500);
    });
  }

  // Widget D: Social Updates social references
  const regenBtn = document.getElementById('regen-hook-btn');
  const textContainer = document.getElementById('typed-hook-example');

  if (regenBtn && textContainer) {
    const sampleHook = "Hi Saksham, noticed you're assembling summer React hands. I built a consensus visualization side project that perfectly fits your front-end team outbound stack. Let me know if you are open to syncing.";
    
    regenBtn.addEventListener('click', () => {
      textContainer.textContent = '';
      regenBtn.disabled = true;
      
      let index = 0;
      function typeText() {
        if (index < sampleHook.length) {
          textContainer.textContent += sampleHook[index];
          index++;
          setTimeout(typeText, 15);
        } else {
          regenBtn.disabled = false;
        }
      }
      typeText();
    });
  }
}

/* ==========================================
   7. CV Matcher & AI Chatbot advisor
   ========================================== */
function initCVMatcher() {
  const tabs = document.querySelectorAll('.cv-select-tab');
  const sheet = document.getElementById('cv-sheet-content');
  const chatbotFeed = document.getElementById('chatbot-feed-container');
  const matchBox = document.getElementById('company-cards-box');
  const draftBox = document.getElementById('cv-draft-text');
  const copyBtn = document.getElementById('cv-copy-btn');
  const targetHeader = document.getElementById('draft-target-name');

  if (!sheet || !chatbotFeed) return;

  const dataTemplates = {
    tanishq: {
      name: "Tanishq Ray",
      email: "tanishq.ray@srcc.du.ac.in",
      cvHtml: `
        <h4>Tanishq Ray</h4>
        <p style="color:var(--tx-muted); margin-bottom:10px;">B.Com (Hons) | SRCC Delhi</p>
        <section>
          <h5>Skills</h5>
          <p>Valuation Models, Financial Analysis, Excel forecasting, outbound outreach</p>
        </section>
        <section>
          <h5>Projects</h5>
          <ul>
            <li>Outbound portfolio modeling</li>
            <li>R-code database analytics</li>
          </ul>
        </section>
      `,
      chat: [
        { type: 'bot', text: 'Analyzing Tanishq Ray\'s profile...' },
        { type: 'bot', text: 'Education: SRCC Finance. Key strength: valuation formulas & Excel forecasting models.' },
        { type: 'bot', text: 'Target matches identified: SaaSFlow (financial forecasting hand needed) and Razorpay (treasury intern role).' }
      ],
      matches: [
        { company: 'SaaSFlow', role: 'Finance Analyst Intern', score: '94% Match' },
        { company: 'Razorpay', role: 'Treasury Analyst Intern', score: '89% Match' }
      ],
      draft: "Subject: SRCC Finance Intern Application\n\nDear Saksham,\n\nI noticed Razorpay's scaling transaction treasury operations. As a Finance honors student at SRCC, I've built portfolio models that automate forecasting limits. I'd love to pitch my analytical support as a treasury analyst intern."
    },
    saksham: {
      name: "Saksham",
      email: "saksham.cse@iitb.ac.in",
      cvHtml: `
        <h4>Saksham</h4>
        <p style="color:var(--tx-muted); margin-bottom:10px;">B.Tech CSE | IIT Bombay</p>
        <section>
          <h5>Skills</h5>
          <p>React, Node.js, WebAssembly compilers, distributed locks, database indexing</p>
        </section>
        <section>
          <h5>Projects</h5>
          <ul>
            <li>Raft distributed consensus engine</li>
            <li>Vite build automation plugin</li>
          </ul>
        </section>
      `,
      chat: [
        { type: 'bot', text: 'Analyzing Saksham\'s profile...' },
        { type: 'bot', text: 'Education: IIT Bombay CSE. Key strength: distributed systems, React interfaces, WebAssembly compilers.' },
        { type: 'bot', text: 'Target matches identified: SaaSFlow (Engineering division) and Razorpay (API integration group).' }
      ],
      matches: [
        { company: 'SaaSFlow', role: 'Frontend Architect Intern', score: '96% Match' },
        { company: 'Razorpay', role: 'Backend API Engineering Intern', score: '92% Match' }
      ],
      draft: "Subject: IIT Bombay CSE Intern Outbound\n\nHi Arnav,\n\nSaw SaaSFlow's development updates. I built a Raft consensus engine dashboard using React and custom Outfit grids. I'd love to explore joining your engineering team as a React frontend intern."
    }
  };

  function renderCV(key) {
    const info = dataTemplates[key];
    if (!info) return;

    // Render left sheet
    sheet.innerHTML = info.cvHtml;

    // Stream chatbot bubbles
    chatbotFeed.innerHTML = '';
    
    // Add user query bubble first
    const queryBubble = document.createElement('div');
    queryBubble.className = 'chat-bubble user';
    queryBubble.textContent = `Map matching roles for ${info.name}.`;
    chatbotFeed.appendChild(queryBubble);

    // Stream bot answers with delay
    info.chat.forEach((msg, idx) => {
      setTimeout(() => {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble bot';
        bubble.textContent = msg.text;
        chatbotFeed.appendChild(bubble);
        chatbotFeed.scrollTop = chatbotFeed.scrollHeight;
      }, (idx + 1) * 900);
    });

    // Render matches
    setTimeout(() => {
      matchBox.innerHTML = '';
      info.matches.forEach(m => {
        const mNode = document.createElement('div');
        mNode.className = 'company-match-card';
        mNode.innerHTML = `
          <div class="company-match-info">
            <h6>${m.company}</h6>
            <p>${m.role}</p>
          </div>
          <span class="match-score">${m.score}</span>
        `;
        matchBox.appendChild(mNode);
      });
      
      // Update Pitch draft Output card
      targetHeader.textContent = `Pitch for ${info.matches[0].company}`;
      draftBox.textContent = info.draft;
    }, 2800);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      renderCV(this.getAttribute('data-sample'));
    });
  });

  // Load first template by default
  renderCV('tanishq');

  // Copy handler
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(draftBox.textContent).then(() => {
        const textSpan = copyBtn.querySelector('span:not(.material-symbols-outlined)');
        if (textSpan) {
          const originalText = textSpan.textContent;
          textSpan.textContent = 'Copied!';
          setTimeout(() => { textSpan.textContent = originalText; }, 1500);
        }
      });
    });
  }
}

/* ==========================================
   8. Checkout/Action Modal Loop
   ========================================== */
function initModals() {
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('close-modal');
  const installBtn = document.getElementById('modal-action-btn');
  const progressFill = document.getElementById('modal-progress-fill');
  const statusText = document.getElementById('modal-status-text');
  const planName = document.getElementById('modal-plan-name');
  
  // Select plan buttons
  const planBtns = document.querySelectorAll('.pricing-btn, nav .primary-btn, .hero-buttons .primary-btn');

  planBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Determine plan name
      let plan = 'Pro';
      const pricingCard = this.closest('.pricing-card');
      if (pricingCard) {
        const header = pricingCard.querySelector('.card-plan-header h3');
        if (header) plan = header.textContent;
      }
      
      if (planName) planName.textContent = plan;
      if (modal) modal.classList.remove('hidden');
      
      // Reset progress
      if (progressFill) progressFill.style.width = '0%';
      if (statusText) statusText.textContent = 'Ready to integrate...';
      if (installBtn) {
        installBtn.disabled = false;
        installBtn.textContent = 'Install Extension';
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  if (installBtn) {
    installBtn.addEventListener('click', function() {
      this.disabled = true;
      let progress = 0;
      
      const states = [
        { threshold: 15, text: 'Resolving chrome extension repository...' },
        { threshold: 45, text: 'Mounting outbound throttling algorithms...' },
        { threshold: 75, text: 'Bundling AI subject templates...' },
        { threshold: 95, text: 'Synchronizing landing variables...' },
        { threshold: 100, text: 'Integration Complete!' }
      ];

      const interval = setInterval(() => {
        progress += 1;
        if (progressFill) progressFill.style.width = `${progress}%`;
        
        const state = states.find(s => progress <= s.threshold);
        if (state && statusText) {
          statusText.textContent = state.text;
        }

        if (progress >= 100) {
          clearInterval(interval);
          installBtn.textContent = 'Installed!';
          setTimeout(() => {
            if (modal) modal.classList.add('hidden');
          }, 800);
        }
      }, 30);
    });
  }
}

/* ==========================================
   9. Founders Canvas initials and Scroll Reveal
   ========================================== */
function initScrollReveal() {
  // Register GSAP ScrollTrigger plugin if available
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Failsafe: make all content visible if GSAP script fails to load
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    document.documentElement.classList.remove('js-active');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Initialize Canvas Avatars for Founders (keep existing logic)
  const canvases = document.querySelectorAll('.founder-avatar-canvas');
  canvases.forEach(canvas => {
    const initials = canvas.getAttribute('data-initials');
    const color = canvas.closest('.founder-card').getAttribute('data-color') || '#005ac2';
    
    const ctx = canvas.getContext('2d');
    canvas.width = 180;
    canvas.height = 180;

    // Background circle
    ctx.beginPath();
    ctx.arc(90, 90, 85, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Text initials
    ctx.font = 'bold 64px Outfit';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 90, 90);
  });

  // Setup animations once page is fully loaded to ensure Y coordinates are fully settled
  if (document.readyState === 'complete') {
    setupGSAPTimelines();
  } else {
    window.addEventListener('load', () => {
      setupGSAPTimelines();
    });
  }
}

function setupGSAPTimelines() {
  console.log('[SNDR] Setting up GSAP Timelines...');
  try {
    // 1. FULL SCREEN SCROLL-MORPH TIMELINE
    const wrapper = document.querySelector('.intro-scroll-wrapper');
    const logo = document.querySelector('.large-logo');
    const heroTitle = document.querySelector('.hero-title');
    const hero = document.querySelector('.hero');
    const rocket = document.getElementById('intro-rocket');

    if (wrapper && logo && heroTitle && hero && rocket) {
      // Force ScrollTrigger to refresh first so positions are resolved accurately
      ScrollTrigger.refresh();

      const rectLogo = logo.getBoundingClientRect();
      const rectWrap = wrapper.getBoundingClientRect();
      const startX = rectLogo.left + rectLogo.width / 2 - rectWrap.left;
      const startY = rectLogo.top + rectLogo.height / 2 - rectWrap.top;

      const rectTitle = heroTitle.getBoundingClientRect();
      const rectHero = hero.getBoundingClientRect();
      const endX = rectTitle.left + rectTitle.width / 2 - rectHero.left;
      const endY = rectTitle.top + rectTitle.height / 2 - rectHero.top;

      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
      const rocketRotation = angle - 45; // adjustment for Google Material Symbol rocket launch icon base orientation

      // Set initial rocket position to be exactly at the center of the logo
      gsap.set(rocket, {
        left: startX,
        top: startY,
        opacity: 0,
        scale: 0.5,
        rotation: rocketRotation,
        xPercent: -50,
        yPercent: -50
      });

      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.intro-scroll-wrapper',
          start: 'top top',
          end: '+=1000', // Pinned duration sequence
          scrub: 0.5,
          pin: true,
          pinSpacing: true
        }
      });

      // Scale down the large SNDR. logo and fade it out
      introTl.to('.large-logo', {
        scale: 0.35,
        y: -20,
        opacity: 0.2,
        filter: 'blur(3px)',
        duration: 0.5,
        ease: 'power1.inOut'
      }, 0);

      // Fade out scroll indicator and tagline quickly
      introTl.to('.scroll-down-hint', {
        opacity: 0,
        y: 15,
        duration: 0.3
      }, 0);

      introTl.to('.intro-tagline', {
        opacity: 0,
        y: 15,
        duration: 0.3
      }, 0);

      // Rocket emerges immediately from the center of the logo as you start scrolling
      introTl.to(rocket, {
        opacity: 1,
        scale: 1.0,
        duration: 0.2,
        ease: 'power1.out'
      }, 0);

      introTl.to('.large-logo', {
        opacity: 0,
        duration: 0.2
      }, 0.25);

      // Rocket trail expands and launches
      introTl.to(rocket.querySelector('.rocket-trail'), {
        height: '50px',
        duration: 0.3
      }, 0.1);

      // Rocket flies towards the hero title "Cold Emailing"
      introTl.to(rocket, {
        left: endX,
        top: endY,
        duration: 0.9,
        ease: 'power1.inOut'
      }, 0.1);

      // Fade out loader background and reveal hero components
      introTl.to('.logo-transform-container', {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.6,
        ease: 'power2.inOut'
      }, 0.3);

      introTl.to('.glass-nav', {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.5,
        ease: 'power2.out'
      }, 0.4);

      introTl.to('.hero-text-content', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.4);

      introTl.to('.hero-simulator', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.5);

      // Rocket landing & impact glow
      introTl.to(rocket, {
        opacity: 0,
        scale: 0.3,
        duration: 0.15
      }, 0.85);

      introTl.to(rocket.querySelector('.rocket-trail'), {
        height: '0px',
        duration: 0.15
      }, 0.85);

      // Trigger sparkle particles on impact
      introTl.call(() => {
        const coldMailing = document.querySelector('.cold-mailing-sparkle');
        if (coldMailing) {
          triggerSparkles(coldMailing);
        }
      }, null, 1.0);

      // Glow effect only on the "Cold Emailing" highlight
      introTl.to('.cold-mailing-sparkle', {
        textShadow: '0 0 25px var(--primary-glow), 0 0 10px var(--primary)',
        duration: 0.3,
        ease: 'power2.out'
      }, 1.0);

      introTl.to('.cold-mailing-sparkle', {
        textShadow: 'none',
        duration: 0.3,
        ease: 'power2.in'
      }, 1.3);

      // Clean up visibility at the end of scrub
      introTl.to('.logo-transform-container', {
        display: 'none',
        duration: 0.1
      }, 1.0);

      introTl.to('.hero', {
        pointerEvents: 'auto',
        duration: 0.1
      }, 1.0);
    }

  // 3. INTERACTIVE 3D SCROLL-SCRUBBED UNFOLDING FOR ALL SECTIONS
  
  // Section A: Outreach Sandbox
  const playgroundTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#playground',
      start: 'top 95%',
      end: 'top 45%',
      scrub: 0.8
    }
  });
  playgroundTl.fromTo('#playground > .container', 
    { rotationX: -30, opacity: 0, z: -100, transformOrigin: 'top center' },
    { rotationX: 0, opacity: 1, z: 0, duration: 1.0, ease: 'power1.out' }
  )
  .fromTo('#playground .section-intro', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
  .fromTo('#playground .sandbox-container', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.6')
  .fromTo('#playground .leads-shelf', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.4')
  .fromTo('#playground .sandbox-dropzone', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.4')
  .fromTo('#playground .sandbox-output', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6 }, '-=0.4');

  // Section B: Bento Grid Features
  const featuresTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#features',
      start: 'top 95%',
      end: 'top 45%',
      scrub: 0.8
    }
  });
  featuresTl.fromTo('#features > .container', 
    { rotationX: -30, opacity: 0, z: -100, transformOrigin: 'top center' },
    { rotationX: 0, opacity: 1, z: 0, duration: 1.0, ease: 'power1.out' }
  )
  .fromTo('#features .section-intro', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
  .fromTo('#features .bento-item', { opacity: 0, y: 50, rotationX: 15 }, { opacity: 1, y: 0, rotationX: 0, stagger: 0.15, duration: 0.8 }, '-=0.6');

  // Section C: CV Matcher Chatbot
  const cvMatcherTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#cv-matcher',
      start: 'top 95%',
      end: 'top 45%',
      scrub: 0.8
    }
  });
  cvMatcherTl.fromTo('#cv-matcher > .container', 
    { rotationX: -30, opacity: 0, z: -100, transformOrigin: 'top center' },
    { rotationX: 0, opacity: 1, z: 0, duration: 1.0, ease: 'power1.out' }
  )
  .fromTo('#cv-matcher .section-intro', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
  .fromTo('#cv-matcher .cv-matcher-container', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');

  // Section D: Pricing
  const pricingTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#pricing',
      start: 'top 95%',
      end: 'top 45%',
      scrub: 0.8
    }
  });
  pricingTl.fromTo('#pricing > .container', 
    { rotationX: -30, opacity: 0, z: -100, transformOrigin: 'top center' },
    { rotationX: 0, opacity: 1, z: 0, duration: 1.0, ease: 'power1.out' }
  )
  .fromTo('#pricing .section-intro', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
  .fromTo('#pricing .pricing-card', { opacity: 0, y: 50, rotationX: 10 }, { opacity: 1, y: 0, rotationX: 0, stagger: 0.15, duration: 0.8 }, '-=0.6');

  // Section E: Founders
  const foundersTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#founders',
      start: 'top 95%',
      end: 'top 50%',
      scrub: 0.8
    }
  });
  foundersTl.fromTo('#founders > .container', 
    { rotationX: -30, opacity: 0, z: -100, transformOrigin: 'top center' },
    { rotationX: 0, opacity: 1, z: 0, duration: 1.0, ease: 'power1.out' }
  )
  .fromTo('#founders .section-intro', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
  .fromTo('#founders .founder-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8 }, '-=0.6');
    console.log('[SNDR] GSAP Timelines setup completed successfully.');
  } catch (error) {
    console.error('[SNDR] Error in GSAP timeline setup:', error);
  }
}

/* ==========================================
   10. Interactive 3D Hover Tilt Effects
   ========================================== */
function initTilt() {
  const elements = document.querySelectorAll('.hover-tilt, .founder-card, .pricing-card');
  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const angleX = (yc - y) / 15;
      const angleY = (x - xc) / 15;
      
      el.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-4px)`;
      el.style.boxShadow = `0 16px 36px rgba(0, 90, 194, 0.12)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      el.style.boxShadow = '';
    });
  });
}

/* ==========================================
   11. Particle Sparkles Burst Effect
   ========================================== */
function triggerSparkles(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const parent = element.offsetParent || document.body;
  const parentRect = parent.getBoundingClientRect();
  
  // Calculate center of element relative to offsetParent
  const centerX = rect.left + rect.width / 2 - parentRect.left;
  const centerY = rect.top + rect.height / 2 - parentRect.top;

  const colors = ['#3b82f6', '#818cf8', '#60a5fa', '#a5b4fc', '#ffffff'];

  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-star';
    sparkle.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" fill="currentColor"/>
      </svg>
    `;
    
    // Style sparkle
    sparkle.style.width = `${Math.random() * 10 + 6}px`;
    sparkle.style.height = sparkle.style.width;
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Position at text center
    sparkle.style.left = `${centerX}px`;
    sparkle.style.top = `${centerY}px`;
    
    parent.appendChild(sparkle);

    // Burst directions
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 25;
    const targetX = centerX + Math.cos(angle) * distance;
    const targetY = centerY + Math.sin(angle) * distance;
    const duration = Math.random() * 0.4 + 0.3;

    gsap.set(sparkle, {
      scale: 0,
      rotation: 0,
      opacity: 1
    });

    gsap.to(sparkle, {
      left: targetX,
      top: targetY,
      scale: Math.random() * 1.0 + 0.5,
      rotation: Math.random() * 360 + 90,
      duration: duration * 0.5,
      ease: 'power1.out',
      onComplete: () => {
        gsap.to(sparkle, {
          opacity: 0,
          scale: 0,
          duration: duration * 0.5,
          ease: 'power1.in',
          onComplete: () => sparkle.remove()
        });
      }
    });
  }
}
