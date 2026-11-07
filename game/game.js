// ふわふわさんの だいぼうけん — ながれてくる たべものを あつめて、まっている あいてに わたして なかよく なる げーむ
// しゅじんこう がぞう: fuwafuwa.png（もとの え から きりぬいた もの）
'use strict';

const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const W = 960, H = 540;

const heroImg = new Image();
let heroImgOk = false;
heroImg.onload = () => { heroImgOk = true; };
heroImg.src = 'fuwafuwa.png';

// ---------- たべもの ----------
const FOODS = {
  bone: '🦴', fish: '🐟', carrot: '🥕', cheese: '🧀', corn: '🌽', dango: '🍡', onigiri: '🍙', honey: '🍯',
  banana: '🍌', acorn: '🌰', egg: '🥚', strawberry: '🍓', lettuce: '🥬', meat: '🍖', melon: '🍉', flower: '🌸',
  shrimp: '🦐', shell: '🐚', candy: '🍬',
  cookie: '🍪', lollipop: '🍭', donut: '🍩', battery: '🔋', apple: '🍎', shaved: '🍧', cake: '🍰',
};

// move: float（ふわふわ）/ wave（なみ）/ hop（ぴょん）/ zigzag / slow（のんびり）
const STAGES = [
  {
    name: '1めん まち', sky: ['#9fdcff', '#eef9ff'],
    creatures: [
      { e: '🐶', n: 'いぬ', fav: 'bone', move: 'hop' },
      { e: '🐱', n: 'ねこ', fav: 'fish', move: 'float' },
      { e: '🐰', n: 'うさぎ', fav: 'carrot', move: 'hop' },
      { e: '🐭', n: 'ねずみ', fav: 'cheese', move: 'zigzag' },
      { e: '🐥', n: 'ひよこ', fav: 'corn', move: 'wave' },
      { e: '👻', n: 'おばけ', fav: 'dango', move: 'wave' },
      { e: '🦝', n: 'たぬき', fav: 'onigiri', move: 'slow' },
      { e: '🐹', n: 'はむすたー', fav: 'corn', move: 'zigzag' },
      { e: '🐻', n: 'くま', fav: 'honey', move: 'slow' },
      { e: '🦊', n: 'きつね', fav: 'onigiri', move: 'float' },
    ],
    big: { e: '🐘', n: 'ぞうさん', fav: 'carrot' },
    music: { bpm: 104, wave: 'triangle', root: 72, scale: [0, 2, 4, 7, 9],
      mel: [0,2,4,2, 5,4,2,-1, 1,2,3,2, 4,-1,2,-1], bass: [0,0,3,3,4,4,2,2] },
  },
  {
    name: '2めん じゃんぐる', sky: ['#8fdc8f', '#e4f9cf'],
    creatures: [
      { e: '🐒', n: 'おさる', fav: 'banana', move: 'hop' },
      { e: '🐿️', n: 'りす', fav: 'acorn', move: 'zigzag' },
      { e: '🐍', n: 'へび', fav: 'egg', move: 'wave' },
      { e: '🐸', n: 'かえる', fav: 'strawberry', move: 'hop' },
      { e: '🦥', n: 'なまけもの', fav: 'lettuce', move: 'slow' },
      { e: '🐯', n: 'とら', fav: 'meat', move: 'float' },
      { e: '🦒', n: 'きりん', fav: 'lettuce', move: 'slow' },
      { e: '🐨', n: 'こあら', fav: 'lettuce', move: 'float' },
      { e: '🦛', n: 'かば', fav: 'melon', move: 'slow' },
      { e: '🦋', n: 'ちょうちょ', fav: 'flower', move: 'wave' },
    ],
    big: { e: '🦍', n: 'ごりら', fav: 'banana' },
    music: { bpm: 96, wave: 'triangle', root: 69, scale: [0, 2, 4, 7, 9],
      mel: [0,-1,2,4, 2,-1,0,-1, 4,5,4,2, 3,-1,1,-1], bass: [0,0,4,4,3,3,4,4], drum: true },
  },
  {
    name: '3めん うみ', sky: ['#4aa8e0', '#b6ecfa'],
    creatures: [
      { e: '🐠', n: 'おさかな', fav: 'shrimp', move: 'wave' },
      { e: '🐡', n: 'ふぐ', fav: 'onigiri', move: 'float' },
      { e: '🐬', n: 'いるか', fav: 'fish', move: 'wave' },
      { e: '🦀', n: 'かに', fav: 'egg', move: 'zigzag' },
      { e: '🐢', n: 'かめ', fav: 'strawberry', move: 'slow' },
      { e: '🦭', n: 'あざらし', fav: 'fish', move: 'float' },
      { e: '🐧', n: 'ぺんぎん', fav: 'shrimp', move: 'hop' },
      { e: '🦦', n: 'らっこ', fav: 'shell', move: 'slow' },
      { e: '🐙', n: 'たこ', fav: 'onigiri', move: 'wave' },
      { e: '🪼', n: 'くらげ', fav: 'candy', move: 'float' },
    ],
    big: { e: '🐳', n: 'くじら', fav: 'shrimp' },
    music: { bpm: 84, wave: 'sine', root: 74, scale: [0, 2, 4, 5, 7, 9, 11],
      mel: [0,2,4,-1, 5,4,2,-1, 4,5,6,7, 6,4,2,-1], bass: [0,0,3,3,5,5,4,4] },
  },
  {
    name: '4めん そら', sky: ['#7c86e0', '#ffd1e6'],
    creatures: [
      { e: '🕊️', n: 'はと', fav: 'corn', move: 'wave' },
      { e: '🦉', n: 'ふくろう', fav: 'cookie', move: 'float' },
      { e: '🦄', n: 'ゆにこーん', fav: 'lollipop', move: 'hop' },
      { e: '👽', n: 'うちゅうじん', fav: 'donut', move: 'zigzag' },
      { e: '👾', n: 'ぴこぴこ', fav: 'candy', move: 'zigzag' },
      { e: '🤖', n: 'ろぼっと', fav: 'battery', move: 'slow' },
      { e: '🛸', n: 'ゆーふぉー', fav: 'donut', move: 'wave' },
      { e: '🦇', n: 'こうもり', fav: 'apple', move: 'wave' },
      { e: '🐝', n: 'はちさん', fav: 'honey', move: 'zigzag' },
      { e: '⛄', n: 'ゆきだるま', fav: 'shaved', move: 'slow' },
    ],
    big: { e: '🐉', n: 'どらごん', fav: 'cake' },
    music: { bpm: 100, wave: 'triangle', root: 76, scale: [0, 2, 4, 7, 9],
      mel: [4,2,0,2, 4,4,4,-1, 2,2,2,-1, 4,7,7,-1], bass: [0,0,4,4,3,3,4,4], drum: true },
  },
];

