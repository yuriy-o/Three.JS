import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
scene.add(sphere);

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

// Циклічна функція для постійного рендерінгу та анімації
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  sphere.rotation.x += 0.05;
  sphere.rotation.y += 0.01;

  torus.rotation.x += 0.01;
  torus.rotation.z += 0.05;

  renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

animate();
