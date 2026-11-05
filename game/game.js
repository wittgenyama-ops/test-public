// ふわふわさんの大冒険 — 横スクロール飛行ゲーム
// 主人公画像: このフォルダに fuwafuwa.png（透過PNG推奨）を置くと、その画像が主人公として使われます。
'use strict';

const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const W = 960, H = 540;

// ---------- 主人公画像（任意） ----------
const heroImg = new Image();
let heroImgOk = false;
heroImg.onload = () => { heroImgOk = true; };
heroImg.src = 'fuwafuwa.png';

// ---------- 食べ物 ----------
const FOODS = {
  meat:   { e: '🍖', n: 'おにく' },
  fish:   { e: '🐟', n: 'おさかな' },
  dango:  { e: '🍡', n: 'おだんご' },
  onigiri:{ e: '🍙', n: 'おにぎり' },
  banana: { e: '🍌', n: 'バナナ' },
  egg:    { e: '🥚', n: 'たまご' },
  shrimp: { e: '🦐', n: 'エビ' },
  cucumber:{ e: '🥒', n: 'きゅうり' },
  donut:  { e: '🍩', n: 'ドーナツ' },
  apple:  { e: '🍎', n: 'りんご' },
  cake:   { e: '🍰', n: 'ケーキ' },
};

// ---------- 面データ ----------
// move: straight / wave / dive / chase / bounce
const STAGES = [
  {
    name: '1面 まち', sky: ['#8fd3ff', '#e6f6ff'], ground: '#7a7a85', len: 5200,
    foods: ['meat', 'fish', 'dango', 'onigiri'],
    enemies: [
      { e: '🐶', n: 'いぬ', fav: 'meat', hp: 1, sp: 2.6, move: 'bounce' },
      { e: '🐱', n: 'ねこ', fav: 'fish', hp: 1, sp: 3.0, move: 'wave' },
      { e: '🐦', n: 'カラス', fav: 'onigiri', hp: 1, sp: 3.6, move: 'dive' },
      { e: '👻', n: 'おばけ', fav: 'dango', hp: 2, sp: 2.0, move: 'chase' },
    ],
    boss: { e: '👹', n: 'オニ', fav: 'dango', hp: 22, need: 4 },
    music: { bpm: 132, wave: 'square', root: 60, scale: [0, 2, 4, 7, 9],
      mel: [0,2,4,2, 5,4,2,0, 1,2,3,2, 4,-1,4,-1], bass: [0,0,5,5,3,3,4,4] },
  },
  {
    name: '2面 ジャングル', sky: ['#5fbf6a', '#cdf2b0'], ground: '#3e6b2f', len: 5800,
    foods: ['banana', 'egg', 'dango', 'meat'],
    enemies: [
      { e: '🐒', n: 'サル', fav: 'banana', hp: 1, sp: 3.2, move: 'bounce' },
      { e: '🐍', n: 'ヘビ', fav: 'egg', hp: 2, sp: 2.4, move: 'wave' },
      { e: '🦜', n: 'オウム', fav: 'banana', hp: 1, sp: 4.0, move: 'dive' },
      { e: '👺', n: 'テング', fav: 'dango', hp: 3, sp: 2.2, move: 'chase' },
      { e: '🐊', n: 'ワニ', fav: 'meat', hp: 3, sp: 2.0, move: 'straight', low: true },
    ],
    boss: { e: '🦍', n: 'ゴリラ大王', fav: 'banana', hp: 28, need: 5 },
    music: { bpm: 112, wave: 'triangle', root: 57, scale: [0, 3, 5, 7, 10],
      mel: [0,-1,2,0, 3,-1,2,1, 0,-1,4,3, 2,1,0,-1], bass: [0,0,3,3,4,4,2,2], drum: true },
  },
  {
    name: '3面 うみ', sky: ['#1e6fb8', '#7fd0f0'], ground: '#e8d39a', len: 6200,
    foods: ['shrimp', 'fish', 'cucumber', 'onigiri'],
    enemies: [
      { e: '🦀', n: 'カニ', fav: 'onigiri', hp: 2, sp: 2.2, move: 'bounce', low: true },
      { e: '🐡', n: 'フグ', fav: 'shrimp', hp: 1, sp: 2.6, move: 'wave' },
      { e: '🦈', n: 'サメ', fav: 'fish', hp: 3, sp: 4.2, move: 'chase' },
      { e: '🪼', n: 'クラゲ', fav: 'shrimp', hp: 1, sp: 1.6, move: 'wave' },
      { e: '🐸', n: 'カッパ', fav: 'cucumber', hp: 2, sp: 2.8, move: 'dive' },
    ],
    boss: { e: '🐙', n: '大ダコ', fav: 'shrimp', hp: 34, need: 6 },
    music: { bpm: 96, wave: 'sine', root: 62, scale: [0, 2, 4, 5, 7, 9, 11],
      mel: [0,2,4,-1, 5,4,2,-1, 4,5,6,7, 6,4,2,-1], bass: [0,0,3,3,5,5,4,4] },
  },
  {
    name: '4面 そら', sky: ['#2b2a6b', '#f7a8c8'], ground: null, len: 6800,
    foods: ['donut', 'apple', 'cake', 'meat'],
    enemies: [
      { e: '🦅', n: 'ワシ', fav: 'meat', hp: 2, sp: 4.4, move: 'dive' },
      { e: '🦇', n: 'コウモリ', fav: 'apple', hp: 1, sp: 3.4, move: 'wave' },
      { e: '🛸', n: 'UFO', fav: 'donut', hp: 3, sp: 3.0, move: 'chase', shoot: true },
      { e: '👾', n: 'うちゅうじん', fav: 'donut', hp: 2, sp: 2.6, move: 'bounce' },
      { e: '⚡', n: 'カミナリさま', fav: 'cake', hp: 3, sp: 2.4, move: 'wave', shoot: true },
    ],
    boss: { e: '🐉', n: 'ドラゴン', fav: 'cake', hp: 42, need: 7 },
    music: { bpm: 148, wave: 'sawtooth', root: 64, scale: [0, 2, 3, 5, 7, 8, 10],
      mel: [0,2,4,5, 4,2,0,-1, 3,4,5,6, 7,-1,6,4], bass: [0,0,5,5,3,3,4,6], drum: true },
  },
];

