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
  initSFX();
  init3DParallax();
  initHapticClicks();
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
  const radarOverlay = document.getElementById('sonar-radar');

  if (scrapeBtn && detailsBox) {
    scrapeBtn.addEventListener('click', function() {
      const btn = this;
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined placeholder-pulse">sync</span><span>Scraping...</span>`;

      // Play looping scrape sound
      playSFX('scrape');

      // Show radar overlay scanning effect
      if (radarOverlay) {
        radarOverlay.style.display = 'flex';
        setTimeout(() => {
          radarOverlay.classList.add('active');
          radarOverlay.querySelectorAll('.radar-blip').forEach(blip => blip.classList.add('active'));
        }, 50);
      }

      setTimeout(() => {
        btn.innerHTML = `<span class="material-symbols-outlined">verified</span><span>Scraped</span>`;
        btn.style.background = 'linear-gradient(135deg, var(--tertiary) 0%, #10b981 100%)';
        
        // Hide radar
        if (radarOverlay) {
          radarOverlay.classList.remove('active');
          setTimeout(() => { radarOverlay.style.display = 'none'; }, 300);
        }

        // Play success chime
        playSFX('success');

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
      }, 2200);
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
  let gaugeInterval = null;

  if (!sheet || !chatbotFeed) return;

  const dataTemplates = {
    tanishq: {
      name: "Tanishq Ray",
      email: "tanishq.ray@srcc.du.ac.in",
      cvHtml: `
        <div class="cv-hero">
          <div class="cv-initials finance">TR</div>
          <div class="cv-title-block">
            <h4>Tanishq Ray</h4>
            <p class="cv-subtitle">B.Com (Hons) | SRCC Delhi</p>
          </div>
        </div>
        <div class="cv-body-grid">
          <div class="cv-col">
            <h5 class="cv-section-title">Core Skills</h5>
            <div class="cv-skills-pills">
              <span class="cv-skill-pill">Valuation Models</span>
              <span class="cv-skill-pill">Financial Analysis</span>
              <span class="cv-skill-pill">Excel Forecasting</span>
              <span class="cv-skill-pill">Outbound Outreach</span>
            </div>
          </div>
          <div class="cv-col">
            <h5 class="cv-section-title">Projects</h5>
            <ul class="cv-projects-list">
              <li><strong>Outbound portfolio modeling</strong> - Automated growth analytics.</li>
              <li><strong>R-code database analytics</strong> - Treasury query builder.</li>
            </ul>
          </div>
        </div>
      `,
      chat: [
        { type: 'bot', text: 'Analyzing Tanishq Ray\'s profile...' },
        { type: 'bot', text: 'Education: SRCC Finance. Key strength: valuation formulas & Excel forecasting models.' },
        { type: 'bot', text: 'Target matches identified: SaaSFlow (financial forecasting hand needed) and Razorpay (treasury intern role).' }
      ],
      matches: [
        {
          company: 'SaaSFlow',
          role: 'Finance Analyst Intern',
          score: '94% Match',
          toVal: 'Arnav (SaaSFlow Finance)',
          subjectVal: 'SaaSFlow Finance Intern Application',
          draft: "Dear Arnav,\n\nI noticed SaaSFlow's expanding financial planning and forecasting needs. As a Finance honors student at SRCC, I've built portfolio models that automate forecasting limits. I'd love to pitch my analytical support as a finance analyst intern."
        },
        {
          company: 'Razorpay',
          role: 'Treasury Analyst Intern',
          score: '89% Match',
          toVal: 'Saksham (Razorpay Treasury)',
          subjectVal: 'SRCC Finance Intern Application',
          draft: "Dear Saksham,\n\nI noticed Razorpay's scaling transaction treasury operations. As a Finance honors student at SRCC, I've built portfolio models that automate forecasting limits. I'd love to pitch my analytical support as a treasury analyst intern."
        }
      ]
    },
    saksham: {
      name: "Saksham",
      email: "saksham.cse@iitb.ac.in",
      cvHtml: `
        <div class="cv-hero">
          <div class="cv-initials tech">S</div>
          <div class="cv-title-block">
            <h4>Saksham</h4>
            <p class="cv-subtitle">B.Tech CSE | IIT Bombay</p>
          </div>
        </div>
        <div class="cv-body-grid">
          <div class="cv-col">
            <h5 class="cv-section-title">Core Skills</h5>
            <div class="cv-skills-pills">
              <span class="cv-skill-pill">React</span>
              <span class="cv-skill-pill">Node.js</span>
              <span class="cv-skill-pill">WebAssembly</span>
              <span class="cv-skill-pill">Distributed Locks</span>
              <span class="cv-skill-pill">DB Indexing</span>
            </div>
          </div>
          <div class="cv-col">
            <h5 class="cv-section-title">Projects</h5>
            <ul class="cv-projects-list">
              <li><strong>Raft consensus engine</strong> - Distributed state sync.</li>
              <li><strong>Vite build automation</strong> - Bundler optimization.</li>
            </ul>
          </div>
        </div>
      `,
      chat: [
        { type: 'bot', text: 'Analyzing Saksham\'s profile...' },
        { type: 'bot', text: 'Education: IIT Bombay CSE. Key strength: distributed systems, React interfaces, WebAssembly compilers.' },
        { type: 'bot', text: 'Target matches identified: SaaSFlow (Engineering division) and Razorpay (API integration group).' }
      ],
      matches: [
        {
          company: 'SaaSFlow',
          role: 'Frontend Architect Intern',
          score: '96% Match',
          toVal: 'Arnav (SaaSFlow Engineering)',
          subjectVal: 'IIT Bombay CSE Intern Outbound',
          draft: "Hi Arnav,\n\nSaw SaaSFlow's development updates. I built a Raft consensus engine dashboard using React and custom Outfit grids. I'd love to explore joining your engineering team as a React frontend intern."
        },
        {
          company: 'Razorpay',
          role: 'Backend API Engineering Intern',
          score: '92% Match',
          toVal: 'Saksham (Razorpay API Integration)',
          subjectVal: 'IIT Bombay CSE Backend Application',
          draft: "Dear Saksham,\n\nI noticed Razorpay's expanding backend API engineering group. As a Computer Science student at IIT Bombay with experience in distributed locks and database indexing, I'd love to explore joining your team as a backend API intern."
        }
      ]
    }
  };

  // Typing indicator helper
  function appendTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-bubble bot typing-indicator';
    indicator.id = 'chatbot-typing-indicator';
    indicator.innerHTML = `
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    `;
    chatbotFeed.appendChild(indicator);
    chatbotFeed.scrollTop = chatbotFeed.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chatbot-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function updateActiveMatch(match) {
    if (!match) return;
    
    // Update Pitch draft composer fields
    targetHeader.textContent = `New Message (Pitch for ${match.company})`;
    document.getElementById('composer-to-val').textContent = match.toVal;
    document.getElementById('composer-subject-val').textContent = match.subjectVal;
    draftBox.textContent = match.draft;

    // Animate profile fit circular gauge and score val
    const matchScoreVal = parseInt(match.score) || 0;
    const gaugeFill = document.getElementById('cv-match-gauge-fill');
    const gaugeVal = document.getElementById('cv-match-gauge-val');
    
    if (gaugeFill && gaugeVal) {
      if (gaugeInterval) clearInterval(gaugeInterval);
      let currentVal = 0;
      gaugeFill.style.strokeDasharray = '0, 100';
      
      gaugeInterval = setInterval(() => {
        currentVal += 2;
        if (currentVal >= matchScoreVal) {
          currentVal = matchScoreVal;
          clearInterval(gaugeInterval);
        }
        gaugeVal.textContent = `${currentVal}%`;
        
        const fillPct = currentVal * 0.75;
        gaugeFill.style.strokeDasharray = `${fillPct}, 100`;
      }, 15);
    }

    // Animate composer entry
    gsap.fromTo('.email-composer',
      { opacity: 0.95, y: 5 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' }
    );
  }

  function renderCV(key) {
    const info = dataTemplates[key];
    if (!info) return;

    // Clear any active gauge animation
    if (gaugeInterval) {
      clearInterval(gaugeInterval);
      gaugeInterval = null;
    }

    // Render left sheet
    sheet.innerHTML = info.cvHtml;

    // Stream chatbot bubbles
    chatbotFeed.innerHTML = '';
    
    // Add user query bubble first
    const queryBubble = document.createElement('div');
    queryBubble.className = 'chat-bubble user';
    queryBubble.textContent = `Map matching roles for ${info.name}.`;
    chatbotFeed.appendChild(queryBubble);

    // Initial typing indicator
    setTimeout(() => {
      appendTypingIndicator();
    }, 300);

    // Stream bot answers with delay
    info.chat.forEach((msg, idx) => {
      setTimeout(() => {
        removeTypingIndicator();
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble bot';
        bubble.textContent = msg.text;
        chatbotFeed.appendChild(bubble);
        chatbotFeed.scrollTop = chatbotFeed.scrollHeight;
        
        if (idx < info.chat.length - 1) {
          setTimeout(() => {
            appendTypingIndicator();
          }, 200);
        }
      }, (idx + 1) * 1000);
    });

    // Render matches and composer
    setTimeout(() => {
      matchBox.innerHTML = '';
      info.matches.forEach((m, mIdx) => {
        const mNode = document.createElement('div');
        mNode.className = `company-match-card${mIdx === 0 ? ' active' : ''}`;
        mNode.innerHTML = `
          <div class="company-logo-avatar">${m.company.charAt(0)}</div>
          <div class="company-match-info">
            <h6>${m.company}</h6>
            <p>${m.role}</p>
          </div>
        `;
        matchBox.appendChild(mNode);

        // Click handler to select target match
        mNode.addEventListener('click', () => {
          const siblings = matchBox.querySelectorAll('.company-match-card');
          siblings.forEach(sibling => sibling.classList.remove('active'));
          mNode.classList.add('active');
          playSFX('match');
          updateActiveMatch(m);
        });

        // GSAP animate each card in
        gsap.from(mNode, {
          opacity: 0,
          x: 15,
          duration: 0.4,
          delay: mIdx * 0.1,
          ease: 'power2.out'
        });
      });
      
      // Update with the first match and play sound
      playSFX('match');
      updateActiveMatch(info.matches[0]);
    }, 3200);
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
      
      const modalTitle = document.getElementById('modal-title');
      const modalBodyText = document.getElementById('modal-body-text');
      
      // Determine if they clicked "Add to Chrome" directly
      const isChromeBtn = this.id === 'hero-chrome-btn' || (this.classList.contains('hover-glare') && !this.closest('.pricing-card'));
      
      if (isChromeBtn) {
        if (modalTitle) modalTitle.textContent = 'Install SNDR. Extension';
        if (modalBodyText) modalBodyText.innerHTML = 'Setting up your browser extension workspace...';
      } else {
        // Determine plan name
        let plan = 'Pro';
        const pricingCard = this.closest('.pricing-card');
        if (pricingCard) {
          const header = pricingCard.querySelector('.card-plan-header h3');
          if (header) plan = header.textContent;
        }
        if (modalTitle) modalTitle.textContent = `Launch SNDR. ${plan}`;
        if (modalBodyText) modalBodyText.innerHTML = `You have selected the <strong id="modal-plan-name">${plan}</strong> plan. Setting up your browser extension workspace...`;
      }
      
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

          // Trigger download of the zip file. Append a unique cache-busting token
          // so the browser never serves a stale copy of a previously downloaded zip
          // (the filename is fixed, so without this some browsers reuse the old file).
          const a = document.createElement('a');
          a.href = 'sndr-extension.zip?v=2.4.2&t=' + Date.now();
          a.download = 'sndr-extension.zip';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

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
    const hero = document.querySelector('.hero');
    const pixels = document.querySelectorAll('.large-logo .pixel');

    if (wrapper && logo && hero && pixels.length > 0) {
      // Force ScrollTrigger to refresh first so positions are resolved accurately
      ScrollTrigger.refresh();

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

      // Fade out scroll down hint and tagline immediately
      introTl.to(['.scroll-down-hint', '.intro-tagline'], {
        opacity: 0,
        y: 15,
        duration: 0.2
      }, 0);

      // Animate each pixel dispersing radially
      pixels.forEach(pixel => {
        const gx = parseFloat(pixel.getAttribute('data-origin-x'));
        const gy = parseFloat(pixel.getAttribute('data-origin-y'));
        
        // Center of the logo grid is (12, 2)
        const cx = 12;
        const cy = 2;
        
        let dx = gx - cx;
        let dy = gy - cy;
        
        // Failsafe for exactly center pixels
        if (dx === 0 && dy === 0) {
          const angle = Math.random() * Math.PI * 2;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
        }
        
        // Calculate distance from center to determine stagger delay
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // Radial blast targets - extremely large offset to cover the whole screen
        const blastDistance = 1500 + Math.random() * 2500; 
        const targetX = Math.cos(angle) * blastDistance;
        const targetY = Math.sin(angle) * blastDistance;
        
        // Stagger delay based on distance (ripple outward effect)
        const delay = distance * 0.03; 
        
        introTl.to(pixel, {
          x: targetX,
          y: targetY,
          rotation: gsap.utils.random(-360, 360),
          scale: gsap.utils.random(3, 6),
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, delay);
      });

      // Fade out the logo container overlay as pixels scatter
      introTl.to('.logo-transform-container', {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.8,
        ease: 'power2.inOut'
      }, 0.2);

      // Reveal glass-nav and hero components
      introTl.to('.glass-nav', {
        opacity: 1,
        y: 0,
        pointerEvents: 'auto',
        duration: 0.5,
        ease: 'power2.out'
      }, 0.5);

      introTl.to('.hero-text-content', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.5);

      introTl.to('.hero-simulator', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.6);

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

/* ==========================================
   Dynamic Web Audio API Synthesizer & SFX Toggle
   ========================================== */
let sfxEnabled = true;

function initSFX() {
  const sfxBtn = document.getElementById('sfx-toggle');
  if (sfxBtn) {
    const sfxOnIcon = sfxBtn.querySelector('.sfx-on-icon');
    const sfxOffIcon = sfxBtn.querySelector('.sfx-off-icon');
    sfxBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) {
        sfxOnIcon.style.display = 'inline-block';
        sfxOffIcon.style.display = 'none';
        playSFX('click');
      } else {
        sfxOnIcon.style.display = 'none';
        sfxOffIcon.style.display = 'inline-block';
      }
    });
  }
}

function playSFX(type) {
  if (!sfxEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'click') {
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'scrape') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.45);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'match') {
      // Dual note chord chime
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'success') {
      // Satisfying pleasant rising major chord
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const oNode = ctx.createOscillator();
        const gNode = ctx.createGain();
        oNode.connect(gNode);
        gNode.connect(ctx.destination);
        oNode.frequency.setValueAtTime(freq, now + idx * 0.06);
        gNode.gain.setValueAtTime(0.035, now + idx * 0.06);
        gNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);
        oNode.start(now + idx * 0.06);
        oNode.stop(now + idx * 0.06 + 0.28);
      });
    }
  } catch (err) {
    console.warn('Web Audio synthesis failed:', err.message);
  }
}

