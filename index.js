import * as THREE from 'three';

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

// Світло
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // рівномірна підсвітка звідусіль, щоб тіньові боки не були чорними
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// Рендер
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Створення фігур // Куб
const geometry = new THREE.BoxGeometry(1, 2, 1);

// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('/img/paper.jpg'),
});

const cube = new THREE.Mesh(geometry, material);
cube.position.set(-1, 0, 0);
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(0.5, 5, 5);
const textureMaterialSphere = new THREE.TextureLoader().load(
  '/img/aqua_abstract.jpg'
);
textureMaterialSphere.colorSpace = THREE.SRGBColorSpace;

const sphereMaterial = new THREE.MeshPhongMaterial({
  // color: 'pink',
  // emissive: '0x000000',
  map: textureMaterialSphere,
  shininess: 30,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(3, 0, 1);
scene.add(sphere);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.7, 0.2, 20, 20),
  // new THREE.MeshBasicMaterial({ color: '#da5f5f' })
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('public/img/pixel.jpg'),
  })
);
torus.position.set(1, 1, -3);
scene.add(torus);

// Textures
const texture = new THREE.TextureLoader().load('/img/gray.png');
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
  cube.rotation.y += 0.05;

  sphere.rotation.x += 0.05;
  sphere.rotation.y += 0.01;

  torus.rotation.x += 0.01;
  torus.rotation.z += 0.05;

  renderer.render(scene, camera);
}

animate();
