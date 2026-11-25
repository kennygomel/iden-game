// ============================================================
//  IDEN GAME - Pixel art assets generator (Node.js, no deps)
//  Generates PNG sprites + WAV sounds into ../resources/
// ============================================================
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.join(__dirname, '..', 'resources');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// ---------------- PNG encoder ----------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(img) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.w, 0); ihdr.writeUInt32BE(img.h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit RGBA
  const raw = Buffer.alloc(img.h * (1 + img.w * 4));
  for (let y = 0; y < img.h; y++) {
    raw[y * (1 + img.w * 4)] = 0; // filter: none
    img.px.copy(raw, y * (1 + img.w * 4) + 1, y * img.w * 4, (y + 1) * img.w * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ---------------- tiny pixel canvas ----------------
function mk(w, h) { return { w, h, px: Buffer.alloc(w * h * 4, 0) }; }
function col(hex, a) {
  if (a === undefined) a = 255;
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), a];
}
function set(im, x, y, c, a) {
  x |= 0; y |= 0;
  if (x < 0 || y < 0 || x >= im.w || y >= im.h) return;
  const [r, g, b, al] = col(c, a);
  const i = (y * im.w + x) * 4;
  im.px[i] = r; im.px[i + 1] = g; im.px[i + 2] = b; im.px[i + 3] = al;
}
function rect(im, x, y, w, h, c, a) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(im, x + i, y + j, c, a); }
function save(im, name) {
  fs.writeFileSync(path.join(OUT, name), encodePNG(im));
  console.log('  +', name, im.w + 'x' + im.h);
}

// ============================================================
//  ICONS 32x32
// ============================================================

// --- Кофейня «Миренкофе»: стакан с паром ---
(function () {
  const im = mk(32, 32);
  // пар
  const steam = '#cfd6e4';
  [[13, 6], [14, 4], [13, 2], [19, 7], [20, 5], [19, 3], [16, 5], [16, 1]].forEach(p => set(im, p[0], p[1], steam, 200));
  // крышка
  rect(im, 9, 8, 14, 3, '#4a4f66'); rect(im, 11, 7, 10, 1, '#4a4f66');
  rect(im, 9, 8, 14, 1, '#6a708c');
  // стакан (трапеция)
  const rows = [[9, 14], [9, 14], [10, 13], [10, 13], [10, 13], [10, 13], [11, 12], [11, 12], [11, 12], [11, 12], [11, 12], [12, 10], [12, 10], [12, 10], [12, 10], [12, 10], [12, 10]];
  rows.forEach((r, i) => rect(im, r[0], 11 + i, r[1], 1, '#f2e8d8'));
  // контур стакана
  for (let i = 0; i < rows.length; i++) { set(im, rows[i][0], 11 + i, '#b8a98f'); set(im, rows[i][0] + rows[i][1] - 1, 11 + i, '#b8a98f'); }
  rect(im, 12, 27, 10, 1, '#b8a98f');
  // рукав-держатель
  rect(im, 9, 16, 15, 6, '#a5693f'); rect(im, 9, 16, 15, 1, '#c98a54'); rect(im, 9, 21, 15, 1, '#7c4a28');
  // лого-зерно
  set(im, 15, 18, '#f2e8d8'); set(im, 16, 18, '#f2e8d8'); set(im, 15, 19, '#f2e8d8'); set(im, 16, 19, '#f2e8d8'); set(im, 15, 18, '#5c3a1e');
  save(im, 'biz_coffee.png');
})();

// --- Перекуп айфонов: смартфон с ценником ---
(function () {
  const im = mk(32, 32);
  // телефон
  rect(im, 10, 4, 13, 25, '#23283d');
  rect(im, 10, 4, 13, 1, '#4a5578'); rect(im, 10, 28, 13, 1, '#141828');
  rect(im, 11, 6, 11, 20, '#5a8fd6'); // экран
  rect(im, 11, 6, 11, 4, '#7ab0ea');
  rect(im, 11, 22, 11, 4, '#3a5f96');
  // блик
  set(im, 12, 7, '#cfe6ff'); set(im, 13, 7, '#cfe6ff');
  // динамик и кнопка
  rect(im, 15, 5, 3, 1, '#141828'); set(im, 16, 27, '#141828'); set(im, 15, 27, '#141828'); set(im, 17, 27, '#141828');
  // ценник
  rect(im, 21, 10, 9, 7, '#6bcf63'); rect(im, 21, 10, 9, 1, '#93e58a');
  set(im, 22, 11, '#2c5c28');
  rect(im, 23, 12, 5, 1, '#1e4018'); rect(im, 23, 14, 4, 1, '#1e4018');
  // верёвочка
  set(im, 21, 9, '#d8d2c0'); set(im, 20, 8, '#d8d2c0'); set(im, 19, 8, '#d8d2c0');
  save(im, 'biz_iphone.png');
})();

