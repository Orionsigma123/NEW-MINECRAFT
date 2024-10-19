let scene, camera, renderer, controls;
let worldSize = 100; // Size of the generated world
let chunkSize = 16; // Size of each chunk
let world = {}; // Store generated chunks
let player; // Player object
let inventory = []; // Player inventory
let keys = {}; // Track pressed keys
let velocity = new THREE.Vector3(); // Player velocity

init();
generateTerrain();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // Event listener for mouse lock
    document.addEventListener('click', () => {
        controls.lock();
    });

    // Handle key presses
    document.addEventListener('keydown', (event) => {
        keys[event.code] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });

    camera.position.set(0, 10, 20);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function generateTerrain() {
    for (let x = -worldSize; x < worldSize; x += chunkSize) {
        for (let z = -worldSize; z < worldSize; z += chunkSize) {
            let chunk = createChunk(x, z);
            world[`${x},${z}`] = chunk;
            scene.add(chunk);
        }
    }
}

function createChunk(x, z) {
    let geometry = new THREE.PlaneGeometry(chunkSize, chunkSize, chunkSize - 1, chunkSize - 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    let chunk = new THREE.Mesh(geometry, material);
    chunk.rotation.x = -Math.PI / 2;

    // Simple heightmap generation
    for (let i = 0; i < geometry.attributes.position.count; i++) {
        let posX = i % chunkSize;
        let posZ = Math.floor(i / chunkSize);
        geometry.attributes.position.setY(i, Math.sin((posX + x) * 0.1) * Math.cos((posZ + z) * 0.1) * 5);
    }
    geometry.computeVertexNormals();
    return chunk;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Player movement
    const speed = 0.1;
    if (keys['KeyW']) {
        velocity.z = -speed;
    } else if (keys['KeyS']) {
        velocity.z = speed;
    } else {
        velocity.z = 0;
    }

    if (keys['KeyA']) {
        velocity.x = -speed;
    } else if (keys['KeyD']) {
        velocity.x = speed;
    } else {
        velocity.x = 0;
    }

    // Move the player
    const direction = new THREE.Vector3();
    controls.getDirection(direction);
    direction.y = 0; // Prevent upward/downward movement
    direction.normalize(); // Ensure consistent speed regardless of direction
    const move = new THREE.Vector3();
    move.copy(direction).multiply(velocity);
    controls.getObject().position.add(move);

    renderer.render(scene, camera);
}
