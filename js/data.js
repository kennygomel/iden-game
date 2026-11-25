// ============================================================
//  АЙДЕН: БИЗНЕС-ИМПЕРИЯ — игровые данные
//  Бизнесы, события, банки, навыки, достижения
// ============================================================

// ---------- Каталог бизнесов (по реальным видео АЙДЕНа) ----------
var BIZ_TYPES = [
  {
    id: 'tulips', name: 'Тюльпаны оптом', icon: 'resources/biz_tulips.png',
    cost: 25000, incMin: 1500, incMax: 4500, expense: 2200, risk: 0.35,
    desc: 'Купил оптом — продал на Авито. Классика к 8 марта.'
  },
  {
    id: 'iphone', name: 'Перекуп айфонов', icon: 'resources/biz_iphone.png',
    cost: 80000, incMin: 4000, incMax: 11000, expense: 6500, risk: 0.30,
    desc: 'IDen Store: б/у техника Apple. Купил дешевле, продал дороже.'
  },
  {
    id: 'crypto', name: 'Мемкоин MIRINCOIN', icon: 'resources/biz_crypto.png',
    cost: 100000, incMin: -15000, incMax: 45000, expense: 500, risk: 0.90,
    desc: 'Создал по приколу ночью. Криптокиты уже пампят.'
  },
  {
    id: 'water', name: 'Водомат', icon: 'resources/biz_water.png',
    cost: 200000, incMin: 3000, incMax: 8000, expense: 4200, risk: 0.30,
    desc: '«Я купил ВОДОМАТ!» Вода. Из автомата. Гениально.'
  },
  {
    id: 'pc', name: 'Сборка ПК на заказ', icon: 'resources/biz_pc.png',
    cost: 300000, incMin: 7000, incMax: 16000, expense: 9500, risk: 0.35,
    desc: 'КОМПЫ - поперли! RGB-монстры для школьников.'
  },
  {
    id: 'ozon', name: 'ПВЗ Ozon', icon: 'resources/biz_ozon.png',
    cost: 350000, incMin: 8000, incMax: 15000, expense: 11000, risk: 0.45,
    desc: 'Пункт выдачи заказов. «Я открыл ПВЗ - где деньги?»'
  },
  {
    id: 'wb', name: 'ПВЗ Wildberries', icon: 'resources/biz_wb.png',
    cost: 350000, incMin: 8000, incMax: 15000, expense: 11500, risk: 0.45,
    desc: '30 дней владею ПВЗ WB. Спойлер: денег нет.'
  },
  {
    id: 'repair', name: 'Сервисный центр', icon: 'resources/biz_repair.png',
    cost: 450000, incMin: 10000, incMax: 22000, expense: 14000, risk: 0.40,
    desc: 'Ремонт ПК с нуля. Первые клиенты и проблемы.'
  },
  {
    id: 'toilet', name: 'Биотуалеты', icon: 'resources/biz_toilet.png',
    cost: 500000, incMin: 9000, incMax: 20000, expense: 12500, risk: 0.40,
    desc: 'Золото там, куда никто не смотрит. Прокат кабинок.'
  },
  {
    id: 'podcast', name: 'Студия подкастов', icon: 'resources/biz_podcast.png',
    cost: 600000, incMin: 9000, incMax: 24000, expense: 15500, risk: 0.45,
    desc: '«Бизнес в минус - что делать со студией подкастов?»'
  },
  {
    id: 'coffee', name: 'Кофейня «Миренкофе»', icon: 'resources/biz_coffee.png',
    cost: 900000, incMin: 22000, incMax: 38000, expense: 27500, risk: 0.55,
    desc: 'Флагман на Тележной. Ремонт уже съел 8 млн.'
  },
  {
    id: 'cars', name: 'Прокат авто', icon: 'resources/biz_cars.png',
    cost: 1500000, incMin: 35000, incMax: 75000, expense: 52000, risk: 0.60,
    desc: 'Машина мечты Лисян. Точнее, целый прокат машин.'
  },
  {
    id: 'pizza', name: 'Франшиза пиццерии', icon: 'resources/biz_pizza.png',
    cost: 2000000, incMin: 48000, incMax: 90000, expense: 66000, risk: 0.70,
    desc: 'Паушальный взнос, роялти... Что может пойти не так?'
  }
];

