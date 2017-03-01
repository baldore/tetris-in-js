const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let lastTime = 0;

const arena = createMatrix(12, 20);

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

function arenaSweep() {
  let rowCount = 1;
  const pointsPerLine = 10;
  for (let y = arena.length - 1; y > 0; --y) {
    const isLineFull = !arena[y].some((value) => value === 0);
    if (isLineFull) {
      const row = arena.splice(y, 1)[0].fill(0);
      arena.unshift(row);
      y++;
      player.score += rowCount * pointsPerLine;
      rowCount *= 2;
    }
  }
}

function collides(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(width, height) {
  const newMatrix = [];
  while (height--) {
    newMatrix.push(new Array(width).fill(0));
  }
  return newMatrix;
}

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

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, { x: 0, y: 0 });
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

function playerReset() {
  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collides(arena, player)) {
    arena.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
  }
}

function rotate(matrix, direction) {
  for (let y = 0; y< matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (direction > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  player.update(deltaTime);

  draw();
  requestAnimationFrame(update);
}

function updateScore() {
  document.querySelector('#score').innerText = player.score;
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

playerReset();
updateScore();
update();