// --- ПВЗ Ozon: синяя коробка ---
(function () {
  const im = mk(32, 32);
  rect(im, 6, 12, 20, 15, '#2f6fd6');            // коробка
  rect(im, 6, 12, 20, 2, '#4a8af0');             // верх
  rect(im, 6, 25, 20, 2, '#1e4f9e');             // низ
  // клапаны
  rect(im, 6, 9, 9, 3, '#4a8af0'); rect(im, 17, 9, 9, 3, '#4a8af0');
  set(im, 15, 9, '#1e4f9e'); set(im, 16, 9, '#1e4f9e');
  // скотч
  rect(im, 15, 12, 2, 15, '#9cc0f5');
  // этикетка
  rect(im, 19, 16, 6, 5, '#f2f2f2'); rect(im, 20, 17, 4, 1, '#9a9a9a'); rect(im, 20, 19, 3, 1, '#9a9a9a');
  // стеллаж
  rect(im, 3, 27, 26, 2, '#3a3f5c');
  save(im, 'biz_ozon.png');
})();

// --- ПВЗ Wildberries: фиолетовая коробка ---
(function () {
  const im = mk(32, 32);
  rect(im, 6, 12, 20, 15, '#a031c8');
  rect(im, 6, 12, 20, 2, '#c44ae8');
  rect(im, 6, 25, 20, 2, '#73209a');
  rect(im, 6, 9, 9, 3, '#c44ae8'); rect(im, 17, 9, 9, 3, '#c44ae8');
  set(im, 15, 9, '#73209a'); set(im, 16, 9, '#73209a');
  rect(im, 15, 12, 2, 15, '#e0a8f5');
  rect(im, 19, 16, 6, 5, '#f2f2f2'); rect(im, 20, 17, 4, 1, '#9a9a9a'); rect(im, 20, 19, 3, 1, '#9a9a9a');
  rect(im, 3, 27, 26, 2, '#3a3f5c');
  save(im, 'biz_wb.png');
})();

// --- Сборка ПК: корпус с RGB ---
(function () {
  const im = mk(32, 32);
  rect(im, 9, 4, 15, 25, '#262b40');            // корпус
  rect(im, 9, 4, 15, 1, '#4a5578'); rect(im, 9, 28, 15, 1, '#141828');
  rect(im, 22, 4, 2, 25, '#1a1e30');            // боковая грань
  // три вентилятора-крестовины
  const fan = (cx, cy, c) => {
    set(im, cx, cy, c); set(im, cx - 2, cy, c); set(im, cx + 2, cy, c);
    set(im, cx, cy - 2, c); set(im, cx, cy + 2, c);
    set(im, cx - 1, cy - 1, c); set(im, cx + 1, cy - 1, c); set(im, cx - 1, cy + 1, c); set(im, cx + 1, cy + 1, c);
    set(im, cx, cy, '#e8ecff');
  };
  fan(15, 9, '#ff5c5c'); fan(15, 16, '#6bcf63'); fan(15, 23, '#5c9cff');
  // ножки
  rect(im, 10, 29, 3, 2, '#141828'); rect(im, 20, 29, 3, 2, '#141828');
  save(im, 'biz_pc.png');
})();

// --- Сервисный центр: гаечный ключ + отвёртка ---
(function () {
  const im = mk(32, 32);
  // гаечный ключ (диагональ \)
  for (let i = 0; i < 15; i++) { set(im, 6 + i, 13 + i, '#b8c0d4'); set(im, 7 + i, 13 + i, '#8a94ac'); }
  // рожок
  rect(im, 4, 10, 5, 2, '#b8c0d4'); rect(im, 4, 12, 2, 3, '#b8c0d4'); rect(im, 7, 12, 2, 2, '#b8c0d4');
  // отвёртка (диагональ /)
  for (let i = 0; i < 9; i++) { set(im, 24 - i, 8 + i, '#d4dcea'); set(im, 25 - i, 8 + i, '#aab4c8'); }
  rect(im, 21, 18, 6, 5, '#d64545'); // ручка
  rect(im, 21, 18, 6, 1, '#f07070'); rect(im, 21, 22, 6, 1, '#9e2c2c');
  set(im, 25, 7, '#e8ecf4'); set(im, 26, 7, '#e8ecf4'); // жалo
  save(im, 'biz_repair.png');
})();

