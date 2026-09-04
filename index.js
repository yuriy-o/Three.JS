import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // кращий шлях, менші навантаження

// Сцена
const scene = new THREE.Scene();

// Background
const skyTexture = new THREE.TextureLoader().load('img/sky2.jpg');
skyTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = skyTexture;
skyTexture.mapping = THREE.EquirectangularReflectionMapping;

// Камера
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const clock = new THREE.Clock();

// Світло
//? світло однаково глобально освітлює всі об'єкти в сцені
//? рівномірна підсвітка звідусіль, щоб тіньові боки не були чорними
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambientLight);

//? гола Лампочка // Світло випромінюється з однієї точки в усіх напрямках
// const pointLight = new THREE.PointLight(0xff0000, 10, 100);
// pointLight.position.set(0, 1, 1);
// scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
// scene.add(pointLightHelper);

//? Імітація сонячного світла, промені паралельні
const dirLight = new THREE.DirectionalLight('white', 5);
dirLight.position.set(2, 2, 2);
scene.add(dirLight);

//? Конус (фонарь) // світло з однієї точки в одному напрямку вздовж конуса
// new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
// angle — половина розхилу конуса в радіанах, максимум Math.PI / 2. Не в градусах. Для 30° пишіть Math.PI / 6.
// penumbra — розмитість краю плями, від 0 (різкий обрубаний край) до 1 (м'яке згасання). За замовчуванням 0, і саме через це прожектор часто виглядає «як з мультика».
// distance — на якій відстані світло згасає до нуля; 0 означає «без обмеження».
// decay — швидкість згасання, за замовчуванням 2 (фізично коректно, як у реальному житті).
const spotLight = new THREE.SpotLight('grey', 15, 6);
spotLight.position.set(1.2, 1.1, 2);
scene.add(spotLight);

// Рендер
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // включення демпінгу/замедлення
controls.dampingFactor = 0.01; // значення замедлення
controls.screenSpacePanning = true; // панорамується в просторі екрана
controls.maxDistance = 10;
controls.minDistance = 2;

// Створення фігур
//! Куб
const cubeGeometry = new THREE.BoxGeometry(1, 1.3, 1);

// const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cubeMaterial = new THREE.MeshNormalMaterial({ // грані різного кольору
const cubeMaterial = new THREE.MeshStandardMaterial({
  // грані різного кольору
  map: new THREE.TextureLoader().load('img/paper.jpg'),
  // color: 'white',
});

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-3, -2, 1);
scene.add(cube);

//! Сфера
const sphereGeometry = new THREE.SphereGeometry(0.5, 5, 5);
const textureMaterialSphere = new THREE.TextureLoader().load(
  'img/aqua_abstract.jpg'
);
textureMaterialSphere.colorSpace = THREE.SRGBColorSpace;

const sphereMaterial = new THREE.MeshPhongMaterial({
  // color: 'pink',
  // emissive: '0x000000',
  map: textureMaterialSphere,
  shininess: 30,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(2, 0, 1);

// scene.add(sphere);
// sphereOrbit •► порожній об'єкт в центрі (батько), сфера (дитина) буде обертається навколо батька
const sphereOrbit = new THREE.Object3D();
scene.add(sphereOrbit);
sphereOrbit.add(sphere);

//! Тор
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.7, 0.2, 20, 20),
  // new THREE.MeshBasicMaterial({ color: '#da5f5f' })
  // new THREE.MeshBasicMaterial({
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('img/pixel.jpg'),
  })
);
torus.position.set(1, 1, -3);
scene.add(torus);

// Наведення SpotLight на ціль
// v1
// spotLight.target.position.set(1, 1, -3); // в координати тора
// spotLight.target.position.set(2, 0, 1); // в координати сфери
// scene.add(spotLight.target); // обов'язково додати для варіанту з координатами

// v2
spotLight.target = torus;
dirLight.target = cube;

const spotPointLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotPointLightHelper);

// const dirPointLightHelper = new THREE.PointLightHelper(dirLight, 0.3);
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 0.3);
scene.add(dirLightHelper);

//! Textures
// const texture = new THREE.TextureLoader().load('img/gray.png');
// const textureMaterial = new THREE.MeshBasicMaterial({ map: texture });

// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(3, 3),
//   // new THREE.MeshBasicMaterial({ color: '#2477ca' })
//   textureMaterial
// );
// plane.position.set(-2, 1, -3);
// scene.add(plane);

//! Load • 3D Models

const loader = new GLTFLoader();

// Модель знаходиться по вказаних коордінатах
// loader.load(
//   '3d_models/a_massive_alien_brute/scene.gltf',
//   gltf => {
//     const model = gltf.scene;
//     model.scale.set(0.5, 0.5, 0.5);
//     model.position.set(1, 1, 1);
//     scene.add(model);
//   },
//   xhr => {
//     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
//   },
//   error => {
//     console.log('Error: ' + error);
//   }
// );

