
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// ==========================================
// VIRTUAL SAKURA PARK - VERSION 2
// Large dreamy Japanese cherry blossom park
// ==========================================

// ------------------------------------------
// SUPABASE CHAT CONNECTION
// ------------------------------------------

const SUPABASE_URL = 'https://wrhgssuqncjnufaconpa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_NgdMWYGgXJWUGFCWruN0kQ_534xUPQo';

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
const container = document.getElementById('park');

if (!container) {
  throw new Error('Park container not found.');
}

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f7e5eb');
scene.fog = new THREE.Fog('#f7e5eb', 110, 210);

// ------------------------------------------
// 1. CAMERA
// ------------------------------------------

const camera = new THREE.PerspectiveCamera(
  48,
  window.innerWidth / window.innerHeight,
  0.1,
  350
);

camera.position.set(0, 112, 125);
camera.lookAt(0, 0, 0);

// ------------------------------------------
// 2. RENDERER
// ------------------------------------------

let renderer;

try {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  container.appendChild(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();

  console.error('Sakura Park WebGL context lost.');

  document.body.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      text-align:center;
      font-family:Arial,sans-serif;
      color:#80566b;
      background:linear-gradient(135deg,#fff0f5,#fce1ec,#e9e8f8);
      padding:20px;
      box-sizing:border-box;
    ">
      <div style="font-size:65px;">🌸</div>
      <h1>Sakura Park</h1>
      <h2>We'll Be Back Soon</h2>
      <p>Our little garden is taking a short rest.</p>
      <p>Please try again in a few moments. 🌸</p>
    </div>
  `;
});

} catch (error) {
  console.error('Sakura Park WebGL failed:', error);

  document.body.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      text-align:center;
      font-family:Arial,sans-serif;
      color:#80566b;
      background:linear-gradient(135deg,#fff0f5,#fce1ec,#e9e8f8);
      padding:20px;
      box-sizing:border-box;
    ">
      <div style="font-size:65px;">🌸</div>
      <h1>Sakura Park</h1>
      <h2>We'll Be Back Soon</h2>
      <p>Our little garden is taking a short rest.</p>
      <p>Please try again in a few moments. 🌸</p>
    </div>
  `;

  throw error;
}
// ------------------------------------------
// UTC CLOCK DISPLAY
// ------------------------------------------

container.style.position = 'relative';

const utcClock = document.createElement('div');

utcClock.style.position = 'absolute';
utcClock.style.top = '20px';
utcClock.style.right = '25px';
utcClock.style.padding = '10px 16px';
utcClock.style.background = 'rgba(15, 25, 45, 0.65)';
utcClock.style.color = '#ffffff';
utcClock.style.fontFamily = 'Arial, sans-serif';
utcClock.style.fontSize = '18px';
utcClock.style.fontWeight = '600';
utcClock.style.letterSpacing = '1px';
utcClock.style.borderRadius = '8px';
utcClock.style.zIndex = '10';
utcClock.style.pointerEvents = 'none';

utcClock.textContent = 'UTC 00:00:00';

container.appendChild(utcClock);
// ONLINE VISITOR COUNT DISPLAY
const onlineCount = document.createElement('div');

onlineCount.style.position = 'absolute';
onlineCount.style.top = '20px';
onlineCount.style.right = '190px';
onlineCount.style.padding = '10px 16px';
onlineCount.style.background = 'rgba(15, 25, 45, 0.65)';
onlineCount.style.color = '#7CFFB2';
onlineCount.style.fontFamily = 'Arial, sans-serif';
onlineCount.style.fontSize = '16px';
onlineCount.style.fontWeight = '600';
onlineCount.style.borderRadius = '8px';
onlineCount.style.zIndex = '10';
onlineCount.style.pointerEvents = 'none';

onlineCount.textContent = '● 0 Online';

container.appendChild(onlineCount);
// REALTIME ONLINE VISITOR COUNT
const onlineChannel = supabase.channel('sakura-park-online', {
  config: {
    presence: {
      key: crypto.randomUUID()
    }
  }
});

onlineChannel
  .on('presence', { event: 'sync' }, () => {
    const state = onlineChannel.presenceState();

    const totalOnline = Object.values(state)
      .reduce((total, visitors) => total + visitors.length, 0);

    onlineCount.textContent = `● ${totalOnline} Online`;
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await onlineChannel.track({
        online_at: new Date().toISOString()
      });
    }
  });
// ------------------------------------------
// SAKURA WISH BOARD DISPLAY
// ------------------------------------------

const wishBoard = document.createElement('div');

wishBoard.style.position = 'absolute';
wishBoard.style.top = '75px';
wishBoard.style.right = '25px';
wishBoard.style.width = '300px';
wishBoard.style.padding = '14px';
wishBoard.style.background = 'rgba(255, 242, 248, 0.94)';
wishBoard.style.border = '1px solid #e8bfd0';
wishBoard.style.borderRadius = '14px';
wishBoard.style.boxShadow = '0 4px 18px rgba(80, 40, 60, 0.2)';
wishBoard.style.zIndex = '10';
wishBoard.style.fontFamily = 'Arial, sans-serif';
wishBoard.style.boxSizing = 'border-box';

wishBoard.innerHTML = `
  <div style="text-align:center; color:#87566e; font-weight:bold; font-size:17px; margin-bottom:12px;">
    🌸 Sakura Wish Board
  </div>

  <div id="wish-list" style="
    height:180px;
    overflow-y:auto;
    background:#fff;
    border-radius:9px;
    padding:10px;
    margin-bottom:12px;
    color:#80566b;
    font-size:13px;
  ">
    <div style="color:#b49aa7;">Your wishes will appear here... 🌸</div>
  </div>

  <textarea id="wish-input"
    placeholder="Type your wish..."
    maxlength="500"
    style="
      width:100%;
      height:65px;
      box-sizing:border-box;
      resize:none;
      border:1px solid #e5bfd0;
      border-radius:8px;
      padding:9px;
      font-size:13px;
      outline:none;
    "
  ></textarea>

  <div style="margin-top:9px; color:#80566b; font-size:12px;">
    <label>
      <input type="radio" name="wish-privacy" value="anonymous" checked>
      Publish anonymously
    </label>

    <br>

    <label>
      <input type="radio" name="wish-privacy" value="named">
      Publish with my name
    </label>
  </div>

  <button id="wish-submit" style="
    width:100%;
    margin-top:10px;
    padding:10px;
    border:0;
    border-radius:20px;
    background:#d99bb5;
    color:white;
    font-weight:bold;
    cursor:pointer;
  ">
    Send Wish ✨
  </button>
`;

container.appendChild(wishBoard);
function updateUTCClock() {
  const now = new Date();

  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  utcClock.textContent = `UTC ${hours}:${minutes}:${seconds}`;
}

updateUTCClock();
setInterval(updateUTCClock, 1000);
// Camera controls: zoom and pan
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

// Allow zooming
controls.enableZoom = true;
controls.minDistance = 5;
controls.maxDistance = 190;

// Allow moving around the park
controls.enablePan = true;

// Keep the camera at a fixed overhead angle
// Enable 360-degree camera rotation
controls.enableRotate = true;
controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
controls.target.set(0, 0, 0);
controls.update();
// ------------------------------------------
// ------------------------------------------
// 3. DAY AND NIGHT LIGHTING
// ------------------------------------------

const hemisphereLight = new THREE.HemisphereLight(
  '#fff5fa',
  '#8c9c82',
  2.2
);
scene.add(hemisphereLight);

const sunlight = new THREE.DirectionalLight(
  '#fff2dc',
  2.5
);

sunlight.position.set(-50, 100, 45);
sunlight.castShadow = true;
sunlight.shadow.mapSize.set(2048, 2048);
sunlight.shadow.camera.left = -100;
sunlight.shadow.camera.right = 100;
sunlight.shadow.camera.top = 100;
sunlight.shadow.camera.bottom = -100;
scene.add(sunlight);

// Day and night colors
const daySkyColor = new THREE.Color('#9dc9ed');
const nightSkyColor = new THREE.Color('#10182f');

const dayFogColor = new THREE.Color('#9dc9ed');
const nightFogColor = new THREE.Color('#10182f');

const currentSkyColor = new THREE.Color();
const currentFogColor = new THREE.Color();

const daySunColor = new THREE.Color('#fff2dc');
const nightSunColor = new THREE.Color('#536080');

// ------------------------------------------
// 4. TEXTURED GRASS
// ------------------------------------------

function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#a7c99c';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 6500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 5;
    const radius = Math.random() * 2.5 + 0.4;

    ctx.fillStyle =
      Math.random() > 0.5
        ? 'rgba(225,240,202,0.22)'
        : 'rgba(70,112,67,0.12)';

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 5);

  return texture;
}

const grass = new THREE.Mesh(
  new THREE.PlaneGeometry(130, 130),
  new THREE.MeshStandardMaterial({
    map: createGrassTexture(),
    roughness: 1
  })
);

grass.rotation.x = -Math.PI / 2;
grass.position.y = -0.15;
grass.receiveShadow = true;
scene.add(grass);
// ------------------------------------------
// ------------------------------------------
// SAKURA SHOPPING STREET - EXPANSION GROUND
// ------------------------------------------

// ------------------------------------------
// SAKURA SHOPPING STREET - EXPANSION GROUND
// ------------------------------------------

const shoppingGround = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    map: createGrassTexture(),
    roughness: 1
  })
);

shoppingGround.rotation.x = -Math.PI / 2;
shoppingGround.position.set(85, -0.16, -85);
shoppingGround.receiveShadow = true;
scene.add(shoppingGround);


// ------------------------------------------
// SECOND EXPANSION GROUND
// ------------------------------------------

const secondGround = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    map: createGrassTexture(),
    roughness: 1
  })
);

secondGround.rotation.x = -Math.PI / 2;
secondGround.position.set(85, -0.16, 15);
secondGround.receiveShadow = true;
scene.add(secondGround);


// ------------------------------------------
// JAPANESE SHOPPING STREET - MAIN ROAD
// ------------------------------------------

// ------------------------------------------
// JAPANESE STONE ROAD TEXTURE
// ------------------------------------------

const stoneCanvas = document.createElement('canvas');
stoneCanvas.width = 512;
stoneCanvas.height = 512;

const stoneCtx = stoneCanvas.getContext('2d');

stoneCtx.fillStyle = '#b5a58e';
stoneCtx.fillRect(0, 0, 512, 512);

// Stone tile pattern
for (let y = 0; y < 512; y += 64) {
  for (let x = 0; x < 512; x += 128) {
    stoneCtx.fillStyle =
      Math.random() > 0.5 ? '#c2b39c' : '#a99981';

    stoneCtx.fillRect(
      x + 2,
      y + 2,
      124,
      60
    );

    stoneCtx.strokeStyle = '#887963';
    stoneCtx.lineWidth = 3;
    stoneCtx.strokeRect(
      x + 2,
      y + 2,
      124,
      60
    );
  }
}

const stoneRoadTexture = new THREE.CanvasTexture(stoneCanvas);
stoneRoadTexture.colorSpace = THREE.SRGBColorSpace;
stoneRoadTexture.wrapS = THREE.RepeatWrapping;
stoneRoadTexture.wrapT = THREE.RepeatWrapping;
stoneRoadTexture.repeat.set(1, 4);
const shoppingRoad = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 180),
  new THREE.MeshStandardMaterial({
    map: stoneRoadTexture,
    roughness: 0.95
  })
);