const SCROLL = 0.6;          // すくろーる の はやさ（とても ゆっくり）
const STAGE_LEN = 3000;      // 1めん の ながさ（やく 85びょう ＋ おおきな あいて）
const BIG_NEED = 3;          // おおきな あいて と なかよく なるのに ひつような こうぶつ の かず
const INV_MAX = 6;           // もてる かず

// ---------- おと ----------
let AC = null, master = null, musicGain = null, sfxGain = null;
let musicTimer = null, musicStep = 0, nextNoteTime = 0, curMusic = null, muted = false;

function initAudio() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = 0.6; master.connect(AC.destination);
  musicGain = AC.createGain(); musicGain.gain.value = 0.2; musicGain.connect(master);
  sfxGain = AC.createGain(); sfxGain.gain.value = 0.45; sfxGain.connect(master);
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function tone(freq, t, dur, type, vol, dest, slideTo) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
}
function noise(t, dur, vol, dest, hp) {
  const len = Math.floor(AC.sampleRate * dur);
  const buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = AC.createBufferSource(); s.buffer = buf;
  const f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp || 1000;
  const g = AC.createGain(); g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(dest); s.start(t);
}
function scaleNote(m, deg) {
  const s = m.scale, oct = Math.floor(deg / s.length), i = ((deg % s.length) + s.length) % s.length;
  return m.root + s[i] + 12 * oct;
}
function playMusic(m) {
  stopMusic(); if (!AC) return;
  curMusic = m; musicStep = 0; nextNoteTime = AC.currentTime + 0.1;
  musicTimer = setInterval(scheduleMusic, 25);
}
function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = null; curMusic = null; }
function scheduleMusic() {
  const m = curMusic; if (!m) return;
  const step = 60 / m.bpm / 2;
  while (nextNoteTime < AC.currentTime + 0.12) {
    const t = nextNoteTime, i = musicStep;
    const phrase = Math.floor(i / m.mel.length) % 4;
    let deg = m.mel[i % m.mel.length];
    if (deg >= 0) {
      if (phrase === 1) deg += 2; else if (phrase === 3) deg -= 1;
      tone(mtof(scaleNote(m, deg)), t, step * 1.6, m.wave, 0.16, musicGain);
      tone(mtof(scaleNote(m, deg) + 12), t, step * 0.6, 'sine', 0.03, musicGain); // きらきら
    }
    if (i % 2 === 0) {
      const b = m.bass[(i / 2 | 0) % m.bass.length];
      tone(mtof(scaleNote(m, b) - 24), t, step * 1.9, 'sine', 0.28, musicGain);
    }
    if (m.drum) {
      if (i % 8 === 0) tone(110, t, 0.14, 'sine', 0.35, musicGain, 50);
      if (i % 4 === 2) noise(t, 0.05, 0.06, musicGain, 5000);
    }
    nextNoteTime += step; musicStep++;
  }
}
function jingle(notes, type, step) {
  if (!AC) return; stopMusic();
  let t = AC.currentTime + 0.05;
  for (const n of notes) { if (n > 0) tone(mtof(n), t, step * 1.2, type || 'triangle', 0.2, musicGain); t += step; }
}
const SFX = {
  throw_() { if (!AC) return; const t = AC.currentTime; tone(500, t, 0.18, 'triangle', 0.25, sfxGain, 1000); },
  pick()   { if (!AC) return; const t = AC.currentTime; tone(880, t, 0.08, 'sine', 0.25, sfxGain); tone(1320, t + 0.07, 0.12, 'sine', 0.22, sfxGain); },
  poon()   { if (!AC) return; const t = AC.currentTime; tone(300, t, 0.35, 'triangle', 0.3, sfxGain, 1400); noise(t, 0.1, 0.1, sfxGain, 3000); },
  munch()  { if (!AC) return; const t = AC.currentTime; for (let k = 0; k < 3; k++) noise(t + k * 0.09, 0.05, 0.2, sfxGain, 2500); },
  friend() { if (!AC) return; const t = AC.currentTime; [72, 76, 79, 84].forEach((n, k) => tone(mtof(n), t + k * 0.09, 0.3, 'sine', 0.3, sfxGain)); },
  boing()  { if (!AC) return; const t = AC.currentTime; tone(220, t, 0.3, 'sine', 0.35, sfxGain, 520); },
  hello()  { if (!AC) return; const t = AC.currentTime; tone(mtof(79), t, 0.15, 'sine', 0.15, sfxGain); tone(mtof(84), t + 0.12, 0.2, 'sine', 0.15, sfxGain); },
  big()    { if (!AC) return; const t = AC.currentTime; [60, 64, 67].forEach((n, k) => tone(mtof(n), t + k * 0.2, 0.4, 'triangle', 0.3, sfxGain)); },
};