// --- Студия подкастов: микрофон ---
(function () {
  const im = mk(32, 32);
  // капсула
  rect(im, 12, 4, 9, 13, '#c8d0e0'); rect(im, 13, 3, 7, 1, '#c8d0e0'); rect(im, 13, 17, 7, 1, '#aab4c8');
  rect(im, 12, 4, 9, 2, '#e8ecf4');
  // сетка
  for (let y = 7; y <= 14; y += 2) rect(im, 12, y, 9, 1, '#7c86a0');
  // красный индикатор ON AIR
  set(im, 19, 5, '#ff4040'); set(im, 20, 5, '#ff8080');
  // дуга крепления
  for (let i = 0; i <= 9; i++) { set(im, 10 - (i < 5 ? 0 : 0), 9 + i, '#5c6680'); set(im, 22, 9 + i, '#5c6680'); }
  rect(im, 10, 18, 13, 2, '#5c6680');
  // стойка и база
  rect(im, 15, 20, 3, 7, '#8a94ac');
  rect(im, 10, 27, 13, 2, '#5c6680'); rect(im, 12, 25, 9, 2, '#8a94ac');
  save(im, 'biz_podcast.png');
})();

// --- Водомат ---
(function () {
  const im = mk(32, 32);
  rect(im, 8, 3, 17, 26, '#3a6a9e');            // корпус
  rect(im, 8, 3, 17, 2, '#5a8ac2'); rect(im, 8, 27, 17, 2, '#26486e');
  // бутыль внутри
  rect(im, 11, 7, 8, 12, '#7ec8f0'); rect(im, 13, 5, 4, 2, '#7ec8f0');
  rect(im, 11, 7, 8, 3, '#a8e0fa');
  set(im, 12, 12, '#4a9cd0'); set(im, 15, 14, '#4a9cd0'); set(im, 13, 16, '#4a9cd0');
  // купюроприёмник
  rect(im, 21, 7, 3, 5, '#1e3a5c'); rect(im, 21, 8, 3, 1, '#0f1f33');
  // лоток выдачи
  rect(im, 11, 22, 12, 4, '#1e3a5c'); rect(im, 12, 23, 10, 2, '#0f1f33');
  save(im, 'biz_water.png');
})();

// --- Прокат авто ---
(function () {
  const im = mk(32, 32);
  // кузов
  rect(im, 5, 16, 23, 6, '#e8e8ee');
  rect(im, 9, 11, 14, 5, '#e8e8ee');
  rect(im, 5, 16, 23, 2, '#b8c0d4');
  // окна
  rect(im, 10, 12, 6, 4, '#4a6a9e'); rect(im, 17, 12, 5, 4, '#4a6a9e');
  // фара/стоп
  set(im, 27, 17, '#ffe08a'); set(im, 5, 17, '#ff6060');
  // колёса
  rect(im, 8, 21, 5, 5, '#1c2030'); rect(im, 20, 21, 5, 5, '#1c2030');
  rect(im, 9, 22, 3, 3, '#3a4560'); rect(im, 21, 22, 3, 3, '#3a4560');
  set(im, 10, 23, '#8a94ac'); set(im, 22, 23, '#8a94ac');
  // ключ сверху
  rect(im, 13, 3, 8, 2, '#ffd23f'); rect(im, 11, 2, 4, 4, '#ffd23f'); set(im, 12, 3, '#8a6a10'); set(im, 13, 3, '#8a6a10');
  set(im, 18, 5, '#ffd23f'); set(im, 20, 5, '#ffd23f');
  save(im, 'biz_cars.png');
})();

