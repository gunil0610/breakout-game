"use strict";

const rulesBtn = document.getElementById("rules-btn"),
  closeBtn = document.getElementById("close-btn"),
  rules = document.getElementById("rules"),
  gameOver = document.getElementById("gameover"),
  playBtn = document.getElementById("play-btn"),
  canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");

let score = 0;

const brickRowCount = 9;
const brickColCount = 5;

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2, true);
  ctx.fillStyle = "#66bfbf";
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#66bfbf";
  ctx.fill();
  ctx.closePath();
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#66bfbf" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Draw Score on canvas
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  // Wall collision (top/bottom)
  if (ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x && // left paddle side check
    ball.x + ball.size < paddle.x + paddle.w && // right paddle side check
    ball.y + ball.size > paddle.y // top paddle side check
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    gameOver.classList.add("show");
    resetGame();
  }
}

// Reset Game
function resetGame() {
  showAllBricks();
  score = 0;
  ball.dx = 0;
  ball.dy = 0;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
}

function startGame() {
  ball.dx = 4;
  ball.dy = -4;
}

// Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColCount) === 0) {
    showAllBricks();
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
}

// Draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event
function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    paddle.dx = paddle.speed;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === "ArrowRight" ||
    e.key === "Right" ||
    e.key === "ArrowLeft" ||
    e.key === "Left"
  ) {
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// Rules and close event handler
rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
playBtn.addEventListener("click", () => {
  gameOver.classList.remove("show");
  startGame();
});