// ---------- そうさ ----------
// うごく：やじるし / WASD / がめんを なぞる。 はじめる・つぎへ：どの きー でも たっぷ でも
const keys = {}, pressed = {};
let anyKey = false;
addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'NumpadEnter'].includes(e.code)) e.preventDefault();
  if (!keys[e.code]) { pressed[e.code] = true; anyKey = true; }
  keys[e.code] = true; initAudio();
});
addEventListener('keyup', e => { keys[e.code] = false; });
let touchTarget = null;
function canvasPos(e) {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
}
cv.addEventListener('pointerdown', e => { initAudio(); pressed.Tap = true; touchTarget = canvasPos(e); });
cv.addEventListener('pointermove', e => { if (touchTarget) touchTarget = canvasPos(e); });
addEventListener('pointerup', () => { touchTarget = null; });
const anyPressed = () => anyKey || pressed.Tap;

// ---------- じょうたい ----------
const FOOD_SPEED = 2.2;      // たべもの が ながれる はやさ（すこし はやめ）
const MAX_CREATURES = 3;     // いちどに がめんに いる あいて の かず
const STAY = 60 * 45;        // あいて が まっていて くれる じかん

let state = 'title'; // title, intro, play, big, book, ending
let stageIdx = 0, stage = STAGES[0];
let timer = 0, dist = 0, scroll = 0, spawnT = 0, itemT = 0, bigT = 0;
let player, creatures = [], items = [], particles = [], popups = [], big = null;
let friends = [];       // なかま（ぎょうれつ）
let trail = [];         // ふわふわさん の とおった ばしょ
let met = null;         // めんごと に であった / なかよく なった
const ALL_MET = STAGES.map(() => ({ met: new Set(), friend: new Set(), bigMet: false, bigFriend: false }));

function startGame() {
  friends = []; trail = [];
  ALL_MET.forEach(m => { m.met.clear(); m.friend.clear(); m.bigMet = false; m.bigFriend = false; });
  player = { x: 180, y: H / 2, vx: 0, vy: 0, inv: [], surprise: 0 };
  startStage(0);
}
function startStage(i) {
  stageIdx = i; stage = STAGES[i]; met = ALL_MET[i];
  creatures = []; items = []; particles = []; popups = []; big = null;
  dist = 0; spawnT = 60; itemT = 20; timer = 0;
  player.x = 180; player.y = H / 2; player.vx = player.vy = 0; player.inv = [];
  state = 'intro';
  jingle([72, 76, 79, 84, 0, 79, 84], 'triangle', 0.15);
  setTimeout(() => { if (state === 'intro' || state === 'play') playMusic(stage.music); }, 1300);
}

