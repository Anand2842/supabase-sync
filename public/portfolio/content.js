/* ============================================================================
   content.js  —  THE CONTENT LAYER  (wired to Lovable Cloud / Supabase)
   ============================================================================ */
(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIG
     ========================================================================== */
  var CONFIG = {
    supabaseUrl: 'https://dhxbbhxacdotccfnbcyy.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeGJiaHhhY2RvdGNjZm5iY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NDE3MTIsImV4cCI6MjA5NzExNzcxMn0.QG62okVosjWnYFeDPl-nP3G4NRUDTWbm9eo-yMwyzLA',
    adminPassword: 'letmein'
  };

  function isLive() { return !!(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey); }

  /* ==========================================================================
     2. Supabase client + visitor id helpers
     ========================================================================== */
  var sb = null;
  async function db() {
    if (sb) return sb;
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    sb = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
    return sb;
  }

  /* ==========================================================================
     3. Gradient palette + DEFAULT_CONTENT seed
     ========================================================================== */
  var G = {
    orbitly:   'linear-gradient(135deg,#06b6d4,#3b82f6)',
    hacknova:  'linear-gradient(135deg,#1d4ed8,#6d28d9)',
    stackline: 'linear-gradient(135deg,#0891b2,#155e75)',
    oss:       'linear-gradient(135deg,#334155,#0f172a)',
    devshack:  'linear-gradient(135deg,#3b82f6,#06b6d4)',
    pulse:     'linear-gradient(135deg,#22d3ee,#2563eb)'
  };

  var DEFAULT_CONTENT = {
    profile: {
      name: 'Anand',
      username: 'anand.builds',
      role: 'Founder & Full-Stack Developer',
      bio: 'Building things people actually use.\nStackline (\u201923) \u2192 Orbitly (\u201925) \u00B7 3\u00D7 hackathon winner',
      email: 'hi@anand.dev'
    },
    posts: [
      { id: 'p1', time: '2d', label: 'Orbitly \u00B7 launch week', slot: 'post-orbitly', aspect: '4 / 5', grad: G.orbitly, big: 'O',
        placeholder: 'Drop an Orbitly screenshot here',
        images: [
          { slot: 'post-orbitly', placeholder: 'Orbitly \u2014 hero / 1' },
          { slot: 'post-orbitly-2', placeholder: 'Orbitly \u2014 dashboard / 2' },
          { slot: 'post-orbitly-3', placeholder: 'Orbitly \u2014 Product Hunt / 3' }
        ],
        caption: 'Orbitly is live \uD83D\uDE80 1,000 users in the first week and #2 Product of the Day. Two years of nights and weekends, one very real product.',
        likes: 412, comments: [
          { u: 'priya.codes', t: 'Congrats Anand! The onboarding flow is so smooth \uD83D\uDD25', when: '2d' },
          { u: 'devraj_', t: 'Week one numbers are wild. Well deserved.', when: '1d' }
        ] },
      { id: 'p2', time: '1w', label: 'HackNova 2025 \u00B7 1st place', slot: 'post-hacknova', aspect: '1 / 1', grad: G.hacknova, big: 'H',
        placeholder: 'Drop your HackNova trophy photo here',
        caption: 'WE WON \uD83C\uDFC6 36 hours, 3 teammates, 14 espressos. Built an accessibility copilot and took 1st at HackNova 2025.',
        likes: 289, comments: [
          { u: 'sara.designs', t: 'That demo had the whole room clapping \uD83D\uDC4F', when: '1w' }
        ] },
      { id: 'p3', time: '2w', label: 'Stackline \u00B7 the origin story', slot: 'post-stackline', aspect: '4 / 5', grad: G.stackline, big: 'S',
        placeholder: 'Drop a Stackline dashboard shot here',
        images: [
          { slot: 'post-stackline', placeholder: 'Stackline \u2014 then / 1' },
          { slot: 'post-stackline-2', placeholder: 'Stackline \u2014 now / 2' }
        ],
        caption: 'Two years ago Stackline was a dorm-room script. Today it processes 50k orders a month for 120 stores. My first startup taught me everything.',
        likes: 357, comments: [
          { u: 'mentor.vik', t: 'Watched this grow from day one. Proud of you.', when: '2w' }
        ] },
      { id: 'p4', time: '3w', label: 'formkit-lite \u00B7 open source', slot: 'post-oss', aspect: '1 / 1', grad: G.oss, big: '{ }',
        placeholder: 'Drop your GitHub repo screenshot here',
        caption: 'Open-sourced formkit-lite \u2014 the tiny form library I kept rewriting at every job. 800\u2605 and counting \u2B50',
        likes: 198, comments: [
          { u: 'oss.daily', t: 'Using this in prod already. Docs are excellent.', when: '3w' }
        ] },
      { id: 'p5', time: '1mo', label: 'DevsHack \u00B7 Best AI Hack', slot: 'post-devshack', aspect: '1 / 1', grad: G.devshack, big: 'AI',
        placeholder: 'Drop a DevsHack demo photo here',
        caption: 'Best AI Hack at DevsHack \u201925 \uD83E\uDD47 We turned messy lecture notes into searchable flashcards in 24 hours.',
        likes: 243, comments: [
          { u: 'teammate.ish', t: 'Sleep is temporary, trophies are forever \uD83D\uDE05', when: '1mo' }
        ] },
      { id: 'p6', time: '1mo', label: 'Pulse \u00B7 weekend build', slot: 'post-pulse', aspect: '4 / 5', grad: G.pulse, big: 'P',
        placeholder: 'Drop a Pulse app screenshot here',
        caption: 'Weekend build: Pulse, a habit tracker that texts you like a friend, not an app. 4.8\u2605 on the store.',
        likes: 176, comments: [
          { u: 'ankit.dev', t: 'The streak animations are so satisfying', when: '1mo' }
        ] }
    ],
    stories: [
      { label: 'About', glyph: 'A', grad: 'linear-gradient(150deg,#0ea5e9,#1d4ed8)', slides: [
        { kicker: 'ABOUT', title: 'Hey, I\u2019m Anand \uD83D\uDC4B', body: 'Founder and full-stack developer. I turn ideas into shipped products \u2014 fast.' },
        { kicker: 'THE SHORT VERSION', title: '2 startups. 3 hackathon wins.', body: 'One obsession: building things people actually use.' }
      ] },
      { label: 'Stackline', glyph: 'S', grad: 'linear-gradient(150deg,#0891b2,#155e75)', slides: [
        { kicker: 'STARTUP 01 \u00B7 2023', title: 'Stackline', body: 'Inventory autopilot for small e-commerce stores. Started as a dorm-room script.' },
        { kicker: 'TRACTION', title: '120 stores \u00B7 50k orders/mo', body: 'Bootstrapped to real revenue \u2014 no funding, just customers.' }
      ] },
      { label: 'Orbitly', glyph: 'O', grad: 'linear-gradient(150deg,#06b6d4,#3b82f6)', slides: [
        { kicker: 'STARTUP 02 \u00B7 2025', title: 'Orbitly', body: 'Team onboarding that runs itself. My second company.' },
        { kicker: 'WEEK ONE', title: '1,000 users', body: 'Launched on Product Hunt \u2014 #2 Product of the Day.' }
      ] },
      { label: 'Wins', glyph: '3\u00D7', grad: 'linear-gradient(150deg,#1d4ed8,#6d28d9)', slides: [
        { kicker: 'HACKATHONS', title: '3 wins, 36-hour sprints', body: 'HackNova \u201925 \u00B7 DevsHack \u201925 \u00B7 CodeStorm \u201924.' },
        { kicker: 'WHY I LOVE THEM', title: 'Idea \u2192 demo in a weekend', body: 'Hackathons are where I prototype the future.' }
      ] },
      { label: 'Stack', glyph: '</>', grad: 'linear-gradient(150deg,#0f172a,#334155)', slides: [
        { kicker: 'TOOLBOX', title: 'TypeScript \u00B7 React \u00B7 Node', body: 'Postgres, Redis, AWS \u2014 and whatever the problem actually needs.' }
      ] },
      { label: 'Contact', glyph: '@', grad: 'linear-gradient(150deg,#0e7490,#0f766e)', slides: [
        { kicker: 'SAY HI', title: 'hi@anand.dev', body: 'Open to collabs, contracts and coffee chats. DM me right here, too.' }
      ] }
    ],
    reels: [
      { id: 'r1', slot: 'reel-orbitly', tag: 'Demo', title: 'Orbitly onboarding \u2014 30s demo', sub: 'From signup to first win in one take.', likesN: 1208, commentCount: '86', placeholder: 'Drop a vertical Orbitly demo cover here', audio: 'Original audio \u00B7 anand.builds', comments: [
        { u: 'priya.codes', t: 'This onboarding is *chef\u2019s kiss* \uD83D\uDC4C', when: '1d' },
        { u: 'devraj_', t: 'How long did the flow take to build?', when: '20h' }
      ] },
      { id: 'r2', slot: 'reel-journey', tag: 'Story', title: 'Dorm room \u2192 demo day', sub: 'Two years of Stackline in 45 seconds.', likesN: 986, commentCount: '54', placeholder: 'Drop a vertical startup-journey cover here', audio: 'Original audio \u00B7 anand.builds', comments: [
        { u: 'mentor.vik', t: 'The grind is real. Proud of you.', when: '3d' }
      ] },
      { id: 'r3', slot: 'reel-hack', tag: 'Hackathon', title: '36 hours in 60 seconds', sub: 'HackNova time-lapse. Yes, that\u2019s me asleep at 4am.', likesN: 743, commentCount: '41', placeholder: 'Drop a vertical hackathon montage cover here', audio: 'Original audio \u00B7 anand.builds', comments: [
        { u: 'teammate.ish', t: '4am espresso gang \uD83D\uDE05', when: '5d' }
      ] }
    ],
    tiles: [
      { kicker: 'STARTUP', label: 'Orbitly \u2014 launch week', grad: G.orbitly, big: 'O', span: 'span 2', pid: 'p1' },
      { kicker: 'HACKATHON', label: 'HackNova \u201925 \u00B7 1st place', grad: G.hacknova, big: 'H', span: 'span 1', pid: 'p2' },
      { kicker: 'STARTUP', label: 'Stackline dashboard', grad: G.stackline, big: 'S', span: 'span 1', pid: 'p3' },
      { kicker: 'OPEN SOURCE', label: 'formkit-lite \u00B7 800\u2605', grad: G.oss, big: '{ }', span: 'span 1', pid: 'p4' },
      { kicker: 'SIDE PROJECT', label: 'Pulse habit tracker', grad: G.pulse, big: 'P', span: 'span 2', pid: 'p6' },
      { kicker: 'HACKATHON', label: 'DevsHack \u00B7 Best AI Hack', grad: G.devshack, big: 'AI', span: 'span 1', pid: 'p5' },
      { kicker: 'TALK', label: '\u201CShip faster\u201D \u00B7 BLR meetup', grad: 'linear-gradient(135deg,#0ea5e9,#0369a1)', big: 'T', span: 'span 1', pid: 'p3' },
      { kicker: 'HACKATHON', label: 'CodeStorm \u201924 \u00B7 winner', grad: 'linear-gradient(135deg,#2563eb,#312e81)', big: 'C', span: 'span 1', pid: 'p2' },
      { kicker: 'DESIGN', label: 'Orbitly design system', grad: 'linear-gradient(135deg,#67e8f9,#3b82f6)', big: 'D', span: 'span 1', pid: 'p1' },
      { kicker: 'CERTIFIED', label: 'AWS Solutions Architect', grad: 'linear-gradient(135deg,#155e75,#1e3a8a)', big: 'A', span: 'span 1', pid: 'p4' }
    ],
    notifs: [
      { span: 'Today', items: [
        { id: 'n1', type: 'follow', u: 'priya.codes', bg: 'linear-gradient(140deg,#f59e0b,#ef4444)', text: 'started following you.', when: '2h' },
        { id: 'n2', type: 'like', u: 'devraj_', bg: 'linear-gradient(140deg,#10b981,#0ea5e9)', text: 'and 38 others liked your post.', when: '5h', thumb: 'linear-gradient(135deg,#06b6d4,#3b82f6)', big: 'O' },
        { id: 'n3', type: 'comment', u: 'sara.designs', bg: 'linear-gradient(140deg,#8b5cf6,#ec4899)', text: 'commented: "That demo had the whole room clapping \uD83D\uDC4F"', when: '8h', thumb: 'linear-gradient(135deg,#1d4ed8,#6d28d9)', big: 'H' }
      ] },
      { span: 'This week', items: [
        { id: 'n4', type: 'follow', u: 'oss.daily', bg: 'linear-gradient(140deg,#06b6d4,#3b82f6)', text: 'started following you.', when: '2d' },
        { id: 'n5', type: 'like', u: 'mentor.vik', bg: 'linear-gradient(140deg,#64748b,#334155)', text: 'liked your reel.', when: '3d', thumb: 'linear-gradient(135deg,#22d3ee,#2563eb)', big: 'P' },
        { id: 'n6', type: 'mention', u: 'teammate.ish', bg: 'linear-gradient(140deg,#f43f5e,#a21caf)', text: 'mentioned you in a comment.', when: '4d', thumb: 'linear-gradient(135deg,#3b82f6,#06b6d4)', big: 'AI' },
        { id: 'n7', type: 'follow', u: 'ankit.dev', bg: 'linear-gradient(140deg,#0ea5e9,#0369a1)', text: 'started following you.', when: '6d' }
      ] }
    ],
    people: [
      { u: 'priya.codes', name: 'Priya \u00B7 Product Designer', bg: 'linear-gradient(140deg,#f59e0b,#ef4444)' },
      { u: 'devraj_', name: 'Devraj \u00B7 Backend Eng', bg: 'linear-gradient(140deg,#10b981,#0ea5e9)' },
      { u: 'sara.designs', name: 'Sara \u00B7 Design Lead', bg: 'linear-gradient(140deg,#8b5cf6,#ec4899)' },
      { u: 'oss.daily', name: 'OSS Daily \u00B7 Newsletter', bg: 'linear-gradient(140deg,#06b6d4,#3b82f6)' },
      { u: 'mentor.vik', name: 'Vikram \u00B7 Angel Investor', bg: 'linear-gradient(140deg,#64748b,#334155)' }
    ]
  };

  /* ==========================================================================
     4. localStorage helpers (used for visitor id + demo fallback)
     ========================================================================== */
  var KEYS = {
    content:      'anand_portfolio_content',
    likes:        'anand_ig_likes',
    saves:        'anand_ig_saves',
    follows:      'anand_ig_follows',
    reelLikes:    'anand_ig_reellikes',
    following:    'anand_ig_following',
    comments:     'anand_ig_comments',
    dms:          'anand_ig_dms',
    adminSession: 'anand_admin_session'
  };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function readLS(k, fb) { try { var r = localStorage.getItem(k); return r === null ? fb : JSON.parse(r); } catch (e) { return fb; } }
  function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function visitorId() {
    var k = 'anand_visitor_id', v = readLS(k, null);
    if (!v) {
      v = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now() + Math.random());
      writeLS(k, v);
    }
    return v;
  }

  /* ==========================================================================
     5. CONTENT — load / save
     ========================================================================== */
  async function loadContent() {
    if (isLive()) {
      try {
        const s = await db();
        const { data, error } = await s.from('content').select('data').eq('id','live').maybeSingle();
        if (error) throw error;
        return data ? data.data : clone(DEFAULT_CONTENT);
      } catch (e) {
        console.warn('[content] loadContent fell back to demo:', e);
      }
    }
    var saved = readLS(KEYS.content, null);
    return saved ? saved : clone(DEFAULT_CONTENT);
  }

  async function saveContent(content) {
    if (isLive()) {
      try {
        const s = await db();
        const { error } = await s.from('content').upsert({ id:'live', data: content, updated_at: new Date().toISOString() });
        if (error) throw error;
        return;
      } catch (e) {
        console.warn('[content] saveContent fell back to demo:', e);
      }
    }
    writeLS(KEYS.content, content);
  }

  function resetDemo() {
    Object.keys(KEYS).forEach(function (k) { try { localStorage.removeItem(KEYS[k]); } catch (e) {} });
  }

  /* ==========================================================================
     6. INTERACTIONS — likes / saves / follows / comments
     ========================================================================== */
  async function getInteractions() {
    if (isLive()) {
      try {
        const s = await db(), vid = visitorId();
        const [lk, sv, rl, fl, fo] = await Promise.all([
          s.from('likes').select('target_id').eq('visitor_id', vid),
          s.from('saves').select('target_id').eq('visitor_id', vid),
          s.from('reel_likes').select('reel_id').eq('visitor_id', vid),
          s.from('follows').select('username').eq('visitor_id', vid),
          s.from('following').select('value').eq('visitor_id', vid).maybeSingle()
        ]);
        const toMap = function (res, key) {
          return (res.data || []).reduce(function (m, r) { m[r[key]] = true; return m; }, {});
        };
        return {
          likes:     toMap(lk, 'target_id'),
          saves:     toMap(sv, 'target_id'),
          reelLikes: toMap(rl, 'reel_id'),
          follows:   toMap(fl, 'username'),
          following: !!(fo.data && fo.data.value)
        };
      } catch (e) {
        console.warn('[content] getInteractions fell back to demo:', e);
      }
    }
    return {
      likes:     readLS(KEYS.likes, {}),
      saves:     readLS(KEYS.saves, {}),
      follows:   readLS(KEYS.follows, {}),
      reelLikes: readLS(KEYS.reelLikes, {}),
      following: readLS(KEYS.following, false)
    };
  }

  async function setFlag(kind, id, value) {
    if (isLive()) {
      try {
        const s = await db(), vid = visitorId();
        if (kind === 'following') {
          const { error } = await s.from('following').upsert({ visitor_id: vid, value: value, updated_at: new Date().toISOString() });
          if (error) throw error;
          // mirror to local for instant reads
          writeLS(KEYS.following, value);
          return;
        }
        const table = (kind === 'reelLikes') ? 'reel_likes' : kind;
        const col = (kind === 'follows') ? 'username' : (kind === 'reelLikes' ? 'reel_id' : 'target_id');
        if (value) {
          const row = { visitor_id: vid };
          row[col] = id;
          const { error } = await s.from(table).upsert(row);
          if (error) throw error;
        } else {
          const { error } = await s.from(table).delete().eq('visitor_id', vid).eq(col, id);
          if (error) throw error;
        }
        // mirror to local
        var map = readLS(KEYS[kind], {}); map[id] = value; writeLS(KEYS[kind], map);
        return;
      } catch (e) {
        console.warn('[content] setFlag fell back to demo:', e);
      }
    }
    if (kind === 'following') { writeLS(KEYS.following, value); return; }
    var lmap = readLS(KEYS[kind], {});
    lmap[id] = value;
    writeLS(KEYS[kind], lmap);
  }

  async function getComments(targetId) {
    if (isLive()) {
      try {
        const s = await db();
        const { data, error } = await s.from('comments')
          .select('username,body,created_at')
          .eq('target_id', targetId)
          .order('created_at');
        if (error) throw error;
        return (data || []).map(function (r) { return { u: r.username, t: r.body, when: 'now' }; });
      } catch (e) {
        console.warn('[content] getComments fell back to demo:', e);
      }
    }
    var all = readLS(KEYS.comments, {});
    return all[targetId] || [];
  }

  async function addComment(targetId, comment) {
    if (isLive()) {
      try {
        const s = await db();
        const { error } = await s.from('comments').insert({
          target_id: targetId,
          username: comment.u || 'you',
          body: comment.t
        });
        if (error) throw error;
        return comment;
      } catch (e) {
        console.warn('[content] addComment fell back to demo:', e);
      }
    }
    var all = readLS(KEYS.comments, {});
    all[targetId] = (all[targetId] || []).concat([comment]);
    writeLS(KEYS.comments, all);
    return comment;
  }

  /* ==========================================================================
     7. DMs
     ========================================================================== */
  async function getDms() {
    if (isLive()) {
      try {
        const s = await db(), vid = visitorId();
        const { data, error } = await s.from('dms')
          .select('sender,body')
          .eq('thread_id', vid)
          .order('created_at');
        if (error) throw error;
        if (!data || !data.length) {
          return [{ from: 'them', text: 'Hey! \uD83D\uDC4B Thanks for stopping by my portfolio. Ask me anything \u2014 or just say hi.' }];
        }
        return data.map(function (r) { return { from: r.sender, text: r.body }; });
      } catch (e) {
        console.warn('[content] getDms fell back to demo:', e);
      }
    }
    return readLS(KEYS.dms, null) || [
      { from: 'them', text: 'Hey! \uD83D\uDC4B Thanks for stopping by my portfolio. Ask me anything \u2014 or just say hi.' }
    ];
  }

  async function saveDms(thread) {
    if (isLive()) {
      try {
        const s = await db(), vid = visitorId();
        const last = thread[thread.length - 1];
        if (last) {
          const { error } = await s.from('dms').insert({
            thread_id: vid,
            sender: last.from,
            body: last.text
          });
          if (error) throw error;
        }
        // mirror to local so the canned auto-reply UI logic still works
        writeLS(KEYS.dms, thread);
        return;
      } catch (e) {
        console.warn('[content] saveDms fell back to demo:', e);
      }
    }
    writeLS(KEYS.dms, thread);
  }

  /* ==========================================================================
     8. ADMIN (password gate — swap to Supabase Auth later)
     ========================================================================== */
  function checkAdminPassword(pw) { return pw === CONFIG.adminPassword; }
  function isAdminSession() { return readLS(KEYS.adminSession, false) === true; }
  function setAdminSession(on) { writeLS(KEYS.adminSession, !!on); }

  /* ==========================================================================
     EXPORT
     ========================================================================== */
  window.PortfolioContent = {
    CONFIG: CONFIG,
    SCHEMA_DEFAULT: DEFAULT_CONTENT,
    loadContent: loadContent,
    saveContent: saveContent,
    resetDemo: resetDemo,
    getInteractions: getInteractions,
    setFlag: setFlag,
    getComments: getComments,
    addComment: addComment,
    getDms: getDms,
    saveDms: saveDms,
    checkAdminPassword: checkAdminPassword,
    isAdminSession: isAdminSession,
    setAdminSession: setAdminSession,
    isLive: isLive
  };
})();
