// ==========================================
// 🌹 TU CONFIGURACIÓN DE MENSAJE
// ==========================================
const mensajeUnico = 'Te deseo una bonita noche que duermas bien y que amanzezcas con energias 9:17pm';

// Asegurar que la librería y el HTML estén listos al mismo tiempo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verificarCarga);
} else {
    verificarCarga();
}

function verificarCarga() {
    if (typeof THREE === 'undefined') {
        window.addEventListener('load', init3D);
    } else {
        init3D();
    }
}

function init3D() {
    const container = document.getElementById('canvas-3d-container');
    
    // Si el contenedor HTML aún no se crea, reintenta en un parpadeo
    if (!container) {
        setTimeout(init3D, 100);
        return;
    }

    // ==========================================
    // 🎮 CONFIGURACIÓN DEL MOTOR EN 3D (Three.js)
    // ==========================================
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

    // ==========================================
    // ☀️🌙 SISTEMA DE ILUMINACIÓN DINÁMICA
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x1a0d1a, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff3cc, 1.5);
    sunLight.position.set(15, 8, 5);
    scene.add(sunLight);

    const moonLight = new THREE.DirectionalLight(0x99ccff, 0.3);
    moonLight.position.set(-15, 8, -5);
    scene.add(moonLight);

    const roseGlowLight = new THREE.PointLight(0xff1a53, 3, 10);
    roseGlowLight.position.set(0, 0.8, 0);
    mainGroup.add(roseGlowLight);

    // ==========================================
    // 🪐 ELEMENTOS CELESTIALES (SOL Y LUNA)
    // ==========================================
    const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffdd66 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(18, 10, -8);
    scene.add(sunMesh);

    const moonGeo = new THREE.SphereGeometry(0.9, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xd9e6f2 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(-18, 10, -8);
    scene.add(moonMesh);

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
        color: 0xffffff, transparent: true, opacity: 0.15, roughness: 0.05,
        transmission: 0.9, thickness: 0.4, side: THREE.DoubleSide
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

    const petalMat = new THREE.MeshStandardMaterial({ color: 0xb3001e, roughness: 0.4, metalness: 0.1 });

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
    leaf1.position.set(0.3, 1.8, 0); leaf1.rotation.z = -Math.PI / 3; leaf1.scale.set(1, 1, 0.2);
    roseGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    leaf2.position.set(-0.3, 1.2, 0); leaf2.rotation.z = Math.PI / 3; leaf2.scale.set(1, 1, 0.2);
    roseGroup.add(leaf2);

    // ==========================================
    // ✨ SISTEMA DE PARTÍCULAS
    // ==========================================
    const starsCount = 200;
    const starsGeo = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    for(let i=0; i < starsCount * 3; i++) {
        starsPositions[i] = (Math.random() - 0.5) * 40;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0 });
    const starPoints = new THREE.Points(starsGeo, starsMat);
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
    // 🖱️ INTERACTIVIDAD ADAPTIVA (GIROS)
    // ==========================================
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    window.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.offsetX - previousMousePosition.x;
            mainGroup.rotation.y += deltaX * 0.007;
        }
        previousMousePosition = { x: e.offsetX, y: e.offsetY };
    });

    window.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.touches.clientX, y: e.touches.clientY };
    });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches.clientX - previousMousePosition.x;
        mainGroup.rotation.y += deltaX * 0.01;
        previousMousePosition = { x: e.touches.clientX, y: e.touches.clientY };
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

        // ==========================================
    // 🔄 BUCLE DE ANIMACIÓN Y TRANSICIÓN DE LUZ
    // ==========================================
    function update() {
        if (!isDragging) {
            mainGroup.rotation.y += 0.002;
        }

        const angle = mainGroup.rotation.y % (Math.PI * 2);
        const dayFactor = (Math.cos(angle) + 1) / 2; 
        const nightFactor = 1 - dayFactor;

        sunLight.intensity = dayFactor * 1.8;
        moonLight.intensity = nightFactor * 0.6;
        ambientLight.intensity = (dayFactor * 0.5) + (nightFactor * 0.1);
        roseGlowLight.intensity = (nightFactor * 4.5) + (dayFactor * 0.5);
        
        const skyColor = new THREE.Color(0x020205).lerp(new THREE.Color(0x1a263a), dayFactor);
        renderer.setClearColor(skyColor);
        scene.fog.color.copy(skyColor);

        starsMat.opacity = nightFactor * 0.8;

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
// 🔔 ACCIONES DE DESPLEGADO DE LA CARTA
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


    