// ---------- でてくる もの ----------
function freeSpot() {
  // ほかの あいて と かさならない ばしょ を さがす
  for (let k = 0; k < 30; k++) {
    const x = W * 0.42 + Math.random() * (W * 0.5), y = 130 + Math.random() * (H - 230);
    if (creatures.every(c => (c.hx - x) ** 2 + (c.hy - y) ** 2 > 170 * 170)) return { x, y };
  }
  return { x: W * 0.5 + Math.random() * W * 0.4, y: 130 + Math.random() * (H - 230) };
}
function spawnCreature() {
  const pool = stage.creatures;
  const here = creatures.map(c => c.t.n);
  // まだ なかよく なって いない こ、まだ であって いない こ が でやすい
  let cand = pool.filter(c => !met.friend.has(c.n) && !here.includes(c.n));
  const unmet = cand.filter(c => !met.met.has(c.n));
  if (unmet.length && Math.random() < 0.7) cand = unmet;
  if (!cand.length) cand = pool.filter(c => !here.includes(c.n));
  const t = cand[Math.floor(Math.random() * cand.length)];
  const s = freeSpot();
  creatures.push({ t, x: W + 70, y: s.y, hx: s.x, hy: s.y, age: 0, r: 38, leaving: false, said: false, ask: 0, ph: Math.random() * 6 });
}
function wantedFoods() {
  const list = creatures.filter(c => !c.leaving).map(c => c.t.fav);
  if (big && !big.leaving) list.push(big.t.fav, big.t.fav, big.t.fav);
  return list;
}
function spawnItem() {
  const want = wantedFoods();
  let key;
  if (want.length && Math.random() < 0.75) key = want[Math.floor(Math.random() * want.length)];
  else key = stage.creatures[Math.floor(Math.random() * stage.creatures.length)].fav;
  const y = 90 + Math.random() * (H - 170);
  items.push({ it: FOODS[key], x: W + 30, y, baseY: y, age: 0, sp: FOOD_SPEED * (0.85 + Math.random() * 0.3), ph: Math.random() * 6 });
}
function spawnBig() {
  const s = { x: W - 200, y: H / 2 };
  big = { t: stage.big, x: W + 160, y: s.y, hx: s.x, hy: s.y, age: 0, fed: 0, r: 88, leaving: false };
  met.bigMet = true; SFX.big();
  popup(W / 2, 150, `おおきな ${stage.big.n} が やってきた！`, '#fff6a8', 150, 30);
  state = 'big'; bigT = 0;
}

function sparkle(x, y, txt, n) {
  for (let i = 0; i < (n || 6); i++) particles.push({ x, y, vx: (Math.random() - 0.5) * 3, vy: -1 - Math.random() * 2, life: 60, txt, r: 18 });
}
function popup(x, y, txt, col, life, size) { popups.push({ x, y, txt, col: col || '#fff', life: life || 80, size: size || 20 }); }
function addFriend(e, n, isBig) { friends.push({ e, n, x: player.x, y: player.y, big: !!isBig }); }

// ---------- こうしん ----------
const d2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const ease = (cur, to, k) => cur + (to - cur) * k;