shoppingRoad.rotation.x = -Math.PI / 2;
shoppingRoad.position.set(85, -0.12, -35);
shoppingRoad.receiveShadow = true;
scene.add(shoppingRoad);

// ------------------------------------------
// ------------------------------------------
// 5. JAPANESE SAKURA GARDEN POND
// ------------------------------------------

const lakeGroup = new THREE.Group();

// Natural irregular pond shape
const pondShape = new THREE.Shape();

pondShape.moveTo(-23, -2);
pondShape.bezierCurveTo(-27, -12, -17, -20, -7, -19);
pondShape.bezierCurveTo(3, -23, 17, -17, 23, -9);
pondShape.bezierCurveTo(29, -1, 24, 12, 15, 17);
pondShape.bezierCurveTo(5, 23, -10, 21, -19, 13);
pondShape.bezierCurveTo(-25, 8, -28, 3, -23, -2);

const pondGeometry = new THREE.ShapeGeometry(
  pondShape,
  64
);

// Deep natural green-blue water
const pondMaterial = new THREE.MeshPhysicalMaterial({
 color: '#78aeb0',
  roughness: 0.12,
  metalness: 0.05,
  clearcoat: 0.65,
  clearcoatRoughness: 0.22,
  side: THREE.DoubleSide
});

const lake = new Reflector(
  pondGeometry,
  {
    clipBias: 0.003,
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0x91b9b5
  }
);

lake.rotation.x = -Math.PI / 2;
lake.position.y = 0.12;
lake.receiveShadow = true;

lakeGroup.add(lake);
// Store original lake surface vertices for 3D water animation
const lakeBasePositions = lake.geometry.attributes.position.array.slice();
const lakeVertexCount = lake.geometry.attributes.position.count;

// Darker underwater pond bed
const pondBed = new THREE.Mesh(
  new THREE.ShapeGeometry(pondShape, 64),
  new THREE.MeshStandardMaterial({
    color: '#243f38',
    roughness: 1,
    side: THREE.DoubleSide
  })
);

pondBed.rotation.x = -Math.PI / 2;
pondBed.position.y = -0.8;

lakeGroup.add(pondBed);
scene.add(lakeGroup);
// ------------------------------------------
// REALISTIC POND ENVIRONMENT REFLECTION
// ------------------------------------------

const waterReflectionTarget = new THREE.WebGLCubeRenderTarget(128, {
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter
});

const waterReflectionCamera = new THREE.CubeCamera(
  0.1,
  250,
  waterReflectionTarget
);

waterReflectionCamera.position.set(0, 0.3, 0);
scene.add(waterReflectionCamera);

pondMaterial.envMap = waterReflectionTarget.texture;
pondMaterial.envMapIntensity = 1.8;
pondMaterial.needsUpdate = true;

let waterReflectionFrame = 0;


// ------------------------------------------
// 6. WALKING PATHS
// ------------------------------------------

function createPath(points, width, color) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(p => new THREE.Vector3(p[0], 0.08, p[1]))
  );

  const geometry = new THREE.TubeGeometry(
    curve,
    160,
    width,
    8,
    false
  );

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 1
  });

  const path = new THREE.Mesh(geometry, material);
  path.receiveShadow = true;
  scene.add(path);
}

// Main walking path around the lake
createPath([
  [-48, -12],
  [-42, -37],
  [-20, -48],
  [8, -48],
  [36, -35],
  [48, -10],
  [44, 19],
  [25, 42],
  [-5, 48],
  [-34, 36],
  [-48, 10],
  [-48, -12]
], 1.35, '#d8c4a7');

// Northern forest trail
createPath([
  [-48, -42],
  [-30, -52],
  [-8, -55],
  [18, -49],
  [42, -55],
  [54, -39]
], 0.9, '#e7d4b8');

// Southern garden trail
createPath([
  [-48, 43],
  [-30, 53],
  [-5, 51],
  [20, 55],
  [47, 43]
], 0.9, '#e7d4b8');

// ------------------------------------------
//  STREET LAMPS AROUND THE LAKE
// ------------------------------------------

const parkLamps = [];

const lampPathPoints = [
  [-48, -12],
  [-42, -37],
  [-20, -48],
  [8, -48],
  [36, -35],
  [48, -10],
  [44, 19],
  [25, 42],
  [-5, 48],
  [-34, 36],
  [-48, 10],
  [-48, -12]
];

const lampCurve = new THREE.CatmullRomCurve3(
  lampPathPoints.map(p => new THREE.Vector3(p[0], 0, p[1]))
);

const lampMetal = new THREE.MeshStandardMaterial({
  color: '#493c35',
  roughness: 0.75
});

const lampGlow = new THREE.MeshStandardMaterial({
  color: '#ffd99a',
  emissive: '#ffb95c',
  emissiveIntensity: 1.5
});

for (let i = 0; i < 16; i++) {
  const t = i / 16;
  const position = lampCurve.getPointAt(t);
  const tangent = lampCurve.getTangentAt(t);

  const side = i % 2 === 0 ? 1 : -1;

  const lamp = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.16, 4.2, 12),
    lampMetal
  );
  pole.position.y = 2.1;
  lamp.add(pole);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.65, 0.09, 0.09),
    lampMetal
  );
  arm.position.set(0.28, 4.05, 0);
  lamp.add(arm);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 0.28, 4),
    lampMetal
  );
  roof.position.set(0.55, 4.25, 0);
  roof.rotation.y = Math.PI / 4;
  lamp.add(roof);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 12, 12),
    lampGlow
  );
  bulb.position.set(0.55, 3.95, 0);
  lamp.add(bulb);

  const light = new THREE.PointLight(
    '#ffd49a',
    0,
    13,
    2
  );
  light.position.set(0.55, 3.85, 0);
  lamp.add(light);

  const sideX = -tangent.z * side;
  const sideZ = tangent.x * side;

  lamp.position.set(
    position.x + sideX * 2.5,
    0,
    position.z + sideZ * 2.5
  );

  lamp.rotation.y = Math.atan2(-sideZ, -sideX);

  lamp.traverse(object => {
    if (object.isMesh) {
      object.castShadow = true;
    }
  });

  scene.add(lamp);
  parkLamps.push({ light, bulb });
}
// ------------------------------------------

// ------------------------------------------
// SAKURA PARK DONATION SIGNBOARD
// ------------------------------------------

const donationBoard = new THREE.Group();

const boardWood = new THREE.MeshStandardMaterial({
  color: '#54251f',
  roughness: 0.85
});

const boardSurface = new THREE.MeshStandardMaterial({
  color: '#fff0c9',
  roughness: 0.9
});

const boardGold = new THREE.MeshStandardMaterial({
  color: '#e6a52e',
  metalness: 0.25,
  roughness: 0.55
});

// Two wooden supporting posts
for (const x of [-1.9, 1.9]) {
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 3.8, 0.22),
    boardWood
  );

  post.position.set(x, 1.9, 0);
  post.castShadow = true;
  donationBoard.add(post);
}

// Main wooden frame
const frame = new THREE.Mesh(
  new THREE.BoxGeometry(4.5, 2.8, 0.28),
  boardWood
);

frame.position.y = 3.0;
frame.castShadow = true;
donationBoard.add(frame);

// Inner notice surface
const notice = new THREE.Mesh(
  new THREE.BoxGeometry(4.15, 2.45, 0.08),
  boardSurface
);

notice.position.set(0, 3.0, 0.17);
donationBoard.add(notice);

// Decorative top beam
const topBeam = new THREE.Mesh(
  new THREE.BoxGeometry(5.0, 0.22, 0.4),
  boardWood
);

topBeam.position.y = 4.45;
topBeam.castShadow = true;
donationBoard.add(topBeam);

// Gold decorative border
const border = new THREE.Mesh(
  new THREE.BoxGeometry(4.0, 2.3, 0.035),
  boardGold
);

border.position.set(0, 3.0, 0.22);
donationBoard.add(border);

// Position beside the eastern side of the lake
donationBoard.position.set(35, 0, -8);
donationBoard.scale.set(2.2, 2.2, 2.2);

// Face the lake
donationBoard.rotation.y = -Math.PI / 2;

scene.add(donationBoard);
// DONATION BOARD POPUP
const donationPopup = document.createElement('div');

donationPopup.style.cssText = `
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 620px;
  max-width: 95vw;
  max-height: 95vh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 20px;
  background: linear-gradient(145deg, #fff8f0, #fce8ef);
  border: 3px solid #c99a75;
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(50, 25, 35, 0.35);
  z-index: 10001;
  font-family: Arial, sans-serif;
  color: #80566b;
  text-align: center;
  pointer-events: auto;
`;
donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;donationPopup.innerHTML = `
  <button id="donation-close" style="
    position:absolute;
    top:10px;
    right:12px;
    border:none;
    background:none;
    font-size:24px;
    color:#80566b;
    cursor:pointer;
  ">×</button>

  <p style="
    font-size:16px;
    font-weight:bold;
    margin:5px 0 12px;
    color:#a76d85;
  ">
    Thank you for supporting Sakura Park! 🌸
  </p>

  <div style="font-size:38px;">🌸</div>

  <h2 style="margin:5px 0 10px;color:#a76d85;">
    Support Sakura Park
  </h2>

  <p style="font-size:14px;line-height:1.5;margin:5px 0 15px;">
    Help us keep this little garden blooming.
    Your support means a lot to us. 💗
  </p>

  <div style="
    background:white;
    border-radius:12px;
    padding:15px 45px;
    margin:12px 0;
    position:relative;
    box-sizing:border-box;
    text-align:center;
  ">

    <div style="
      font-size:13px;
      color:#80566b;
      margin-bottom:10px;
    ">Scan to Support</div>

    <div id="qr-title" style="
      font-weight:bold;
      font-size:19px;
      margin-bottom:12px;
      color:#a76d85;
    ">DuitNow</div>

    <div id="qr-image-wrap">
      <img id="qr-image"
        src="./image/duitnow.jpeg"
        style="
          width:340px;
          max-width:100%;
          max-height:45vh;
          object-fit:contain;
          border-radius:10px;
        ">
    </div>

    <div id="qr-bank-panel" style="
      display:none;
      text-align:left;
      font-size:14px;
      line-height:2;
      overflow-wrap:anywhere;
      padding:5px;
    ">
      <b>Bank Name:</b> iFAST GLOBAL BANK LIMITED<br>
      <b>Account Name:</b> Chun Wei Lim<br>
      <b>Account Number:</b> 00307742<br>
      <b>Sort Code:</b> 04-00-01<br>
      <b>IBAN:</b> GB20EZYR04000100307742<br>
      <b>SWIFT / BIC:</b> EZYRGB2LDPB
    </div>

    <button id="qr-prev" style="
      position:absolute;
      left:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❮</button>

    <button id="qr-next" style="
      position:absolute;
      right:5px;
      top:50%;
      transform:translateY(-50%);
      font-size:28px;
      border:none;
      background:none;
      cursor:pointer;
      color:#a76d85;
    ">❯</button>

    <div id="qr-counter" style="
      margin-top:12px;
      font-size:13px;
      color:#80566b;
    ">1 / 4</div>

  </div>
`;

document.body.appendChild(donationPopup);
// QR CODE CAROUSEL
// QR CODE + BANK INFORMATION CAROUSEL

const qrSlides = [
  { name: 'DuitNow', src: './image/duitnow.jpeg' },
  { name: 'PayNow', src: './image/paynow.jpeg' },
  { name: 'USDT', src: './image/USDT.jpeg' },
  { name: 'Bank Information', src: null }
];
let currentQrIndex = 0;