// ---------- サウンド ----------
let AC = null, master = null, musicGain = null, sfxGain = null;
let musicTimer = null, musicStep = 0, nextNoteTime = 0, curMusic = null;
let muted = false;

function initAudio() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = 0.6; master.connect(AC.destination);
  musicGain = AC.createGain(); musicGain.gain.value = 0.22; musicGain.connect(master);
  sfxGain = AC.createGain(); sfxGain.gain.value = 0.5; sfxGain.connect(master);
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

function tone(freq, t, dur, type, vol, dest, slideTo) {
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
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
  stopMusic();
  if (!AC) return;
  curMusic = m; musicStep = 0; nextNoteTime = AC.currentTime + 0.1;
  musicTimer = setInterval(scheduleMusic, 25);
}
function stopMusic() { if (musicTimer) clearInterval(musicTimer); musicTimer = null; curMusic = null; }
function scheduleMusic() {
  const m = curMusic; if (!m) return;
  const step = 60 / m.bpm / 2; // 8分音符
  while (nextNoteTime < AC.currentTime + 0.12) {
    const t = nextNoteTime, i = musicStep;
    // メロディ（2周ごとに1オクターブ上で変化）
    const phrase = Math.floor(i / m.mel.length) % 4;
    let deg = m.mel[i % m.mel.length];
    if (deg >= 0) {
      if (phrase === 1) deg += 2; else if (phrase === 3) deg += m.scale.length;
      tone(mtof(scaleNote(m, deg)), t, step * 0.9, m.wave, 0.18, musicGain);
    }
    // ベース（4分音符）
    if (i % 2 === 0) {
      const b = m.bass[(i / 2 | 0) % m.bass.length];
      tone(mtof(scaleNote(m, b) - 24), t, step * 1.8, 'triangle', 0.3, musicGain);
    }
    // ドラム
    {
      if (i % 4 === 0) tone(120, t, 0.12, 'sine', 0.5, musicGain, 40);
      if (i % 4 === 2) noise(t, 0.08, m.drum ? 0.25 : 0.12, musicGain, 1500);
      if (m.drum && i % 2 === 1) noise(t, 0.03, 0.08, musicGain, 6000);
    }
    nextNoteTime += step; musicStep++;
  }
}
function jingle(notes, type, step) {
  if (!AC) return;
  stopMusic();
  let t = AC.currentTime + 0.05;
  for (const n of notes) { if (n > 0) tone(mtof(n), t, step * 0.95, type || 'square', 0.2, musicGain); t += step; }
}

const SFX = {
  star()   { if (!AC) return; const t = AC.currentTime; tone(1200, t, 0.12, 'square', 0.12, sfxGain, 2400); },
  throw_() { if (!AC) return; const t = AC.currentTime; tone(500, t, 0.15, 'triangle', 0.25, sfxGain, 900); },
  pick()   { if (!AC) return; const t = AC.currentTime; tone(880, t, 0.08, 'square', 0.15, sfxGain); tone(1320, t + 0.07, 0.1, 'square', 0.15, sfxGain); },
  hit()    { if (!AC) return; const t = AC.currentTime; noise(t, 0.12, 0.4, sfxGain, 800); tone(300, t, 0.1, 'square', 0.12, sfxGain, 120); },
  pop()    { if (!AC) return; const t = AC.currentTime; noise(t, 0.25, 0.4, sfxGain, 400); tone(600, t, 0.25, 'sawtooth', 0.12, sfxGain, 80); },
  munch()  { if (!AC) return; const t = AC.currentTime; for (let k = 0; k < 3; k++) noise(t + k * 0.08, 0.05, 0.3, sfxGain, 2500); },
  friend() { if (!AC) return; const t = AC.currentTime; [72, 76, 79, 84].forEach((n, k) => tone(mtof(n), t + k * 0.08, 0.2, 'sine', 0.3, sfxGain)); },
  hurt()   { if (!AC) return; const t = AC.currentTime; tone(400, t, 0.4, 'sawtooth', 0.25, sfxGain, 90); },
  boss()   { if (!AC) return; const t = AC.currentTime; for (let k = 0; k < 3; k++) tone(110, t + k * 0.25, 0.22, 'sawtooth', 0.3, sfxGain, 70); },
};