// ---------- События ----------
// kind: 'bad' | 'fatal' | 'good'
// cond(biz) — может ли случиться с бизнесом (biz === null для глобальных)
// choices: [{ t, d, go }]  go(S, biz) -> строка результата для лога
var EVENTS = [
  // ===== ПЛОХИЕ =====
  {
    id: 'rent_up', kind: 'bad', w: 10,
    title: 'АРЕНДОДАТЕЛЬ ПОДНЯЛ АРЕНДУ',
    text: '«Свои люди, поднимаю вам аренду вдвое. Не нравится — съезжайте». Классика жанра.',
    cond: function (biz) { return biz.expenseMul < 2; },
    choices: [
      {
        t: 'Согласиться', d: 'Расходы x1.6 навсегда',
        go: function (S, biz) { biz.expenseMul *= 1.6; biz.warn = 'АРЕНДА x1.6'; return 'Аренда выросла. Расходы «' + biz.name + '» x1.6'; }
      },
      {
        t: 'Съехать', d: 'Закрыть бизнес, вернуть 25%',
        go: function (S, biz) { return { fatal: true, refund: 0.25, why: 'Съехали с помещения. Арендодатель доволен.' }; }
      }
    ]
  },
  {
    id: 'investor', kind: 'bad', w: 8,
    title: 'ИНВЕСТОР УШЁЛ',
    text: 'Будущий партнёр написал: «Случилось что-то личное, забирайте всё себе». Ремонт уже покрашен в фирменный цвет.',
    cond: function (biz) { return biz.cost >= 400000; },
    choices: [
      {
        t: 'Дофинансировать', d: 'Заплатить 30% от цены бизнеса',
        go: function (S, biz) {
          var sum = Math.floor(biz.cost * 0.3);
          S.money -= sum;
          return 'Доплатил из своего кармана: -' + fmtMoney(sum);
        }
      },
      {
        t: 'Заморозить', d: 'Нет выручки 5 дней',
        go: function (S, biz) { biz.frozen = 5; biz.warn = 'ЗАМОРОЖЕН'; return 'Бизнес заморожен на 5 дней'; }
      }
    ]
  },
  {
    id: 'partner_rob', kind: 'bad', w: 9,
    title: 'ПАРТНЁР СЛИЛ КАССУ',
    text: 'Бизнес-партнёр взял дневную выручку и перестал выходить на связь. В Telegram «был(а) недавно».',
    cond: function (biz) { return true; },
    choices: [
      {
        t: 'Уволить партнёра', d: 'Потеря 20% цены, выручка -15%',
        go: function (S, biz) {
          var sum = Math.floor(biz.cost * 0.2);
          S.money -= sum; biz.incomeMul *= 0.85;
          return 'Партнёр уволен: -' + fmtMoney(sum) + ', выручка просела';
        }
      },
      {
        t: 'Простить', d: 'Потеря 10% цены, но риск повтора',
        go: function (S, biz) {
          var sum = Math.floor(biz.cost * 0.1);
          S.money -= sum; biz.risk += 0.15;
          return 'Партнёр прощён: -' + fmtMoney(sum) + '. Он точно не повторит. Наверное.';
        }
      }
    ]
  },
  {
    id: 'royalty', kind: 'bad', w: 8,
    title: 'ФРАНШИЗОДАТЕЛЬ ПОДНЯЛ РОЯЛТИ',
    text: '«Мы пересмотрели условия договора». Роялти теперь кусаются втрое сильнее. Обратного хода нет — договор подписан.',
    cond: function (biz) { return biz.type === 'pizza' || biz.type === 'coffee'; },
    choices: [
      {
        t: 'Платить', d: 'Расходы x1.35',
        go: function (S, biz) { biz.expenseMul *= 1.35; biz.warn = 'РОЯЛТИ x1.35'; return 'Роялти съедают маржу «' + biz.name + '»'; }
      },
      {
        t: 'Расторгнуть', d: 'Закрыть, вернуть 15%',
        go: function (S, biz) { return { fatal: true, refund: 0.15, why: 'Договор расторгнут. Франшизодатель купил себе новый Лисян.' }; }
      }
    ]
  },
  {
    id: 'inspection', kind: 'bad', w: 7,
    title: 'ПРОВЕРКА САНЭПИД',
    text: 'Проверяющие нашли, к чему придраться. Они всегда находят, к чему придраться.',
    cond: function (biz) { return biz.type === 'coffee' || biz.type === 'pizza'; },
    choices: [
      {
        t: 'Заплатить штраф', d: '-60 000 ₽',
        go: function (S, biz) { S.money -= 60000; return 'Штраф оплачен: -60 000 ₽'; }
      },
      {
        t: 'Закрыться на 4 дня', d: 'Нет выручки, расходы идут',
        go: function (S, biz) { biz.frozen = 4; biz.warn = 'ПРОВЕРКА'; return 'Точка закрыта на проверку: 4 дня без выручки'; }
      }
    ]
  },
  {
    id: 'breakdown', kind: 'bad', w: 9,
    title: 'СЛОМАЛОСЬ ОБОРУДОВАНИЕ',
    text: 'Кофемашина / сервер / станок (нужное подчеркнуть) издало странный звук и погасло.',
    cond: function (biz) { return true; },
    choices: [
      {
        t: 'Ремонт', d: 'Заплатить 15% от цены бизнеса',
        go: function (S, biz) {
          var sum = Math.floor(biz.cost * 0.15);
          S.money -= sum;
          return 'Ремонт оплачен: -' + fmtMoney(sum);
        }
      },
      {
        t: 'Работаем так', d: 'Выручка -20%',
        go: function (S, biz) { biz.incomeMul *= 0.8; biz.warn = 'СЛОМАНО'; return 'Работает через раз. Выручка «' + biz.name + '» -20%'; }
      }
    ]
  },
  {
    id: 'fake_filial', kind: 'bad', w: 5,
    title: 'ФЕЙКОВЫЙ ФИЛИАЛ В УЗБЕКИСТАНЕ',
    text: 'Мошенники открыли «IDen Store Tashkent» и собирают предоплаты от твоего имени. Подписчики в ярости.',
    cond: function (biz) { return biz.type === 'iphone'; },
    choices: [
      {
        t: 'Опровержение', d: '-30 000 ₽, но это контент!',
        go: function (S, biz) {
          S.money -= 30000;
          var gain = Math.floor(S.subs * 0.08) + 500;
          S.subs += gain;
          return 'Пост-разоблачение: -30 000 ₽, +' + fmtNum(gain) + ' подписчиков';
        }
      }
    ]
  },
  {
    id: 'whiner', kind: 'bad', w: 7,
    title: 'ХАЙПОВЫЙ НЕГАТИВ',
    text: 'Локальный паблик опубликовал разоблачение: «Всем не понравилось». Гости перестали приходить.',
    cond: function (biz) { return biz.type === 'coffee' || biz.type === 'podcast' || biz.type === 'pizza'; },
    choices: [
      {
        t: 'Пережить', d: 'Выручка -25% на 7 дней',
        go: function (S, biz) { biz.debuff = 7; biz.warn = 'НЕГАТИВ'; return 'Неделя сниженной выручки у «' + biz.name + '»'; }
      },
      {
        t: 'Промо-кампания', d: '-45 000 ₽, забыли',
        go: function (S, biz) { S.money -= 45000; return 'Промо сработало: -45 000 ₽'; }
      }
    ]
  },
  // ===== РОКОВЫЕ (бизнес сворачивается) =====
  {
    id: 'kick_out', kind: 'fatal', w: 4,
    title: 'ВСЕХ ВЫСЕЛИЛИ',
    text: 'Арендодатель продал помещение «своим людям». Договор? Какой договор. Собирай вещи.',
    cond: function (biz) { return biz.type !== 'crypto'; },
    choices: [
      {
        t: 'Свернуть бизнес', d: 'Вернуть 20% от вложенного',
        go: function (S, biz) { return { fatal: true, refund: 0.2, why: 'Выселили. «3 года я пытался спасти этот бизнес. Не смог».' }; }
      }
    ]
  },
  {
    id: 'partner_exit', kind: 'fatal', w: 4,
    title: 'ПАРТНЁРЫ РАЗОШЛИСЬ',
    text: 'Бизнес-партнёры поделили клиентов, оборудование и пароль от эквайринга. Тебе достались долги.',
    cond: function (biz) { return biz.type !== 'crypto' && biz.type !== 'tulips'; },
    choices: [
      {
        t: 'Свернуть бизнес', d: 'Возврата нет. Вообще.',
        go: function (S, biz) { return { fatal: true, refund: 0, why: 'Партнёры разошлись. Классика: «киданули бизнес-партнёры».' }; }
      }
    ]
  },
  {
    id: 'coin_dump', kind: 'fatal', w: 6,
    title: 'КИТЫ СЛИЛИ МЕМКОИН',
    text: 'Криптокиты распродали MIRINCOIN на хаях. Капитализация устремилась к нулю. Чат требует посты.',
    cond: function (biz) { return biz.type === 'crypto'; },
    choices: [
      {
        t: 'Принять судьбу', d: 'Всё потеряно, зато какой контент!',
        go: function (S, biz) { return { fatal: true, refund: 0, why: '«Мемкоины — это казино». Деньги не выведешь — плохой тон.' }; }
      }
    ]
  },
  {
    id: 'season_end', kind: 'fatal', w: 5,
    title: 'СЕЗОН ЗАКОНЧИЛСЯ',
    text: '8 марта прошло. Тюльпаны завяли. Ёлки бы тоже завяли, но это другая серия.',
    cond: function (biz) { return biz.type === 'tulips'; },
    choices: [
      {
        t: 'Свернуть до следующего года', d: 'Вернуть 30%',
        go: function (S, biz) { return { fatal: true, refund: 0.3, why: 'Сезонка закрыта. До следующего 8 марта!' }; }
      }
    ]
  },
  // ===== ХОРОШИЕ (редко!) =====
  {
    id: 'viral', kind: 'good', w: 3,
    title: 'ВИДЕО ЗАЛЕТЕЛО В ТРЕНДЫ!',
    text: 'Алгоритмы подхватили ролик про бизнес. «Добрый ден» слышит весь интернет.',
    cond: null,
    choices: [
      {
        t: 'Красавчик', d: '+подписчики',
        go: function (S, biz) {
          var gain = Math.floor(S.subs * (0.15 + Math.random() * 0.1)) + 1000;
          S.subs += gain; S.lastViral = S.day;
          return 'Вирусный ролик: +' + fmtNum(gain) + ' подписчиков';
        }
      }
    ]
  },
  {
    id: 'loyal', kind: 'good', w: 3,
    title: 'ПОСТОЯННЫЙ КЛИЕНТ',
    text: 'Постоянник привёл всех коллег с работы. Молва — лучший маркетинг.',
    cond: function (biz) { return biz && biz.type !== 'crypto'; },
    choices: [
      {
        t: 'Отлично', d: 'Выручка +15%',
        go: function (S, biz) { biz.incomeMul *= 1.15; return 'Выручка «' + biz.name + '» выросла на 15%'; }
      }
    ]
  },
  {
    id: 'ad_deal', kind: 'good', w: 3,
    title: 'РЕКЛАМОДАТЕЛЬ В ДИРЕКТЕ',
    text: '«Добрый ден! Интеграция, 30 секунд, по вашим расценкам». Бывает и такое.',
    cond: null,
    choices: [
      {
        t: 'Взять деньги', d: '+бюджет от блога',
        go: function (S, biz) {
          var sum = Math.floor(S.subs * 0.6) + 5000;
          S.money += sum;
          return 'Интеграция продана: +' + fmtMoney(sum);
        }
      }
    ]
  }
];