// QR CAROUSEL PAGE SWITCHING

function showQrSlide(index) {
  currentQrIndex = (index + qrSlides.length) % qrSlides.length;

  const slide = qrSlides[currentQrIndex];

  const qrTitle = document.getElementById('qr-title');
  const qrImageWrap = document.getElementById('qr-image-wrap');
  const qrImage = document.getElementById('qr-image');
  const qrBankPanel = document.getElementById('qr-bank-panel');
  const qrCounter = document.getElementById('qr-counter');

  qrTitle.textContent = slide.name;

  if (slide.src) {
    qrImageWrap.style.display = 'block';
    qrBankPanel.style.display = 'none';
    qrImage.src = slide.src;
  } else {
    qrImageWrap.style.display = 'none';
    qrBankPanel.style.display = 'block';
  }

  qrCounter.textContent = `${currentQrIndex + 1} / ${qrSlides.length}`;
}

document.getElementById('qr-prev').addEventListener('click', () => {
  showQrSlide(currentQrIndex - 1);
});

document.getElementById('qr-next').addEventListener('click', () => {
  showQrSlide(currentQrIndex + 1);
});

showQrSlide(0);


let donationPopupDismissed = false;

document.getElementById('donation-close').addEventListener('click', () => {
  donationPopup.style.display = 'none';
  donationPopupDismissed = true;
});
// DONATION BOARD MOUSE HOVER DETECTION
let donationBoardHovered = false;

const donationRaycaster = new THREE.Raycaster();
const donationPointer = new THREE.Vector2();

// DONATION BOARD MOUSE HOVER - STABLE VERSION
window.addEventListener('pointermove', (event) => {

  // Keep popup active while mouse is over the popup itself
  if (donationPopup.contains(event.target)) {
    donationBoardHovered = true;
    return;
  }

  // Mouse is outside the 3D canvas
  if (!renderer.domElement.contains(event.target)) {
    donationBoardHovered = false;
    return;
  }

  const rect = renderer.domElement.getBoundingClientRect();

  donationPointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  donationPointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  donationRaycaster.setFromCamera(donationPointer, camera);

  donationBoardHovered =
    donationRaycaster.intersectObject(donationBoard, true).length > 0;
});

// ------------------------------------------
// 7. TREE PLACEMENTS

// ------------------------------------------

const treePositions = [];

for (let i = 0; i < 125; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 29 + Math.random() * 29;

  treePositions.push({
    x: Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
    size: 0.85 + Math.random() * 0.5
  });
}

// Trunk instances
const trunkGeometry = new THREE.CylinderGeometry(
  0.30, 0.58, 5.5, 16
);

const trunkMaterial = new THREE.MeshStandardMaterial({
  color: '#79543d',
  roughness: 1
});

const trunks = new THREE.InstancedMesh(
  trunkGeometry,
  trunkMaterial,
  treePositions.length
);

const dummy = new THREE.Object3D();

treePositions.forEach((tree, i) => {
  dummy.position.set(tree.x, 2.75 * tree.size, tree.z);
  dummy.scale.setScalar(tree.size);
  dummy.rotation.set(0, Math.random() * 6, 0);
  dummy.updateMatrix();

  trunks.setMatrixAt(i, dummy.matrix);
});

trunks.instanceMatrix.needsUpdate = true;
trunks.castShadow = true;
scene.add(trunks);

// ------------------------------------------
// ------------------------------------------
// ------------------------------------------
// 7. CURVED SAKURA BRANCHES WITH FLOWER CLUSTERS
// ------------------------------------------

const sakuraBranchPositions = [];
const sakuraBranchNormals = [];
const sakuraBranchIndices = [];
const branchBlossomPoints = [];

function addSakuraCurvedBranch(points, startRadius, endRadius) {

  const curve = new THREE.CatmullRomCurve3(points);

  const tubularSegments = 8;
  const radialSegments = 7;

  const frames = curve.computeFrenetFrames(
    tubularSegments,
    false
  );

  const firstVertex = sakuraBranchPositions.length / 3;

  for (let i = 0; i <= tubularSegments; i++) {

    const t = i / tubularSegments;
    const point = curve.getPointAt(t);

    const radius =
      endRadius +
      (startRadius - endRadius) * Math.pow(1 - t, 1.35);

    for (let j = 0; j < radialSegments; j++) {

      const angle = (j / radialSegments) * Math.PI * 2;

      const normal = frames.normals[i].clone()
        .multiplyScalar(Math.cos(angle))
        .addScaledVector(
          frames.binormals[i],
          Math.sin(angle)
        )
        .normalize();

      const vertex = point.clone()
        .addScaledVector(normal, radius);

      sakuraBranchPositions.push(
        vertex.x,
        vertex.y,
        vertex.z
      );

      sakuraBranchNormals.push(
        normal.x,
        normal.y,
        normal.z
      );
    }
  }

  for (let i = 0; i < tubularSegments; i++) {

    for (let j = 0; j < radialSegments; j++) {

      const nextJ = (j + 1) % radialSegments;

      const a = firstVertex + i * radialSegments + j;
      const b = firstVertex + i * radialSegments + nextJ;
      const c = firstVertex + (i + 1) * radialSegments + nextJ;
      const d = firstVertex + (i + 1) * radialSegments + j;

      sakuraBranchIndices.push(a, b, d);
      sakuraBranchIndices.push(b, c, d);
    }
  }

  return curve;
}


// Create branches and save flower cluster positions
treePositions.forEach(tree => {

  const s = tree.size;

  const rotation = Math.random() * 0.3;

  for (let j = 0; j < 6; j++) {

    const angle =
      (j / 6) * Math.PI * 2 +
      rotation +
      (Math.random() - 0.5) * 0.3;

    const dx = Math.cos(angle);
    const dz = Math.sin(angle);

    const sideX = -dz;
    const sideZ = dx;

    const bend = (Math.random() - 0.5) * 0.65 * s;

    const mainPoints = [

      new THREE.Vector3(
        tree.x,
        3.05 * s,
        tree.z
      ),

      new THREE.Vector3(
        tree.x + dx * 0.28 * s,
        3.28 * s,
        tree.z + dz * 0.28 * s
      ),

      new THREE.Vector3(
        tree.x + dx * 0.82 * s + sideX * bend * 0.35,
        3.55 * s,
        tree.z + dz * 0.82 * s + sideZ * bend * 0.35
      ),

      new THREE.Vector3(
        tree.x + dx * 1.55 * s + sideX * bend,
        4.0 * s,
        tree.z + dz * 1.55 * s + sideZ * bend
      ),

      new THREE.Vector3(
        tree.x + dx * 2.25 * s + sideX * bend * 0.65,
        4.55 * s,
        tree.z + dz * 2.25 * s + sideZ * bend * 0.65
      )

    ];

    const mainCurve = addSakuraCurvedBranch(
      mainPoints,
      0.18 * s,
      0.025 * s
    );

    // Small flower clusters along main branches
    [0.72, 0.92].forEach(t => {
      branchBlossomPoints.push(
        mainCurve.getPointAt(t)
      );
    });


    // Secondary branches
    [0.46, 0.70].forEach((t, index) => {

      const origin = mainCurve.getPointAt(t);

      const side = index === 0 ? -1 : 1;

      const childAngle =
        angle + side * (0.7 + Math.random() * 0.22);

      const childX = Math.cos(childAngle);
      const childZ = Math.sin(childAngle);

      const childSideX = -childZ;
      const childSideZ = childX;

      const childLength = (0.9 + Math.random() * 0.35) * s;

      const childBend = (Math.random() - 0.5) * 0.25 * s;

      const childPoints = [

        origin.clone(),

        new THREE.Vector3(
          origin.x + childX * 0.25 * s,
          origin.y + 0.13 * s,
          origin.z + childZ * 0.25 * s
        ),

        new THREE.Vector3(
          origin.x + childX * 0.62 * s + childSideX * childBend,
          origin.y + 0.38 * s,
          origin.z + childZ * 0.62 * s + childSideZ * childBend
        ),

        new THREE.Vector3(
          origin.x + childX * childLength + childSideX * childBend,
          origin.y + 0.72 * s,
          origin.z + childZ * childLength + childSideZ * childBend
        )

      ];

      const childCurve = addSakuraCurvedBranch(
        childPoints,
        0.085 * s,
        0.018 * s
      );

      // Flower clusters near secondary branch tips
      [0.72, 0.95].forEach(t => {
        branchBlossomPoints.push(
          childCurve.getPointAt(t)
        );
      });

    });

  }

});


// Build branch geometry
const sakuraBranchGeometry = new THREE.BufferGeometry();

sakuraBranchGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(sakuraBranchPositions, 3)
);

sakuraBranchGeometry.setAttribute(
  'normal',
  new THREE.Float32BufferAttribute(sakuraBranchNormals, 3)
);

sakuraBranchGeometry.setIndex(sakuraBranchIndices);
sakuraBranchGeometry.computeBoundingSphere();

const sakuraBranchMaterial = new THREE.MeshStandardMaterial({
  color: '#79543d',
  roughness: 1,
  side: THREE.DoubleSide
});

const sakuraBranchMesh = new THREE.Mesh(
  sakuraBranchGeometry,
  sakuraBranchMaterial
);

sakuraBranchMesh.castShadow = true;
sakuraBranchMesh.receiveShadow = true;

scene.add(sakuraBranchMesh);


// ------------------------------------------
// ------------------------------------------
// REAL FIVE-PETAL SAKURA FLOWERS ON BRANCHES
// ------------------------------------------

const branchSakuraPetalShape = new THREE.Shape();

branchSakuraPetalShape.moveTo(0, 0);
branchSakuraPetalShape.quadraticCurveTo(-0.15, 0.08, -0.14, 0.21);
branchSakuraPetalShape.quadraticCurveTo(-0.13, 0.31, -0.035, 0.33);
branchSakuraPetalShape.quadraticCurveTo(-0.01, 0.33, 0, 0.295);
branchSakuraPetalShape.quadraticCurveTo(0.01, 0.33, 0.035, 0.33);
branchSakuraPetalShape.quadraticCurveTo(0.13, 0.31, 0.14, 0.21);
branchSakuraPetalShape.quadraticCurveTo(0.15, 0.08, 0, 0);
branchSakuraPetalShape.closePath();

const branchSakuraPetalGeometry =
  new THREE.ShapeGeometry(branchSakuraPetalShape);

const branchFlowerColors = [
  new THREE.Color('#f7b2ca'),
  new THREE.Color('#f9bfd3'),
  new THREE.Color('#f4a3c0'),
  new THREE.Color('#f8c9d9'),
  new THREE.Color('#efa0bd')
];

const branchFlowerMesh = new THREE.InstancedMesh(
  branchSakuraPetalGeometry,
  new THREE.MeshStandardMaterial({
    color: '#ffffff',
    side: THREE.DoubleSide,
    roughness: 0.85
  }),
  branchBlossomPoints.length * 5
);

const branchFlowerDummy = new THREE.Object3D();

const branchFlowerNormal = new THREE.Vector3(0, 0, 1);
const branchFlowerOrientation = new THREE.Quaternion();

const branchFlowerOffset = new THREE.Vector3();

let branchFlowerIndex = 0;

