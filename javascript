const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const msgOverlay = document.getElementById('msg-overlay');

canvas.width = 600;
canvas.height = window.innerHeight;

// Configurações de Jogo
let gameActive = false;
let level = 1;
let roadOffset = 0;
let speed = 5;

// Carros (Imagens reais de cima)
const car1Img = new Image();
car1Img.src = 'https://i.imgur.com/vH0HhU9.png'; // Carro Esportivo Vermelho
const car2Img = new Image();
car2Img.src = 'https://i.imgur.com/Bf0NnO5.png'; // Carro Esportivo Azul

const p1 = { x: 150, y: canvas.height - 150, w: 80, h: 140, speed: 0, score: 0 };
const p2 = { x: 370, y: canvas.height - 150, w: 80, h: 140, speed: 0, score: 0 };

const keys = {};

// Controle de Teclado
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space' && !gameActive) startGame();
});
window.addEventListener('keyup', (e) => keys[e.code] = false);

function startGame() {
    gameActive = true;
    msgOverlay.style.display = 'none';
    update();
}

function update() {
    if (!gameActive) return;

    // Movimentação Player 1 (W, S, A, D)
    if (keys['KeyW'] && p1.y > 0) p1.y -= 5;
    if (keys['KeyS'] && p1.y < canvas.height - p1.h) p1.y += 5;
    if (keys['KeyA'] && p1.x > 20) p1.x -= 5;
    if (keys['KeyD'] && p1.x < canvas.width/2 - 90) p1.x += 5;

    // Movimentação Player 2 (Setas)
    if (keys['ArrowUp'] && p2.y > 0) p2.y -= 5;
    if (keys['ArrowDown'] && p2.y < canvas.height - p2.h) p2.y += 5;
    if (keys['ArrowLeft'] && p2.x > canvas.width/2 + 10) p2.x -= 5;
    if (keys['ArrowRight'] && p2.x < canvas.width - 100) p2.x += 5;

    // Lógica de Pontuação e Fases
    p1.score += speed / 10;
    p2.score += speed / 10;
    
    checkLevel();
    draw();
    requestAnimationFrame(update);
}

function checkLevel() {
    let progress = Math.max(p1.score, p2.score);
    if (progress > level * 1000 && level < 5) {
        level++;
        speed += 3; // Aumenta a dificuldade
        document.getElementById('level').innerText = level;
    }
}

function drawRoad() {
    // Desenha o asfalto e faixas
    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "#FFF";
    ctx.setLineDash([40, 20]);
    ctx.lineDashOffset = -roadOffset;
    
    // Linha Central
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    roadOffset += speed;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();

    // Desenha Carros com sombra para realismo
    ctx.shadowBlur = 15;
    ctx.shadowColor = "black";
    
    ctx.drawImage(car1Img, p1.x, p1.y, p1.w, p1.h);
    ctx.drawImage(car2Img, p2.x, p2.y, p2.w, p2.h);
    
    ctx.shadowBlur = 0;

    // Atualiza UI
    document.getElementById('p1-score').innerText = Math.floor(p1.score);
    document.getElementById('p2-score').innerText = Math.floor(p2.score);
}
