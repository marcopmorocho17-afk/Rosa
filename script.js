// ==========================================
// 🌹 MENSAJE ÚNICO Y ESPECIAL
// ==========================================
const mensajeUnico = 'Que en este día te vaya súper pero súper bonito. Que recuerdes que no estás sola y, sobre todo, que siempre debes ser tú. No cambies solo porque algún pendejo te lo dijo. Eres perfecta como eres, aunque no te guste el marisco, jajaja. 10:04 a. m';

// ===================================================
// LÓGICA DE FÍSICAS Y ANIMACIONES (Estrellas, Domo y Pétalos)
// ===================================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const stars = [];
const particles = [];
const petals = [];

const numStars = 100;
const numParticles = 50;
const numPetals = 12;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.8 + 0.2
    });
}

for (let i = 0; i < numParticles; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.5,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.4
    });
}

function getRosePosition() {
    const roseElement = document.querySelector('.rose-icon');
    if (roseElement) {
        const rect = roseElement.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 3 };
    }
    return { x: width / 2, y: height / 3 };
}

function getDomeBottom() {
    const domeElement = document.querySelector('.glass-dome');
    if (domeElement) {
        return domeElement.getBoundingClientRect().bottom - 12;
    }
    return height / 2;
}

function createPetalFromRose() {
    const rosePos = getRosePosition();
    return {
        x: rosePos.x + (Math.random() - 0.5) * 30,
        y: rosePos.y,
        size: Math.random() * 4 + 5,
        speedY: Math.random() * 0.4 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        opacity: 1
    };
}

for (let i = 0; i < numPetals; i++) {
    const p = createPetalFromRose();
    p.y += Math.random() * (getDomeBottom() - p.y);
    petals.push(p);
}

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > height) { p.y = -10; p.x = Math.random() * width; }
    });

    const domeBottom = getDomeBottom();

    petals.forEach((pt, index) => {
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.angle);
        
        let currentOpacity = pt.opacity;
        const distanceToBase = domeBottom - pt.y;
        if (distanceToBase < 30) {
            currentOpacity = Math.max(0, distanceToBase / 30);
        }

        ctx.fillStyle = `rgba(212, 0, 40, ${currentOpacity})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-pt.size, -pt.size, -pt.size, pt.size, 0, pt.size * 1.5);
        ctx.bezierCurveTo(pt.size, pt.size, pt.size, -pt.size, 0, 0);
        ctx.fill();
        ctx.restore();

        pt.y += pt.speedY;
        pt.x += pt.speedX + Math.sin(pt.y / 20) * 0.15;
        pt.angle += pt.spin;

        if (pt.y >= domeBottom || currentOpacity <= 0) {
            petals[index] = createPetalFromRose();
        }
    });

    requestAnimationFrame(animate);
}
animate();

// ===================================================
// LÓGICA DE ENTREGA DE TU MENSAJE
// ===================================================
const bellBtn = document.getElementById('bell-btn');
const modal = document.getElementById('message-modal');
const closeModal = document.getElementById('close-modal');
const messageTextContainer = document.getElementById('daily-message-text');
const modalDateTitle = document.getElementById('modal-date');

bellBtn.addEventListener('click', () => {
    modalDateTitle.innerText = `Un Pensamiento Para Ti`;
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