branchBlossomPoints.forEach(point => {

  // Give each blossom a slightly different facing direction
  const normal = new THREE.Vector3(
    (Math.random() - 0.5) * 0.8,
    0.35 + Math.random() * 0.65,
    (Math.random() - 0.5) * 0.8
  ).normalize();

  branchFlowerOrientation.setFromUnitVectors(
    branchFlowerNormal,
    normal
  );

  const flowerColor = branchFlowerColors[
    Math.floor(Math.random() * branchFlowerColors.length)
  ];

  const flowerSize = 1.05 + Math.random() * 0.25;

  // Five separate rounded petals form one sakura flower
  for (let p = 0; p < 5; p++) {

    const angle = (p / 5) * Math.PI * 2;

    const petalRotation = new THREE.Quaternion()
      .setFromAxisAngle(branchFlowerNormal, angle);

    branchFlowerDummy.quaternion
      .copy(branchFlowerOrientation)
      .multiply(petalRotation);

    branchFlowerOffset.set(
      0,
      0.015,
      0
    );

    branchFlowerOffset.applyQuaternion(
      branchFlowerDummy.quaternion
    );

    branchFlowerDummy.position
      .copy(point)
      .add(branchFlowerOffset);

    branchFlowerDummy.scale.setScalar(flowerSize);

    branchFlowerDummy.updateMatrix();

    branchFlowerMesh.setMatrixAt(
      branchFlowerIndex,
      branchFlowerDummy.matrix
    );

    branchFlowerMesh.setColorAt(
      branchFlowerIndex,
      flowerColor
    );

    branchFlowerIndex++;
  }

});

branchFlowerMesh.instanceMatrix.needsUpdate = true;
branchFlowerMesh.instanceColor.needsUpdate = true;

branchFlowerMesh.castShadow = false;

scene.add(branchFlowerMesh);

// ------------------------------------------

// ------------------------------------------
// 8. NATURAL SAKURA CANOPY CORE
// ------------------------------------------

const crownGeometry = new THREE.IcosahedronGeometry(1, 3);
const crownPositions = crownGeometry.attributes.position;

for (let i = 0; i < crownPositions.count; i++) {
  const x = crownPositions.getX(i);
  const y = crownPositions.getY(i);
  const z = crownPositions.getZ(i);

  const variation =
    1
    + 0.07 * Math.sin(x * 8 + z * 5)
    + 0.045 * Math.sin(y * 11 + x * 4)
    + 0.035 * Math.cos(z * 9 - y * 5);

  crownPositions.setXYZ(
    i,
    x * variation,
    y * variation,
    z * variation
  );
}

crownGeometry.computeVertexNormals();

const crownMaterial = new THREE.MeshStandardMaterial({
  color: '#bd7895',
  roughness: 1,
  flatShading: false
});

const crowns = new THREE.InstancedMesh(
  crownGeometry,
  crownMaterial,
  treePositions.length
);

const crownDummy = new THREE.Object3D();

treePositions.forEach((tree, i) => {

  crownDummy.position.set(
    tree.x,
    6.0 * tree.size,
    tree.z
  );

  // Smaller inner canopy
  crownDummy.scale.set(
    2.25 * tree.size,
    1.15 * tree.size,
    2.10 * tree.size
  );

  crownDummy.rotation.set(
    (Math.random() - 0.5) * 0.12,
    Math.random() * Math.PI * 2,
    (Math.random() - 0.5) * 0.12
  );

  crownDummy.updateMatrix();

  crowns.setMatrixAt(i, crownDummy.matrix);
});

crowns.instanceMatrix.needsUpdate = true;
crowns.castShadow = true;

scene.add(crowns);

// ------------------------------------------

// 9. PETAL GEOMETRY
// ------------------------------------------

function createPetalGeometry() {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0.4);
  shape.quadraticCurveTo(0.18, 0.17, 0.14, -0.05);
  shape.quadraticCurveTo(0.09, -0.32, 0, -0.4);
  shape.quadraticCurveTo(-0.09, -0.32, -0.14, -0.05);
  shape.quadraticCurveTo(-0.18, 0.17, 0, 0.4);

  return new THREE.ShapeGeometry(shape);
}

const petalGeometry = createPetalGeometry();

const petalMaterial = new THREE.MeshStandardMaterial({
  color: '#f3a9c4',
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.9,
  roughness: 0.8
});

// ------------------------------------------
// ------------------------------------------
// ------------------------------------------
// ------------------------------------------
// 10. NATURAL DENSE SAKURA FLOWER CLUSTERS
// ------------------------------------------

const sakuraFlowerCount = 150;
const sakuraPetalsPerFlower = 5;

const sakuraFlowerColors = [
  new THREE.Color('#f7b2ca'),
  new THREE.Color('#f9bfd3'),
  new THREE.Color('#f4a3c0'),
  new THREE.Color('#f8c9d9'),
  new THREE.Color('#efa0bd'),
  new THREE.Color('#fce0e9'),
  new THREE.Color('#fff0f5')
];

const sakuraFlowerMaterial = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  side: THREE.DoubleSide,
  roughness: 0.85
});

const sakuraFlowerPetals = new THREE.InstancedMesh(
  petalGeometry,
  sakuraFlowerMaterial,
  treePositions.length * sakuraFlowerCount * sakuraPetalsPerFlower
);

const flowerDummy = new THREE.Object3D();

const flowerNormal = new THREE.Vector3(0, 0, 1);
const flowerQuaternion = new THREE.Quaternion();

let flowerIndex = 0;

treePositions.forEach(tree => {

  const rx = 3.1 * tree.size;
  const ry = 1.75 * tree.size;
  const rz = 2.9 * tree.size;

  for (let f = 0; f < sakuraFlowerCount; f++) {

    // Distribute blossoms through the outer canopy,
    // instead of placing every flower on one surface.

    const ny = Math.random() * 2 - 1;
    const angle = Math.random() * Math.PI * 2;

    const horizontal = Math.sqrt(1 - ny * ny);

    const nx = horizontal * Math.cos(angle);
    const nz = horizontal * Math.sin(angle);

    const radius = 0.65 + Math.random() * 0.10;

    const flowerCenter = new THREE.Vector3(
      tree.x + rx * nx * radius,
      6.0 * tree.size + ry * ny * radius,
      tree.z + rz * nz * radius
    );

    const normal = new THREE.Vector3(
      nx / rx,
      ny / ry,
      nz / rz
    ).normalize();

    flowerQuaternion.setFromUnitVectors(
      flowerNormal,
      normal
    );

    const colorRoll = Math.random();

    let flowerColor;

    if (colorRoll < 0.80) {
      flowerColor = sakuraFlowerColors[
        Math.floor(Math.random() * 5)
      ];
    } else if (colorRoll < 0.95) {
      flowerColor = sakuraFlowerColors[5];
    } else {
      flowerColor = sakuraFlowerColors[6];
    }

    for (let p = 0; p < sakuraPetalsPerFlower; p++) {

      const petalAngle =
        (p / sakuraPetalsPerFlower) * Math.PI * 2;

      const petalRotation = new THREE.Quaternion()
        .setFromAxisAngle(flowerNormal, petalAngle);

      flowerDummy.quaternion
        .copy(flowerQuaternion)
        .multiply(petalRotation);

      const offset = new THREE.Vector3(
        Math.cos(petalAngle) * 0.075 * tree.size,
        Math.sin(petalAngle) * 0.075 * tree.size,
        0
      );

      offset.applyQuaternion(flowerQuaternion);

      flowerDummy.position
        .copy(flowerCenter)
        .add(offset);

      const flowerSize =
        (0.34 + Math.random() * 0.10) * tree.size;

      flowerDummy.scale.set(
        flowerSize,
        flowerSize,
        flowerSize
      );

      flowerDummy.updateMatrix();

      sakuraFlowerPetals.setMatrixAt(
        flowerIndex,
        flowerDummy.matrix
      );

      sakuraFlowerPetals.setColorAt(
        flowerIndex,
        flowerColor
      );

      flowerIndex++;
    }
  }
});

sakuraFlowerPetals.instanceMatrix.needsUpdate = true;
sakuraFlowerPetals.instanceColor.needsUpdate = true;

sakuraFlowerPetals.castShadow = false;

scene.add(sakuraFlowerPetals);

// ------------------------------------------
// 11. PETALS ON THE GROUND
// ------------------------------------------

const groundPetalCount = 2200;

const groundPetals = new THREE.InstancedMesh(
  petalGeometry,
  petalMaterial,
  groundPetalCount
);

for (let i = 0; i < groundPetalCount; i++) {
  const x = (Math.random() - 0.5) * 115;
  const z = (Math.random() - 0.5) * 115;

  dummy.position.set(x, 0.015, z);
  dummy.rotation.set(
    -Math.PI / 2,
    Math.random() * 6,
    Math.random() * 0.4
  );

  const scale = 0.12 + Math.random() * 0.12;
  dummy.scale.set(scale, scale * 1.5, scale);

  dummy.updateMatrix();
  groundPetals.setMatrixAt(i, dummy.matrix);
}

groundPetals.instanceMatrix.needsUpdate = true;
scene.add(groundPetals);

// ------------------------------------------
// 12. FALLING PETALS
// ------------------------------------------

const fallingCount = window.innerWidth < 768 ? 300 : 650;

const fallingPetals = new THREE.InstancedMesh(
  petalGeometry,
  petalMaterial,
  fallingCount
);
scene.add(fallingPetals);
const fallingData = [];

for (let i = 0; i < fallingCount; i++) {
  const data = {
    x: (Math.random() - 0.5) * 120,
    y: Math.random() * 20,
    z: (Math.random() - 0.5) * 120,
    speed: 0.025 + Math.random() * 0.035,
    drift: Math.random() * 0.04
  };

  fallingData.push(data);
}

// ------------------------------------------
// ------------------------------------------
// ------------------------------------------
// 13. ROMANTIC JAPANESE PINK STONE BRIDGE
// ------------------------------------------

const bridgeGroup = new THREE.Group();

// Soft pink natural stone
const pinkStone = new THREE.MeshStandardMaterial({
  color: '#d8b5ad',
  roughness: 0.92
});

const lightStone = new THREE.MeshStandardMaterial({
  color: '#ead2c8',
  roughness: 0.88
});

const darkStone = new THREE.MeshStandardMaterial({
  color: '#b88f87',
  roughness: 0.95
});

// BRIDGE DIMENSIONS
const bridgeLength = 46;
const bridgeHalf = bridgeLength / 2;
const bridgeZ = -8;
const bridgeWidth = 3.5;

// Curved bridge deck
const bridgeShape = new THREE.Shape();

bridgeShape.moveTo(-bridgeHalf, 0.65);

bridgeShape.quadraticCurveTo(
  0, 3.5,
  bridgeHalf, 0.65
);

bridgeShape.lineTo(bridgeHalf, 0.05);

bridgeShape.quadraticCurveTo(
  0, 2.9,
  -bridgeHalf, 0.05
);

bridgeShape.closePath();

const bridgeGeometry = new THREE.ExtrudeGeometry(
  bridgeShape,
  {
    depth: bridgeWidth,
    bevelEnabled: false,
    curveSegments: 64
  }
);

bridgeGeometry.translate(
  0,
  0,
  -bridgeWidth / 2
);

const bridgeDeck = new THREE.Mesh(
  bridgeGeometry,
  pinkStone
);

bridgeDeck.position.z = bridgeZ;
bridgeDeck.castShadow = true;
bridgeDeck.receiveShadow = true;

bridgeGroup.add(bridgeDeck);

// Calculate curved deck height
function getBridgeHeight(x) {
  const t = x / bridgeHalf;

  return 0.65 + 2.85 * (1 - t * t);
}