// --- Биотуалеты ---
(function () {
  const im = mk(32, 32);
  // крыша
  rect(im, 8, 3, 17, 3, '#1e5caa'); rect(im, 8, 3, 17, 1, '#4a8ae0');
  // кабина
  rect(im, 10, 6, 13, 23, '#2f7ad6');
  rect(im, 10, 6, 2, 23, '#4a8ae0'); rect(im, 21, 6, 2, 23, '#1e5caa');
  // дверь
  rect(im, 13, 9, 7, 19, '#1e5caa'); rect(im, 14, 10, 5, 17, '#2666b8');
  // вент. щель
  rect(im, 14, 12, 5, 1, '#0f3a6e'); rect(im, 14, 14, 5, 1, '#0f3a6e');
  // ручка
  set(im, 18, 19, '#d8e4f4'); set(im, 18, 20, '#d8e4f4');
  // табличка
  rect(im, 12, 4, 9, 3, '#e8ecf4'); rect(im, 14, 5, 5, 1, '#2f7ad6');
  save(im, 'biz_toilet.png');
})();

// --- Франшиза пиццерии ---
(function () {
  const im = mk(32, 32);
  // корка (широкий край сверху)
  rect(im, 5, 5, 23, 5, '#c98a4a'); rect(im, 5, 5, 23, 2, '#e8a860'); rect(im, 5, 9, 23, 1, '#a56a34');
  // сырный треугольник вниз
  const widths = [21, 19, 17, 15, 13, 11, 9, 7, 5, 3, 1];
  widths.forEach((w, i) => rect(im, 16 - (w >> 1), 10 + i, w, 1, '#ffd97a'));
  // капающий сыр
  set(im, 15, 21, '#ffd97a'); set(im, 17, 22, '#ffd97a');
  // пепперони
  const pep = (x, y) => { rect(im, x, y, 3, 3, '#d64545'); set(im, x, y, '#f07070'); };
  pep(9, 11); pep(19, 12); pep(13, 15); pep(16, 18);
  save(im, 'biz_pizza.png');
})();

// --- Мемкоин «Миринкофе» ---
(function () {
  const im = mk(32, 32);
  // монета (диск)
  const rows = [[13, 6], [10, 12], [8, 16], [7, 18], [6, 20], [5, 22], [5, 22], [4, 24], [4, 24], [4, 24], [4, 24], [4, 24], [4, 24], [4, 24], [4, 24], [4, 24], [5, 22], [5, 22], [6, 20], [7, 18], [8, 16], [10, 12], [13, 6]];
  rows.forEach((r, i) => rect(im, r[0], 4 + i, r[1], 1, '#ffd23f'));
  rows.forEach((r, i) => { set(im, r[0], 4 + i, '#c8961e'); set(im, r[0] + r[1] - 1, 4 + i, '#c8961e'); });
  // блик
  rect(im, 9, 7, 4, 2, '#ffe98a'); set(im, 8, 9, '#ffe98a');
  // буква M
  const M = ['X...X', 'XX.XX', 'X.X.X', 'X...X', 'X...X', 'X...X', 'X...X'];
  M.forEach((row, j) => { for (let i = 0; i < 5; i++) if (row[i] === 'X') set(im, 13 + i, 12 + j, '#8a6a10'); });
  save(im, 'biz_crypto.png');
})();

// --- Тюльпаны оптом ---
(function () {
  const im = mk(32, 32);
  const tulip = (cx, c) => {
    rect(im, cx - 2, 5, 5, 4, c);           // голова
    set(im, cx - 2, 4, c); set(im, cx + 2, 4, c);
    set(im, cx - 2, 5, '#ffffff');          // блик
    set(im, cx - 1, 9, c); set(im, cx + 1, 9, c);
    rect(im, cx, 9, 1, 10, '#3f8a3f');      // стебель
  };
  tulip(9, '#e84a5a'); tulip(16, '#ffd23f'); tulip(23, '#e84a5a');
  // листья
  rect(im, 6, 14, 2, 1, '#4a9a4a'); rect(im, 5, 15, 3, 1, '#4a9a4a');
  rect(im, 25, 13, 2, 1, '#4a9a4a'); rect(im, 25, 14, 3, 1, '#4a9a4a');
  rect(im, 12, 16, 2, 1, '#4a9a4a'); rect(im, 18, 15, 2, 1, '#4a9a4a');
  // пакет-обёртка
  const wrap = [20, 18, 16, 14, 12, 10, 8];
  wrap.forEach((w, i) => rect(im, 16 - (w >> 1), 19 + i, w, 1, '#d8c8a8'));
  rect(im, 12, 25, 8, 1, '#b8a888');
  save(im, 'biz_tulips.png');
})();