// Модель прив'язана до Sphere, як до батька
loader.load('3d_models/a_massive_alien_brute/scene.gltf', gltf => {
  const model = gltf.scene;

  model.scale.set(0.2, 0.2, 0.2);
  model.position.set(0, 0.64, 0); // локальні координати відносно сфери

  sphere.add(model); // замість scene.add(model)
});

// анімована модель
let mixer = null;

loader.load('/3d_models/alien_quadpod/scene.gltf', gltf => {
  const model = gltf.scene;

  model.scale.set(0.3, 0.3, 0.3);
  model.position.set(0, -0.37, 0); // локальні координати відносно сфери
  model.rotation.x = Math.PI;

  sphere.add(model);

  mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();
});

loader.load('3d_models/small_alien_3d_model/scene.gltf', gltf => {
  const model = gltf.scene;

  model.scale.set(0.4, 0.4, 0.4);
  model.position.set(0, 1.05, 0);

  cube.add(model);
});

loader.load('3d_models/fish_mouther/scene.gltf', gltf => {
  const model = gltf.scene;

  model.scale.set(60, 60, 60);
  model.position.set(0, -1.37, 0.1);
  model.rotation.x = Math.PI;

  cube.add(model);
});

loader.load('3d_models/green_alien_character/scene.gltf', gltf => {
  const model = gltf.scene;

  model.scale.set(0.7, 0.7, 0.7);
  model.position.set(0, 0.84, 0);

  torus.add(model);
});

loader.load('3d_models/sun_and_solar_flares/scene.gltf', gltf => {
  const model = gltf.scene;

  model.scale.set(0.3, 0.3, 0.3);

  const sunHolder = new THREE.Group();
  sunHolder.rotation.z = THREE.MathUtils.degToRad(7.25);
  sunHolder.add(model);
  scene.add(sunHolder);

  const sunLight = new THREE.PointLight(0xffddaa, 100, 10);
  sunHolder.add(sunLight);

  gsap.to(model.rotation, {
    y: Math.PI * 2,
    duration: 20,
    ease: 'none',
    repeat: -1,
  });
});

// END Load • 3D Models

// GSAP

// Рух Куба по прямій вздовж двох координат
gsap.to(cube.position, {
  // y: 2,
  x: 1,
  z: 1,

  duration: 5,
  ease: 'power1.inOut',
  repeat: -1,
  yoyo: true,
});

// обертання сфери по колу
// gsap.to(sphereOrbit.rotation, {
//   y: Math.PI * 2, // повний оберт у радіанах, тобто 360°
//   duration: 6,
//   ease: 'none',
//   repeat: -1,
// });

// обертання сфери по оліпсу
const orbit = { angle: 0 };
const radius = 2;

gsap.to(orbit, {
  angle: Math.PI * 2,
  duration: 50,
  ease: 'none',
  repeat: -1,
  onUpdate: () => {
    sphere.position.x = Math.cos(orbit.angle) * radius;
    sphere.position.z = Math.sin(orbit.angle) * radius * 2;
    // sphere.position.y = Math.sin(orbit.angle) * radius; // додає нахіл орбіти по Y
  },
});

// END GSAP

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// об'єкти, які будуть клікабельні
const clickableObjects = [cube, sphere, torus]; // , plane

function onMouseClick(event) {
  // отримуємо координаті від вікна
  // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // але Координати краще брати від canvas
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableObjects, false);

  if (intersects.length > 0) {
    const object = intersects[0].object;

    if (object.userData.originalColor) {
      // об'єкт уже пофарбований — повертаємо як було
      object.material.color.copy(object.userData.originalColor);
      delete object.userData.originalColor;
    } else {
      // фарбуємо вперше — спершу зберігаємо оригінал
      object.userData.originalColor = object.material.color.clone();
      object.material.color.set('aqua');
    }
  }
}

function onMouseMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

let downX = 0;
let downY = 0;

window.addEventListener('pointerdown', event => {
  downX = event.clientX;
  downY = event.clientY;
});

window.addEventListener('pointerup', event => {
  const dx = event.clientX - downX;
  const dy = event.clientY - downY;

  if (Math.hypot(dx, dy) < 5) onMouseClick(event);
});

window.addEventListener('mousemove', onMouseMove);

let isTorusHovered = false;

// Циклічна функція для постійного рендерінгу та анімації
function animate() {
  requestAnimationFrame(animate);

  rotateShapes();
  updateHover();
  controls.update();

  if (mixer) mixer.update(clock.getDelta());

  renderer.render(scene, camera);
}

function rotateShapes() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere.rotation.x += 0.005;
  sphere.rotation.y += 0.005;

  torus.rotation.x += 0.005;
  torus.rotation.z += 0.01;
}

function updateHover() {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(torus);

  if (intersects.length > 0 && !isTorusHovered) {
    isTorusHovered = true;

    gsap.to(torus.scale, {
      x: 2,
      // y: 2,
      duration: 1.5,
      ease: 'power1.out',
    });
  } else if (intersects.length === 0 && isTorusHovered) {
    isTorusHovered = false;

    gsap.to(torus.scale, { x: 1, y: 1, duration: 1.5, ease: 'power1.out' });
  }
}

animate();
