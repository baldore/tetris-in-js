class Player {
  constructor() {
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.pos = { x: 0, y: 0 };
    this.matrix = null;
    this.score = 0;
  }

  move(direction) {
    this.pos.x += direction;
    if (collides(arena, this)) {
      this.pos.x -= direction;
    }
  }

  rotate(direction) {
    const initialPosition = this.pos.x;
    let offset = 1;
    this._rotateMatrix(this.matrix, direction);
    while (collides(arena, this)) {
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        this._rotateMatrix(this.matrix, -direction);
        this.pos.x = initialPosition;
        return;
      }
    }
  }

  drop() {
    this.pos.y++;
    if (collides(arena, this)) {
      this.pos.y--;
      arena.merge(this);
      this.reset();
      arena.sweep();
      updateScore();
    }
    this.dropCounter = 0;
  }

  reset() {
    const pieces = 'ILJOTSZ';
    this.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    this.pos.y = 0;
    this.pos.x = (arena.matrix[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0);
    if (collides(arena, this)) {
      arena.clear();
      this.score = 0;
      updateScore();
    }
  }

  update(deltaTime) {
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
  }

  _rotateMatrix(matrix, direction) {
    for (let y = 0; y < matrix.length; ++y) {
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
}