// --- Т-Банк: жёлтая карта ---
(function () {
  const im = mk(32, 32);
  rect(im, 4, 9, 25, 15, '#ffd23f');
  rect(im, 4, 9, 25, 2, '#ffe98a'); rect(im, 4, 22, 25, 2, '#d8a81e');
  // чип
  rect(im, 7, 13, 5, 4, '#2b2b2b'); set(im, 8, 14, '#5c5c5c');
  // полосы номера
  rect(im, 7, 19, 7, 1, '#8a6a10'); rect(im, 16, 19, 7, 1, '#8a6a10');
  save(im, 'bank_t.png');
})();

// --- Альфа-Банк: красная карта с А ---
(function () {
  const im = mk(32, 32);
  rect(im, 4, 9, 25, 15, '#e03131');
  rect(im, 4, 9, 25, 2, '#f06060'); rect(im, 4, 22, 25, 2, '#a81e1e');
  // чип
  rect(im, 7, 13, 5, 4, '#2b2b2b'); set(im, 8, 14, '#5c5c5c');
  // буква A
  const A = ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X'];
  A.forEach((row, j) => { for (let i = 0; i < 5; i++) if (row[i] === 'X') set(im, 21 + i, 11 + j, '#ffffff'); });
  rect(im, 7, 19, 7, 1, '#7c1414');
  save(im, 'bank_alpha.png');
})();

// ============================================================
//  ПОРТРЕТ АЙДЕНА 48x48
// ============================================================
(function () {
  const im = mk(48, 48);
  const hood = '#2b3252', hoodL = '#3a4470', hoodD = '#1c2138';
  const skin = '#e8b088', skinD = '#c08050', skinL = '#f5c8a0', stub = '#a87848';
  const hair = '#2e2018';
  // капюшон за головой
  rect(im, 10, 5, 28, 36, hood);
  rect(im, 10, 5, 28, 3, hoodL);
  rect(im, 8, 30, 32, 18, hood);
  // шея
  rect(im, 20, 33, 8, 5, skin); rect(im, 20, 36, 8, 2, skinD);
  // лицо
  rect(im, 16, 12, 16, 22, skin);
  rect(im, 16, 12, 2, 22, skinD); rect(im, 30, 12, 2, 20, skinL);
  // уши
  rect(im, 14, 21, 2, 4, skin); rect(im, 32, 21, 2, 4, skin);
  // волосы
  rect(im, 15, 7, 18, 6, hair); rect(im, 15, 13, 3, 6, hair); rect(im, 30, 13, 3, 5, hair);
  rect(im, 15, 7, 18, 2, '#453021');
  // брови
  rect(im, 19, 19, 5, 1, hair); rect(im, 26, 19, 5, 1, hair);
  // глаза
  rect(im, 20, 21, 3, 2, '#f5f5f5'); set(im, 21, 22, '#20304a'); set(im, 22, 22, '#20304a');
  rect(im, 27, 21, 3, 2, '#f5f5f5'); set(im, 28, 22, '#20304a'); set(im, 29, 22, '#20304a');
  // нос
  set(im, 24, 25, skinD); set(im, 24, 26, skinD); set(im, 25, 26, skinD);
  // улыбка
  rect(im, 21, 29, 7, 1, '#8a4030'); set(im, 20, 28, '#8a4030'); set(im, 28, 28, '#8a4030');
  set(im, 22, 29, '#ffffff'); set(im, 23, 29, '#ffffff');
  // лёгкая щетина (только по контуру челюсти)
  const st = [[18, 31], [17, 30], [30, 31], [31, 30], [22, 33], [25, 33], [23, 33], [24, 33], [19, 32], [28, 32]];
  st.forEach(p => set(im, p[0], p[1], stub, 110));
  // худи
  rect(im, 8, 38, 32, 10, hoodL);
  rect(im, 8, 38, 32, 2, '#4a558a');
  // карман
  rect(im, 14, 43, 20, 5, hood); rect(im, 14, 43, 20, 1, hoodD);
  // шнурки
  rect(im, 20, 38, 1, 5, '#d8dce8'); rect(im, 27, 38, 1, 5, '#d8dce8');
  set(im, 20, 43, '#aab0c4'); set(im, 27, 43, '#aab0c4');
  // телефон на селфи-палке справа
  rect(im, 38, 20, 1, 16, '#5c6680');            // палка
  rect(im, 35, 12, 7, 11, '#23283d');           // телефон
  rect(im, 36, 13, 5, 8, '#5a8fd6');            // экран с камерой
  set(im, 38, 14, '#cfe6ff'); set(im, 37, 15, '#7ab0ea');
  rect(im, 36, 34, 5, 4, skin);                 // рука
  save(im, 'iden.png');
})();

