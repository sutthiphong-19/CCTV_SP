import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "@fontsource/kalam/400.css";
import "@fontsource/kalam/700.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { VignetteShader } from "three/addons/shaders/VignetteShader.js";
import { gsap } from "gsap";

const root = document.querySelector("#canvas-root");
const $ = (selector) => document.querySelector(selector);
const parts = [];
const interactive = [];
const scene = new THREE.Scene();
scene.background = new THREE.Color("#604a35");
scene.fog = new THREE.Fog("#604a35", 23, 45);
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(7.5, 6.5, 10.5);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
renderer.shadowMap.enabled = false;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.28;
root.appendChild(renderer.domElement);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const vignette = new ShaderPass(VignetteShader);
vignette.uniforms["offset"].value = 0.82;
vignette.uniforms["darkness"].value = 0.42;
composer.addPass(vignette);
const filmPass = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, time: { value: 0 }, grain: { value: 0.035 }, aberration: { value: 0.0007 } },
  vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float grain;
    uniform float aberration;
    varying vec2 vUv;
    float noise(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+time*13.7)*43758.5453);}
    void main(){
      vec2 d=(vUv-0.5)*aberration;
      vec4 c;
      c.r=texture2D(tDiffuse,vUv+d).r;
      c.g=texture2D(tDiffuse,vUv).g;
      c.b=texture2D(tDiffuse,vUv-d).b;
      c.a=1.0;
      float n=(noise(gl_FragCoord.xy)-0.5)*grain;
      gl_FragColor=vec4(c.rgb+n,1.0);
    }`
});
composer.addPass(filmPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 5.2;
controls.maxDistance = 26;
controls.maxPolarAngle = Math.PI * 0.48;
controls.target.set(0, 0.25, 0);

scene.add(new THREE.HemisphereLight("#f4d8ac", "#39271b", 2.5));
const keyLight = new THREE.DirectionalLight("#ffd6a0", 3.2);
keyLight.position.set(-5, 10, 7);
keyLight.castShadow = false;
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight("#b5c3c4", 2.4);
fillLight.position.set(8, 5, -6);
scene.add(fillLight);
const warmLight = new THREE.PointLight("#ffb568", 85, 16, 2);
warmLight.position.set(-7, 5, 2);
scene.add(warmLight);

const mat = (color, roughness = 0.55, metalness = 0.05, extra = {}) => {
  const Material = "clearcoat" in extra ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  return new Material({ color, roughness, metalness, ...extra });
};
const materials = {
  body: mat("#62645d", 0.37, 0.4), dark: mat("#303330", 0.42, 0.3),
  alloy: mat("#8b8c83", 0.28, 0.8), rubber: mat("#201f1b", 0.92, 0.02),
  glass: mat("#15252a", 0.12, 0.5, { transparent: true, opacity: 0.8, clearcoat: 1, clearcoatRoughness: 0.08 }),
  lens: mat("#174656", 0.1, 0.72, { clearcoat: 1, clearcoatRoughness: 0.05 }),
  pcb: mat("#285748", 0.48, 0.2), gold: mat("#c2924d", 0.25, 0.82),
  chip: mat("#202326", 0.45, 0.35), cream: mat("#d8c8a9", 0.8, 0),
  red: mat("#9b4231", 0.43, 0.2), blue: mat("#436d87", 0.45, 0.3)
};

function box(parent, name, size, material, position, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = options.castShadow !== false;
  mesh.receiveShadow = true;
  if (options.radius) {
    const edges = new THREE.EdgesGeometry(mesh.geometry, 30);
    const wire = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: options.radius, transparent: true, opacity: 0.3 }));
    mesh.add(wire);
  }
  parent.add(mesh);
  return mesh;
}
function cylinder(parent, name, radiusTop, radiusBottom, height, material, position, radial = 32, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radial), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function torus(parent, name, radius, tube, material, position, rotation = [Math.PI / 2, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 48), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
function group(parent, name, position = [0, 0, 0]) {
  const result = new THREE.Group();
  result.name = name;
  result.position.set(...position);
  parent.add(result);
  return result;
}
function addPart(name, category, description, spec, position, size, build, options = {}) {
  const object = group(scene, name, position);
  const shadowMaterial = new THREE.MeshBasicMaterial({ map: contactShadowTexture, transparent: true, opacity: .46, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(Math.max(size[0] * 1.35, .9), Math.max(size[2] * 1.35, .9)), shadowMaterial);
  shadow.name = "soft contact shadow";
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -.07;
  shadow.renderOrder = 1;
  object.add(shadow);
  build(object);
  object.userData = { name, category, description, spec, basePosition: new THREE.Vector3(...position), baseRotation: object.rotation.clone(), size, ...options };
  parts.push(object);
  interactive.push(object);
  return object;
}

const contactShadowTexture = (() => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 63);
  gradient.addColorStop(0, "rgba(24,16,10,.5)");
  gradient.addColorStop(.45, "rgba(24,16,10,.22)");
  gradient.addColorStop(1, "rgba(24,16,10,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
})();

function woodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024; canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#745438"; ctx.fillRect(0, 0, 1024, 1024);
  let seed = 49;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 3800; i++) {
    const y = random() * 1024;
    const alpha = 0.025 + random() * 0.13;
    ctx.strokeStyle = random() > .5 ? `rgba(36,19,10,${alpha})` : `rgba(222,170,104,${alpha * .55})`;
    ctx.lineWidth = random() * 3 + .3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    const bend = random() * 90 - 45;
    ctx.bezierCurveTo(300, y + bend, 700, y - bend, 1024, y + random() * 8 - 4);
    ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const x = 70 + i * 225, y = 110 + random() * 760;
    ctx.strokeStyle = "rgba(36,20,11,.24)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, y, 80 + random() * 35, 18 + random() * 12, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y, 62, 11, 0, 0, Math.PI * 2); ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}
const wood = woodTexture();
const desk = new THREE.Mesh(new THREE.PlaneGeometry(34, 24), new THREE.MeshStandardMaterial({ map: wood, roughness: .82, color: "#bc9a71" }));
desk.rotation.x = -Math.PI / 2;
desk.position.y = -0.04;
desk.receiveShadow = true;
scene.add(desk);

const cameraAssembly = group(scene, "camera assembly", [0, .6, .35]);
const assembledPieces = [];
function registerAssembled(obj, id) { obj.userData.assembledId = id; assembledPieces.push(obj); return obj; }
function createBullet() {
  while (cameraAssembly.children.length) cameraAssembly.remove(cameraAssembly.children[0]);
  assembledPieces.length = 0;
  const housing = registerAssembled(box(cameraAssembly, "bullet housing", [3.1, 1.28, 1.28], materials.body, [0, 0, 0]), "housing");
  housing.rotation.z = -.1;
  registerAssembled(cylinder(cameraAssembly, "front bezel", .68, .68, .22, materials.alloy, [1.61, 0, 0], 48, [0, 0, Math.PI / 2]), "front");
  registerAssembled(cylinder(cameraAssembly, "lens assembly", .43, .47, .55, materials.dark, [1.94, 0, 0], 40, [0, 0, Math.PI / 2]), "lens");
  registerAssembled(cylinder(cameraAssembly, "lens glass", .34, .34, .04, materials.lens, [2.23, 0, 0], 48, [0, 0, Math.PI / 2]), "lensglass");
  registerAssembled(torus(cameraAssembly, "front glass rim", .36, .027, materials.gold, [2.26, 0, 0]), "rim");
  registerAssembled(box(cameraAssembly, "sun shield", [3.35, .1, 1.55], mat("#2c2d29", .4, .45), [0, .69, -.08]), "shield");
  registerAssembled(cylinder(cameraAssembly, "rear cap", .56, .57, .15, materials.dark, [-1.57, 0, 0], 40, [0, 0, Math.PI / 2]), "rear");
  const mount = registerAssembled(cylinder(cameraAssembly, "mount collar", .28, .34, .4, materials.alloy, [-.23, -.8, 0], 32), "mount");
  mount.rotation.x = Math.PI / 2;
  const arm = registerAssembled(box(cameraAssembly, "mount arm", [.32, .95, .32], materials.alloy, [-.23, -1.34, 0]), "arm");
  arm.rotation.z = -.25;
  const base = registerAssembled(box(cameraAssembly, "mount base", [.82, .18, .66], materials.body, [-.23, -1.83, 0]), "base");
  for (let i = 0; i < 4; i++) registerAssembled(cylinder(cameraAssembly, `mount screw ${i}`, .07, .07, .035, materials.gold, [-.51 + (i % 2) * .55, -1.72, -.2 + Math.floor(i / 2) * .4], 16), `screw${i}`);
  const irRing = registerAssembled(torus(cameraAssembly, "infrared LED ring", .52, .064, mat("#776044", .38, .6), [1.74, 0, 0]), "ir");
  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6;
    const led = new THREE.Mesh(new THREE.SphereGeometry(.055, 12, 10), mat("#af5540", .22, .2, { emissive: "#571b13", emissiveIntensity: .3 }));
    led.position.set(1.75, Math.sin(angle) * .52, Math.cos(angle) * .52);
    led.castShadow = true; cameraAssembly.add(led); registerAssembled(led, `led${i}`);
  }
  cameraAssembly.scale.setScalar(1.05);
  cameraAssembly.rotation.y = -.18;
}
function createDome() {
  while (cameraAssembly.children.length) cameraAssembly.remove(cameraAssembly.children[0]);
  assembledPieces.length = 0;
  const base = registerAssembled(cylinder(cameraAssembly, "dome camera base", 1.32, 1.42, .42, materials.body, [0, .14, 0], 64), "domebase");
  const domeMat = mat("#9bb0ad", .16, .25, { transparent: true, opacity: .32, clearcoat: 1, clearcoatRoughness: .04 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 56, 32, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
  dome.name = "smoked glass dome"; dome.position.set(0, .28, 0); dome.castShadow = true; cameraAssembly.add(dome); registerAssembled(dome, "domeglass");
  registerAssembled(cylinder(cameraAssembly, "dome rim", 1.35, 1.35, .12, materials.alloy, [0, -.09, 0], 64), "domerim");
  const inner = group(cameraAssembly, "internal camera module", [0, .58, 0]);
  const barrel = cylinder(inner, "dome lens barrel", .29, .36, .55, materials.dark, [0, 0, 0], 32);
  barrel.rotation.x = -.35;
  const glass = new THREE.Mesh(new THREE.SphereGeometry(.2, 24, 16), materials.lens); glass.position.set(0, -.1, .32); inner.add(glass);
  registerAssembled(inner, "domeinner");
  for (let i = 0; i < 4; i++) {
    const screw = cylinder(cameraAssembly, `dome screw ${i}`, .07, .07, .04, materials.gold, [Math.cos(i * Math.PI / 2) * .98, -.02, Math.sin(i * Math.PI / 2) * .98], 16);
    registerAssembled(screw, `domescrew${i}`);
  }
  cameraAssembly.scale.setScalar(1.05);
}
createBullet();

const groundShadow = new THREE.Mesh(new THREE.CircleGeometry(2.4, 48), new THREE.MeshBasicMaterial({ color: "#1d160f", transparent: true, opacity: .22 }));
groundShadow.rotation.x = -Math.PI / 2; groundShadow.position.set(0, .006, .35); groundShadow.scale.set(1.5, .62, 1); scene.add(groundShadow);

const data = [
  ["Camera Lens","OPTICAL SYSTEM","A multi-element optical assembly focuses incoming light onto the image sensor.","f / 1.8 · 2.8 mm",[0,0,0],[.64,.64,.64],"lens"],
  ["Lens Mount","OPTICAL SYSTEM","Precision threads hold the lens assembly in alignment with the sensor.","M12 · 12 mm",[0,0,0],[.68,.7,.68],"mount"],
  ["IR-Cut Filter","OPTICAL SYSTEM","Filters infrared wavelengths in daylight for natural color reproduction.","Day / night switch",[0,0,0],[.44,.05,.44],"filter"],
  ["Protective Glass Cover","OPTICAL SYSTEM","Optically clear front glass shields the lens from dust and moisture.","Coated · IP66",[0,0,0],[.94,.08,.94],"glasscover"],
  ["CMOS Image Sensor","IMAGE & ELECTRONICS","Converts light focused by the lens into an electronic image signal.","1/2.8 in · 4 MP",[0,0,0],[.64,.22,.62],"sensor"],
  ["Mainboard / PCB","IMAGE & ELECTRONICS","The printed circuit board connects imaging, processing, power and network subsystems.","4-layer · FR-4",[0,0,0],[1.65,.12,1.08],"pcb"],
  ["Image Processing Chip","IMAGE & ELECTRONICS","Processes image data and performs noise reduction, encoding and exposure control.","ISP · H.265",[0,0,0],[.48,.2,.44],"chip"],
  ["Memory Module","IMAGE & ELECTRONICS","Temporary working memory supports real-time video processing.","DDR · 1 GB",[0,0,0],[.67,.13,.25],"memory"],
  ["Network Interface Module","IMAGE & ELECTRONICS","Provides the Ethernet link for network video and device management.","10 / 100 BASE-T",[0,0,0],[.64,.25,.5],"network"],
  ["Infrared LED Array","NIGHT VISION","Infrared emitters illuminate the scene beyond the range of visible light.","850 nm · 18 LEDs",[0,0,0],[1.18,.12,1.18],"irarray"],
  ["Light Sensor","NIGHT VISION","Measures ambient illumination to trigger the camera's day-to-night mode.","Photodiode",[0,0,0],[.28,.13,.28],"lightsensor"],
  ["IR-Cut Mechanism","NIGHT VISION","A miniature actuator moves the IR filter in and out of the optical path.","Electromechanical",[0,0,0],[.7,.3,.44],"irmove"],
  ["Camera Housing","MECHANICAL STRUCTURE","Weather-sealed metal enclosure protects the camera's internal components.","Cast alloy · IP66",[0,0,0],[1.9,.85,1.05],"housing"],
  ["Front Cover","MECHANICAL STRUCTURE","Removable front bezel retains the protective glass and lens assembly.","Aluminium alloy",[0,0,0],[1.18,.16,1.18],"frontcover"],
  ["Rear Cover","MECHANICAL STRUCTURE","Sealed end cap protects cable entry and rear electronics.","Gasketed enclosure",[0,0,0],[.92,.17,.92],"rearcover"],
  ["Mounting Bracket","MECHANICAL STRUCTURE","Multi-axis bracket lets an installer aim and secure the camera.","3-axis adjustment",[0,0,0],[1.05,.9,.65],"bracket"],
  ["Adjustment Screws","MECHANICAL STRUCTURE","Locking screws secure the camera's pan, tilt and rotation settings.","Stainless steel",[0,0,0],[.5,.1,.3],"screws"],
  ["Waterproof Gasket","MECHANICAL STRUCTURE","A compressible seal prevents water and dust entering the housing.","Silicone · IP66",[0,0,0],[1.08,.08,1.08],"gasket"],
  ["Power Connector","POWER & CONNECTIVITY","Accepts a low-voltage DC supply when Power over Ethernet is not used.","12 V DC",[0,0,0],[.46,.31,.38],"power"],
  ["Ethernet Port (RJ45)","POWER & CONNECTIVITY","Connects the camera to a local network and carries its video stream.","RJ45 · 10 / 100",[0,0,0],[.55,.37,.45],"rj45"],
  ["PoE Circuit","POWER & CONNECTIVITY","Separates incoming power from Ethernet data for a single-cable installation.","IEEE 802.3af",[0,0,0],[.66,.14,.56],"poe"],
  ["Power Regulation Module","POWER & CONNECTIVITY","Converts input voltage into stable rails for the sensor and processor.","DC / DC · 12 V",[0,0,0],[.56,.16,.46],"regulator"],
  ["NVR Recorder","RECORDING & NETWORK","Receives video streams from network cameras and manages recording.","8-channel · H.265",[0,0,0],[1.35,.42,1.03],"nvr"],
  ["Hard Disk Drive","RECORDING & NETWORK","Magnetic storage keeps recorded footage available for review and retention.","3.5 in · 4 TB",[0,0,0],[1.05,.24,.8],"hdd"],
  ["Network Switch","RECORDING & NETWORK","Connects cameras and recording equipment on the local network.","8-port · Gigabit",[0,0,0],[1.18,.3,.8],"switch"],
  ["Ethernet Cable","RECORDING & NETWORK","Twisted-pair cable carries network data and, with PoE, camera power.","Cat 6 · PoE",[0,0,0],[1.3,.14,.22],"cable"]
];
const grid = {
  lens: (g) => { cylinder(g,"lens barrel",.31,.34,.49,materials.dark,[0,0,0],40); cylinder(g,"front glass",.24,.24,.025,materials.lens,[0,0,.26],40); torus(g,"lens ring",.29,.025,materials.gold,[0,0,.27],[0,0,0]); },
  mount: (g) => { cylinder(g,"threaded mount",.32,.32,.13,materials.alloy,[0,0,0],40); torus(g,"mount rim",.29,.025,materials.dark,[0,0,.08],[0,0,0]); },
  filter: (g) => { cylinder(g,"IR cut glass",.2,.2,.025,mat("#665444",.16,.22,{transparent:true,opacity:.78}),[0,0,0],36); torus(g,"filter edge",.23,.035,materials.alloy,[0,0,.02],[0,0,0]); },
  glasscover: (g) => { cylinder(g,"protective glass",.42,.42,.045,materials.glass,[0,0,0],48); torus(g,"glass rim",.45,.04,materials.alloy,[0,0,.025],[0,0,0]); },
  sensor: (g) => { box(g,"sensor ceramic", [.6,.11,.58],materials.cream,[0,0,0]); box(g,"CMOS die",[.34,.04,.32],mat("#283d3a",.2,.35),[0,.075,0]); box(g,"sensor gold pins",[.46,.025,.44],materials.gold,[0,-.07,0]); },
  pcb: (g) => { box(g,"main PCB",[1.65,.1,1.08],materials.pcb,[0,0,0]); for(let x=-.68;x<=.69;x+=.13) for(let z of [-.47,.47]) cylinder(g,"PCB contact",.025,.025,.018,materials.gold,[x,.063,z],8); box(g,"PCB trace",[1.35,.012,.015],mat("#9a7c43",.3,.55),[0,.06,0]); },
  chip: (g) => { box(g,"processor package",[.48,.18,.44],materials.chip,[0,0,0]); box(g,"processor die",[.28,.025,.24],mat("#353b3a",.25,.4),[0,.1,0]); for(let i=0;i<8;i++){box(g,"chip pin",[.04,.025,.025],materials.gold,[-.2+i*.057,-.09,.22]);box(g,"chip pin",[.04,.025,.025],materials.gold,[-.2+i*.057,-.09,-.22]);} },
  memory: (g) => { box(g,"memory package",[.66,.1,.22],materials.dark,[0,0,0]); for(let i=0;i<8;i++) box(g,"memory contact",[.045,.025,.12],materials.gold,[-.27+i*.078,-.065,0]); },
  network: (g) => { box(g,"network module",[.64,.18,.5],materials.blue,[0,0,0]); box(g,"network shield",[.38,.1,.29],materials.alloy,[0,.13,0]); },
  irarray: (g) => { cylinder(g,"IR circuit",.53,.53,.08,materials.dark,[0,0,0],48); for(let i=0;i<18;i++){const a=i*Math.PI/9;const led=new THREE.Mesh(new THREE.SphereGeometry(.052,10,8),mat("#c27654",.22,.1,{emissive:"#6f261a",emissiveIntensity:.3}));led.position.set(Math.sin(a)*.42,.06,Math.cos(a)*.42);led.castShadow=true;g.add(led);} },
  lightsensor: (g) => { box(g,"sensor body",[.27,.1,.27],materials.body,[0,0,0]); const s=new THREE.Mesh(new THREE.SphereGeometry(.09,18,14),materials.lens);s.position.y=.1;g.add(s); },
  irmove: (g) => { box(g,"IR mechanism",[.68,.13,.4],materials.dark,[0,0,0]); box(g,"filter carriage",[.28,.07,.29],materials.gold,[.12,.1,0]); cylinder(g,"actuator",.09,.09,.28,materials.alloy,[-.27,.12,0],16); },
  housing: (g) => { box(g,"camera shell",[1.9,.84,1.04],materials.body,[0,0,0]); box(g,"inner cavity",[1.62,.68,.77],materials.dark,[0,.1,0]); box(g,"housing cutaway",[1.45,.06,.65],materials.body,[0,.46,0]); },
  frontcover: (g) => { cylinder(g,"front bezel",.53,.53,.15,materials.alloy,[0,0,0],48); cylinder(g,"bezel opening",.38,.38,.16,materials.dark,[0,0,.08],48); torus(g,"bezel trim",.49,.025,materials.gold,[0,0,.09],[0,0,0]); },
  rearcover: (g) => { cylinder(g,"rear cover",.42,.46,.17,materials.body,[0,0,0],40); torus(g,"rear gasket",.39,.035,materials.rubber,[0,0,.09],[0,0,0]); },
  bracket: (g) => { box(g,"bracket base",[.78,.13,.54],materials.alloy,[0,-.34,0]); box(g,"bracket arm",[.23,.65,.25],materials.body,[0,0,0]); cylinder(g,"pivot",.2,.2,.16,materials.gold,[0,.17,.02],24,[Math.PI/2,0,0]); },
  screws: (g) => { for(let i=0;i<3;i++){cylinder(g,"adjustment screw",.055,.055,.27,materials.alloy,[-.18+i*.18,0,0],12);cylinder(g,"screw head",.09,.09,.04,materials.gold,[-.18+i*.18,.14,0],12);} },
  gasket: (g) => { const m=new THREE.Mesh(new THREE.TorusGeometry(.44,.045,10,48),materials.rubber);m.scale.set(1,1.2,1);g.add(m); },
  power: (g) => { box(g,"power socket",[.44,.28,.36],materials.dark,[0,0,0]); cylinder(g,"power pin",.075,.075,.16,materials.gold,[0,0,.21],16,[Math.PI/2,0,0]); },
  rj45: (g) => { box(g,"RJ45 housing",[.54,.34,.42],materials.alloy,[0,0,0]); box(g,"RJ45 port",[.35,.2,.27],materials.dark,[0,.02,.22]); for(let i=0;i<8;i++) box(g,"RJ45 contacts",[.022,.025,.13],materials.gold,[-.12+i*.034,.13,.23]); },
  poe: (g) => { box(g,"PoE board",[.65,.11,.54],materials.pcb,[0,0,0]); box(g,"PoE transformer",[.22,.16,.2],materials.gold,[-.14,.11,0]); box(g,"power IC",[.17,.13,.15],materials.chip,[.15,.1,0]); },
  regulator: (g) => { box(g,"regulator board",[.56,.1,.44],materials.pcb,[0,0,0]); cylinder(g,"inductor",.12,.12,.12,materials.gold,[-.12,.1,0],16); box(g,"power controller",[.14,.09,.13],materials.chip,[.12,.1,0]); },
  nvr: (g) => { box(g,"NVR chassis",[1.35,.4,1.03],materials.body,[0,0,0]); box(g,"NVR face",[1.2,.18,.035],materials.alloy,[0,-.09,.53]); for(let i=0;i<4;i++){const port=box(g,"NVR port",[.11,.07,.025],materials.dark,[-.42+i*.18,-.08,.56]);port.castShadow=false;} const led=new THREE.Mesh(new THREE.SphereGeometry(.025,8,8),materials.red);led.position.set(.49,-.08,.57);g.add(led); },
  hdd: (g) => { box(g,"hard disk case",[1.05,.22,.8],materials.alloy,[0,0,0]); cylinder(g,"disk spindle",.19,.19,.035,materials.gold,[0,.13,0],32); cylinder(g,"drive platter",.31,.31,.018,mat("#b7b9b2",.2,.8),[0,.14,0],40); },
  switch: (g) => { box(g,"switch chassis",[1.18,.3,.8],materials.body,[0,0,0]); for(let i=0;i<6;i++) box(g,"switch port",[.1,.12,.08],materials.gold,[-.46+i*.18,.09,.42]); },
  cable: (g) => { const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.6,.02,0),new THREE.Vector3(-.45,.18,0),new THREE.Vector3(-.2,.2,0),new THREE.Vector3(0,.02,0),new THREE.Vector3(.2,-.08,0),new THREE.Vector3(.45,.1,0),new THREE.Vector3(.6,.12,0)]);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,48,.045,10,false),mat("#d1b987",.55,.05));g.add(mesh); box(g,"RJ45 plug",[.16,.11,.12],materials.alloy,[-.64,0,0]); box(g,"RJ45 plug",[.16,.11,.12],materials.alloy,[.64,.1,0]); }
};

const layoutPositions = [];
const categoryLabels = [];
const categoryOrder = [...new Set(data.map(row => row[1]))];
const categoryCounts = new Map(categoryOrder.map(category => [category, data.filter(row => row[1] === category).length]));
const categoryIndices = new Map(categoryOrder.map(category => [category, 0]));
data.forEach((row, i) => {
  const [name, category, description, spec, , size, key] = row;
  const categoryIndex = categoryOrder.indexOf(category);
  const column = categoryIndices.get(category);
  const count = categoryCounts.get(category);
  categoryIndices.set(category, column + 1);
  const x = (column - (count - 1) / 2) * 2.05 + 1.6;
  const z = .4 + categoryIndex * 1.2;
  const base = [x, .12 + ((i % 4) * .015), z];
  layoutPositions.push(new THREE.Vector3(...base));
  const object = addPart(name, category, description, spec, base, size, grid[key], { componentKey: key, layoutIndex: i, originalPosition: new THREE.Vector3((i % 5 - 2) * .3, 0.18 + (Math.floor(i / 5) % 2) * .11, -.1) });
  object.visible = false;
});
categoryOrder.forEach((category, i) => {
  const label = canvasLabel(category);
  label.scale.set(2.15, .26, 1);
  label.position.set(1.6, .1, -.08 + i * 1.2);
  label.visible = false;
  categoryLabels.push(label);
  scene.add(label);
});



const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const hoverTag = $("#hover-tag");
let hovered = null;
let selected = null;
let state = "assembled";
let activeView = "overview";
let systemReturnState = "assembled";
let toastTimer;
let currentModel = "bullet";
const mainCopy = {
  en: {
    navOverview:"Overview",navComponents:"Components",navSystem:"System",navAbout:"About",supportLink:"SUPPORT",objectStudy:'OBJECT STUDY <b>001—026</b>',
    goldenHour:"GOLDEN HOUR",fieldStudy:"AN INTERACTIVE FIELD STUDY",introText:"Explore the anatomy of<br />surveillance technology.",disassemble:"Disassemble",introNote:"A closer look at what<br />keeps watch after dark.",partLabel:"PART",
    inventory:"COMPONENT INVENTORY",inventoryHeading:"Every part,<br /><em>in its place.</em>",progressLabel:"DISASSEMBLING",fieldNote:"FIELD NOTE",clickExplore:"CLICK TO EXPLORE",
    opticalPath:"OPTICAL PATH / 01",lensHeading:"Light, <em>in focus.</em>",lensDescription:"Light passes through the protective glass and precision-ground elements. The aperture controls exposure; the IR-cut filter keeps color true by day. The sensor turns each photon into a pixel.",visibleLight:"VISIBLE LIGHT",infrared:"INFRARED",
    signalPath:"SIGNAL PATH / 02",boardHeading:"From photon<br />to <em>packet.</em>",boardDescription:"The image processor encodes sensor data. PoE circuitry supplies power through the same cable that carries the video stream.",cmosSensor:"CMOS SENSOR",lightSignal:"Light → signal",imageProcessor:"IMAGE PROCESSOR",signalVideo:"Signal → video",networkPoe:"NETWORK / PoE",videoPower:"Video + power",
    connectedSystem:"A CONNECTED SYSTEM / 03",systemHeading:"From lens to <em>archive.</em>",systemDescription:"Follow the signal<br />through the system.",camera:"CAMERA",capturesVideo:"Captures video",switch:"SWITCH",routesData:"Routes data",recordsStream:"Records stream",storesFootage:"Stores footage",monitor:"MONITOR",displaysLiveView:"Displays live view",
    closeDetails:"Close component details",closeSnapshot:"Close snapshot",snapshotDate:"FIELD NOTES · 13 NOV 2026",downloadPrint:"DOWNLOAD PRINT",bulletCaption:"PROFESSIONAL BULLET CAMERA",
    bulletTitle:"Bullet camera model",domeTitle:"Dome camera model",bullet:"BULLET",dome:"DOME",resetView:"RESET VIEW",dragOrbit:"DRAG TO ORBIT",scrollZoom:"SCROLL TO ZOOM",assemble:"ASSEMBLE",capture:"CAPTURE",loading:"PREPARING THE WORKSHOP",workshopSubtitle:"OPTICS · ELECTRONICS · MECHANICS",
    categories:{"OPTICAL SYSTEM":"OPTICAL SYSTEM","IMAGE & ELECTRONICS":"IMAGE & ELECTRONICS","NIGHT VISION":"NIGHT VISION","MECHANICAL STRUCTURE":"MECHANICAL STRUCTURE","POWER & CONNECTIVITY":"POWER & CONNECTIVITY","RECORDING & NETWORK":"RECORDING & NETWORK"},
    toolbarOrbit:"DRAG TO ORBIT",toolbarZoom:"SCROLL TO ZOOM",toolbarComponents:"EXPLORE THE COMPONENTS",toolbarIdentify:"CLICK TO IDENTIFY",toolbarLens:"OPTICAL PATH",toolbarLight:"LIGHT → SENSOR",toolbarSignal:"SIGNAL PATH",toolbarNetwork:"SENSOR → NETWORK",toolbarSystem:"FOLLOW THE SIGNAL THROUGH THE SYSTEM",toastAbout:"A study of the parts behind the picture.",toastAssemble:"Assemble the camera to change its model.",toastSnapshot:"Snapshot ready to download."
  },
  th: {
    navOverview:"ภาพรวม",navComponents:"ส่วนประกอบ",navSystem:"ระบบ CCTV",navAbout:"เกี่ยวกับ",supportLink:"ศูนย์ช่วยเหลือ",objectStudy:'สำรวจอุปกรณ์ <b>001—026</b>',
    goldenHour:"แสงยามเย็น",fieldStudy:"สำรวจชิ้นส่วนแบบอินเทอร์แอคทีฟ",introText:"สำรวจกายวิภาคของ<br />เทคโนโลยีกล้องวงจรปิด",disassemble:"ถอดแยกชิ้นส่วน",introNote:"มองให้ใกล้ขึ้นว่าอะไร<br />ช่วยเฝ้าระวังในยามค่ำคืน",partLabel:"ชิ้นส่วน",
    inventory:"รายการส่วนประกอบ",inventoryHeading:"ทุกชิ้นส่วน<br /><em>จัดวางอย่างเป็นระเบียบ</em>",progressLabel:"กำลังถอดแยกชิ้นส่วน",fieldNote:"บันทึกทางเทคนิค",clickExplore:"คลิกเพื่อสำรวจ",
    opticalPath:"เส้นทางแสง / 01",lensHeading:"แสงที่ <em>โฟกัสคมชัด</em>",lensDescription:"แสงผ่านกระจกป้องกันและชิ้นเลนส์ที่เจียระไนอย่างแม่นยำ รูรับแสงควบคุมปริมาณแสง ส่วนฟิลเตอร์ตัดอินฟราเรดช่วยให้สีเป็นธรรมชาติในเวลากลางวัน เซนเซอร์แปลงโฟตอนเป็นพิกเซล",visibleLight:"แสงที่มองเห็น",infrared:"อินฟราเรด",
    signalPath:"เส้นทางสัญญาณ / 02",boardHeading:"จากโฟตอน<br /><em>สู่ข้อมูล</em>",boardDescription:"ชิปประมวลผลเข้ารหัสข้อมูลจากเซนเซอร์ วงจร PoE จ่ายไฟผ่านสายเส้นเดียวกับที่ส่งสัญญาณวิดีโอ",cmosSensor:"เซนเซอร์ CMOS",lightSignal:"แสง → สัญญาณ",imageProcessor:"ชิปประมวลผลภาพ",signalVideo:"สัญญาณ → วิดีโอ",networkPoe:"เครือข่าย / PoE",videoPower:"วิดีโอ + ไฟเลี้ยง",
    connectedSystem:"ระบบที่เชื่อมต่อกัน / 03",systemHeading:"จากเลนส์สู่<em>คลังบันทึก</em>",systemDescription:"ติดตามเส้นทางสัญญาณ<br />ภายในระบบ",camera:"กล้อง",capturesVideo:"บันทึกภาพ",switch:"สวิตช์",routesData:"ส่งต่อข้อมูล",recordsStream:"บันทึกสตรีม",storesFootage:"จัดเก็บภาพ",monitor:"จอภาพ",displaysLiveView:"แสดงภาพสด",
    closeDetails:"ปิดรายละเอียดส่วนประกอบ",closeSnapshot:"ปิดภาพถ่าย",snapshotDate:"บันทึกภาคสนาม · 13 พ.ย. 2026",downloadPrint:"ดาวน์โหลดภาพ",bulletCaption:"กล้องวงจรปิดทรงกระบอก",
    bulletTitle:"กล้องทรงกระบอก",domeTitle:"กล้องโดม",bullet:"ทรงกระบอก",dome:"โดม",resetView:"คืนมุมมอง",dragOrbit:"ลากเพื่อหมุน",scrollZoom:"เลื่อนเพื่อซูม",assemble:"ประกอบกลับ",capture:"ถ่ายภาพ",loading:"กำลังเตรียมโต๊ะช่าง",workshopSubtitle:"เลนส์ · อิเล็กทรอนิกส์ · โครงสร้าง",
    categories:{"OPTICAL SYSTEM":"ระบบเลนส์","IMAGE & ELECTRONICS":"เซนเซอร์และอิเล็กทรอนิกส์","NIGHT VISION":"ระบบอินฟราเรด","MECHANICAL STRUCTURE":"โครงสร้างกล้อง","POWER & CONNECTIVITY":"ไฟเลี้ยงและการเชื่อมต่อ","RECORDING & NETWORK":"ระบบบันทึกและเครือข่าย"},
    toolbarOrbit:"ลากเพื่อหมุน",toolbarZoom:"เลื่อนเพื่อซูม",toolbarComponents:"สำรวจส่วนประกอบ",toolbarIdentify:"คลิกเพื่อดูข้อมูล",toolbarLens:"เส้นทางแสง",toolbarLight:"แสง → เซนเซอร์",toolbarSignal:"เส้นทางสัญญาณ",toolbarNetwork:"เซนเซอร์ → เครือข่าย",toolbarSystem:"ติดตามสัญญาณภายในระบบ",toastAbout:"สำรวจส่วนประกอบเบื้องหลังภาพที่เห็น",toastAssemble:"ประกอบกล้องก่อนเปลี่ยนรุ่น",toastSnapshot:"บันทึกภาพแล้ว พร้อมดาวน์โหลด"
  }
};
const thaiParts = {
  lens:["เลนส์กล้อง","ระบบเลนส์","ชุดเลนส์หลายชิ้นรวมแสงให้โฟกัสลงบนเซนเซอร์รับภาพ"],
  mount:["เมาท์เลนส์","ระบบเลนส์","เกลียวความแม่นยำสูงช่วยจัดแนวชุดเลนส์กับเซนเซอร์รับภาพ"],
  filter:["ฟิลเตอร์ตัดอินฟราเรด","ระบบเลนส์","กรองช่วงคลื่นอินฟราเรดในเวลากลางวันเพื่อให้สีภาพเป็นธรรมชาติ"],
  glasscover:["กระจกป้องกันหน้าเลนส์","ระบบเลนส์","กระจกใสช่วยป้องกันฝุ่นและความชื้นโดยไม่บดบังภาพ"],
  sensor:["เซนเซอร์รับภาพ CMOS","เซนเซอร์และอิเล็กทรอนิกส์","แปลงแสงที่เลนส์โฟกัสให้เป็นสัญญาณภาพอิเล็กทรอนิกส์"],
  pcb:["แผงวงจรหลัก / PCB","เซนเซอร์และอิเล็กทรอนิกส์","แผงวงจรเชื่อมต่อระบบรับภาพ ประมวลผล จ่ายไฟ และเครือข่าย"],
  chip:["ชิปประมวลผลภาพ","เซนเซอร์และอิเล็กทรอนิกส์","ประมวลผลภาพ ลดสัญญาณรบกวน เข้ารหัส และควบคุมการรับแสง"],
  memory:["โมดูลหน่วยความจำ","เซนเซอร์และอิเล็กทรอนิกส์","หน่วยความจำชั่วคราวสำหรับประมวลผลวิดีโอแบบเรียลไทม์"],
  network:["โมดูลเครือข่าย","เซนเซอร์และอิเล็กทรอนิกส์","เชื่อมต่ออีเทอร์เน็ตสำหรับส่งวิดีโอและจัดการอุปกรณ์"],
  irarray:["ชุดหลอดอินฟราเรด","ระบบอินฟราเรด","หลอดอินฟราเรดช่วยส่องสว่างฉากที่มืดเกินกว่าตาเปล่าจะมองเห็น"],
  lightsensor:["เซนเซอร์วัดแสง","ระบบอินฟราเรด","ตรวจวัดแสงแวดล้อมเพื่อสลับโหมดกลางวันและกลางคืน"],
  irmove:["กลไกฟิลเตอร์ IR-Cut","ระบบอินฟราเรด","กลไกขนาดเล็กเลื่อนฟิลเตอร์อินฟราเรดเข้าและออกจากทางเดินแสง"],
  housing:["ตัวเรือนกล้อง","โครงสร้างกล้อง","โครงโลหะปิดผนึกช่วยปกป้องอุปกรณ์ภายในจากสภาพอากาศ"],
  frontcover:["ฝาครอบด้านหน้า","โครงสร้างกล้อง","ขอบฝาครอบยึดกระจกป้องกันและชุดเลนส์"],
  rearcover:["ฝาครอบด้านหลัง","โครงสร้างกล้อง","ฝาปิดผนึกช่วยป้องกันช่องสายและวงจรด้านหลัง"],
  bracket:["ขายึดกล้อง","โครงสร้างกล้อง","ขายึดปรับหลายแกนเพื่อจัดทิศทางและติดตั้งกล้องให้มั่นคง"],
  screws:["สกรูปรับมุม","โครงสร้างกล้อง","สกรูล็อกตำแหน่งการหมุน ก้ม และเงยของกล้อง"],
  gasket:["ปะเก็นกันน้ำ","โครงสร้างกล้อง","ซีลยืดหยุ่นช่วยป้องกันน้ำและฝุ่นเข้าสู่ตัวเรือน"],
  power:["ขั้วต่อไฟเลี้ยง","ไฟเลี้ยงและการเชื่อมต่อ","รับไฟ DC แรงดันต่ำในกรณีไม่ได้ใช้ Power over Ethernet"],
  rj45:["พอร์ตอีเทอร์เน็ต RJ45","ไฟเลี้ยงและการเชื่อมต่อ","เชื่อมกล้องเข้ากับเครือข่ายเพื่อรับส่งสตรีมวิดีโอ"],
  poe:["วงจร PoE","ไฟเลี้ยงและการเชื่อมต่อ","แยกไฟเลี้ยงจากข้อมูลอีเทอร์เน็ตเพื่อใช้งานผ่านสายเส้นเดียว"],
  regulator:["โมดูลควบคุมแรงดันไฟ","ไฟเลี้ยงและการเชื่อมต่อ","แปลงแรงดันไฟขาเข้าเป็นระดับคงที่สำหรับเซนเซอร์และชิป"],
  nvr:["เครื่องบันทึก NVR","ระบบบันทึกและเครือข่าย","รับสตรีมจากกล้องเครือข่ายและจัดการบันทึกวิดีโอ"],
  hdd:["ฮาร์ดดิสก์","ระบบบันทึกและเครือข่าย","จัดเก็บภาพที่บันทึกไว้เพื่อค้นหาและเปิดดูย้อนหลัง"],
  switch:["สวิตช์เครือข่าย","ระบบบันทึกและเครือข่าย","เชื่อมกล้องและเครื่องบันทึกเข้าด้วยกันบนเครือข่ายภายใน"],
  cable:["สายอีเทอร์เน็ต","ระบบบันทึกและเครือข่าย","สายคู่บิดเกลียวส่งข้อมูลและจ่ายไฟให้กล้องผ่าน PoE"]
};
let language=localStorage.getItem("cctv-language")==="en"?"en":"th";
function tr(key){return mainCopy[language][key]||mainCopy.en[key]||key;}
function displayPart(object){
  if(language==="en")return {name:object.userData.name,category:object.userData.category,description:object.userData.description};
  const localized=thaiParts[object.userData.componentKey];
  return localized?{name:localized[0],category:localized[1],description:localized[2]}:{name:object.userData.name,category:tr("categories")[object.userData.category]||object.userData.category,description:object.userData.description};
}
function updateCanvasLabels(){
  const localLabels={
    "OPTICAL SYSTEM":"ระบบเลนส์","IMAGE & ELECTRONICS":"อิเล็กทรอนิกส์","NIGHT VISION":"ระบบอินฟราเรด","MECHANICAL STRUCTURE":"โครงสร้างกล้อง","POWER & CONNECTIVITY":"ไฟเลี้ยงและการเชื่อมต่อ","RECORDING & NETWORK":"บันทึกและเครือข่าย",
    "CAMERA":"กล้อง","NETWORK SWITCH":"สวิตช์เครือข่าย","NVR RECORDER":"เครื่องบันทึก NVR","HARD DISK DRIVE":"ฮาร์ดดิสก์","MONITOR":"จอภาพ"
  };
  scene.traverse(object=>{
    const english=object.userData.labelEnglish;
    if(!english||!object.material?.map)return;
    const text=language==="th"?(localLabels[english]||english):english;
    const canvas=object.material.map.image;
    const context=canvas.getContext("2d");
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle="#e5d7bd";context.fillRect(0,0,canvas.width,canvas.height);
    context.fillStyle="#594630";context.font="24px monospace";context.textAlign="center";context.fillText(text,256,61);
    object.material.map.needsUpdate=true;
  });
}
function updateToolbar(){
  const el=$("#toolbar-center");
  if(state==="system"){el.textContent=tr("toolbarSystem");return;}
  if(state==="lens"){el.innerHTML=`<span class="orbit-icon">⟳</span> ${tr("toolbarLens")} <i></i> ${tr("toolbarLight")}`;return;}
  if(state==="board"){el.innerHTML=`<span class="orbit-icon">⟳</span> ${tr("toolbarSignal")} <i></i> ${tr("toolbarNetwork")}`;return;}
  if(state==="knolled"){el.innerHTML=`<span class="orbit-icon">⟳</span> ${tr("toolbarComponents")} <i></i> ${tr("toolbarIdentify")}`;return;}
  el.innerHTML=`<span class="orbit-icon">⟳</span> ${tr("toolbarOrbit")} <i></i> ${tr("toolbarZoom")}`;
}
function applyMainLanguage(){
  document.documentElement.lang=language;
  document.title=language==="th"?"เจาะลึกกล้อง CCTV — ห้องปฏิบัติการ 04":"Inside the CCTV — Workshop No. 04";
  document.querySelectorAll("[data-i18n]").forEach(node=>{node.innerHTML=tr(node.dataset.i18n);});
  document.querySelectorAll("[data-i18n-title]").forEach(node=>{node.title=tr(node.dataset.i18nTitle);});
  document.querySelectorAll("[data-i18n-aria]").forEach(node=>{node.setAttribute("aria-label",tr(node.dataset.i18nAria));});
  const activePart=selected||hovered||parts[0];
  if(selected)showDetails(selected);
  if(activePart){
    const part=displayPart(activePart);
    hoverTag.querySelector(".tag-index").textContent=`${tr("partLabel")} ${String(activePart.userData.layoutIndex+1).padStart(2,"0")}`;
    hoverTag.querySelector("strong").textContent=part.name;
    hoverTag.querySelector("small").textContent=part.category;
    if(!selected){
      $("#card-category").textContent=part.category;
      $("#card-title").textContent=part.name;
      $("#card-description").textContent=part.description;
    }
  }
  updateCanvasLabels();
  updateToolbar();
}
const languageSelect=$("#language-select");
languageSelect.value=language;
languageSelect.addEventListener("change",()=>{language=languageSelect.value;localStorage.setItem("cctv-language",language);applyMainLanguage();});
applyMainLanguage();
function setToast(text) {
  const toast = $("#toast"); toast.textContent = text; toast.classList.add("visible");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}
function showDetails(object) {
  selected = object;
  const part=displayPart(object);
  $("#card-category").textContent = part.category;
  $("#card-title").textContent = part.name;
  $("#card-description").textContent = part.description;
  $("#card-spec-value").textContent = object.userData.spec;
  $("#info-card").classList.add("visible");
}
function closeDetails() {
  $("#info-card").classList.remove("visible");
  if (selected) gsap.to(selected.scale, { x: 1, y: 1, z: 1, duration: .3, ease: "power2.out" });
  selected = null;
}
function moveHoverTag(object, x, y) {
  const rect = root.getBoundingClientRect();
  hoverTag.style.left = `${Math.max(14, Math.min(rect.width - 172, x - rect.left + 18))}px`;
  hoverTag.style.top = `${Math.max(12, Math.min(rect.height - 90, y - rect.top + 10))}px`;
  hoverTag.querySelector(".tag-index").textContent = `${tr("partLabel")} ${String(object.userData.layoutIndex + 1).padStart(2, "0")}`;
  const part=displayPart(object);
  hoverTag.querySelector("strong").textContent = part.name;
  hoverTag.querySelector("small").textContent = part.category;
  hoverTag.classList.add("visible");
}
function updateRay(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const targets = state === "assembled" ? [cameraAssembly] : interactive.filter(p => p.visible);
  const hits = raycaster.intersectObjects(targets, true);
  let found = null;
  if (hits.length) {
    let node = hits[0].object;
    while (node && !node.userData.category && node !== cameraAssembly) node = node.parent;
    if (node?.userData.category) found = node;
  }
  if (found !== hovered) {
    if (hovered && hovered !== selected) gsap.to(hovered.scale, { x: 1, y: 1, z: 1, duration: .22 });
    hovered = found;
    if (found) {
      gsap.to(found.scale, { x: 1.055, y: 1.055, z: 1.055, duration: .25, ease: "power2.out" });
      moveHoverTag(found, event.clientX, event.clientY);
      renderer.domElement.style.cursor = "pointer";
    } else {
      hoverTag.classList.remove("visible");
      renderer.domElement.style.cursor = state === "animating" ? "default" : "grab";
    }
  } else if (found) moveHoverTag(found, event.clientX, event.clientY);
}
renderer.domElement.addEventListener("pointermove", updateRay);
renderer.domElement.addEventListener("pointerleave", () => { hovered = null; hoverTag.classList.remove("visible"); });
renderer.domElement.addEventListener("click", (event) => {
  if (state === "animating" || state === "assembled") return;
  updateRay(event);
  if (!hovered) { closeDetails(); return; }
  showDetails(hovered);
  if (hovered.userData.componentKey === "lens") exploreLens(hovered);
  if (hovered.userData.componentKey === "pcb") exploreBoard(hovered);
});

function animateCamera(position, target, duration = 1.5) {
  const proxy = { x: camera.position.x, y: camera.position.y, z: camera.position.z, tx: controls.target.x, ty: controls.target.y, tz: controls.target.z };
  return gsap.to(proxy, {
    x: position[0], y: position[1], z: position[2], tx: target[0], ty: target[1], tz: target[2],
    duration, ease: "power3.inOut",
    onUpdate: () => { camera.position.set(proxy.x, proxy.y, proxy.z); controls.target.set(proxy.tx, proxy.ty, proxy.tz); }
  });
}
function setState(next) {
  state = next;
  $("#assemble").disabled = next !== "knolled";
  renderer.domElement.style.cursor = next === "animating" ? "default" : "grab";
  updateToolbar();
}
function disassemble() {
  if (!["assembled", "knolled"].includes(state)) return;
  if (state === "knolled") { assemble(); return; }
  setState("animating");
  $("#intro").classList.add("hidden");
  $("#knolling-heading").classList.remove("hidden");
  $("#progress-wrap").classList.add("visible");
  controls.enabled = false;
  const progress = { value: 0 };
  gsap.to(progress, { value: 100, duration: 2.6, ease: "power1.inOut", onUpdate: () => {
    $("#progress-value").textContent = `${String(Math.round(progress.value)).padStart(2,"0")}%`;
    $("#progress-bar").style.width = `${progress.value}%`;
  }});
  const timeline = gsap.timeline({ onComplete: () => {
    cameraAssembly.visible = false; groundShadow.visible = false;
    parts.forEach(p => { p.visible = true; });
    categoryLabels.forEach(label => { label.visible = true; });
    $("#progress-value").textContent = "100%";
    $("#progress-bar").style.width = "100%";
    $("#progress-wrap").classList.remove("visible");
    updateToolbar();
    setState("knolled"); controls.enabled = true;
  }});
  timeline.to(camera.position, { x: 1.6, y: 11.5, z: 3.4, duration: 1.2, ease: "power2.inOut" }, 0)
    .to(controls.target, { x: 1.6, y: 0, z: 3.4, duration: 1.2, ease: "power2.inOut" }, 0)
    .to(camera.rotation, { x: 0, y: 0, z: 0, duration: 1.2, ease: "power2.inOut" }, 0);
  assembledPieces.forEach((piece, i) => {
    const part = parts[i % parts.length];
    const target = part.userData.originalPosition.clone().add(cameraAssembly.position);
    const delay = .25 + i * .035;
    timeline.to(piece.position, { x: target.x, y: target.y + .5 + (i % 4) * .11, z: target.z, duration: .6, ease: "power2.out" }, delay)
      .to(piece.rotation, { x: Math.PI / 2, y: (i % 2 ? Math.PI : 0), z: 0, duration: .6, ease: "power2.out" }, delay);
  });
  timeline.to(cameraAssembly.scale, { x: .001, y: .001, z: .001, duration: .45, ease: "power2.in" }, .6);
  parts.forEach((part, i) => {
    const dest = layoutPositions[i];
    timeline.set(part, { visible: true }, .78 + i * .035);
    timeline.fromTo(part.position, { x: cameraAssembly.position.x, y: 1.4, z: cameraAssembly.position.z }, {
      x: dest.x, y: dest.y + .52 + (i % 4) * .045, z: dest.z, duration: .8 + Math.min(i, 8) * .025, ease: "power3.inOut"
    }, .8 + i * .035);
      timeline.fromTo(part.rotation, { x: Math.PI / 2, y: i % 2 ? Math.PI : 0, z: (i % 3) * .3 }, {
        x: 0, y: (i % 5 === 0 ? Math.PI / 2 : 0), z: 0, duration: .8, ease: "power2.inOut"
    }, .8 + i * .035);
    timeline.to(part.position, { y: dest.y, duration: .32, ease: "bounce.out" }, 1.25 + i * .035);
  });
}
function assemble() {
  if (state !== "knolled") return;
  setState("animating"); closeDetails(); disableExploration();
  controls.enabled = false;
  const timeline = gsap.timeline({ onComplete: () => {
    parts.forEach(p => { p.visible = false; p.position.copy(p.userData.basePosition); p.rotation.copy(p.userData.baseRotation); });
    categoryLabels.forEach(label => { label.visible = false; });
    cameraAssembly.visible = true; cameraAssembly.scale.setScalar(1.05); groundShadow.visible = true;
    $("#knolling-heading").classList.add("hidden");
    $("#intro").classList.remove("hidden");
    updateToolbar();
    controls.enabled = true; setState("assembled");
  }});
  parts.forEach((p, i) => {
    timeline.to(p.position, { x: cameraAssembly.position.x, y: 1.3, z: cameraAssembly.position.z, duration: .65, ease: "power2.in" }, i * .025)
      .to(p.scale, { x: .01, y: .01, z: .01, duration: .45, ease: "power2.in" }, i * .025);
  });
  timeline.to(camera.position, { x: 7.5, y: 6.5, z: 10.5, duration: 1.2, ease: "power2.inOut" }, .2)
    .to(controls.target, { x: 0, y: .25, z: 0, duration: 1.2, ease: "power2.inOut" }, .2)
    .to(cameraAssembly.scale, { x: 1.05, y: 1.05, z: 1.05, duration: .3 }, .9);
}
function resetView() {
  if (state === "animating") return;
  if (state === "assembled") {
    animateCamera([7.5,6.5,10.5],[0,.25,0],1.2);
    cameraAssembly.rotation.set(0,-.18,0);
  } else if (state === "knolled") {
    disableExploration(); closeDetails();
    animateCamera([1.6,11.5,3.4],[1.6,0,3.4],1.2);
  } else if (state === "lens" || state === "board") {
    disableExploration(); closeDetails(); setState("knolled");
    animateCamera([0,20,.01],[0,0,0],1.2);
  } else if (state === "system") exitSystem();
}

const explorationGroup = new THREE.Group();
explorationGroup.visible = false; scene.add(explorationGroup);
let lensRays = [];
function buildLensExploration() {
  explorationGroup.clear(); lensRays = [];
  const center = [0,0,0];
  const lensMat = mat("#567c80",.12,.43,{transparent:true,opacity:.75,clearcoat:1});
  for(let i=0;i<4;i++){
    const z=-1.05+i*.7;
    const g=new THREE.Mesh(new THREE.SphereGeometry(.7-i*.045,40,28,0,Math.PI*2,0,Math.PI),lensMat);
    g.rotation.x=-Math.PI/2;g.position.set(0,.2,z);g.scale.y=.56;g.castShadow=true;explorationGroup.add(g);
  }
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(.76,.76,3.8,48,1,true),materials.dark);
  barrel.rotation.x=Math.PI/2;barrel.position.set(0,.2,0);explorationGroup.add(barrel);
  const aperture=torus(explorationGroup,"aperture",.34,.045,materials.gold,[0,.2,-.1],[0,0,0]);
  aperture.scale.set(1,1,1);
  const filter = new THREE.Mesh(new THREE.CircleGeometry(.49,40),mat("#584c65",.18,.25,{transparent:true,opacity:.52,emissive:"#161020",emissiveIntensity:.24}));
  filter.position.set(0,.2,1.18);explorationGroup.add(filter);
  const sensor=box(explorationGroup,"sensor plane",[1.2,.05,.95],materials.pcb,[0,.2,2.45]);
  box(explorationGroup,"CMOS active area",[.66,.03,.52],mat("#276c61",.23,.35),[0,.25,2.45]);
  for(let i=0;i<5;i++){
    const geom=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.28+i*.14,.25,-2.4),new THREE.Vector3(-.22+i*.11,.25,-1.7),new THREE.Vector3(-.12+i*.06,.25,-.9),new THREE.Vector3(0,.25,2.4)]);
    const line=new THREE.Line(geom,new THREE.LineBasicMaterial({color:"#f7b963",transparent:true,opacity:.75}));
    explorationGroup.add(line);lensRays.push(line);
  }
}
buildLensExploration();
function exploreLens(object) {
  if (state !== "knolled") return;
  selected=object; setState("lens"); controls.enabled=false;
  categoryLabels.forEach(label => { label.visible = false; });
  $("#lens-panel").classList.remove("hidden");
  updateToolbar();
  object.visible=false; explorationGroup.visible=true; explorationGroup.position.copy(object.position);
  explorationGroup.scale.setScalar(.05);
  const tl=gsap.timeline();
  tl.to(explorationGroup.scale,{x:1,y:1,z:1,duration:.85,ease:"back.out(1.4)"},0)
    .to(camera.position,{x:0,y:8.8,z:8.2,duration:1.2,ease:"power3.inOut"},0)
    .to(controls.target,{x:object.position.x,y:0,z:object.position.z,duration:1.2,ease:"power3.inOut"},0);
  gsap.to(explorationGroup.children.slice(0,4).map(o=>o.position),{z:"+=.1",duration:1.6,stagger:.12,yoyo:true,repeat:-1,ease:"sine.inOut"});
}
function disableExploration() {
  $("#lens-panel").classList.add("hidden"); $("#board-panel").classList.add("hidden");
  explorationGroup.visible=false; lensRays.forEach(r=>r.visible=false);
  parts.forEach(p=>{ if(p.userData.componentKey==="lens"||p.userData.componentKey==="pcb") p.visible=true; });
}

const boardHighlights = new THREE.Group(); scene.add(boardHighlights); boardHighlights.visible=false;
let boardLines = [];
function buildBoardHighlights(){
  boardHighlights.clear();boardLines=[];
  const nodes=[[-.42,.35,0],[0,.38,0],[.42,.35,0],[-.3,.3,.27],[.28,.3,.25]];
  nodes.forEach((p,i)=>{
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(.09,14,10),new THREE.MeshBasicMaterial({color:["#77bdac","#dfa36e","#a98bc4","#d6b45e","#8dadd1"][i]}));
    sphere.position.set(...p);boardHighlights.add(sphere);
  });
  [[0,1],[1,2],[0,3],[2,4],[3,4]].forEach(([a,b])=>{
    const line=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineDashedMaterial({color:"#e5c28c",dashSize:.07,gapSize:.055,transparent:true,opacity:.8}));
    line.userData.points=[nodes[a],nodes[b]];boardHighlights.add(line);boardLines.push(line);
  });
}
buildBoardHighlights();
function exploreBoard(object){
  if(state!=="knolled")return;
  selected=object;setState("board");controls.enabled=false;
  categoryLabels.forEach(label => { label.visible = false; });
  $("#board-panel").classList.remove("hidden");
  updateToolbar();
  object.visible=false;boardHighlights.visible=true;boardHighlights.position.copy(object.position);
  boardLines.forEach((line,i)=>{line.geometry.dispose();line.geometry=new THREE.BufferGeometry().setFromPoints(boardLines[i].userData.points.map(p=>new THREE.Vector3(...p)));line.computeLineDistances();});
  boardHighlights.scale.setScalar(.05);
  gsap.timeline().to(boardHighlights.scale,{x:1,y:1,z:1,duration:.8,ease:"back.out(1.3)"},0)
    .to(camera.position,{x:object.position.x,y:8.6,z:object.position.z+7,duration:1.15,ease:"power3.inOut"},0)
    .to(controls.target,{x:object.position.x,y:0,z:object.position.z,duration:1.15,ease:"power3.inOut"},0);
  boardLines.forEach(line=>gsap.fromTo(line.material,{opacity:.1},{opacity:.9,duration:.6,repeat:-1,yoyo:true,delay:Math.random()*.4}));
}
function closeExplore(){
  if(state!=="lens"&&state!=="board")return;
  disableExploration();setState("knolled");controls.enabled=true;selected=null;$("#info-card").classList.remove("visible");
  categoryLabels.forEach(label => { label.visible = true; });
  animateCamera([1.6,11.5,3.4],[1.6,0,3.4],1.1);
  updateToolbar();
}

const systemGroup=new THREE.Group();scene.add(systemGroup);systemGroup.visible=false;
function buildSystemScene(){
  const deviceMat=materials.body;
  function drawDevice(name,pos,type){
    const g=group(systemGroup,name,pos);
    if(type==="camera"){
      box(g,"system camera",[1.2,.48,.48],deviceMat,[0,0,0]);cylinder(g,"camera lens",.22,.25,.3,materials.dark,[.68,0,0],28,[0,0,Math.PI/2]);cylinder(g,"lens glass",.15,.15,.025,materials.lens,[.85,0,0],28,[0,0,Math.PI/2]);
    }else if(type==="monitor"){
      box(g,"monitor screen",[1.2,.76,.1],mat("#252928",.32,.25),[0,.15,0]);box(g,"monitor display",[1.08,.64,.025],mat("#263d35",.25,.15,{emissive:"#102018",emissiveIntensity:.35}),[0,.15,.07]);box(g,"monitor stand",[.16,.3,.16],materials.alloy,[0,-.35,0]);
    }else if(type==="switch"){
      box(g,"network switch",[1.15,.35,.72],deviceMat,[0,0,0]);for(let i=0;i<5;i++)box(g,"switch port",[.12,.1,.04],materials.gold,[-.43+i*.2,.12,.38]);
    }else if(type==="nvr"){
      box(g,"recorder chassis",[1.2,.38,.85],deviceMat,[0,0,0]);box(g,"recorder panel",[1.05,.12,.035],materials.alloy,[0,-.1,.44]);
    }else if(type==="hdd"){
      box(g,"disk",[.9,.22,.68],materials.alloy,[0,0,0]);cylinder(g,"platter",.24,.24,.02,mat("#b9b9b1",.2,.8),[0,.13,0],30);
    }
    const label=canvasLabel(name.toUpperCase());
    label.position.set(0,-.65,0);g.add(label);
    return g;
  }
  drawDevice("Camera",[ -5,.3,0],"camera");
  drawDevice("Network switch",[-2.4,.3,0],"switch");
  drawDevice("NVR recorder",[.15,.3,0],"nvr");
  drawDevice("Hard disk drive",[2.8,.3,0],"hdd");
  drawDevice("Monitor",[5.3,.3,0],"monitor");
  const cableMat=new THREE.MeshBasicMaterial({color:"#dfb16e",transparent:true,opacity:.7});
  const flowPoints=[[-4.2,.35,0],[-3.1,.35,0],[-1.8,.35,0],[-.45,.35,0],[.8,.35,0],[2.0,.35,0],[3.3,.35,0],[4.4,.35,0]];
  for(let i=0;i<flowPoints.length-1;i++){
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...flowPoints[i]),new THREE.Vector3(...flowPoints[i+1])]),cableMat.clone());
    systemGroup.add(line);
    const dot=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),new THREE.MeshBasicMaterial({color:"#ffe0a6"}));
    dot.position.set(...flowPoints[i]);systemGroup.add(dot);
    gsap.to(dot.position,{x:flowPoints[i+1][0],duration:.8,repeat:-1,ease:"none",delay:i*.12,onRepeat:()=>dot.position.set(...flowPoints[i])});
  }
}
function canvasLabel(text){
  const c=document.createElement("canvas");c.width=512;c.height=100;const ctx=c.getContext("2d");
  ctx.fillStyle="#e5d7bd";ctx.fillRect(0,0,512,100);ctx.fillStyle="#594630";ctx.font="24px monospace";ctx.textAlign="center";ctx.fillText(text,256,61);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true}));sprite.userData.labelEnglish=text;sprite.scale.set(1.6,.31,1);return sprite;
}
buildSystemScene();
function enterSystem(){
  if(state==="animating")return;
  if(state==="system")return;
  if(state==="assembled"){
    disassemble();
    const wait=()=>{if(state==="knolled")openSystem();else setTimeout(wait,100);};wait();return;
  }
  if(state==="lens"||state==="board"){closeExplore();setTimeout(openSystem,250);return;}
  openSystem();
}
function openSystem(){
  systemReturnState=state==="assembled"?"knolled":state;
  setState("system");activeView="system";controls.enabled=false;closeDetails();
  parts.forEach(p=>p.visible=false);categoryLabels.forEach(label=>{label.visible=false;});cameraAssembly.visible=false;groundShadow.visible=false;
  systemGroup.visible=true;$("#system-panel").classList.remove("hidden");
  $("#knolling-heading").classList.add("hidden");updateToolbar();
  animateCamera([0,11,15],[0,0,0],1.4);
}
function exitSystem(){
  systemGroup.visible=false;$("#system-panel").classList.add("hidden");controls.enabled=true;
  if(state==="system"){
    if(systemReturnState==="knolled"){
      parts.forEach(p=>p.visible=true);categoryLabels.forEach(label=>{label.visible=true;});
      setState("knolled");$("#knolling-heading").classList.remove("hidden");$("#intro").classList.add("hidden");
      updateToolbar();
      animateCamera([1.6,11.5,3.4],[1.6,0,3.4],1.1);
    }else{
      cameraAssembly.visible=true;groundShadow.visible=true;setState("assembled");
      $("#intro").classList.remove("hidden");$("#knolling-heading").classList.add("hidden");
      updateToolbar();
      animateCamera([7.5,6.5,10.5],[0,.25,0],1.1);
    }
  }
  activeView="overview";document.querySelectorAll(".nav-link").forEach(n=>n.classList.toggle("active",n.dataset.view==="overview"));
}

function playShutter(){
  try{
    const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
    const context=new AudioCtx(),bufferSize=context.sampleRate*.12,buffer=context.createBuffer(1,bufferSize,context.sampleRate),channel=buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++)channel[i]=(Math.random()*2-1)*Math.pow(1-i/bufferSize,2);
    const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.setValueAtTime(.14,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.12);source.connect(gain);gain.connect(context.destination);source.start();source.onended=()=>context.close();
  }catch(error){console.warn("Shutter audio was unavailable.",error);}
}
function capture(){
  renderer.render(scene,camera);
  const image=renderer.domElement.toDataURL("image/png");
  $("#snapshot-img").src=image;
  const caption=selected?displayPart(selected).name:(state==="assembled"?(language==="th"?"กล้องทรงกระบอก":"BULLET CAMERA"):(language==="th"?"ภาพส่วนประกอบ":"COMPONENT STUDY"));
  $("#snapshot-caption").textContent=`${caption.toUpperCase()} / STUDY NO. 04`;
  $("#download-link").href=image;
  $("#capture-card").classList.remove("hidden");
  $("#capture-flash").classList.remove("flash");void $("#capture-flash").offsetWidth;$("#capture-flash").classList.add("flash");
  playShutter();
}

$("#disassemble").addEventListener("click",disassemble);
$("#assemble").addEventListener("click",assemble);
$("#reset-view").addEventListener("click",resetView);
$("#capture").addEventListener("click",capture);
$("#close-card").addEventListener("click",closeDetails);
$("#close-capture").addEventListener("click",()=>$("#capture-card").classList.add("hidden"));
document.querySelectorAll("[data-close-explore]").forEach(b=>b.addEventListener("click",closeExplore));
document.querySelectorAll(".nav-link").forEach(button=>button.addEventListener("click",()=>{
  const view=button.dataset.view;
  document.querySelectorAll(".nav-link").forEach(n=>n.classList.toggle("active",n===button));
  activeView=view;
  if(view==="system"){enterSystem();return;}
  if(state==="system"){
    exitSystem();
    document.querySelectorAll(".nav-link").forEach(n=>n.classList.toggle("active",n===button));
    activeView=view;
  }
  if(view==="components"&&state==="assembled")disassemble();
  if(view==="overview"&&state==="knolled")assemble();
  if(view==="about")setToast(tr("toastAbout"));
}));
$("#model-bullet").addEventListener("click",()=>{
  if(currentModel==="bullet")return;
  if(state!=="assembled"){setToast(tr("toastAssemble"));return;}
  currentModel="bullet";createBullet();$("#model-bullet").classList.add("active");$("#model-dome").classList.remove("active");
});
$("#model-dome").addEventListener("click",()=>{
  if(currentModel==="dome")return;
  if(state!=="assembled"){setToast(tr("toastAssemble"));return;}
  currentModel="dome";createDome();$("#model-dome").classList.add("active");$("#model-bullet").classList.remove("active");
});
controls.addEventListener("start",()=>{renderer.domElement.style.cursor="grabbing";});
controls.addEventListener("end",()=>{renderer.domElement.style.cursor="grab";});

function resize(){
  const width=root.clientWidth,height=root.clientHeight;
  if(!width||!height)return;
  camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);composer.setSize(width,height);
}
window.addEventListener("resize",resize);
resize();
const clock=new THREE.Clock();
function render(){
  requestAnimationFrame(render);
  controls.update();
  const t=clock.getElapsedTime();
  filmPass.uniforms.time.value=t;
  lensRays.forEach((ray,i)=>{ray.material.opacity=.45+Math.sin(t*3+i)*.3;});
  composer.render();
}
render();

const loading = $("#loading-screen");
window.setTimeout(()=>loading.classList.add("done"),650);