// Curved stone handrails
for (const side of [-1, 1]) {
  const railPoints = [];

  for (let i = 0; i <= 64; i++) {
    const x = -bridgeHalf + (i / 64) * bridgeLength;

    railPoints.push(
      new THREE.Vector3(
        x,
        getBridgeHeight(x) + 1.0,
        bridgeZ + side * 1.55
      )
    );
  }

  const rail = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(railPoints),
      128,
      0.16,
      12,
      false
    ),
    lightStone
  );

  rail.castShadow = true;
  bridgeGroup.add(rail);

  // Decorative stone pillars
  for (let i = 0; i <= 16; i++) {
    const x = -bridgeHalf + (i / 16) * bridgeLength;
    const deckY = getBridgeHeight(x);

    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.26, 0.85, 0.26),
      pinkStone
    );

    pillar.position.set(
      x,
      deckY + 0.48,
      bridgeZ + side * 1.55
    );

    pillar.castShadow = true;
    bridgeGroup.add(pillar);

    // Small decorative stone caps
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 12, 12),
      lightStone
    );

    cap.scale.set(1, 0.75, 1);
    cap.position.set(
      x,
      deckY + 0.95,
      bridgeZ + side * 1.55
    );

    bridgeGroup.add(cap);
  }
}

// Stone support structures near both ends
for (const x of [-22.3, 22.3]) {
  const support = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 1.0, 4.4),
    darkStone
  );

  support.position.set(x, 0.15, bridgeZ);
  support.castShadow = true;
  support.receiveShadow = true;

  bridgeGroup.add(support);
}

// Bridge entrance decorations
for (const x of [-22.5, 22.5]) {
  for (const z of [bridgeZ - 2.0, bridgeZ + 2.0]) {
    const entranceStone = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.45, 0.65),
      lightStone
    );

    entranceStone.position.set(x, 0.35, z);
    entranceStone.castShadow = true;

    bridgeGroup.add(entranceStone);
  }
}

// Make the bridge part of the lake environment
lakeGroup.add(bridgeGroup);

// ------------------------------------------


// ------------------------------------------
// 14. JAPANESE LANTERNS
// ------------------------------------------

// ------------------------------------------
// 14. JAPANESE LANTERNS
// ------------------------------------------

function createLantern(x, z) {
  const lantern = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.18, 2.3, 8),
    new THREE.MeshStandardMaterial({ color: '#654b3d' })
  );

  pole.position.y = 1.15;
  lantern.add(pole);

  const lightBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
    new THREE.MeshStandardMaterial({
      color: '#ffd99a',
      emissive: '#ffb85e',
      emissiveIntensity: 0.6
    })
  );

  lightBox.position.y = 2.6;
  lantern.add(lightBox);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(0.85, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: '#684c43' })
  );

  roof.position.y = 3.3;
  lantern.add(roof);

  lantern.position.set(x, 0, z);
  scene.add(lantern);
}

[
  [-22, -25], [22, -25],
  [-25, 20], [25, 20],
  [-43, 0], [43, 0],
  [-20, 47], [20, 47],
  [-35, -43], [35, -43]
].forEach(p => createLantern(p[0], p[1]));

// ------------------------------------------
// ------------------------------------------
// 15. JAPANESE GARDEN BENCHES
// ------------------------------------------

function createBench(x, z, rotation = 0) {
  const bench = new THREE.Group();

  const darkWood = new THREE.MeshStandardMaterial({
    color: '#493024',
    roughness: 0.72
  });

  const warmWood = new THREE.MeshStandardMaterial({
    color: '#68452f',
    roughness: 0.68
  });

  const stone = new THREE.MeshStandardMaterial({
    color: '#a99b8b',
    roughness: 0.95
  });

  // Seat: five polished wooden slats
  for (let i = 0; i < 5; i++) {
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 0.14, 0.23),
      warmWood
    );

    seat.position.set(0, 0.85, -0.42 + i * 0.22);
    bench.add(seat);
  }

  // Decorative seat frame
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.65, 0.16, 1.15),
    darkWood
  );

  frame.position.set(0, 0.73, 0.02);
  bench.add(frame);

  // Four elegant legs
  for (const side of [-1, 1]) {
    for (const front of [-1, 1]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.75, 0.22),
        darkWood
      );

      leg.position.set(
        side * 1.35,
        0.38,
        front * 0.38
      );

      bench.add(leg);
    }

    // Curved back supports
    const backSupport = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 1.05, 0.16),
      darkWood
    );

    backSupport.position.set(side * 1.4, 1.35, -0.65);
    backSupport.rotation.x = -0.12;
    bench.add(backSupport);

    // Armrest supports
    const armSupport = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.48, 0.16),
      darkWood
    );

    armSupport.position.set(side * 1.4, 1.1, 0.25);
    bench.add(armSupport);

    // Elegant curved armrests
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 1.4, 1.32, -0.65),
      new THREE.Vector3(side * 1.4, 1.48, -0.35),
      new THREE.Vector3(side * 1.4, 1.5, 0.05),
      new THREE.Vector3(side * 1.4, 1.43, 0.35),
      new THREE.Vector3(side * 1.4, 1.32, 0.55)
    ]);

    const arm = new THREE.Mesh(
      new THREE.TubeGeometry(armCurve, 24, 0.09, 8, false),
      warmWood
    );

    bench.add(arm);
  }

  // Five vertical backrest slats
  for (let i = 0; i < 5; i++) {
    const slat = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.95, 0.12),
      warmWood
    );

    slat.position.set(
      -1.05 + i * 0.525,
      1.48,
      -0.66
    );

    slat.rotation.x = -0.1;
    bench.add(slat);
  }

  // Curved top backrest rail
  const backCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.5, 1.95, -0.67),
    new THREE.Vector3(-0.8, 2.05, -0.67),
    new THREE.Vector3(0, 2.08, -0.67),
    new THREE.Vector3(0.8, 2.05, -0.67),
    new THREE.Vector3(1.5, 1.95, -0.67)
  ]);

  const backRail = new THREE.Mesh(
    new THREE.TubeGeometry(backCurve, 32, 0.11, 10, false),
    darkWood
  );

  bench.add(backRail);

  // Stone feet
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.2, 1.05),
      stone
    );

    foot.position.set(side * 1.3, 0.1, 0);
    bench.add(foot);
  }

  bench.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  bench.position.set(x, 0, z);
  bench.rotation.y = rotation;
  scene.add(bench);
}

// Japanese benches beside the main walking path
createBench(0, -53, 0);
createBench(0, 53, Math.PI);
createBench(-51, -25, Math.PI / 2);
createBench(50, 5, -Math.PI / 2);

// ------------------------------------------
// 16. SWANS AND DUCKS
// ------------------------------------------

function createDuck(x, z) {
  const duck = new THREE.Group();

  const yellow = new THREE.MeshStandardMaterial({
    color: '#eac65c',
    roughness: 0.7
  });

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 20, 16),
    yellow
  );

  body.scale.set(1.3, 0.7, 0.85);
  duck.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 16, 16),
    yellow
  );

  head.position.set(0.48, 0.3, 0);
  duck.add(head);

  const beak = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: '#eb9950' })
  );

  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.78, 0.3, 0);
  duck.add(beak);

  duck.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
  }
});
  duck.position.set(x, 0.35, z);
  scene.add(duck);

  return duck;
}

const ducks = [
  createDuck(-4, 1),
  createDuck(5, 4),
  createDuck(2, -1),
  createDuck(-12, 3),
  createDuck(12, -4),
  createDuck(-5, 12),
  createDuck(7, -12)
];

function createSwan(x, z) {
  const swan = new THREE.Group();

  const white = new THREE.MeshStandardMaterial({
    color: '#fffaf5',
    roughness: 0.65
  });

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 24, 20),
    white
  );

  body.scale.set(1.4, 0.55, 0.9);
  swan.add(body);

  const neckPoints = [
    new THREE.Vector3(0.65, 0.1, 0),
    new THREE.Vector3(0.7, 0.65, 0),
    new THREE.Vector3(0.45, 1.15, 0),
    new THREE.Vector3(0.4, 1.5, 0)
  ];

  const neck = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(neckPoints),
      24,
      0.13,
      10,
      false
    ),
    white
  );

  swan.add(neck);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.23, 16, 16),
    white
  );

  head.position.set(0.4, 1.55, 0);
  swan.add(head);

  const beak = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: '#e88b44' })
  );

  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.65, 1.5, 0);
  swan.add(beak);

  swan.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true;
  }
});
  swan.position.set(x, 0.35, z);
  scene.add(swan);

  return swan;
}

const swans = [
  createSwan(-8, -2),
  createSwan(9, 5),
  createSwan(-14, 5),
  createSwan(14, -5)
];

function createRabbit(x, z, color) {
  const rabbit = new THREE.Group();

  const fur = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.85
  });

  const pink = new THREE.MeshStandardMaterial({ color: '#efb5b5' });

  // Body
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.48, 20, 16),
    fur
  );
  body.scale.set(1, 0.9, 1.2);
  body.position.y = 0.48;
  rabbit.add(body);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 20, 16),
    fur
  );
  head.position.set(0, 0.95, 0.25);
  rabbit.add(head);

  // Ears
  for (let i = 0; i < 2; i++) {
    const ear = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 12),
      fur
    );
    ear.scale.set(0.65, 1.9, 0.45);
    ear.position.set(i === 0 ? -0.18 : 0.18, 1.35, 0.25);
    rabbit.add(ear);
  }

  // Eyes
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: '#302522' });

  for (let i = 0; i < 2; i++) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      eyeMaterial
    );
    eye.position.set(i === 0 ? -0.15 : 0.15, 1.0, 0.53);
    rabbit.add(eye);
  }

  // Nose
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 12, 12),
    pink
  );
  nose.position.set(0, 0.88, 0.57);
  rabbit.add(nose);

  // Tail
  const tail = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12),
    fur
  );
  tail.position.set(0, 0.48, -0.55);
  rabbit.add(tail);

  // Feet
  for (let i = 0; i < 4; i++) {
    const foot = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 10),
      fur
    );
    foot.scale.set(1.1, 0.55, 1.3);
    foot.position.set(
      i < 2 ? -0.25 : 0.25,
      0.12,
      i % 2 === 0 ? 0.35 : -0.35
    );
    rabbit.add(foot);
  }

  rabbit.traverse(child => {
    if (child.isMesh) child.castShadow = true;
  });

  rabbit.position.set(x, 0, z);
  scene.add(rabbit);

  return rabbit;
}
const rabbits = [
  createRabbit(-34, -12, '#fffaf0'),
  createRabbit(34, 12, '#d9b99b'),
  createRabbit(-12, 30, '#f1e4d2'),
  createRabbit(28, -25, '#ffffff'),
  createRabbit(-35, 25, '#c9a27e'),
  createRabbit(10, -32, '#ead7bd')
];
// ==========================================
// DEER MODEL
// ==========================================

