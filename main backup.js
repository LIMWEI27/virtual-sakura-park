
import * as THREE from 'three';

// 1. 建立 3D 场景
const container = document.getElementById('park');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f8e8f0');
scene.fog = new THREE.Fog('#f8e8f0', 30, 65);

// 2. 建立俯视镜头
const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 25, 27);
camera.lookAt(0, 0, 0);

// 3. 建立画面渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

container.appendChild(renderer.domElement);

// 4. 设置公园灯光
const ambientLight = new THREE.HemisphereLight(
  '#ffffff',
  '#b8a1a5',
  2
);
scene.add(ambientLight);

const sunlight = new THREE.DirectionalLight('#fff5e8', 2.5);
sunlight.position.set(-8, 18, 10);
sunlight.castShadow = true;
scene.add(sunlight);

// 5. 公园草地
const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(36, 36),
  new THREE.MeshStandardMaterial({ color: '#a8c99a' })
);

grass.rotation.x = -Math.PI / 2;
grass.position.y = -0.1;
grass.receiveShadow = true;
scene.add(grass);

// 6. 湖泊
const lakeGeometry = new THREE.CircleGeometry(4.5, 64);

const lake = new THREE.Mesh(
  lakeGeometry,
  new THREE.MeshStandardMaterial({
    color: '#82c7d4',
    roughness: 0.22,
    metalness: 0.15
  })
);

lake.rotation.x = -Math.PI / 2;
lake.scale.set(1.35, 1, 0.82);
lake.position.y = 0.03;
scene.add(lake);

// 湖边浅色边缘
const lakeEdge = new THREE.Mesh(
  new THREE.RingGeometry(4.45, 4.8, 64),
  new THREE.MeshStandardMaterial({ color: '#e9dfc5' })
);

lakeEdge.rotation.x = -Math.PI / 2;
lakeEdge.scale.set(1.35, 0.82, 1);
lakeEdge.position.y = 0.02;
scene.add(lakeEdge);

// 7. 公园蜿蜒小路
const pathPoints = [
  new THREE.Vector3(-14, 0.03, -8),
  new THREE.Vector3(-9, 0.03, -12),
  new THREE.Vector3(-2, 0.03, -11),
  new THREE.Vector3(6, 0.03, -12),
  new THREE.Vector3(13, 0.03, -7),
  new THREE.Vector3(14, 0.03, 1),
  new THREE.Vector3(11, 0.03, 9),
  new THREE.Vector3(4, 0.03, 12),
  new THREE.Vector3(-5, 0.03, 11),
  new THREE.Vector3(-12, 0.03, 7),
  new THREE.Vector3(-14, 0.03, -1)
];

const pathCurve = new THREE.CatmullRomCurve3(pathPoints);

const path = new THREE.Mesh(
  new THREE.TubeGeometry(pathCurve, 100, 0.38, 8, false),
  new THREE.MeshStandardMaterial({ color: '#e7d5b9' })
);

scene.add(path);

// 8. 樱花树制作工具
function createSakuraTree(x, z, size = 1) {
  const tree = new THREE.Group();

  // 树干
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.24, 2.3, 8),
    new THREE.MeshStandardMaterial({ color: '#79533e' })
  );

  trunk.position.y = 1.15;
  trunk.castShadow = true;
  tree.add(trunk);

  // 树冠
  const blossomColors = ['#f4b6cb', '#f7c8d8', '#ed9fbd'];

  const positions = [
    [0, 2.8, 0],
    [-0.65, 2.65, 0.1],
    [0.65, 2.7, 0],
    [0, 2.7, 0.65],
    [0, 2.75, -0.65],
    [-0.35, 3.35, 0],
    [0.4, 3.35, 0.2]
  ];

  positions.forEach((pos, i) => {
    const blossom = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshStandardMaterial({
        color: blossomColors[i % blossomColors.length],
        roughness: 0.9
      })
    );

    blossom.position.set(pos[0], pos[1], pos[2]);
    blossom.scale.set(1, 0.85, 1);
    blossom.castShadow = true;
    tree.add(blossom);
  });

  tree.position.set(x, 0, z);
  tree.scale.setScalar(size);
  scene.add(tree);
}

