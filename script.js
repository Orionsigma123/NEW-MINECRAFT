const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add basic lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// Create a simple block
const blockSize = 1;
const blockGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
const blockMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const block = new THREE.Mesh(blockGeometry, blockMaterial);
block.position.set(0, blockSize / 2, 0);
scene.add(block);

// Create ground
const groundGeometry = new THREE.BoxGeometry(100, 1, 100);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -0.5;
scene.add(ground);

camera.position.y = 2; // Raise camera above the ground

// Controls
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.appendChild(controls.domElement);

document.addEventListener('click', () => {
    controls.lock();
});

const movementSpeed = 0.1;
const keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

function animate() {
    requestAnimationFrame(animate);
    
    if (keys['KeyW']) {
        controls.moveForward(movementSpeed);
    }
    if (keys['KeyS']) {
        controls.moveForward(-movementSpeed);
    }
    if (keys['KeyA']) {
        controls.moveRight(-movementSpeed);
    }
    if (keys['KeyD']) {
        controls.moveRight(movementSpeed);
    }
    
    renderer.render(scene, camera);
}

animate();
