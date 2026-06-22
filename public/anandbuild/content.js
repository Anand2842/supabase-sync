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
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoeGJiaHhhY2RvdGNjZm5iY3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NDE3MTIsImV4cCI6MjA5NzExNzcxMn0.QG62okVosjWnYFeDPl-nP3G4NRUDTWbm9eo-yMwyzLA'
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
      email: 'aanand.ak15@gmail.com',
      resumeUrl: ''
    },
    feedRatio: { posts: 2, reels: 1 },
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
      { label: 'About', glyph: 'A', grad: 'linear-gradient(150deg,#0ea5e9,#1d4ed8)', time: '2y', slides: [
        { kicker: 'ABOUT', title: 'Hey, I\u2019m Anand \uD83D\uDC4B', body: 'Founder and full-stack developer. I turn ideas into shipped products \u2014 fast.', slot: 'slide-about-1', placeholder: 'About slide 1' },
        { kicker: 'THE SHORT VERSION', title: '2 startups. 3 hackathon wins.', body: 'One obsession: building things people actually use.', slot: 'slide-about-2', placeholder: 'About slide 2' }
      ] },
      { label: 'Stackline', glyph: 'S', grad: 'linear-gradient(150deg,#0891b2,#155e75)', time: '2y', slides: [
        { kicker: 'STARTUP 01 \u00B7 2023', title: 'Stackline', body: 'Inventory autopilot for small e-commerce stores. Started as a dorm-room script.', slot: 'slide-stackline-1', placeholder: 'Stackline slide 1' },
        { kicker: 'TRACTION', title: '120 stores \u00B7 50k orders/mo', body: 'Bootstrapped to real revenue \u2014 no funding, just customers.', slot: 'slide-stackline-2', placeholder: 'Stackline slide 2' }
      ] },
      { label: 'Orbitly', glyph: 'O', grad: 'linear-gradient(150deg,#06b6d4,#3b82f6)', time: '1mo', slides: [
        { kicker: 'STARTUP 02 \u00B7 2025', title: 'Orbitly', body: 'Team onboarding that runs itself. My second company.', slot: 'slide-orbitly-1', placeholder: 'Orbitly slide 1' },
        { kicker: 'WEEK ONE', title: '1,000 users', body: 'Launched on Product Hunt \u2014 #2 Product of the Day.', slot: 'slide-orbitly-2', placeholder: 'Orbitly slide 2' }
      ] },
      { label: 'Wins', glyph: '3\u00D7', grad: 'linear-gradient(150deg,#1d4ed8,#6d28d9)', time: '1y', slides: [
        { kicker: 'HACKATHONS', title: '3 wins, 36-hour sprints', body: 'HackNova \u201925 \u00B7 DevsHack \u201925 \u00B7 CodeStorm \u201924.', slot: 'slide-wins-1', placeholder: 'Wins slide 1' },
        { kicker: 'WHY I LOVE THEM', title: 'Idea \u2192 demo in a weekend', body: 'Hackathons are where I prototype the future.', slot: 'slide-wins-2', placeholder: 'Wins slide 2' }
      ] },
      { label: 'Stack', glyph: '</>', grad: 'linear-gradient(150deg,#0f172a,#334155)', time: '3y', slides: [
        { kicker: 'TOOLBOX', title: 'TypeScript \u00B7 React \u00B7 Node', body: 'Postgres, Redis, AWS \u2014 and whatever the problem actually needs.', slot: 'slide-stack-1', placeholder: 'Stack slide 1' }
      ] },
      { label: 'Contact', glyph: '@', grad: 'linear-gradient(150deg,#0e7490,#0f766e)', time: 'now', slides: [
        { kicker: 'SAY HI', title: 'aanand.ak15@gmail.com', body: 'Open to collabs, contracts and coffee chats. DM me right here, too.', slot: 'slide-contact-1', placeholder: 'Contact slide 1' }
      ] }
    ],
    reels: [
      { id: 'r1', slot: 'reel-orbitly', tag: 'Demo', title: 'Orbitly onboarding \u2014 30s demo', sub: 'From signup to first win in one take.', likesN: 1208, commentCount: '86', placeholder: 'Drop a vertical Orbitly demo cover here', audio: 'Original audio \u00B7 anand.builds', time: '1d', comments: [
        { u: 'priya.codes', t: 'This onboarding is *chef\u2019s kiss* \uD83D\uDC4C', when: '1d' },
        { u: 'devraj_', t: 'How long did the flow take to build?', when: '20h' }
      ] },
      { id: 'r2', slot: 'reel-journey', tag: 'Story', title: 'Dorm room \u2192 demo day', sub: 'Two years of Stackline in 45 seconds.', likesN: 986, commentCount: '54', placeholder: 'Drop a vertical startup-journey cover here', audio: 'Original audio \u00B7 anand.builds', time: '3d', comments: [
        { u: 'mentor.vik', t: 'The grind is real. Proud of you.', when: '3d' }
      ] },
      { id: 'r3', slot: 'reel-hack', tag: 'Hackathon', title: '36 hours in 60 seconds', sub: 'HackNova time-lapse. Yes, that\u2019s me asleep at 4am.', likesN: 743, commentCount: '41', placeholder: 'Drop a vertical hackathon montage cover here', audio: 'Original audio \u00B7 anand.builds', time: '5d', comments: [
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
          .select('username,body,avatar,created_at')
          .eq('target_id', targetId)
          .order('created_at');
        if (error) throw error;
        return (data || []).map(function (r) { return { u: r.username, t: r.body, avatar: r.avatar || null, when: 'now' }; });
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
          body: comment.t,
          avatar: comment.avatar || null
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
     6b. IDENTITY — display name + emoji avatar for anonymous commenters
     ========================================================================== */
  var AVATARS = ['🦊','🐼','🦁','🐧','🐸','🐵','🦄','🐙','🦉','🐯','🐨','🐺'];
  var ADJ = ['quiet','curious','sunny','brave','calm','swift','bold','witty','kind','clever','lucky','mellow'];
  var ANIMALS = ['otter','panda','fox','koala','tiger','owl','wolf','seal','crane','heron','lynx','moth'];
  var IDENTITY_KEY = 'anand_visitor_identity';

  function _randName() {
    return ADJ[Math.floor(Math.random()*ADJ.length)] + '_' + ANIMALS[Math.floor(Math.random()*ANIMALS.length)] + Math.floor(100 + Math.random()*900);
  }

  async function getIdentity() {
    var local = readLS(IDENTITY_KEY, null);
    if (local) return local;
    if (isLive()) {
      try {
        const s = await db(), vid = visitorId();
          const { data } = await s.from('visitor_identities_public').select('display_name,avatar_key').eq('visitor_id', vid).maybeSingle();
        if (data) {
          var id = { displayName: data.display_name, avatar: data.avatar_key };
          writeLS(IDENTITY_KEY, id);
          return id;
        }
      } catch (e) {}
    }
    return null;
  }

  async function setIdentity(opts) {
    var avatar = (opts && opts.avatar) || AVATARS[Math.floor(Math.random()*AVATARS.length)];
    var name = (opts && opts.displayName && String(opts.displayName).trim()) || '';
    var randomName = null;
    if (!name) {
      // try a few times to land a unique random name
      if (isLive()) {
        try {
          const s = await db();
          for (var i = 0; i < 6; i++) {
            var cand = _randName();
            var { data } = await s.from('visitor_identities_public').select('visitor_id').eq('random_name', cand).maybeSingle();
            if (!data) { name = cand; randomName = cand; break; }
          }
        } catch (e) {}
      }
      if (!name) { name = _randName(); randomName = name; }
    }
    var id = { displayName: name, avatar: avatar };
    writeLS(IDENTITY_KEY, id);
    if (isLive()) {
      try {
        const s = await db(), vid = visitorId();
        await s.from('visitor_identities').upsert({
          visitor_id: vid, display_name: name, random_name: randomName, avatar_key: avatar
        });
      } catch (e) { console.warn('[content] setIdentity persist failed:', e); }
    }
    return id;
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
     8. ADMIN — real auth via Lovable Cloud (Supabase Auth)
     ========================================================================== */
  // Mirror of getSession() updated by onAuthStateChange so the UI can
  // synchronously decide whether the admin shell is unlocked.
  var _authed = false;
  var _authReady = false;
  var _authListeners = [];
  function onAuthChange(fn) { _authListeners.push(fn); if (_authReady) fn(_authed); }
  function _emit() { for (var i = 0; i < _authListeners.length; i++) { try { _authListeners[i](_authed); } catch (e) {} } }

  (async function bootAuth() {
    try {
      var s = await db();
      var r = await s.auth.getSession();
      _authed = !!(r && r.data && r.data.session);
      _authReady = true;
      _emit();
      s.auth.onAuthStateChange(function (evt, session) {
        // Ignore noisy events that fire on tab focus / hourly refresh —
        // they were causing the UI to re-hydrate in a loop.
        if (evt !== 'SIGNED_IN' && evt !== 'SIGNED_OUT' && evt !== 'USER_UPDATED') return;
        var next = !!session;
        if (next === _authed) return;
        _authed = next;
        _emit();
      });
    } catch (e) { _authReady = true; _emit(); }
  })();

  function isAdminSession() { return _authed; }

  async function loginAdmin(email, password) {
    try {
      var s = await db();
      var r = await s.auth.signInWithPassword({ email: email, password: password });
      if (r.error) return { ok: false, error: r.error.message };
      _authed = !!r.data.session;
      _emit();
      return { ok: true };
    } catch (e) { return { ok: false, error: String(e && e.message || e) }; }
  }

  async function signupAdmin(email, password) {
    try {
      var s = await db();
      var r = await s.auth.signUp({
        email: email,
        password: password,
        options: { emailRedirectTo: window.location.origin + window.location.pathname }
      });
      if (r.error) return { ok: false, error: r.error.message };
      _authed = !!(r.data && r.data.session);
      _emit();
      return { ok: true, needsConfirm: !_authed };
    } catch (e) { return { ok: false, error: String(e && e.message || e) }; }
  }

  async function logoutAdmin() {
    try { var s = await db(); await s.auth.signOut(); } catch (e) {}
    _authed = false; _emit();
  }

  /* ==========================================================================
     9. INBOX — all DMs (grouped by thread) and all comments (admin only)
     ========================================================================== */
  async function getInbox() {
    var out = { threads: [], comments: [] };
    if (!isLive()) return out;
    try {
      var s = await db();
      var [dmRes, cmRes] = await Promise.all([
        s.from('dms').select('thread_id,sender,body,created_at').order('created_at'),
        s.from('comments').select('target_id,username,body,created_at').order('created_at', { ascending: false })
      ]);
      var byThread = {};
      (dmRes.data || []).forEach(function (m) {
        (byThread[m.thread_id] = byThread[m.thread_id] || []).push(m);
      });
      out.threads = Object.keys(byThread).map(function (tid) {
        var msgs = byThread[tid];
        var last = msgs[msgs.length - 1];
        return {
          thread_id: tid,
          short: tid.slice(0, 8),
          count: msgs.length,
          last_body: last.body,
          last_sender: last.sender,
          last_at: last.created_at,
          messages: msgs
        };
      }).sort(function (a, b) { return (b.last_at || '').localeCompare(a.last_at || ''); });
      out.comments = (cmRes.data || []).map(function (c) {
        return { target_id: c.target_id, username: c.username, body: c.body, created_at: c.created_at };
      });
    } catch (e) { console.warn('[content] getInbox failed:', e); }
    return out;
  }

  async function replyToThread(threadId, body) {
    try {
      var s = await db();
      var r = await s.from('dms').insert({ thread_id: threadId, sender: 'them', body: body });
      if (r.error) throw r.error;
      return { ok: true };
    } catch (e) { return { ok: false, error: String(e && e.message || e) }; }
  }

  /* ==========================================================================
     EXPORT
     ========================================================================== */
  window.PortfolioContent = {
    CONFIG: CONFIG,
    SCHEMA_DEFAULT: DEFAULT_CONTENT,
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
    isAdminSession: isAdminSession,
    onAuthChange: onAuthChange,
    loginAdmin: loginAdmin,
    signupAdmin: signupAdmin,
    logoutAdmin: logoutAdmin,
    getInbox: getInbox,
    replyToThread: replyToThread,
    getSubscribers: async function() {
      if (!db) return [];
      try {
        var r = await db.from('subscribers').select('*').order('created_at', { ascending: false });
        return (r && r.data) ? r.data : [];
      } catch (e) { console.warn('[content] getSubscribers failed:', e); return []; }
    },
    uploadResume: async function(file) {
      if (!db) return null;
      try {
        var ext = file.name.split('.').pop() || 'pdf';
        var path = 'resume/resume.' + ext;
        var r = await db.storage.from('portfolio-images').upload(path, file, { upsert: true });
        if (r && r.error) { console.warn('[content] uploadResume error:', r.error); return null; }
        var url = db.storage.from('portfolio-images').getPublicUrl(path);
        return (url && url.data) ? url.data.publicUrl : null;
      } catch (e) { console.warn('[content] uploadResume failed:', e); return null; }
    },
    getIdentity: getIdentity,
    setIdentity: setIdentity,
    AVATARS: AVATARS,
    isLive: isLive,
    _db: db,

    /* ===== MCP pending changes (admin approval queue) ===== */
    getPendingChanges: async function (status) {
      try {
        var s = await db();
        var q = s.from('pending_changes').select('*').order('created_at', { ascending: false }).limit(200);
        if (status) q = q.eq('status', status);
        var r = await q;
        if (r.error) throw r.error;
        return r.data || [];
      } catch (e) { console.warn('[content] getPendingChanges failed:', e); return []; }
    },
    getPendingCount: async function () {
      try {
        var s = await db();
        var r = await s.from('pending_changes').select('id', { count: 'exact', head: true }).eq('status', 'pending');
        return r.count || 0;
      } catch (e) { return 0; }
    },
    rejectPending: async function (id) {
      try {
        var s = await db();
        var r = await s.from('pending_changes').update({ status: 'rejected', decided_at: new Date().toISOString() }).eq('id', id).eq('status', 'pending');
        if (r.error) throw r.error;
        return { ok: true };
      } catch (e) { return { ok: false, error: String(e && e.message || e) }; }
    },
    editPendingPayload: async function (id, payload) {
      try {
        var s = await db();
        var r = await s.from('pending_changes').update({ payload: payload }).eq('id', id).eq('status', 'pending');
        if (r.error) throw r.error;
        return { ok: true };
      } catch (e) { return { ok: false, error: String(e && e.message || e) }; }
    },
    applyPending: async function (id) {
      try {
        var s = await db();
        var rowRes = await s.from('pending_changes').select('*').eq('id', id).maybeSingle();
        if (rowRes.error || !rowRes.data) throw rowRes.error || new Error('Pending change not found');
        var row = rowRes.data;
        if (row.status !== 'pending') throw new Error('Already ' + row.status);
        var contentRes = await s.from('content').select('data').eq('id', 'live').maybeSingle();
        if (contentRes.error) throw contentRes.error;
        var content = (contentRes.data && contentRes.data.data) || JSON.parse(JSON.stringify(DEFAULT_CONTENT));
        var KEYS = { post: 'posts', reel: 'reels', story_group: 'stories', about_item: 'about' };
        var payload = row.payload || {};
        if (row.entity === 'profile') {
          content.profile = Object.assign({}, content.profile || {}, payload);
        } else if (row.entity === 'feed_ratio') {
          content.feedRatio = { posts: +payload.posts || 0, reels: +payload.reels || 0 };
        } else {
          var key = KEYS[row.entity];
          if (!key) throw new Error('Unknown entity ' + row.entity);
          var list = Array.isArray(content[key]) ? content[key].slice() : [];
          if (row.action === 'create') {
            if (!payload.id) payload.id = (row.entity[0] + Math.random().toString(36).slice(2, 8));
            list.push(payload);
          } else if (row.action === 'update') {
            var idx = -1;
            for (var i = 0; i < list.length; i++) { if (String(list[i].id || list[i].label || '') === String(row.entity_id)) { idx = i; break; } }
            if (idx === -1) throw new Error('Item ' + row.entity_id + ' not found');
            list[idx] = Object.assign({}, list[idx], payload);
          } else if (row.action === 'delete') {
            list = list.filter(function (it) { return String(it.id || it.label || '') !== String(row.entity_id); });
          } else if (row.action === 'reorder') {
            var ids = payload.ordered_ids || [];
            var byId = {}; list.forEach(function (it) { byId[String(it.id || it.label || '')] = it; });
            var reordered = []; ids.forEach(function (id2) { if (byId[String(id2)]) reordered.push(byId[String(id2)]); });
            list.forEach(function (it) { var id2 = String(it.id || it.label || ''); if (ids.indexOf(id2) === -1) reordered.push(it); });
            list = reordered;
          } else {
            throw new Error('Unknown action ' + row.action);
          }
          content[key] = list;
        }
        var saveRes = await s.from('content').upsert({ id: 'live', data: content, updated_at: new Date().toISOString() });
        if (saveRes.error) throw saveRes.error;
        var mark = await s.from('pending_changes').update({ status: 'applied', decided_at: new Date().toISOString(), apply_error: null }).eq('id', id);
        if (mark.error) console.warn('[content] mark applied error:', mark.error);
        return { ok: true };
      } catch (e) {
        try {
          var s2 = await db();
          await s2.from('pending_changes').update({ status: 'failed', decided_at: new Date().toISOString(), apply_error: String(e && e.message || e) }).eq('id', id);
        } catch (_) {}
        return { ok: false, error: String(e && e.message || e) };
      }
    }
  };
})();