function createDeer(x, z, color) {
  const deer = new THREE.Group();

  const fur = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.9
  });

  const cream = new THREE.MeshStandardMaterial({
    color: '#f5e4c8',
    roughness: 0.9
  });

  const dark = new THREE.MeshStandardMaterial({
    color: '#49352b'
  });

  // Body
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 20, 16),
    fur
  );
  body.scale.set(0.9, 1, 1.5);
  body.position.set(0, 1.05, 0);
  deer.add(body);

  // Neck
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.27, 0.85, 16),
    fur
  );
  neck.position.set(0, 1.65, 0.38);
  neck.rotation.x = -0.25;
  deer.add(neck);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 20, 16),
    fur
  );
  head.scale.set(0.9, 1, 1.15);
  head.position.set(0, 2.05, 0.58);
  deer.add(head);

  // Muzzle
  const muzzle = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 12),
    cream
  );
  muzzle.scale.set(1, 0.75, 1);
  muzzle.position.set(0, 1.94, 0.83);
  deer.add(muzzle);

  // Eyes
  for (let i = 0; i < 2; i++) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      dark
    );
    eye.position.set(i === 0 ? -0.2 : 0.2, 2.12, 0.78);
    deer.add(eye);
  }

  // Ears
  for (let i = 0; i < 2; i++) {
    const ear = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 12, 10),
      fur
    );
    ear.scale.set(0.65, 0.45, 1.5);
    ear.position.set(i === 0 ? -0.3 : 0.3, 2.25, 0.42);
    deer.add(ear);
  }

  // Antlers
  const antlerMaterial = new THREE.MeshStandardMaterial({
    color: '#8b6748',
    roughness: 0.9
  });

  for (let i = 0; i < 2; i++) {
    const side = i === 0 ? -1 : 1;

    const antler = new THREE.Group();

    const mainHorn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.065, 0.65, 8),
      antlerMaterial
    );
    mainHorn.position.y = 0.3;
    mainHorn.rotation.z = -side * 0.12;
    antler.add(mainHorn);

    for (let j = 0; j < 2; j++) {
      const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.035, 0.28, 8),
        antlerMaterial
      );
      branch.position.set(side * (j === 0 ? 0.1 : -0.08), 0.38 + j * 0.16, 0);
      branch.rotation.z = side * 0.7;
      antler.add(branch);
    }

    antler.position.set(side * 0.19, 2.3, 0.48);
    deer.add(antler);
  }

  // Four legs
  for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.055, 0.72, 12),
      fur
    );

    leg.position.set(
      i < 2 ? -0.3 : 0.3,
      0.42,
      i % 2 === 0 ? 0.42 : -0.42
    );

    deer.add(leg);

    const hoof = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 10),
      dark
    );
    hoof.scale.set(1, 0.65, 1.2);
    hoof.position.set(
      i < 2 ? -0.3 : 0.3,
      0.07,
      i % 2 === 0 ? 0.42 : -0.42
    );
    deer.add(hoof);
  }

  // Tail
  const tail = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 12, 10),
    cream
  );
  tail.position.set(0, 1.25, -0.78);
  deer.add(tail);

  deer.traverse(child => {
    if (child.isMesh) child.castShadow = true;
  });

  deer.position.set(x, 0, z);
  scene.add(deer);

  return deer;
}
// ==========================================
// 6 DEER IN SAKURA PARK
// ==========================================

const deer = [
  createDeer(-28, -18, '#b98250'),
  createDeer(25, 18, '#c99563'),
  createDeer(-18, 25, '#a9784b'),
  createDeer(32, -20, '#d2a16e'),
  createDeer(-35, 12, '#bd8958'),
  createDeer(12, -30, '#c18b58')
];

// INDEPENDENT DEER ROAMING STATES
const deerStates = deer.map((animal, i) => ({
  x: animal.position.x,
  z: animal.position.z,
  angle: Math.random() * Math.PI * 2,
  speed: 0.45 + Math.random() * 0.25,
  turnTimer: 1 + Math.random() * 3,
  phase: i * 1.2,
  lastTime: 0
}));

// Rabbit hopping animation states
// Independent rabbit roaming states
// ------------------------------------------
// 5 CUTE JAPANESE GARDEN DOGS
// ------------------------------------------

function createDog(x, z, color, earColor) {
  const dog = new THREE.Group();

  const fur = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.85
  });

  const ears = new THREE.MeshStandardMaterial({
    color: earColor,
    roughness: 0.9
  });

  const dark = new THREE.MeshStandardMaterial({
    color: '#302522'
  });

  const noseMat = new THREE.MeshStandardMaterial({
    color: '#382522'
  });

  // Body
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 20, 16),
    fur
  );
  body.scale.set(1.25, 0.9, 1.5);
  body.position.y = 0.55;
  dog.add(body);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.43, 24, 20),
    fur
  );
  head.position.set(0, 1.05, 0.48);
  dog.add(head);

  // Floppy ears
  for (let i = 0; i < 2; i++) {
    const ear = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 12),
      ears
    );

    ear.scale.set(0.7, 1.25, 0.65);
    ear.position.set(
      i === 0 ? -0.36 : 0.36,
      0.95,
      0.43
    );

    ear.rotation.z = i === 0 ? 0.25 : -0.25;
    dog.add(ear);
  }

  // Muzzle
  const muzzle = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 12),
    new THREE.MeshStandardMaterial({ color: '#fff0dc' })
  );
  muzzle.scale.set(1.2, 0.75, 0.8);
  muzzle.position.set(0, 0.92, 0.82);
  dog.add(muzzle);

  // Eyes
  for (let i = 0; i < 2; i++) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      dark
    );

    eye.position.set(
      i === 0 ? -0.16 : 0.16,
      1.12,
      0.84
    );

    dog.add(eye);
  }

  // Nose
  const nose = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 12, 12),
    noseMat
  );
  nose.position.set(0, 0.96, 1.0);
  dog.add(nose);

  // Four legs
  for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 14, 12),
      fur
    );

    leg.scale.set(0.85, 1.5, 0.85);
    leg.position.set(
      i < 2 ? -0.32 : 0.32,
      0.2,
      i % 2 === 0 ? 0.85 : -0.35
    );

    dog.add(leg);
  }

  // Tail
  const tail = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 14, 12),
    fur
  );

  tail.position.set(0, 0.85, -0.9);
  tail.rotation.x = -0.6;
  dog.add(tail);

  dog.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  dog.position.set(x, 0, z);
  scene.add(dog);

  return dog;
}

// Five dogs on the outer grass
const dogs = [
  createDog(-42, -35, '#f2dfbd', '#b88b60'),
  createDog(42, -32, '#ffffff', '#d8b99b'),
  createDog(-43, 32, '#b98250', '#75452e'),
  createDog(42, 35, '#e8c9a2', '#a77a51'),
  createDog(0, 48, '#77716a', '#514b48'),

  createDog(-25, -48, '#fffaf0', '#d9b99b'),
  createDog(25, 48, '#d9a477', '#8c5b3d'),
  createDog(-48, 5, '#c9c1b5', '#77716a'),
  createDog(48, -5, '#f5d6bd', '#b98250'),
  createDog(0, -50, '#e6e0d5', '#a99b88')
];

const rabbitStates = rabbits.map((rabbit, i) => ({
  x: rabbit.position.x,
  z: rabbit.position.z,
  angle: Math.random() * Math.PI * 2,
  speed: 3.0 + Math.random() * 1.5,
  phase: i * 1.7,
  lastTime: 0,
  turnTimer: 2 + Math.random() * 4
}));
const dogStates = dogs.map((dog, i) => ({
  x: dog.position.x,
  z: dog.position.z,
  angle: Math.random() * Math.PI * 2,
  speed: 1.2 + Math.random() * 0.8,
  phase: i * 1.5,
  turnTimer: 2 + Math.random() * 3
}));
// ------------------------------------------
// VISITOR 3D CHARACTER
// ------------------------------------------

function createVisitorCharacter(name, gender) {
  const visitor = new THREE.Group();

  const skin = new THREE.MeshStandardMaterial({
    color: '#f1c7a5',
    roughness: 0.8
  });

 const shirt = new THREE.MeshStandardMaterial({
  color: gender === 'female' ? '#e88fb5' : '#78a9c9',
  roughness: 0.8
});

  const pants = new THREE.MeshStandardMaterial({
    color: '#52647e',
    roughness: 0.85
  });

  const hair = new THREE.MeshStandardMaterial({
    color: '#49352f',
    roughness: 0.9
  });

  const dark = new THREE.MeshStandardMaterial({
    color: '#302522'
  });

  // Body
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.38, 0.65, 6, 12),
    shirt
  );
  body.position.y = 1.15;
  visitor.add(body);

  // Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 24, 20),
    skin
  );
  head.position.y = 1.95;
  visitor.add(head);

  // Hair
  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 20, 16),
    hair
  );
  hairTop.scale.set(1, 0.65, 1);
  hairTop.position.set(0, 2.12, -0.04);
  visitor.add(hairTop);
  // Female long hairstyle
if (gender === 'female') {

  // Long hair at the back
  const longHairBack = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 20, 16),
    hair
  );
  longHairBack.scale.set(1.05, 1.8, 0.65);
  longHairBack.position.set(0, 1.82, -0.16);
  visitor.add(longHairBack);

  // Left and right long hair strands
  for (const side of [-1, 1]) {
    const strand = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.10, 0.65, 4, 8),
      hair
    );

    strand.position.set(side * 0.29, 1.82, 0);
    strand.rotation.z = side * -0.08;
    visitor.add(strand);
  }
}

  // Eyes
  for (let i = 0; i < 2; i++) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 10),
      dark
    );
    eye.position.set(i === 0 ? -0.12 : 0.12, 1.98, 0.30);
    visitor.add(eye);
  }

  // Arms
  for (let i = 0; i < 2; i++) {
    const arm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.11, 0.48, 4, 8),
      shirt
    );
    arm.position.set(i === 0 ? -0.48 : 0.48, 1.25, 0);
    arm.rotation.z = i === 0 ? -0.18 : 0.18;
    visitor.add(arm);
  }

  // Legs
for (let i = 0; i < 2; i++) {
  const leg = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.13, 0.42, 4, 8),
    pants
  );

  leg.position.set(i === 0 ? -0.19 : 0.19, 0.43, 0);
  visitor.add(leg);
}

// Female skirt
if (gender === 'female') {
  const skirtMaterial = new THREE.MeshStandardMaterial({
    color: '#e88fb5',
    roughness: 0.85
  });

  const skirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.55, 0.65, 24),
    skirtMaterial
  );

  skirt.position.y = 0.72;
  visitor.add(skirt);
}

  // ==========================================
// EXTRA LARGE AVATAR NAME LABEL
// ==========================================

const canvas = document.createElement('canvas');
canvas.width = 1024;
canvas.height = 256;

const ctx = canvas.getContext('2d');

// Dark purple background
ctx.fillStyle = 'rgba(35, 12, 45, 0.95)';
ctx.beginPath();
ctx.roundRect(10, 10, 1004, 236, 45);
ctx.fill();

// Thick white border
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 10;
ctx.stroke();

// Large bold white name
ctx.font = 'bold 180px Arial';
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.shadowColor = '#000000';
ctx.shadowBlur = 12;
ctx.fillText(name, 512, 128, 950);

const texture = new THREE.CanvasTexture(canvas);
texture.colorSpace = THREE.SRGBColorSpace;

const label = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  })
);

// VERY LARGE DISPLAY SIZE
label.scale.set(16, 4, 1);
label.position.y = 5;
visitor.add(label);

  visitor.traverse(child => {
    if (child.isMesh) child.castShadow = true;
  });

  // Random visitor spawn position
let randomX;
let randomZ;

do {
  randomX = (Math.random() - 0.5) * 110;
  randomZ = (Math.random() - 0.5) * 110;
} while (
  (randomX / 32) ** 2 + (randomZ / 26) ** 2 < 1.3
);

