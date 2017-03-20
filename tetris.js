const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let lastTime = 0;

const arena = new Arena(12, 20);

const player = new Player;

const colors = [
  null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF'
];


function createPiece(type) {
  if (type === 'T') {
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ];
  } else if (type === 'O') {
    return [
      [2, 2],
      [2, 2]
    ];
  } else if (type === 'L') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3]
    ];
  } else if (type === 'J') {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0]
    ];
  } else if (type === 'I') {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0]
    ];
  } else if (type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0]
    ];
  } else if (type === 'Z') {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0]
    ];
  }
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena.matrix, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function updateScore() {
  document.querySelector('#score').innerText = player.score;
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  player.update(deltaTime);

  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 37) {
    player.move(-1);
  } else if (event.keyCode === 39) {
    player.move(1);
  } else if (event.keyCode === 40) {
    player.drop();
  } else if (event.keyCode === 81) { // q
    player.rotate(-1);
  } else if (event.keyCode === 87) { // w
    player.rotate(1);
  }
});

player.reset();
updateScore();
update();