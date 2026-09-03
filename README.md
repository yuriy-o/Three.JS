# Three.JS — практичний курс

Навчальний проєкт для вивчення [Three.js](https://threejs.org/) — бібліотеки для
роботи з 3D-графікою у браузері поверх WebGL. Код пишеться покроково, кожен
коміт відповідає окремій темі курсу.

## Демо

![Робота джерел світла у сцені](public/img/3_Light.gif)

На анімації — сцена з трьома фігурами, що обертаються, та двома джерелами
світла. Червоне `DirectionalLight` імітує паралельні сонячні промені й освітлює
всю сцену з одного напрямку. Зелений `SpotLight` спрямований конусом на тор і
рухається разом з ним, бо його ціль прив'язана безпосередньо до об'єкта.
Каркасні хелпери показують, де саме розташовані лампи та куди вони світять, а
`AxesHelper` у центрі позначає осі координат: X — червона, Y — зелена, Z — синя.

## Стек

- **Three.js** `^0.185.1` — рендеринг сцени
- **Vite** `^8.2.2` — dev-сервер і збірка

## Що реалізовано

**Основа сцени** — `Scene`, `PerspectiveCamera`, `WebGLRenderer` та цикл
рендерингу через `requestAnimationFrame`.

**Геометрія** — куб (`BoxGeometry`), сфера (`SphereGeometry`), тор
(`TorusGeometry`) і площина (`PlaneGeometry`) з незалежними анімаціями
обертання.

**Матеріали** — порівняння `MeshBasicMaterial` (ігнорує світло),
`MeshPhongMaterial` (дає відблиск через `shininess`) та `MeshStandardMaterial`
(фізично коректна модель). Текстури підвантажуються через `TextureLoader` з
`public/img/`.

**Освітлення** — `AmbientLight`, `PointLight`, `DirectionalLight` і `SpotLight`
з налаштуванням `angle`, `penumbra`, `distance` та `decay`. Для `SpotLight`
показано два способи задати напрямок: через координати `target.position` і через
прив'язку `target` до існуючого об'єкта сцени.

**Хелпери** — `AxesHelper`, `DirectionalLightHelper`, `SpotLightHelper`,
`PointLightHelper` для візуального налагодження.

## Запуск

```bash
npm install
```

```bash
npm run dev
```

Проєкт відкриється на `http://localhost:5173/`.

Збірка у продакшн:

```bash
npm run build
```

## Структура

```
├── css/
│   └── style.css
├── public/
│   └── img/          # текстури та демо-матеріали
├── index.html
├── index.js          # вся логіка сцени
└── package.json
```
