# AGENTS.md

## Проект
Браузерная пиксель-арт игра «АЙДЕН: Бизнес-Империя» (бизнес-симулятор + RPG про блогера АЙДЕНа).
Движок: **PointJS** (`pointjs.js`). Полная документация синтаксиса движка — `pointjs_ai.js`
(читать перед написанием кода движка; не выдумывать API вне этих файлов).

## Файлы
- `index.html` — подключает `pointjs.js`, `js/data.js`, `js/game.js`. Шрифт Press Start 2P (Google Fonts), `image-rendering: pixelated`.
- `js/data.js` — контент: `BIZ_TYPES`, `EVENTS` (bad/fatal/good, choices с `go(S,biz)`), `BANKS`, `SKILLS`, `ACHIEVES`.
- `js/game.js` — всё остальное: состояние `S`, экономика, сохранения, immediate-mode UI, циклы.
- `resources/` — PNG 32×32 (иконки) / 48×48 (портрет) / 160×90 (фон), WAV-звуки. Генерируются `tools/gen_assets.js` (Node, свой PNG-энкодер на zlib).
- `tools/serve.js` — статический сервер для локального теста (`node tools/serve.js` → http://localhost:8080).

## Важные соглашения
- Координаты: `pjs.system.initFullPage()` — канвас = размер окна, мышь 1:1.
  Поэтому все позиции адаптивные: `W`/`H` обновляются через `syncSize()` в начале каждого цикла.
  Не хардкодить 1280×720.
- UI рисуется каждый кадр «immediate mode»: `panel()`, `txt()`, `btn()`, `drawImg()`.
  `btn()` сам обрабатывает hover/клик и возвращает true. При открытой модалке фон блокируется через `S.lock`.
- Изображения — `game.newImageObject` один раз в `IMGS`, затем `drawImg(key,x,y,w,h,alpha)`.
- События времени: `S.frame` копится, раз в N кадров (зависит от `S.speed`) вызывается `dayTick()`.
  Любая модалка ставит время на паузу. Событие сохраняет `S.prevSpeed` и восстанавливает после выбора.
- Экономика: старт 500к/5000 подписчиков; бизнесы нарочно убыточны (EV минус, редкие плюсовые дни);
  личные расходы `1000 + subs*0.005`/день; проценты по кредитам списываются с денег каждый день
  (нет денег — капитализируются в долг); банкротство при money < −150000.
- Подписчики: пассивный рост с потолком `SUBS_CAP = 2 000 000`:
  `subsPerDay() = (subs*0.03 + 100) * (1 - subs/SUBS_CAP) * charisma`.
  Все прибавки аудитории — через `addSubs()`, чтобы не пробить потолок.
- Видео (`drawModalVideo` + `makeVideo()`): цена `videoPrice()` = 100к при ≤50к подписчиков,
  500к при ≥1 млн, шаги по 50к; максимум 4 за 30 дней (`S.videoMonth` / `S.videoCount`),
  подписчиков не прибавляет, энергия не тратится.
- Сохранение: `localStorage['iden_save_v1']`, автосейв в `dayTick()`, `newGame()` чистит сейв.
- Уникальность бизнесов: `isTypeOpen(id)` — один экземпляр каждого вида одновременно;
  проверять в `openBiz()` и в каталоге (кнопка «УЖЕ ОТКРЫТ»).
- Настройки: `localStorage['iden_settings_v1']` → `SETTINGS.music` / `SETTINGS.sfx`
  (независимые переключатели в меню и левой панели). Музыка — нативный `Audio`
  (`resources/music_loop.wav`, `loop=true`), стартует с первого клика (политика Chrome),
  пауза при скрытой вкладке. `sfx()` уважает `SETTINGS.sfx`.
- Свойства из `userData` доступны напрямую на объекте (`obj.health`), а не через `obj.userData.health`. Имена не должны совпадать с базовыми (`x`, `type` и т.п.).
- Спрайты при необходимости перерисовывать в `tools/gen_assets.js` и перезапускать генератор.

## Репозиторий и деплой
- GitHub: https://github.com/kennygomel/iden-game (public).
- Pages: `build_type: legacy`, ветка `main`, корень `/` → https://kennygomel.github.io/iden-game/.
  Пересобирается автоматически при пуше в `main`.
- Пуш: в локальном git config задан `core.sshCommand = C:/Windows/System32/OpenSSH/ssh.exe`,
  потому что встроенный ssh Git for Windows не читает путь профиля с кириллицей.
  Без этого — `git -c core.sshCommand=... push`.

## Тест
1. `node tools/serve.js` (порт 8080).
2. Открыть в браузере, консоль должна быть пустой.
3. Быстрая проверка логики через console/`evaluate`:
   `newGame(); S.money=2e6; openBiz(BIZ_TYPES[10]); dayTick();` и т.п.