function update() {
  timer++;
  if (pressed.KeyM) { muted = !muted; if (master) master.gain.value = muted ? 0 : 0.6; }
  if (state === 'title') { if (anyPressed()) { initAudio(); startGame(); } return; }
  if (state === 'book') {
    updateParticles();
    if (timer > 60 && anyPressed()) {
      if (stageIdx + 1 < STAGES.length) startStage(stageIdx + 1);
      else { state = 'ending'; timer = 0; particles = []; jingle([72, 72, 76, 79, 0, 76, 79, 84, 84, 0, 83, 84, 88], 'triangle', 0.18); }
    }
    return;
  }
  if (state === 'ending') {
    updateParticles();
    if (timer > 120 && anyPressed()) { state = 'title'; timer = 0; }
    return;
  }
  if (state === 'intro' && timer > 120) state = 'play';

  // ふわふわさん（かんせい つき）
  const p = player;
  let ax = 0, ay = 0;
  if (keys.ArrowLeft || keys.KeyA) ax -= 1;
  if (keys.ArrowRight || keys.KeyD) ax += 1;
  if (keys.ArrowUp || keys.KeyW) ay -= 1;
  if (keys.ArrowDown || keys.KeyS) ay += 1;
  if (touchTarget) {
    const dx = touchTarget.x - p.x, dy = touchTarget.y - p.y, d = Math.hypot(dx, dy);
    if (d > 8) { ax = dx / d * Math.min(1, d / 120); ay = dy / d * Math.min(1, d / 120); }
  }
  const len = Math.hypot(ax, ay); if (len > 1) { ax /= len; ay /= len; }
  const ACCEL = 0.11, FRICTION = 0.965, MAXV = 3.2;
  p.vx = (p.vx + ax * ACCEL) * FRICTION;
  p.vy = (p.vy + ay * ACCEL) * FRICTION;
  const v = Math.hypot(p.vx, p.vy); if (v > MAXV) { p.vx *= MAXV / v; p.vy *= MAXV / v; }
  p.x += p.vx; p.y += p.vy + Math.cos(timer / 40) * 0.12;
  if (p.x < 60) { p.x = 60; p.vx *= -0.3; } if (p.x > W - 70) { p.x = W - 70; p.vx *= -0.3; }
  if (p.y < 85) { p.y = 85; p.vy *= -0.3; } if (p.y > H - 60) { p.y = H - 60; p.vy *= -0.3; }
  trail.unshift({ x: p.x, y: p.y }); if (trail.length > 400) trail.pop();

  // すくろーる と でてくる もの
  scroll += SCROLL;
  if (state === 'play') {
    dist += SCROLL;
    const active = creatures.filter(c => !c.leaving).length;
    if (active < MAX_CREATURES && --spawnT <= 0) { spawnCreature(); spawnT = 150 + Math.random() * 120; }
    if (dist >= STAGE_LEN) {
      creatures.forEach(c => { if (!c.leaving) { c.leaving = true; popup(c.x, c.y - 80, 'またね〜', '#ffffff', 60, 16); } });
      spawnBig();
    }
  }
  if (state !== 'intro' && --itemT <= 0) { spawnItem(); itemT = 45 + Math.random() * 35; }

  // たべもの（すこし はやめに ながれる）
  for (const it of items) {
    it.age++; it.x -= it.sp; it.y = it.baseY + Math.sin(it.age / 30 + it.ph) * 18;
    if (d2(it, p) < 58 * 58) {
      it.dead = true;
      if (p.inv.length >= INV_MAX) p.inv.shift(); // いっぱい なら いちばん ふるい もの と こうかん
      p.inv.push(it.it); SFX.pick(); sparkle(it.x, it.y, '✨', 3);
    }
  }

  // あいて：がめん の なかで のんびり うかんで まっている
  for (const c of creatures) {
    c.age++;
    if (c.leaving) { c.x += 1.6; c.y -= 0.5; continue; }
    const tx = c.hx + Math.sin(c.age / 110 + c.ph) * 30, ty = c.hy + Math.sin(c.age / 70 + c.ph) * 22;
    c.x = ease(c.x, tx, 0.02); c.y = ease(c.y, ty, 0.04);
    if (c.ask > 0) c.ask--;
    if (!c.said && c.x < W - 40) {
      c.said = true;
      if (!met.met.has(c.t.n)) { met.met.add(c.t.n); popup(c.x, c.y - 85, `${c.t.n} に であった！`, '#ffffff', 90, 18); SFX.hello(); }
    }
    if (c.age > STAY) { c.leaving = true; popup(c.x, c.y - 80, 'またね〜', '#ffffff', 60, 16); }
    // さわったら わたす
    if (d2(c, p) < (c.r + 34) ** 2) {
      const want = FOODS[c.t.fav], k = p.inv.indexOf(want);
      if (k >= 0) {
        p.inv.splice(k, 1); c.dead = true;
        met.met.add(c.t.n); met.friend.add(c.t.n);
        SFX.friend(); sparkle(c.x, c.y, '💗', 8);
        popup(c.x, c.y - 70, `${c.t.n} と なかよしに なった！`, '#ffd0e8', 90, 20);
        addFriend(c.t.e, c.t.n);
        spawnT = Math.min(spawnT, 90);
      } else if (c.ask <= 0) {
        c.ask = 120; SFX.boing();
        popup(c.x, c.y - 85, `${want} が ほしいな`, '#ffffff', 70, 18);
      }
    }
  }

  // おおきな あいて
  if (big) {
    big.age++;
    if (big.leaving) {
      big.x += big.lvx; big.y += big.lvy;
      if (big.x > W + 170 || big.x < -170 || big.y < -170 || big.y > H + 170) { big = null; finishStage(); }
    } else {
      bigT++;
      const tx = big.hx + Math.sin(bigT / 170) * 40, ty = big.hy + Math.sin(bigT / 120) * 80;
      big.x = ease(big.x, tx, 0.015); big.y = ease(big.y, ty, 0.03);
      if (big.ask > 0) big.ask--;
      if (bigT > STAY) { popup(big.x, big.y - 110, 'またね〜！', '#ffffff', 120, 26); big.leaving = true; big.lvx = 1.5; big.lvy = -0.6; }
      if (d2(big, p) < (big.r + 34) ** 2) {
        const want = FOODS[big.t.fav];
        let gave = 0;
        while (big.fed < BIG_NEED && p.inv.includes(want)) { p.inv.splice(p.inv.indexOf(want), 1); big.fed++; gave++; }
        if (gave) {
          SFX.munch(); sparkle(big.x, big.y - 40, '💗', 4 * gave);
          if (big.fed >= BIG_NEED) {
            SFX.friend(); sparkle(big.x, big.y, '💗', 16);
            popup(W / 2, 150, `${big.t.n} と なかよしに なった！`, '#ffd0e8', 150, 30);
            met.bigFriend = true; addFriend(big.t.e, big.t.n, true);
            big.leaving = true; big.lvx = -0.8; big.lvy = -2.2;
          } else popup(big.x, big.y - 120, `おいしい！ あと ${BIG_NEED - big.fed}こ`, '#ffd0e8', 70, 20);
        } else if (!big.ask) {
          big.ask = 120; SFX.boing();
          popup(big.x, big.y - 120, `${want} が ほしいな`, '#ffffff', 70, 20);
        }
      }
    }
  }

  // なかま の ぎょうれつ
  friends.forEach((f, i) => {
    const tp = trail[Math.min(trail.length - 1, (i + 1) * 16)] || player;
    f.x = ease(f.x, tp.x - 30, 0.12); f.y = ease(f.y, tp.y + Math.sin(timer / 30 + i) * 6, 0.12);
  });

  const alive = o => !o.dead && o.x > -200 && o.x < W + 220 && o.y > -200 && o.y < H + 200;
  creatures = creatures.filter(alive); items = items.filter(alive);
  updateParticles();
}

function finishStage() {
  state = 'book'; timer = 0;
  jingle([67, 72, 76, 79, 0, 76, 79, 0, 84], 'triangle', 0.16);
}

function updateParticles() {
  for (const q of particles) { q.x += q.vx; q.y += q.vy; q.vy += q.txt ? -0.02 : 0.08; q.life--; }
  particles = particles.filter(q => q.life > 0);
  for (const q of popups) { q.y -= 0.4; q.life--; }
  popups = popups.filter(q => q.life > 0);
}