// ---------- 入力 ----------
const keys = {};
const pressed = {};
addEventListener('keydown', e => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (!keys[e.code]) pressed[e.code] = true;
  keys[e.code] = true; initAudio();
});
addEventListener('keyup', e => { keys[e.code] = false; });
const tap = code => { pressed[code] = true; initAudio(); };
let touchTarget = null;
function canvasPos(e) {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
}
cv.addEventListener('pointerdown', e => { initAudio(); pressed.Tap = true; touchTarget = canvasPos(e); });
cv.addEventListener('pointermove', e => { if (touchTarget) touchTarget = canvasPos(e); });
addEventListener('pointerup', () => { touchTarget = null; });
document.getElementById('bStar').addEventListener('pointerdown', e => { e.stopPropagation(); tap('KeyZ'); });
document.getElementById('bFood').addEventListener('pointerdown', e => { e.stopPropagation(); tap('KeyX'); });
document.getElementById('bSwap').addEventListener('pointerdown', e => { e.stopPropagation(); tap('KeyC'); });

// ---------- ゲーム状態 ----------
let state = 'title'; // title, intro, play, clear, over, ending
let stageIdx = 0, stage = STAGES[0];
let timer = 0, dist = 0, scroll = 0, spawnT = 0, itemT = 0;
let player, enemies, shots, foodsThrown, items, particles, allies, eShots, boss, popups;
let score = 0, totalFriends = 0, totalDefeated = 0;

function newPlayer() {
  return { x: 160, y: H / 2, vx: 0, vy: 0, hp: 5, maxHp: 5, inv: 0, stars: 15,
    inv_food: {}, sel: 0, cool: 0 };
}

function startGame() {
  score = 0; totalFriends = 0; totalDefeated = 0; allies = [];
  player = newPlayer();
  startStage(0);
}
function startStage(i) {
  stageIdx = i; stage = STAGES[i];
  enemies = []; shots = []; foodsThrown = []; items = []; particles = []; eShots = []; popups = [];
  boss = null; dist = 0; spawnT = 60; itemT = 40; timer = 0;
  player.x = 160; player.y = H / 2; player.inv = 90;
  player.hp = player.maxHp;
  player.stars = Math.max(player.stars, 15);
  player.inv_food = {};
  stage.foods.forEach(f => player.inv_food[f] = 2);
  player.sel = 0;
  state = 'intro';
  jingle([72, 76, 79, 84, 0, 79, 84], 'square', 0.13);
  setTimeout(() => { if (state === 'intro' || state === 'play') playMusic(stage.music); }, 1100);
}

function selFood() { return stage.foods[player.sel]; }

// ---------- 生成 ----------
function spawnEnemy() {
  const pool = stage.enemies;
  // 後半ほど強い敵が出やすい
  const prog = dist / stage.len;
  const idx = Math.min(pool.length - 1, Math.floor(Math.random() * (pool.length * (0.5 + prog * 0.6))));
  const t = pool[idx];
  const y = t.low ? H - 90 - Math.random() * 60 : 60 + Math.random() * (H - 160);
  enemies.push({ t, x: W + 40, y, baseY: y, hp: t.hp, age: 0, vy: 0, r: 26, flash: 0, full: 0 });
}
function spawnItem() {
  const r = Math.random();
  let kind;
  if (r < 0.35) kind = 'star';
  else if (r < 0.45) kind = 'heart';
  else kind = stage.foods[Math.floor(Math.random() * stage.foods.length)];
  items.push({ kind, x: W + 30, y: 70 + Math.random() * (H - 180), age: 0 });
}
function spawnBoss() {
  const b = stage.boss;
  boss = { t: b, x: W + 120, y: H / 2, hp: b.hp, maxHp: b.hp, fed: 0, age: 0, r: 70, flash: 0, atk: 120, enter: true };
  SFX.boss();
  popup(W / 2, H / 2 - 40, `${b.e} ${b.n} があらわれた！`, '#ffdd55', 120, 34);
}

function burst(x, y, col, n, sp) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (sp || 4) * (0.3 + Math.random());
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 30 + Math.random() * 20, col, r: 2 + Math.random() * 4 });
  }
}
function hearts(x, y) {
  for (let i = 0; i < 6; i++) particles.push({ x, y, vx: (Math.random() - 0.5) * 3, vy: -1 - Math.random() * 2, life: 50, txt: '💗', r: 16 });
}
function popup(x, y, txt, col, life, size) { popups.push({ x, y, txt, col: col || '#fff', life: life || 60, max: life || 60, size: size || 20 }); }

function makeAlly(e) {
  if (allies.length >= 5) {
    // 仲間がいっぱいなら、お礼にスターをくれる
    player.stars += 5; popup(e.x, e.y - 30, '⭐+5 おれい！', '#ffee88');
    return;
  }
  allies.push({ e: e.t.e, n: e.t.n, x: e.x, y: e.y, cool: 60 + Math.random() * 60, idx: allies.length });
}

// ---------- 更新 ----------
const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

