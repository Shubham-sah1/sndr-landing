// Visit counting for SNDR's own analytics (founders' Website tab). Sends one
// small beacon per page view, install-button click and download to
// api.sndr.co.in. Anonymous: a random id kept in this browser only, no
// cookies, no IP address stored. Visitors with Do Not Track on are skipped.
(function () {
  var API = 'https://api.sndr.co.in/t/web';
  var off = navigator.doNotTrack === '1' || window.doNotTrack === '1' ||
    /bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent);
  window.sndrWeb = function () {};
  if (off) return;

  function newId() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  }
  function kept(store, key) {
    try { var v = store.getItem(key); if (!v) { v = newId(); store.setItem(key, v); } return v; } catch (e) { return newId(); }
  }
  var visitor = kept(localStorage, 'sndr_vid');
  var session = kept(sessionStorage, 'sndr_sid'); // one visit = this browser tab session
  var params = new URLSearchParams(location.search);
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}

  function send(type, label) {
    var body = JSON.stringify({
      type: type, label: label || null, path: location.pathname, ref: type === 'pageview' ? document.referrer : '',
      utm_source: params.get('utm_source'), utm_medium: params.get('utm_medium'), utm_campaign: params.get('utm_campaign'),
      visitor: visitor, session: session, tz: tz, lang: navigator.language, w: window.innerWidth,
    });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(API, body)) return;
      fetch(API, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' });
    } catch (e) {}
  }

  // Called by app.js: sndrWeb('cta', 'Add to Chrome'), sndrWeb('download').
  window.sndrWeb = send;
  send('pageview');
})();