// ---------- えがく ----------
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const TEXT_FONT = '"Hiragino Maru Gothic ProN","Rounded Mplus 1c","M PLUS Rounded 1c",sans-serif';
function drawEmoji(e, x, y, size, flip, alpha) {
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
  if (alpha != null) ctx.globalAlpha = alpha;
  ctx.fillStyle = '#000'; // えもじ は fillStyle の とうめいど を うけるので ふとうめい に
  ctx.font = `${size}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(e, 0, 0); ctx.restore();
}
function roundRect(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, stage.sky[0]); g.addColorStop(1, stage.sky[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const s = scroll;
  if (stageIdx === 0) {
    cloudsLayer(s * 0.2, 'rgba(255,255,255,0.85)', 0);
    houses(s * 0.4, ['#ffd6e0', '#fff1b8', '#d4f0ff', '#e0d6ff'], 120, 0.85);
    houses(s * 0.8, ['#ffb3c6', '#ffe08a', '#a8dcff', '#c6b3ff'], 170, 1);
    ctx.fillStyle = '#b8e6a0'; ctx.fillRect(0, H - 26, W, 26);
  } else if (stageIdx === 1) {
    for (let layer = 0; layer < 2; layer++) {
      const off = s * (0.3 + layer * 0.4), col = layer ? '#5bbf5b' : '#8ed98e';
      for (let i = -1; i < 9; i++) {
        const x = i * 150 - (off % 150);
        ctx.fillStyle = '#b08156'; ctx.fillRect(x + 64, H - 200 + layer * 50, 16, 200);
        ctx.fillStyle = col;
        for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(x + 72 + Math.cos(k * 1.25) * 40, H - 210 + layer * 50 + Math.sin(k * 1.25) * 15, 50, 18, k * 1.25, 0, Math.PI * 2); ctx.fill(); }
      }
    }
    for (let i = -1; i < 8; i++) drawEmoji(i % 2 ? '🌺' : '🌼', i * 150 - (s * 0.8 % 150) + 30, H - 20, 26);
  } else if (stageIdx === 2) {
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 7; i++) { const o = i * 160 - (s * 0.1 % 160); ctx.beginPath(); ctx.moveTo(100 + o, 0); ctx.lineTo(160 + o, 0); ctx.lineTo(40 + o, H); ctx.lineTo(o, H); ctx.fill(); }
    for (let i = 0; i < 14; i++) {
      const x = ((i * 97 - s * 0.5) % W + W) % W, y = H - ((timer * 0.6 + i * 61) % H);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 3 + (i % 4), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = '#f5e2b0'; ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 20) ctx.lineTo(x, H - 30 - Math.sin((x + s * 0.8) / 60) * 10);
    ctx.lineTo(W, H); ctx.fill();
    for (let i = -1; i < 7; i++) drawEmoji(i % 2 ? '🪸' : '🐚', i * 180 - (s * 0.8 % 180) + 50, H - 38, 34);
  } else {
    for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.4 * Math.sin(timer / 30 + i)})`; ctx.fillRect(((i * 173 - s * 0.05) % W + W) % W, (i * 37) % (H / 2), 3, 3); }
    drawEmoji('🌈', ((700 - s * 0.05) % 1300 + 1300) % 1300 - 150, 160, 150, false, 0.5);
    cloudsLayer(s * 0.3, 'rgba(255,240,250,0.8)', H - 110);
    cloudsLayer(s * 0.7, 'rgba(255,255,255,0.95)', H - 30);
  }
}
function cloudsLayer(off, col, baseY) {
  ctx.fillStyle = col;
  for (let i = -1; i < 6; i++) {
    const x = i * 220 - (off % 220), y = baseY || (70 + (i * 53 + 400) % 90);
    ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.arc(x + 35, y - 12, 38, 0, Math.PI * 2); ctx.arc(x + 75, y, 30, 0, Math.PI * 2); ctx.fill();
  }
}
function houses(off, cols, maxH, a) {
  ctx.globalAlpha = a;
  for (let i = -1; i < 14; i++) {
    const n = i + Math.floor(off / 100);
    const h = 70 + ((((n * 7919) % maxH) + maxH) % maxH), w = 76, x = i * 100 - (off % 100);
    ctx.fillStyle = cols[((n % 4) + 4) % 4];
    roundRect(x, H - 26 - h, w, h + 10, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (let wy = H - 26 - h + 16; wy < H - 50; wy += 30) for (let wx = x + 14; wx < x + w - 20; wx += 28) { roundRect(wx, wy, 14, 16, 4); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
}

function drawHero(x, y, scale, tiltOk) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale || 1, scale || 1);
  const bob = Math.sin(timer / 14) * 3;
  if (tiltOk && player) ctx.rotate(Math.max(-0.2, Math.min(0.2, player.vy * 0.04)) + (player.surprise > 0 ? Math.sin(player.surprise / 3) * 0.3 : 0));
  if (heroImgOk) {
    const h = 110, w = h * heroImg.width / heroImg.height;
    ctx.drawImage(heroImg, -w / 2, -h / 2 + bob, w, h);
  } else { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, bob, 40, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

// すきなもの の ふきだし
function drawBubble(x, y, food) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath(); ctx.arc(x, y, 19, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 14, y + 20, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 20, y + 30, 3, 0, Math.PI * 2); ctx.fill();
  drawEmoji(food, x, y + 1, 24);
}
function drawFood(it, x, y, size) {
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath(); ctx.arc(x, y, size * 0.72, 0, Math.PI * 2); ctx.fill();
  drawEmoji(it, x, y, size);
}
function textOut(txt, x, y, size, col, align) {
  ctx.font = `bold ${size}px ${TEXT_FONT}`; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.max(3, size / 6); ctx.strokeStyle = 'rgba(90,60,110,0.75)'; ctx.lineJoin = 'round';
  ctx.strokeText(txt, x, y); ctx.fillStyle = col || '#fff'; ctx.fillText(txt, x, y);
}

function drawHUD() {
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, 0, W, 50);
  textOut(stage.name, 14, 25, 20, '#fff', 'left');
  textOut('もちもの', 196, 25, 15, '#fff', 'left');
  const want = wantedFoods().map(k => FOODS[k]);
  for (let i = 0; i < INV_MAX; i++) {
    const x = 290 + i * 46;
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(x, 25, 19, 0, Math.PI * 2); ctx.fill();
    const it = player.inv[i];
    if (it) {
      if (want.includes(it)) { ctx.strokeStyle = '#ff7fb0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, 25, 21, 0, Math.PI * 2); ctx.stroke(); }
      drawEmoji(it, x, 25, 26);
    }
  }
  const total = stage.creatures.length + 1;
  const metN = met.met.size + (met.bigMet ? 1 : 0), frN = met.friend.size + (met.bigFriend ? 1 : 0);
  textOut(`であった ${metN}/${total}　なかよし ${frN}`, W - 14, 25, 16, '#fff', 'right');
  if (state === 'play') {
    const pr = Math.min(1, dist / STAGE_LEN);
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; roundRect(W / 2 - 150, H - 18, 300, 10, 5); ctx.fill();
    ctx.fillStyle = '#ffc6e0'; roundRect(W / 2 - 150, H - 18, Math.max(10, 300 * pr), 10, 5); ctx.fill();
    drawEmoji(stage.big.e, W / 2 + 166, H - 13, 20);
  }
}

function drawTitle() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#ffc6e6'); g.addColorStop(1, '#b8ecff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  scroll += 0.6; cloudsLayer(scroll * 0.5, 'rgba(255,255,255,0.8)', 440); cloudsLayer(scroll * 0.3, 'rgba(255,255,255,0.6)', 120);
  drawHero(W / 2, 200 + Math.sin(timer / 30) * 8, 1.5);
  textOut('ふわふわさんの だいぼうけん', W / 2, 330, 46, '#fff');
  ['やじるしの きー（または がめんを なぞる）で ふわふわ うごくよ',
   'ながれてくる たべものに さわって あつめよう',
   'すきな たべものを もって さわると なかよしに なれるよ',
  ].forEach((l, i) => textOut(l, W / 2, 385 + i * 28, 18, '#fff'));
  if (Math.floor(timer / 40) % 2) textOut('なにか きーを おすか たっぷで はじめる', W / 2, 482, 24, '#fff6a8');
  ['🐶', '🐰', '🐒', '🐨', '🐬', '🐧', '🦄', '🐉'].forEach((e, i) => drawEmoji(e, 90 + i * 112, 52 + Math.sin(timer / 20 + i) * 8, 44));
}

function render() {
  ctx.clearRect(0, 0, W, H);
  if (state === 'title') { drawTitle(); return; }
  if (state === 'book') { drawBook(); return; }
  if (state === 'ending') { drawEnding(); return; }
  drawBackground();
  for (const c of creatures) {
    drawEmoji(c.t.e, c.x, c.y, 80 * (1 + Math.sin(c.age / 15) * 0.04), true);
    if (!c.leaving) {
      const has = player.inv.includes(FOODS[c.t.fav]);
      drawBubble(c.x + 36, c.y - 62, FOODS[c.t.fav]);
      if (has) drawEmoji('💗', c.x + 58, c.y - 82, 18 + Math.sin(timer / 8) * 3);
    }
  }
  if (big) {
    drawEmoji(big.t.e, big.x, big.y, 180 * (1 + Math.sin(big.age / 20) * 0.03), true);
    if (!big.leaving) {
      drawBubble(big.x + 70, big.y - 110, FOODS[big.t.fav]);
      for (let i = 0; i < BIG_NEED; i++) drawEmoji(i < big.fed ? '💗' : '🤍', big.x - 30 + i * 30, big.y + 105, 22);
    }
  }
  for (const it of items) drawFood(it.it, it.x, it.y, 36);
  friends.forEach(f => drawEmoji(f.e, f.x, f.y, f.big ? 60 : 44));
  drawHero(player.x, player.y, 1, true);
  for (const q of particles) {
    if (q.txt) drawEmoji(q.txt, q.x, q.y, q.r, false, Math.min(1, q.life / 30));
    else { ctx.globalAlpha = Math.min(1, q.life / 30); ctx.fillStyle = q.col; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  }
  for (const q of popups) { ctx.globalAlpha = Math.min(1, q.life / 20); textOut(q.txt, Math.max(170, Math.min(W - 170, q.x)), Math.max(80, q.y), q.size, q.col); ctx.globalAlpha = 1; }
  drawHUD();
  if (state === 'intro') {
    textOut(stage.name, W / 2, H / 2 - 20, 56, '#fff');
    textOut('いろんな あいてに であえるかな？', W / 2, H / 2 + 40, 24, '#fff6a8');
  }
}

// ずかん（めんの おわり）
function drawBook() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, stage.sky[0]); g.addColorStop(1, stage.sky[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; roundRect(50, 36, W - 100, H - 72, 28); ctx.fill();
  textOut(`${stage.name} の ずかん`, W / 2, 80, 32, '#fff');
  const list = [...stage.creatures, stage.big];
  list.forEach((c, i) => {
    const col = i % 6, row = Math.floor(i / 6);
    const x = 175 + col * 122, y = 170 + row * 145;
    const isBig = c === stage.big;
    const seen = isBig ? met.bigMet : met.met.has(c.n);
    const fr = isBig ? met.bigFriend : met.friend.has(c.n);
    ctx.fillStyle = fr ? 'rgba(255,200,225,0.9)' : 'rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.arc(x, y, 46, 0, Math.PI * 2); ctx.fill();
    if (seen) drawEmoji(c.e, x, y + Math.sin(timer / 15 + i) * 3, 60);
    else textOut('？', x, y, 40, '#fff');
    textOut(seen ? c.n : '？？？', x, y + 62, 15, '#fff');
    if (fr) drawEmoji('💗', x + 34, y - 34, 22);
  });
  const metN = met.met.size + (met.bigMet ? 1 : 0), frN = met.friend.size + (met.bigFriend ? 1 : 0);
  textOut(`であった こ ${metN}にん　なかよしに なった こ ${frN}にん`, W / 2, H - 96, 22, '#fff6a8');
  if (timer > 60 && Math.floor(timer / 40) % 2) textOut(stageIdx + 1 < STAGES.length ? 'ぼたん で つぎの せかいへ' : 'ぼたん で おしまいへ', W / 2, H - 60, 20, '#fff');
}

function drawEnding() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#ffc6e6'); g.addColorStop(1, '#ffe9a8'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  cloudsLayer(timer * 0.3, 'rgba(255,255,255,0.7)', H - 40);
  if (timer % 12 === 0) particles.push({ x: Math.random() * W, y: H, vx: 0, vy: -1.5, life: 300, txt: ['💗', '⭐', '🌸'][timer / 12 % 3 | 0], r: 24 });
  for (const q of particles) if (q.txt) drawEmoji(q.txt, q.x, q.y, q.r);
  drawHero(W / 2, 170, 1.4);
  const n = friends.length;
  friends.forEach((f, i) => {
    const a = timer / 70 + i / Math.max(1, n) * Math.PI * 2;
    drawEmoji(f.e, W / 2 + Math.cos(a) * 260, 175 + Math.sin(a) * 100, f.big ? 56 : 40);
  });
  textOut('おしまい', W / 2, 330, 52, '#fff');
  const metAll = ALL_MET.reduce((s, m) => s + m.met.size + (m.bigMet ? 1 : 0), 0);
  textOut(`ぜんぶで ${metAll}にん に であって、${n}にん と なかよしに なったよ`, W / 2, 395, 22, '#fff');
  textOut('また いっしょに ふわふわ しようね', W / 2, 435, 22, '#fff6a8');
  if (timer > 120 && Math.floor(timer / 40) % 2) textOut('ぼたん で さいしょへ', W / 2, 485, 18, '#fff');
}

// ---------- るーぷ ----------
let last = 0, acc = 0;
function loop(t) {
  acc += Math.min(100, t - last); last = t;
  while (acc >= 1000 / 60) {
    update();
    for (const k in pressed) delete pressed[k];
    anyKey = false;
    acc -= 1000 / 60;
  }
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(t => { last = t; loop(t); });

// てすと よう
window.__game = {
  get state() { return state; }, get stage() { return stageIdx; },
  get player() { return player && { x: player.x, y: player.y, vx: player.vx, vy: player.vy }; },
  startStage: i => { if (!player) startGame(); startStage(i); },
  toBig: () => { dist = STAGE_LEN; },
  give: arr => { player.inv = arr.slice(0, INV_MAX); },
  moveTo: (x, y) => { player.x = x; player.y = y; },
  get creatures() { return creatures.map(c => ({ x: c.x, y: c.y, fav: FOODS[c.t.fav], n: c.t.n, leaving: c.leaving })); },
  get bigPos() { return big && { x: big.x, y: big.y, fed: big.fed }; },
  get info() { return { inv: player.inv.slice(), friends: friends.length, met: met && met.met.size, creatures: creatures.length, big: !!big, items: items.length }; },
};
