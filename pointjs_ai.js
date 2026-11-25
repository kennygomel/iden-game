PointJS Game Engine - Complete Documentation for AI
Весь представленный код в файле это javascript и обертка над js командами движка PontJS но внутри комад чистый JS
Если ты видишь этот файл подразумевается что пользователь хочет чтобы ты сделал игру на движке PointJS и его синтаксисе разобраном в этом файле
Не выдумывай код и синтаксис, которого нет в этом файле. Этот файл содержит полный синтаксис и команды движка.
ВНИМАНИЕ: КРИТИЧЕСКИ ВАЖНЫЕ ПРАВИЛА
ПРАВИЛО №1: Доступ к пользовательским свойствам
// При создании объекта: можно задать пользоватальские свойства userData (это надо чтобы бардак с переменным не разводить). Например жизни относятся к игроку вот пусть в нем и хранятся
var obj = game.newTextObject({
  x: 0,
  y: 0,
  text : "Hello World", 
  size : 30,
  color: "black",
  userData: {
    select: false,
    name: 'test',
    health: 100
  }
});

// ПРАВИЛЬНО - доступ напрямую:
obj.select = true;
obj.name = 'newName';
obj.health = 200;

//также напрямую как и к базовым свойствам
obj.x = 200;
obj.text;

Важно - имена пользовательских свойств не должны совпадать с именами основных 
Ниже показан пример как не верно делать, движок не поймет к какому x мы обрашемся в свойствах или основному
var obj = game.newTextObject({
  x: 0, //одинаковое
  y: 0,
  text : "Hello World", 
  size : 30,
  color: "black",
  userData: {
    x: 13, //одинаковое так нельзя уже есть x
    type: 2 // также нельзя использвать слово type оно уже зарезервировано в движке
  }
});

//также нельзя в свойсствах обтектов и пользователстких использовать зарезервированные слова в javascript и также важно слово type нелья занести в пользоватеское свойство так как оно зарезервировано в обьекте. Увидишь это всегда поправляй

// НЕПРАВИЛЬНО - НЕ используйте userData:
// obj.userData.select = true;  // ОШИБКА!
// obj.userData.name = 'test';   // ОШИБКА!
ПРАВИЛО №2: Все объекты имеют одинаковые базовые методы
.draw() - отрисовка
.setPosition(point(x, y)) - установка позиции
.getPosition() - получение позиции
.getStaticBox() - получение коллизионного прямоугольника
.isInCamera() - проверка видимости в камере

ОГЛАВЛЕНИЕ
Инициализация движка
Создание объектов
Система ввода
Отрисовка (Brush)
Игровые циклы
Камера
Аудио
Физика и коллизии
Анимации
UI и кнопки
Таймеры
Работа с ресурсами
Паттерны и лучшие практики
ИНИЦИАЛИЗАЦИЯ ДВИЖКА
Базовая инициализация

// Создание движка с размерами холста
var pjs = new PointJS(ширина, высота, {
  backgroundColor: '#000000'  // цвет фона всей игры но потом индивиудально мы можем заливать игровые циклы командой game.fill ниже в коде будет пример
});

// Получение основных систем
var game = pjs.game;           // основная игровая система
var point = pjs.vector.point;  // функция создания точки
var vector = pjs.vector;       // векторные операции
var brush = pjs.brush;         // рисование
var tiles = pjs.tiles;         // работа с тайлами и анимациями
var OOP = pjs.OOP;             // вспомогательные OOP функции
var random = pjs.math.random;  // случайные числа
var levels = pjs.levels;       // система уровней
var camera = pjs.camera;       // камера
var audio = pjs.audio;         // аудио система
var system = pjs.system;       // системные функции

// Инициализация контроллеров ввода
// Если что-то мы не используем инициализировать это не надо
var key = pjs.keyControl.initControl();
var mouse = pjs.mouseControl.initControl();
var touch = pjs.touchControl.initControl();

// Настройка отображения
pjs.system.initFullPage();     // полноэкранный режим
pjs.system.setTitle("Игра");   // заголовок окна очень редко
pjs.system.initFPSCheck();     // включить FPS счетчик бывает редко надо

// Получение размеров окна
var WH = game.getWH();  // возвращает {w: ширина, h: высота} тоесть point(x, y)
Модульная система (для больших проектов)

// Разделение кода на модули можно часть кода вынести в отдельынй файл
PointJS.Module = function (pjs) {
  'use strict'
  
  // Локальные переменные модуля
  var localVar = 10;
  
  // Экспорт функций
  pjs.myFunction = function () {
    // код функции
  };
};

// Загрузка модуля так мы можем подгрузить этот файл
modules.importSync("scripts/module.js");

//а после этого вот так обрашаться к методам из файла
pjs.myFunction();

СОЗДАНИЕ ОБЪЕКТОВ
Типы объектов и их параметры
1. Текстовые объекты (TextObject)

var textObj = game.newTextObject({
  x: 100,                      // позиция X
  y: 100,                      // позиция Y
  text: "Текст",               // отображаемый текст
  size: 30,                    // размер шрифта
  color: "#ffffff",            // цвет текста
  fillColor: "#eda031",        // цвет заливки фона
  radius: 10,                  // скругление углов
  strokeWidth: 2,              // толщина обводки
  strokeColor: "#000000",      // цвет обводки
  padding: 7,                  // внутренний отступ
  font: "Arial",               // шрифт
  alpha: 1,                    // прозрачность (0-1)
  angle: 0,                    // угол поворота
  // ПОЛЬЗОВАТЕЛЬСКИЕ СВОЙСТВА - храним здесь а не черех переменные чтобы не захламлять, но доступ напрямую!
  userData: {
    name: 'player',
    health: 100,
    speed: 5,
    isAlive: true
  }
});

// Установка размеров (часто требуется)
textObj.h = 41;    // высота
textObj.w = 100;   // ширина

// Доступ к свойствам:
textObj.health = 90;      // ПРАВИЛЬНО
textObj.speed = 3;        // ПРАВИЛЬНО

// textObj.userData.health = 90;  // НЕПРАВИЛЬНО!
2. Графические объекты (ImageObject)

var imgObj = game.newImageObject({
  file: "resources/image.png",  // путь к изображению
  x: 0,
  y: 0,
  w: 100,                       // ширина
  h: 100,                       // высота
  alpha: 1,
  angle: 0,
  userData: {
    type: 'item',
    value: 50
  }
});

// Пример из RPG игры:
var item = game.newImageObject({
  file: "resources/loot/alpha/h1.webp",
  x: 0, y: 0, w: 40, h: 40,
  userData: {
    name: 'loot',
    name2: 'life1',                    // тип предмета
    file2: 'resources/loot/background/hback1.webp',  // иконка
    file3: 'resources/loot/alpha/h1.webp',           // полное изображение
    title1: 'Зелье здоровья',          // название
    title2: 'Восстанавливает 20 HP',   // описание
    hp: 20,                            // восстанавливаемое HP
    count: 1,                          // количество
    stek: true,                        // можно складывать
    dragF12: true                      // можно перетаскивать в F12
  }
});
3. Анимационные объекты (AnimationObject)

// Сначала создаем анимацию из спрайтшита
var spriteSheet = tiles.newImage("resources/player.png");
var animation = spriteSheet.getAnimation(x, y, width, height, frameCount);

// Затем создаем анимационный объект
var animObj = game.newAnimationObject({
  animation: animation,
  x: 100,
  y: 100,
  w: 128,
  h: 128,
  delay: 5,                    // скорость анимации (меньше = быстрее)
  startFrame: 0,               // начальный кадр
  alpha: 1,
  userData: {
    name: 'player',
    frame: 0,
    state: 'idle'
  }
});

//но на самом деле анимационный обект вызываем сразу так - не надо лишних пемеменных  spriteSheet и animation и прочего
game.newAnimationObject({
animation: tiles.newImage("resources/animationCharacters/peasant/peasant_Run_514_290_10_3.png").getAnimation(0, 0, 514, 290, 10),
  x: 0,
  y: 0,
  w: 514,
  h: 290,
  delay: 3,
})

// Управление анимацией:
animObj.setAnimation(newAnimation);  // сменить анимацию
animObj.setFrame(5);                 // установить конкретный кадр
var currentFrame = animObj.getFrame(); // получить текущий кадр
animObj.drawToFrame(10);             // проиграть до кадра
4. Прямоугольные объекты (RectObject)

var rect = game.newRectObject({
  x: 50,
  y: 50,
  w: 100,
  h: 100,
  fillColor: "#ff0000",        // цвет заливки
  strokeColor: "#000000",      // цвет обводки
  strokeWidth: 2,              // толщина обводки
  alpha: 0.8,
  userData: {
    isWall: true,
    canPass: false
  }
});
5. Скругленные прямоугольники (RoundRectObject)

var roundRect = game.newRoundRectObject({
  x: 50,
  y: 50,
  w: 200,
  h: 100,
  radius: 10,                  // радиус скругления
  fillColor: "#212838",
  strokeColor: "#356260",
  strokeWidth: 1,
  alpha: 1,
  userData: {
    type: 'button',
    clicked: false
  }
});
6. Mesh (групповой слой чтобы например передвигать все  обьекты)

var mesh = game.newMesh({
  x: 0,                        // позиция всей группы
  y: 0,
  angle: 0,                    // угол поворота всей группы
  add: [obj1, obj2, obj3]      // массив объектов
});

// Методы mesh:
mesh.setPosition(point(x, y));
mesh.setPositionS(point(WH.w/2, WH.h/2));  // экранные координаты
mesh.draw();                                 // отрисовка всех объектов
Работа с позициями и трансформациями

// Создание точки
var pos = point(100, 200);

// Установка позиции
obj.setPosition(pos);                 // по левому верхнему углу
obj.setPositionC(pos);                // по центру объекта
obj.setPositionS(pos);                // локальные координаты

// Получение позиции
var topLeft = obj.getPosition();
var center = obj.getPositionC(); // относительно центра

// Движение к точке
obj.moveToC(targetPoint, speed);

// Трансформации
obj.setFlip(1, 0);        // отражение по горизонтали (1 - да, 0 - нет)
obj.setCenter(point(-10, 10));  // смещение центра для статикбокса и вращения слоя надо
obj.scale = 1.5;          // масштаб
obj.angle = 45;           // угол поворота (градусы)
obj.alpha = 0.5;          // прозрачность

// Изменение прозрачности с анимацией
obj.transparent(0.05);    // увеличить прозрачность
obj.transparent(-0.05);   // уменьшить прозрачность

// Плавное движение с ограничением
obj.motionC(targetPoint, size(dx, dy), speed);
СИСТЕМА ВВОДА
Клавиатура (KeyControl)

// Инициализация
var key = pjs.keyControl.initControl();

// Состояния клавиш:
// isPress - нажата в этом кадре (едичичное нажатие)
// isDown - удерживается
// isUp - отпущена в этом кадре

// Примеры:
if (key.isPress("SPACE")) {
  // Пробел только что нажат
}

if (key.isDown("D")) {
  // Клавиша D удерживается
  player.x += 5;
}

if (key.isUp("ENTER")) {
  // Enter только что отпущен
}

// Комбинации клавиш:
if (key.isDown("W") && key.isDown("D")) {
  player.x += 5;
  player.y -= 5;
}

// Текстовый ввод:
key.setInputMode(true);        // включить режим ввода текста
var char = key.getInputChar(); // получить введенный символ
var keyCode = key.getInputKey(); // получить код клавиши
var isInputMode = key.isInputMode(); // проверка режима
Мышь (MouseControl)

var mouse = pjs.mouseControl.initControl();

// Позиция мыши
var mousePos = mouse.getPosition();      // точка {x, y} point(x, y)
var mouseSpeed = mouse.getSpeed();       // скорость движения {x, y}

// Состояния кнопок:
if (mouse.isPress("LEFT")) {}    // клик начался
if (mouse.isDown("LEFT")) {}     // кнопка зажата
if (mouse.isUp("LEFT")) {}       // клик закончился
if (mouse.isPress("RIGHT")) {}   // правая кнопка
if (mouse.isPress("MIDDLE")) {}  // средняя кнопка

// Колёсико:
if (mouse.isWheel('UP')) {}      // прокрутка вверх
if (mouse.isWheel('DOWN')) {}    // прокрутка вниз

// Взаимодействие с объектами:
if (mouse.isInObject(obj)) {
  // курсор над объектом
}

if (mouse.isPeekObject(obj)) {
  // клик по объекту
}

// Взаимодействие со статическими областями:
var staticBox = obj.getStaticBox();
if (mouse.isInStatic(staticBox)) {
  // курсор в области
}

if (mouse.isPeekStatic("LEFT", obj.getStaticBox())) {
  // клик в области
}

//или сразу клик по объекту
if (mouse.isPeekObject("LEFT", obj)) {

}
// Курсор:
mouse.setStandardCursor("pointer");  // "default", "pointer", "grab", "crosshair", "text"
Сенсорный ввод (TouchControl)

var touch = pjs.touchControl.initControl();

// Для мобильных устройств:
if (touch.isPeekObject(obj)) {
  // объект был тапнут
}

if (touch.isDown()) {
  // палец на экране удерживается
  var touchPos = touch.getPosition();
}

if (touch.isUp()) {
  // палец убран
}

if (touch.isInObject(obj)) {
  // ткнули пальцем в обьект единичное нажатие
}
ОТРИСОВКА (BRUSH)
Текст

// Мировые координаты
brush.drawText({
  text: "Hello World",
  x: 100,
  y: 100,
  size: 20,
  color: "#ffffff",
  alpha: 1,
  font: "Arial",
  strokeWidth: 1,          // толщина обводки текста
  strokeColor: "#000000"   // цвет обводки
});

// Экранные координаты (для UI)
brush.drawTextS({
  text: "UI Element",
  x: WH.w/2,              // центр экрана по X
  y: 10,                  // 10px от верха
  size: 24,
  color: "#ff0000",
  alpha: 0.8
});

// Несколько строк многострочный текст
brush.drawTextLinesS({
  lines: ["Строка 1", "Строка 2", "Строка 3"],
  x: 50,
  y: 100,
  size: 16,
  color: "#acacac",
  lineHeight: 1.4,        // межстрочный интервал
  strokeWidth: 0.5
});

// Получение ширины текста: важно чтобы size: 20, и font: "Arial" соотвестовали тексту чью ширину мы ищем!! так как текст может быть в одном месте а потом мы ищем его ширину в другом месте. Если шрифт забыли указать то его надо и в коде и в фукнции определения ширины указать обязательно
var text = game.newTextObject({
  x: 0,
  y: 0,
  text : "Hello World", 
  size : 30,
  color: "black",
  font: 'Arial'
});

//поиск ширины текста
OOP.getTextWidth({
  text: text.text,
  size: text.size,
  font: text.font
});

//поиск половины ширины текста для выравнивания на сцене по ширине экрана 
game.newTextObject({
  x: WH.w/2 - OOP.getTextWidth({text: "Мурзик",size: 30, font: 'Arial'})/2,
  y: 0,
  text : "Мурзик", 
  size : 30,
  color: "black",
  font: 'Arial'
});


Геометрические фигуры

// Прямоугольник
brush.drawRect({
  x: 50,
  y: 50,
  w: 200,
  h: 100,
  fillColor: "#ff0000",
  strokeColor: "#000000",
  strokeWidth: 2,
  alpha: 0.8,
  radius: 5               // скругление углов (опционально)
});

// Скругленный прямоугольник
brush.drawRoundRect({
  x: 100,
  y: 100,
  w: 150,
  h: 75,
  radius: 10,
  fillColor: "#3498db",
  strokeColor: "#2980b9",
  strokeWidth: 1
});

// Круг
brush.drawCircle({
  x: 200,
  y: 200,
  radius: 50,
  fillColor: "#2ecc71",
  strokeColor: "#27ae60",
  strokeWidth: 3
});

// Линия
brush.drawLine({
  x1: 0,
  y1: 0,
  x2: 100,
  y2: 100,
  strokeColor: "#ffffff",
  strokeWidth: 2,
  alpha: 0.5
});

//Изображениe
brush.drawImage({
  file: "resources/image.png",
  x: 0,
  y: 0,
  w: 100,
  h: 100,
  alpha: 1,
  angle: 0
});

// Заливка экрана
game.fill("#000000");          // залить весь экран цветом редко но надо бывает так как цвет сцены уже задан при старе проекта var pjs = new PointJS(640, 480, {backgroundColor: '#000000'});
game.fill("#1a1a2e", 0.5);     // с прозрачностью

ИГРОВЫЕ ЦИКЛЫ Создание и управление циклами

// Создание игрового цикла
game.newLoop('mainLoop', function () {
  // Этот код выполняется каждый кадр
  
  // 2. Обработка ввода
  if (key.isDown("D")) {
    player.x += 5;
  }
  
  // 3. Обновление игровой логики или еще чего то
  updateGame();
  
  // 4. Отрисовка игрока
   player.draw();
});

// Переключение между циклами
game.setLoop('mainLoop');      // установить активный цикл
game.setLoop('menuLoop');

// Запуск конкретного цикла (без переключения)
game.startLoop('mainLoop');

// Запуск игры
game.start();

// Остановка игры
game.stop();

// Пример многоцикловой архитектуры:
game.newLoop('menu', function () {
  // меню игры
});

game.newLoop('game', function () {
  // игровой процесс
});

game.newLoop('pause', function () {
  // пауза
});

// Переключение:
game.setLoop('menu');  // показать меню

КАМЕРА Основные функции камеры

// Следование за объектом
camera.follow(player, 10);  // объект, плавность (больше = плавнее)

// Установка позиции
camera.setPosition(point(500, 300));
camera.setPositionC(point(centerX, centerY));
camera.setPositionC(player.getPositionC()); //теперь камера стоит на середие игрока тоесть персонаж в центре

// Получение позиции камеры
var camPos = camera.getPosition();

// Проверка видимости объекта попадает ли в камеру
if (obj.isInCamera()) {
  // объект в зоне видимости камеры тогда можно рисовать
  obj.draw();
}

АУДИО Работа со звуком

// Создание аудио объекта
var sound = audio.newAudio("resources/sound.mp3", volume);

// Управление воспроизведением
sound.play();           // воспроизвести
sound.replay();         // перезапустить
sound.pause();          // пауза
sound.stop();           // остановить

// Управление громкостью
sound.setVolume(0.5);   // от 0 до 1
var currentVol = sound.getVolume();

// Примеры из игр:
var hitSound = audio.newAudio("resources/hit.mp3", 0.5);
var music = audio.newAudio("resources/music.mp3", 0.3);
music.play();

// Автопауза при скрытии вкладки
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    music.pause();
  } else {
    music.play();
  }
});

ФИЗИКА И КОЛЛИЗИИ Система коллизий

// Проверка столкновения между объектами
if (obj1.isStaticIntersect(obj2.getStaticBox())) {
  // объекты пересекаются
}

// Проверка столкновения с расширенным прямоугольником (для движения)
if (wall.isStaticIntersect(player.getStaticBoxD(0, 0, speed, 0))) {
  // столкновение при движении вправо
  player.x -= speed;
}

// Методы получения прямоугольников столкновений для разных направлений он выдывагается на скорость равное скорости движение игрока:
var box = obj.getStaticBox();        // обычный прямоугольник
var boxRight = obj.getStaticBoxD(0, 0, speed, 0);     // для движения вправо
var boxLeft = obj.getStaticBoxA(-speed, 0, speed, 0); // для движения влево
var boxUp = obj.getStaticBoxW(0, -speed, 0, speed);   // для движения вверх
var boxDown = obj.getStaticBoxS(0, 0, 0, speed);      // для движения вниз

// Расстояние между объектами
if (obj1.getDistanceC(obj2.getPositionC()) < 100) {
  // объекты близко
}

// Проверка точки внутри объекта
if (obj.getStaticBox().isPointInside(point(x, y))) {
  // точка внутри объекта
}
Пример обработки столкновений (из RPG)

function checkCollisions() {
  for (var i in walls) {
    var wall = walls[i];
    
    // Столкновение при движении вправо
    if (wall.isStaticIntersect(player.getStaticBoxD(0, 0, player.speed, 0))) {
      player.x -= player.speed;
    }
    
    // Столкновение при движении влево
    if (wall.isStaticIntersect(player.getStaticBoxA(-player.speed, 0, player.speed, 0))) {
      player.x += player.speed;
    }
    
    // Столкновение при движении вверх
    if (wall.isStaticIntersect(player.getStaticBoxW(0, -player.speed, 0, player.speed))) {
      player.y += player.speed;
    }
    
    // Столкновение при движении вниз
    if (wall.isStaticIntersect(player.getStaticBoxS(0, 0, 0, player.speed))) {
      player.y -= player.speed;
    }
  }
}

АНИМАЦИИ Спрайты и анимации

// Загрузка спрайтшита
var spriteSheet = tiles.newImage("resources/character.png");

// Создание анимации из спрайтшита
// getAnimation(x, y, width, height, frameCount)
var idleAnim = spriteSheet.getAnimation(0, 0, 128, 128, 5);
var walkAnim = spriteSheet.getAnimation(0, 128, 128, 128, 8);
var attackAnim = spriteSheet.getAnimation(0, 256, 128, 128, 6);

// Смена анимации
character.setAnimation(idleAnim);

// Управление кадрами
character.setFrame(0);                // установить кадр
var frame = character.getFrame();     // получить текущий кадр
character.drawToFrame(10);            // проиграть до кадра 10 и там остановить застопорить

// Пример системы состояний анимации
function updateAnimation() {
  if (character.state === 'idle') {
    if (character.anim !== idleAnim) {
      character.setAnimation(idleAnim);
    }
  } else if (character.state === 'walking') {
    if (character.anim !== walkAnim) {
      character.setAnimation(walkAnim);
    }
  } else if (character.state === 'attacking') {
    if (character.anim !== attackAnim) {
      character.setAnimation(attackAnim);
    }
  }
}