// 9. 在公园不同位置种植樱花树
const trees = [
  [-13, -12, 1.1],
  [-7, -14, 0.9],
  [1, -14, 1.05],
  [10, -13, 1.1],
  [14, -5, 0.95],
  [14, 6, 1.1],
  [9, 13, 1],
  [0, 14, 1.1],
  [-10, 13, 0.95],
  [-14, 4, 1.05],
  [-13, -3, 0.85],
  [7, 7, 0.9]
];

trees.forEach(tree => {
  createSakuraTree(tree[0], tree[1], tree[2]);
});

// 10. 添加湖里的小鸭子
function createDuck(x, z) {
  const duck = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 16, 16),
    new THREE.MeshStandardMaterial({ color: '#f4d75c' })
  );

  body.scale.set(1.25, 0.65, 0.75);
  duck.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 16, 16),
    new THREE.MeshStandardMaterial({ color: '#f7df82' })
  );

  head.position.set(0.25, 0.22, 0);
  duck.add(head);

  const beak = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.23, 8),
    new THREE.MeshStandardMaterial({ color: '#e99b43' })
  );

  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.48, 0.18, 0);
  duck.add(beak);

  duck.position.set(x, 0.22, z);
  scene.add(duck);

  return duck;
}

const ducks = [
  createDuck(-2, 0),
  createDuck(2, 1.2)
];

// 11. 湖里的天鹅
function createSwan(x, z) {
  const swan = new THREE.Group();

  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.8
  });

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 20, 20),
    whiteMaterial
  );

  body.scale.set(1.3, 0.55, 0.8);
  swan.add(body);

  const neckCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.32, 0.1, 0),
    new THREE.Vector3(0.42, 0.45, 0),
    new THREE.Vector3(0.4, 0.85, 0),
    new THREE.Vector3(0.22, 1.05, 0)
  ]);

  const neck = new THREE.Mesh(
    new THREE.TubeGeometry(neckCurve, 20, 0.09, 8, false),
    whiteMaterial
  );

  swan.add(neck);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 16),
    whiteMaterial
  );

  head.position.set(0.22, 1.05, 0);
  swan.add(head);

  swan.position.set(x, 0.25, z);
  scene.add(swan);

  return swan;
}

const swan = createSwan(-3, 2);

// 12. 飘落的樱花花瓣
const petalCount = 180;
const petalPositions = new Float32Array(petalCount * 3);

for (let i = 0; i < petalCount; i++) {
  petalPositions[i * 3] = (Math.random() - 0.5) * 32;
  petalPositions[i * 3 + 1] = Math.random() * 9 + 1;
  petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 32;
}

const petalGeometry = new THREE.BufferGeometry();
petalGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(petalPositions, 3)
);

const petals = new THREE.Points(
  petalGeometry,
  new THREE.PointsMaterial({
    color: '#f4a9c5',
    size: 0.16,
    transparent: true,
    opacity: 0.85
  })
);

scene.add(petals);

// 13. 动画及画面更新
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // 鸭子和天鹅轻轻移动
  ducks[0].position.x = -2 + Math.sin(elapsed * 0.5) * 0.4;
  ducks[1].position.z = 1.2 + Math.cos(elapsed * 0.4) * 0.3;

  swan.position.x = -3 + Math.sin(elapsed * 0.25) * 0.3;

  // 花瓣慢慢飘落
  const positions = petalGeometry.attributes.position;

  for (let i = 0; i < petalCount; i++) {
    let y = positions.getY(i);
    let x = positions.getX(i);
    let z = positions.getZ(i);

    y -= 0.025;
    x += Math.sin(elapsed + i) * 0.006;

    if (y < 0) {
      y = 10;
      x = (Math.random() - 0.5) * 32;
      z = (Math.random() - 0.5) * 32;
    }

    positions.setXYZ(i, x, y, z);
  }

  positions.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

// 14. 适应不同屏幕大小
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
