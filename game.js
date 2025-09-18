const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 12;

// Left paddle (player)
const paddleLeft = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#4CAF50"
};

// Right paddle (AI)
const paddleRight = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#F44336",
    speed: 5
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speed: 6,
    dx: 6,
    dy: 6,
    color: "#FFD600"
};

// Scores
let scoreLeft = 0;
let scoreRight = 0;

// Mouse paddle control
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    paddleLeft.y = mouseY - paddleLeft.height / 2;

    // Prevent paddle from going out of bounds
    paddleLeft.y = Math.max(0, Math.min(canvas.height - paddleLeft.height, paddleLeft.y));
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "#bbb";
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = paddleLeft.color;
    ctx.fillRect(paddleLeft.x, paddleLeft.y, paddleLeft.width, paddleLeft.height);

    ctx.fillStyle = paddleRight.color;
    ctx.fillRect(paddleRight.x, paddleRight.y, paddleRight.width, paddleRight.height);

    // Draw ball
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "32px Arial";
    ctx.fillStyle = "#eee";
    ctx.fillText(scoreLeft, canvas.width / 2 - 60, 40);
    ctx.fillText(scoreRight, canvas.width / 2 + 30, 40);
}

// Collision detection
function collide(paddle) {
    return (
        ball.x - ball.size < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y - ball.size < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    );
}

// Game logic
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collisions with top/bottom walls
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy *= -1;
    }

    // Ball collisions with paddles
    if (collide(paddleLeft)) {
        ball.dx = Math.abs(ball.dx);
        // Add some "spin"
        ball.dy += (ball.y - (paddleLeft.y + paddleLeft.height / 2)) * 0.1;
    }

    if (collide(paddleRight)) {
        ball.dx = -Math.abs(ball.dx);
        ball.dy += (ball.y - (paddleRight.y + paddleRight.height / 2)) * 0.1;
    }

    // Ball out of bounds
    if (ball.x - ball.size < 0) {
        scoreRight += 1;
        resetBall("right");
    } else if (ball.x + ball.size > canvas.width) {
        scoreLeft += 1;
        resetBall("left");
    }

    // AI paddle movement (simple tracking)
    let center = paddleRight.y + paddleRight.height / 2;
    if (center < ball.y - 10) {
        paddleRight.y += paddleRight.speed;
    } else if (center > ball.y + 10) {
        paddleRight.y -= paddleRight.speed;
    }
    // Prevent AI paddle from going out of bounds
    paddleRight.y = Math.max(0, Math.min(canvas.height - paddleRight.height, paddleRight.y));
}

// Reset ball after score
function resetBall(direction) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dy = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.dx = direction === "right" ? -6 : 6;
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();