visitor.position.set(randomX, 0, randomZ);
  scene.add(visitor);

  return visitor;
}

// ------------------------------------------
// POND BOUNDARY DETECTION
// ------------------------------------------

const pondBoundary = pondShape.getPoints(100);

function isInsidePond(x, z) {
  let inside = false;

  for (
    let i = 0, j = pondBoundary.length - 1;
    i < pondBoundary.length;
    j = i++
  ) {
    const a = pondBoundary[i];
    const b = pondBoundary[j];

    const intersect =
      ((a.y > z) !== (b.y > z)) &&
      (x < (b.x - a.x) * (z - a.y) / (b.y - a.y) + a.x);

    if (intersect) inside = !inside;
  }

  return inside;
}
// Independent swimming directions
const duckSwimStates = ducks.map(duck => ({
  x: duck.position.x,
  z: duck.position.z,
  angle: Math.random() * Math.PI * 2,
  speed: 0.018
}));

const swanSwimStates = swans.map(swan => ({
  x: swan.position.x,
  z: swan.position.z,
  angle: Math.random() * Math.PI * 2,
  speed: 0.012
}));

// ------------------------------------------
// 17. ANIMATION
// ------------------------------------------

const clock = new THREE.Clock();
const animationDummy = new THREE.Object3D();

// ------------------------------------------
// VISITOR MOVEMENT CONTROLS
// ------------------------------------------

const movementKeys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false
};

window.addEventListener('keydown', event => {
  if (event.key.toLowerCase() === 'w' || event.key === 'ArrowUp')
    movementKeys.forward = true;

  if (event.key.toLowerCase() === 's' || event.key === 'ArrowDown')
    movementKeys.backward = true;

  if (event.key.toLowerCase() === 'a' || event.key === 'ArrowLeft')
    movementKeys.left = true;

  if (event.key.toLowerCase() === 'd' || event.key === 'ArrowRight')
    movementKeys.right = true;

  if (event.key === 'Shift')
    movementKeys.run = true;
});

window.addEventListener('keyup', event => {
  if (event.key.toLowerCase() === 'w' || event.key === 'ArrowUp')
    movementKeys.forward = false;

  if (event.key.toLowerCase() === 's' || event.key === 'ArrowDown')
    movementKeys.backward = false;

  if (event.key.toLowerCase() === 'a' || event.key === 'ArrowLeft')
    movementKeys.left = false;

  if (event.key.toLowerCase() === 'd' || event.key === 'ArrowRight')
    movementKeys.right = false;

  if (event.key === 'Shift')
    movementKeys.run = false;
});


let visitorCharacter = null;
let currentVisitorName = '';
function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();
  // ------------------------------------------
// 3D JAPANESE POND WATER WAVES
// ------------------------------------------

const waterPositions = lake.geometry.attributes.position;

for (let i = 0; i < lakeVertexCount; i++) {
  const x = lakeBasePositions[i * 3];
  const y = lakeBasePositions[i * 3 + 1];

  const distance = Math.sqrt(x * x + y * y);

  const wave1 = Math.sin(distance * 0.65 - elapsed * 1.4) * 0.055;
  const wave2 = Math.sin(x * 0.45 + elapsed * 0.8) * 0.025;
  const wave3 = Math.cos(y * 0.55 - elapsed * 0.7) * 0.025;

  const edgeFade = Math.min(1, Math.max(0, (23 - distance) / 4));

  waterPositions.setZ(
    i,
    (wave1 + wave2 + wave3) * edgeFade
  );
}

waterPositions.needsUpdate = true;
lake.geometry.computeVertexNormals();
// ------------------------------------------
// AUTOMATIC DAY AND NIGHT CYCLE
// ------------------------------------------

const cycleDuration = 180;
const phase = (elapsed % cycleDuration) / cycleDuration;

const daylight = Math.max(
  0,
  Math.sin(phase * Math.PI * 2)
);

currentSkyColor.lerpColors(
  nightSkyColor,
  daySkyColor,
  daylight
);

currentFogColor.lerpColors(
  nightFogColor,
  dayFogColor,
  daylight
);

scene.background.copy(currentSkyColor);
scene.fog.color.copy(currentFogColor);

hemisphereLight.intensity = 0.25 + daylight * 1.95;
sunlight.intensity = 0.08 + daylight * 2.42;
// AUTOMATIC PARK LAMP LIGHTING
const nightFactor = 1 - daylight;

parkLamps.forEach(lamp => {
  lamp.light.intensity = nightFactor * 2.5;
  lamp.bulb.material.emissiveIntensity = 0.2 + nightFactor * 2.5;
});

sunlight.color.lerpColors(
  nightSunColor,
  daySunColor,
  daylight
);
 // ------------------------------------------
// ------------------------------------------
// ------------------------------------------
// NATURAL SWIMMING WITH POND EDGE AVOIDANCE
// ------------------------------------------

ducks.forEach((duck, i) => {
  const state = duckSwimStates[i];

  let nextX = state.x + Math.cos(state.angle) * state.speed;
  let nextZ = state.z + Math.sin(state.angle) * state.speed;

  // Look ahead and turn before reaching the pond edge
  const lookX = state.x + Math.cos(state.angle) * 2;
  const lookZ = state.z + Math.sin(state.angle) * 2;

  if (!isInsidePond(lookX, lookZ) || !isInsidePond(nextX, nextZ)) {
    state.angle = Math.atan2(-state.z, -state.x) + (i % 2 === 0 ? 0.35 : -0.35);
  } else {
    state.x = nextX;
    state.z = nextZ;
  }

  duck.position.set(
    state.x,
    0.35 + Math.sin(elapsed * 3 + i) * 0.025,
    state.z
  );

  duck.rotation.y = -state.angle;
});

swans.forEach((swan, i) => {
  const state = swanSwimStates[i];

  let nextX = state.x + Math.cos(state.angle) * state.speed;
  let nextZ = state.z + Math.sin(state.angle) * state.speed;

  const lookX = state.x + Math.cos(state.angle) * 2.5;
  const lookZ = state.z + Math.sin(state.angle) * 2.5;

  if (!isInsidePond(lookX, lookZ) || !isInsidePond(nextX, nextZ)) {
    state.angle = Math.atan2(-state.z, -state.x) + (i % 2 === 0 ? 0.4 : -0.4);
  } else {
    state.x = nextX;
    state.z = nextZ;
  }

  swan.position.set(
    state.x,
    0.35 + Math.sin(elapsed * 2 + i) * 0.02,
    state.z
  );

  swan.rotation.y = -state.angle;
});

  for (let i = 0; i < fallingCount; i++) {
    const p = fallingData[i];

    p.y -= p.speed;
    p.x += Math.sin(elapsed + i) * p.drift;
    p.z += Math.cos(elapsed * 0.6 + i) * p.drift;

    if (p.y < 0) {
      p.y = 15 + Math.random() * 12;
      p.x = (Math.random() - 0.5) * 120;
      p.z = (Math.random() - 0.5) * 120;
    }

    animationDummy.position.set(p.x, p.y, p.z);

    animationDummy.rotation.set(
      Math.sin(elapsed + i) * 0.8,
      elapsed * 0.4 + i,
      Math.cos(elapsed + i) * 0.8
    );

    const scale = 0.75 + Math.random() * 0.35;

    animationDummy.scale.set(scale, scale * 1.5, scale);
    animationDummy.updateMatrix();

    fallingPetals.setMatrixAt(i, animationDummy.matrix);
  }

  fallingPetals.instanceMatrix.needsUpdate = true;
  // ------------------------------------------
// ------------------------------------------
// ------------------------------------------
// DOG ROAMING AND TAIL WAGGING
// ------------------------------------------



// FREE ROAMING RABBIT HOPPING AI
// ------------------------------------------

rabbits.forEach((rabbit, i) => {
  const state = rabbitStates[i];

  // Initialize movement
  if (!state.initialized) {
    state.x = rabbit.position.x;
    state.z = rabbit.position.z;
    state.nextHopAt = elapsed + i * 0.3;
    state.hopping = false;
    state.initialized = true;
  }

  // Start a new hop
  if (!state.hopping && elapsed >= state.nextHopAt) {
    let foundDirection = false;

    for (let attempt = 0; attempt < 15; attempt++) {
      const angle = state.angle +
        (Math.random() - 0.5) * Math.PI * 1.5;

      const distance = 2.5 + Math.random() * 3.5;

      const targetX = state.x + Math.cos(angle) * distance;
      const targetZ = state.z + Math.sin(angle) * distance;

      const middleX = (state.x + targetX) / 2;
      const middleZ = (state.z + targetZ) / 2;

      if (
        Math.abs(targetX) < 59 &&
        Math.abs(targetZ) < 59 &&
        !isInsidePond(targetX, targetZ) &&
!isInsidePond(middleX, middleZ) &&
!isInsidePond(
  state.x + Math.cos(angle) * distance * 0.25,
  state.z + Math.sin(angle) * distance * 0.25
) &&
!isInsidePond(
  state.x + Math.cos(angle) * distance * 0.75,
  state.z + Math.sin(angle) * distance * 0.75
)
      ) {
        state.angle = angle;
        state.startX = state.x;
        state.startZ = state.z;
        state.targetX = targetX;
        state.targetZ = targetZ;
        state.hopStart = elapsed;
        state.hopDuration = 0.55 + Math.random() * 0.25;
        state.hopping = true;
        foundDirection = true;
        break;
      }
    }

    if (!foundDirection) {
      state.angle += Math.PI * (0.7 + Math.random() * 0.6);
      state.nextHopAt = elapsed + 0.3;
    }
  }

  // Move forward while hopping
  if (state.hopping) {
    const progress = Math.min(
      1,
      (elapsed - state.hopStart) / state.hopDuration
    );

    const smoothProgress =
      progress * progress * (3 - 2 * progress);

    const jumpHeight = Math.sin(progress * Math.PI) * 0.75;

    state.x = THREE.MathUtils.lerp(
      state.startX,
      state.targetX,
      smoothProgress
    );

    state.z = THREE.MathUtils.lerp(
      state.startZ,
      state.targetZ,
      smoothProgress
    );

    rabbit.position.set(
      state.x,
      jumpHeight,
      state.z
    );

    rabbit.rotation.y = -state.angle;
    rabbit.rotation.x = -Math.sin(progress * Math.PI) * 0.12;

    // Landing and resting
    if (progress >= 1) {
      state.hopping = false;
      state.nextHopAt = elapsed + 0.5 + Math.random() * 1.2;
      rabbit.position.y = 0;
      rabbit.rotation.x = 0;
    }
  }
});
// ------------------------------------------
// DEER FREE ROAMING AI
// ------------------------------------------

const deerNow = performance.now() / 1000;

deerStates.forEach((state, i) => {
  const animal = deer[i];

  const delta = state.lastTime
    ? Math.min(deerNow - state.lastTime, 0.05)
    : 0;

  state.lastTime = deerNow;
  state.turnTimer -= delta;

  if (state.turnTimer <= 0) {
    state.angle += (Math.random() - 0.5) * 1.8;
    state.turnTimer = 2 + Math.random() * 4;
  }

  const distance = state.speed * delta;

  const nextX = state.x + Math.sin(state.angle) * distance;
  const nextZ = state.z + Math.cos(state.angle) * distance;

  if (
    Math.abs(nextX) < 59 &&
    Math.abs(nextZ) < 59 &&
    !isInsidePond(nextX, nextZ)
  ) {
    state.x = nextX;
    state.z = nextZ;
  } else {
    state.angle += Math.PI * (0.5 + Math.random());
    state.turnTimer = 1;
  }

  animal.position.set(state.x, 0, state.z);
  animal.rotation.y = state.angle;

  // Gentle body movement while walking
  animal.position.y = Math.abs(
    Math.sin(deerNow * 3 + state.phase)
  ) * 0.035;
});
// DOGS FREE ROAMING AI
// ------------------------------------------

