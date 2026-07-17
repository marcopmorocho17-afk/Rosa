// ==========================================
// 🌹 TU CONFIGURACIÓN DE MENSAJE
// ==========================================
const mensajeUnico = 'Te deseo una bonita noche que duermas bien y que amanzezcas con energias 9:17pm';

// Esperar a que la librería Three.js esté completamente cargada en el navegador
window.addEventListener('load', () => {
    // Verificar si la librería se descargó correctamente
    if (typeof THREE === 'undefined') {
        console.error("La librería Three.js no se cargó correctamente. Reintentando...");
        return;
    }
    
    // Iniciar todo el entorno 3D de forma segura
    init3D();
});

function init3D() {
    // ==========================================
    // 🎮 CONFIGURACIÓN DEL MOTOR EN 3D (Three.js)
    // ==========================================
    const container = document.getElementById('canvas-3d-container');

    // 1. Escena, Cámara y Renderizador
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.015);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Iluminación de la Escena
    const ambientLight = new THREE.AmbientLight(0x331122, 0.6);
    scene.add(ambientLight);

    const roseLight = new THREE.PointLight(0xff3366, 2, 8);
    roseLight.position.set(0, 1, 0);
    mainGroup.add(roseLight);

    const directionalLight = new THREE.DirectionalLight(0xffe599, 1);
    directionalLight.position.set(2, 10, 3);
    scene.add(directionalLight);

    // ==========================================
    // 🛠️ MODELADO EN 3D DE LA ROSA Y EL RECIPIENTE
    // ==========================================

    const baseGeo = new THREE.CylinderGeometry(2.2, 2.3, 0.3, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.2, metalness: 0.8 });
    const domeBase = new THREE.Mesh(baseGeo, baseMat);
    domeBase.position.y = -2.5;
    mainGroup.add(domeBase);

    const glassGeo = new THREE.CylinderGeometry(2.0, 2.0, 4.5, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transparent: true, opacity: 0.15, roughness: 0.1,
        transmission: 0.9, thickness: 0.5, side: THREE.DoubleSide
    });
    const glassCylinder = new THREE.Mesh(glassGeo, glassMat);
    glassCylinder.position.y = -0.1;
    mainGroup.add(glassCylinder);

    const domeTopGeo = new THREE.SphereGeometry(2.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeTop = new THREE.Mesh(domeTopGeo, glassMat);
    domeTop.position.y = 2.15;
    mainGroup.add(domeTop);

    const roseGroup = new THREE.Group();
    roseGroup.position.y = -2.3;
    mainGroup.add(roseGroup);

    const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 16);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x1a3311, roughness: 0.6 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 1.6;
    roseGroup.add(stem);

    const flowerGroup = new THREE.Group();
    flowerGroup.position.y = 3.1;
    roseGroup.add(flowerGroup);

    const petalMat = new THREE.MeshStandardMaterial({ color: 0xb3001e, roughness: 0.5, metalness: 0.1 });

    for (let i = 0; i < 24; i++) {
        const pGeo = new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI, 0, Math.PI / 2);
        const pMesh = new THREE.Mesh(pGeo, petalMat);
        
        const layer = Math.floor(i / 6);
        const scaleFactor = 1 + layer * 0.15;
        pMesh.scale.set(scaleFactor, scaleFactor * 1.4, scaleFactor * 0.6);
        
        pMesh.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        pMesh.rotation.y = (i * (Math.PI / 3)) + (Math.random() * 0.2);
        pMesh.position.setFromSphericalCoords(0.12 * layer, Math.PI / 4, pMesh.rotation.y);
        
        flowerGroup.add(pMesh);
    }

    const leafGeo = new THREE.ConeGeometry(0.3, 0.8, 16);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x224411, roughness: 0.5 });

    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    leaf1.position.set(0.3, 1.8, 0);
    leaf1.rotation.z = -Math.PI / 3;
    leaf1.scale.set(1, 1, 0.2);
    roseGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    leaf2.position.set(-0.3, 1.2, 0);
    leaf2.rotation.z = Math.PI / 3;
    leaf2.scale.set(1, 1, 0.2);
    roseGroup.add(leaf2);

    // ==========================================
    // ✨ SISTEMA DE PARTÍCULAS (Estrellas y Pétalos)
    // ==========================================

    const starsCount = 200;
    const starsGeo = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);

    for(let i=0; i < starsCount * 3; i++) {
        starsPositions[i] = (Math.random() - 0.5) * 40;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.7 });
    const starPoints = new THREE.Points(starsCount, starsMat);
    scene.add(starPoints);

    const petalParticlesCount = 15;
    const petalsData = [];
    const petalsGroup = new THREE.Group();
    mainGroup.add(petalsGroup);

    for (let i = 0; i < petalParticlesCount; i++) {
        const pGeo = new THREE.BoxGeometry(0.12, 0.16, 0.02);
        const pMesh = new THREE.Mesh(pGeo, petalMat);
        
        resetPetalPhysics(pMesh);
        pMesh.position.y = -2.0 + Math.random() * 4.5; 
        
        petalsGroup.add(pMesh);
        petalsData.push(pMesh);
    }

    function resetPetalPhysics(mesh) {
        mesh.position.set((Math.random() - 0.5) * 0.3, 0.7, (Math.random() - 0.5) * 0.3);
        mesh.userData = {
            speedY: Math.random() * 0.015 + 0.01,
            speedX: (Math.random() - 0.5) * 0.01,
            speedZ: (Math.random() - 0.5) * 0.01,
            rotX: Math.random() * 0.02,
            rotY: Math.random() * 0.03,
            wobbleSpeed: Math.random() * 0.05 + 0.02,
            wobbleTime: Math.random() * 100
        };
    }

    // ==========================================
    // 🖱️ INTERACTIVIDAD CON MOUSE Y TOQUES TÁCTILES
    // ==========================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    window.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
        const deltaMove = { x: e.offsetX - previousMousePosition.x, y: e.offsetY - previousMousePosition.y };
        if (isDragging) {
            mainGroup.rotation.y += deltaMove.x * 0.007;
        }
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    window.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaMove = { x: e.touches[0].clientX - previousMousePosition.x, y: e.touches[0].clientY - previousMousePosition.y };
        mainGroup.rotation.y += deltaMove.x * 0.01;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ==========================================
    // 🔄 BUCLE DE RENDERIZADO Y ANIMACIÓN
    // ==========================================
    function update() {
        if (!isDragging) {
            mainGroup.rotation.y += 0.002;
        }

        petalsData.forEach(mesh => {
            mesh.userData.wobbleTime += mesh.userData.wobbleSpeed;
            mesh.position.y -= mesh.userData.speedY;
            mesh.position.x += mesh.userData.speedX + Math.sin(mesh.userData.wobbleTime) * 0.005;
            mesh.position.z += mesh.userData.speedZ;
            mesh.rotation.x += mesh.userData.rotX;
            mesh.rotation.y += mesh.userData.rotY;

            if (mesh.position.y <= -2.3) {
                resetPetalPhysics(mesh);
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    update();
}

// ==========================================
// 🔔 INTERFAZ DE LA CARTA MÁGICA
// ==========================================
const bellBtn = document.getElementById('bell-btn');
const modal = document.getElementById('message-modal');
const closeModal = document.getElementById('close-modal');
const messageTextContainer = document.getElementById('daily-message-text');

bellBtn.addEventListener('click', () => {
    messageTextContainer.innerText = mensajeUnico;
    bellBtn.classList.add('ringing');
    
    setTimeout(() => {
        bellBtn.classList.remove('ringing');
        modal.classList.add('active');
    }, 600);
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});
