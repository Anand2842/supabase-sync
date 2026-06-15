/* ============================================================================
   content.js  —  THE CONTENT LAYER
   ----------------------------------------------------------------------------
   ⭐ THIS IS THE ONLY FILE YOUR BACKEND AGENT (Codex / Antigravity) SHOULD TOUCH.

   WHY THIS FILE EXISTS
   --------------------
   The portfolio UI ("Anand Portfolio.dc.html") used to have all of its content
   hard-coded *inside* the rendering code. That is why wiring a backend kept
   "exploding everything": the agent had to reach into the middle of the UI and
   guess the data shape, and one wrong move cascaded through the whole screen.

   Now there is a clean contract:

        Supabase  <-->  content.js  <-->  the UI (never edited)

   The UI ONLY calls the functions exported on `window.PortfolioContent`.
   It never knows or cares where the data comes from. So you can replace the
   demo-mode (browser localStorage) bodies below with real Supabase calls and
   NOTHING in the UI has to change. If you keep your return shapes identical to
   SCHEMA below, the frontend cannot break.

   HOW TO GO LIVE (3 steps)
   ------------------------
   1. Run supabase_schema.sql in your Supabase project's SQL editor.
   2. Paste your URL + anon key into CONFIG below.
   3. Replace each `// TODO(backend)` block with the Supabase call shown in
      BACKEND.md. Leave the demo-mode code as the fallback if you like.

   RULE OF THUMB: change the BODIES of these functions, never their NAMES,
   ARGUMENTS, or RETURN SHAPES. That contract is what keeps the UI safe.
   ============================================================================ */