/* ==========================================
   3D Parallax Tilt Hover Effect
   ========================================== */
function init3DParallax() {
  const sim = document.querySelector('.hero-simulator');
  if (sim) {
    const parallaxLayers = sim.querySelectorAll('.layer-parallax');
    
    sim.addEventListener('mousemove', (e) => {
      const rect = sim.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const angleX = (yc - y) / 40;
      const angleY = (x - xc) / 40;
      
      sim.style.transform = `perspective(1200px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      
      parallaxLayers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 30;
        const px = (x - xc) * (depth / 1500);
        const py = (y - yc) * (depth / 1500);
        layer.style.transform = `translate3d(${px}px, ${py}px, ${depth}px)`;
      });
    });
    
    sim.addEventListener('mouseleave', () => {
      sim.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      parallaxLayers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-depth')) || 30;
        layer.style.transform = `translate3d(0px, 0px, ${depth}px)`;
      });
    });
    
    // Also style default state of parallax layers to be positioned in Z depth
    parallaxLayers.forEach(layer => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 30;
      layer.style.transform = `translate3d(0px, 0px, ${depth}px)`;
    });
  }
}

/* ==========================================
   Generic Sound UI feedback trigger
   ========================================== */
function initHapticClicks() {
  // Trigger soft clicks on all primary UI elements
  const interactiveNodes = document.querySelectorAll(
    'a, button, .cv-select-tab, .sim-nav-item, .drag-lead, .chart-toggle-btn'
  );
  interactiveNodes.forEach(node => {
    node.addEventListener('click', () => {
      playSFX('click');
    });
  });
}
