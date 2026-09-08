/**
 * SNDR. Outbound Assistant Landing Page Scripts
 * Premium Interactivity, Animations, and Simulations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Each init is independent (theme toggle, the various interactive demos,
  // the scroll-reveal system) — one throwing should never take the rest
  // down with it, since a single broken widget silently killing every init
  // after it in the list is a much worse failure than that one widget not
  // working.
  const steps = [initThemeToggle, initSimulator, initSandbox, initBentoWidgets, initCVMatcher, initModals, initScrollReveal, init3DParallax];
  steps.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('[SNDR] Init step failed:', fn.name, e);
    }
  });
});


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
  const dropHint = core ? core.querySelector('.drop-hint') : null;

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

  function compileOutbound(name) {
    const data = outboundHooks[name];
    if (!data) return;

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

  const leads = shelf.querySelectorAll('.drag-lead');

  // HTML5 drag-and-drop (dragstart/dragover/drop below) has no touch
  // equivalent — it simply never fires on a phone, so "drag a profile onto
  // the core" was a dead, unusable demo for every touch visitor with no
  // indication anything was wrong. A tap does the same compile immediately,
  // so it works everywhere; mouse users keep the drag interaction untouched.
  leads.forEach(lead => {
    lead.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', lead.getAttribute('data-name'));
      document.body.classList.add('dragging-active');
    });

    lead.addEventListener('dragend', () => {
      document.body.classList.remove('dragging-active');
    });

    lead.addEventListener('click', () => {
      compileOutbound(lead.getAttribute('data-name'));
    });
  });

  if (dropHint && window.matchMedia('(hover: none), (pointer: coarse)').matches) {
    dropHint.textContent = 'Tap a profile to compile email';
  }

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
    compileOutbound(e.dataTransfer.getData('text/plain'));
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
      btn.innerHTML = `<span class="material-symbols-outlined placeholder-pulse">sync</span><span>Finding...</span>`;

      setTimeout(() => {
        btn.innerHTML = `<span class="material-symbols-outlined">verified</span><span>Found</span>`;
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
      }, 900);
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
      
      // Update with the first match
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
          a.href = 'sndr-extension.zip?v=2.4.30&t=' + Date.now();
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

  // Mobile browsers report scroll position in large, uneven jumps during
  // momentum/fling scrolling (compounded by the address bar hiding/showing,
  // which changes the real viewport height mid-scroll) instead of the smooth
  // per-frame deltas desktop wheel scrolling gives ScrollTrigger. For a
  // scrubbed + pinned timeline like the intro below, that means the actual
  // native scroll can leap clean past the pin's release point between two
  // touchmove events even though the math (pin distance, snap, buffer) is
  // correct — no amount of tuning end/snap fixes a problem that's really
  // about *how* the scroll position itself arrives. normalizeScroll fixes
  // this at the source by simulating scrolling via transforms on touch
  // devices instead of trusting the browser's native touch-scroll deltas.
  if (ScrollTrigger.isTouch) {
    ScrollTrigger.normalizeScroll(true);
  }

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

  // Section: About SNDR
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 95%',
      end: 'top 50%',
      scrub: 0.8
    }
  });
  aboutTl.fromTo('#about > .container',
    { rotationX: -30, opacity: 0, z: -100, transformOrigin: 'top center' },
    { rotationX: 0, opacity: 1, z: 0, duration: 1.0, ease: 'power1.out' }
  )
  .fromTo('#about .section-intro', { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
  .fromTo('#about .about-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');

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