function update() {
  timer++;
  if (state === 'title') {
    if (pressed.Space || pressed.Enter || pressed.KeyZ || pressed.Tap) { initAudio(); startGame(); }
    return;
  }
  if (state === 'over' || state === 'ending') {
    if (timer > 60 && (pressed.Space || pressed.Enter || pressed.KeyZ || pressed.Tap)) { state = 'title'; timer = 0; }
    updateParticles();
    return;
  }
  if (pressed.KeyM) { muted = !muted; if (master) master.gain.value = muted ? 0 : 0.6; }
  if (state === 'intro') { if (timer > 100) { state = 'play'; } }
  if (state === 'clear') {
    updateParticles();
    if (timer > 200) {
      if (stageIdx + 1 < STAGES.length) startStage(stageIdx + 1);
      else { state = 'ending'; timer = 0; jingle([72, 72, 76, 79, 0, 76, 79, 84, 84, 0, 83, 84, 88], 'square', 0.16); }
    }
    return;
  }

  const p = player;
  const speed = 5.2;
  // 移動
  let ax = 0, ay = 0;
  if (keys.ArrowLeft || keys.KeyA) ax -= 1;
  if (keys.ArrowRight || keys.KeyD) ax += 1;
  if (keys.ArrowUp || keys.KeyW) ay -= 1;
  if (keys.ArrowDown || keys.KeyS) ay += 1;
  if (touchTarget) {
    const dx = touchTarget.x - p.x - 40, dy = touchTarget.y - p.y;
    const d = Math.hypot(dx, dy);
    if (d > 8) { ax = dx / d * Math.min(1, d / 60); ay = dy / d * Math.min(1, d / 60); }
  }
  p.vx += (ax * speed - p.vx) * 0.25;
  p.vy += (ay * speed - p.vy) * 0.25;
  p.x = Math.max(40, Math.min(W - 60, p.x + p.vx));
  p.y = Math.max(40, Math.min(H - 50, p.y + p.vy + Math.sin(timer / 15) * 0.4));
  if (p.inv > 0) p.inv--;
  if (p.cool > 0) p.cool--;

  // 行動
  if (state === 'play') {
    if ((pressed.KeyZ || pressed.Space) && p.cool <= 0) {
      if (p.stars > 0) {
        p.stars--; p.cool = 8;
        shots.push({ x: p.x + 30, y: p.y, vx: 11, vy: 0, rot: 0 });
        SFX.star();
      } else popup(p.x, p.y - 40, 'スターがない！', '#ffaaaa', 40, 16);
    }
    if (keys.KeyZ && p.cool <= 0 && p.stars > 0) { // 長押し連射
      p.stars--; p.cool = 12; shots.push({ x: p.x + 30, y: p.y, vx: 11, vy: 0, rot: 0 }); SFX.star();
    }
    if (pressed.KeyC || pressed.ShiftLeft || pressed.ShiftRight) { p.sel = (p.sel + 1) % stage.foods.length; SFX.pick(); }
    if (pressed.KeyX) {
      const f = selFood();
      if (p.inv_food[f] > 0) {
        p.inv_food[f]--;
        foodsThrown.push({ f, x: p.x + 30, y: p.y, vx: 7, vy: -3, rot: 0 });
        SFX.throw_();
      } else popup(p.x, p.y - 40, `${FOODS[f].e} がない！`, '#ffaaaa', 40, 16);
    }
  }

  // スクロールと出現
  scroll += 3;
  if (state === 'play' && !boss) {
    dist += 3;
    if (--spawnT <= 0) { spawnEnemy(); spawnT = Math.max(28, 75 - stageIdx * 10 - dist / stage.len * 25) + Math.random() * 30; }
    if (dist >= stage.len) spawnBoss();
  }
  if (state === 'play' && --itemT <= 0) { spawnItem(); itemT = 110 + Math.random() * 90; }

  // 弾
  for (const s of shots) { s.x += s.vx; s.y += s.vy; s.rot += 0.3; }
  for (const f of foodsThrown) { f.x += f.vx; f.vy += 0.12; f.y += f.vy; f.rot += 0.15; }

  // 敵
  for (const e of enemies) {
    e.age++;
    const sp = e.t.sp * (1 + stageIdx * 0.08);
    if (e.full > 0) { // 好物じゃないけどおなかいっぱいでゆっくり
      e.full--; e.x -= 1.5; e.y += Math.sin(e.age / 10) * 0.5;
    } else switch (e.t.move) {
      case 'wave': e.x -= sp; e.y = e.baseY + Math.sin(e.age / 22) * 60; break;
      case 'dive':
        e.x -= sp;
        if (e.age > 30 && e.age < 90) e.y += (p.y - e.y) * 0.04;
        break;
      case 'chase': e.x -= sp * 0.8; e.y += Math.sign(p.y - e.y) * Math.min(1.6, Math.abs(p.y - e.y) * 0.03); break;
      case 'bounce':
        e.x -= sp; e.vy += 0.3; e.y += e.vy;
        if (e.y > H - 60) { e.y = H - 60; e.vy = -8 - Math.random() * 3; }
        break;
      default: e.x -= sp;
    }
    if (e.flash > 0) e.flash--;
    if (e.t.shoot && e.age % 110 === 50 && e.x < W - 40) {
      const a = Math.atan2(p.y - e.y, p.x - e.x);
      eShots.push({ x: e.x, y: e.y, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4, txt: e.t.e === '⚡' ? '⚡' : '🔴' });
    }
  }

  // ボス
  if (boss) updateBoss();

  // 敵の弾
  for (const s of eShots) { s.x += s.vx; s.y += s.vy; }

  // 仲間
  allies.forEach((a, i) => {
    const ang = timer / 40 + i * (Math.PI * 2 / allies.length);
    const tx = p.x - 50 - (i % 2) * 30 + Math.cos(ang) * 20;
    const ty = p.y + Math.sin(ang) * 60;
    a.x += (tx - a.x) * 0.1; a.y += (ty - a.y) * 0.1;
    if (state === 'play' && --a.cool <= 0) {
      // 一番近い敵に向かって💗を投げる
      let tgt = null, best = 1e9;
      for (const e of enemies) { const d = dist2(a, e); if (e.x > a.x && d < best) { best = d; tgt = e; } }
      if (!tgt && boss && !boss.enter) tgt = boss;
      if (tgt) {
        const an = Math.atan2(tgt.y - a.y, tgt.x - a.x);
        shots.push({ x: a.x, y: a.y, vx: Math.cos(an) * 8, vy: Math.sin(an) * 8, rot: 0, ally: true });
      }
      a.cool = 110 + Math.random() * 60;
    }
  });

  // アイテム
  for (const it of items) {
    it.age++; it.x -= 2.5; it.y += Math.sin(it.age / 12) * 0.8;
    if (dist2(it, p) < 40 * 40) {
      it.dead = true; SFX.pick();
      if (it.kind === 'star') { p.stars += 6; popup(it.x, it.y - 20, '⭐ +6', '#ffee66'); }
      else if (it.kind === 'heart') { p.hp = Math.min(p.maxHp, p.hp + 1); popup(it.x, it.y - 20, '❤️ +1', '#ff8899'); }
      else { p.inv_food[it.kind] = (p.inv_food[it.kind] || 0) + 2; popup(it.x, it.y - 20, `${FOODS[it.kind].e} +2`, '#fff'); }
    }
  }

  // 当たり判定：スター → 敵
  for (const s of shots) {
    for (const e of enemies) {
      if (!e.dead && dist2(s, e) < (e.r + 10) ** 2) {
        s.dead = true; e.hp -= s.ally ? 1 : 1; e.flash = 8; SFX.hit();
        if (e.hp <= 0) {
          e.dead = true; score += 100; totalDefeated++; SFX.pop(); burst(e.x, e.y, '#ffe066', 18);
          popup(e.x, e.y - 30, `${e.t.n}をやっつけた！`, '#fff', 50, 16);
          if (Math.random() < 0.3) items.push({ kind: 'star', x: e.x, y: e.y, age: 0 });
        }
        break;
      }
    }
    if (!s.dead && boss && !boss.enter && dist2(s, boss) < (boss.r + 10) ** 2) {
      s.dead = true; boss.hp -= 1; boss.flash = 6; SFX.hit(); burst(s.x, s.y, '#fff', 5, 3);
      if (boss.hp <= 0) bossDone(false);
    }
  }
  // 食べ物 → 敵
  for (const f of foodsThrown) {
    for (const e of enemies) {
      if (!e.dead && e.full <= 0 && dist2(f, e) < (e.r + 14) ** 2) {
        f.dead = true;
        if (e.t.fav === f.f) {
          e.dead = true; score += 200; totalFriends++; SFX.friend(); hearts(e.x, e.y);
          popup(e.x, e.y - 30, `${e.t.n}がなかまになった！`, '#ffb3d9', 60, 18);
          makeAlly(e);
        } else {
          e.full = 150; SFX.munch(); popup(e.x, e.y - 30, 'もぐもぐ…（すきじゃないみたい）', '#ddd', 50, 14);
        }
        break;
      }
    }
    if (!f.dead && boss && !boss.enter && dist2(f, boss) < (boss.r + 14) ** 2) {
      f.dead = true;
      if (boss.t.fav === f.f) {
        boss.fed++; SFX.munch(); hearts(boss.x, boss.y - 40);
        popup(boss.x, boss.y - 90, `おいしい！ (${boss.fed}/${boss.t.need})`, '#ffb3d9', 50, 18);
        if (boss.fed >= boss.t.need) bossDone(true);
      } else { SFX.munch(); popup(boss.x, boss.y - 90, 'ふん！ これじゃない！', '#ddd', 50, 16); }
    }
  }
  // 敵/弾 → 主人公
  if (p.inv <= 0 && state === 'play') {
    for (const e of enemies) if (!e.dead && e.full <= 0 && dist2(e, p) < (e.r + 22) ** 2) { damage(); e.dead = true; burst(e.x, e.y, '#fff', 10); break; }
    for (const s of eShots) if (!s.dead && dist2(s, p) < 26 * 26) { s.dead = true; damage(); break; }
    if (boss && !boss.enter && dist2(boss, p) < (boss.r + 20) ** 2) damage();
  }

  // 片付け
  const alive = o => !o.dead && o.x > -80 && o.x < W + 200 && o.y > -100 && o.y < H + 100;
  enemies = enemies.filter(alive); shots = shots.filter(alive); foodsThrown = foodsThrown.filter(alive);
  items = items.filter(alive); eShots = eShots.filter(alive);
  updateParticles();
}