// ============================================================
//  ФОН: вечерний Питер 160x90 (апскейлится)
// ============================================================
(function () {
  const im = mk(160, 90);
  let seed = 42;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  // небо
  for (let y = 0; y < 58; y++) {
    const t = y / 58;
    const r = Math.floor(26 + t * (217 - 26)), g = Math.floor(16 + t * (123 - 16) * 0.6), b = Math.floor(51 + t * 40);
    for (let x = 0; x < 160; x++) { const i = (y * 160 + x) * 4; im.px[i] = r; im.px[i + 1] = g; im.px[i + 2] = b + 30; im.px[i + 3] = 255; }
  }
  // звёзды
  for (let i = 0; i < 40; i++) { const x = Math.floor(rnd() * 160), y = Math.floor(rnd() * 28); set(im, x, y, rnd() > 0.5 ? '#ffffff' : '#ffe9a8', 120 + rnd() * 135); }
  // луна
  for (let j = 0; j < 7; j++) { const w = [4, 6, 7, 7, 7, 6, 4][j]; rect(im, 133 - (w >> 1) + 3, 6 + j, w, 1, '#f5e6b8'); }
  set(im, 132, 8, '#d8c88f'); set(im, 134, 10, '#d8c88f');
  // дальние дома
  let x = 0;
  while (x < 160) {
    const w = 8 + Math.floor(rnd() * 10), h = 12 + Math.floor(rnd() * 20);
    rect(im, x, 55 - h, w, h, '#241a3d');
    for (let wy = 55 - h + 2; wy < 53; wy += 4) for (let wx = x + 1; wx < x + w - 1; wx += 3) if (rnd() > 0.75) set(im, wx, wy, '#59487a');
    x += w;
  }
  // ближние дома
  x = -4;
  const near = ['#161226', '#1d1633', '#131022'];
  while (x < 164) {
    const w = 14 + Math.floor(rnd() * 12), h = 22 + Math.floor(rnd() * 22), c = near[Math.floor(rnd() * 3)];
    rect(im, x, 64 - h, w, h, c);
    rect(im, x, 64 - h, w, 1, '#2c2347');
    for (let wy = 64 - h + 3; wy < 61; wy += 5) for (let wx = x + 2; wx < x + w - 2; wx += 4) {
      if (rnd() > 0.55) { rect(im, wx, wy, 2, 3, rnd() > 0.3 ? '#ffd23f' : '#ff9a5c'); }
      else rect(im, wx, wy, 2, 3, '#0c0a18');
    }
    x += w;
  }
  // магазинный тент (кофейня!) 
  for (let i = 0; i < 12; i++) rect(im, 62 + i, 52, 1, 3, i % 2 ? '#e84a5a' : '#f2e8d8');
  rect(im, 62, 55, 12, 7, '#3a2a20');
  rect(im, 64, 56, 8, 4, '#ffdf8a');
  // улица
  rect(im, 0, 64, 160, 26, '#0d0b18');
  rect(im, 0, 64, 160, 3, '#2a2540');           // тротуар
  rect(im, 0, 71, 160, 1, '#3a3454');
  for (let i = 0; i < 160; i += 12) rect(im, i, 79, 6, 1, '#6a6488'); // разметка
  // фонари
  [18, 78, 138].forEach(lx => {
    rect(im, lx, 48, 1, 16, '#0c0a16');
    rect(im, lx - 1, 46, 3, 2, '#ffd23f');
    set(im, lx - 2, 47, '#ffd23f', 70); set(im, lx + 2, 47, '#ffd23f', 70); set(im, lx, 45, '#ffd23f', 70);
    set(im, lx, 66, '#ffd23f', 40);
  });
  save(im, 'bg.png');
})();

