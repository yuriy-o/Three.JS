import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

// Сцена
const scene = new THREE.Scene();

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

// Світло
//? світло однаково глобально освітлює всі об'єкти в сцені
//? рівномірна підсвітка звідусіль, щоб тіньові боки не були чорними
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

//? гола Лампочка // Світло випромінюється з однієї точки в усіх напрямках
// const pointLight = new THREE.PointLight(0xff0000, 10, 100);
// pointLight.position.set(0, 1, 1);
// scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
// scene.add(pointLightHelper);

//? Імітація сонячного світла, промені паралельні
const dirLight = new THREE.DirectionalLight('red', 5);
dirLight.position.set(2, 2, 2);
scene.add(dirLight);

//? Конус (фонарь) // світло з однієї точки в одному напрямку вздовж конуса
// new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
// angle — половина розхилу конуса в радіанах, максимум Math.PI / 2. Не в градусах. Для 30° пишіть Math.PI / 6.
// penumbra — розмитість краю плями, від 0 (різкий обрубаний край) до 1 (м'яке згасання). За замовчуванням 0, і саме через це прожектор часто виглядає «як з мультика».
// distance — на якій відстані світло згасає до нуля; 0 означає «без обмеження».
// decay — швидкість згасання, за замовчуванням 2 (фізично коректно, як у реальному житті).
const spotLight = new THREE.SpotLight('green', 15, 6);
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
cube.position.set(-1, 0, 0);
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
const texture = new THREE.TextureLoader().load('img/gray.png');
const textureMaterial = new THREE.MeshBasicMaterial({ map: texture });

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  // new THREE.MeshBasicMaterial({ color: '#2477ca' })
  textureMaterial
);
plane.position.set(-2, 1, -3);
scene.add(plane);

// GSAP

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
  duration: 16,
  ease: 'none',
  repeat: -1,
  onUpdate: () => {
    sphere.position.x = Math.cos(orbit.angle) * radius;
    sphere.position.z = Math.sin(orbit.angle) * radius * 2.2;
    // sphere.position.y = Math.sin(orbit.angle) * radius; // додає нахіл орбіти по Y
  },
});

// END GSAP

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// об'єкти, які будуть клікабельні
const clickableObjects = [cube, sphere, torus, plane];

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

  renderer.render(scene, camera);
}

function rotateShapes() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  sphere.rotation.x += 0.05;
  sphere.rotation.y += 0.01;

  torus.rotation.x += 0.01;
  torus.rotation.z += 0.05;
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
