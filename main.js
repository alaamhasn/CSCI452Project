import * as THREE from "https://cdn.skypack.dev/three@0.150.1";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

//Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 100, 0);
pointLight.castShadow = true;
scene.add(pointLight);

const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xd9a16e }); // Light wood color
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray color
const wallGeometry = new THREE.BoxGeometry(200, 100, 1);

const createWall = (x, y, z, ry = 0) => {
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(x, y, z);
  wall.rotation.y = ry;
  wall.receiveShadow = true;
  scene.add(wall);
};

//Back
createWall(0, 50, -100);
// Front
createWall(0, 50, 100, Math.PI);
//Left
createWall(-100, 50, 0, Math.PI / 2);
//Right
createWall(100, 50, 0, -Math.PI / 2); // Right 

const loader = new GLTFLoader();
const objects = [];

const loadModel = (
  path,
  name,
  position,
  scale = 10,
  color = 0xffffff,
  rotation = { x: 0, y: 0, z: 0 }
) => {
  loader.load(path, (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        
        child.material = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          roughness: 0.5, 
          metalness: 0.5,
        });

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const tableGeometry = new THREE.BoxGeometry(10, 1, 10);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(position.x, position.y - 5, position.z);

    scene.add(table);

    gltf.scene.position.set(position.x, position.y, position.z);
    gltf.scene.scale.set(scale, scale, scale); // Scale the object
    gltf.scene.rotation.set(rotation.x, rotation.y, rotation.z); // Apply rotation
    gltf.scene.name = name;
    objects.push(gltf.scene);
    scene.add(gltf.scene);
  });
};

try {
  loadModel(
    "WaterBottle.glb",
    "Water Bottle",
    { x: -50, y: 5, z: 50 },
    80,
    0x1f77b4
  );
  loadModel("Avocado.glb", "Avocado", { x: 50, y: 5, z: -50 }, 105, 0x8c564b);
  loadModel("ToyCar.glb", "Small Car", { x: 50, y: 5, z: 50 }, 400, 0xff7f0e);
  loadModel(
    "DragonAttenuation.glb",
    "Dragon Attenuation",
    { x: 0, y: 5, z: -80 },
    10,
    0xd96600
  );
  loadModel(
    "BarramundiFish.glb",
    "Barramundi Fish",
    { x: -50, y: 5, z: -50 },
    30,
    0x3d85c6,
    { x: 0, y: -(Math.PI / 4), z: 0 }
  );
  loadModel(
    "audi_r8_lms_gt4.glb",
    "Super Car",
    { x: 50, y: 5, z: 0 },
    5,
    0x999999,
    { x: 0, y: -(Math.PI / 2), z: 0 }
  );
  loadModel(
    "asus_rog_strix_scar_17_2023_g733_gaming_laptop-1K.glb",
    "Laptop",
    { x: -50, y: -10, z: 0 },
    5,
    0xcccccc,
    { x: 0, y: Math.PI / 2, z: 0 }
  );
} catch (error) {
  console.error("Error loading model:", error);
}

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 50, 100); 
camera.lookAt(0, 50, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

let moveForward = false,
  moveBackward = false,
  moveLeft = false,
  moveRight = false;
let rotateLeft = false,
  rotateRight = false;
let moveUp = false,
  moveDown = false;
const moveSpeed = 1,
  rotSpeed = 0.05;

// Keyboard Actions
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "KeyW":
      moveForward = true;
      break;
    case "KeyS":
      moveBackward = true;
      break;
    case "KeyA":
      moveLeft = true;
      break;
    case "KeyD":
      moveRight = true;
      break;
    case "KeyQ":
      rotateLeft = true;
      break;
    case "KeyE":
      rotateRight = true;
      break;
    case "ControlLeft":
      moveDown = true;
      break;
    case "ShiftLeft":
      moveUp = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.code) {
    case "KeyW":
      moveForward = false;
      break;
    case "KeyS":
      moveBackward = false;
      break;
    case "KeyA":
      moveLeft = false;
      break;
    case "KeyD":
      moveRight = false;
      break;
    case "KeyQ":
      rotateLeft = false;
      break;
    case "KeyE":
      rotateRight = false;
      break;
    case "ControlLeft":
      moveDown = false;
      break;
    case "ShiftLeft":
      moveUp = false;
      break;
  }
});

const displayLabel = (object) => {
  const label = document.getElementById("label");
  label.style.display = "block";
  label.innerText = object.name;
  const vector = new THREE.Vector3();
  object.getWorldPosition(vector);
  vector.project(camera);
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
  label.style.left = `${x}px`;
  label.style.top = `${y}px`;
};

const hideLabel = () => {
  const label = document.getElementById("label");
  label.style.display = "none";
};

const checkProximity = () => {
  let labelDisplayed = false;
  for (const obj of objects) {
    const distance = camera.position.distanceTo(obj.position);
    if (distance < 30) {
      displayLabel(obj);
      labelDisplayed = true;
      break;
    }
  }
  if (!labelDisplayed) {
    hideLabel();
  }
};

const animate = () => {
  if (rotateLeft) camera.rotation.y += rotSpeed;
  if (rotateRight) camera.rotation.y -= rotSpeed;

  if (moveForward) camera.translateZ(-moveSpeed);
  if (moveBackward) camera.translateZ(moveSpeed);
  if (moveLeft) camera.translateX(-moveSpeed);
  if (moveRight) camera.translateX(moveSpeed);

  if (moveUp) camera.position.y += moveSpeed;
  if (moveDown) camera.position.y -= moveSpeed;

  checkProximity();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