UI И КНОПКИ Создание кнопок

// Создание кнопки с помощью OOP.createButtonText
//эти кнопки позволяют повестить их выше всей игры и не отрисоывать в игровом цикле
var button = OOP.createButtonText(
  'Начать игру',      // текст кнопки
  x, y,              // позиция
  width, height,     // размеры
  function () {      // callback при клике
    console.log('Кнопка нажата!');
    game.setLoop('game');
  },
  function () {      // callback при наведении (опционально)
    button.fillColor = '#ff0000';
  },
  25,                // размер шрифта
  '#ffffff',         // цвет текста
  '#3498db',         // цвет заливки
  '#2980b9',         // цвет обводки
  2,                 // толщина обводки
  10,                // радиус скругления
  1,                 // прозрачность
  1,                 // толщина обводки текста
  0.3                // прозрачность когда отключена
);

//тоесть button.draw() в игровом цикле писать нельзя это ошбика. Они сами рисуюется

// Свойства кнопки:
button.alpha = 0.8;          // изменить прозрачность
button.fillColor = '#ff0000'; // изменить цвет
button.setText('Новый текст'); // изменить текст
Создание инвентаря (пример из RPG)

// Создание ячейки инвентаря
var inventoryCell = game.newImageObject({
  file: "resources/GUI/box.webp",
  x: 0,
  y: 0,
  w: 46,
  h: 46,
  userData: {
    name: 'cell1',
    count: 0,
    name2: undefined,  // тип предмета
    file2: '',         // иконка
    file3: '',         // полное изображение
    title1: '',        // название
    title2: '',        // описание
    stek: undefined,   // можно ли складывать
    dragF12: undefined // можно ли в F12
  }
});

// Доступ к свойствам:
inventoryCell.name2 = 'life1';      // ПРАВИЛЬНО
inventoryCell.count = 3;            // ПРАВИЛЬНО
// inventoryCell.userData.name2 = 'life1';  // НЕПРАВИЛЬНО!
Система F12 (быстрый доступ)

// Создание панели F12 (пример из RPG)
var F12 = [];
for (var i = 0; i < 12; i++) {
  F12.push(game.newImageObject({
    file: "resources/GUI/box.webp",
    x: i * 54,
    y: 0,
    w: 46,
    h: 46,
    userData: {
      name: i + 1,
      count: 0,
      name2: undefined,
      // ... другие свойства
    }
  }));
}

// Mesh для группировки
var meshF12 = game.newMesh({
  x: 0, y: 0, add: F12
});
ТАЙМЕРЫ
Создание и использование таймеров

// Создание таймера
var timer = OOP.newTimer(interval, function () {
  // Код выполняется каждые interval миллисекунд
  console.log('Таймер сработал!');
});

// Управление таймером
timer.restart(1000);      // перезапустить с новым интервалом
// Таймер автоматически выполняется пока активен

// Примеры использования:

// Таймер для восстановления HP
var healTimer = OOP.newTimer(1000, function () {
  if (player.health < player.maxHealth) {
    player.health += 1;
  }
});

// Таймер для спавна врагов
var spawnTimer = OOP.newTimer(5000, function () {
  spawnEnemy();
});

// Таймер для анимации
var blinkTimer = OOP.newTimer(200, function () {
  player.alpha = player.alpha === 1 ? 0.5 : 1;
});
РАБОТА С РЕСУРСАМИ
Загрузка и прогресс

// Проверка прогресса загрузки
var progress = pjs.resources.getProgress(); // от 0 до 100

// Пример экрана загрузки
game.newLoop('loading', function () {
  
  if (pjs.resources.getProgress() >= 100) {
    game.setLoop('menu');
  } else {
    brush.drawText({
      text: "Загрузка: " + progress + "%",
      x: WH.w/2,
      y: WH.h/2,
      size: 24,
      color: "#ffffff"
    });
  }
});

Загрузка уровней

// Загрузка карты уровня игры из JSON файла
OOP.readJSON('level1.pjs', function (data) {
  var level = levels.newLevelFromJSON(data);
  var levelObjects = level.getObjects();
  
  for (var i in levelObjects) {
    var obj = levelObjects[i];
    
    // Обработка объектов уровня
    switch (obj.name) {
      case "player":
        player.setPosition(obj.getPositionC());
        break;
      case "wall":
        walls.push(obj);
        break;
      case "enemy":
        enemies.push(obj);
        break;
    }
  }
}, true);  // true = синхронная загрузка

ПАТТЕРНЫ И ЛУЧШИЕ ПРАКТИКИ
1. Организация кода

// Рекомендуемая структура:
// 1. Инициализация движка
// 2. Объявление констант
// 3. Объявление переменных
// 4. Функции инициализации
// 5. Функции обновления
// 6. Функции отрисовки
// 7. Обработка ввода
// 8. Игровой цикл
// 9. Запуск игры
2. Работа с массивами объектов

// Создание массива объектов
var enemies = [];

// Добавление
enemies.push(newEnemy);

// Удаление (безопасное)
for (var i in enemies) {
  if (enemies[i].health <= 0) {
    delete enemies[i];  // помечаем для удаления
  }
}

// Очистка удаленных
enemies = enemies.filter(e => e !== undefined);

// Итерация
for (var i in enemies) {
  if (enemies[i]) {
    enemies[i].update();
    enemies[i].draw();
  }
}

4. Оптимизация рендеринга

// Проверка видимост попадания обхекта в рамку камеры перед отрисовкой тоесть не рисуем то что не видим на экране
if (object.isInCamera()) {
  // Проверка расстояния
  if (player.getDistanceC(object.getPositionC()) < 500) {
    object.draw();
  }
}

// Использование мешей для группировки
var environmentMesh = game.newMesh({
  x: 0, y: 0, add: [tree1, tree2, rock1, rock2]
});
environmentMesh.draw();

//или
var mass = [1, 'Маша', '33', 45, false]
var environmentMesh = game.newMesh({
  x: 0, 
  y: 0, 
  add: mass
});

// Отсечение невидимых областей
for (var i in objects) {
  var obj = objects[i];
  if (obj.x + obj.w < camera.x || 
      obj.x > camera.x + WH.w ||
      obj.y + obj.h < camera.y || 
      obj.y > camera.y + WH.h) {
    continue; // пропускаем объект
  }
  obj.draw();
}
5. Отладка и производительность

// Отображение FPS
brush.drawText({
  text: "FPS: " + system.getFPS(),
  x: WH.w - 100,
  y: 20,
  size: 16,
  color: "#00ff00"
});

// Отладка координат
brush.drawText({
  text: "Player: " + player.x + ", " + player.y,
  x: 10,
  y: 10,
  size: 14,
  color: "#ffff00"
});

// Счетчики объектов
brush.drawText({
  text: "Enemies: " + enemies.length,
  x: 10,
  y: 30,
  size: 14,
  color: "#ff00ff"
});
6. Сохранение данных
// Сохранение в localStorage
localStorage.setItem('highscore', score);
localStorage.setItem('player_name', playerName);
localStorage.setItem('inventory', JSON.stringify(inventory));

// Загрузка
var highscore = localStorage.getItem('highscore') || 0;
var playerName = localStorage.getItem('player_name') || 'Player';
var inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Очистка
localStorage.removeItem('highscore');
localStorage.clear();
ЧАСТЫЕ ОШИБКИ И РЕШЕНИЯ
Ошибка 1: Неправильный доступ к userData

// НЕПРАВИЛЬНО:
obj.userData.health = 100;

// ПРАВИЛЬНО:
obj.health = 100;
Ошибка 2: Забыли вызвать .draw() в игровом цикле
// Объект не отображается если не вызвать:
obj.draw();  // ВАЖНО!
Ошибка 3: Не обновляется позиция
// Используйте правильные методы:
obj.setPosition(point(x, y));      // по углу
obj.setPositionC(point(x, y));     // по центру
obj.setPositionS(point(x, y));     // экранные координаты

Ключевые моменты для запоминания:
userData свойства доступны напрямую на объекте, не через obj.userData.*
Все объекты имеют базовые методы: .draw(), .setPosition(), .getStaticBox()
Используйте правильные системы ввода: key, mouse, touch
Организуйте код в игровые циклы с помощью game.newLoop()
Для UI используйте brush.draw* функции
Для анимаций используйте AnimationObject с спрайтшитами
Оптимизируйте рендеринг проверками isInCamera() и расстояниями
Используйте таймеры для периодических действий
При недостатке инфомрации по движжку ты можешь найти все на фоициальном сайте проекта https://pointjs.ru/
А также на странице архивных статей на тему вопрос-ответов https://pointjs.ru/pages/blogArhive.html
А также на страние API движка https://pointjs.ru/pages/pointjsApi/index.html
Сохраняйте прогресс в localStorage но не чаше 1 раза в секунду желательно реже!
Тестируйте на мобильных с помощью touchControl. Не забудьте включить сервер в PointJS IDE для транслирования игры на мобильный телефон через локальный IP адрес компа

Частые игрвые механики
//генератор карты уровня игры
var wall = [];
var player;

var map = {
  width: 40,
  height: 40,
  level: [
    '                         s',
    '               s  s      1 s',
    '                           1  s',
    '  p  s s             s        1',
    '                              1',
    '          111111111  1111111111',
    ' 1111111111 s    s11  111s1',
    '     s  s         111 111s1',
    '   1111111111111         s1',
    '               111111111111',
    '',
  ]
};

pjs.OOP.forArr(map.level, function (string, y) {
  pjs.OOP.forArr(string, function (el, x) {

    if (el == '1') {
      wall.push(game.newRectObject({
        x: x * map.width,
        y: y * map.height,
        w: map.width-1,
        h: map.height-1,
        fillColor: '#272727'
      }))
    }

    if (el == 's') {

    }

    if (el == 'p') {
      player = game.newCircleObject({
        x: x * map.width,
        y: y * map.height,
        radius: 14,
        fillColor: "#a25520",
      })
    }

  })
})

//сборка картинок в однйо изобаржение
var iter = 0, fon = [], numb = [];
for (var x = 0; x < 3; x++) {
  for (var y = 0; y < 3; y++) {
    iter++;
    fon.push(
      game.newImageObject({
        file: "resources/" + iter + ".png",
        x: 50 + 50*y,
        y: 50 + 50*x,
        w: 50,
        h: 50
      })
    )

    numb.push(
      game.newTextObject({
        text: iter,
        x: 50 + 50*y+20,
        y: 50 + 50*x+20,
        size: 20,
        color: "red"
      })
    )

  }};


for (var i in fon) {
  fon[i].draw();
  numb[i].draw();
}

//Генератор карты уровня игр для Арканоид
var width = 50, height = 50, fon = [];
for (var x = 0; x < 8; x++) {
  for (var y = 0; y < 6; y++) {
    fon.push(
      game.newRectObject({
        x: x * width,
        y: y * height,
        w: width-4,
        h: height-4,
        fillColor: "black",
      })
    )
  }}

for (var i in fon) {
  fon[i].draw();
}

//зум камеры
  //var mouseZoom = 0;
  
  if (mouse.isWheel('UP')) {
    if (mouseZoom <= 0) {
      mouseZoom += 0.01;
      camera.scaleC(point(1.02, 1.02));
    }
  }
  if (mouse.isWheel('DOWN')) {
    if (mouseZoom > -0.90) {
      mouseZoom -= 0.01;
      camera.scaleC(point(0.98, 0.98));
    }
  }

  //Создание парели F12
  var s = 25, x, F12 = []; {
  for (x = 0; x < 8; x++) {
    F12.push(
      game.newRectObject({
        x: x*s + (x*20),
        y: 0,
        w: 25,
        h: 25,
        alpha: 0.4,
        fillColor: "white",
        strokeColor: "black",
        strokeWidth: 1
      })
    )
  }
}

var mesh = game.newMesh({
  x: 0,
  y: 0,
  add: F12
 }) 

  // смена спрайта при движении
  if (key.isDown("D")) {
    player.anim.image = tiles.newImage("resources/img.png");
  } else if (key.isDown("A")) {
    player.anim.image = tiles.newImage("resources/img.png");
    player.setFlip(1, 0)
  }

  //пример рисования полигона мышкой на сцене

  var obj = game.newPolygonObject({
  x: 0,
  y: 0,
  points : [point(50, 0), point(120, -20), point(200, 40), point(130, 120), point(40, 90)],
  fillColor : "red",
  //pointColor : "#343DE4",
});

var LOG = '', MIN = [], SORT, MINPOINT, MINPOINT2, FLAGMOVE = false;
var drawMouseDynamicBox = function (obj, keyLog, keyAddPoint, keyAddPointPlace, keyMouseDrag, keyDelPoint, keyReset) {

  // вывод точек в консоль
  if (key.isPress(keyLog)) {
    LOG = '';
    LOG += ' (' + obj.points.length + '):  ';
    if (obj.points.length > 3) {
      for (var i = 0; i < obj.points.length; i++) {
        if (i == 0) LOG += 'points : [';
        LOG += ' point(' + obj.points[i].x + ', ' + obj.points[i].y + '),'
        if (i == obj.points.length-1) {
          LOG = LOG.slice(0, -1);
          LOG += '],';
        }
      }
      alert("Набор точек полигона" + LOG);
    }
  }

  // добавляем первую точку и дальнейшие
  if (mouse.isPress(keyAddPoint)) {
    if (obj.points.length == 0 && key.isDown('Q')) {
      obj.addPoint(point(mouse.getPosition().x - obj.x, mouse.getPosition().y - obj.y));
    } // точка в нужное место
    else if (key.isDown(keyAddPointPlace) && obj.points.length > 3) {
      if (MINPOINT > MINPOINT2) obj.addPointPlace(point(mouse.getPosition().x - obj.x, mouse.getPosition().y - obj.y), MINPOINT);
      else if (MINPOINT < MINPOINT2) obj.addPointPlace(point(mouse.getPosition().x - obj.x, mouse.getPosition().y - obj.y), MINPOINT2);
    } // все остальные точки
    else if (obj.points.length > 0) {
      obj.addPoint(point(mouse.getPosition().x - obj.x, mouse.getPosition().y - obj.y));
    }

  }

  // Определяем ближнюю точку
  if (obj.points.length > 3 && FLAGMOVE == false) {
    MIN.length = 0;
    for (var i = 0; i < obj.points.length; i++) {
      MIN.push(pjs.vector.getDistance(point(mouse.getPosition().x - obj.x, mouse.getPosition().y- obj.y), obj.points[i]));
    }

    SORT = MIN.slice().sort(function(a, b) {
      return a - b;
    });

    MINPOINT = MIN.indexOf(SORT[0]); // самая ближняя точка
    MINPOINT2 = MIN.indexOf(SORT[1]); // вторая ближняя точка

    //кружок для ближней точки
    pjs.brush.drawCircle({
      x: obj.points[MINPOINT].x - 4 + obj.x,
      y: obj.points[MINPOINT].y - 4 + obj.y,
      radius: 4,
      fillColor: "black"
    });

    //кружок для ближней точки 2
    pjs.brush.drawCircle({
      x: obj.points[MINPOINT2].x - 4 + obj.x,
      y: obj.points[MINPOINT2].y - 4 + obj.y,
      radius: 4,
      fillColor: "blue"
    });

  }

  //Имена точек
  for (var i in obj.points) {
    pjs.brush.drawText({
    text: i + " (" + obj.points[i].x + ", " + obj.points[i].y + ")",
    x: obj.points[i].x - 20 + obj.x,
    y: obj.points[i].y + obj.y,
    size: 14,
    color: "black",
    alpha: 1
  })
}


  // перетаскиваем ближнюю точку
  if (obj.points.length > 3) {
    if (mouse.isDown(keyMouseDrag)) {
      FLAGMOVE = true;
      obj.points[MINPOINT] = point(mouse.getPosition().x - obj.x, mouse.getPosition().y - obj.y);
    } else {
      FLAGMOVE = false;
    }
  }

  // удаляем ближнюю точку
  if (obj.points.length > 3) {
    if (key.isPress(keyDelPoint)) {
      obj.points.splice(MINPOINT, 1);
    }
  }

  // удаляем все точки
  if (key.isPress(keyReset)) {
    obj.points.length = 0;
    LOG = '';
  }
};

drawMouseDynamicBox(obj, 'L', 'LEFT', 'A', 'RIGHT', 'D', 'R');

obj.drawPoints(); или obj.draws();

"ВНИМАНИЕ: Всегда помни разницу между локальными (экранными) и мировыми координатами в PointJS:
brush.drawLine() - использует МИРОВЫЕ координаты (учитывает камеру)
brush.drawLineS() - использует ЛОКАЛЬНЫЕ/ЭКРАННЫЕ координаты (игнорирует камеру)
Для статического UI, текста, меню и фиксированных элементов интерфейса ВСЕГДА используй методы с суффиксом S (drawTextS, drawLineS, drawRectS и т.д.).
Для игровых объектов, которые должны двигаться вместе с камерой - используй обычные методы без S.
В этой игре сетка и UI должны быть статичными на экране, поэтому нужно было использовать drawLineS, drawRectS, drawTextS."
Дополнительное правило: Если ты рисуешь что-то, что должно оставаться на одном месте экрана независимо от позиции камеры - используй *S() методы. Если объект должен быть частью игрового мира и двигаться с камерой - используй обычные методы.
// Отрисовка сетки
for (var x = 0; x <= GRID_WIDTH; x++) {
  brush.drawLineS({  // Локальные координаты!
    x1: GRID_OFFSET_X + x * CELL_SIZE,
    y1: GRID_OFFSET_Y,
    x2: GRID_OFFSET_X + x * CELL_SIZE,
    y2: GRID_OFFSET_Y + GRID_HEIGHT * CELL_SIZE,
    strokeColor: GRID_COLOR,
    strokeWidth: 1
  });
}


Cчитать игры ниже полностью рабочими эталонными как они есть

