import createPiece from './create-piece';
import Tetris from './tetris';
import Arena from './arena';

export interface Position {
  x: number,
  y: number
}

class Player {
  DROP_SLOW: number
  DROP_FAST: number
  matrix: number[][]
  arena: Arena
  dropCounter: number
  dropInterval: number
  pos: Position
  score: number

  constructor(public tetris: Tetris) {
    this.DROP_SLOW = 1000;
    this.DROP_FAST = 50;

    this.arena = tetris.arena;
    this.dropCounter = 0;
    this.dropInterval = this.DROP_SLOW;
    this.pos = { x: 0, y: 0 };
    this.matrix = null;
    this.score = 0;

    this.reset();
  }

  move(direction: number) {
    this.pos.x += direction;
    if (this.arena.collide(this)) {
      this.pos.x -= direction;
    }
  }

  rotate(direction: number) {
    const initialPosition = this.pos.x;
    let offset = 1;
    this._rotateMatrix(this.matrix, direction);
    while (this.arena.collide(this)) {
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
    if (this.arena.collide(this)) {
      this.pos.y--;
      this.arena.merge(this);
      this.reset();
      this.score += this.arena.sweep();
      this.tetris.updateScore(this.score);
    }
    this.dropCounter = 0;
  }

  reset() {
    const pieces = 'ILJOTSZ';
    this.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    this.pos.y = 0;
    this.pos.x = (this.arena.matrix[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0);
    if (this.arena.collide(this)) {
      this.arena.clear();
      this.score = 0;
      this.tetris.updateScore(this.score);
    }
  }

  update(deltaTime: number) {
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
  }

  _rotateMatrix(matrix: number[][], direction: number) {
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

export default Player;
