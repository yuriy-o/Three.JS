import * as THREE from 'three';

// Сцена
const scene = new THREE.Scene();

// Самера
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 5;

// Рендер
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Створення фігур // Куб
const geometry = new THREE.BoxGeometry(1, 2, 1);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

// Циклічна функція для постійного рендерінгу та анімації
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