function updateParticles() {
  for (const q of particles) { q.x += q.vx; q.y += q.vy; q.vy += q.txt ? -0.02 : 0.1; q.life--; }
  particles = particles.filter(q => q.life > 0);
  for (const q of popups) { q.y -= 0.5; q.life--; }
  popups = popups.filter(q => q.life > 0);
}

function updateBoss() {
  const b = boss, p = player;
  b.age++;
  if (b.flash > 0) b.flash--;
  if (b.enter) { b.x -= 2; if (b.x <= W - 160) b.enter = false; return; }
  b.y = H / 2 + Math.sin(b.age / 50) * (H / 2 - 110);
  b.x = W - 160 + Math.sin(b.age / 80) * 60;
  if (--b.atk <= 0) {
    const phase = Math.floor(b.age / 240) % 3;
    const n = 5 + stageIdx * 2;
    if (phase === 0) { // 扇状
      for (let i = 0; i < n; i++) {
        const a = Math.PI + (i - (n - 1) / 2) * 0.18;
        eShots.push({ x: b.x - 40, y: b.y, vx: Math.cos(a) * 4.5, vy: Math.sin(a) * 4.5, txt: bossShotEmoji() });
      }
    } else if (phase === 1) { // ねらい撃ち
      for (let i = 0; i < 3; i++) {
        const a = Math.atan2(p.y - b.y, p.x - b.x) + (i - 1) * 0.1;
        eShots.push({ x: b.x - 40, y: b.y, vx: Math.cos(a) * (5 + i), vy: Math.sin(a) * (5 + i), txt: bossShotEmoji() });
      }
    } else { // 子分をよぶ
      spawnEnemy(); spawnEnemy();
    }
    b.atk = Math.max(45, 95 - stageIdx * 12);
  }
}
function bossShotEmoji() { return ['💢', '🥥', '💧', '🔥'][stageIdx]; }