// ============================================================
//  ЗВУКИ (8-bit WAV)
// ============================================================
function wavPCM(samples, rate) {
  rate = rate || 22050;
  const data = Buffer.from(samples);
  const hdr = Buffer.alloc(44);
  hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + data.length, 4); hdr.write('WAVE', 8);
  hdr.write('fmt ', 12); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22);
  hdr.writeUInt32LE(rate, 24); hdr.writeUInt32LE(rate, 28); hdr.writeUInt16LE(1, 32); hdr.writeUInt16LE(8, 34);
  hdr.write('data', 36); hdr.writeUInt32LE(data.length, 40);
  return Buffer.concat([hdr, data]);
}
function tone(freq, ms, vol, slide) {
  const rate = 22050, n = Math.floor(rate * ms / 1000), out = new Uint8Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const f = slide ? freq + (slide - freq) * (i / n) : freq;
    phase += f / rate;
    const sq = (phase % 1) < 0.5 ? 1 : -1;
    const env = Math.min(1, 4 * (1 - i / n));
    out[i] = Math.round(128 + sq * vol * env * 100);
  }
  return out;
}
function seq(parts) {
  let all = [];
  parts.forEach(p => { const t = tone(p[0], p[1], p[2], p[3]); for (let i = 0; i < t.length; i++) all.push(t[i]); });
  return all;
}
function saveWav(name, samples) {
  fs.writeFileSync(path.join(OUT, name), wavPCM(samples));
  console.log('  +', name);
}
saveWav('click.wav', seq([[1200, 30, 0.5]]));
saveWav('cash.wav', seq([[880, 60, 0.5], [1320, 90, 0.5]]));
saveWav('fail.wav', seq([[380, 350, 0.55, 130]]));
saveWav('levelup.wav', seq([[523, 70, 0.5], [659, 70, 0.5], [784, 70, 0.5], [1046, 140, 0.5]]));
saveWav('event.wav', seq([[620, 90, 0.5], [0, 40, 0], [620, 90, 0.5]]));

// ============================================================
//  ФОНОВАЯ МУЗЫКА: 8-битный scandi lo-fi луп (16-bit WAV)
//  Спокойный минор Am-F-C-G, мягкие треугольные волны
// ============================================================
function wavPCM16(samples, rate) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    let v = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  }
  const hdr = Buffer.alloc(44);
  hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + data.length, 4); hdr.write('WAVE', 8);
  hdr.write('fmt ', 12); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22);
  hdr.writeUInt32LE(rate, 24); hdr.writeUInt32LE(rate * 2, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34);
  hdr.write('data', 36); hdr.writeUInt32LE(data.length, 40);
  return Buffer.concat([hdr, data]);
}

