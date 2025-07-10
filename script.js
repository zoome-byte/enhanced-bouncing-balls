const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const ballCountText = document.getElementById('ballCount');
let gravityOn = false;

canvas.width = 800;
canvas.height = 500;

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`;
}

class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size) >= canvas.width || (this.x - this.size) <= 0) {
      this.velX = -this.velX;
    }
    if ((this.y + this.size) >= canvas.height || (this.y - this.size) <= 0) {
      this.velY = -this.velY;
    }

    if (gravityOn) this.velY += 0.2;

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const other of balls) {
      if (!(this === other) && other.exists) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + other.size) {
          this.color = other.color = randomColor();
        }
      }
    }
  }

  isClicked(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy) < this.size;
  }
}

let balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, canvas.width - size),
    random(size, canvas.height - size),
    random(-2, 2),
    random(-2, 2),
    randomColor(),
    size
  );
  balls.push(ball);
}
ballCountText.textContent = balls.length;

canvas.addEventListener('click', function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (const ball of balls) {
    if (ball.exists && ball.isClicked(mouseX, mouseY)) {
      ball.exists = false;
      updateBallCount();
      break;
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'g') {
    gravityOn = !gravityOn;
  }
});

function updateBallCount() {
  const activeBalls = balls.filter(b => b.exists).length;
  ballCountText.textContent = activeBalls;
}

function loop() {
  // Draw transparent background for trailing effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  requestAnimationFrame(loop);
}

loop();