const dogNow = performance.now() / 1000;

dogStates.forEach((state, i) => {
  const dog = dogs[i];

  const delta = state.lastTime
    ? Math.min(dogNow - state.lastTime, 0.05)
    : 0;

  state.lastTime = dogNow;
  state.turnTimer -= delta;

  if (state.turnTimer <= 0) {
    state.angle += (Math.random() - 0.5) * 2.2;
    state.turnTimer = 2 + Math.random() * 3;
  }

  const distance = state.speed * delta;
  const nextX = state.x + Math.sin(state.angle) * distance;
  const nextZ = state.z + Math.cos(state.angle) * distance;

  if (
    Math.abs(nextX) < 60 &&
    Math.abs(nextZ) < 60 &&
    !isInsidePond(nextX, nextZ)
  ) {
    state.x = nextX;
    state.z = nextZ;
  } else {
    state.angle += Math.PI * (0.5 + Math.random());
  }

  dog.position.set(state.x, 0, state.z);
  dog.rotation.y = state.angle;
  dog.position.y = Math.abs(Math.sin(dogNow * 7 + state.phase)) * 0.08;
});


// ------------------------------------------
// PLAYER MOVEMENT
// ------------------------------------------

if (visitorCharacter) {
  const moveForward = Number(movementKeys.forward) - Number(movementKeys.backward);
  const moveSide = Number(movementKeys.right) - Number(movementKeys.left);

  if (moveForward !== 0 || moveSide !== 0) {
    const direction = new THREE.Vector3();

    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const rightDirection = new THREE.Vector3(
      -direction.z, 0, direction.x
    );

    const moveDirection = new THREE.Vector3()
      .addScaledVector(direction, moveForward)
      .addScaledVector(rightDirection, moveSide)
      .normalize();

    const speed = movementKeys.run ? 300 : 160;
    const delta = Math.min(clock.getDelta(), 0.05);

    const nextX = visitorCharacter.position.x + moveDirection.x * speed * delta;
    const nextZ = visitorCharacter.position.z + moveDirection.z * speed * delta;

const onBridge =
  nextX >= -30 &&
  nextX <= 30 &&
  Math.abs(nextZ + 8) <= 3.5;

if (
  Math.abs(nextX) < 59 &&
  Math.abs(nextZ) < 59 &&
  (!isInsidePond(nextX, nextZ) || onBridge)
) {
      visitorCharacter.position.x = nextX;
      visitorCharacter.position.z = nextZ;
      if (onBridge) {
  visitorCharacter.position.y = getBridgeHeight(nextX);
} else {
  visitorCharacter.position.y = 0;
}

      visitorCharacter.rotation.y = Math.atan2(
        moveDirection.x,
        moveDirection.z
      );
    }
  }
}
  // UPDATE REAL-TIME POND REFLECTION
waterReflectionFrame++;

if (waterReflectionFrame % 8 === 0) {
  // Hide the water temporarily to prevent reflection feedback
  lake.visible = false;

  waterReflectionCamera.update(renderer, scene);

  lake.visible = true;
}
// DONATION BOARD PROXIMITY + MOUSE HOVER
let donationPlayerNearby = false;

if (visitorCharacter) {
  const dx = visitorCharacter.position.x - donationBoard.position.x;
  const dz = visitorCharacter.position.z - donationBoard.position.z;
  const distance = Math.sqrt(dx * dx + dz * dz);

  donationPlayerNearby = distance < 7;
}

const donationTriggered =
  donationPlayerNearby || donationBoardHovered;

if (donationTriggered && !donationPopupDismissed) {
  donationPopup.style.display = 'block';
}

if (!donationTriggered) {
  donationPopup.style.display = 'none';
  donationPopupDismissed = false;
}

controls.update();
  renderer.render(scene, camera);
}
// ------------------------------------------


animate();

// ------------------------------------------
// 18. RESIZE
// ------------------------------------------

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
// ------------------------------------------

// ------------------------------------------
// VISITOR ENTER PARK
// ------------------------------------------

const welcomeScreen = document.getElementById('welcome-screen');
const nameInput = document.getElementById('visitor-name');
const enterButton = document.getElementById('enter-park');



function enterPark() {
  const visitorName = nameInput.value.trim();
  currentVisitorName = visitorName;

  if (!visitorName) {
    nameInput.focus();
    return;
  }

  if (visitorCharacter) {
    scene.remove(visitorCharacter);
  }

 const selectedGender = document.querySelector('input[name="gender"]:checked').value;

visitorCharacter = createVisitorCharacter(visitorName, selectedGender);

  welcomeScreen.style.display = 'none';
  document.getElementById('chat-panel').style.display = 'block';
}

enterButton.addEventListener('click', enterPark);

nameInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    enterPark();
  }
});
// 19. BACKGROUND MUSIC CONTROL
// ------------------------------------------

const backgroundMusic = new Audio('./audio/zen-garden_35580309.mp3');

backgroundMusic.loop = true;
backgroundMusic.volume = 0.35;

const musicToggle = document.getElementById('music-toggle');
const musicMute = document.getElementById('music-mute');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');

let musicMuted = false;

musicToggle.addEventListener('click', async () => {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();
      musicToggle.textContent = '❚❚ 暂停';
    } catch (error) {
      console.error('Music playback failed:', error);
    }
  } else {
    backgroundMusic.pause();
    musicToggle.textContent = '▶ 播放';
  }
});

musicMute.addEventListener('click', () => {
  musicMuted = !musicMuted;
  backgroundMusic.muted = musicMuted;
  musicMute.textContent = musicMuted ? '恢复声音' : '静音';
});

volumeSlider.addEventListener('input', () => {
  const volume = Number(volumeSlider.value);

  backgroundMusic.volume = volume / 100;
  volumeValue.textContent = volume + '%';

  if (volume > 0 && musicMuted) {
    musicMuted = false;
    backgroundMusic.muted = false;
    musicMute.textContent = '静音';
  }
});
// ------------------------------------------
// 20. MULTIPLAYER REAL-TIME CHAT
// ------------------------------------------

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

// Display a chat message safely
function displayChatMessage(data) {
  chatMessages.querySelector('.chat-placeholder')?.remove();

  const messageBox = document.createElement('div');
  messageBox.className = 'chat-message';

  const username = document.createElement('span');
  username.className = 'chat-username';
  username.textContent = data.username + ':';

  const time = document.createElement('span');
  time.style.fontSize = '11px';
  time.style.color = '#cccccc';
  time.style.marginLeft = '6px';

  time.textContent = new Date(data.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const message = document.createElement('div');
  message.textContent = data.message;

  messageBox.appendChild(username);
  messageBox.appendChild(time);
  messageBox.appendChild(message);

  chatMessages.appendChild(messageBox);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Load recent messages
async function loadChatMessages() {
  const { data, error } = await supabase
    .from('park_messages')
    .select('id, username, message, created_at')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Chat loading failed:', error);
    return;
  }

  chatMessages.innerHTML = '';

  data.reverse().forEach(displayChatMessage);
}

// Send a message
async function sendChatMessage() {
  const message = chatInput.value.trim();

  if (!message || !currentVisitorName) return;

  chatSend.disabled = true;

  const { error } = await supabase
    .from('park_messages')
    .insert({
      username: currentVisitorName,
      message: message
    });

  chatSend.disabled = false;

  if (error) {
    console.error('Message sending failed:', error);
    return;
  }

  chatInput.value = '';
}

chatSend.addEventListener('click', sendChatMessage);

chatInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
});

// Receive new messages instantly
supabase
  .channel('park-chat')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'park_messages'
    },
    payload => {
      displayChatMessage(payload.new);
    }
  )
  .subscribe();

// Load previous messages
loadChatMessages();
// ------------------------------------------
// 21. SAKURA WISH BOARD
// ------------------------------------------

const wishList = document.getElementById('wish-list');
const wishInput = document.getElementById('wish-input');
const wishSubmit = document.getElementById('wish-submit');

// Display a wish
function displayWish(data) {
  wishList.querySelector('.wish-placeholder')?.remove();

  // Wooden ema wish board background
  wishList.style.background = '#d9b58d';
  wishList.style.padding = '12px';

  const wishBox = document.createElement('div');

  wishBox.style.position = 'relative';
  wishBox.style.margin = '12px 2px 18px';
  wishBox.style.padding = '30px 12px 16px';
  wishBox.style.background =
    'linear-gradient(145deg, #f4dfb8, #dfbd8e)';
  wishBox.style.border = '2px solid #b58a59';
  wishBox.style.borderRadius = '5px';
  wishBox.style.clipPath =
    'polygon(50% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%)';
  wishBox.style.boxShadow = '0 4px 7px rgba(70,40,20,0.3)';
  wishBox.style.textAlign = 'center';

  // Red hanging cord
  const cord = document.createElement('div');
  cord.textContent = '🔴';
  cord.style.position = 'absolute';
  cord.style.top = '3px';
  cord.style.left = '50%';
  cord.style.transform = 'translateX(-50%)';
  cord.style.fontSize = '13px';

  // Author name
  const author = document.createElement('div');

  author.style.fontSize = '12px';
  author.style.fontWeight = 'bold';
  author.style.color = '#80502f';
  author.style.marginBottom = '9px';

  author.textContent = data.is_anonymous
    ? '🌸 Anonymous'
    : '🌸 ' + data.username;

  // Wish text
  const content = document.createElement('div');

  content.style.fontSize = '13px';
  content.style.lineHeight = '1.5';
  content.style.color = '#60452e';
  content.style.overflowWrap = 'anywhere';
  content.textContent = data.wish;

  wishBox.appendChild(cord);
  wishBox.appendChild(author);
  wishBox.appendChild(content);

  wishList.appendChild(wishBox);
  wishList.scrollTop = wishList.scrollHeight;
}

// Load previous wishes
async function loadWishes() {
  const { data, error } = await supabase
    .from('park_wishes')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Wish loading failed:', error);
    return;
  }

  wishList.innerHTML = '';

  if (data.length === 0) {
    wishList.innerHTML =
      '<div class="wish-placeholder">Be the first to make a wish! 🌸</div>';
    return;
  }

  data.forEach(displayWish);
}

// Submit a wish
async function submitWish() {
  const wish = wishInput.value.trim();

  if (!wish || !currentVisitorName) return;

  const privacy = document.querySelector(
    'input[name="wish-privacy"]:checked'
  ).value;

  const isAnonymous = privacy === 'anonymous';

  wishSubmit.disabled = true;

  const { error } = await supabase
    .from('park_wishes')
    .insert({
      username: isAnonymous ? null : currentVisitorName,
      is_anonymous: isAnonymous,
      wish: wish
    });

  wishSubmit.disabled = false;

  if (error) {
    console.error('Wish submission failed:', error);
    alert('Unable to send your wish. Please try again.');
    return;
  }

  wishInput.value = '';
}

wishSubmit.addEventListener('click', submitWish);

// Receive new wishes instantly
supabase
  .channel('park-wishes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'park_wishes'
    },
    payload => {
      displayWish(payload.new);
    }
  )
  .subscribe();

// Load previous wishes
loadWishes();