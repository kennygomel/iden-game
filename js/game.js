// ============================================================
//  АЙДЕН: БИЗНЕС-ИМПЕРИЯ
//  Пиксель-арт бизнес-симулятор + RPG про блогера АЙДЕНа
//  Движок: PointJS
// ============================================================

var pjs = new PointJS(1280, 720, { backgroundColor: '#0a0c14' });
pjs.system.initFullPage();
pjs.system.setTitle('АЙДЕН: Бизнес-Империя');

var game   = pjs.game;
var point  = pjs.vector.point;
var brush  = pjs.brush;
var mouse  = pjs.mouseControl.initControl();
var touch  = pjs.touchControl.initControl();
var key    = pjs.keyControl.initControl();
var OOP    = pjs.OOP;
var random = pjs.math.random;
var audio  = pjs.audio;

// живые размеры окна (initFullPage растягивает канвас)
var WH = game.getWH();
var W = WH.w, H = WH.h;
function syncSize() { WH = game.getWH(); W = WH.w; H = WH.h; }

var FONT = '"Press Start 2P", monospace';
var SAVE_KEY = 'iden_save_v1';

// ---------- Палитра ----------
var C = {
  bg: '#0d0f1a', panel: '#1a1d2e', panel2: '#21263c', border: '#3a3f5c', borderL: '#5a6288',
  text: '#e8e8f0', dim: '#8a8fa8', yellow: '#ffd23f', red: '#ff5252', green: '#6bcf63',
  blue: '#7ab0ea', purple: '#c44ae8', orange: '#ff9a5c'
};

// ---------- Картинки ----------
var IMGS = {};
function regImg(keyName, file) {
  IMGS[keyName] = game.newImageObject({ file: file, x: 0, y: 0, w: 32, h: 32 });
}
regImg('iden', 'resources/iden.png');
regImg('bg', 'resources/bg.png');
regImg('bank_t', 'resources/bank_t.png');
regImg('bank_alpha', 'resources/bank_alpha.png');
for (var bi = 0; bi < BIZ_TYPES.length; bi++) regImg(BIZ_TYPES[bi].id, BIZ_TYPES[bi].icon);

function drawImg(keyName, x, y, w, h, alpha) {
  var im = IMGS[keyName];
  if (!im) return;
  im.x = x; im.y = y; im.w = w; im.h = h;
  im.alpha = (alpha === undefined ? 1 : alpha);
  im.draw();
}

// ---------- Настройки (музыка / звуки) ----------
var SETTINGS_KEY = 'iden_settings_v1';
var SETTINGS = { music: true, sfx: true };
try {
  var savedSt = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  if (savedSt) {
    if (savedSt.music !== undefined) SETTINGS.music = !!savedSt.music;
    if (savedSt.sfx !== undefined) SETTINGS.sfx = !!savedSt.sfx;
  }
} catch (e) {}
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); } catch (e) {} }

// ---------- Звуки ----------
var sndClick, sndCash, sndFail, sndLevel, sndEvent;
try {
  sndClick = audio.newAudio('resources/click.wav', 0.4);
  sndCash  = audio.newAudio('resources/cash.wav', 0.5);
  sndFail  = audio.newAudio('resources/fail.wav', 0.5);
  sndLevel = audio.newAudio('resources/levelup.wav', 0.5);
  sndEvent = audio.newAudio('resources/event.wav', 0.5);
} catch (e) {}
function sfx(s) { if (!SETTINGS.sfx) return; try { if (s) s.replay(); } catch (e) {} }

// ---------- Фоновая музыка (8-битный lo-fi луп) ----------
var bgm = null, musicOn = false;
try {
  bgm = new Audio('resources/music_loop.wav');
  bgm.loop = true;
  bgm.volume = 0.32;
  bgm.preload = 'auto';
} catch (e) {}
function musicPlay() {
  if (!bgm || !SETTINGS.music) return;
  try {
    var pr = bgm.play();
    if (pr && pr.catch) pr.catch(function () {});
    musicOn = true;
  } catch (e) {}
}
function musicPause() {
  if (!bgm) return;
  try { bgm.pause(); } catch (e) {}
  musicOn = false;
}
function musicSync() { if (SETTINGS.music) { if (!musicOn) musicPlay(); } else musicPause(); }
function toggleMusic() { SETTINGS.music = !SETTINGS.music; saveSettings(); musicSync(); sfx(sndClick); }
function toggleSfx() { SETTINGS.sfx = !SETTINGS.sfx; saveSettings(); if (SETTINGS.sfx) sfx(sndClick); }
// не играть музыку в скрытой вкладке
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') { if (musicOn) musicPause(); }
  else if (SETTINGS.music) musicSync();
});
// Chrome блокирует автозапуск звука — стартуем музыку с первого клика/тапа
document.addEventListener('mousedown', function () { musicSync(); }, true);
document.addEventListener('touchstart', function () { musicSync(); }, true);

// ============================================================
//  СОСТОЯНИЕ
// ============================================================
var S = null;

function defaultState() {
  return {
    money: 500000, subs: 5000, day: 1,
    level: 1, xp: 0, skillPts: 0,
    skills: { talk: 0, market: 0, save: 0, charisma: 0 },
    energy: 3, energyMax: 3,
    businesses: [], loans: [], log: [],
    stats: { opened: 0, failed: 0, videos: 0, maxMoney: 500000 },
    lastFailDay: -99, lastViral: -99, videoCd: 0, todayAd: 0,
    modal: null, speed: 1, frame: 0, lock: false,
    toasts: [], achieves: {}, over: null, catScroll: 0
  };
}

function saveGame() {
  if (!S || S.over) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      money: S.money, subs: S.subs, day: S.day, level: S.level, xp: S.xp,
      skillPts: S.skillPts, skills: S.skills, energy: S.energy, energyMax: S.energyMax,
      businesses: S.businesses, loans: S.loans, log: S.log.slice(0, 40),
      stats: S.stats, lastFailDay: S.lastFailDay, lastViral: S.lastViral,
      videoCd: S.videoCd, achieves: S.achieves
    }));
  } catch (e) {}
}

function loadGame() {
  try {
    var d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!d) return false;
    S = defaultState();
    for (var k in d) S[k] = d[k];
    S.modal = null; S.speed = 1; S.frame = 0; S.lock = false;
    S.toasts = []; S.over = null; S.catScroll = 0;
    return true;
  } catch (e) { return false; }
}