function bossDone(friend) {
  const b = boss;
  boss = null; eShots = []; enemies.forEach(e => { e.dead = true; burst(e.x, e.y, '#fff', 6); });
  if (friend) {
    score += 2000; totalFriends++; hearts(b.x, b.y); hearts(b.x, b.y - 30);
    popup(W / 2, H / 2 - 80, `${b.t.n}がなかまになった！`, '#ffb3d9', 180, 32);
    allies.push({ e: b.t.e, n: b.t.n, x: b.x, y: b.y, cool: 60, idx: allies.length });
    SFX.friend();
  } else {
    score += 1500; totalDefeated++; burst(b.x, b.y, '#ffdd55', 60, 7);
    popup(W / 2, H / 2 - 80, `${b.t.n}をやっつけた！`, '#ffdd55', 180, 32);
    SFX.pop();
  }
  state = 'clear'; timer = 0;
  setTimeout(() => jingle([67, 72, 76, 79, 0, 76, 79, 0, 84], 'square', 0.14), 300);
}

function damage() {
  const p = player;
  p.hp--; p.inv = 90; SFX.hurt(); burst(p.x, p.y, '#ffffff', 16);
  if (p.hp <= 0) {
    state = 'over'; timer = 0;
    stopMusic(); jingle([72, 71, 70, 69, 0, 65, 64, 60], 'triangle', 0.22);
  }
}

