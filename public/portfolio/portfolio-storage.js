/* portfolio-storage.js
 * Bridges the <image-slot> component (which expects a window.omelette host
 * with writeFile + a sidecar JSON next to the page) to Supabase Storage.
 *
 * - Intercepts fetch('.image-slots.state.json') -> downloads state.json from
 *   the portfolio-images bucket and rewrites stored storage paths into
 *   short-lived signed URLs the <img> tags can render.
 * - Provides window.omelette.writeFile, which on save: uploads any new
 *   data:URL slot bodies as individual image files, replaces them with the
 *   storage path, and uploads the state JSON. Only works when the current
 *   visitor is authenticated (i.e. signed in as admin).
 *
 * Loaded BEFORE image-slot.js.
 */
(function () {
  'use strict';

  var BUCKET = 'portfolio-images';
  var STATE_PATH = 'state.json';
  var STATE_FILENAME = '.image-slots.state.json'; // what image-slot.js fetches
  var SIGNED_URL_TTL = 60 * 60 * 24 * 7; // 7 days

  // Reuse the single Supabase client created by content.js so we don't end
  // up with two GoTrueClient instances racing on the same storage key.
  async function sb() {
    var PC = window.PortfolioContent;
    if (PC && typeof PC._db === 'function') return PC._db();
    // Fallback: poll briefly for PortfolioContent to appear.
    for (var i = 0; i < 50; i++) {
      PC = window.PortfolioContent;
      if (PC && typeof PC._db === 'function') return PC._db();
      await new Promise(function (r) { setTimeout(r, 20); });
    }
    throw new Error('PortfolioContent not ready');
  }


  async function downloadStateJson() {
    var s = await sb();
    var res = await s.storage.from(BUCKET).download(STATE_PATH);
    if (res.error) return {};
    try {
      var txt = await res.data.text();
      return JSON.parse(txt) || {};
    } catch (e) { return {}; }
  }

  async function signPath(s, path) {
    var r = await s.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
    return r.data ? r.data.signedUrl : null;
  }

  // Replace any stored storage-path entries (`slots/<id>.webp`) with signed URLs
  // so <img src=...> works for unauthenticated visitors too.
  async function hydrateForRead(state) {
    var s = await sb();
    var keys = Object.keys(state);
    await Promise.all(keys.map(async function (k) {
      var v = state[k];
      var u = (typeof v === 'string') ? v : (v && v.u);
      if (!u || u.indexOf('storage:') !== 0) return;
      var path = u.slice('storage:'.length);
      var signed = await signPath(s, path);
      if (!signed) return;
      if (typeof v === 'string') state[k] = signed;
      else v.u = signed;
    }));
    return state;
  }

  // The image-slot calls `fetch('.image-slots.state.json')` (relative).
  var origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      var url = (typeof input === 'string') ? input : (input && input.url) || '';
      if (url.indexOf(STATE_FILENAME) !== -1) {
        return (async function () {
          var raw = await downloadStateJson();
          var hydrated = await hydrateForRead(raw);
          return new Response(JSON.stringify(hydrated), {
            status: 200, headers: { 'content-type': 'application/json' }
          });
        })();
      }
    } catch (e) {}
    return origFetch(input, init);
  };

  // Decode "data:image/...;base64,..." into a Blob.
  async function dataUrlToBlob(dataUrl) {
    var res = await origFetch(dataUrl);
    return await res.blob();
  }

  function extFromMime(mime) {
    if (!mime) return 'webp';
    var t = mime.split('/')[1] || 'webp';
    return t.split(';')[0];
  }

  // Convert a state object that may contain new data:URLs into one whose
  // image bodies live in storage, returning {persisted, displayed}:
  //   persisted = state with `storage:<path>` placeholders (saved to state.json)
  //   displayed = state with signed URLs (returned to image-slot so live UI
  //               keeps showing the new images without a reload)
  async function uploadAndRewrite(state) {
    var s = await sb();
    var keys = Object.keys(state);
    var persisted = JSON.parse(JSON.stringify(state));
    var displayed = JSON.parse(JSON.stringify(state));
    await Promise.all(keys.map(async function (k) {
      var v = state[k];
      var u = (typeof v === 'string') ? v : (v && v.u);
      if (!u || u.indexOf('data:') !== 0) return;
      try {
        var blob = await dataUrlToBlob(u);
        var ext = extFromMime(blob.type);
        var safeId = k.replace(/[^a-zA-Z0-9_-]+/g, '_');
        var path = 'slots/' + safeId + '.' + ext;
        var up = await s.storage.from(BUCKET).upload(path, blob, {
          upsert: true, contentType: blob.type || 'image/webp'
        });
        if (up.error) { console.warn('[storage] upload failed for', k, up.error); return; }
        var signed = await signPath(s, path);
        var placeholder = 'storage:' + path;
        if (typeof persisted[k] === 'string') persisted[k] = placeholder;
        else persisted[k].u = placeholder;
        if (typeof displayed[k] === 'string') displayed[k] = signed || u;
        else displayed[k].u = signed || u;
      } catch (e) { console.warn('[storage] could not persist slot', k, e); }
    }));
    return { persisted: persisted, displayed: displayed };
  }

  // Background omelette host. The image-slot reads `window.omelette.writeFile`
  // at element-connection time to decide if it's editable, so we install it
  // immediately. The actual upload is gated on the user being signed in.
  window.omelette = window.omelette || {};
  window.omelette.writeFile = async function (filename, content) {
    try {
      var s = await sb();
      var ses = await s.auth.getSession();
      if (!ses || !ses.data || !ses.data.session) {
        console.warn('[storage] sign in as admin to persist image drops');
        return;
      }
      var state = {};
      try { state = JSON.parse(content || '{}') || {}; } catch (e) {}
      var out = await uploadAndRewrite(state);
      var blob = new Blob([JSON.stringify(out.persisted)], { type: 'application/json' });
      var up = await s.storage.from(BUCKET).upload(STATE_PATH, blob, {
        upsert: true, contentType: 'application/json'
      });
      if (up.error) console.warn('[storage] state.json upload failed', up.error);
    } catch (e) {
      console.warn('[storage] writeFile failed', e);
    }
  };
})();