//Пример только мобильной рабочей игры
for(var pjs=new PointJS(640,480,{backgroundColor:"#ffffff"}),game=(pjs.system.initFullPage(),pjs.game),point=pjs.vector.point,mouse=pjs.mouseControl.initControl(),OOP=pjs.OOP,WH=game.getWH(),brush=pjs.brush,tiles=pjs.tiles,key=pjs.keyControl.initControl(),random=pjs.math.random,touch=pjs.touchControl.initControl(),mobile=(window.mobileCheck=function(){let a=!1;var e;return e=navigator.userAgent||navigator.vendor||window.opera,a=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4))?!0:a},window.mobileCheck()),lootFly=[],code1=[],code2=[],flagLeftRight=!1,flagMoveStep=!1,flagPlayMove=!1,player=game.newTextObject({x:10,y:10,text:"ghost",size:30,color:"black",fillColor:"#eda031",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",userData:{select:!1,name1:"ghost",name2:"ghost.",pos:point(10,10),step:0,help:0}}),fon=(player.h=41,[]),iter=0,x=0;x<4;x++)for(var y=0;y<4;y++)fon.push(game.newRectObject({x:WH.w/4*y,y:WH.h-WH.w/4*4+WH.w/4*x,w:WH.w/4-.2,h:WH.w/4-.2,fillColor:"#1f1f1f",alpha:.9,userData:{iter:++iter}}));var textCode=game.newTextObject({x:10,y:fon[0].y-40,text:"",size:28,color:"#ffffff",alpha:0}),textScripty=["Привет, я Скрипти","Хочу кушать","Домашку сделал?","Где мой хвост?","2 + 3 = ?","Опять пролил молоко!","Можно я посплю?","Ура! Уроки отменили!","Я не спал, я думал.","Ты меня напугал!","Можно я полетаю?","Ой, я забыл...","Сколько времени?","Погладь меня!","У меня лапки","Ты меня видишь?","Забыл покормить кота"],sayGhost=game.newTextObject({x:WH.w/2-50,y:252,text:textScripty[0],size:18,color:"#000000",fillColor:"#ffffff",radius:10,strokeWidth:2,strokeColor:"#000000",padding:7,font:"Cambria Math",alpha:.9,userData:{time:240,flag:!1,step:0}}),leftRight=(sayGhost.h=28,[game.newTextObject({x:WH.w/2-50,y:fon[0].y,text:"LEFT",size:30,color:"#ffffff",fillColor:"#f45353",radius:10,strokeWidth:2,strokeColor:"#e2e2e2",padding:7,font:"Cambria Math",alpha:.8,userData:{name:"LEFT"}}),game.newTextObject({x:WH.w/2-50,y:fon[0].y+40,text:"RIGHT",size:30,color:"#ffffff",fillColor:"#f45353",radius:10,strokeWidth:2,strokeColor:"#e2e2e2",padding:7,font:"Cambria Math",alpha:.8,userData:{name:"RIGHT"}})]);for(i in leftRight)leftRight[i]&&(leftRight[i].h=36);var stepMove=[game.newTextObject({x:WH.w/2-50,y:fon[0].y,text:" 1 ",size:30,color:"#ffffff",fillColor:"#f45353",radius:10,strokeWidth:2,strokeColor:"#e2e2e2",padding:7,font:"Cambria Math",alpha:.8,userData:{step:1}}),game.newTextObject({x:WH.w/2,y:fon[0].y,text:" 2 ",size:30,color:"#ffffff",fillColor:"#f45353",radius:10,strokeWidth:2,strokeColor:"#e2e2e2",padding:7,font:"Cambria Math",alpha:.8,userData:{step:2}}),game.newTextObject({x:WH.w/2-50,y:fon[0].y+40,text:" 3 ",size:30,color:"#ffffff",fillColor:"#f45353",radius:10,strokeWidth:2,strokeColor:"#e2e2e2",padding:7,font:"Cambria Math",alpha:.8,userData:{step:3}}),game.newTextObject({x:WH.w/2,y:fon[0].y+40,text:" 4 ",size:30,color:"#ffffff",fillColor:"#f45353",radius:10,strokeWidth:2,strokeColor:"#e2e2e2",padding:7,font:"Cambria Math",alpha:.8,userData:{step:4}})];for(i in stepMove)stepMove[i]&&(stepMove[i].h=38);var i,actions=[game.newTextObject({x:120,y:10,text:"left()",size:30,color:"black",fillColor:"#77cd7a",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",alpha:.3,userData:{select:!1,name1:"left()",name2:"left()",name3:"left()",pos:point(120,10),about:"Повернуться налево"}}),game.newTextObject({x:220,y:10,text:"right()",size:30,color:"black",fillColor:"#77cd7a",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",alpha:.3,userData:{select:!1,name1:"right()",name2:"right()",name3:"right()",pos:point(220,10),about:"Повернуться направо"}}),game.newTextObject({x:110,y:130,text:"turn()",size:30,color:"black",fillColor:"#77cd7a",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",alpha:.3,userData:{select:!1,name1:"turn()",name2:"turn()",name3:"turn(          )",arg:"leftRight",step:0,pos:point(110,130),about:"Функция с выбором стороны поворота"}}),game.newTextObject({x:220,y:130,text:"drag()",size:30,color:"black",fillColor:"#77cd7a",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",alpha:.3,userData:{select:!1,name1:"drag()",name2:"drag()",name3:"drag()",pos:point(220,130),about:"Взять (поднять) объект"}}),game.newTextObject({x:10,y:70,text:"move()",size:30,color:"black",fillColor:"#77cd7a",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",alpha:.3,userData:{select:!1,name1:"move()",name2:"move()",name3:"move(  )",name4:"move(",arg:"step",step:0,pos:point(10,70),about:"Двигаться лево/право с выбором шагов"}}),game.newTextObject({x:140,y:70,text:"up()",size:30,color:"black",fillColor:"#77cd7a",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",alpha:.3,userData:{select:!1,name1:"up()",name2:"up()",name3:"up(  )",name4:"up(",arg:"step",step:0,pos:point(140,70),about:"Двигаться вверх с выбором шагов"}}),game.newTextObject({x:230,y:70,text:"down()",size:30,color:"black",fillColor:"#77cd7a",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",alpha:.3,userData:{select:!1,name1:"down()",name2:"down()",name3:"down(  )",name4:"down(",arg:"step",step:0,pos:point(230,70),about:"Двигаться вниз с выбором шагов"}}),game.newTextObject({x:10,y:130,text:"say()",size:30,color:"black",fillColor:"#77cd7a",radius:10,strokeWidth:2,padding:7,font:"Cambria Math",alpha:.3,userData:{select:!1,name1:"say()",name2:"say()",name3:"say()",name4:"say(",step:0,pos:point(10,130),about:"Скрипти говорит случайную фразу"}})];for(i in actions)actions[i]&&(actions[i].h=41);var play=OOP.createButtonText("Play",WH.w+80,fon[0].y-50,68,42,()=>{if(.8===play.getAlpha()){for(var a in play.setAlpha(.2),actions){if(1===actions[a].alpha){if("say()"===actions[a].name2)0===sayGhost.step?sayGhost.setText(textScripty[0]):sayGhost.setText(textScripty[random(0,textScripty.length-1,!1)]),sayGhost.h=28,sayGhost.step=1,sayGhost.flag=!0;else if("left()"===actions[a].name2)vizualPlayer.setFlip(1,0);else if("drag()"===actions[a].name2)for(var e in loot)vizualPlayer.isStaticIntersect(loot[e].getStaticBox())&&(lootFly.push(game.newImageObject({file:"resources/graf/life.png",x:loot[e].x+loot[e].w/2-12.5,y:loot[e].y+loot[e].h/2-12.5,w:25,h:25,userData:{startPos:point(loot[e].x+loot[e].w/2-12.5,loot[e].y+loot[e].h/2-12.5),targetPos:point(life[0].x,life[0].y),speed:.01+.01*Math.random(),progress:0,style:random(0,2,!1),amplitude:30+40*Math.random(),frequency:2+3*Math.random(),spiralTurns:1.5+Math.random(),peakHeight:50+100*Math.random(),phase:Math.random()*Math.PI*2}})),loot.splice(e,1));else"right()"===actions[a].name2?vizualPlayer.setFlip(0,0):'turn("LEFT")'===actions[a].name2?vizualPlayer.setFlip(1,0):'turn("RIGHT")'===actions[a].name2?vizualPlayer.setFlip(0,0):"move()"===actions[a].name1&&0<actions[a].step?(0===vizualPlayer.flip.x?0<=vizualPlayer.pos2&&vizualPlayer.pos2<3&&vizualPlayer.pos2+actions[a].step<=3?vizualPlayer.pos2+=actions[a].step:0<=vizualPlayer.pos2&&vizualPlayer.pos2<=3&&3<vizualPlayer.pos2+actions[a].step?vizualPlayer.pos2=3:3<=vizualPlayer.pos2&&vizualPlayer.pos2<7&&vizualPlayer.pos2+actions[a].step<=7?vizualPlayer.pos2+=actions[a].step:3<=vizualPlayer.pos2&&vizualPlayer.pos2<=7&&7<vizualPlayer.pos2+actions[a].step?vizualPlayer.pos2=7:7<=vizualPlayer.pos2&&vizualPlayer.pos2<11&&vizualPlayer.pos2+actions[a].step<=11?vizualPlayer.pos2+=actions[a].step:7<=vizualPlayer.pos2&&vizualPlayer.pos2<=11&&11<vizualPlayer.pos2+actions[a].step?vizualPlayer.pos2=11:11<=vizualPlayer.pos2&&vizualPlayer.pos2<15&&vizualPlayer.pos2+actions[a].step<=15?vizualPlayer.pos2+=actions[a].step:11<=vizualPlayer.pos2&&vizualPlayer.pos2<=15&&15<vizualPlayer.pos2+actions[a].step&&(vizualPlayer.pos2=15):1===vizualPlayer.flip.x&&(0<vizualPlayer.pos2&&vizualPlayer.pos2<4&&0<=vizualPlayer.pos2-actions[a].step?vizualPlayer.pos2-=actions[a].step:0<vizualPlayer.pos2&&vizualPlayer.pos2<4&&vizualPlayer.pos2-actions[a].step<0?vizualPlayer.pos2=0:3<vizualPlayer.pos2&&vizualPlayer.pos2<8&&5<=vizualPlayer.pos2-actions[a].step?vizualPlayer.pos2-=actions[a].step:3<vizualPlayer.pos2&&vizualPlayer.pos2<8&&vizualPlayer.pos2-actions[a].step<5?vizualPlayer.pos2=4:7<vizualPlayer.pos2&&vizualPlayer.pos2<12&&9<=vizualPlayer.pos2-actions[a].step?vizualPlayer.pos2-=actions[a].step:7<vizualPlayer.pos2&&vizualPlayer.pos2<12&&vizualPlayer.pos2-actions[a].step<9?vizualPlayer.pos2=8:11<vizualPlayer.pos2&&vizualPlayer.pos2<16&&13<=vizualPlayer.pos2-actions[a].step?vizualPlayer.pos2-=actions[a].step:11<vizualPlayer.pos2&&vizualPlayer.pos2<16&&vizualPlayer.pos2-actions[a].step<13&&(vizualPlayer.pos2=12)),flagPlayMove=!0):"up()"===actions[a].name1&&0<actions[a].step?(0!==vizualPlayer.pos2&&1!==vizualPlayer.pos2&&2!==vizualPlayer.pos2&&3!==vizualPlayer.pos2&&0<vizualPlayer.pos2-4*actions[a].step?vizualPlayer.pos2-=4*actions[a].step:4===vizualPlayer.pos2||8==vizualPlayer.pos2||12===vizualPlayer.pos2?vizualPlayer.pos2=0:5===vizualPlayer.pos2||9===vizualPlayer.pos2||13===vizualPlayer.pos2?vizualPlayer.pos2=1:6===vizualPlayer.pos2||10===vizualPlayer.pos2||14===vizualPlayer.pos2?vizualPlayer.pos2=2:7!==vizualPlayer.pos2&&11!==vizualPlayer.pos2&&15!==vizualPlayer.pos2||(vizualPlayer.pos2=3),flagPlayMove=!0):"down()"===actions[a].name1&&0<actions[a].step&&(12!==vizualPlayer.pos2&&13!==vizualPlayer.pos2&&14!==vizualPlayer.pos2&&15!==vizualPlayer.pos2&&vizualPlayer.pos2+4*actions[a].step<15?vizualPlayer.pos2+=4*actions[a].step:0===vizualPlayer.pos2||4==vizualPlayer.pos2||8===vizualPlayer.pos2?vizualPlayer.pos2=12:1===vizualPlayer.pos2||5===vizualPlayer.pos2||9===vizualPlayer.pos2?vizualPlayer.pos2=13:2===vizualPlayer.pos2||6===vizualPlayer.pos2||10===vizualPlayer.pos2?vizualPlayer.pos2=14:3!==vizualPlayer.pos2&&7!==vizualPlayer.pos2&&11!==vizualPlayer.pos2||(vizualPlayer.pos2=15),flagPlayMove=!0);textCode.setText(player.name2+actions[a].name2)}textCode.alpha=1,actions[a].setText(actions[a].name1),actions[a].name2=actions[a].name1,actions[a].setPosition(actions[a].pos),actions[a].alpha=.3}player.setPosition(player.pos),play.setAlpha(.2)}},()=>{},25,"#ffffff","#de0404","#ffffff",0,10,1,0,.2),SIZE=135/fon[0].w,vizualPlayer=game.newAnimationObject({animation:tiles.newImage("resources/ghostFrontRight_91_135_15_3.png").getAnimation(0,0,91,135,15),x:0,y:0,w:91/SIZE,h:135/SIZE,delay:3,userData:{pos:point(0,0),pos2:9}}),loot=(vizualPlayer.setPosition(point(fon[vizualPlayer.pos2].getPositionC().x-vizualPlayer.w/2,fon[vizualPlayer.pos2].getPositionC().y-vizualPlayer.h/2)),[game.newImageObject({file:"resources/graf/55.png",x:fon[2].x+fon[0].w/2-25,y:fon[2].y+fon[0].h/2-25,w:50,h:50}),game.newImageObject({file:"resources/graf/56.png",x:fon[15].x+fon[0].w/2-25,y:fon[15].y+fon[0].h/2-25,w:50,h:50}),game.newImageObject({file:"resources/graf/61.png",x:fon[8].x+fon[0].w/2-25,y:fon[8].y+fon[0].h/2-25,w:50,h:50})]),life=[game.newImageObject({file:"resources/graf/life.png",x:WH.w-30,y:fon[1].y+6,w:25,h:25,alpha:0}),game.newImageObject({file:"resources/graf/life.png",x:WH.w-60,y:fon[1].y+6,w:25,h:25,alpha:0}),game.newImageObject({file:"resources/graf/life.png",x:WH.w-90,y:fon[1].y+6,w:25,h:25,alpha:0})],onlyMobile=(game.newLoop("myGame",function(){for(var a in(WH=game.getWH()).w>WH.h&&game.setLoop("mobile"),brush.drawRect({x:0,y:fon[0].y-60,w:WH.w,h:60,fillColor:"#7240c2",alpha:.8}),0===player.help&&brush.drawText({text:" З О Н А   К О Д А",x:0,y:fon[0].y-40,size:28,color:"#ffffff",alpha:.2}),fon)fon[a].draw(),brush.drawText({text:fon[a].iter,x:fon[a].x+2,y:fon[a].y+2,size:20,color:"#ffffff",alpha:.2});for(var a in code1)code1[a].draw();for(var a in code2)code2[a].draw();for(var a in actions)actions[a].draw();for(var a in loot)loot[a].draw();if(vizualPlayer.draw(),player.draw(),textCode.draw(),sayGhost.flag&&(sayGhost.setPosition(point(vizualPlayer.getPosition().x+vizualPlayer.w/2-OOP.getTextWidth({text:sayGhost.text,size:18,font:"Cambria Math"})/2-10,vizualPlayer.getPosition().y-26)),sayGhost.draw(),sayGhost.time--,sayGhost.time<=0)&&(sayGhost.time=240,sayGhost.flag=!1),.2===play.getAlpha()&&0===player.step&&((mouse.isInObject(player)&&mouse.isPress("LEFT")||touch.isPeekObject(player))&&(player.select=!0,player.help=1,textCode.setText(""),textCode.setAlpha(0),code1.push(game.newRoundRectObject({x:10,y:fon[0].y-50,w:OOP.getTextWidth({text:player.text,size:30,font:"Cambria Math"})+16,h:44,radius:10,strokeWidth:2,alpha:.3,fillColor:player.fillColor}))),player.select&&(mouse.isDown("LEFT")?player.setPositionC(mouse.getPosition()):touch.isDown()&&mobile&&player.setPositionC(touch.getPosition())),0<code1.length)&&player.select&&(player.isStaticIntersect(code1[code1.length-1].getStaticBox())?code1[code1.length-1].alpha=.9:code1[code1.length-1].alpha=.3,mouse.isUp("LEFT")||touch.isUp())){if(.9===code1[code1.length-1].alpha)for(var a in player.x=code1[code1.length-1].x,player.y=code1[code1.length-1].y,actions)actions[a]&&(actions[a].alpha=1);else for(var a in player.setPosition(player.pos),actions)actions[a]&&(actions[a].alpha=.3);player.h=42,player.select=!1,play.setAlpha(.2),code1.pop()}for(var a in actions)if(actions[a]&&1===actions[a].alpha){if(mouse.isInObject(actions[a])&&mouse.isPress("LEFT")||touch.isPeekObject(actions[a])){for(var e in actions[a].select=!0,actions[a].setText(actions[a].name2),actions)actions[e].select||(actions[e].alpha=.3);code2.push(game.newRoundRectObject({x:player.w+10,y:fon[0].y-50,w:OOP.getTextWidth({text:actions[a].name2,size:30,font:"Cambria Math"})+16,h:42,radius:10,strokeWidth:2,alpha:.1,fillColor:actions[a].fillColor}))}if(actions[a].select&&(mouse.isDown("LEFT")?(brush.drawText({text:actions[a].about,x:WH.w/2-OOP.getTextWidth({text:actions[a].about,size:18,font:"Arial"})/2,y:fon[0].y-82,size:18,font:"Arial",color:"#111111",alpha:1}),actions[a].setPositionC(mouse.getPosition())):touch.isDown()&&mobile&&(brush.drawText({text:actions[a].about,x:WH.w/2-OOP.getTextWidth({text:actions[a].about,size:18,font:"Arial"})/2,y:fon[0].y-82,size:18,font:"Arial",color:"#121212",alpha:1}),actions[a].setPositionC(touch.getPosition()))),0<code2.length&&actions[a].select&&(actions[a].isStaticIntersect(code2[code2.length-1].getStaticBox())?code2[code2.length-1].alpha=.9:code2[code2.length-1].alpha=.3,mouse.isUp("LEFT")||touch.isUp())){if(.9==code2[code2.length-1].alpha)actions[a].x=code2[code2.length-1].x,actions[a].y=code2[code2.length-1].y,actions[a].setText(actions[a].name3),actions[a].arg||play.setAlpha(.8),actions[a].arg&&("leftRight"===actions[a].arg&&(flagLeftRight=!0),"step"===actions[a].arg)&&(flagMoveStep=!0);else for(var e in actions[a].setPosition(actions[a].pos),actions[a].setText(actions[a].name1),actions[a].name2=actions[a].name1,play.setAlpha(.2),flagMoveStep=flagLeftRight=!1,actions)actions[e].alpha=1;actions[a].h=42,actions[a].select=!1,code2.pop()}actions[a].draw()}if(flagLeftRight)for(var a in leftRight){if(leftRight[a])for(var e in actions)1===actions[e].alpha&&(leftRight[a].x=actions[e].x-leftRight[a].w/2+OOP.getTextWidth({text:actions[e].name3,size:30,font:"Cambria Math"})/1.3);if(mouse.isInObject(leftRight[a])&&mouse.isPress("LEFT")||touch.isInObject(leftRight[a]))for(var e in actions)1===actions[e].alpha&&(actions[e].setText('turn("'+leftRight[a].text+'")'),actions[e].name2='turn("'+leftRight[a].text+'")',play.setAlpha(.8),actions[e].h=42,flagLeftRight=!1);leftRight[a].draw()}if(flagMoveStep)for(var a in stepMove)if(stepMove[a]){if(mouse.isInObject(stepMove[a])&&mouse.isPress("LEFT")||touch.isInObject(stepMove[a]))for(var e in actions)1===actions[e].alpha&&(actions[e].setText(actions[e].name4+stepMove[a].step+")"),actions[e].name2=actions[e].name4+stepMove[a].step+")",actions[e].step=stepMove[a].step,play.setAlpha(.8),actions[e].h=42,flagMoveStep=!1);stepMove[a].draw()}if(flagPlayMove&&(vizualPlayer.moveToC(fon[vizualPlayer.pos2].getPositionC(),2),vizualPlayer.getDistanceC(fon[vizualPlayer.pos2].getPositionC())<=2))for(var a in flagPlayMove=!1,loot)if(vizualPlayer.isStaticIntersect(loot[a].getStaticBox())){sayGhost.step=1,sayGhost.flag=!0,sayGhost.setText("Поднять?");break}for(var a in life)life[a].draw();if(0<lootFly.length)for(var a in lootFly){lootFly[a].draw();var t=lootFly[a];if(t){t.progress+=t.speed;var o=t.progress,i=t,s=i.startPos.x+(i.targetPos.x-i.startPos.x)*o,l=i.startPos.y+(i.targetPos.y-i.startPos.y)*o,r=0,n=0;switch(i.style){case 0:r=Math.sin(o*Math.PI*i.frequency+i.phase)*i.amplitude*(1-o),n=Math.cos(o*Math.PI*i.frequency+i.phase)*i.amplitude*.3*(1-o);break;case 1:var p=i.phase+o*Math.PI*2*i.spiralTurns,c=i.amplitude*(1-o),r=Math.cos(p)*c,n=Math.sin(p)*c;break;case 2:n=-(i.peakHeight*(1-Math.pow(2*(o<.5?2*o:1-2*(o-.5))-1,2))),r=Math.sin(o*Math.PI*6)*i.amplitude*.2*(1-o)}if(t.x=s+r,t.y=l+n,t.angle+=1===i.style?10:5,t.scale=.5+.5*o,t.y<=fon[1].y+10){for(var f in life)if(0==life[f].alpha){life[f].alpha=1;break}delete lootFly[a]}}}}),game.newTextObject({x:0,y:0,text:"Only Mobile",size:40,color:"#f2f2f2",font:"Courier",alpha:1})),logo=game.newImageObject({file:"resources/graf/pjs.webp",x:0,y:0,w:200/1.4,h:200/1.4,alpha:0}),logoText=game.newTextObject({x:0,y:0,text:"PointJS",size:40,color:"#f4f4f4",font:"Courier",alpha:0}),tmeLoop=OOP.newTimer(3e3,function(){play.setPosition(WH.w-80,fon[0].y-50),game.setLoop("myGame")});game.newLoop("download",function(){game.fill("#292929"),WH=game.getWH(),mobile?(logo.setPosition(point(WH.w/2-logo.w/2,WH.h/2-logo.h/2)),logoText.setPosition(point(WH.w/2-OOP.getTextWidth({text:"PointJS",size:40,font:"Courier"})/2,WH.h/2-logo.h/2-50)),logo.transparent(.008),logoText.transparent(.004),logoText.draw(),logo.draw(),tmeLoop.restart(3e3)):(onlyMobile.setPositionC(point(WH.w/2,WH.h/2)),onlyMobile.draw())}),game.newLoop("mobile",function(){game.fill("#292929"),WH=game.getWH(),onlyMobile.setPositionC(point(WH.w/2,WH.h/2)),onlyMobile.draw(),WH.w<WH.h&&game.setLoop("myGame")}),game.setLoop("download"),game.start();

//пример только компьютерной браузерннйо игры с управлением мышкой и клавиатурой
var newLevelGo,newSelectLevel,keyPress,LevelList,LOOT,drop100,drop90,drop80,drop70,drop60,drop50,drop40,drop30,drop20,drop10,drop5,drop2,drop1,soundHit,btm,levelUp,dragAndDropF12,soundTrack,hit,FIRE,gett,drinkPot,dropLoot,teleportOpen,playerDie,gui1,guiA,guiHP,guiM,guiF,guiFM,guiFAva,groupGUI,ID,howIsLight,meshF12,rectF12,inv3,inv1,inv4,idInv,NPC,guiQuest,QUESTS,MOB,smiles,lEVELName,batGen,moleGen,player,tp,pjs=new PointJS(640,480,{backgroundColor:"#060c17"}),game=pjs.game,point=pjs.vector.point,levels=pjs.levels,key=pjs.keyControl.initControl(),mouse=pjs.mouseControl.initControl(),vector=pjs.vector,tiles=pjs.tiles,camera=pjs.camera,brush=pjs.brush,random=pjs.math.random,OOP=pjs.OOP,system=pjs.system,size=pjs.vector.size,modules=(system.initFullPage(),system.initFPSCheck(),system.setTitle("Limited Light"),pjs.modules),audio=pjs.audio,WH=game.getWH(),timerWH=OOP.newTimer(1e3,function(){WH=game.getWH()}),LEVEL=1,playerHit=[],memoryWallLightLevel1=[],memoryWallLightLevel2=[],memoryChestLevel1=[],memoryChestLevel2=[],setlight=!1,btmFlag=!1,playerShadow=game.newImageObject({file:"resources/players/playerShadow.webp",x:0,y:0,w:62,h:62,alpha:.6}),fairy=(modules.importSync("scripts/loot.js"),modules.importSync("scripts/audio.js"),game.newAnimationObject({animation:tiles.newImage("resources/players/fariy_240_135_37_2.webp").getAnimation(0,0,240,135,37),x:0,y:0,w:240,h:135,delay:2,userData:{name:"fairy",fairyLv:1,fairyExp:0}})),backBTN=game.newTextObject({x:10,y:0,h:44,w:181,text:"Оживить",size:42,color:"#e6e6e6",font:"Arial",padding:5,strokeWidthText:1,fillColor:"#242731",radius:11}),F12=(modules.importSync("scripts/gui.js"),[]),characterInv=(modules.importSync("scripts/f12.js"),[]),inventar=[],npcTime=(modules.importSync("scripts/inventory.js"),OOP.newTimer(1e3,function(){var e,t=random(1,4,!0);for(e in NPC)for(var a in wallCenter)if(wallCenter[a].isInCamera()&&"npc"==wallCenter[a].name&&wallCenter[a].npcID==e)switch(t){case 1:wallCenter[a].setAnimation(NPC[e][1]);break;case 3:wallCenter[a].setAnimation(NPC[e][2]);break;case 4:wallCenter[a].setAnimation(NPC[e][3])}})),npcActiv=!1,guiQuestFlag=!1,idQuest=void 0,npcID=void 0,questActiv=!1,playerTimeAttack=(modules.importSync("scripts/quest.js"),OOP.newTimer(300,function(){player.flagAttack=!1})),wallCenterSort=OOP.newTimer(1e3,function(){wallCenter.sort((e,t)=>e.getStaticBox().y+e.getStaticBox().h+2-(t.getStaticBox().y+t.getStaticBox().h+2))}),reductionLife=OOP.newTimer(300,function(){0<=player.life&&player.life<player.lifeMemory&&("resources/players/girl/rest_128_128_5_5.png"==player.anim.image.file?(player.life+=player.reductionLife,0<=guiHP.anim.x&&(guiHP.anim.x-=160/player.lifeMemory*player.reductionLife)):(player.life+=1,0<=guiHP.anim.x&&(guiHP.anim.x-=160/player.lifeMemory*1)),guiHP.anim.x<0&&(guiHP.anim.x=0),player.life>player.lifeMemory)&&(player.life=player.lifeMemory)}),reductionMana=OOP.newTimer(300,function(){0<=player.life&&("resources/players/girl/rest_128_128_5_5.png"==player.anim.image.file?(player.mana+=player.reductionMana,0<=guiM.anim.x&&(guiM.anim.x-=160/player.manaMemory*player.reductionMana)):(player.mana+=5,0<=guiM.anim.x&&(guiM.anim.x-=160/player.manaMemory*5)),guiM.anim.x<0)&&(guiM.anim.x=0)}),fairyHtime=(modules.importSync("scripts/mob.js"),guiFM.anim.x=102,OOP.newTimer(1,function(){0<player.life&&"fairy"==inventar[1].name2&&guiF.anim.x<102&&(guiF.anim.x<102&&guiF.anim.x++,0<=guiFM.anim.x&&(guiFM.anim.x-=102/fairyExp[inventar[1].fairyLv-1]),guiFM.anim.x<=0)&&(inventar[1].fairyLv++,guiFM.anim.x=102)})),nearestFire=void 0,minNearestFire=void 0,lengthNearestFire=0,tpFlag=(modules.importSync("scripts/smiles.js"),!1),tpFlagAnim=!1,fairyExp=(modules.importSync("scripts/teleport.js"),modules.importSync("scripts/wallCenterSort.js"),modules.importSync("scripts/playerMoveCollision.js"),[]),wallPos=[],wallStaticBox=[],stop=[],wall=[],wallCenter=[],wallRender=[],wallFRender=[],wallCenterRender=[],level14=[],wallF=[],shadow=[],chest=[],flagInv=(modules.importSync("scripts/levelGenStart.js"),modules.importSync("scripts/download.js"),!1);game.newLoop("myGame",function(){if(npcTime.restart(5e3),wallCenterSort.restart(100),pjs.mobMove(),fairyHtime.restart(5e3),timerWH.restart(50),1==player.flagAttack&&playerTimeAttack.restart(player.speedAttack),reductionLife.restart(4e3),reductionMana.restart(2500),pjs.mobGenerate(),key.isDown("D")||key.isDown("A")||key.isDown("W")||key.isDown("S"))for(var e in wallRender.length=0,wallFRender.length=0,soundTrack.play(),wallPos)wall[e].isInCamera()&&(player.getDistanceC(wallPos[e])<250||wall[e].svet)&&(wallRender.push(Number(e)),"wallF"==wall[e].name)&&wallFRender.push(Number(e));for(var e in wallRender)for(var t in wall[wallRender[e]].svet||(wall[wallRender[e]].setAlpha(1.1-player.getDistanceC(wallPos[wallRender[e]])/250),0<player.life&&(F12[howIsLight]&&0<F12[howIsLight].count&&(key.isPress("F")||setlight)||tp&&player.isStaticIntersect(tp.getStaticBox())&&0==tp.open)&&(wall[wallRender[e]].svet=!0,(wall[wallRender[e]].alpha=1)==LEVEL?memoryWallLightLevel1.push(Number(wallRender[e])):2==LEVEL&&memoryWallLightLevel2.push(Number(wallRender[e])))),"wallF"!=wall[wallRender[e]].name&&wall[wallRender[e]].draw(),wallCenter)!wallCenter[t].isInCamera()||"mob"!=wallCenter[t].name3&&"chest"!=wallCenter[t].name&&"loot"!=wallCenter[t].name||wall[wallRender[e]].isStaticIntersect(wallCenter[t].getStaticBox())&&wall[wallRender[e]].svet&&(wallCenter[t].svet=!0);for(var e in shadow)shadow[e].isInCamera()&&player.getDistanceC(shadow[e])<280&&shadow[e].draw();for(var e in playerShadow.draw(),pjs.tpOpenDraw(),pjs.wallCenterSort(),pjs.playerMoveCollision(),npcActiv=!!key.isDown("TAB"),key.isPress("F")&&(setlight=!0),F12[howIsLight]&&0<F12[howIsLight].count&&0<player.life&&1==setlight&&(FIRE.replay(),0<F12[howIsLight].count&&F12[howIsLight].count--,wallCenter.push(game.newAnimationObject({animation:tiles.newImage("resources/obj/fire_64_64_6_5.png").getAnimation(0,0,64,64,6),x:player.getPosition().x+70,y:player.getPosition().y+60,w:64,h:64,delay:5,userData:{name:"fire",timeLight:300}})),F12[howIsLight].count<=0&&(F12[howIsLight].setImage("resources/GUI/box.webp"),F12[howIsLight].name2=void 0,F12[howIsLight].hp&&(F12[e].hp=void 0),F12[howIsLight].count)&&(F12[e].count=void 0),setlight=!1),wallFRender)wall[wallFRender[e]].isInCamera()&&wall[wallFRender[e]].draw();for(var e in 1==questActiv&&(brush.drawTextS({text:QUESTS[npcID][idQuest][6]+"/"+QUESTS[npcID][idQuest][7],x:WH.w/2,y:10,size:30,color:"#d58807",alpha:1}),key.isPress("Q"))&&(guiQuestFlag=!guiQuestFlag),pjs.tpGoo(),pjs.levelName(),pjs.gui(),pjs.f12(),1==(flagInv=key.isPress("B")?!flagInv:flagInv)&&pjs.inventory(),pjs.smiles(),pjs.quest(),pjs.sound(),camera.follow(player,10),level14)player.isStaticIntersect(level14[e].getStaticBox())&&newLevelGo(e)}),PointJS.Module=function(e){"use strict";levelUp=audio.newAudio("resources/map_sound/levelUp.mp3",.39),btm=audio.newAudio("resources/map_sound/btm.mp3",.18),teleportOpen=audio.newAudio("resources/map_sound/teleportOpen.mp3",.59),soundTrack=audio.newAudio("resources/map_sound/sound1.mp3",.01),hit=audio.newAudio("resources/map_sound/hit.mp3",.11),FIRE=audio.newAudio("resources/map_sound/fire.mp3",1),playerDie=audio.newAudio("resources/map_sound/playerDie.mp3",.2),gett=audio.newAudio("resources/map_sound/get.mp3",.65),drinkPot=audio.newAudio("resources/map_sound/drinkPot.mp3",.6),dropLoot=audio.newAudio("resources/map_sound/drop.mp3",.28),soundHit={bat:{1:audio.newAudio("resources/map_sound/hit/hitBat.mp3",.11)},mole:{1:audio.newAudio("resources/map_sound/hit/hitMole.mp3",.11)}},document.addEventListener("visibilitychange",function(){"hidden"===document.visibilityState&&soundTrack.pause()}),e.sound=function(){}},PointJS.Module=function(a){"use strict";var i=game.newImageObject({file:"resources/GUI/playStart.webp",x:0,y:0,w:50,h:50,alpha:.7}),n=game.newImageObject({file:"resources/GUI/enterName.webp",x:0,y:0,w:250,h:69}),l=game.newAnimationObject({animation:tiles.newImage("resources/players/wgirl/idle_128_128_5_5.webp").getAnimation(0,0,128,128,5),x:0,y:0,w:128,h:128,delay:5}),r=game.newAnimationObject({animation:tiles.newImage("resources/wmob/bat/batIdel_220_220_6_4.webp").getAnimation(0,0,220,220,6),x:0,y:0,w:220/1.3,h:220/1.3,delay:5}),o=(r.setFlip(1,0),game.newTextObject({x:0,y:0,text:"limited light",size:46,color:"#e7e7e7",font:"Papyrus",alpha:0})),s=game.newTextObject({x:60,y:158,size:30,text:"|",color:"white",alpha:1}),p=game.newTextObject({x:60,y:158,size:30,text:" ",color:"white"}),m=!1,w=" ",c="",v=1;game.newTextObject({x:80,y:240,size:20,color:"white",fillColor:"#3e3e3e",padding:6,text:"Вывести введенный текст"});game.newLoop("download",function(){var e,t;timerWH.restart(100),90<=a.resources.getProgress()?(o.alpha<.9&&(o.alpha+=.008),o.setPositionS(point(WH.w/2-110,WH.h/2-100)),o.draw(),n.setPositionS(point(WH.w/2-n.w/2,WH.h/2)),n.draw(),l.setPositionS(point(WH.w/2-n.w,WH.h/2-100)),l.draw(),r.setPositionS(point(WH.w/2+90,WH.h/2-75)),r.draw(),p.setPositionS(point(WH.w/2-n.w/2+25,WH.h/2+23)),mouse.isPeekStatic("LEFT",n.getStaticBox())&&(c=" ",v=0,key.setInputMode(!0)),key.isInputMode()&&(e=key.getInputChar(),t=key.getInputKey(),0==(m=0!=s.alpha&&1!=s.alpha?m:!m)?s.transparent(-.025):s.transparent(.04),"BACKSPACE"==t&&0==(w=w.substr(0,w.length-1)).length&&(w=" "),e&&w.length<11&&(w+=e),s.draw()),0!=v||!mouse.isPeekStatic("LEFT",i.getStaticBox())&&"ENTER"!=t||(c=w,w=" ",key.setInputMode(!1),player.name2=c,soundTrack.play(),game.setLoop("myGame")),p.setText(w),s.setPositionS(point(WH.w/2-100+p.w+1,WH.h/2+23)),brush.drawText({text:c,x:10,y:40,size:20,color:"black",alpha:1}),p.draw(),0==key.isInputMode()&&brush.drawTextS({text:"Имя игрока",x:WH.w/2-83,y:WH.h/2+21,size:30,color:"#dbdbdb",alpha:.3}),1<w.length&&(mouse.isInStatic(i.getStaticBox())?i.alpha=.5:i.alpha=.7,i.setPositionS(point(WH.w/2-30,WH.h/2+110)),i.draw()),brush.drawTextS({text:"Игра создана на Российском игровом движке PointJS IDE",x:WH.w/2-OOP.getTextWidth({text:"Игра создана на Российском игровом движке PointJS IDE",size:20})/2,y:WH.h-30,size:20,color:"#999999",alpha:1})):brush.drawTextS({text:a.resources.getProgress()+"%",x:WH.w/2-40,y:WH.h/2-10,size:40,color:"#b9b9b9",alpha:1})})},PointJS.Module=function(n){"use strict";var l;ID=game.newImageObject({file:"resources/GUI/box.webp",x:0,y:0,w:46,h:46,userData:{count:0,name2:void 0,file2:"",file3:"",hp:void 0,expFairy:0,fairyLv:0,fairyExp:0}});for(var e=0;e<12;e++)F12.push(game.newImageObject({file:"resources/GUI/box.webp",x:46*e+8*e,y:0,w:46,h:46,userData:{name:e+1,count:0,name2:void 0,file2:"",file3:"",title1:"",title2:"",hp:void 0,expFairy:0}}));meshF12=game.newMesh({x:0,y:0,add:F12}),rectF12=game.newRectObject({x:0,y:0,w:640,h:70,fillColor:"#d36231"}),n.f12=function(){function e(e,t){(0,n.keyControl.isPress)(e)&&(e=keyPress=t,0<F12.length)&&0<player.life&&("life1"!=F12[e].name2&&"life2"!=F12[e].name2||(0<F12[e].count&&F12[e].count--,drinkPot.replay(),player.life+=F12[e].hp,player.life>player.lifeMemory&&(player.life=player.lifeMemory),0<=guiHP.anim.x&&(guiHP.anim.x-=160/player.lifeMemory*F12[e].hp),guiHP.anim.x<0&&(guiHP.anim.x=0)),"light"==F12[e].name2&&(setlight=!0),"eatFairy"==F12[e].name2&&(0<F12[e].count&&F12[e].count--,0<guiF.anim.x&&(guiF.anim.x-=F12[e].expFairy),guiF.anim.x<=0)&&(guiF.anim.x=0),F12[e].count<=0)&&(F12[e].setImage("resources/GUI/box.webp"),F12[e].name2=void 0,F12[e].hp&&(F12[e].hp=void 0),F12[e].countFire)&&(F12[e].countFire=void 0)}for(var t in meshF12.setPositionS(point(WH.w/2-321,WH.h-55)),rectF12.setPositionS(point(WH.w/2-321,WH.h-68)),meshF12.draw(),e("1",0),e("2",1),e("3",2),e("4",3),e("5",4),e("6",5),e("7",6),e("8",7),e("9",8),F12){var a;if(null==F12[t].name2&&brush.drawText({text:F12[t].name,x:F12[t].name<10?F12[t].x+16:F12[t].x+7,y:F12[t].y+11,size:30,color:"#dbdbdb",alpha:.4}),0!=F12[t].count&&brush.drawText({text:F12[t].count,x:9<F12[t].count?F12[t].x+31:F12[t].x+36,y:F12[t].y+31,size:14,color:"#dbdbdb",alpha:1}),mouse.isInStatic(F12[t].getStaticBox())&&!mouse.isDown("LEFT")&&(F12[t].title1&&brush.drawText({text:F12[t].title1,x:F12[t].x+F12[t].w/2-OOP.getTextWidth({text:F12[t].title1,size:16})/2,y:F12[t].y-50,size:16,color:"#e8e8e8",alpha:1}),F12[t].title2&&"fairy"!=F12[t].name2&&brush.drawText({text:F12[t].title2,x:F12[t].x+F12[t].w/2-OOP.getTextWidth({text:F12[t].title2,size:16})/2,y:F12[t].y-30,size:16,color:"#e8e8e8",alpha:1}),F12[t].title2)&&"fairy"==F12[t].name2&&(a=F12[t].title2+":    "+F12[t].fairyLv,brush.drawText({text:F12[t].title2+" +"+10*F12[t].fairyLv,x:F12[t].x+F12[t].w/2-OOP.getTextWidth({text:a,size:16})/2,y:F12[t].y-30,size:16,color:"#e8e8e8",alpha:1})),0<player.life)if("light"==F12[t].name2&&(howIsLight=Number(t)),"fairy"!=F12[t].name&&(mouse.isInStatic(F12[t].getStaticBox())?(F12[t].alpha=.8,0<F12.length&&mouse.isPress("RIGHT")&&("eatFairy"==F12[t].name2&&(0<F12[t].count&&F12[t].count--,0<guiF.anim.x&&(guiF.anim.x-=F12[t].expFairy),guiF.anim.x<=0)&&(guiF.anim.x=0),"life1"!=F12[t].name2&&"life2"!=F12[t].name2||(0<F12[t].count&&F12[t].count--,drinkPot.replay(),player.life+=F12[t].hp,0<=guiHP.anim.x&&(guiHP.anim.x-=160/player.lifeMemory*F12[t].hp),guiHP.anim.x<0&&(guiHP.anim.x=0)),"light"==F12[t].name2&&(setlight=!0),F12[t].count<=0)&&(9==t?F12[t].setImage("resources/GUI/fairyBack.webp"):F12[t].setImage("resources/GUI/box.webp"),F12[t].name2=void 0,F12[t].hp&&(F12[t].hp=void 0),F12[t].countFire)&&(F12[t].countFire=void 0)):F12[t].alpha=1),mouse.isInStatic(rectF12.getStaticBox()))mouse.isInStatic(F12[t].getStaticBox())&&null!=F12[t].name2&&mouse.isPress("LEFT")&&(gett.replay(),l=t,ID.setImage(F12[t].file3),ID.count=F12[t].count,ID.name2=F12[t].name2,ID.file2=F12[t].file2,ID.file3=F12[t].file3,ID.title1=F12[t].title1,ID.title2=F12[t].title2,ID.fairyLv=F12[t].fairyLv,ID.expFairy=F12[t].expFairy,ID.hp=F12[t].hp,9==t?F12[t].setImage("resources/GUI/fairyBack.webp"):F12[t].setImage("resources/GUI/box.webp"),F12[t].count=0,F12[t].name2=void 0,F12[t].title1="",F12[t].title2=""),ID.isStaticIntersect(F12[t].getStaticBox())&&mouse.isUp("LEFT")&&null!=ID.name2&&(gett.replay(),null==F12[t].name2?(F12[t].setImage(ID.file2),F12[t].file2=ID.file2,F12[t].file3=ID.file3,F12[t].count=ID.count,F12[t].fairyLv=ID.fairyLv,F12[t].name2=ID.name2,F12[t].title1=ID.title1,F12[t].title2=ID.title2,F12[t].expFairy=ID.expFairy,F12[t].hp=ID.hp,ID.name2=void 0):null!=F12[t].name2&&F12[t].name2!=ID.name2?(gett.replay(),F12[l].setImage(F12[t].file2),F12[l].file2=F12[t].file2,F12[l].file3=F12[t].file3,F12[l].count=F12[t].count,F12[l].name2=F12[t].name2,F12[l].fairyLv=F12[t].fairyLv,F12[l].title1=F12[t].title1,F12[l].title2=F12[t].title2,F12[l].expFairy=F12[t].expFairy,F12[l].hp=F12[t].hp,F12[t].setImage(ID.file2),F12[t].file2=ID.file2,F12[t].file3=ID.file3,F12[t].count=ID.count,F12[t].title1=ID.title1,F12[t].fairyLv=ID.fairyLv,F12[t].title2=ID.title2,F12[t].name2=ID.name2,F12[t].expFairy=ID.expFairy,F12[t].hp=ID.hp,ID.name2=void 0):F12[t].name2==ID.name2&&(F12[t].count+ID.count<=3?(F12[t].setImage(ID.file2),F12[t].file2=ID.file2,F12[t].file3=ID.file3,F12[t].count=F12[t].count+ID.count,F12[t].fairyLv=ID.fairyLv,F12[t].name2=ID.name2,F12[t].title1=ID.title1,F12[t].title2=ID.title2,F12[t].expFairy=ID.expFairy,F12[t].hp=ID.hp,ID.name2=void 0):3<F12[t].count+ID.count&&(F12[l].setImage(F12[t].file2),F12[l].file2=F12[t].file2,F12[l].file3=F12[t].file3,F12[l].count=F12[t].count+ID.count-3,F12[l].name2=F12[t].name2,F12[l].fairyLv=F12[t].fairyLv,F12[l].title1=F12[t].title1,F12[l].title2=F12[t].title2,F12[l].expFairy=F12[t].expFairy,F12[l].hp=F12[t].hp,F12[t].setImage(ID.file2),F12[t].file2=ID.file2,F12[t].file3=ID.file3,F12[t].count=3,F12[t].fairyLv=ID.fairyLv,F12[t].name2=ID.name2,F12[t].title1=ID.title1,F12[t].title2=ID.title2,F12[t].expFairy=ID.expFairy,F12[t].hp=ID.hp,idInv.name2=void 0)));else if(mouse.isInStatic(inv3.getStaticBox()))for(var i in inventar)ID.isStaticIntersect(inventar[i].getStaticBox())&&mouse.isUp("LEFT")&&null!=ID.name2&&(gett.replay(),"wings"==inventar[i].name2||"fairy"==inventar[i].name2||"wing"==inventar[i].name||"fairy"==inventar[i].name||"block"==inventar[i].name?(F12[l].setImage(ID.file2),F12[l].file2=ID.file2,F12[l].file3=ID.file3,F12[l].count=ID.count,F12[l].name2=ID.name2,F12[l].fairyLv=ID.fairyLv,F12[l].title1=ID.title1,F12[l].title2=ID.title2,F12[l].expFairy=ID.expFairy,F12[l].hp=ID.hp,ID.name2=void 0):null==inventar[i].name2?(inventar[i].setImage(ID.file2),inventar[i].file2=ID.file2,inventar[i].file3=ID.file3,inventar[i].count=ID.count,inventar[i].fairyLv=ID.fairyLv,inventar[i].name2=ID.name2,inventar[i].title1=ID.title1,inventar[i].title2=ID.title2,inventar[i].expFairy=ID.expFairy,inventar[i].hp=ID.hp,ID.name2=void 0):null!=inventar[i].name2&&inventar[i].name2!=ID.name2?(gett.replay(),F12[l].setImage(inventar[i].file2),F12[l].file2=inventar[i].file2,F12[l].file3=inventar[i].file3,F12[l].count=inventar[i].count,F12[l].name2=inventar[i].name2,F12[l].fairyLv=inventar[i].fairyLv,F12[l].title1=inventar[i].title1,F12[l].title2=inventar[i].title2,F12[l].expFairy=inventar[i].expFairy,F12[l].hp=inventar[i].hp,inventar[i].setImage(ID.file2),inventar[i].file2=ID.file2,inventar[i].file3=ID.file3,inventar[i].count=ID.count,inventar[i].title1=ID.title1,inventar[i].fairyLv=ID.fairyLv,inventar[i].title2=ID.title2,inventar[i].name2=ID.name2,inventar[i].expFairy=ID.expFairy,inventar[i].hp=ID.hp,ID.name2=void 0):inventar[i].name2==ID.name2&&(inventar[i].count+ID.count<=3?(inventar[i].setImage(ID.file2),inventar[i].file2=ID.file2,inventar[i].file3=ID.file3,inventar[i].count=inventar[i].count+ID.count,inventar[i].fairyLv=ID.fairyLv,inventar[i].name2=ID.name2,inventar[i].title1=ID.title1,inventar[i].title2=ID.title2,inventar[i].expFairy=ID.expFairy,inventar[i].hp=ID.hp,ID.name2=void 0):3<inventar[i].count+ID.count&&(F12[l].setImage(inventar[i].file2),F12[l].file2=inventar[i].file2,F12[l].file3=inventar[i].file3,F12[l].count=inventar[i].count+ID.count-3,F12[l].name2=inventar[i].name2,F12[l].fairyLv=inventar[i].fairyLv,F12[l].title1=inventar[i].title1,F12[l].title2=inventar[i].title2,F12[l].expFairy=inventar[i].expFairy,F12[l].hp=inventar[i].hp,inventar[i].setImage(ID.file2),inventar[i].file2=ID.file2,inventar[i].file3=ID.file3,inventar[i].count=3,inventar[i].fairyLv=ID.fairyLv,inventar[i].name2=ID.name2,inventar[i].title1=ID.title1,inventar[i].title2=ID.title2,inventar[i].expFairy=ID.expFairy,inventar[i].hp=ID.hp,ID.name2=void 0)));else mouse.isInStatic(rectF12.getStaticBox())||mouse.isInStatic(inv3.getStaticBox())||!mouse.isUp("LEFT")||null==ID.name2||(dropLoot.replay(),wallCenter.push(game.newImageObject({file:ID.file3,x:player.getPositionC().x+random(-40,40,!1),y:player.getPositionC().y+random(-40,40,!1),w:40,h:40,userData:{name:"loot",file2:ID.file2,file3:ID.file3,count:ID.count,name2:ID.name2,title1:ID.title1,fairyLv:ID.fairyLv,title2:ID.title2,expFairy:ID.expFairy,hp:ID.hp,svet:!1}})),ID.name2=void 0)}}},PointJS.Module=function(e){"use strict";gui1=game.newImageObject({file:"resources/GUI/gui1.webp",x:0,y:0,w:260,h:100}),guiA=game.newImageObject({file:"resources/GUI/guiA.webp",x:12,y:10,w:61,h:68}),guiHP=game.newAnimationObject({animation:tiles.newImage("resources/GUI/guiHP.webp").getAnimation(0,0,158,12,1),x:96,y:31,w:158,h:12,delay:5}),guiM=game.newAnimationObject({animation:tiles.newImage("resources/GUI/guiM.webp").getAnimation(0,0,158,12,1),x:96,y:48,w:158,h:12,delay:5}),guiF=game.newAnimationObject({animation:tiles.newImage("resources/GUI/guiF.webp").getAnimation(0,0,102,7,1),x:137,y:71,w:102,h:7,delay:5,alpha:0}),guiFM=game.newAnimationObject({animation:tiles.newImage("resources/GUI/guiFM.webp").getAnimation(0,0,102,7,1),x:137,y:85.5,w:102,h:7,delay:5,alpha:0}),guiFAva=game.newImageObject({file:"resources/GUI/fairy1.webp",x:80,y:66,w:31,h:31,alpha:0}),groupGUI=game.newMesh({x:0,y:0,angle:0,add:[guiA,guiHP,guiM,guiF,gui1,guiFAva,guiFM]}),e.gui=function(){groupGUI.setPositionS(point(10,10)),groupGUI.draw(),brush.drawRectS({x:WH.w/2-319,y:WH.h-67,w:638/player.expLevel*player.exp,h:8,fillColor:"#b6680a",alpha:1});for(var e=0;e<20;e++)brush.drawRectS({x:WH.w/2-321+32*e,y:WH.h-68,w:32,h:10,strokeWidth:2,strokeColor:"#0e0e0e",alpha:1});brush.drawTextS({text:player.level+"      "+player.name2,x:116,y:17,size:13,color:"#e6e6e6",alpha:1}),"fairy"==characterInv[11].name2?("resources/GUI/gui2.webp"!=gui1.file&&(gui1.setImage("resources/GUI/gui2.webp"),guiFAva.alpha=1,guiF.alpha=1,guiFM.alpha=1),guiF.anim.x<102?(fairy.motionC(point(player.getPosition().x+90,player.getPosition().y+50),size(30,10),4),fairy.draw(),1!=guiFAva.alpha&&(guiFAva.alpha=1),brush.drawTextS({text:characterInv[11].fairyLv,x:characterInv[11].fairyLv<9?131:128,y:97,size:10,color:"#ececec",alpha:1})):guiFAva.alpha=.4):null==characterInv[11].name2&&"resources/GUI/gui1.webp"!=gui1.file&&(gui1.setImage("resources/GUI/gui1.webp"),guiFAva.alpha=0,guiF.alpha=0,guiFM.alpha=0)}},PointJS.Module=function(e){"use strict";for(var a,i=0,n=24,l=(idInv=game.newImageObject({file:"resources/GUI/box.webp",x:0,y:0,w:46,h:46,userData:{count:0,name2:void 0,file2:"",file3:"",hp:void 0,expFairy:0,fairyLv:0,fairyExp:0,stek:void 0,dragF12:void 0}}),0),r=100,o=450,s=100,p=450,m=(inv1=game.newRoundRectObject({x:0,y:0,w:384,h:560,radius:10,fillColor:"#212838",strokeColor:"#356260",strokeWidth:1}),game.newRoundRectObject({x:0,y:0,w:384,h:34,radius:5,fillColor:"#212838",strokeColor:"#356260",strokeWidth:1})),w=(inv3=game.newRoundRectObject({x:0,y:0,w:354,h:230,radius:5,fillColor:"#1a2030"}),inv4=game.newRoundRectObject({x:0,y:0,w:180,h:230,radius:5,fillColor:"#1a2030"}),game.newTextObject({x:0,y:0,text:"+",size:40,color:"#929292",font:"Courier",angle:45})),t=0,c=0;c<8;c++)for(var v=0;v<6;v++){function u(e,t){inventar.push(game.newImageObject({file:e,x:50*v+8*v,y:50*c+6*c,w:50,h:50,userData:{name:t,count:0}}))}++t<25&&u("resources/GUI/box.webp","empty"),25<=t&&30!=t&&36!=t&&42!=t&&48!=t&&u("resources/GUI/boxBlock.webp","block"),30==t&&u("resources/GUI/box30.webp","block"),36==t&&u("resources/GUI/box36.webp","block"),42==t&&u("resources/GUI/box42.webp","block"),48==t&&u("resources/GUI/box48.webp","block")}for(var g=game.newMesh({x:0,y:0,angle:0,add:inventar}),y=-1,d=0;d<4;d++)for(var f,h=0;h<3;h++){switch(++y){case 0:f="head";break;case 1:f="hair";break;case 2:f="amulet";break;case 3:f="weaponsL";break;case 4:f="body";break;case 5:f="weaponsR";break;case 6:f="ring1";break;case 7:f="hand";break;case 8:f="ring2";break;case 9:f="wing";break;case 10:f="legs";break;case 11:f="fairy"}characterInv.push(game.newImageObject({file:"resources/GUI/char/"+y+".webp",x:217+50*h+8*h,y:60+50*d+6*d,w:50,h:50,userData:{name:f,name2:void 0}}))}var I=game.newMesh({x:0,y:0,angle:0,add:characterInv}),F=!1;e.inventory=function(){mouse.isInStatic(inv3.getStaticBox())&&(mouse.isWheel("UP")?0<l&&(l-=4,o+=56):mouse.isWheel("DOWN")&&l<16&&(l+=4,o-=56),0==l?(i=0,n=24):4==l?(i=6,n=30):8==l?(i=12,n=36):12==l?(i=18,n=42):16==l&&(i=24,n=48)),mouse.isInStatic(m.getStaticBox())?(mouse.setStandardCursor("grab"),mouse.isDown("LEFT")&&(F=!0)):mouse.setStandardCursor("default"),1==F&&(r+=mouse.getSpeed().x,o+=mouse.getSpeed().y,s+=mouse.getSpeed().x,p+=mouse.getSpeed().y),mouse.isUp("LEFT")&&(F=!1),inv1.setPositionS(point(s-13,p-280)),inv1.draw(),brush.drawTextLinesS({lines:["Класс: "+player.prof,"Гильдия: "+player.gild,"Опыт: "+player.exp],x:s+15,y:p-228,size:18,color:"#acacac",lineHeight:1.2,strokeWidth:1,alpha:1}),brush.drawTextLinesS({lines:["Сила: "+player.force,"Тело: "+player.body,"Ловкость: "+player.agility,"Точность: "+player.precision,"Дух: "+player.soul,"Сопротивление: "+player.physic,"Здоровье: "+player.lifeMemory],x:s+15,y:p-150,size:18,color:"#acacac",lineHeight:1.2,strokeWidth:1,alpha:1}),inv4.setPositionS(point(s+180,p-235)),inv4.draw(),inv3.setPositionS(point(s-6,p+16)),inv3.draw(),g.setPositionS(point(r+1,o+22)),brush.drawRoundRectS({x:s+356,y:p+22,w:4,h:220,radius:5,fillColor:"#171c2a"}),brush.drawRoundRectS({x:r+354,y:o+18+26*l,w:8,h:30,radius:5,fillColor:"#9c9c9c"}),brush.drawLineS({x1:s+10,y1:p+6,x2:s+336,y2:p+6,strokeColor:"#a3a3a3",alpha:.2}),m.setPositionS(point(s-13,p-280)),m.draw(),w.setPositionS(point(s+334,p-280)),w.draw(),I.setPositionS(point(s-30,p-290));for(var e=i;e<n;e++){if(inventar[e].draw(),inventar[e].stek&&brush.drawText({text:inventar[e].count,x:9<inventar[e].count?inventar[e].x+31:inventar[e].x+38,y:inventar[e].y+31,size:14,color:"#dbdbdb",alpha:1}),mouse.isInStatic(inv3.getStaticBox()))mouse.isInStatic(inventar[e].getStaticBox())&&null!=inventar[e].name2&&mouse.isPress("LEFT")&&(gett.replay(),a=e,idInv.setImage(inventar[e].file3),idInv.count=inventar[e].count,idInv.name2=inventar[e].name2,idInv.file2=inventar[e].file2,idInv.file3=inventar[e].file3,idInv.title1=inventar[e].title1,idInv.title2=inventar[e].title2,idInv.fairyLv=inventar[e].fairyLv,idInv.expFairy=inventar[e].expFairy,idInv.hp=inventar[e].hp,idInv.stek=inventar[e].stek,idInv.dragF12=inventar[e].dragF12,inventar[e].setImage("resources/GUI/box.webp"),inventar[e].count=0,inventar[e].name2=void 0,inventar[e].title1="",inventar[e].title2="",inventar[e].stek=void 0),idInv.isStaticIntersect(inventar[e].getStaticBox())&&mouse.isUp("LEFT")&&null!=idInv.name2&&(gett.replay(),"block"==inventar[e].name?(inventar[a].setImage(idInv.file2),inventar[a].file2=idInv.file2,inventar[a].file3=idInv.file3,inventar[a].count=idInv.count,inventar[a].name2=idInv.name2,inventar[a].fairyLv=idInv.fairyLv,inventar[a].title1=idInv.title1,inventar[a].title2=idInv.title2,inventar[a].expFairy=idInv.expFairy,inventar[a].hp=idInv.hp,inventar[a].stek=idInv.stek,inventar[a].dragF12=idInv.dragF12):null==inventar[e].name2?(inventar[e].setImage(idInv.file2),inventar[e].file2=idInv.file2,inventar[e].file3=idInv.file3,inventar[e].count=idInv.count,inventar[e].fairyLv=idInv.fairyLv,inventar[e].name2=idInv.name2,inventar[e].title1=idInv.title1,inventar[e].title2=idInv.title2,inventar[e].hp=idInv.hp,inventar[e].expFairy=idInv.expFairy,inventar[e].fairyLv=idInv.fairyLv,inventar[e].expFairy=idInv.expFairy,inventar[e].stek=idInv.stek,inventar[e].dragF12=idInv.dragF12):null==inventar[e].name2||inventar[e].name2==idInv.name2&&(inventar[e].name2!=idInv.name2||idInv.stek)?inventar[e].name2==idInv.name2&&idInv.stek&&(inventar[e].count+idInv.count<=3?(inventar[e].setImage(idInv.file2),inventar[e].file2=idInv.file2,inventar[e].file3=idInv.file3,inventar[e].count=inventar[e].count+idInv.count,inventar[e].fairyLv=idInv.fairyLv,inventar[e].name2=idInv.name2,inventar[e].title1=idInv.title1,inventar[e].title2=idInv.title2,inventar[e].expFairy=idInv.expFairy,inventar[e].hp=idInv.hp,inventar[e].stek=idInv.stek,inventar[e].dragF12=idInv.dragF12):3<inventar[e].count+idInv.count&&(inventar[a].setImage(inventar[e].file2),inventar[a].file2=inventar[e].file2,inventar[a].file3=inventar[e].file3,inventar[a].count=inventar[e].count+idInv.count-3,inventar[a].name2=inventar[e].name2,inventar[a].fairyLv=inventar[e].fairyLv,inventar[a].title1=inventar[e].title1,inventar[a].title2=inventar[e].title2,inventar[a].expFairy=inventar[e].expFairy,inventar[a].hp=inventar[e].hp,inventar[a].stek=inventar[e].stek,inventar[a].dragF12=inventar[e].dragF12,inventar[e].setImage(idInv.file2),inventar[e].file2=idInv.file2,inventar[e].file3=idInv.file3,inventar[e].count=3,inventar[e].fairyLv=idInv.fairyLv,inventar[e].name2=idInv.name2,inventar[e].title1=idInv.title1,inventar[e].title2=idInv.title2,inventar[e].expFairy=idInv.expFairy,inventar[e].hp=idInv.hp,inventar[e].stek=idInv.stek,inventar[e].dragF12=idInv.dragF12)):(gett.replay(),inventar[a].setImage(inventar[e].file2),inventar[a].file2=inventar[e].file2,inventar[a].file3=inventar[e].file3,inventar[a].count=inventar[e].count,inventar[a].name2=inventar[e].name2,inventar[a].fairyLv=inventar[e].fairyLv,inventar[a].title1=inventar[e].title1,inventar[a].title2=inventar[e].title2,inventar[a].expFairy=inventar[e].expFairy,inventar[a].hp=inventar[e].hp,inventar[a].stek=inventar[e].stek,inventar[a].dragF12=inventar[e].dragF12,inventar[e].setImage(idInv.file2),inventar[e].file2=idInv.file2,inventar[e].file3=idInv.file3,inventar[e].count=idInv.count,inventar[e].title1=idInv.title1,inventar[e].fairyLv=idInv.fairyLv,inventar[e].title2=idInv.title2,inventar[e].name2=idInv.name2,inventar[e].expFairy=idInv.expFairy,inventar[e].hp=idInv.hp,inventar[e].stek=idInv.stek,inventar[e].dragF12=idInv.dragF12),idInv.name2=void 0);else if(mouse.isInStatic(rectF12.getStaticBox()))for(var t in F12)idInv.isStaticIntersect(F12[t].getStaticBox())&&mouse.isUp("LEFT")&&null!=idInv.name2&&(gett.replay(),idInv.dragF12?null==F12[t].name2?(F12[t].setImage(idInv.file2),F12[t].file2=idInv.file2,F12[t].file3=idInv.file3,F12[t].count=idInv.count,F12[t].fairyLv=idInv.fairyLv,F12[t].name2=idInv.name2,F12[t].title1=idInv.title1,F12[t].title2=idInv.title2,F12[t].expFairy=idInv.expFairy,F12[t].hp=idInv.hp,F12[t].stek=idInv.stek,F12[t].dragF12=idInv.dragF12,idInv.name2=void 0):null!=F12[t].name2&&F12[t].name2!=idInv.name2?(gett.replay(),inventar[a].setImage(F12[t].file2),inventar[a].file2=F12[t].file2,inventar[a].file3=F12[t].file3,inventar[a].count=F12[t].count,inventar[a].name2=F12[t].name2,inventar[a].fairyLv=F12[t].fairyLv,inventar[a].title1=F12[t].title1,inventar[a].title2=F12[t].title2,inventar[a].expFairy=F12[t].expFairy,inventar[a].hp=F12[t].hp,inventar[a].stek=F12[t].stek,inventar[a].dragF12=F12[t].dragF12,F12[t].setImage(idInv.file2),F12[t].file2=idInv.file2,F12[t].file3=idInv.file3,F12[t].count=idInv.count,F12[t].title1=idInv.title1,F12[t].fairyLv=idInv.fairyLv,F12[t].title2=idInv.title2,F12[t].name2=idInv.name2,F12[t].expFairy=idInv.expFairy,F12[t].hp=idInv.hp,F12[t].stek=idInv.stek,F12[t].dragF12=idInv.dragF12,idInv.name2=void 0):F12[t].name2==idInv.name2&&(F12[t].count+idInv.count<=3?(F12[t].setImage(idInv.file2),F12[t].file2=idInv.file2,F12[t].file3=idInv.file3,F12[t].count=F12[t].count+idInv.count,F12[t].fairyLv=idInv.fairyLv,F12[t].name2=idInv.name2,F12[t].title1=idInv.title1,F12[t].title2=idInv.title2,F12[t].expFairy=idInv.expFairy,F12[t].hp=idInv.hp,F12[t].stek=idInv.stek,F12[t].dragF12=idInv.dragF12,idInv.name2=void 0):3<F12[t].count+idInv.count&&(inventar[a].setImage(F12[t].file2),inventar[a].file2=F12[t].file2,inventar[a].file3=F12[t].file3,inventar[a].count=F12[t].count+idInv.count-3,inventar[a].name2=F12[t].name2,inventar[a].fairyLv=F12[t].fairyLv,inventar[a].title1=F12[t].title1,inventar[a].title2=F12[t].title2,inventar[a].expFairy=F12[t].expFairy,inventar[a].hp=F12[t].hp,inventar[a].stek=F12[t].stek,inventar[a].dragF12=F12[t].dragF12,F12[t].setImage(idInv.file2),F12[t].file2=idInv.file2,F12[t].file3=idInv.file3,F12[t].count=3,F12[t].fairyLv=idInv.fairyLv,F12[t].name2=idInv.name2,F12[t].title1=idInv.title1,F12[t].title2=idInv.title2,F12[t].expFairy=idInv.expFairy,F12[t].hp=idInv.hp,F12[t].stek=idInv.stek,F12[t].dragF12=idInv.dragF12,idInv.name2=void 0)):(inventar[a].setImage(idInv.file2),inventar[a].file2=idInv.file2,inventar[a].file3=idInv.file3,inventar[a].count=idInv.count,inventar[a].title1=idInv.title1,inventar[a].fairyLv=idInv.fairyLv,inventar[a].title2=idInv.title2,inventar[a].name2=idInv.name2,inventar[a].expFairy=idInv.expFairy,inventar[a].hp=idInv.hp,inventar[a].stek=idInv.stek,inventar[a].dragF12=idInv.dragF12,idInv.name2=void 0));else if(mouse.isInStatic(inv4.getStaticBox()))for(var t in characterInv)idInv.isStaticIntersect(characterInv[t].getStaticBox())&&mouse.isUp("LEFT")&&null!=idInv.name2&&(null==characterInv[t].name2&&characterInv[t].name==idInv.name2?(characterInv[t].setImage(idInv.file2),characterInv[t].file2=idInv.file2,characterInv[t].file3=idInv.file3,characterInv[t].count=idInv.count,characterInv[t].name2=idInv.name2,characterInv[t].title1=idInv.title1,characterInv[t].title2=idInv.title2,characterInv[t].hp=idInv.hp,characterInv[t].fairyLv=idInv.fairyLv,characterInv[t].expFairy=idInv.expFairy,characterInv[t].stek=idInv.stek,characterInv[t].dragF12=idInv.dragF12,"fairy"==characterInv[t].name2&&(guiF.alpha=1,guiFM.alpha=1,guiFAva.alpha=1)):null!=characterInv[t].name2&&characterInv[t].name==idInv.name2?(inventar[a].setImage(characterInv[t].file2),inventar[a].file2=characterInv[t].file2,inventar[a].file3=characterInv[t].file3,inventar[a].count=characterInv[t].count,inventar[a].name2=characterInv[t].name2,inventar[a].fairyLv=characterInv[t].fairyLv,inventar[a].title1=characterInv[t].title1,inventar[a].title2=characterInv[t].title2,inventar[a].expFairy=characterInv[t].expFairy,inventar[a].hp=characterInv[t].hp,inventar[a].stek=characterInv[t].stek,inventar[a].dragF12=characterInv[t].dragF12,characterInv[t].setImage(idInv.file2),characterInv[t].file2=idInv.file2,characterInv[t].file3=idInv.file3,characterInv[t].count=idInv.count,characterInv[t].fairyLv=idInv.fairyLv,characterInv[t].name2=idInv.name2,characterInv[t].title1=idInv.title1,characterInv[t].title2=idInv.title2,characterInv[t].expFairy=idInv.expFairy,characterInv[t].hp=idInv.hp,characterInv[t].stek=idInv.stek,characterInv[t].dragF12=idInv.dragF12,idInv.name2=void 0):characterInv[t].name!=idInv.name2&&(inventar[a].setImage(idInv.file2),inventar[a].file2=idInv.file2,inventar[a].file3=idInv.file3,inventar[a].count=idInv.count,inventar[a].title1=idInv.title1,inventar[a].fairyLv=idInv.fairyLv,inventar[a].title2=idInv.title2,inventar[a].name2=idInv.name2,inventar[a].expFairy=idInv.expFairy,inventar[a].hp=idInv.hp,inventar[a].stek=idInv.stek,inventar[a].dragF12=idInv.dragF12),idInv.name2=void 0);else mouse.isInStatic(inv3.getStaticBox())||mouse.isInStatic(rectF12.getStaticBox())||!mouse.isUp("LEFT")||null==idInv.name2||(dropLoot.replay(),wallCenter.push(game.newImageObject({file:idInv.file3,x:player.getPositionC().x+random(-40,40,!1),y:player.getPositionC().y+random(-40,40,!1),w:40,h:40,userData:{name:"loot",name2:idInv.name2,file2:idInv.file2,file3:idInv.file3,count:idInv.count,title1:idInv.title1,title2:idInv.title2,fairyLv:idInv.fairyLv,expFairy:idInv.expFairy,hp:idInv.hp,svet:!1}})),idInv.name2=void 0);0<player.life&&"fairy"!=inventar[e].name2&&(mouse.isInStatic(inventar[e].getStaticBox())?(inventar[e].alpha=.8,0<inventar.length&&mouse.isPress("RIGHT")&&("eatFairy"==inventar[e].name2&&"fairy"==inventar[1].name2&&(0<inventar[e].count&&inventar[e].count--,0<guiF.anim.x&&(guiF.anim.x-=inventar[e].expFairy),guiF.anim.x<=0)&&(guiF.anim.x=0),"life1"!=inventar[e].name2&&"life2"!=inventar[e].name2||(0<inventar[e].count&&inventar[e].count--,drinkPot.replay(),player.life+=inventar[e].hp,0<=guiHP.anim.x&&(guiHP.anim.x-=160/player.lifeMemory*inventar[e].hp),guiHP.anim.x<0&&(guiHP.anim.x=0)),inventar[e].count<=0)&&(0==e?inventar[e].setImage("resources/GUI/wingBack.webp"):1==e?inventar[e].setImage("resources/GUI/fairyBack.webp"):inventar[e].setImage("resources/GUI/box.webp"),inventar[e].name2=void 0,inventar[e].hp&&(inventar[e].hp=void 0),inventar[e].countFire)&&(inventar[e].countFire=void 0)):inventar[e].alpha=1)}for(e in characterInv)characterInv[e].draw();mouse.isDown("LEFT")&&(null!=idInv.name2&&(idInv.setPositionC(point(mouse.getPosition().x,mouse.getPosition().y)),idInv.draw()),null!=ID.name2)&&(ID.setPositionC(point(mouse.getPosition().x,mouse.getPosition().y)),ID.draw())}},PointJS.Module=function(a){"use strict";LevelList={1:{1:"1 ур. Вход в подземелье",2:!(fairyExp=[100,150,200,300,400,500,600,700,900,1100,1300,1600,1800,2e3,2300,2600,2800,3e3,3300,3600,3900,4300,4700,5100,5600,6e3,6500,7e3,7500,8e3,8500,9e3,1e4,11e3,13e3,17e3,21e3,25e3,3e4,4e4]),3:1,4:"Вход в подземелье",5:8},2:{1:"2 ур. Кротовья нора",2:!1,3:2,4:"  Кротовья нора",5:9}},(player=game.newAnimationObject({animation:tiles.newImage("resources/players/wgirl/idle_128_128_5_5.webp").getAnimation(0,0,128,128,5),x:0,y:0,w:128,h:128,delay:5,userData:{name:"player",name2:"Tefelka",force:5,body:0,agility:0,precision:0,soul:0,physic:0,lifeMemory:100,def:1,dodge:0,lifeCount:!1,life:100,level:1,exp:0,prof:"Мечник",gild:"Tenshi",expLevel:50,mana:100,manaMemory:100,speedAttack:1e3,reductionLife:1,resp:point(0,0),speedMove:7,flagAttack:!0,reductionMana:10}})).setStaticBox(43,60,-85,-60),player.setCenter(point(0,30)),OOP.readJSON("level"+LEVEL+".pjs",function(e){var t,a=levels.newLevelFromJSON(e).getObjects(),i=[];for(r in a){if("player"==a[r].name&&(player.x=a[r].x,player.y=a[r].y,player.resp=a[r].getPositionC(),wallCenter.push(player)),"wallGen"==a[r].name||"wallGenStop"==a[r].name||"wallGenSvet"==a[r].name)for(var n=0;n<a[r].w/50;n++)for(var l=0;l<a[r].h/50;l++)wall.push(game.newImageObject({file:["resources/wall/24.webp","resources/wall/24.webp","resources/wall/24.webp","resources/wall/24.webp","resources/wall/26.webp","resources/wall/26.webp","resources/wall/26.webp","resources/wall/26.webp","resources/wall/25.webp"][random(0,8,!1)],x:a[r].x+50*n,y:a[r].y+50*l,w:50,h:50,angle:[0,90,180,270][random(0,3,!1)],userData:{name:"wall",svet:"wallGenSvet"==a[r].name,stop2:"wallGenStop"==a[r].name}})),"wallGen"==a[r].name&&i.push(wall[wall.length-1].getPositionC()),wallPos.push(wall[wall.length-1].getPositionC()),wallStaticBox.push(wall[wall.length-1].getStaticBox());if("wallBack"==a[r].name||"wallBackLight"==a[r].name||"wallFront"==a[r].name||"wallCenter1"==a[r].name){"wallBack"!=a[r].name&&"wallBackLight"!=a[r].name||(t="wall"),"wallFront"==a[r].name&&(t="wallF"),"wallCenter1"==a[r].name&&(t="wallC");for(n=0;n<a[r].w/100;n++)wall.push(game.newImageObject({file:"resources/wall/wall02.webp",x:a[r].x+100*n,y:a[r].y-100,w:100,h:150,userData:{name:t,svet:"wallBackLight"==a[r].name,stop2:!0}})),wallPos.push(wall[wall.length-1].getPositionC()),wallStaticBox.push(wall[wall.length-1].getStaticBox()),"wallFront"==a[r].name&&wallF.push(wall[wall.length-1]),"wallCenter1"==a[r].name&&wallCenter.push(wall[wall.length-1])}if("wallFront2"==a[r].name||"wallFront2Light"==a[r].name||"wallCenter2"==a[r].name)for(l=0;l<=a[r].h/100;l++)wall.push(game.newImageObject({file:"resources/wall/45.png",x:a[r].x,y:a[r].y-150+100*l,w:50,h:100,userData:{name:"wallFront2"==a[r].name||"wallFront2Light"==a[r].name?"wallF":"wallC",svet:"wallFront2Light"==a[r].name,stop2:!0}})),wallPos.push(wall[wall.length-1].getPositionC()),wallStaticBox.push(wall[wall.length-1].getStaticBox()),"wallFront2"!=a[r].name&&"wallCenter2Light"!=a[r].name||wallF.push(wall[wall.length-1]),"wallCenter2"==a[r].name&&wallCenter.push(wall[wall.length-1]);"wallFakel"==a[r].name&&(wall.push(game.newAnimationObject({animation:tiles.newImage("resources/obj/firewall4_50_120_6_3.webp").getAnimation(0,0,50,120,6),x:a[r].x,y:a[r].y,w:50,h:120,delay:4,userData:{name:"wallF",svet:!0}})),wallF.push(wall[wall.length-1]),wallPos.push(a[r].getPositionC()),wallStaticBox.push(wall[wall.length-1].getStaticBox())),"wallFront2"!=a[r].name&&"wallFront2Light"!=a[r].name&&"wallCenter2"!=a[r].name||(a[r].y-=80,a[r].h+=70,stop.push(a[r])),"wallBack"!=a[r].name&&"wallBackLight"!=a[r].name&&"wallFront"!=a[r].name&&"wallCenter1"!=a[r].name||(a[r].y-=30,a[r].h=20,stop.push(a[r])),"npc1"==a[r].name&&(wallCenter.push(game.newAnimationObject({animation:tiles.newImage("resources/nps/1/nps13_200_267_32_3.webp").getAnimation(0,0,200,267,32),x:a[r].x,y:a[r].y,w:151,h:189,delay:3,userData:{name:"npc",name2:"npc1",name3:"Маркус",timeAnim:200,npcID:1e-4,svet:!0}})),wallCenter[wallCenter.length-1].setStaticBox(48,44,-116,-84)),"level14"==a[r].name&&level14.push(a[r]),"loot"==a[r].name&&wallCenter.push(a[r]),"shadow"==a[r].name&&shadow.push(a[r]),"tp"==a[r].name&&((tp=game.newAnimationObject({animation:tiles.newImage("resources/obj/teleport_300_200_12_3.webp").getAnimation(0,0,300,200,12),x:a[r].x,y:a[r].y,w:161,h:107,delay:3,alpha:.6,userData:{open:!1,svet:!1,level:LEVEL}})).setStaticBox(65,43,-129,-86),shadow.push(game.newImageObject({file:"resources/players/playerShadow.webp",x:a[r].x-70,y:a[r].y-70,w:300,h:250,alpha:.6})))}for(var r,o=0;o<LevelList[LEVEL][5];o++){var s=random(0,i.length-1,!1);wallCenter.push(game.newAnimationObject({animation:tiles.newImage("resources/obj/chest_150_150_13_5.webp").getAnimation(0,0,150,150,13),x:i[s].x,y:i[s].y,w:105,h:105,delay:5,startFrame:1,userData:{name:"chest",svet:!1,title:"Старый сундук",open:!1,loot:[4e3,4001,4002,4003,4004,4005,4006,4007,4008,4009,4010,4011,4012,4013,4014,4015],chance:[drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90,drop90]}})),wallCenter[wallCenter.length-1].setFlip(random(0,1,!1),0),stop.push(game.newRectObject({x:wallCenter[wallCenter.length-1].x,y:wallCenter[wallCenter.length-1].y,w:wallCenter[wallCenter.length-1].w,h:wallCenter[wallCenter.length-1].h,fillColor:"black"})),stop[stop.length-1].setStaticBox(27,36,-58,-96)}for(r in tp&&(tp.open=LevelList[LEVEL][2],tp.svet=LevelList[LEVEL][2]),wallPos)(player.getDistanceC(wall[r])<250||wall[r].svet)&&("wall"==wall[r].name&&wallRender.push(Number(r)),"wallF"==wall[r].name)&&wallFRender.push(Number(r)),wall[r].svet&&(1==LEVEL&&0<memoryWallLightLevel1.length?memoryWallLightLevel1.push(Number(r)):2==LEVEL&&0<memoryWallLightLevel2.length&&memoryWallLightLevel2.push(Number(r)));game.startLoop("myGame"),game.start()},!0),newLevelGo=function(e,p){var t=!1;0<player.life&&!p?(2==level14[e].levelName&&1==LEVEL&&(LEVEL=2,t=!0),1==level14[e].levelName&&2==LEVEL&&(LEVEL=1,t=!0)):player.life<0&&!p?(LEVEL=1,guiHP.anim.x=160,player.exp-=player.exp/2,player.life=1,guiHP.anim.x-=160/player.lifeMemory*10,player.setPositionC(player.resp),camera.setPositionC(player.resp),t=!0):0<player.life&&p&&(LEVEL=p,t=!0),1==t&&(moleGen=batGen=void 0,wall.length=0,wallCenter.length=0,wallF.length=0,wallPos.length=0,wallStaticBox.length=0,stop.length=0,wallRender.length=0,wallFRender.length=0,wallCenterRender.length=0,shadow.length=0,a.OOP.readJSON("level"+LEVEL+".pjs",function(e){var t,a=levels.newLevelFromJSON(e).getObjects(),i=[];for(s in a){if("wallGen"==a[s].name||"wallGenStop"==a[s].name||"wallGenSvet"==a[s].name)for(var n=0;n<a[s].w/50;n++)for(var l=0;l<a[s].h/50;l++)wall.push(game.newImageObject({file:["resources/wall/24.webp","resources/wall/24.webp","resources/wall/24.webp","resources/wall/24.webp","resources/wall/26.webp","resources/wall/26.webp","resources/wall/26.webp","resources/wall/26.webp","resources/wall/25.webp"][random(0,8,!1)],x:a[s].x+50*n,y:a[s].y+50*l,w:50,h:50,angle:[0,90,180,270][random(0,3,!1)]+random(-1,1,!1),userData:{name:"wall",svet:"wallGenSvet"==a[s].name,stop2:"wallGenStop"==a[s].name}})),"wallGen"==a[s].name&&i.push(wall[wall.length-1].getPositionC()),wallPos.push(wall[wall.length-1].getPositionC()),wallStaticBox.push(wall[wall.length-1].getStaticBox());if("wallBack"==a[s].name||"wallBackLight"==a[s].name||"wallFront"==a[s].name||"wallCenter1"==a[s].name){"wallBack"!=a[s].name&&"wallBackLight"!=a[s].name||(t="wall"),"wallFront"==a[s].name&&(t="wallF"),"wallCenter1"==a[s].name&&(t="wallC");for(n=0;n<a[s].w/100;n++)wall.push(game.newImageObject({file:"resources/wall/wall02.webp",x:a[s].x+100*n,y:a[s].y-100,w:100,h:150,userData:{name:t,svet:"wallBackLight"==a[s].name,stop2:!0}})),wallPos.push(wall[wall.length-1].getPositionC()),wallStaticBox.push(wall[wall.length-1].getStaticBox()),"wallFront"==a[s].name&&wallF.push(wall[wall.length-1]),"wallCenter1"==a[s].name&&wallCenter.push(wall[wall.length-1])}if("wallFront2"==a[s].name||"wallFront2Light"==a[s].name||"wallCenter2"==a[s].name)for(l=0;l<=a[s].h/100;l++)wall.push(game.newImageObject({file:"resources/wall/45.png",x:a[s].x,y:a[s].y-150+100*l,w:50,h:100,userData:{name:"wallFront2"==a[s].name||"wallFront2Light"==a[s].name?"wallF":"wallC",svet:"wallFront2Light"==a[s].name,stop2:!0}})),wallPos.push(wall[wall.length-1].getPositionC()),wallStaticBox.push(wall[wall.length-1].getStaticBox()),"wallFront2"!=a[s].name&&"wallCenter2Light"!=a[s].name||wallF.push(wall[wall.length-1]),"wallCenter2"==a[s].name&&wallCenter.push(wall[wall.length-1]);"wallFakel"==a[s].name&&(wall.push(game.newAnimationObject({animation:tiles.newImage("resources/obj/firewall4_50_120_6_3.webp").getAnimation(0,0,50,120,6),x:a[s].x,y:a[s].y,w:50,h:120,delay:4,userData:{name:"wallF",svet:!0}})),wallF.push(wall[wall.length-1]),wallPos.push(a[s].getPositionC()),wallStaticBox.push(wall[wall.length-1].getStaticBox())),"wallFront2"!=a[s].name&&"wallFront2Light"!=a[s].name&&"wallCenter2"!=a[s].name||(a[s].y-=80,a[s].h+=70,stop.push(a[s])),"wallBack"!=a[s].name&&"wallBackLight"!=a[s].name&&"wallFront"!=a[s].name&&"wallCenter1"!=a[s].name||(a[s].y-=30,a[s].h=20,stop.push(a[s])),"npc1"==a[s].name&&wallCenter.push(game.newAnimationObject({animation:tiles.newImage("resources/nps/1/nps13_200_267_32_3.webp").getAnimation(0,0,200,267,32),x:a[s].x,y:a[s].y,w:151,h:189,delay:3,userData:{name:"npc",name2:"npc1",name3:"Маркус",timeAnim:200,npcID:1e-4,svet:!0}})),"level14"==a[s].name&&level14.push(a[s]),"loot"==a[s].name&&wallCenter.push(a[s]),"shadow"==a[s].name&&shadow.push(a[s]),"tp"==a[s].name&&((tp=game.newAnimationObject({animation:tiles.newImage("resources/obj/teleport_300_200_12_3.webp").getAnimation(0,0,300,200,12),x:a[s].x,y:a[s].y,w:161,h:107,delay:3,alpha:.6,userData:{open:!1,svet:!1,level:LEVEL}})).setStaticBox(65,43,-129,-86),shadow.push(game.newImageObject({file:"resources/players/playerShadow.webp",x:a[s].x-70,y:a[s].y-70,w:300,h:250,alpha:.6}))),1==LEVEL&&"batGen"==a[s].name&&(batGen=a[s]),2==LEVEL&&"moleGen"==a[s].name&&(moleGen=a[s])}for(var r=0;r<LevelList[LEVEL][5];r++){var o=random(0,i.length-1,!1);wallCenter.push(game.newAnimationObject({animation:tiles.newImage("resources/obj/chest_150_150_13_5.webp").getAnimation(0,0,150,150,13),x:i[o].x,y:i[o].y,w:105,h:105,delay:5,startFrame:1,userData:{name:"chest",svet:!1,title:"Старый сундук",open:!1,loot:[7,12,8,6],chance:[drop80,drop70,drop50,drop40]}})),wallCenter[wallCenter.length-1].setFlip(random(0,1,!1),0),stop.push(game.newRectObject({x:wallCenter[wallCenter.length-1].x,y:wallCenter[wallCenter.length-1].y,w:wallCenter[wallCenter.length-1].w,h:wallCenter[wallCenter.length-1].h,fillColor:"black"})),stop[stop.length-1].setStaticBox(27,36,-58,-96)}if(tp&&(tp.open=LevelList[LEVEL][2],tp.svet=LevelList[LEVEL][2],p)&&(player.setPositionC(point(tp.getPositionC().x,tp.getPositionC().y-30)),camera.setPositionC(point(tp.getPositionC().x,tp.getPositionC().y-30))),1==LEVEL&&0<memoryWallLightLevel1.length)for(var s in memoryWallLightLevel1)wall[memoryWallLightLevel1[s]].svet=!0;else if(2==LEVEL&&0<memoryWallLightLevel2.length)for(var s in memoryWallLightLevel2)wall[memoryWallLightLevel2[s]].svet=!0;for(s in wallPos)(player.getDistanceC(wall[s])<250||wall[s].svet)&&("wall"==wall[s].name&&wallRender.push(Number(s)),"wallF"==wall[s].name)&&wallFRender.push(Number(s));player&&wallCenter.push(player)},!0))},a.levelName=function(){brush.drawTextS({text:LevelList[LEVEL][1],x:WH.w-OOP.getTextWidth({text:LevelList[LEVEL][1],size:20})-10,y:10,size:20,color:"#eeeeee",alpha:.6}),brush.drawTextS({text:"fps: "+system.getFPS(),x:WH.w-65,y:40,size:20,color:"#eeeeee",alpha:.6})}},PointJS.Module=function(e){"use strict";drop100=[2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,71,72,73,74,75,75,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100],drop90=[2,3,4,5,6,7,8,10,11,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,30,31,32,33,34,35,37,38,40,41,42,43,45,46,47,48,50,51,52,53,54,55,56,57,58,60,61,62,63,64,65,66,67,68,70,71,72,73,74,75,75,77,78,80,81,82,83,84,85,86,87,88,90,91,92,93,94,95,96,97,98,100],drop80=[3,4,5,6,7,8,10,13,14,15,16,17,18,20,21,22,24,25,26,27,28,31,32,34,35,36,37,38,40,41,42,43,45,46,48,50,52,53,54,55,56,57,61,62,63,64,65,66,67,68,71,72,74,75,75,78,80,81,83,84,85,86,87,88,91,92,93,94,95,96,98,100],drop70=[2,4,5,6,7,8,10,13,15,16,17,18,21,22,24,25,26,27,28,31,32,34,35,37,38,41,42,43,45,46,48,50,52,53,55,56,57,61,62,63,64,66,67,68,71,72,74,75,75,77,81,83,84,85,86,87,88,91,93,94,95,96,98,100],drop60=[4,5,6,7,8,13,15,16,17,18,21,22,24,25,26,28,31,32,34,35,37,42,43,45,46,48,50,52,53,56,57,61,62,63,64,67,68,71,74,75,75,77,83,84,85,86,87,88,91,94,95,96,98,100],drop50=[5,6,7,8,12,13,15,16,17,21,22,24,25,28,31,32,34,37,43,44,45,46,48,50,51,52,53,57,61,62,63,64,68,70,74,75,75,83,84,85,86,88,91,94,95,96,100],drop40=[6,7,8,13,15,16,21,22,24,28,31,32,36,37,45,46,48,51,52,53,57,61,62,63,64,74,75,75,84,85,86,88,91,95,96,100],drop30=[7,8,21,22,24,28,31,32,37,45,46,48,51,52,61,62,63,64,74,75,75,77,84,85,86,88,91,95,96,100],drop20=[7,15,21,24,32,36,37,46,51,53,57,64,74,75,84,85,86,96,100],drop10=[12,36,44,51,63,77,86,97,100],drop5=[20,40,60,80,100],drop2=[30,70,100],drop1=[1],LOOT={7:game.newImageObject({file:"resources/loot/alpha/h1.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"life1",file2:"resources/loot/background/hback1.webp",file3:"resources/loot/alpha/h1.webp",title1:"Легкое зелье здоровья",title2:"Восстанавливает 20 здоровья",svet:!1,hp:20,count:1,stek:!0,dragF12:!0}}),8:game.newImageObject({file:"resources/loot/alpha/h2.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"life2",file2:"resources/loot/background/hback2.webp",file3:"resources/loot/alpha/h2.webp",title1:"Малое зелье здоровья",title2:"Восстанавливает 40 здоровья",svet:!1,hp:40,count:1,stek:!0,dragF12:!0}}),6:game.newImageObject({file:"resources/loot/alpha/eatFairy.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"eatFairy",file2:"resources/loot/background/eatFairyBack1.webp",file3:"resources/loot/alpha/eatFairy.webp",title1:"Пища фей",title2:"Восстанавливает 10 жизни",svet:!1,expFairy:10,count:1,stek:!0,dragF12:!0}}),1:game.newImageObject({file:"resources/loot/alpha/fairy.webp",x:0,y:0,w:40,h:40,delay:2,userData:{name:"loot",name2:"fairy",file2:"resources/loot/background/fairyBack1.webp",file3:"resources/loot/alpha/fairy.webp",title1:"Фея силы",title2:"Сила:",svet:!1,life:50,fairyLv:1,fairyExp:0,count:1,stek:!1,dragF12:!1}}),12:game.newImageObject({file:"resources/loot/alpha/torch2.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"light",file2:"resources/loot/background/tback1.webp",file3:"resources/loot/alpha/torch2.webp",title1:"Факел",title2:"Освещает местность",svet:!1,count:1,stek:!0,dragF12:!0}}),13:game.newImageObject({file:"resources/loot/alpha/13.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"13",file2:"resources/loot/background/13.webp",file3:"resources/loot/alpha/13.webp",title1:"Клык летучей мыши",title2:"Лут",svet:!1,count:1,stek:!0,dragF12:!1}}),14:game.newImageObject({file:"resources/loot/alpha/14.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"14",file2:"resources/loot/background/14.webp",file3:"resources/loot/alpha/14.webp",title1:"Серебряная руда",title2:"Лут",svet:!1,count:1,stek:!0,dragF12:!1}}),15:game.newImageObject({file:"resources/loot/alpha/15.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"15",file2:"resources/loot/background/15.webp",file3:"resources/loot/alpha/15.webp",title1:"Череп воина",title2:"Лут",svet:!1,count:1,stek:!0,dragF12:!1}}),4e3:game.newImageObject({file:"resources/players/equipment/0/alpha/body/4000.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"body",file2:"resources/players/equipment/0/background/body/4000.webp",file3:"resources/players/equipment/0/alpha/body/4000.webp",title1:"Карибский костюм",title2:"Лут",svet:!1,count:1,stek:!1,dragF12:!1}}),4001:game.newImageObject({file:"resources/players/equipment/0/alpha/body/4001.webp",x:0,y:0,w:40,h:40,userData:{name:"loot",name2:"body",file2:"resources/players/equipment/0/background/body/4001.webp",file3:"resources/players/equipment/0/alpha/body/4001.webp",title1:"Ангельский кот",title2:"Лут",svet:!1,count:1,stek:!1,dragF12:!1}})}},PointJS.Module=function(e){"use strict";MOB={bat:{1:tiles.newImage("resources/wmob/bat/batIdel_220_220_6_4.webp").getAnimation(0,0,220,220,6),2:tiles.newImage("resources/wmob/bat/batRun_220_220_14_4.webp").getAnimation(0,0,220,220,14),3:tiles.newImage("resources/wmob/bat/batAttack_220_220_16_4.webp").getAnimation(0,0,220,220,16),4:tiles.newImage("resources/wmob/bat/batDie_220_220_10_4.webp").getAnimation(0,0,220,220,10),5:0},mole:{1:tiles.newImage("resources/wmob/mole/moleIdel_262_170_12_5.webp").getAnimation(0,0,262,170,12),2:tiles.newImage("resources/wmob/mole/moleRun_262_170_13_4.webp").getAnimation(0,0,262,170,13),3:tiles.newImage("resources/wmob/mole/moleAttack_262_170_21_4.webp").getAnimation(0,0,262,170,21),4:tiles.newImage("resources/wmob/mole/moleDie_262_170_16_4.webp").getAnimation(0,0,262,170,16),5:0}};var t=OOP.newTimer(300,function(){for(var e in MOB)for(var t in wallCenter)wallCenter[t].name==e&&0<wallCenter[t].life&&(wallCenter[t].timeMove<0&&player.life<0?(wallCenter[t].anim.image.file!=MOB[e][2].image.file&&wallCenter[t].setAnimation(MOB[e][2]),wallCenter[t].pos=point(wallCenter[t].getPositionC().x+random(-500,500,!1),wallCenter[t].getPositionC().y+random(-500,500,!1)),wallCenter[t].timeMove=random(50,400,!0),wallCenter[t].pos.x>wallCenter[t].x+wallCenter[t].w/2?wallCenter[t].setFlip(0,0):wallCenter[t].setFlip(1,0)):300<wallCenter[t].getDistanceC(player.getPositionC())&&wallCenter[t].timeMove<0&&0<player.life?(wallCenter[t].anim.image.file!=MOB[e][1].image.file&&wallCenter[t].setAnimation(MOB[e][1]),wallCenter[t].pos=point(wallCenter[t].getPositionC().x+random(-500,500,!1),wallCenter[t].getPositionC().y+random(-500,500,!1)),wallCenter[t].timeMove=random(50,400,!0),wallCenter[t].pos.x>wallCenter[t].x+wallCenter[t].w/2?wallCenter[t].setFlip(0,0):wallCenter[t].setFlip(1,0)):player.isStaticIntersect(wallCenter[t].getStaticBox())&&0<player.life?(wallCenter[t].pos=wallCenter[t].getPositionC(),wallCenter[t].timeAttack<0&&(wallCenter[t].anim.image.file!=MOB[e][3].image.file&&wallCenter[t].setAnimation(MOB[e][3]),wallCenter[t].timeAttack=wallCenter[t].timeAttackMemory)):wallCenter[t].getDistanceC(player.getPositionC())<300&&wallCenter[t].timeMove<0&&0<player.life&&(wallCenter[t].anim.image.file!=MOB[e][2].image.file&&wallCenter[t].setAnimation(MOB[e][2]),wallCenter[t].pos=player.getPositionC(),wallCenter[t].timeMove=random(10,50,!0),wallCenter[t].pos.x>wallCenter[t].x+wallCenter[t].w/2?wallCenter[t].setFlip(0,0):wallCenter[t].setFlip(1,0)))}),a=OOP.newTimer(1e3,function(){if(0<player.life)for(var e in wall)if(wall[e].getDistanceC(player.getPositionC())<250&&!wall[e].stop&&!wall[e].stop2&&!wall[e].stop2&&"RectObject"!=wall[e].type&&120!=wall[e].w&&120!=wall[e].h&&wall[e].alpha<=.5){1==LEVEL&&MOB.bat[5]<=8&&(MOB.bat[5]++,wallCenter.push(game.newAnimationObject({animation:MOB.bat[1],x:wall[e].getPositionC().x-78.5,y:wall[e].getPositionC().y-78.5,w:157,h:157,delay:4,userData:{name:"bat",name2:"Серая летучая мышь",name3:"mob",level:1,def:1,dodge:3,force:10,exp:15,pos:point(player.getPositionC().x,player.getPositionC().y),timeMove:30,timeAttack:-10,timeAttackMemory:150,speed:5,life:20,lifeMemory:20,wLife:80,svet:!1,loot:[13,7,12,6,8,15,1],chance:[drop90,drop80,drop70,drop20,drop10,drop10,drop100]}})),wallCenter[wallCenter.length-1].setStaticBox(37,24,-86,-70),wallCenter[wallCenter.length-1].setCenter(point(-6,-11))),2==LEVEL&&MOB.mole[5]<=8&&(MOB.mole[5]++,wallCenter.push(game.newAnimationObject({animation:MOB.mole[1],x:wall[e].getPositionC().x-92.5,y:wall[e].getPositionC().y-60,w:185,h:120,delay:4,userData:{name:"mole",name2:"Крот-рудокоп",name3:"mob",level:2,def:2,dodge:5,force:13,exp:30,pos:point(player.getPositionC().x,player.getPositionC().y),timeMove:30,timeAttack:-10,timeAttackMemory:150,speed:4,life:40,lifeMemory:40,wLife:80,svet:!1,loot:[14,7,12,8,6,15,1],chance:[drop90,drop80,drop70,drop30,drop10,drop10,drop1]}})),wallCenter[wallCenter.length-1].setStaticBox(16,0,-128,-36),wallCenter[wallCenter.length-1].setCenter(point(-48,19)));break}});e.mobMove=function(){t.restart(300)},e.mobGenerate=function(){1==LEVEL?a.restart(2e4):2==LEVEL&&a.restart(3e4)}},PointJS.Module=function(e){"use strict";e.playerMoveCollision=function(){for(var e in playerShadow.setPositionC(point(player.getPositionC().x+1,player.getPositionC().y+30)),0<=player.life&&"resources/players/wgirl/rest_128_128_5_5.webp"!=player.anim.image.file&&(key.isDown("W")&&key.isDown("D")?(player.x+=player.speedMove,player.y-=player.speedMove):key.isDown("W")&&key.isDown("A")?(player.x-=player.speedMove,player.y-=player.speedMove):key.isDown("S")&&key.isDown("D")?(player.x+=player.speedMove,player.y+=player.speedMove):key.isDown("S")&&key.isDown("A")?(player.x-=player.speedMove,player.y+=player.speedMove):key.isDown("D")?player.x+=player.speedMove:key.isDown("A")?player.x-=player.speedMove:key.isDown("W")?player.y-=player.speedMove:key.isDown("S")&&(player.y+=player.speedMove)),stop)stop[e].isInCamera()&&(stop[e].isStaticIntersect(player.getStaticBoxD(0,0,player.speedMove,0))?player.x-=player.speedMove:stop[e].isStaticIntersect(player.getStaticBoxA(-player.speedMove,0,player.speedMove,0))&&(player.x+=player.speedMove),stop[e].isStaticIntersect(player.getStaticBoxW(0,-player.speedMove,0,player.speedMove))?player.y+=player.speedMove:stop[e].isStaticIntersect(player.getStaticBoxS(0,0,0,player.speedMove))&&(player.y-=player.speedMove));if(0<=player.life&&(key.isPress("G")&&("resources/players/wgirl/rest_128_128_5_5.webp"!=player.anim.image.file?player.setAnimation(tiles.newImage("resources/players/wgirl/rest_128_128_5_5.webp").getAnimation(0,0,128,128,5)):"resources/players/wgirl/rest_128_128_5_5.webp"==player.anim.image.file&&player.setAnimation(tiles.newImage("resources/players/wgirl/idle_128_128_5_5.webp").getAnimation(0,0,128,128,5))),"resources/players/wgirl/rest_128_128_5_5.webp"!=player.anim.image.file&&(key.isDown("D")&&"resources/players/wgirl/attack1_128_128_6_6.webp"!=player.anim.image.file?(player.setFlip(0,0),"resources/players/wgirl/walk_128_128_8_5.webp"!=player.anim.image.file&&player.setAnimation(tiles.newImage("resources/players/wgirl/walk_128_128_8_5.webp").getAnimation(0,0,128,128,8))):key.isDown("A")&&"resources/players/wgirl/attack1_128_128_6_6.webp"!=player.anim.image.file?(player.setFlip(1,0),"resources/players/wgirl/walk_128_128_8_5.webp"!=player.anim.image.file&&player.setAnimation(tiles.newImage("resources/players/wgirl/walk_128_128_8_5.webp").getAnimation(0,0,128,128,8))):key.isDown("W")||key.isDown("S")&&"resources/players/wgirl/attack1_128_128_6_6.webp"!=player.anim.image.file?"resources/players/wgirl/walk_128_128_8_5.webp"!=player.anim.image.file&&player.setAnimation(tiles.newImage("resources/players/wgirl/walk_128_128_8_5.webp").getAnimation(0,0,128,128,8)):"resources/players/wgirl/attack1_128_128_6_6.webp"!=player.anim.image.file&&"resources/players/wgirl/idle_128_128_5_5.webp"!=player.anim.image.file&&player.setAnimation(tiles.newImage("resources/players/wgirl/idle_128_128_5_5.webp").getAnimation(0,0,128,128,5)),mouse.isInStatic(guiQuest.getStaticBox())&&guiQuestFlag||0!=npcActiv||0!=player.flagAttack||mouse.isInStatic(inv1.getStaticBox())||mouse.isInStatic(backBTN.getStaticBox())||mouse.isInStatic(rectF12.getStaticBox())||!mouse.isPress("LEFT")||"resources/players/wgirl/attack1_128_128_6_6.webp"==player.anim.image.file||"resources/players/wgirl/rest_128_128_5_5.webp"==player.anim.image.file||(player.setAnimation(tiles.newImage("resources/players/wgirl/attack1_128_128_6_6.webp").getAnimation(0,0,128,128,6)),player.flagAttack=!0),"resources/players/wgirl/attack1_128_128_6_6.webp"==player.anim.image.file)&&4<player.getFrame()&&player.setAnimation(tiles.newImage("resources/players/wgirl/idle_128_128_5_5.webp").getAnimation(0,0,128,128,5)),mouse.isPress("LEFT"))&&(mouse.getPosition().x<player.x+player.w/2?(player.setFlip(1,0),playerShadow.setFlip(1,0)):mouse.getPosition().x>player.x+player.w/2&&(player.setFlip(0,0),playerShadow.setFlip(0,0))),"resources/players/wgirl/attack1_128_128_6_6.webp"==player.anim.image.file&&1<player.getFrame()&&hit.play(),player.life<=0&&(backBTN.h=44,backBTN.setPositionS(point(WH.w/2-86,WH.h-130)),"resources/players/wgirl/dead_128_128_5_8.webp"!=player.anim.image.file&&(playerDie.play(),player.life=-1,guiM.anim.x=160,player.setAnimation(tiles.newImage("resources/players/wgirl/dead_128_128_5_8.webp").getAnimation(0,0,128,128,5))),"resources/players/wgirl/dead_128_128_5_8.webp"==player.anim.image.file)){if(mouse.isInStatic(backBTN.getStaticBox())){if(0==btmFlag&&btm.replay(),btmFlag=!0,backBTN.fillColor="#16202a",0==btmFlag&&btm.replay(),btmFlag=!0,mouse.isPress("LEFT")){for(var e in wallCenter)wallCenter[e]&&"mob"==wallCenter[e].name3&&wallCenter.splice(e,1);if(1==LEVEL)for(var e in guiHP.anim.x=160,player.exp-=player.exp/2,player.life=1,guiHP.anim.x-=160/player.lifeMemory*10,wallRender.length=0,wallFRender.length=0,player.setPositionC(player.resp),camera.setPositionC(player.resp),wallPos)wall[e].isInCamera()&&(player.getDistanceC(wallPos[e])<250||wall[e].svet)&&(wallRender.push(Number(e)),"wallF"==wall[e].name)&&wallFRender.push(Number(e));else newLevelGo()}}else 1==btmFlag&&btm.replay(),btmFlag=!1,backBTN.fillColor="#24303c",1==btmFlag&&btm.replay(),btmFlag=!1;backBTN.draw()}}},PointJS.Module=function(e){"use strict";NPC={1e-4:{1:tiles.newImage("resources/nps/1/nps13_200_267_32_3.webp").getAnimation(0,0,200,267,32),2:tiles.newImage("resources/nps/1/nps12_200_267_33_3.webp").getAnimation(0,0,200,267,33),3:tiles.newImage("resources/nps/1/nps11_200_267_23_3.webp").getAnimation(0,0,200,267,23)}},QUESTS={1e-4:{1:{1:2,2:"Серые летучие мышей",3:"Серые летучие мыши съели весь урожай фруктов,     заготовленных на зиму.   Если ты сможещь очистить пещеру от этих тварей, я щедро награжу тебя!",4:"Убей 5 летучих мышей",5:"Награда: ",6:0,7:5,8:50,9:1e3,10:!1,11:!1},2:{1:2,2:"Кроты-рудокопы",3:"Кроты-рудокопы снова     активизировались и       уничтожают посевы. Убей  15 кротов, это воодушевитжителей деревни и придастим силы.",4:"Убей 15 кротов-рудокопов",5:"Награда: ",6:0,7:15,8:150,9:1e3,10:!1,11:!1},3:{1:2,2:"Кости воинов",3:"Много наших товарищей    погибло в этих пещерах.  Принеси мне 10 черепов   воинов, чтобы я смог     похоронить их, и души    героев обрели покой.",4:"Собери 10 черепов",5:"Награда: ",6:0,7:10,8:300,9:1e3,10:!1,11:!1}}};var t=game.newRoundRectObject({x:0,y:0,w:185,h:40,radius:6,fillColor:"#1b2231",strokeColor:"#356260",strokeWidth:1,alpha:1}),a=game.newRoundRectObject({x:0,y:0,w:185,h:40,radius:6,fillColor:"#1b2231",strokeColor:"#356260",strokeWidth:1,alpha:1}),i=(guiQuest=game.newRoundRectObject({x:0,y:0,w:380,h:340,radius:10,fillColor:"#212838",strokeColor:"#356260",strokeWidth:1}),game.newRoundRectObject({x:0,y:0,w:380,h:40,radius:6,fillColor:"#212838",strokeColor:"#356260",strokeWidth:1})),n=game.newRoundRectObject({x:0,y:0,w:380,h:240,radius:6,fillColor:"#212838",strokeColor:"#356260",strokeWidth:1}),l=game.newTextObject({x:0,y:0,text:"+",size:40,color:"#356260",font:"Courier",angle:45}),r=[],o=game.newMesh({x:0,y:0,angle:0,add:[]}),s=0,p=0,m=400,w=100,c=OOP.newTimer(100,function(){for(var e=s;e<r.length;e++){o.objs.length<=r.length&&(Number.isInteger(e/25)&&(p=Number(e)),o.add(game.newTextObject({text:r[e],x:14*(e-p),y:0+p,size:18,color:"#ffffff",alpha:1,font:"Courier"}))),s++;break}});e.quest=function(){if(guiQuestFlag&&0<player.life){if(null==idQuest){p=0;for(var e=1;e<Object.keys(QUESTS[npcID]).length+1;e++)if(0==QUESTS[npcID][e][10]&&0==QUESTS[npcID][e][11]){idQuest=e,QUESTS[npcID][e][10]=!0,r=QUESTS[npcID][e][3].split("");break}}0<r.length&&c.restart(30),mouse.isInStatic(l.getStaticBox())?(l.color="#c66e21",mouse.isPress("LEFT")&&(guiQuestFlag=!1)):l.color="#858585",idQuest&&o.objs.length==r.length&&(btmFlag=!!(mouse.isInStatic(t.getStaticBox())&&1==t.alpha||mouse.isInStatic(a.getStaticBox())&&1==a.alpha)&&(0==btmFlag&&btm.replay(),!0)),mouse.isInStatic(guiQuest.getStaticBox())&&mouse.isDown("LEFT")&&(m+=mouse.getSpeed().x,w+=mouse.getSpeed().y),guiQuest.setPositionS(point(m,w)),n.setPositionS(point(m,w)),i.setPositionS(point(m,w)),l.setPosition(point(guiQuest.x+348,guiQuest.y+3)),o.setPositionS(point(m+20,w+60)),guiQuest.draw(),n.draw(),i.draw(),l.draw(),0==questActiv?(t.setPosition(point(guiQuest.x,guiQuest.y+345)),a.setPosition(point(guiQuest.x+195,guiQuest.y+345)),t.draw(),a.draw(),brush.drawTextS({text:"Взять задание",x:m+23,y:w+356,size:18,color:"#f1f1f1",alpha:.7,font:"Courier"}),brush.drawTextS({text:"Отмена",x:m+257,y:w+356,size:18,color:"#f1f1f1",alpha:.7,font:"Courier"})):1==questActiv&&(t.setPositionS(point(-100,-100)),a.setPosition(point(guiQuest.x+95,guiQuest.y+345)),a.draw(),QUESTS[npcID][idQuest][6]<QUESTS[npcID][idQuest][7]?brush.drawTextS({text:"Отмена",x:m+160,y:w+356,size:18,color:"#f1f1f1",alpha:.7}):QUESTS[npcID][idQuest][6]>=QUESTS[npcID][idQuest][7]&&brush.drawTextS({text:"Готово",x:m+160,y:w+356,size:18,color:"#f1f1f1",alpha:.7})),o.draw(),brush.drawTextS({text:"Квесты и задания",x:m+80,y:w+9,size:22,color:"#fdfdfd",alpha:1,font:"Courier"}),idQuest&&o.objs.length==r.length&&(t.alpha=1,a.alpha=1,brush.drawTextS({text:1==questActiv?QUESTS[npcID][idQuest][4]+": "+QUESTS[npcID][idQuest][6]+" / "+QUESTS[npcID][idQuest][7]:"Задание: "+QUESTS[npcID][idQuest][4],x:m+20,y:w+260,size:18,color:"#fdfdfd",alpha:1,font:"Courier"}),brush.drawTextS({text:QUESTS[npcID][idQuest][5]+""+QUESTS[npcID][idQuest][8]+" очков опыта",x:m+20,y:w+300,size:18,color:"#fdfdfd",alpha:1,font:"Courier"}),brush.drawRectS({x:m+120,y:w+256,w:150,h:1,fillColor:"#2a2a2a",alpha:.7})),idQuest&&o.objs.length==r.length&&(mouse.isInStatic(t.getStaticBox())?(t.alpha=.8,t.strokeColor="#c66e21",mouse.isPress("LEFT")&&(questActiv=!0)):(t.alpha=1,t.strokeColor="#356260"),mouse.isInStatic(a.getStaticBox())?(a.alpha=.8,a.strokeColor="#c66e21",mouse.isPress("LEFT")&&(btm.play(),1==questActiv&&QUESTS[npcID][idQuest][6]>=QUESTS[npcID][idQuest][7]&&(player.exp+=QUESTS[npcID][idQuest][8],638<638/player.expLevel*player.exp&&(levelUp.play(),player.exp=0+QUESTS[npcID][idQuest][7]/2,player.level++,player.life+=50,player.lifeMemory+=50,player.force++,player.def++,player.mana++,player.manaMemory+=50),QUESTS[npcID][idQuest][10]=!1,QUESTS[npcID][idQuest][11]=!0),t.alpha=1,QUESTS[npcID][idQuest][10]=!1,QUESTS[npcID][idQuest][6]=0,t.alpha=.4,a.alpha=.4,o.objs.length=0,t.strokeColor="#356260",t.alpha=1,a.strokeColor="#356260",a.alpha=1,p=s=0,r.length=0,idQuest=void 0,questActiv=guiQuestFlag=!1)):(a.alpha=1,a.strokeColor="#356260"))}}},PointJS.Module=function(a){"use strict";smiles=game.newAnimationObject({animation:tiles.newImage("resources/smiles/smile9_64_64_2_5.png").getAnimation(0,0,64,64,2),x:0,y:0,w:46,h:46,delay:5,userData:{time:0}}),a.smiles=function(){function e(e,t){(0,a.keyControl.isPress)(e)&&(smiles.anim.image=tiles.newImage(t),smiles.time=200)}e("T","resources/smiles/smile2_64_64_2_5.png"),e("Y","resources/smiles/smile3_64_64_2_5.png"),e("U","resources/smiles/smile4_64_64_2_5.png"),e("I","resources/smiles/smile5_64_64_2_5.png"),e("O","resources/smiles/smile6_64_64_2_5.png"),e("P","resources/smiles/smile7_64_64_2_5.png"),e("{","resources/smiles/smile1_64_64_2_5.png"),e("}","resources/smiles/smile7_64_64_2_5.png"),e("H","resources/smiles/smile9_64_64_2_5.png"),e("J","resources/smiles/smile12_64_64_2_5.png"),e("K","resources/smiles/smile13_64_64_2_5.png"),e("L","resources/smiles/smile14_64_64_2_5.png"),e(":","resources/smiles/smile15_64_64_2_5.png"),e("N","resources/smiles/smile16_64_64_2_5.png"),e("M","resources/smiles/smile18_64_64_2_5.png"),e("<","resources/smiles/smile19_64_64_2_5.png"),e(">","resources/smiles/smile20_64_64_2_5.png"),0<smiles.time&&(smiles.setPosition(point(player.getPosition().x+35,player.getPosition().y)),smiles.time--,smiles.draw())}},PointJS.Module=function(e){"use strict";var a=100,i=100,n=game.newRoundRectObject({x:0,y:0,w:280,h:400,radius:10,fillColor:"#212838",strokeColor:"#356260",strokeWidth:1}),l=game.newRoundRectObject({x:0,y:0,w:280,h:40,radius:6,fillColor:"#212838",strokeColor:"#356260",strokeWidth:1}),r=[],o=game.newAnimationObject({animation:tiles.newImage("resources/obj/tpAnim_200_200_12_5.webp").getAnimation(0,0,200,200,12),x:0,y:0,w:200,h:260,delay:5});e.tpOpenDraw=function(){tp&&(0==tp.open&&player.getDistanceC(tp.getPositionC())<250&&(tp.svet=!0,tp.drawFrame(1)),player.isStaticIntersect(tp.getStaticBox())?(0==tp.open&&teleportOpen.play(),tp.open=!0,tpFlag=!0,LevelList[LEVEL][2]=!0):tpFlag=!1,1==tp.open)&&tp.svet&&(tp.alpha<=.8&&(tp.alpha+=.04),tp.draw())},e.tpGoo=function(){if(1==tpFlag&&0<player.life){for(var e in mouse.isInStatic(n.getStaticBox())&&mouse.isDown("LEFT")&&(a+=mouse.getSpeed().x,i+=mouse.getSpeed().y),n.setPositionS(point(a,i)),l.setPositionS(point(a,i)),n.draw(),l.draw(),brush.drawTextS({text:"Телепорт",x:a+90,y:i+10,size:22,color:"#fdfdfd",alpha:1,font:"Courier"}),r.length=0,LevelList)r.push(game.newTextObject({x:0,y:0,text:LevelList[e][4],size:20,color:"#fafafa",alpha:1==LevelList[e][2]?.7:.2,font:"Courier",userData:{level:LevelList[e][3]}}));for(var t in r)r[t].setPositionS(point(a+40,i+80+40*t)),.7<=r[t].alpha&&(mouse.isInStatic(r[t].getStaticBox())?(r[t].alpha=1,mouse.isPress("LEFT")&&LEVEL!=r[t].level&&(newLevelGo("1",r[t].level),tpFlagAnim=!0)):r[t].alpha=.7),r[t].draw()}tpFlagAnim&&(o.setPosition(point(tp.getPosition().x-20,tp.getPosition().y-162)),o.drawToFrame(11),11<=o.getFrame())&&(o.setFrame(0),o.startFrame=1,tpFlagAnim=!1)}},PointJS.Module=function(e){"use strict";e.wallCenterSort=function(){for(var t in lengthNearestFire=0,wallCenter){if(wallCenter[t]&&"fire"==wallCenter[t].name){lengthNearestFire++,wallCenter[t].draw(),wallCenter[t].timeLight--,wallCenter[t].timeLight<=0&&(wallCenter[t].alpha-=.05);for(var e=void 0,a=0;a<lengthNearestFire;a++){null==e&&(e=player.getDistanceC(wallCenter[t].getPositionC()),nearestFire=wallCenter[t]);var i=player.getDistanceC(wallCenter[t].getPositionC());i<e&&(e=i,nearestFire=wallCenter[t])}nearestFire&&(player.getDistanceC(nearestFire.getPositionC())<300?FIRE.setVolume(1-player.getDistanceC(nearestFire.getPositionC())/300):FIRE.setVolume(0)),wallCenter[t].alpha<=0&&(FIRE.setVolume(0),wallCenter.splice(t,1))}if(wallCenter[t]&&wallCenter[t].isInCamera()){for(var n in MOB)if(wallCenter[t]&&wallCenter[t].name==n){player.life<0&&wallCenter[t].getDistanceC(wallCenter[t].pos)<wallCenter[t].speed&&wallCenter[t].setAnimation(MOB[n][1]),wallCenter[t].timeMove--,wallCenter[t].timeAttack--;var l=wallCenter[t].getPositionC(),r=(wallCenter[t].getDistanceC(wallCenter[t].pos)>wallCenter[t].speed&&wallCenter[t].moveToC(wallCenter[t].pos,wallCenter[t].speed-1),wallCenter[t].getPositionC());for(c in l.x<r.x?wallCenter[t].setFlip(0,0):l.x>r.x&&wallCenter[t].setFlip(1,0),stop)wallCenter[t].isStaticIntersect(stop[c].getStaticBox())&&(wallCenter[t].setPositionC(l),wallCenter[t].pos=l);if(wallCenter[t].anim.image.file==MOB[n][3].image.file&&(6==wallCenter[t].getFrame()&&(random(0,100,!1)>=player.dodge?player.def-player.level/2<wallCenter[t].force?(player.life-=wallCenter[t].force-player.def-player.level/3,guiHP.anim.x+=160/player.lifeMemory*(wallCenter[t].force-player.def-player.level/3),wallCenter[t].setFrame(7),playerHit.push(game.newTextObject({x:player.getStaticBox().x+player.getStaticBox().w/2-OOP.getTextWidth({text:" ",size:40})/2-5,y:player.y+10,text:"-"+Math.ceil(wallCenter[t].force-player.def-player.level/3),size:40,color:"#dd2105",font:"Brush Script MT",userData:{time:100}}))):(--player.life,guiHP.anim.x+=160/player.lifeMemory,wallCenter[t].setFrame(7),playerHit.push(game.newTextObject({x:player.getStaticBox().x+player.getStaticBox().w/2-OOP.getTextWidth({text:" ",size:40})/2-5,y:player.y+10,text:"-1",size:40,color:"#dd2105",font:"Brush Script MT",userData:{time:100}}))):playerHit.push(game.newTextObject({x:player.getStaticBox().x+player.getStaticBox().w/2-30-OOP.getTextWidth({text:" ",size:30})/2,y:player.y+10,text:"MISS",size:30,color:"#35ba1b",font:"Comic Sans MS",userData:{time:100}})),wallCenter[t].setFrame(7)),wallCenter[t].getFrame()>wallCenter[t].anim.frameCount-2)&&wallCenter[t].anim.image.file!=MOB[n][1].image.file&&wallCenter[t].setAnimation(MOB[n][1]),0<player.life&&0==player.flagAttack&&0<wallCenter[t].life&&mouse.isInStatic(wallCenter[t].getStaticBox())&&!mouse.isInStatic(guiQuest.getStaticBox())&&!mouse.isInStatic(backBTN.getStaticBox())&&!mouse.isInStatic(rectF12.getStaticBox())&&player.isStaticIntersect(wallCenter[t].getStaticBox())&&mouse.isPress("LEFT")&&"resources/players/girl/rest_128_128_5_5.png"!=player.anim.image.file){if(random(0,100,!1)>wallCenter[t].dodge){if(soundHit[n][1].play(),wallCenter[t].def<player.force+player.level/2){wallCenter[t].life-="fairy"==F12[9].name?player.force+10*F12[9].fairyLv-wallCenter[t].def-player.level/3:player.force-wallCenter[t].def-player.level/3,wallCenter[t].wLife=80*wallCenter[t].life/wallCenter[t].lifeMemory,playerHit.push(game.newTextObject({x:wallCenter[t].getStaticBox().x+wallCenter[t].getStaticBox().w/2-OOP.getTextWidth({text:" ",size:40})/2-5,y:wallCenter[t].y+10,text:"fairy"==F12[9].name?"+"+Math.ceil(player.force+10*F12[9].fairyLv-wallCenter[t].def-player.level/3):"+"+Math.ceil(player.force-wallCenter[t].def-player.level/3),size:40,color:"#dd7b05",font:"Brush Script MT",userData:{time:100}}));break}--wallCenter[t].life,wallCenter[t].wLife=80*wallCenter[t].life/wallCenter[t].lifeMemory,playerHit.push(game.newTextObject({x:wallCenter[t].getStaticBox().x+wallCenter[t].getStaticBox().w/2-OOP.getTextWidth({text:" ",size:40})/2-5,y:wallCenter[t].y+10,text:"-1",size:40,color:"#dd7b05",font:"Brush Script MT",userData:{time:100}}));break}playerHit.push(game.newTextObject({x:wallCenter[t].getStaticBox().x+wallCenter[t].getStaticBox().w/2-OOP.getTextWidth({text:" ",size:30})/2-26,y:wallCenter[t].y+10,text:"MISS",size:30,color:"#c53a1d",font:"Comic Sans MS",userData:{time:100}}))}if(wallCenter[t].life<=0&&0==wallCenter[t].getFrame()&&wallCenter[t].anim.image.file!=MOB[n][4].image.file){wallCenter[t].setAnimation(MOB[n][4]),player.exp+=wallCenter[t].exp,638<638/player.expLevel*player.exp&&(levelUp.play(),player.exp=0+wallCenter[t].exp/2,player.level++,player.expLevel=2*player.expLevel,player.life+=50,player.lifeMemory+=50,player.force++,player.def++,player.mana++,player.manaMemory+=50);var o=random(0,100,!1);for(v in LOOT)for(var s=0;s<wallCenter[t].loot.length;s++)wallCenter[t].loot[s]==v&&wallCenter[t].chance[s].includes(o)&&(dropLoot.play(),wallCenter.push(game.newImageObject({file:LOOT[v].file,x:wallCenter[t].getPositionC().x+random(-30,30,!1),y:wallCenter[t].getPositionC().y+random(-30,30,!1),w:40,h:40,userData:{name:"loot",svet:!1,name2:LOOT[v].name2,file2:LOOT[v].file2,file3:LOOT[v].file3,title1:LOOT[v].title1,title2:LOOT[v].title2,count:LOOT[v].count,hp:LOOT[v].hp,expFairy:LOOT[v].expFairy,life:LOOT[v].life,fairyLv:LOOT[v].fairyLv,fairyExp:LOOT[v].fairyExp,stek:LOOT[v].stek,dragF12:LOOT[v].dragF12}})))}wallCenter[t].anim.image.file==MOB[n][4].image.file&&wallCenter[t].getFrame()>wallCenter[t].anim.frameCount-2&&(1==questActiv&&npcID&&(1==QUESTS[npcID][1][10]&&"bat"==wallCenter[t].name&&QUESTS[npcID][1][6]<QUESTS[npcID][1][7]&&(QUESTS[npcID][1][6]+=1),1==QUESTS[npcID][2][10])&&"mole"==wallCenter[t].name&&QUESTS[npcID][2][6]<QUESTS[npcID][2][7]&&(QUESTS[npcID][2][6]+=1),0<MOB[n][5]&&MOB[n][5]--,wallCenter.splice(t,1))}var p,m;if(wallCenter[t])if("loot"==wallCenter[t].name)if(player.getDistanceC(wallCenter[t].getPositionC())<130&&0<player.life&&(mouse.isPress("LEFT")||key.isDown("E")))if(key.isDown("E")&&(p=e=>e.name2==wallCenter[t].name2),p=mouse.isInStatic(wallCenter[t].getStaticBox())?e=>e.name2==wallCenter[t].name2:p){var w=!1;if(npcID&&1==QUESTS[npcID][3][10]&&"15"==wallCenter[t].name2&&QUESTS[npcID][3][6]<QUESTS[npcID][3][7]&&(QUESTS[npcID][3][6]+=1),0==inventar.some(p)){for(var c in gett.play(),inventar)if(null==inventar[c].name2&&"block"!=inventar[c].name){w=!0,inventar[c].setImage(wallCenter[t].file2),inventar[c].name2=wallCenter[t].name2,inventar[c].file2=wallCenter[t].file2,inventar[c].file3=wallCenter[t].file3,inventar[c].title1=wallCenter[t].title1,inventar[c].title2=wallCenter[t].title2,inventar[c].count=wallCenter[t].count,inventar[c].hp=wallCenter[t].hp,inventar[c].expFairy=wallCenter[t].expFairy,inventar[c].fairyLv=wallCenter[t].fairyLv,inventar[c].fairyExp=wallCenter[t].fairyExp,inventar[c].stek=wallCenter[t].stek,inventar[c].dragF12=wallCenter[t].dragF12;break}}else if(1==inventar.some(p)){for(var c in gett.play(),inventar)if(inventar[c].name2==wallCenter[t].name2&&inventar[c].count<99&&wallCenter[t].stek){w=!0,inventar[c].count+=wallCenter[t].count;break}if(0==w)for(var c in inventar){if(inventar[c].name2==wallCenter[t].name2&&99==inventar[c].count||!wallCenter[t].stek)for(var a in inventar)if(null==inventar[a].name2&&"block"!=inventar[a].name){w=!0,inventar[a].setImage(wallCenter[t].file2),inventar[a].name2=wallCenter[t].name2,inventar[a].file2=wallCenter[t].file2,inventar[a].file3=wallCenter[t].file3,inventar[a].title1=wallCenter[t].title1,inventar[a].title2=wallCenter[t].title2,inventar[a].count=wallCenter[t].count,inventar[a].hp=wallCenter[t].hp,inventar[c].expFairy=wallCenter[t].expFairy,inventar[c].fairyLv=wallCenter[t].fairyLv,inventar[c].fairyExp=wallCenter[t].fairyExp,inventar[c].stek=wallCenter[t].stek,inventar[c].dragF12=wallCenter[t].dragF12;break}break}}1==w&&wallCenter.splice(t,1),w=!1}if(wallCenter[t]&&(player.getDistanceC(wallCenter[t].getPositionC())<250||wallCenter[t].svet)){if("wallC"==wallCenter[t].name&&wallCenter[t].draw(),"chest"==wallCenter[t].name)if(brush.drawImage({file:"resources/players/playerShadow.webp",x:wallCenter[t].x-8,y:wallCenter[t].y+4,w:128,h:128,alpha:.8}),mouse.isInStatic(wallCenter[t].getStaticBox())&&!wallCenter[t].open&&(brush.drawText({text:wallCenter[t].title,x:wallCenter[t].x+wallCenter[t].w/2-OOP.getTextWidth({text:wallCenter[t].title,size:16})/2,y:wallCenter[t].y-10,size:16,color:"#e8e8e8",alpha:1}),mouse.isDown("LEFT"))&&player.getDistance(wallCenter[t].getPositionC())<100&&(wallCenter[t].open=!0),0==wallCenter[t].open)wallCenter[t].drawFrame(0);else if(wallCenter[t].drawToFrame(12),11==wallCenter[t].getFrame()){wallCenter[t].setFrame(12);var v,o=random(0,100,!1);for(v in LOOT)for(s=0;s<wallCenter[t].loot.length;s++)wallCenter[t].loot[s]==v&&wallCenter[t].chance[s].includes(o)&&(dropLoot.play(),wallCenter.push(game.newImageObject({file:LOOT[v].file,x:wallCenter[t].getPositionC().x+random(-70,70,!1),y:wallCenter[t].getPositionC().y+random(30,60,!1),w:40,h:40,userData:{name:"loot",svet:!1,name2:LOOT[v].name2,file2:LOOT[v].file2,file3:LOOT[v].file3,title1:LOOT[v].title1,title2:LOOT[v].title2,count:LOOT[v].count,hp:LOOT[v].hp,expFairy:LOOT[v].expFairy,life:LOOT[v].life,fairyLv:LOOT[v].fairyLv,fairyExp:LOOT[v].fairyExp,stek:LOOT[v].stek,dragF12:LOOT[v].dragF12}})))}for(var n in NPC)wallCenter[t]&&"npc"==wallCenter[t].name&&wallCenter[t].npcID==n&&(brush.drawImage({file:"resources/players/playerShadow.webp",x:wallCenter[t].x,y:wallCenter[t].y+70,w:128,h:128,alpha:.6}),wallCenter[t].anim.image.file!=NPC[n][2].image.file&&wallCenter[t].anim.image.file!=NPC[n][3].image.file||wallCenter[t].getFrame()>=wallCenter[t].anim.endFrame-1&&wallCenter[t].setAnimation(NPC[n][1]),mouse.isInStatic(wallCenter[t].getStaticBox())?(npcActiv=!0,m=wallCenter[t].getStaticBox(),brush.drawText({text:wallCenter[t].name3,x:m.x+m.w/2-OOP.getTextWidth({text:wallCenter[t].name3,size:16})/2-2,y:m.y-40,size:16,color:"#e3e3e3",alpha:1}),player.getDistanceC(wallCenter[t].getPositionC())<130&&mouse.isPress("LEFT")&&(guiQuestFlag=!0,npcID=wallCenter[t].npcID)):npcActiv=!1,wallCenter[t].draw());"loot"==wallCenter[t].name&&(wallCenter[t].draw(),(key.isDown("TAB")||mouse.isInStatic(wallCenter[t].getStaticBox()))&&wallCenter[t].title1&&(m=wallCenter[t].getStaticBox(),brush.drawRoundRect({x:m.x+m.w/2-OOP.getTextWidth({text:wallCenter[t].title1,size:16})/2-5,y:m.y-11,radius:10,w:OOP.getTextWidth({text:wallCenter[t].title1,size:16})+10,h:18,fillColor:"#1c1c1c",alpha:1}),brush.drawText({text:wallCenter[t].title1,x:m.x+m.w/2-OOP.getTextWidth({text:wallCenter[t].title1,size:16})/2,y:m.y-10,size:16,color:"#e8e8e8",alpha:1})),mouse.isInStatic(wallCenter[t].getStaticBox())?wallCenter[t].alpha=.4:wallCenter[t].alpha=1),"mob"==wallCenter[t].name3&&("bat"==wallCenter[t].name&&brush.drawImage({file:"resources/players/playerShadow.webp",x:wallCenter[t].x+28,y:wallCenter[t].y+80,w:64,h:64,alpha:.6}),"mole"==wallCenter[t].name&&brush.drawImage({file:"resources/players/playerShadow.webp",x:wallCenter[t].x+12,y:wallCenter[t].y+45,w:64,h:64,alpha:.6}),wallCenter[t].draw(),mouse.isInStatic(wallCenter[t].getStaticBox())&&0<wallCenter[t].life&&(m=wallCenter[t].getStaticBox(),brush.drawRect({x:m.x+m.w/2-40,y:m.y,w:wallCenter[t].wLife,h:8,fillColor:"#139c1b",alpha:1,strokeWidth:1}),brush.drawRect({x:m.x+m.w/2-40,y:m.y,w:80,h:8,alpha:1,strokeWidth:1}),brush.drawText({text:wallCenter[t].name2,x:m.x+m.w/2-OOP.getTextWidth({text:wallCenter[t].name2,size:16})/2-5,y:m.y-30,size:18,color:"#f3f3f3",alpha:1}),brush.drawCircle({x:m.x-20,y:m.y-7,radius:9,fillColor:"#b9b9b9",alpha:1,strokeColor:"#171718",strokeWidth:2}),brush.drawText({text:wallCenter[t].level,x:9<wallCenter[t].level?m.x-17:m.x-13,y:m.y-2,size:13,color:"#000000",alpha:1,strokeWidth:1,strokeColor:"#000000"})),wallCenter[t].svet=!1),"player"==wallCenter[t].name&&(player.life<=0?player.drawToFrame(4):0<player.life&&player.draw())}}}if(0<playerHit.length)for(var t in playerHit)playerHit[t]&&(--playerHit[t].time,playerHit[t].y-=.8,playerHit[t].time<50&&(playerHit[t].alpha-=.02),playerHit[t].time<=0)&&playerHit.splice(t,1),playerHit[t]&&playerHit[t].draw()}},game.setLoop("myGame"),game.start();