(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIG  —  paste your keys here to switch from demo mode to Supabase
     ========================================================================== */
  var CONFIG = {
    supabaseUrl: '',        // e.g. 'https://xxxx.supabase.co'  (Project Settings → API)
    supabaseAnonKey: '',    // the public 'anon' key

    // Simple gate for /admin today. Swap for Supabase Auth later (see BACKEND.md).
    adminPassword: 'letmein'
  };

  function isLive() { return !!(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey); }

  /* ==========================================================================
     2. SCHEMA  —  the single source of truth for the SHAPE of content.
        Every function below returns data in exactly this shape. Match it and
        the UI renders; deviate and you will see blanks. Keep it identical.
     --------------------------------------------------------------------------
     content = {
       profile: { name, username, role, bio, email },
       posts:   [ { id, time, label, slot, aspect, grad, big, placeholder,
                    images?: [ { slot, placeholder } ],   // optional carousel
                    caption, likes:Number, comments: [ { u, t, when } ] } ],
       stories: [ { label, glyph, grad,
                    slides: [ { kicker, title, body } ] } ],
       reels:   [ { id, slot, tag, title, sub, likesN:Number, commentCount:String,
                    placeholder, audio, comments: [ { u, t, when } ] } ],
       tiles:   [ { kicker, label, grad, big, span, pid } ],   // pid -> a post id
       notifs:  [ { span, items: [ { id, type, u, bg, text, when, thumb?, big? } ] } ],
       people:  [ { u, name, bg } ]
     }
     ========================================================================== */

  // Gradient palette reused across the seed content.
  var G = {
    orbitly:   'linear-gradient(135deg,#06b6d4,#3b82f6)',
    hacknova:  'linear-gradient(135deg,#1d4ed8,#6d28d9)',
    stackline: 'linear-gradient(135deg,#0891b2,#155e75)',
    oss:       'linear-gradient(135deg,#334155,#0f172a)',
    devshack:  'linear-gradient(135deg,#3b82f6,#06b6d4)',
    pulse:     'linear-gradient(135deg,#22d3ee,#2563eb)'
  };

  /* ==========================================================================
     3. DEFAULT_CONTENT  —  the seed. This is what ships before any edits and
        what supabase_schema.sql seeds the database with. The CRM at /admin
        edits a copy of this; Publish saves it via saveContent().
     ========================================================================== */
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
     4. small helpers (demo-mode storage). Safe to delete once fully on Supabase.
     ========================================================================== */
  var KEYS = {
    content:      'anand_portfolio_content',   // owner-published content (CRM)
    likes:        'anand_ig_likes',
    saves:        'anand_ig_saves',
    follows:      'anand_ig_follows',
    reelLikes:    'anand_ig_reellikes',
    following:    'anand_ig_following',
    comments:     'anand_ig_comments',         // visitor comments, keyed by target id
    dms:          'anand_ig_dms',              // visitor DM thread
    adminSession: 'anand_admin_session'
  };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function readLS(k, fb) { try { var r = localStorage.getItem(k); return r === null ? fb : JSON.parse(r); } catch (e) { return fb; } }
  function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ==========================================================================
     5. CONTENT  —  read & write the owner-managed content (profile/posts/etc).
        loadContent() feeds the whole UI. saveContent() is called by /admin.
     ========================================================================== */

  // Returns the full content object (SCHEMA above). UI calls this once on load.
  async function loadContent() {
    if (isLive()) {
      // TODO(backend): fetch the published content from Supabase and return it
      //   in the SCHEMA shape. See BACKEND.md → "loadContent".
      //   const c = await sb.from('content').select('data').eq('id','live').single();
      //   return c.data;
    }
    // ---- demo mode (browser only) ----
    var saved = readLS(KEYS.content, null);
    return saved ? saved : clone(DEFAULT_CONTENT);
  }

  // Persists edited content. Called by the CRM "Publish" button.
  async function saveContent(content) {
    if (isLive()) {
      // TODO(backend): upsert into Supabase. See BACKEND.md → "saveContent".
      //   await sb.from('content').upsert({ id:'live', data: content });
      //   return;
    }
    writeLS(KEYS.content, content);
  }

  // Throw away owner edits and visitor interactions, back to the seed.
  function resetDemo() {
    Object.keys(KEYS).forEach(function (k) { try { localStorage.removeItem(KEYS[k]); } catch (e) {} });
  }

  /* ==========================================================================
     6. INTERACTIONS  —  visitor-generated data (likes / saves / comments / DMs).
        These are "real": they persist. In demo mode that means this browser;
        with Supabase it means everyone, and you read DMs/comments in /admin.

        Return shapes:
          getInteractions() -> { likes:{}, saves:{}, follows:{}, reelLikes:{}, following:Bool }
          getComments(id)   -> [ { u, t, when } ]
          getDms()          -> [ { from:'me'|'them', text } ]
     ========================================================================== */

  async function getInteractions() {
    if (isLive()) {
      // TODO(backend): load this visitor's likes/saves/follows from Supabase.
    }
    return {
      likes:     readLS(KEYS.likes, {}),
      saves:     readLS(KEYS.saves, {}),
      follows:   readLS(KEYS.follows, {}),
      reelLikes: readLS(KEYS.reelLikes, {}),
      following: readLS(KEYS.following, false)
    };
  }

  // kind: 'likes' | 'saves' | 'follows' | 'reelLikes' | 'following'
  // For map kinds, `id` is the target id and `value` the new boolean.
  // For 'following', pass value only.
  async function setFlag(kind, id, value) {
    if (isLive()) {
      // TODO(backend): write the like/save/follow row to Supabase.
    }
    if (kind === 'following') { writeLS(KEYS.following, value); return; }
    var map = readLS(KEYS[kind], {});
    map[id] = value;
    writeLS(KEYS[kind], map);
  }

  // Returns visitor-added comments for a post/reel id (NOT the seed comments,
  // which live in the content object). UI merges the two.
  async function getComments(targetId) {
    if (isLive()) {
      // TODO(backend): select comments where target_id = targetId, order by created_at.
    }
    var all = readLS(KEYS.comments, {});
    return all[targetId] || [];
  }

  // comment = { u, t, when }
  async function addComment(targetId, comment) {
    if (isLive()) {
      // TODO(backend): insert into comments(target_id, username, body) and return the row.
    }
    var all = readLS(KEYS.comments, {});
    all[targetId] = (all[targetId] || []).concat([comment]);
    writeLS(KEYS.comments, all);
    return comment;
  }

  // Returns the DM thread as the UI expects: [ { from:'me'|'them', text } ].
  async function getDms() {
    if (isLive()) {
      // TODO(backend): select messages for this visitor thread, ordered.
    }
    return readLS(KEYS.dms, null) || [
      { from: 'them', text: 'Hey! \uD83D\uDC4B Thanks for stopping by my portfolio. Ask me anything \u2014 or just say hi.' }
    ];
  }

  // msg = { from:'me'|'them', text }. Appends and persists the whole thread.
  async function saveDms(thread) {
    if (isLive()) {
      // TODO(backend): the UI calls this after each message; insert the new row(s).
      //   For visitor->owner DMs, insert from='me'. Owner replies (from='them')
      //   come from the /admin inbox. See BACKEND.md → "DMs".
    }
    writeLS(KEYS.dms, thread);
  }

  /* ==========================================================================
     7. ADMIN  —  who can open /admin. Demo = a password. Later = Supabase Auth.
     ========================================================================== */
  function checkAdminPassword(pw) { return pw === CONFIG.adminPassword; }
  function isAdminSession() { return readLS(KEYS.adminSession, false) === true; }
  function setAdminSession(on) { writeLS(KEYS.adminSession, !!on); }

  /* ==========================================================================
     EXPORT  —  the contract the UI depends on. Don't rename these.
     ========================================================================== */
  window.PortfolioContent = {
    CONFIG: CONFIG,
    isLive: isLive,
    DEFAULT_CONTENT: DEFAULT_CONTENT,
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
    setAdminSession: setAdminSession
  };
})();