// ---------- 描画 ----------
function drawEmoji(e, x, y, size, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(e, 0, 0);
  ctx.restore();
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, stage.sky[0]); g.addColorStop(1, stage.sky[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const s = scroll;
  if (stageIdx === 0) { // 街
    cloudsLayer(s * 0.2, 'rgba(255,255,255,0.8)');
    buildings(s * 0.35, '#b7c3d6', 140, 1);
    buildings(s * 0.7, '#7d8aa3', 200, 2);
    ctx.fillStyle = stage.ground; ctx.fillRect(0, H - 30, W, 30);
    ctx.fillStyle = '#ffffff'; for (let x = -(s % 80); x < W; x += 80) ctx.fillRect(x, H - 17, 40, 4);
  } else if (stageIdx === 1) { // ジャングル
    for (let layer = 0; layer < 2; layer++) {
      const off = s * (0.3 + layer * 0.4), col = layer ? '#2f6b2a' : '#4c9a43';
      for (let i = -1; i < 9; i++) {
        const x = i * 140 - (off % 140);
        ctx.fillStyle = '#6b4a2b'; ctx.fillRect(x + 60, H - 200 + layer * 40, 18, 200);
        ctx.fillStyle = col;
        for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(x + 69 + Math.cos(k * 1.25) * 40, H - 210 + layer * 40 + Math.sin(k * 1.25) * 15, 50, 18, k * 1.25, 0, Math.PI * 2); ctx.fill(); }
      }
    }
    ctx.strokeStyle = '#3a7a2a'; ctx.lineWidth = 4;
    for (let i = -1; i < 7; i++) { const x = i * 170 - (s * 0.9 % 170); ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 30, 80, x + 10, 140); ctx.stroke(); drawEmoji('🍃', x + 10, 145, 22); }
    ctx.fillStyle = stage.ground; ctx.fillRect(0, H - 30, W, 30);
  } else if (stageIdx === 2) { // 海
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(100 + i * 160 - (s * 0.1 % 160), 0); ctx.lineTo(160 + i * 160 - (s * 0.1 % 160), 0); ctx.lineTo(40 + i * 160 - (s * 0.1 % 160), H); ctx.lineTo(0 + i * 160 - (s * 0.1 % 160), H); ctx.fill(); }
    for (let i = 0; i < 14; i++) { // 泡
      const x = (i * 97 - s * 0.5) % W, xx = x < 0 ? x + W : x, y = H - ((timer * 0.8 + i * 61) % H);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(xx, y, 3 + (i % 4), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = stage.ground; ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 20) ctx.lineTo(x, H - 30 - Math.sin((x + s * 0.8) / 60) * 10);
    ctx.lineTo(W, H); ctx.fill();
    for (let i = -1; i < 7; i++) { const x = i * 180 - (s * 0.8 % 180); drawEmoji(i % 2 ? '🪸' : '🌿', x + 50, H - 45, 40); }
  } else { // 空
    for (let i = 0; i < 50; i++) { ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.4 * Math.sin(timer / 20 + i)})`; ctx.fillRect((i * 173 - s * 0.05) % W + (((i * 173 - s * 0.05) % W) < 0 ? W : 0), (i * 37) % (H / 2), 2, 2); }
    cloudsLayer(s * 0.3, 'rgba(255,230,245,0.7)', H - 120);
    cloudsLayer(s * 0.8, 'rgba(255,255,255,0.9)', H - 40);
    drawEmoji('🌙', W - 120 - (s * 0.02 % 200), 80, 50);
  }
}
function cloudsLayer(off, col, baseY) {
  ctx.fillStyle = col;
  for (let i = -1; i < 6; i++) {
    const x = i * 220 - (off % 220), y = baseY || (60 + (i * 53 + 400) % 90);
    ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.arc(x + 35, y - 12, 38, 0, Math.PI * 2); ctx.arc(x + 75, y, 30, 0, Math.PI * 2); ctx.fill();
  }
}
function buildings(off, col, maxH, seed) {
  for (let i = -1; i < 14; i++) {
    const n = i + Math.floor(off / 90);
    const h = 60 + ((n * 7919 * seed) % maxH), w = 70;
    const x = i * 90 - (off % 90);
    ctx.fillStyle = col; ctx.fillRect(x, H - 30 - h, w, h);
    ctx.fillStyle = 'rgba(255,250,200,0.7)';
    for (let wy = H - 30 - h + 12; wy < H - 45; wy += 22) for (let wx = x + 10; wx < x + w - 10; wx += 20) if (((wx + wy + n) | 0) % 3) ctx.fillRect(wx, wy, 9, 11);
  }
}

// 主人公（画像が無いときは「ふわふわさん」を描く）
function drawHero(x, y, scale) {
  scale = scale || 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  const bob = Math.sin(timer / 8) * 2;
  if (heroImgOk) {
    const h = 80, w = h * heroImg.width / heroImg.height;
    ctx.drawImage(heroImg, -w / 2, -h / 2 + bob, w, h);
    ctx.restore(); return;
  }
  // ふわふわの毛
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255,190,230,0.9)'; ctx.shadowBlur = 14;
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2 + timer / 40;
    ctx.beginPath(); ctx.arc(Math.cos(a) * 24, Math.sin(a) * 22 + bob, 14, 0, Math.PI * 2); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0, bob, 28, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  // 小さい羽
  ctx.fillStyle = '#ffe3f3';
  const flap = Math.sin(timer / 4) * 0.5;
  ctx.save(); ctx.translate(-18, -18 + bob); ctx.rotate(-0.8 + flap); ctx.beginPath(); ctx.ellipse(0, -10, 8, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  // 目
  ctx.fillStyle = '#2b2233';
  ctx.beginPath(); ctx.ellipse(6, -4 + bob, 4, 6, 0, 0, Math.PI * 2); ctx.ellipse(20, -4 + bob, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(7.5, -6 + bob, 1.6, 0, Math.PI * 2); ctx.arc(21.5, -6 + bob, 1.6, 0, Math.PI * 2); ctx.fill();
  // ほっぺ
  ctx.fillStyle = 'rgba(255,130,170,0.6)';
  ctx.beginPath(); ctx.ellipse(0, 6 + bob, 5, 3, 0, 0, Math.PI * 2); ctx.ellipse(27, 6 + bob, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
  // 口
  ctx.strokeStyle = '#2b2233'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(13, 5 + bob, 4, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.restore();
}

function drawHUD() {
  const p = player;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, W, 44);
  ctx.font = 'bold 18px sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.fillStyle = '#fff'; ctx.fillText(stage.name, 12, 22);
  for (let i = 0; i < p.maxHp; i++) drawEmoji(i < p.hp ? '❤️' : '🤍', 170 + i * 26, 22, 20);
  drawEmoji('⭐', 320, 22, 20); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText('×' + p.stars, 334, 22);
  // 食べ物
  stage.foods.forEach((f, i) => {
    const x = 410 + i * 66;
    if (i === p.sel) { ctx.strokeStyle = '#ffdd55'; ctx.lineWidth = 3; ctx.strokeRect(x - 18, 5, 62, 34); }
    drawEmoji(FOODS[f].e, x, 22, 22);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.fillText('×' + (p.inv_food[f] || 0), x + 14, 22);
  });
  ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.fillText('SCORE ' + score, W - 12, 22);
  // 進行バー
  if (!boss && state !== 'clear') {
    const pr = Math.min(1, dist / stage.len);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(W / 2 - 150, H - 16, 300, 8);
    ctx.fillStyle = '#ffdd55'; ctx.fillRect(W / 2 - 150, H - 16, 300 * pr, 8);
    drawEmoji(stage.boss.e, W / 2 + 162, H - 12, 18);
  }
  if (boss) {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(W / 2 - 200, 52, 400, 14);
    ctx.fillStyle = '#ff5566'; ctx.fillRect(W / 2 - 200, 52, 400 * Math.max(0, boss.hp / boss.maxHp), 14);
    ctx.fillStyle = '#ffb3d9'; ctx.fillRect(W / 2 - 200, 68, 400 * boss.fed / boss.t.need, 6);
    ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
    ctx.fillText(`${boss.t.n}　すきなもの：${FOODS[boss.t.fav].e}？`, W / 2, 86);
  }
}

function centerText(txt, y, size, col, stroke) {
  ctx.font = `bold ${size}px "Hiragino Maru Gothic ProN",sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 6; ctx.strokeStyle = stroke || 'rgba(60,30,80,0.8)'; ctx.strokeText(txt, W / 2, y);
  ctx.fillStyle = col || '#fff'; ctx.fillText(txt, W / 2, y);
}

