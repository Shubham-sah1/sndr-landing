// "Write to the SNDR team" and the wall (index.html #feedback). A note goes
// to SNDR's server (POST /feedback, sent as text so the browser needn't ask
// first); the wall shows notes whose writers allowed it and the team pinned
// (GET /feedback/wall). Nothing here is shown without the writer's OK.
(function () {
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var API = (local ? 'http://localhost:3000' : 'https://api.sndr.co.in') + '/feedback';
  var form = document.getElementById('fbForm');
  if (!form) return;
  var $ = function (id) { return document.getElementById(id); };
  var PLACEHOLDERS = [
    'Spill the tea. What should SNDR do better?',
    'What made you smile, or want to throw your laptop?',
    'One thing you\'d change about SNDR…',
    'Tell us what happened. The more detail, the faster we fix it.',
  ];
  $('fbMsg').placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

  var mood = null;
  var chips = form.querySelectorAll('.fb-chips button');
  function pick(m) {
    mood = m;
    Array.prototype.forEach.call(chips, function (c) { c.setAttribute('aria-checked', String(c.getAttribute('data-mood') === m)); });
    $('fbErr').textContent = '';
  }
  Array.prototype.forEach.call(chips, function (c) { c.addEventListener('click', function () { pick(c.getAttribute('data-mood')); }); });
  $('fbMsg').addEventListener('input', function () { $('fbErr').textContent = ''; });
  $('fbEmail').addEventListener('input', function () { $('fbErr').textContent = ''; });
  $('fbName').addEventListener('focus', function () { $('fbPin').checked = true; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = $('fbMsg').value.trim(), email = $('fbEmail').value.trim();
    if (!mood) { $('fbErr').textContent = 'Pick a subject first.'; return; }
    if (msg.length < 2) { $('fbErr').textContent = 'Write a line first.'; $('fbMsg').focus(); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('fbErr').textContent = 'That email doesn\'t look right.'; $('fbEmail').focus(); return; }
    var btn = $('fbSend');
    btn.disabled = true;
    btn.lastElementChild.textContent = 'Sending…';
    var pin = $('fbPin').checked;
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ kind: 'note', mood: mood, message: msg, email: email, canPin: pin, wallName: pin ? $('fbName').value.trim() : '', hp: $('fbHp').value }),
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || 'Couldn\'t send that. Try again in a minute.'); }); })
      .then(function () {
        // The paper plane takes off, then the card says it landed.
        form.classList.add('fb-flying');
        setTimeout(function () {
          form.classList.remove('fb-flying');
          form.innerHTML = '<div class="fb-done" role="status"><svg width="40" height="40" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 1.5L7 9M14.5 1.5L10 14.5 7 9 1.5 6z"></path></svg>' +
            '<b>Delivered to the SNDR team</b><span>Thanks for writing.' + (pin ? ' If your note makes it to the wall, you\'ll see it here.' : '') + '</span></div>';
        }, 650);
        if (typeof window.va === 'function') window.va('event', { name: 'feedback_sent', data: { mood: mood } });
      })
      .catch(function (err) {
        btn.disabled = false;
        btn.lastElementChild.textContent = 'Send';
        $('fbErr').textContent = err && err.message && !/Failed to fetch|NetworkError|Load failed/.test(err.message) ? err.message : 'Couldn\'t reach SNDR. Check your connection and try again.';
      });
  });

  // The wall: pinned notes, newest first. Stays as "be the first" when empty.
  var TILT = [-1.6, 1.2, -0.7, 1.7, -1.1, 0.8];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  fetch(API + '/wall', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : { notes: [] }; })
    .then(function (d) {
      var notes = (d && d.notes || []).slice(0, 12);
      if (!notes.length) return;
      $('fbWall').innerHTML = notes.map(function (n, i) {
        return '<figure class="fb-note fb-c' + (i % 4 + 1) + '" style="--tilt:' + TILT[i % TILT.length] + 'deg"><p>' + esc(n.message) + '</p>' +
          '<figcaption class="fb-by">' + (n.name ? '— ' + esc(n.name) : '— an SNDR user') + '</figcaption></figure>';
      }).join('');
    })
    .catch(function () { /* the wall is extra; the form works without it */ });
})();
