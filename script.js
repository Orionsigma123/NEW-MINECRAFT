let scene, camera, renderer, controls;
let worldSize = 100; // Size of the generated world
let chunkSize = 16; // Size of each chunk
let world = {}; // Store generated chunks
let player; // Player object
let inventory = []; // Player inventory

init();
generateTerrain();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 10, 20);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

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
    renderer.render(scene, camera);
}
