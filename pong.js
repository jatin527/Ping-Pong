const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 4,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7,
  color: "ORANGE",
};
const ball2 = {
  x: canvas.width / 2,
  y: (3 * canvas.height) / 4,
  radius: 10,
  velocityX: -5,
  velocityY: 5,
  speed: 7,
  color: "ORANGE",
};

const player1 = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "BROWN",
  up: false,
  down: false,
};

const player2 = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "BROWN",
  up: false,
  down: false,
};

const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: canvas.height,
  width: 2,
  color: "RED",
};

function drawbox(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function resetBall(ball) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 7;
}

function drawText(text, x, y) {
  ctx.fillStyle = "#FFF";
  ctx.font = "75px fantasy";
  ctx.fillText(text, x, y);
}

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
  );
}

let keysPressed = {};
document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;

  if (keysPressed["w"]) {
    player1.y = player1.y - 25;
  }
  if (keysPressed["s"]) {
    player1.y = player1.y + 25;
  }
  if (keysPressed["ArrowUp"]) {
    player2.y = player2.y - 25;
  }
  if (keysPressed["ArrowDown"]) {
    player2.y = player2.y + 25;
  }
});

document.addEventListener("keyup", (event) => {
  delete keysPressed[event.key];
});

function update_game(ball) {
  if (ball.x - ball.radius <= 0) {
    player2.score++;
    resetBall(ball);
  } else if (ball.x + ball.radius >= canvas.width) {
    player1.score++;
    resetBall(ball);
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ai === "true") {
    player2.y += (ball.y - (player2.y + player2.height / 2)) * 0.1;
  }

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  let player = ball.x + ball.radius < canvas.width / 2 ? player1 : player2;

  if (collision(ball, player)) {
    let coP = ball.y - (player.y + player.height / 2);

    coP = coP / (player.height / 2);

    let angleRad = (Math.PI / 4) * coP;
    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.1;
  }
}

function myStopFunction() {
  clearInterval(loop);
  drawbox(0, 0, canvas.width, canvas.height, "#000");
  drawText(player1.score, canvas.width / 4, canvas.height / 5);
  drawText(player2.score, (3 * canvas.width) / 4, canvas.height / 5);
  drawbox(net.x, net.y, net.width, net.height, net.color);
  drawbox(player1.x, player1.y, player1.width, player1.height, player1.color);
  drawbox(player2.x, player2.y, player2.width, player2.height, player2.color);
}

function render_game() {
  drawbox(0, 0, canvas.width, canvas.height, "#000");
  drawText(player1.score, canvas.width / 4, canvas.height / 5);
  drawText(player2.score, (3 * canvas.width) / 4, canvas.height / 5);
  drawbox(net.x, net.y, net.width, net.height, net.color);
  drawbox(player1.x, player1.y, player1.width, player1.height, player1.color);
  drawbox(player2.x, player2.y, player2.width, player2.height, player2.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
  if (n_ball === "true") {
    drawCircle(ball2.x, ball2.y, ball2.radius, ball2.color);
  }

  if (player1.score == tscore) {
    myStopFunction();
    document.getElementById("result").innerHTML = n_player1 + " wins !!";
  }
  if (player2.score == tscore) {
    myStopFunction();
    document.getElementById("result").innerHTML = n_player2 + " wins !!";
  }
}

function start_game() {
  update_game(ball);
  if (n_ball === "true") {
    update_game(ball2);
  }
  render_game();
}

function getValue(name) {
  return decodeURI(
    (RegExp(name + "=" + "(.+?)(&|$)").exec(location.search) || [, null])[1]
  );
}

var n_player1 = getValue("p1");
var ai = getValue("ai");
if (ai === "false") {
  var n_player2 = getValue("p2");
} else {
  var n_player2 = "Computer";
}
var tscore = getValue("score");
var n_ball = getValue("ball");

let framePerSecond = 50;
let loop = setInterval(start_game, 1000 / framePerSecond);