function drawTitle() {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#ffb6e1'); g.addColorStop(1, '#a8e6ff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  scroll += 1; cloudsLayer(scroll * 0.5, 'rgba(255,255,255,0.8)', 420); cloudsLayer(scroll * 0.3, 'rgba(255,255,255,0.6)', 100);
  drawHero(W / 2, 200 + Math.sin(timer / 20) * 10, 2);
  centerText('ふわふわさんの大冒険', 330, 52, '#fff');
  ctx.font = '18px sans-serif'; ctx.fillStyle = '#4a2b5a'; ctx.textAlign = 'center';
  const lines = ['矢印キー / WASD：うごく　　Z / スペース：⭐スターでこうげき',
    'X：たべものをあげる（好物なら なかまになる！）　C / Shift：たべものをえらぶ　M：音を消す',
    'スマホ：画面をなぞってうごく ／ 右下のボタンで こうげき・たべもの'];
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 385 + i * 26));
  if (Math.floor(timer / 30) % 2) centerText('スペース または タップで スタート', 480, 26, '#ffef8a');
  ['🐶', '🐒', '🐙', '🐉'].forEach((e, i) => drawEmoji(e, 150 + i * 220, 60 + Math.sin(timer / 15 + i) * 8, 40));
}

function render() {
  ctx.clearRect(0, 0, W, H);
  if (state === 'title') { drawTitle(); return; }
  drawBackground();
  for (const it of items) {
    const e = it.kind === 'star' ? '⭐' : it.kind === 'heart' ? '❤️' : FOODS[it.kind].e;
    ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(it.x, it.y, 22, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    drawEmoji(e, it.x, it.y, 28);
  }
  for (const e of enemies) {
    ctx.save(); if (e.flash > 0) ctx.globalAlpha = 0.5;
    drawEmoji(e.t.e, e.x, e.y, 48, true);
    ctx.restore();
    if (e.full > 0) drawEmoji('💤', e.x + 20, e.y - 30, 18);
  }
  if (boss) {
    ctx.save(); if (boss.flash > 0) ctx.globalAlpha = 0.6;
    const pulse = 1 + Math.sin(boss.age / 10) * 0.04;
    drawEmoji(boss.t.e, boss.x, boss.y, 140 * pulse, true);
    ctx.restore();
  }
  for (const a of allies) drawEmoji(a.e, a.x, a.y, 34);
  for (const s of shots) { ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot); drawEmoji(s.ally ? '💗' : '⭐', 0, 0, s.ally ? 20 : 24); ctx.restore(); }
  for (const f of foodsThrown) { ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot); drawEmoji(FOODS[f.f].e, 0, 0, 28); ctx.restore(); }
  for (const s of eShots) drawEmoji(s.txt, s.x, s.y, 22);
  if (state !== 'over' && (player.inv <= 0 || Math.floor(timer / 4) % 2)) drawHero(player.x, player.y);
  for (const q of particles) {
    if (q.txt) drawEmoji(q.txt, q.x, q.y, q.r);
    else { ctx.globalAlpha = Math.min(1, q.life / 30); ctx.fillStyle = q.col; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  }
  for (const q of popups) {
    ctx.globalAlpha = Math.min(1, q.life / 20);
    ctx.font = `bold ${q.size}px sans-serif`; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.strokeText(q.txt, q.x, q.y); ctx.fillStyle = q.col; ctx.fillText(q.txt, q.x, q.y);
    ctx.globalAlpha = 1;
  }
  drawHUD();
  if (state === 'intro') {
    centerText(stage.name, H / 2 - 20, 56, '#fff');
    centerText(`ボス：${stage.boss.e} ${stage.boss.n}`, H / 2 + 40, 24, '#ffef8a');
  }
  if (state === 'clear') centerText('ステージクリア！', H / 2 + 20, 56, '#ffef8a');
  if (state === 'over') {
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H);
    centerText('ゲームオーバー', H / 2 - 30, 60, '#ffaacc');
    centerText(`SCORE ${score}`, H / 2 + 40, 28);
    if (timer > 60) centerText('スペース / タップで タイトルへ', H / 2 + 100, 22, '#ffef8a');
  }
  if (state === 'ending') drawEnding();
}

function drawEnding() {
  ctx.fillStyle = 'rgba(255,210,240,0.85)'; ctx.fillRect(0, 0, W, H);
  drawHero(W / 2, 170, 1.8);
  allies.forEach((a, i) => drawEmoji(a.e, W / 2 + Math.cos(timer / 40 + i * 1.2) * 170, 170 + Math.sin(timer / 40 + i * 1.2) * 70, 40));
  centerText('ぜんぶクリア！ おめでとう！', 300, 46, '#fff');
  centerText(`なかまにした数：${totalFriends}　やっつけた数：${totalDefeated}`, 360, 24);
  centerText(`SCORE ${score}`, 400, 30, '#ffef8a');
  if (timer > 60) centerText('スペース / タップで タイトルへ', 470, 22);
  if (timer % 10 === 0) particles.push({ x: Math.random() * W, y: H, vx: 0, vy: -2, life: 200, txt: ['💗', '⭐', '🎉'][timer / 10 % 3 | 0], r: 24 });
  for (const q of particles) if (q.txt) drawEmoji(q.txt, q.x, q.y, q.r);
}

// ---------- ループ ----------
let last = 0, acc = 0;
function loop(t) {
  acc += Math.min(100, t - last); last = t;
  while (acc >= 1000 / 60) {
    update();
    for (const k in pressed) delete pressed[k];
    acc -= 1000 / 60;
  }
  render();
  requestAnimationFrame(loop);
}
requestAnimationFrame(t => { last = t; loop(t); });

// テスト用フック
window.__game = { get state() { return state; }, get stage() { return stageIdx; }, startStage: i => { if (!player) startGame(); startStage(i); }, spawnBoss: () => { dist = stage.len; } };
