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
    rotate(this.matrix, direction);
    while (collides(arena, this)) {
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        rotate(this.matrix, -direction);
        this.pos.x = initialPosition;
        return;
      }
    }
  }

  drop() {
    this.pos.y++;
    if (collides(arena, this)) {
      this.pos.y--;
      merge(arena, this);
      this.reset();
      arenaSweep();
      updateScore();
    }
    this.dropCounter = 0;
  }

  reset() {
    const pieces = 'ILJOTSZ';
    this.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    this.pos.y = 0;
    this.pos.x = (arena[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0);
    if (collides(arena, this)) {
      arena.forEach((row) => row.fill(0));
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
}
