const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10).normalize();
scene.add(light);

// Player Controls
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

// Inventory and Crafting
const inventory = {};
const craftingRecipes = {
    'wooden_plank': { 'wood': 1 },
    'torch': { 'coal': 1, 'stick': 1 },
};

function addToInventory(item) {
    if (inventory[item]) {
        inventory[item]++;
    } else {
        inventory[item] = 1;
    }
}

function craft(item) {
    const recipe = craftingRecipes[item];
    if (recipe) {
        const canCraft = Object.keys(recipe).every(key => inventory[key] >= recipe[key]);
        if (canCraft) {
            Object.keys(recipe).forEach(key => inventory[key] -= recipe[key]);
            addToInventory(item);
            console.log(`Crafted: ${item}`);
        } else {
            console.log(`Not enough materials to craft: ${item}`);
        }
    }
}

// Terrain Generation
const blockSize = 1;
const terrain = [];

function generateTerrain() {
    const size = 16; // Size of the terrain
    const heightMap = [];

    for (let x = 0; x < size; x++) {
        heightMap[x] = Math.floor(Math.random() * 4) + 1; // Random height between 1 and 4
        for (let y = 0; y < heightMap[x]; y++) {
            addBlock(x, y, 0, 0x8B4513); // Brown color for dirt
        }
    }
}

function addBlock(x, y, z, color) {
    const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
    const material = new THREE.MeshLambertMaterial({ color });
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y + blockSize / 2, z);
    scene.add(block);
    terrain.push(block);
}

// Block Destruction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function destroyBlock() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(terrain);
    if (intersects.length > 0) {
        const block = intersects[0].object;
        scene.remove(block);
        terrain.splice(terrain.indexOf(block), 1);
        addToInventory('wood'); // Add wood to inventory for simplicity
    }
}

// Mobs
const mobs = [];

function createMob(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const mob = new THREE.Mesh(geometry, material);
    mob.position.set(x, y, z);
    scene.add(mob);
    mobs.push(mob);
}

function moveMobs() {
    mobs.forEach(mob => {
        mob.position.x += (Math.random() - 0.5) * 0.05; // Random movement
        mob.position.z += (Math.random() - 0.5) * 0.05;
    });
}

// Main Loop
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
    if (keys['Space']) {
        destroyBlock(); // Use space to destroy a block
    }

    moveMobs(); // Move mobs

    renderer.render(scene, camera);
}

// Initialize
generateTerrain();
createMob(5, 1, 5); // Create a mob at (5, 1, 5)

animate();