function hasSave() {
  try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
}

// ============================================================
//  ХЕЛПЕРЫ
// ============================================================
function fmtNum(n) {
  n = Math.floor(Math.abs(n));
  var s = '' + n, out = '';
  while (s.length > 3) { out = ' ' + s.slice(-3) + out; s = s.slice(0, -3); }
  return s + out;
}
function fmtMoney(n) {
  return (n < 0 ? '-' : '') + fmtNum(n) + ' P';
}
function tw(text, size) { return OOP.getTextWidth({ text: text, size: size, font: FONT }); }
function txt(text, x, y, size, color, align, alpha) {
  if (align === 'c') x -= tw(text, size) / 2;
  else if (align === 'r') x -= tw(text, size);
  brush.drawTextS({ text: text, x: Math.round(x), y: Math.round(y), size: size, color: color, font: FONT, alpha: alpha === undefined ? 1 : alpha });
}
function panel(x, y, w, h, fill, stroke) {
  brush.drawRectS({ x: x, y: y, w: w, h: h, fillColor: stroke || C.border });
  brush.drawRectS({ x: x + 3, y: y + 3, w: w - 6, h: h - 6, fillColor: fill || C.panel });
}
// перенос текста по словам
function wrapText(str, maxW, size) {
  var words = ('' + str).split(' '), lines = [], line = '';
  for (var i = 0; i < words.length; i++) {
    var test = line ? line + ' ' + words[i] : words[i];
    if (tw(test, size) > maxW && line) { lines.push(line); line = words[i]; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}
// курсор + клик (мышь или тач)
var touchClicked = false, touchPos = null;
function pollTouch() {
  touchClicked = false; touchPos = null;
  try {
    if (touch.isDown() || touch.isUp()) touchPos = touch.getPosition();
    if (touch.isUp()) touchClicked = true;
  } catch (e) {}
}
function cursorPos() {
  if (touchPos) return touchPos;
  return mouse.getPosition();
}
function isClicked() {
  return mouse.isPress('LEFT') || touchClicked;
}
var hoverAny = false;
// пиксель-кнопка: рисует себя и возвращает true при клике
function btn(x, y, w, h, label, opt) {
  opt = opt || {};
  var m = cursorPos();
  var dis = !!opt.disabled;
  var size = opt.size || 10;
  var hover = !dis && !S.lock && m.x >= x && m.x < x + w && m.y >= y && m.y < y + h;
  if (hover) hoverAny = true;
  var bg = dis ? '#222536' : (hover ? (opt.hover || '#4a558a') : (opt.bg || '#2b3252'));
  var bd = dis ? '#333850' : (opt.border || C.borderL);
  panel(x, y, w, h, bg, bd);
  var tx = x + (opt.icon ? 46 : 0);
  var lx = opt.align === 'c' ? x + w / 2 : tx + 10;
  txt(label, lx, y + Math.floor(h / 2 - size / 2), size, dis ? '#555a70' : (opt.color || C.text), opt.align === 'c' ? 'c' : null);
  if (opt.icon) drawImg(opt.icon, x + 7, y + Math.floor(h / 2 - 16), 32, 32);
  if (hover && isClicked()) { sfx(sndClick); musicSync(); return true; }
  return false;
}
function toast(text, color) {
  S.toasts.push({ text: text, t: 160, color: color || C.yellow });
  if (S.toasts.length > 3) S.toasts.shift();
}
function addLog(text, color) {
  S.log.unshift({ d: S.day, t: text, c: color || C.dim });
  if (S.log.length > 60) S.log.length = 60;
}
function xpNeed() { return 60 * S.level; }
function addXp(n) {
  S.xp += n;
  while (S.xp >= xpNeed()) {
    S.xp -= xpNeed(); S.level++; S.skillPts++;
    S.energyMax = 3 + Math.floor(S.level / 5);
    toast('УРОВЕНЬ ' + S.level + '! +1 очко навыка', C.green);
    sfx(sndLevel);
  }
}
function charismaMul() { return 1 + 0.12 * S.skills.charisma; }
function bankById(id) { for (var i = 0; i < BANKS.length; i++) if (BANKS[i].id === id) return BANKS[i]; return null; }
function loanOf(id) { for (var i = 0; i < S.loans.length; i++) if (S.loans[i].bank === id) return S.loans[i]; return null; }
function totalDebt() { var d = 0; for (var i = 0; i < S.loans.length; i++) d += S.loans[i].debt; return Math.floor(d); }
function bizType(id) { for (var i = 0; i < BIZ_TYPES.length; i++) if (BIZ_TYPES[i].id === id) return BIZ_TYPES[i]; return null; }
// в моменте можно держать только один бизнес каждого вида
function isTypeOpen(typeId) {
  for (var i = 0; i < S.businesses.length; i++) if (S.businesses[i].type === typeId) return true;
  return false;
}

// ============================================================
//  ИГРОВАЯ ЛОГИКА
// ============================================================
function dayTick() {
  S.day++;
  S.energy = S.energyMax;

  // --- бизнесы: выручка и расходы ---
  for (var i = 0; i < S.businesses.length; i++) {
    var biz = S.businesses[i];
    var expense = biz.expense * biz.expenseMul * (1 - 0.06 * S.skills.save);
    var income = 0;
    if (biz.frozen > 0) {
      biz.frozen--;
      if (biz.frozen === 0 && biz.warn === 'ЗАМОРОЖЕН') biz.warn = '';
    } else {
      income = random(Math.floor(biz.incMin), Math.floor(biz.incMax)) * biz.incomeMul * (1 + 0.08 * S.skills.market);
      if (biz.debuff > 0) { income *= 0.75; biz.debuff--; if (biz.debuff === 0 && biz.warn === 'НЕГАТИВ') biz.warn = ''; }
    }
    var profit = Math.round(income - expense);
    S.money += profit; biz.today = profit; biz.total += profit;
  }

  // --- блог: доход с рекламы ---
  var ad = Math.floor(S.subs * 0.012 * (1 + 0.08 * S.skills.charisma));
  S.money += ad; S.todayAd = ad;

  // --- кредиты: ежедневные проценты ---
  for (var li = 0; li < S.loans.length; li++) {
    var b = bankById(S.loans[li].bank);
    S.loans[li].debt = Math.ceil(S.loans[li].debt * (1 + b.rate));
  }

  if (S.videoCd > 0) S.videoCd--;

  // --- случайные события ---
  rollEvents();

  addXp(1);
  if (S.money > S.stats.maxMoney) S.stats.maxMoney = S.money;
  checkAchieves();

  // --- банкротство ---
  if (S.money < -150000) { gameOver(); return; }

  saveGame();
}

function rollEvents() {
  if (S.modal) return;
  // события по бизнесам (не более одного в день)
  for (var i = 0; i < S.businesses.length; i++) {
    var biz = S.businesses[i];
    if (biz.frozen > 0) continue;
    if (Math.random() < biz.risk * 0.11) { fireEvent(biz); return; }
  }
  // редкое глобальное хорошее
  if (Math.random() < 0.018) fireEvent(null);
}

function fireEvent(biz) {
  var pool = [], total = 0;
  for (var i = 0; i < EVENTS.length; i++) {
    var e = EVENTS[i];
    if (!biz && e.cond !== null) continue;           // глобальные — только с cond null
    if (biz && e.cond && !e.cond(biz)) continue;
    pool.push(e); total += e.w;
  }
  if (!pool.length) return;
  var roll = Math.random() * total, pick = pool[0];
  for (var j = 0; j < pool.length; j++) { roll -= pool[j].w; if (roll <= 0) { pick = pool[j]; break; } }
  S.modal = { kind: 'event', ev: pick, biz: biz };
  S.prevSpeed = S.speed || 1;
  S.speed = 0;
  sfx(sndEvent);
}

function applyEventChoice(ev, ch, biz) {
  var res = ch.go(S, biz);
  S.modal = null;
  S.speed = S.prevSpeed || 1;
  if (res && typeof res === 'object' && res.fatal) {
    killBusiness(biz, res.refund, res.why);
  } else if (typeof res === 'string') {
    addLog(res, ev.kind === 'good' ? C.green : C.orange);
    if (ev.kind === 'good') sfx(sndCash);
  }
}

function killBusiness(biz, refundPct, why) {
  var refund = Math.floor(biz.cost * refundPct);
  S.money += refund;
  for (var i = 0; i < S.businesses.length; i++) if (S.businesses[i] === biz) { S.businesses.splice(i, 1); break; }
  S.stats.failed++;
  S.lastFailDay = S.day;
  var gain = Math.floor(S.subs * (0.15 + Math.random() * 0.2) * charismaMul()) + Math.floor(biz.cost / 2000);
  S.subs += gain;
  addXp(40);
  addLog('ПРОВАЛ: «' + biz.name + '» свёрнут. ' + (why || ''), C.red);
  addLog('Серия про провал залетела: +' + fmtNum(gain) + ' подписчиков' + (refund > 0 ? ', возврат ' + fmtMoney(refund) : ''), C.yellow);
  toast('БИЗНЕС ПРОВАЛИЛСЯ! Зато контент...', C.red);
  sfx(sndFail);
}

function openBiz(type) {
  var cost = Math.floor(type.cost * (1 - 0.05 * S.skills.talk));
  if (isTypeOpen(type.id)) { toast('«' + type.name + '» уже открыт!', C.orange); return; }
  if (S.money < cost || S.energy < 1 || S.businesses.length >= maxBizSlots()) return;
  S.money -= cost; S.energy--;
  S.businesses.push({
    type: type.id, name: type.name, icon: type.icon, cost: cost,
    incMin: type.incMin, incMax: type.incMax, expense: type.expense, risk: type.risk,
    incomeMul: 1, expenseMul: 1, dayOpen: S.day, today: 0, total: 0, frozen: 0, debuff: 0, warn: ''
  });
  S.stats.opened++;
  addXp(15);
  addLog('ОТКРЫТ: «' + type.name + '» за ' + fmtMoney(cost), C.blue);
  toast('БИЗНЕС ОТКРЫТ: ' + type.name, C.green);
  sfx(sndCash);
  checkAchieves();
}

function closeBizManual(biz) {
  var refund = Math.floor(biz.cost * 0.3);
  S.money += refund;
  for (var i = 0; i < S.businesses.length; i++) if (S.businesses[i] === biz) { S.businesses.splice(i, 1); break; }
  addLog('ЗАКРЫТ (добровольно): «' + biz.name + '», возврат ' + fmtMoney(refund), C.dim);
  S.modal = null;
}

function investBiz(biz) {
  var sum = Math.floor(biz.cost * 0.5);
  if (S.money < sum) return;
  S.money -= sum;
  biz.incomeMul += 0.15; biz.expenseMul += 0.05; biz.cost += sum;
  addLog('РАЗВИТИЕ: «' + biz.name + '» вложено ' + fmtMoney(sum) + ', выручка +15%', C.green);
  sfx(sndCash);
}

function makeVideo() {
  if (S.energy < 1 || S.videoCd > 0) return;
  S.energy--; S.videoCd = 2;
  var recentFail = (S.day - S.lastFailDay) <= 3;
  var mul = (0.06 + Math.random() * 0.07) * charismaMul() * (recentFail ? 2.5 : 1);
  var gain = Math.floor(S.subs * mul) + random(300, 900);
  S.subs += gain; S.stats.videos++;
  addXp(5);
  addLog('Новый ролик: +' + fmtNum(gain) + ' подписчиков' + (recentFail ? ' (провал залетел x2.5!)' : ''), C.green);
  sfx(sndCash);
  checkAchieves();
}

function loanMax(bank) { return bank.maxBase * S.level; }
function takeLoan(bank, amount) {
  var loan = loanOf(bank.id);
  var cur = loan ? loan.debt : 0;
  amount = Math.min(amount, loanMax(bank) - cur);
  if (amount <= 0) return;
  if (!loan) { loan = { bank: bank.id, debt: 0 }; S.loans.push(loan); }
  loan.debt += amount; S.money += amount;
  addLog(bank.name + ': кредит +' + fmtMoney(amount) + ' под ' + (bank.rate * 100).toFixed(2) + '%/день', C.yellow);
  sfx(sndCash);
}
function repayLoan(bank, amount) {
  var loan = loanOf(bank.id);
  if (!loan) return;
  amount = Math.min(amount, loan.debt, Math.max(0, S.money));
  if (amount <= 0) return;
  loan.debt -= amount; S.money -= amount;
  if (loan.debt <= 0) {
    S.loans.splice(S.loans.indexOf(loan), 1);
    addLog(bank.name + ': кредит полностью погашен!', C.green);
    addXp(10);
  } else {
    addLog(bank.name + ': платёж ' + fmtMoney(amount) + ', остаток ' + fmtMoney(loan.debt), C.dim);
  }
  sfx(sndCash);
}

function checkAchieves() {
  for (var i = 0; i < ACHIEVES.length; i++) {
    var a = ACHIEVES[i];
    if (!S.achieves[a.id] && a.check(S)) {
      S.achieves[a.id] = true;
      toast(a.text, C.yellow);
      sfx(sndLevel);
    }
  }
}

function gameOver() {
  S.over = {
    days: S.day, opened: S.stats.opened, failed: S.stats.failed,
    maxMoney: S.stats.maxMoney, subs: S.subs, videos: S.stats.videos
  };
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  sfx(sndFail);
  game.setLoop('over');
}

function newGame() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  S = defaultState();
  addLog('Добрый ден! Это АЙДЕН. Старт: 500 000 P и 5 000 подписчиков.', C.yellow);
  addLog('Открывай бизнесы, снимай ролики, не разорись.', C.dim);
  game.setLoop('game');
}

// ============================================================
//  ОТРИСОВКА ИГРОВОГО ЭКРАНА
// ============================================================
function drawTopBar() {
  brush.drawRectS({ x: 0, y: 0, w: W, h: 56, fillColor: '#12141f' });
  brush.drawRectS({ x: 0, y: 56, w: W, h: 3, fillColor: C.border });
  txt('ДЕНЬ ' + S.day, 16, 14, 12, C.text);
  txt(fmtMoney(S.money), 140, 14, 12, S.money < 0 ? C.red : C.yellow);
  txt(fmtNum(S.subs) + ' подп.', 330, 14, 12, C.blue);
  var debt = totalDebt();
  if (debt > 0) txt('ДОЛГ: ' + fmtMoney(debt), W - 202, 14, 11, C.red, 'r');
  // скорость
  var labels = ['II', '>', '>>', '>>>'];
  for (var i = 0; i < 4; i++) {
    if (btn(W - 190 + i * 46, 12, 42, 32, labels[i], { align: 'c', size: 10, bg: S.speed === i ? '#4a558a' : '#23263a' })) {
      S.speed = i;
    }
  }
}

function drawLeftPanel() {
  panel(8, 66, 240, H - 74);
  drawImg('iden', 24, 78, 96, 96);
  txt('ДЕНИС', 132, 84, 12, C.text);
  txt('«АЙДЕН»', 132, 102, 12, C.yellow);
  txt('УР. ' + S.level, 132, 126, 10, C.green);
  // XP бар
  brush.drawRectS({ x: 24, y: 182, w: 208, h: 12, fillColor: '#12141f' });
  brush.drawRectS({ x: 26, y: 184, w: Math.floor(204 * S.xp / xpNeed()), h: 8, fillColor: C.green });
  txt('XP ' + S.xp + '/' + xpNeed(), 128, 200, 8, C.dim, 'c');
  // энергия
  txt('ЭНЕРГИЯ', 24, 222, 8, C.dim);
  for (var i = 0; i < S.energyMax; i++) {
    brush.drawRectS({ x: 24 + i * 22, y: 236, w: 18, h: 18, fillColor: i < S.energy ? C.yellow : '#2b2f45' });
  }
  // кнопки действий
  var by = 270;
  if (btn(20, by, 216, 44, 'ОТКРЫТЬ БИЗНЕС', { size: 9, disabled: S.businesses.length >= maxBizSlots() })) S.modal = { kind: 'catalog' };
  by += 52;
  var vlabel = S.videoCd > 0 ? 'ВИДЕО (КД ' + S.videoCd + ')' : 'СНЯТЬ ВИДЕО';
  if (btn(20, by, 216, 44, vlabel, { size: 9, disabled: S.energy < 1 || S.videoCd > 0 })) makeVideo();
  by += 52;
  if (btn(20, by, 216, 44, 'БАНКИ', { size: 9 })) S.modal = { kind: 'bank' };
  by += 52;
  if (btn(20, by, 216, 44, 'НАВЫКИ' + (S.skillPts > 0 ? ' +' + S.skillPts : ''), { size: 9, border: S.skillPts > 0 ? C.green : C.borderL })) S.modal = { kind: 'skills' };
  by += 52;
  if (btn(20, by, 216, 36, 'В МЕНЮ', { size: 8, bg: '#23263a' })) { saveGame(); game.setLoop('menu'); }
  // статистика
  txt('Блог: +' + fmtMoney(S.todayAd) + '/день', 24, by + 54, 8, C.yellow);
  txt('Открыто бизнесов: ' + S.stats.opened, 24, by + 70, 8, C.dim);
  txt('Провалов: ' + S.stats.failed, 24, by + 86, 8, C.dim);
  txt('Роликов: ' + S.stats.videos, 24, by + 102, 8, C.dim);
  txt('Макс. денег: ' + fmtMoney(S.stats.maxMoney), 24, by + 118, 8, C.dim);
  // переключатели музыки и звуков (внизу панели)
  var sy = H - 50;
  if (btn(20, sy, 104, 32, 'МУЗ ' + (SETTINGS.music ? 'ВКЛ' : 'ВЫКЛ'), { size: 7, align: 'c', bg: SETTINGS.music ? '#2c4a2e' : '#23263a', border: SETTINGS.music ? C.green : C.border })) toggleMusic();
  if (btn(132, sy, 104, 32, 'ЗВУК ' + (SETTINGS.sfx ? 'ВКЛ' : 'ВЫКЛ'), { size: 7, align: 'c', bg: SETTINGS.sfx ? '#2c4a2e' : '#23263a', border: SETTINGS.sfx ? C.green : C.border })) toggleSfx();
}

// метрики сетки бизнесов (адаптив)
function gridMetrics() {
  var gx0 = 266;
  var gw = Math.max(200, W - 246 - gx0 - 8);
  var cols = Math.max(1, Math.min(3, Math.floor((gw + 12) / 200)));
  var cw = Math.floor((gw - (cols - 1) * 12) / cols);
  var ch = 200, gy = 14;
  var rows = Math.max(1, Math.floor((H - 100) / (ch + gy)));
  return { x: gx0, gw: gw, cols: cols, cw: cw, ch: ch, rows: rows };
}
function maxBizSlots() {
  var m = gridMetrics();
  return Math.min(9, m.cols * m.rows);
}

function drawBizGrid() {
  var g = gridMetrics();
  txt('МОИ БИЗНЕСЫ (' + S.businesses.length + '/' + maxBizSlots() + ')', g.x, 70, 10, C.dim);
  var gridCX = g.x + g.gw / 2;
  if (S.businesses.length === 0) {
    txt('Бизнесов нет.', gridCX, 300, 12, C.dim, 'c');
    txt('Жми «ОТКРЫТЬ БИЗНЕС» — начни с тюльпанов!', gridCX, 330, 9, C.dim, 'c');
    return;
  }
  for (var i = 0; i < S.businesses.length && i < g.cols * g.rows; i++) {
    (function (i) {
      var biz = S.businesses[i];
      var cw = g.cw, ch = g.ch;
      var col = i % g.cols, row = Math.floor(i / g.cols);
      var x = g.x + col * (cw + 12), y = 92 + row * (ch + 14);
      var m = cursorPos();
      var hover = !S.lock && m.x >= x && m.x < x + cw && m.y >= y && m.y < y + ch;
      panel(x, y, cw, ch, hover ? C.panel2 : C.panel, biz.warn ? C.orange : C.border);
      drawImg(biz.type, x + 12, y + 12, 44, 44);
      var nameLines = wrapText(biz.name, cw - 68, 8);
      for (var li = 0; li < nameLines.length && li < 3; li++) txt(nameLines[li], x + 64, y + 12 + li * 12, 8, C.text);
      txt('День ' + biz.dayOpen, x + 64, y + 50, 8, C.dim);
      // финансы дня
      var tc = biz.today >= 0 ? C.green : C.red;
      txt((biz.today >= 0 ? '+' : '') + fmtMoney(biz.today) + '/день', x + 12, y + 70, 9, tc);
      txt('Итого: ' + (biz.total >= 0 ? '+' : '') + fmtMoney(biz.total), x + 12, y + 90, 8, biz.total >= 0 ? C.green : C.red);
      // риск
      var riskStars = Math.ceil(biz.risk * 5);
      var stars = '';
      for (var s = 0; s < 5; s++) stars += s < riskStars ? '*' : '.';
      txt('РИСК ' + stars, x + 12, y + 110, 8, C.orange);
      if (biz.warn) txt('! ' + biz.warn, x + 12, y + 128, 8, C.orange);
      if (biz.frozen > 0) txt('СТОИТ: ' + biz.frozen + ' дн.', x + 12, y + 128, 8, C.red);
      if (btn(x + 12, y + 148, cw - 24, 28, 'УПРАВЛЯТЬ', { size: 8, align: 'c' })) {
        S.modal = { kind: 'biz', biz: biz };
      }
    })(i);
  }
}

function drawLogPanel() {
  var lx = W - 246;
  panel(lx, 66, 238, H - 74);
  txt('ЛЕНТА СОБЫТИЙ', lx + 119, 78, 9, C.dim, 'c');
  brush.drawRectS({ x: lx + 10, y: 96, w: 218, h: 2, fillColor: C.border });
  var y = 106;
  for (var i = 0; i < S.log.length; i++) {
    var e = S.log[i];
    var lines = wrapText('Д' + e.d + ' ' + e.t, 214, 8);
    for (var li = 0; li < lines.length; li++) {
      if (y + 14 > H - 16) return;
      txt(lines[li], lx + 10, y, 8, li === 0 ? e.c : C.dim);
      y += 13;
    }
    y += 5;
  }
}

function drawToasts() {
  for (var i = 0; i < S.toasts.length; i++) {
    var t = S.toasts[i];
    t.t--;
    if (t.t <= 0) { S.toasts.splice(i, 1); i--; continue; }
    var a = Math.min(1, t.t / 60);
    var w = tw(t.text, 9) + 24;
    var x = W / 2 - w / 2, y = H - 60 - i * 40;
    brush.drawRectS({ x: x, y: y, w: w, h: 30, fillColor: '#12141f', alpha: 0.9 * a });
    brush.drawRectS({ x: x, y: y, w: w, h: 3, fillColor: t.color, alpha: a });
    txt(t.text, 640, y + 10, 9, t.color, 'c', a);
  }
}

// ---------- Модальные окна ----------
function drawModalBase(w, h, title) {
  brush.drawRectS({ x: 0, y: 0, w: W, h: H, fillColor: '#05060c', alpha: 0.8 });
  var x = (W - w) / 2, y = (H - h) / 2;
  panel(x, y, w, h, C.panel, C.borderL);
  txt(title, W / 2, y + 16, 12, C.yellow, 'c');
  brush.drawRectS({ x: x + 16, y: y + 40, w: w - 32, h: 2, fillColor: C.border });
  return { x: x, y: y, w: w, h: h };
}
function modalCloseBtn(m) {
  return btn(m.x + m.w - 40, m.y + 10, 28, 26, 'X', { align: 'c', size: 10, bg: '#5c2430', border: C.red });
}

function drawModalCatalog() {
  var m = drawModalBase(Math.min(920, W - 40), Math.min(580, H - 40), 'ОТКРЫТЬ БИЗНЕС');
  if (modalCloseBtn(m)) { S.modal = null; return; }
  txt('Деньги: ' + fmtMoney(S.money) + '   Энергия: ' + S.energy, m.x + 24, m.y + 52, 9, C.dim);
  var areaY = m.y + 76, areaH = m.h - 100;
  var rowH = 96, visible = Math.floor(areaH / rowH);
  // скролл колёсиком
  var mm = cursorPos();
  if (mm.x > m.x && mm.x < m.x + m.w && mm.y > areaY && mm.y < areaY + areaH) {
    if (mouse.isWheel('DOWN')) S.catScroll = Math.min(BIZ_TYPES.length - visible, S.catScroll + 1);
    if (mouse.isWheel('UP')) S.catScroll = Math.max(0, S.catScroll - 1);
  }
  S.catScroll = Math.max(0, Math.min(S.catScroll, Math.max(0, BIZ_TYPES.length - visible)));
  for (var i = 0; i < visible; i++) {
    var idx = i + S.catScroll;
    if (idx >= BIZ_TYPES.length) break;
    (function (idx, y) {
      var t = BIZ_TYPES[idx];
      var cost = Math.floor(t.cost * (1 - 0.05 * S.skills.talk));
      var already = isTypeOpen(t.id);
      var can = S.money >= cost && S.energy >= 1 && S.businesses.length < maxBizSlots() && !already;
      panel(m.x + 20, y, m.w - 40, rowH - 8, C.panel2, C.border);
      drawImg(t.id, m.x + 30, y + 12, 48, 48);
      txt(t.name, m.x + 90, y + 10, 9, C.text);
      var dl = wrapText(t.desc, 380, 8);
      for (var li = 0; li < dl.length && li < 2; li++) txt(dl[li], m.x + 90, y + 28 + li * 12, 8, C.dim);
      txt('Цена: ' + fmtMoney(cost), m.x + 90, y + 56, 8, C.yellow);
      var incStr = (t.incMin < 0 ? '-' + fmtNum(t.incMin) : fmtNum(t.incMin)) + '..' + fmtNum(t.incMax);
      txt('Выручка: ' + incStr + '/день', m.x + 90, y + 72, 8, C.green);
      txt('Расходы: ' + fmtNum(t.expense) + '/день', m.x + 330, y + 56, 8, C.red);
      var riskStars = Math.ceil(t.risk * 5), stars = '';
      for (var s = 0; s < 5; s++) stars += s < riskStars ? '*' : '.';
      txt('Риск: ' + stars, m.x + 330, y + 72, 8, C.orange);
      if (btn(m.x + m.w - 170, y + 26, 140, 40, already ? 'УЖЕ ОТКРЫТ' : 'ОТКРЫТЬ', { size: already ? 8 : 9, align: 'c', disabled: !can })) {
        openBiz(t);
      }
    })(idx, areaY + 8 + i * rowH);
  }
  txt('стр. ' + (S.catScroll + 1) + '/' + Math.max(1, BIZ_TYPES.length - visible + 1) + ' (колёсико)', m.x + m.w / 2, m.y + m.h - 22, 8, C.dim, 'c');
}

function drawModalBiz() {
  var biz = S.modal.biz;
  var m = drawModalBase(Math.min(560, W - 40), Math.min(420, H - 40), biz.name.toUpperCase());
  if (modalCloseBtn(m)) { S.modal = null; return; }
  drawImg(biz.type, m.x + 24, m.y + 56, 64, 64);
  var x0 = m.x + 104;
  txt('Открыт: день ' + biz.dayOpen + ' (' + (S.day - biz.dayOpen) + ' дн. в работе)', x0, m.y + 58, 8, C.dim);
  txt('Сегодня: ' + (biz.today >= 0 ? '+' : '') + fmtMoney(biz.today), x0, m.y + 78, 9, biz.today >= 0 ? C.green : C.red);
  txt('За всё время: ' + (biz.total >= 0 ? '+' : '') + fmtMoney(biz.total), x0, m.y + 96, 9, biz.total >= 0 ? C.green : C.red);
  txt('Модиф. выручки: x' + biz.incomeMul.toFixed(2), x0, m.y + 114, 8, C.text);
  txt('Модиф. расходов: x' + biz.expenseMul.toFixed(2), x0, m.y + 130, 8, C.text);
  if (biz.warn) txt('! ' + biz.warn, x0, m.y + 148, 8, C.orange);
  if (biz.frozen > 0) txt('Заморожен: ' + biz.frozen + ' дн.', x0, m.y + 148, 8, C.red);
  var inv = Math.floor(biz.cost * 0.5);
  if (btn(m.x + 24, m.y + 180, m.w - 48, 44, 'ВЛОЖИТЬСЯ В РАЗВИТИЕ (' + fmtMoney(inv) + ')', { size: 9, align: 'c', disabled: S.money < inv })) investBiz(biz);
  txt('+15% к выручке, +5% к расходам', m.x + m.w / 2, m.y + 232, 8, C.dim, 'c');
  if (btn(m.x + 24, m.y + 258, m.w - 48, 44, 'ЗАКРЫТЬ БИЗНЕС (возврат 30%)', { size: 9, align: 'c', bg: '#5c2430', border: C.red, hover: '#8a3040' })) closeBizManual(biz);
  txt('Иногда свернуть самому — дешевле, чем ждать кидалово.', m.x + m.w / 2, m.y + 310, 8, C.dim, 'c');
}

function drawModalBank() {
  var m = drawModalBase(Math.min(760, W - 40), Math.min(460, H - 40), 'КРЕДИТЫ');
  if (modalCloseBtn(m)) { S.modal = null; return; }
  txt('Деньги: ' + fmtMoney(S.money) + '   Общий долг: ' + fmtMoney(totalDebt()), m.x + 24, m.y + 52, 9, C.dim);
  for (var i = 0; i < BANKS.length; i++) {
    (function (i) {
      var bank = BANKS[i];
      var y = m.y + 80 + i * 180;
      panel(m.x + 20, y, m.w - 40, 164, C.panel2, bank.color);
      drawImg(bank.id === 't' ? 'bank_t' : 'bank_alpha', m.x + 32, y + 16, 48, 48);
      txt(bank.name, m.x + 94, y + 18, 12, bank.color);
      var dl = wrapText(bank.desc, 330, 8);
      for (var li = 0; li < dl.length; li++) txt(dl[li], m.x + 94, y + 40 + li * 12, 8, C.dim);
      var loan = loanOf(bank.id);
      var debt = loan ? loan.debt : 0;
      txt('Ставка: ' + (bank.rate * 100).toFixed(2) + '% в день', m.x + 94, y + 68, 8, C.orange);
      txt('Лимит: ' + fmtMoney(loanMax(bank)), m.x + 94, y + 84, 8, C.text);
      txt('Долг: ' + fmtMoney(Math.floor(debt)), m.x + 94, y + 100, 9, debt > 0 ? C.red : C.green);
      var lockedLvl = S.level < bank.minLevel;
      if (lockedLvl) txt('НУЖЕН ' + bank.minLevel + ' УРОВЕНЬ', m.x + 94, y + 120, 9, C.red);
      var canTake = !lockedLvl && debt < loanMax(bank);
      var canRepay = debt > 0 && S.money > 0;
      if (btn(m.x + m.w - 320, y + 16, 140, 36, 'ВЗЯТЬ 100К', { size: 8, align: 'c', disabled: !canTake })) takeLoan(bank, 100000);
      if (btn(m.x + m.w - 170, y + 16, 140, 36, 'ВЗЯТЬ МАКС', { size: 8, align: 'c', disabled: !canTake })) takeLoan(bank, loanMax(bank) - debt);
      if (btn(m.x + m.w - 320, y + 60, 140, 36, 'ПОГАСИТЬ 100К', { size: 8, align: 'c', disabled: !canRepay, bg: '#2c4a2e', border: C.green })) repayLoan(bank, 100000);
      if (btn(m.x + m.w - 170, y + 60, 140, 36, 'ПОГАСИТЬ ВСЁ', { size: 8, align: 'c', disabled: !canRepay, bg: '#2c4a2e', border: C.green })) repayLoan(bank, debt);
      txt('Проценты капают на долг каждый день. Не тяни.', m.x + m.w - 245, y + 104, 8, C.dim, 'c');
    })(i);
  }
}

function drawModalSkills() {
  var m = drawModalBase(Math.min(640, W - 40), Math.min(420, H - 40), 'НАВЫКИ АЙДЕНА');
  if (modalCloseBtn(m)) { S.modal = null; return; }
  txt('Очки навыков: ' + S.skillPts + ' (даются за уровень)', m.x + 24, m.y + 52, 9, S.skillPts > 0 ? C.green : C.dim);
  for (var i = 0; i < SKILLS.length; i++) {
    (function (i) {
      var sk = SKILLS[i];
      var y = m.y + 80 + i * 80;
      panel(m.x + 20, y, m.w - 40, 68, C.panel2, C.border);
      txt(sk.name, m.x + 32, y + 12, 10, C.yellow);
      txt(sk.desc, m.x + 32, y + 32, 8, C.dim);
      var lvl = S.skills[sk.id];
      var pips = '';
      for (var p = 0; p < sk.max; p++) pips += p < lvl ? '#' : '.';
      txt(pips + ' ' + lvl + '/' + sk.max, m.x + 32, y + 48, 9, C.green);
      if (btn(m.x + m.w - 90, y + 18, 60, 36, '+', { size: 14, align: 'c', disabled: S.skillPts < 1 || lvl >= sk.max })) {
        S.skillPts--; S.skills[sk.id]++;
        sfx(sndLevel);
      }
    })(i);
  }
}

function drawModalEvent() {
  var ev = S.modal.ev, biz = S.modal.biz;
  var m = drawModalBase(Math.min(680, W - 40), Math.min(400, H - 40), ev.title);
  var iconKey = biz ? biz.type : 'iden';
  drawImg(iconKey, W / 2 - 32, m.y + 52, 64, 64);
  if (biz) txt('«' + biz.name + '»', W / 2, m.y + 124, 9, C.blue, 'c');
  var lines = wrapText(ev.text, m.w - 80, 9);
  var ty = m.y + 146;
  for (var i = 0; i < lines.length; i++) { txt(lines[i], W / 2, ty, 9, C.text, 'c'); ty += 15; }
  // кнопки выбора
  var bw = m.w - 120;
  var by = m.y + m.h - 40 - ev.choices.length * 66;
  for (var ci = 0; ci < ev.choices.length; ci++) {
    (function (ci) {
      var ch = ev.choices[ci];
      var y = by + ci * 66;
      var bad = ev.kind !== 'good';
      if (btn(W / 2 - bw / 2, y, bw, 44, ch.t, { size: 10, align: 'c', bg: bad ? '#4a2430' : '#2c4a2e', border: bad ? C.red : C.green, hover: bad ? '#6a3040' : '#3c6a3e' })) {
        applyEventChoice(ev, ch, biz);
        return;
      }
      txt(ch.d, W / 2, y + 48, 8, C.dim, 'c');
    })(ci);
    if (!S.modal) break; // выбор применён, модалка закрылась
  }
}

function drawModalHelp() {
  var m = drawModalBase(Math.min(760, W - 40), Math.min(520, H - 40), 'КАК ИГРАТЬ');
  if (modalCloseBtn(m)) { S.modal = null; return; }
  var lines = [
    'Ты — Денис «АЙДЕН» Меренков, блогер и серийный',
    'предприниматель. У тебя 500 000 P и мечта.',
    '',
    '* Открывай бизнесы: от тюльпанов до кофеен.',
    '* Каждый день бизнесы дают выручку и жрут расходы.',
    '* События решат твою судьбу: арендодатели, партнёры,',
    '  франшизодатели и проверки. Провал неизбежен!',
    '* НО: провалы = контент. Ролики про факапы дают',
    '  x2.5 подписчиков. Блог кормит тебя рекламой.',
    '* Кредиты Т-Банка и Альфа-Банка спасут... или утопят.',
    '* Качай уровни и навыки: переговоры, маркетинг,',
    '  экономия, харизма.',
    '',
    'ПРОИГРЫШ: долговая яма глубже -150 000 P.',
    'ЦЕЛЬ: сколько продержишься, бизнесмен?',
    '',
    'Управление: мышь. Пробел — пауза. Esc — закрыть окно.'
  ];
  var y = m.y + 56;
  for (var i = 0; i < lines.length; i++) { txt(lines[i], m.x + 30, y, 8, i < 2 ? C.yellow : C.text); y += 16; }
}

function drawModal() {
  if (!S.modal) return;
  S.lock = false;
  var kind = S.modal.kind;
  if (kind === 'catalog') drawModalCatalog();
  else if (kind === 'biz') drawModalBiz();
  else if (kind === 'bank') drawModalBank();
  else if (kind === 'skills') drawModalSkills();
  else if (kind === 'event') drawModalEvent();
  else if (kind === 'help') drawModalHelp();
}

// ============================================================
//  ЦИКЛЫ
// ============================================================
game.newLoop('load', function () {
  syncSize();
  brush.drawTextS({ text: 'ЗАГРУЗКА ' + pjs.resources.getProgress() + '%', x: W / 2 - 100, y: H / 2, size: 16, color: '#e8e8f0', font: FONT });
  if (pjs.resources.getProgress() >= 100) game.setLoop('menu');
});

game.newLoop('menu', function () {
  syncSize(); pollTouch();
  hoverAny = false;
  drawImg('bg', 0, 0, W, H);
  brush.drawRectS({ x: 0, y: 0, w: W, h: H, fillColor: '#0a0c14', alpha: 0.55 });
  var oy = Math.max(-50, Math.min(120, (H - 720) / 2));
  // логотип
  txt('АЙДЕН', W / 2, 90 + oy, 64, C.yellow, 'c');
  txt('БИЗНЕС-ИМПЕРИЯ', W / 2, 170 + oy, 24, C.text, 'c');
  txt('каждый бизнес — провальный. но какой контент!', W / 2, 210 + oy, 9, C.dim, 'c');
  drawImg('iden', W / 2 - 64, 240 + oy, 128, 128);
  // кнопки
  var bw = 360, bx = W / 2 - bw / 2;
  if (btn(bx, 400 + oy, bw, 52, 'НОВАЯ ИГРА', { size: 14, align: 'c' })) { newGame(); }
  if (hasSave()) {
    if (btn(bx, 464 + oy, bw, 52, 'ПРОДОЛЖИТЬ', { size: 14, align: 'c', bg: '#2c4a2e', border: C.green })) {
      if (loadGame()) game.setLoop('game');
    }
  }
  if (btn(bx, 528 + oy, bw, 44, 'КАК ИГРАТЬ', { size: 11, align: 'c', bg: '#23263a' })) {
    S = S || defaultState();
    S.modal = { kind: 'help' };
    game.setLoop('gameHelp');
  }
  // переключатели музыки и звуков
  var ty = Math.max(H - 106, 528 + oy + 56);
  if (btn(W / 2 - 190, ty, 180, 36, 'МУЗЫКА: ' + (SETTINGS.music ? 'ВКЛ' : 'ВЫКЛ'), { size: 8, align: 'c', bg: SETTINGS.music ? '#2c4a2e' : '#23263a', border: SETTINGS.music ? C.green : C.border })) toggleMusic();
  if (btn(W / 2 + 10, ty, 180, 36, 'ЗВУКИ: ' + (SETTINGS.sfx ? 'ВКЛ' : 'ВЫКЛ'), { size: 8, align: 'c', bg: SETTINGS.sfx ? '#2c4a2e' : '#23263a', border: SETTINGS.sfx ? C.green : C.border })) toggleSfx();
  var fy = Math.max(H - 56, ty + 46);
  txt('фанатская игра про блогера АЙДЕНа. все совпадения случайны :)', W / 2, fy, 8, C.dim, 'c');
  txt('сделано на PointJS', W / 2, fy + 24, 8, C.dim, 'c');
  mouse.setStandardCursor(hoverAny ? 'pointer' : 'default');
});

game.newLoop('gameHelp', function () {
  syncSize(); pollTouch();
  hoverAny = false;
  S = S || defaultState();
  S.lock = true;
  if (key.isPress('ESC')) S.modal = null;
  drawModal();
  if (!S.modal) { game.setLoop('menu'); return; }
  mouse.setStandardCursor(hoverAny ? 'pointer' : 'default');
});

game.newLoop('game', function () {
  syncSize(); pollTouch();
  hoverAny = false;
  // фон
  drawImg('bg', 0, 0, W, H, 0.2);
  brush.drawRectS({ x: 0, y: 0, w: W, h: H, fillColor: C.bg, alpha: 0.75 });

  // тик времени
  var modalOpen = !!S.modal;
  if (S.speed > 0 && !modalOpen) {
    S.frame++;
    var framesPerDay = Math.floor(160 / (S.speed === 1 ? 1 : S.speed === 2 ? 2.5 : 5));
    if (S.frame >= framesPerDay) { S.frame = 0; dayTick(); }
  }

  // горячие клавиши
  if (key.isPress('SPACE')) S.speed = S.speed === 0 ? 1 : 0;
  if (key.isPress('ESC') && S.modal && S.modal.kind !== 'event') S.modal = null;

  // фон блокируем от кликов, если есть модалка
  S.lock = modalOpen;
  drawTopBar();
  drawLeftPanel();
  drawBizGrid();
  drawLogPanel();
  // тосты под модалкой (чтобы не мешали), модалка поверх
  S.lock = true;
  drawToasts();
  S.lock = false;
  if (S.modal) drawModal();
  mouse.setStandardCursor(hoverAny ? 'pointer' : 'default');
});

game.newLoop('over', function () {
  syncSize(); pollTouch();
  hoverAny = false;
  brush.drawRectS({ x: 0, y: 0, w: W, h: H, fillColor: '#1c0d12' });
  drawImg('bg', 0, 0, W, H, 0.15);
  txt('БАНКРОТ!', W / 2, 110, 48, C.red, 'c');
  txt('АЙДЕН обанкротился. Опять.', W / 2, 190, 14, C.text, 'c');
  txt('Зато подписчики довольны — контент был огонь.', W / 2, 224, 9, C.dim, 'c');
  var o = S.over;
  panel(W / 2 - 260, 260, 520, 220, C.panel, C.border);
  txt('Дней продержался:  ' + o.days, W / 2 - 220, 290, 10, C.text);
  txt('Бизнесов открыто:  ' + o.opened, W / 2 - 220, 320, 10, C.text);
  txt('Провалов пережито: ' + o.failed, W / 2 - 220, 350, 10, C.red);
  txt('Роликов снято:     ' + o.videos, W / 2 - 220, 380, 10, C.text);
  txt('Подписчиков:       ' + fmtNum(o.subs), W / 2 - 220, 410, 10, C.blue);
  txt('Максимум денег:    ' + fmtMoney(o.maxMoney), W / 2 - 220, 440, 10, C.yellow);
  if (btn(W / 2 - 180, 520, 360, 52, 'НАЧАТЬ ЗАНОВО', { size: 13, align: 'c' })) newGame();
  mouse.setStandardCursor(hoverAny ? 'pointer' : 'default');
});

// старт
S = defaultState();
game.setLoop('load');
game.start();