(function music() {
  const rate = 22050, bpm = 76;
  const beat = 60 / bpm, bar = beat * 4, bars = 8;
  const total = Math.round(bar * bars * rate);
  const mix = new Float32Array(total);

  const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
  const f = (n, o) => 440 * Math.pow(2, (12 * (o + 1) + NOTE[n] - 69) / 12);
  const tri = p => 4 * Math.abs((p % 1) - 0.5) - 1;
  const sq = (p, d) => ((p % 1) < d ? 1 : -1);

  // нота с огибающей; опц. вибрация для lo-fi тепла
  function put(fr, start, dur, opt) {
    const s0 = Math.floor(start * rate), n = Math.floor(dur * rate);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const idx = s0 + i; if (idx >= total) break;
      const t = i / rate;
      const wob = 1 + (opt.wob || 0) * Math.sin(2 * Math.PI * 0.5 * (start + t));
      ph += (fr * wob) / rate;
      let v = opt.sq ? sq(ph, opt.duty || 0.5) : tri(ph);
      const atk = opt.atk || 0.01, rel = opt.rel || Math.min(0.2, dur * 0.6);
      let env = 1;
      if (t < atk) env = t / atk;
      if (t > dur - rel) env = Math.min(env, (dur - t) / rel);
      if (env < 0) env = 0;
      mix[idx] += v * env * (opt.vol || 0.2);
    }
  }
  // барабаны
  function kick(start, vol) {
    const s0 = Math.floor(start * rate), n = Math.floor(0.16 * rate);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / rate, idx = s0 + i; if (idx >= total) break;
      ph += (110 * Math.exp(-t * 18) + 42) / rate;
      mix[idx] += Math.sin(2 * Math.PI * ph) * Math.exp(-t * 12) * vol;
    }
  }
  function hat(start, vol) {
    const s0 = Math.floor(start * rate), n = Math.floor(0.035 * rate);
    for (let i = 0; i < n; i++) {
      const t = i / rate, idx = s0 + i; if (idx >= total) break;
      mix[idx] += (Math.random() * 2 - 1) * Math.exp(-t * 90) * vol;
    }
  }
  function snare(start, vol) {
    const s0 = Math.floor(start * rate), n = Math.floor(0.09 * rate);
    for (let i = 0; i < n; i++) {
      const t = i / rate, idx = s0 + i; if (idx >= total) break;
      mix[idx] += (Math.random() * 2 - 1) * Math.exp(-t * 35) * vol;
    }
  }

  // аккорды: Am | Am | F | F | C | C | G | G (по 2 такта)
  const chords = [
    { root: ['A', 2], notes: [['A', 3], ['C', 4], ['E', 4], ['C', 4]] },
    { root: ['F', 2], notes: [['F', 3], ['A', 3], ['C', 4], ['A', 3]] },
    { root: ['C', 3], notes: [['C', 4], ['E', 4], ['G', 4], ['E', 4]] },
    { root: ['G', 2], notes: [['G', 3], ['B', 3], ['D', 4], ['B', 3]] }
  ];
  for (let b = 0; b < bars; b++) {
    const ch = chords[Math.floor(b / 2)];
    const t0 = b * bar;
    // бас: две длинные ноты за такт
    put(f(ch.root[0], ch.root[1]), t0, beat * 1.9, { vol: 0.30, atk: 0.02, rel: 0.3 });
    put(f(ch.root[0], ch.root[1] + 1), t0 + beat * 2, beat * 1.9, { vol: 0.18, atk: 0.02, rel: 0.3 });
    // арпеджио восьмыми
    for (let e = 0; e < 8; e++) {
      const nt = ch.notes[e % 4];
      put(f(nt[0], nt[1]), t0 + e * beat / 2, beat * 0.45, { vol: 0.07, sq: true, duty: 0.25, atk: 0.005, rel: 0.12 });
    }
    // ритм
    kick(t0, 0.17); kick(t0 + beat * 2, 0.15);
    for (let e = 0; e < 4; e++) hat(t0 + e * beat, 0.04);
    snare(t0 + beat, 0.028); snare(t0 + beat * 3, 0.028);
  }
  // мелодия (задумчивая, минорная)
  const mel = [
    [[0, 'A', 4, 1.5], [1.5, 'C', 5, 0.5], [2, 'E', 5, 1], [3, 'D', 5, 1]],
    [[0, 'C', 5, 2], [2, 'B', 4, 1], [3, 'A', 4, 1]],
    [[0, 'A', 4, 1.5], [1.5, 'C', 5, 0.5], [2, 'F', 5, 1], [3, 'E', 5, 1]],
    [[0, 'D', 5, 1], [1, 'C', 5, 1], [2, 'A', 4, 2]],
    [[0, 'E', 5, 1.5], [1.5, 'G', 5, 0.5], [2, 'E', 5, 1], [3, 'D', 5, 1]],
    [[0, 'C', 5, 2], [2, 'B', 4, 2]],
    [[0, 'D', 5, 1], [1, 'B', 4, 1], [2, 'G', 4, 1], [3, 'B', 4, 1]],
    [[0, 'A', 4, 3], [3, 'E', 4, 1]]
  ];
  mel.forEach((notesArr, b) => {
    notesArr.forEach(nt => put(f(nt[1], nt[2]), b * bar + nt[0] * beat, nt[3] * beat * 0.95, { vol: 0.13, atk: 0.04, rel: 0.25, wob: 0.003 }));
  });

  // нормализация + мягкие фейды на стыке лупа
  let peak = 0;
  for (let i = 0; i < total; i++) peak = Math.max(peak, Math.abs(mix[i]));
  const gain = peak > 0 ? 0.82 / peak : 1;
  const fadeN = Math.floor(rate * 0.03);
  const out = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    let v = mix[i] * gain;
    if (i < fadeN) v *= i / fadeN;
    if (i > total - fadeN) v *= (total - i) / fadeN;
    out[i] = v;
  }
  fs.writeFileSync(path.join(OUT, 'music_loop.wav'), wavPCM16(out, rate));
  console.log('  + music_loop.wav', (total / rate).toFixed(1) + 's,', (total * 2 / 1024 / 1024).toFixed(2) + ' MB');
})();

console.log('Assets generated into', OUT);
