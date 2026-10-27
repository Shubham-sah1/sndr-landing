// SNDR website. Plain script, no libraries: intro, inbox demo, draggable
// windows, self-playing steps and feature tour, live email count, install sheet.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var NAV_H = 68;
  var root = document.documentElement;

  // ── Intro: the pixel logo flies together, then lifts away to the page ──
  // A click on it skips straight to the page.
  var loader = document.getElementById('loader'), introMs = 0;
  (function () {
    var LOGO = 'M0 0h5v1H0zM0 1h1v1H0zM0 2h5v1H0zM4 3h1v1H4zM0 4h5v1H0zM6 0h1v5H6zM7 1h1v1H7zM8 2h1v1H8zM9 3h1v1H9zM10 0h1v5h-1zM12 0h4v1h-4zM12 1h1v3h-1zM16 1h1v3h-1zM12 4h4v1h-4zM18 0h4v1h-4zM18 1h1v4h-1zM22 1h1v1h-1zM19 2h4v1h-4zM21 3h1v1h-1zM22 4h1v1h-1z';
    var on = {};
    LOGO.split('z').forEach(function (seg) {
      var m = seg.match(/M(\d+) (\d+)h(-?\d+)v(\d+)/); if (!m) return;
      var x = +m[1], y = +m[2], w = +m[3], h = +m[4], x0 = w < 0 ? x + w : x, x1 = w < 0 ? x : x + w;
      for (var i = x0; i < x1; i++) for (var j = y; j < y + h; j++) on[i + ',' + j] = 1;
    });
    var px = document.getElementById('px'), cells = [];
    for (var y = 0; y < 5; y++) for (var x = 0; x < 25; x++) {
      var c = document.createElement('i');
      if (on[x + ',' + y]) { c.className = 'on'; cells.push(c); }
      if (x === 24 && y === 4) { c.className = 'dot'; cells.push(c); }
      px.appendChild(c);
    }
    if (reduce || !loader.animate) { loader.remove(); return; }
    introMs = 2200;
    root.style.overflow = 'hidden'; root.classList.add('intro');
    cells.forEach(function (c) {
      var dx = ((Math.random() - 0.5) * 800).toFixed(0), dy = ((Math.random() - 0.5) * 500).toFixed(0), r = ((Math.random() - 0.5) * 300).toFixed(0);
      c.animate([{ transform: 'translate(' + dx + 'px, ' + dy + 'px) rotate(' + r + 'deg)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: 800, delay: Math.random() * 400, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    });
    var lifted = false;
    // The finished logo shrinks into the one in the nav as the backdrop fades.
    function lift() {
      if (lifted) return; lifted = true;
      root.style.overflow = '';
      var a = px.getBoundingClientRect(), b = document.querySelector('.nav .brand svg').getBoundingClientRect();
      var dx = (b.left + b.width / 2) - (a.left + a.width / 2), dy = (b.top + b.height / 2) - (a.top + a.height / 2);
      px.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + (b.width / a.width) + ')' }], { duration: 800, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' })
        .onfinish = function () { loader.remove(); root.classList.remove('intro'); };
      var bg = getComputedStyle(loader).backgroundColor;
      loader.animate([{ backgroundColor: bg }, { backgroundColor: bg.replace(/^rgb\((.*)\)$/, 'rgba($1, 0)') }], { duration: 600, delay: 150, easing: 'ease-out', fill: 'forwards' });
      document.querySelectorAll('.hero-copy > *, .hero .inbox').forEach(function (el, i) {
        el.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], { duration: 750, delay: 300 + i * 70, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      });
    }
    setTimeout(lift, 1400);
    loader.addEventListener('click', lift);
  })();

  // ── Nav: a hairline once the page scrolls ──
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', scrollY > 8); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var menu = document.getElementById('menu'), menuBtn = document.getElementById('menuBtn');
  function closeMenu() { if (!menu.hidden) { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); } }
  menuBtn.addEventListener('click', function () { menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); document.getElementById('menuClose').focus(); });
  document.getElementById('menuClose').addEventListener('click', function () { closeMenu(); menuBtn.focus(); });

  // In-page links scroll smoothly and leave the address alone.
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var el = document.querySelector(a.getAttribute('href')); if (!el) return;
      e.preventDefault(); closeMenu();
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  // ── Install sheet ──
  var sheet = document.getElementById('sheet'), lastFocus = null;
  var desktop = fine || !matchMedia('(pointer: coarse)').matches;
  document.getElementById('sheetDesk').hidden = !desktop;
  document.getElementById('sheetMobile').hidden = desktop;
  function openSheet(e) { lastFocus = e && e.currentTarget; closeMenu(); sheet.hidden = false; document.getElementById('sheetX').focus(); }
  function closeSheet() { sheet.hidden = true; if (lastFocus) lastFocus.focus(); }
  document.querySelectorAll('[data-install]').forEach(function (b) {
    b.addEventListener('click', function (e) { if (window.sndrWeb) window.sndrWeb('cta', 'Add to Chrome'); openSheet(e); });
  });
  // A fresh copy every time: the query string stops a cached older zip being served.
  document.getElementById('downloadBtn').addEventListener('click', function (e) {
    e.preventDefault();
    var a = document.createElement('a');
    a.href = 'sndr-extension.zip?v=2.4.67&t=' + Date.now();
    a.download = 'sndr-extension.zip';
    document.body.appendChild(a); a.click(); a.remove();
    if (window.sndrWeb) window.sndrWeb('download');
  });
  document.getElementById('sheetX').addEventListener('click', closeSheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });
  sheet.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  // ── Hero inbox: three more replies land, one at a time ──
  var ARRIVALS = [
    ['Priya Sharma', '#c4b5fd', 'Re: Summer analyst, quick question', 'Thanks for following up! Are you free on Thursday for a quick call?'],
    ['Arjun Mehta', '#7dd3fc', 'Re: Analyst role at Nova Fintech', "Could you send me your latest CV? I'll share it with the team."],
    ['Sara Khan', '#fdba74', 'Re: Strategy internship at Arc Labs', "Good timing, we're hiring for this right now. Can we talk tomorrow?"]
  ];
  var mails = document.getElementById('mails'), newN = document.getElementById('newN');
  function mailRow(m) {
    var li = document.createElement('li'); li.className = 'm unread new';
    li.innerHTML = '<div class="mi"><span class="av"></span><div class="mt"><p class="l1"><b></b><time></time></p><p class="l2"></p><p class="l3"></p></div></div>';
    var av = li.querySelector('.av'); av.style.background = m[1];
    av.textContent = m[0].split(' ').map(function (w) { return w[0]; }).join('');
    li.querySelector('.l1 b').textContent = m[0];
    li.querySelector('time').textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    li.querySelector('.l2').textContent = m[2];
    li.querySelector('.l3').textContent = m[3];
    return li;
  }
  function arrive(i) {
    if (i >= ARRIVALS.length) return;
    mails.insertBefore(mailRow(ARRIVALS[i]), mails.firstChild);
    newN.textContent = String(+newN.textContent + 1);
    setTimeout(function () { while (mails.children.length > 4) mails.removeChild(mails.lastElementChild); }, 700);
    setTimeout(function () { arrive(i + 1); }, 4500);
  }
  if (!reduce) setTimeout(function () { arrive(0); }, introMs + 1800);

  // ── Supporters belt: a second copy makes the loop seamless ──
  var belt = document.getElementById('belt');
  if (!reduce) Array.prototype.slice.call(belt.children).forEach(function (li) {
    var copy = li.cloneNode(true); copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach(function (i) { i.alt = ''; });
    belt.appendChild(copy);
  });

  // ── Emails sent: the real total from the SNDR server ──
  // Read every 30 s. In between, the number counts up a step each second
  // toward the newest total, never past it. Shown in the hero ("Live" line,
  // hidden until the first answer) and in the stats, which stay at 1,00,000+
  // if the server can't be reached.
  var liveEls = document.querySelectorAll('[data-live-count]'), liveHero = document.getElementById('liveHero'), shown = null, target = null;
  function paintTotal(tick) {
    liveEls.forEach(function (el) {
      el.textContent = shown.toLocaleString('en-IN');
      if (tick && !reduce) { el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); }
    });
  }
  function readTotal() {
    fetch('https://api.sndr.co.in/t/emails-sent', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !(j.total > 0)) return;
        target = j.total;
        if (shown === null) { shown = target; paintTotal(false); liveHero.classList.add('on'); }
      })
      .catch(function () {});
  }
  readTotal(); setInterval(readTotal, 30000);
  setInterval(function () {
    if (shown === null || shown >= target) return;
    shown = Math.min(target, shown + Math.max(1, Math.round((target - shown) / 30)));
    paintTotal(true);
  }, 1000);

  // ── Windows: grab one and throw it around, like on a Mac ──
  // Mouse: grab anywhere. Touch: grab the title bar, so the page still scrolls.
  // It leans toward the cursor on hover, tilts with your swing while dragged,
  // and glides and bounces off the screen edges when you let go. Once it
  // comes to rest it flies back to its place on its own.
  // Red and yellow close it and it pops back; green, or a double click on
  // the title bar, sends it home straight away.
  var stepper = document.getElementById('stepper'), zTop = 5;
  document.querySelectorAll('.win').forEach(function (w) {
    var bar = w.querySelector('.bar');
    var ox = 0, oy = 0, sx = 0, sy = 0, box = null, dragging = false, vx = 0, vy = 0, lx = 0, ly = 0, lt = 0, fling = 0, rot = 0, backT = 0;
    function homeSoon(ms) { clearTimeout(backT); backT = setTimeout(home, ms); }
    function bounds() { var r = w.getBoundingClientRect(); box = { l: r.left - ox, t: r.top - oy, w: r.width, h: r.height }; }
    // Keep the whole window on screen and below the nav.
    function clampX(x) { return Math.max(8 - box.l, Math.min(innerWidth - 8 - box.l - box.w, x)); }
    function clampY(y) { return Math.max(NAV_H + 8 - box.t, Math.min(innerHeight - 8 - box.t - box.h, y)); }
    function paint() { w.style.translate = ox + 'px ' + oy + 'px'; w.style.rotate = rot.toFixed(2) + 'deg'; }
    function home() { clearTimeout(backT); cancelAnimationFrame(fling); ox = oy = rot = 0; w.classList.remove('flying'); w.style.translate = ''; w.style.rotate = ''; }
    w.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.target.closest('.bar i')) return;
      if (e.pointerType !== 'mouse' && !e.target.closest('.bar')) return;
      clearTimeout(backT); cancelAnimationFrame(fling); w.classList.remove('flying'); w.style.transform = '';
      bounds();
      sx = e.clientX - ox; sy = e.clientY - oy; dragging = true;
      lx = e.clientX; ly = e.clientY; lt = performance.now(); vx = vy = 0;
      w.style.zIndex = String(Math.min(++zTop, 50));
      w.setPointerCapture(e.pointerId); w.classList.add('dragging'); stepper.classList.add('hold');
      e.preventDefault();
    });
    w.addEventListener('pointermove', function (e) {
      if (!dragging) {
        // Lean a little toward the cursor while hovering.
        if (e.pointerType === 'mouse' && !reduce && !w.classList.contains('flying')) {
          var r = w.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          w.style.transform = 'perspective(900px) rotateY(' + (px * 6).toFixed(2) + 'deg) rotateX(' + (-py * 6).toFixed(2) + 'deg)';
        }
        return;
      }
      var now = performance.now(), dt = Math.max(1, now - lt);
      vx = vx * 0.6 + ((e.clientX - lx) / dt) * 0.4; vy = vy * 0.6 + ((e.clientY - ly) / dt) * 0.4;
      lx = e.clientX; ly = e.clientY; lt = now;
      ox = clampX(e.clientX - sx); oy = clampY(e.clientY - sy);
      rot = reduce ? 0 : Math.max(-10, Math.min(10, vx * 6));
      paint();
    });
    w.addEventListener('pointerleave', function () { if (!dragging) w.style.transform = ''; });
    function drop() {
      if (!dragging) return;
      dragging = false; w.classList.remove('dragging'); stepper.classList.remove('hold');
      if (reduce || performance.now() - lt > 80 || Math.hypot(vx, vy) < 0.15) { rot = 0; paint(); homeSoon(900); return; }
      // Glide with the speed it was thrown at, bouncing off the edges.
      w.classList.add('flying');
      var last = performance.now(), fx = vx * 16, fy = vy * 16;
      (function step(now) {
        var k = Math.min(3, (now - last) / 16); last = now;
        ox += fx * k; oy += fy * k;
        var cx = clampX(ox), cy = clampY(oy);
        if (cx !== ox) { ox = cx; fx = -fx * 0.6; }
        if (cy !== oy) { oy = cy; fy = -fy * 0.6; }
        fx *= Math.pow(0.93, k); fy *= Math.pow(0.93, k);
        rot = Math.max(-10, Math.min(10, fx * 0.4)) * 0.9;
        paint();
        if (Math.hypot(fx, fy) > 0.3) fling = requestAnimationFrame(step);
        else { w.classList.remove('flying'); rot = 0; paint(); homeSoon(700); }
      })(last);
    }
    w.addEventListener('pointerup', drop); w.addEventListener('pointercancel', drop);
    bar.addEventListener('dblclick', home);
    var dots = bar.querySelectorAll('i');
    dots[2].addEventListener('click', home);
    [dots[0], dots[1]].forEach(function (dot, k) {
      dot.addEventListener('click', function () {
        if (reduce || !w.animate) return;
        w.animate(k ? [{ scale: 1, opacity: 1, transform: 'none' }, { scale: 0.2, opacity: 0, transform: 'translateY(40vh)', offset: 0.4 }, { scale: 0.2, opacity: 0, transform: 'translateY(40vh)', offset: 0.6 }, { scale: 1, opacity: 1, transform: 'none' }]
          : [{ scale: 1, opacity: 1 }, { scale: 0.6, opacity: 0, offset: 0.35 }, { scale: 0.6, opacity: 0, offset: 0.6 }, { scale: 1, opacity: 1 }],
          { duration: 1100, easing: 'cubic-bezier(.34, 1.4, .64, 1)' });
      });
    });
  });

  // ── How it works: each window plays out what SNDR does in that step ──
  // The markup holds each window's finished state. play() resets it to the
  // start and runs it forward; T() drops any step that belongs to an older run.
  var SCRIPTS = {
    find: function (w, T) {
      var rows = w.querySelectorAll('.row'), n = w.querySelector('[data-n]'), saved = 0;
      n.textContent = '0';
      Array.prototype.forEach.call(rows, function (r, i) {
        var p = r.querySelector('.pill'), t0 = 250 + i * 520;
        r.classList.add('pre'); p.classList.add('ghost');
        T(t0, function () { r.classList.remove('pre'); });
        T(t0 + 180, function () { p.className = 'pill grey'; p.textContent = 'Saving…'; });
        T(t0 + 440, function () { p.className = 'pill'; p.textContent = 'Saved'; n.textContent = String(++saved); });
      });
    },
    emails: function (w, T) {
      var fmt = w.querySelector('[data-fmt]'), fmtPill = w.querySelector('.fmt .pill'), FMT = 'firstname.lastname@novafintech.com';
      fmt.textContent = 'Working it out…'; fmt.classList.add('dim'); fmtPill.classList.add('ghost');
      T(650, function () { fmt.textContent = FMT; fmt.classList.remove('dim'); fmtPill.classList.remove('ghost'); });
      Array.prototype.forEach.call(w.querySelectorAll('[data-email]'), function (s, i) {
        var email = s.getAttribute('data-email'), pill = s.parentNode.parentNode.querySelector('.pill'), t0 = 1050 + i * 620;
        s.textContent = 'Waiting for the format…'; pill.classList.add('ghost');
        T(t0, function () { s.textContent = ''; });
        for (var k = 1; k <= email.length; k++) (function (k) { T(t0 + k * 15, function () { s.textContent = email.slice(0, k); }); })(k);
        T(t0 + email.length * 15 + 80, function () { pill.classList.remove('ghost'); });
      });
    },
    send: function (w, T) {
      var first = w.querySelector('[data-v="first"]'), co = w.querySelector('[data-v="co"]'), meter = w.querySelector('[data-meter]'), sent = w.querySelector('[data-sent]'), state = w.querySelector('[data-state]');
      var TO = [['Priya', 'Nova Fintech'], ['Arjun', 'Bluepeak Capital'], ['Sara', 'Northwind Bank'], ['Rohan', 'Kite Finance'], ['Neha', 'Orbit Credit']];
      first.textContent = '{{firstName}}'; co.textContent = '{{company}}';
      meter.style.width = '0%'; sent.textContent = '0'; state.className = 'pill grey'; state.textContent = 'Ready';
      for (var k = 1; k <= 50; k++) (function (k) {
        T(550 + k * 55, function () {
          sent.textContent = String(k); meter.style.width = (k * 2) + '%';
          if (k % 10 === 1) {
            var to = TO[(k - 1) / 10]; first.textContent = to[0]; co.textContent = to[1];
            [first, co].forEach(function (v) { v.classList.remove('flash'); void v.offsetWidth; v.classList.add('flash'); });
          }
          if (k === 1) { state.className = 'pill'; state.textContent = 'Sending'; }
          if (k === 50) { state.className = 'pill ok'; state.textContent = 'All sent'; }
        });
      })(k);
    },
    follow: function (w, T) {
      var rows = w.querySelectorAll('.row'), last = rows[3], ls = last.querySelector('small'), lp = last.querySelector('.pill');
      Array.prototype.forEach.call(rows, function (r) { r.classList.add('pre'); });
      last.classList.remove('stopped'); ls.textContent = 'Scheduled for next Mon'; lp.className = 'pill'; lp.textContent = 'Scheduled';
      [250, 800, 1400, 1950].forEach(function (t, i) { T(t, function () { rows[i].classList.remove('pre'); }); });
      T(2600, function () { last.classList.add('stopped'); ls.textContent = 'Stopped automatically'; lp.className = 'pill grey'; lp.textContent = 'Cancelled'; });
    }
  };
  function play(w) {
    var run = {}; w._run = run;
    SCRIPTS[w.getAttribute('data-play')](w, function (ms, fn) { setTimeout(function () { if (w._run === run) fn(); }, ms); });
  }

  // Steps move on by themselves: the thin bar under the open step fills in
  // 5 seconds, then the next one opens. Clicking a step opens it and carries
  // on from there. It holds while a window is being dragged and while the
  // section is off screen.
  var sts = Array.prototype.slice.call(document.querySelectorAll('.st')), seen = false;
  function show(t, focus) {
    sts.forEach(function (x) { var sel = x === t; x.setAttribute('aria-selected', String(sel)); x.tabIndex = sel ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !sel; });
    if (!reduce && seen) play(document.getElementById(t.getAttribute('aria-controls')));
    if (focus) t.focus();
  }
  function restartBar() { if (reduce || !seen) return; stepper.classList.remove('auto'); void stepper.offsetWidth; stepper.classList.add('auto'); }
  sts.forEach(function (t, i) {
    t.addEventListener('click', function () { var again = t.getAttribute('aria-selected') === 'true'; show(t); if (again) restartBar(); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = sts[(i + 1) % sts.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = sts[(i - 1 + sts.length) % sts.length];
      if (n) { e.preventDefault(); show(n, true); }
    });
    t.querySelector('.tm i').addEventListener('animationend', function () { if (stepper.classList.contains('auto')) show(sts[(i + 1) % sts.length]); });
  });
  if (!reduce && window.IntersectionObserver) {
    new IntersectionObserver(function (es) {
      var on = es[0].isIntersecting;
      if (on && !seen) {
        seen = true; stepper.classList.add('auto');
        play(document.getElementById(sts.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0].getAttribute('aria-controls')));
      }
      stepper.classList.toggle('away', !on);
    }, { threshold: 0.35 }).observe(stepper);
  }

  // ── Features: tabs with a sliding highlight ──
  var ftabs = Array.prototype.slice.call(document.querySelectorAll('.ftab')), fhl = document.getElementById('fhl');
  function moveFhl() {
    var t = ftabs.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0]; if (!t) return;
    fhl.style.width = t.offsetWidth + 'px'; fhl.style.height = t.offsetHeight + 'px';
    fhl.style.transform = 'translate(' + t.offsetLeft + 'px, ' + t.offsetTop + 'px)';
  }
  function fselect(t, focus) {
    ftabs.forEach(function (x) { var sel = x === t; x.setAttribute('aria-selected', String(sel)); x.tabIndex = sel ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !sel; });
    moveFhl(); if (focus) t.focus();
  }
  // A guided tour: each tab plays its demo for you (types a company, taps the
  // teams, makes Priya reply, asks the AI), then the next tab opens when the
  // bar under it fills in 8 seconds. Picking a tab jumps there and the tour
  // carries on. Clicking or typing inside a demo hands it over to you, and the
  // tour waits until you've left it alone for 12 seconds.
  var ftabsEl = document.querySelector('.ftabs'), fstage = document.querySelector('.fstage');
  var tourRun = null, tourSeen = false, idleT = 0, tourN = 0;
  function later(run, ms, fn) { setTimeout(function () { if (tourRun === run) fn(); }, ms); }
  var TOUR = {
    fp1: function (run) {
      var name = ['Bluepeak Capital', 'Northwind Bank', 'Kite Finance'][tourN % 3];
      later(run, 300, function () { coIn.value = ''; });
      for (var k = 1; k <= name.length; k++) (function (k) { later(run, 300 + k * 55, function () { coIn.value = name.slice(0, k); }); })(k);
      later(run, 300 + name.length * 55 + 300, function () { if (!d1go.disabled) d1go.click(); });
    },
    fp2: function (run) {
      document.getElementById('d2reset').click();
      Array.prototype.forEach.call(document.querySelectorAll('#d2chips .chip2'), function (b, i) { later(run, 700 + i * 750, function () { b.click(); }); });
    },
    fp3: function (run) {
      if (replied) d3go.click();
      later(run, 1500, function () { if (!replied) d3go.click(); });
    },
    fp4: function (run) {
      var chips = document.querySelectorAll('#prompts .chip2');
      later(run, 600, function () { chips[1 + (tourN % 3)].click(); });
      later(run, 4200, function () { chips[1 + ((tourN + 1) % 3)].click(); });
    }
  };
  function tour(t) {
    if (reduce || !tourSeen) return;
    var run = {}; tourRun = run; tourN++;
    TOUR[t.getAttribute('aria-controls')](run);
  }
  function go(t, focus) {
    var again = t.getAttribute('aria-selected') === 'true';
    clearTimeout(idleT); ftabsEl.classList.remove('hold');
    fselect(t, focus); tour(t);
    if (again && tourSeen && !reduce) { ftabsEl.classList.remove('auto'); void ftabsEl.offsetWidth; ftabsEl.classList.add('auto'); }
  }
  ftabs.forEach(function (t, i) {
    t.addEventListener('click', function () { go(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight' || k === 'ArrowDown') n = ftabs[(i + 1) % ftabs.length];
      if (k === 'ArrowLeft' || k === 'ArrowUp') n = ftabs[(i - 1 + ftabs.length) % ftabs.length];
      if (n) { e.preventDefault(); go(n, true); }
    });
    t.querySelector('.tm i').addEventListener('animationend', function () { if (ftabsEl.classList.contains('auto')) go(ftabs[(i + 1) % ftabs.length]); });
  });
  document.querySelectorAll('.nextf').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); go(document.getElementById(b.getAttribute('data-go'))); }); });
  ['pointerdown', 'keydown', 'focusin'].forEach(function (ev) {
    fstage.addEventListener(ev, function (e) {
      if (!e.isTrusted || e.target.closest('.nextf')) return;
      tourRun = null; ftabsEl.classList.add('hold');
      clearTimeout(idleT); idleT = setTimeout(function () { ftabsEl.classList.remove('hold'); }, 12000);
    });
  });
  if (!reduce && window.IntersectionObserver) {
    new IntersectionObserver(function (es) {
      var on = es[0].isIntersecting;
      if (on && !tourSeen) {
        tourSeen = true; ftabsEl.classList.add('auto');
        tour(ftabs.filter(function (x) { return x.getAttribute('aria-selected') === 'true'; })[0]);
      }
      ftabsEl.classList.toggle('away', !on);
    }, { threshold: 0.35 }).observe(fstage);
  }
  addEventListener('resize', moveFhl); moveFhl();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveFhl);

  // ── Film plays on its own when it's on screen ──
  var video = document.getElementById('video'), sound = document.getElementById('sound');
  function setSound(onSound) { video.muted = !onSound; sound.setAttribute('aria-pressed', String(onSound)); sound.setAttribute('aria-label', onSound ? 'Turn sound off' : 'Turn sound on'); }
  function startFilm() {
    // Browsers allow sound only after the viewer has clicked something on the page.
    setSound(navigator.userActivation ? navigator.userActivation.hasBeenActive : false);
    var p = video.play();
    if (p && p.catch) p.catch(function () { setSound(false); video.play().catch(function () {}); });
  }
  if (reduce) video.removeAttribute('loop');
  if (window.IntersectionObserver) new IntersectionObserver(function (es) { if (es[0].isIntersecting) startFilm(); else video.pause(); }, { threshold: 0.45 }).observe(video);
  sound.addEventListener('click', function () { setSound(video.muted); if (video.paused) video.play(); });

  // ── Demo 1: LinkedIn in, work emails out ──
  var PEOPLE = [['Priya', 'Sharma', 'HR Business Partner', '#c4b5fd'], ['Arjun', 'Mehta', 'Talent Acquisition', '#7dd3fc'], ['Sara', 'Khan', 'Campus Recruiter', '#fdba74'], ['Rohan', 'Iyer', 'Hiring Manager', '#f9a8d4'], ['Neha', 'Kapoor', "Founder's Office", '#86efac']];
  var d1go = document.getElementById('d1go'), d1list = document.getElementById('d1list'), d1status = document.getElementById('d1status'), coIn = document.getElementById('co');
  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }
  function setStatus(before, bold, after) {
    d1status.textContent = before;
    var b = document.createElement('b'); b.textContent = bold; d1status.appendChild(b);
    if (after) d1status.appendChild(document.createTextNode(after));
  }
  function domainOf(company) { return (company.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'company') + '.com'; }
  function emailOf(person, domain) { return (person[0] + '.' + person[1]).toLowerCase() + '@' + domain; }
  function personRow(person, email) {
    var li = document.createElement('li');
    li.innerHTML = '<span class="av"></span><span class="t"><b></b><small></small></span><span class="em"></span>';
    li.querySelector('.av').style.background = person[3];
    li.querySelector('.av').textContent = person[0][0] + person[1][0];
    li.querySelector('b').textContent = person[0] + ' ' + person[1];
    li.querySelector('small').textContent = person[2];
    li.querySelector('.em').textContent = email;
    d1list.appendChild(li); return li;
  }
  // At rest it shows a finished run for Nova Fintech, so the card is never empty.
  PEOPLE.forEach(function (p) { personRow(p, emailOf(p, 'novafintech.com')); });
  setStatus('Found ', '5 work emails', ' at Nova Fintech. Try any other company.');
  d1go.addEventListener('click', function () {
    var company = coIn.value.trim() || 'Nova Fintech', domain = domainOf(company);
    d1go.disabled = true; d1list.innerHTML = '';
    setStatus('Reading ', company + "'s", ' people on LinkedIn…');
    var rows = [];
    PEOPLE.reduce(function (p, person, i) {
      return p.then(function () { return wait(i ? 260 : 500); }).then(function () { rows.push([personRow(person, 'Saved'), person]); });
    }, Promise.resolve()).then(function () { return wait(600); }).then(function () {
      setStatus('Email format found: ', 'firstname.lastname@' + domain);
      return rows.reduce(function (p, r) { return p.then(function () { return wait(220); }).then(function () { r[0].querySelector('.em').textContent = emailOf(r[1], domain); }); }, Promise.resolve());
    }).then(function () {
      setStatus('', '5 work emails ready', ', in about the time it took to read this.');
      d1go.disabled = false;
    });
  });

  // ── Demo 2: past LinkedIn's limit ──
  var d2n = document.getElementById('d2n'), d2bar = document.getElementById('d2bar'), d2msg = document.getElementById('d2msg'), reached = 74;
  var START_MSG = 'LinkedIn stopped the list at 74. Tap a team to open a new list.';
  function showReach(to) {
    var from = reached; reached = to;
    d2bar.style.width = Math.max(3.9, to / 1908 * 100) + '%';
    if (reduce) { d2n.textContent = to.toLocaleString('en-IN'); return; }
    var t0 = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - t0) / 800), e = 1 - Math.pow(1 - k, 3);
      d2n.textContent = Math.round(from + (to - from) * e).toLocaleString('en-IN');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  document.querySelectorAll('#d2chips .chip2').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.classList.contains('done')) return;
      b.classList.add('done'); b.textContent = b.getAttribute('data-name') + ' ✓';
      showReach(reached + (+b.getAttribute('data-add')));
      var left = document.querySelectorAll('#d2chips .chip2:not(.done)').length;
      d2msg.textContent = left ? '+' + b.getAttribute('data-add') + ' new people from ' + b.getAttribute('data-name') + '. Anyone you already had was skipped.'
        : 'You reached ' + reached + ' people, about ' + Math.round(reached / 74) + '× what LinkedIn showed at first.';
    });
  });
  document.getElementById('d2reset').addEventListener('click', function () {
    document.querySelectorAll('#d2chips .chip2').forEach(function (b) { b.classList.remove('done'); b.textContent = b.getAttribute('data-name'); });
    showReach(74); d2msg.textContent = START_MSG;
  });

  // ── Demo 3: follow ups that stop on a reply ──
  var d3go = document.getElementById('d3go'), d3note = document.getElementById('d3note'), fus = document.querySelectorAll('.tl .fu'), replied = false;
  var NOTE = d3note.textContent;
  d3go.addEventListener('click', function () {
    replied = !replied;
    d3note.classList.toggle('reply', replied);
    d3note.textContent = replied ? 'Priya: "Thanks for following up! Free on Thursday for a quick call?"' : NOTE;
    Array.prototype.forEach.call(fus, function (li, i) {
      setTimeout(function () { li.classList.toggle('off', replied); li.querySelector('em').textContent = replied ? 'Cancelled' : 'Scheduled'; }, replied && !reduce ? 350 + i * 250 : 0);
    });
    d3go.textContent = replied ? 'Start over' : 'Make Priya reply';
  });

  // ── Demo 4: an AI that has read your CV ──
  var ANSWERS = [
    'Three fixes before you apply:\n1. Lead with your DCF model project, numbers first.\n2. Cut the hobbies line.\n3. Name one deal you followed closely and what you learned.',
    'Subject: Summer analyst, quick question\n\nHi Priya, I built a lending model on Nova Fintech\'s last two quarters and would love to help your analyst team this summer. Could we talk for ten minutes this week?',
    'Strong fits for your profile:\n• Nova Fintech, credit analyst\n• Bluepeak Capital, summer analyst\n• Arc Labs, strategy intern\nWant me to find their recruiters\' emails?',
    'Expect these three:\n1. Walk me through a DCF.\n2. Why this firm, not a bigger one?\n3. A time you worked under pressure.\nShall we practise the first one?'
  ];
  var chat = document.getElementById('chat'), busy = false;
  function bubble(text, me) { var d = document.createElement('div'); d.className = 'bub' + (me ? ' me' : ''); d.textContent = text; chat.appendChild(d); chat.scrollTop = chat.scrollHeight; return d; }
  document.querySelectorAll('#prompts .chip2').forEach(function (b) {
    b.addEventListener('click', function () {
      if (busy) return; busy = true;
      bubble(b.textContent, true);
      var full = ANSWERS[+b.getAttribute('data-a')], d = bubble('…', false), i = 0;
      setTimeout(function step() {
        i = Math.min(full.length, i + (reduce ? full.length : 4));
        d.textContent = full.slice(0, i); chat.scrollTop = chat.scrollHeight;
        if (i < full.length) setTimeout(step, 16); else busy = false;
      }, reduce ? 0 : 450);
    });
  });

  // ── FAQ: one answer open at a time ──
  var qa = document.querySelectorAll('#qa details');
  qa.forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) qa.forEach(function (o) { if (o !== d) o.open = false; }); }); });
})();
