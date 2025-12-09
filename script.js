const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const paddleWidth = 15;
const paddleHeight = 90;
const ballSize = 16;
const playerX = 35;
const aiX = canvas.width - playerX - paddleWidth;

// Paddle positions
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

// Ball position and velocity
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeed = 5;
let ballVelX = ballSpeed * (Math.random() < 0.5 ? 1 : -1);
let ballVelY = ballSpeed * (Math.random() * 2 - 1);

// Track mouse movement for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - paddleHeight / 2;
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
});

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX + ballSize/2, ballY + ballSize/2, ballSize/2, 0, Math.PI * 2);
    ctx.fillStyle = '#f8b400';
    ctx.fill();

    // Draw center line
    ctx.strokeStyle = '#444';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Update positions
function update() {
    // Ball movement
    ballX += ballVelX;
    ballY += ballVelY;

    // Wall collision (top/bottom)
    if (ballY < 0) {
        ballY = 0;
        ballVelY *= -1;
    }
    if (ballY + ballSize > canvas.height) {
        ballY = canvas.height - ballSize;
        ballVelY *= -1;
    }

    // Paddle collision (left/player)
    if (
        ballX < playerX + paddleWidth &&
        ballY + ballSize > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballX = playerX + paddleWidth;
        ballVelX *= -1;

        // Add some "spin" based on where it hits the paddle
        let hitPos = (ballY + ballSize/2) - (playerY + paddleHeight/2);
        ballVelY += hitPos * 0.15;
    }

    // Paddle collision (right/AI)
    if (
        ballX + ballSize > aiX &&
        ballY + ballSize > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballX = aiX - ballSize;
        ballVelX *= -1;

        let hitPos = (ballY + ballSize/2) - (aiY + paddleHeight/2);
        ballVelY += hitPos * 0.15;
    }

    // Score! (reset ball)
    if (ballX < 0 || ballX + ballSize > canvas.width) {
        resetBall();
    }

    // AI paddle movement (tracks ballY with smoothing)
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY + ballSize / 2 - 10) {
        aiY += Math.min(5, ballY + ballSize / 2 - aiCenter);
    } else if (aiCenter > ballY + ballSize / 2 + 10) {
        aiY -= Math.min(5, aiCenter - (ballY + ballSize / 2));
    }
    // Clamp AI paddle position
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - paddleHeight) aiY = canvas.height - paddleHeight;
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeed = 5;
    ballVelX = ballSpeed * (Math.random() < 0.5 ? 1 : -1);
    ballVelY = ballSpeed * (Math.random() * 2 - 1);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();