// ---------- Банки ----------
var BANKS = [
  {
    id: 't', name: 'Т-БАНК', icon: 'resources/bank_t.png',
    rate: 0.009, maxBase: 500000, minLevel: 1,
    desc: 'Одобряет всем и мгновенно. Проценты кусаются.',
    color: '#ffd23f'
  },
  {
    id: 'alpha', name: 'АЛЬФА-БАНК', icon: 'resources/bank_alpha.png',
    rate: 0.0045, maxBase: 1200000, minLevel: 3,
    desc: 'Дешевле, но нужен 3 уровень и деловая репутация.',
    color: '#e03131'
  }
];

// ---------- Навыки ----------
var SKILLS = [
  { id: 'talk',     name: 'ПЕРЕГОВОРЫ', desc: '-5% к цене открытия за уровень', max: 5 },
  { id: 'market',   name: 'МАРКЕТИНГ',  desc: '+8% к выручке за уровень',       max: 5 },
  { id: 'save',     name: 'ЭКОНОМИЯ',   desc: '-6% к расходам за уровень',      max: 5 },
  { id: 'charisma', name: 'ХАРИЗМА',    desc: '+12% к росту подписчиков за ур.', max: 5 }
];

// ---------- Достижения (тосты) ----------
var ACHIEVES = [
  { id: 'first_biz',  text: 'ПЕРВЫЙ БИЗНЕС ОТКРЫТ! Добрый ден!',        check: function (S) { return S.stats.opened >= 1; } },
  { id: 'five_biz',   text: 'СЕРИЙНЫЙ ПРЕДПРИНИМАТЕЛЬ: 5 бизнесов',     check: function (S) { return S.stats.opened >= 5; } },
  { id: 'first_fail', text: 'ПЕРВЫЙ ПРОВАЛ. Контент собран!',           check: function (S) { return S.stats.failed >= 1; } },
  { id: 'five_fail',  text: 'СЕРИЙНЫЙ НЕУДАЧНИК: 5 провалов',           check: function (S) { return S.stats.failed >= 5; } },
  { id: 'subs100k',   text: '100 000 ПОДПИСЧИКОВ!',                     check: function (S) { return S.subs >= 100000; } },
  { id: 'subs1m',     text: '1 000 000 ПОДПИСЧИКОВ! Как у настоящего!', check: function (S) { return S.subs >= 1000000; } },
  { id: 'money5m',    text: '5 000 000 ₽ НА СЧЁТЕ. Лисян близко!',      check: function (S) { return S.money >= 5000000; } },
  { id: 'day30',      text: '30 ДНЕЙ В БИЗНЕСЕ. Ещё не банкрот!',       check: function (S) { return S.day >= 30; } },
  { id: 'day100',     text: '100 ДНЕЙ. АЙДЕН ГОРДИТСЯ!',                check: function (S) { return S.day >= 100; } }
];
