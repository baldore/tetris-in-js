import Player from './player';

class Arena {
  matrix: number[][]

  constructor(width: number, height: number) {
    const matrix = [];
    while (height--) {
      matrix.push(new Array(width).fill(0));
    }
    this.matrix = matrix;
  }

  collide(player: Player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 && (this.matrix[y + o.y] && this.matrix[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  }

  clear() {
    this.matrix.forEach((row) => row.fill(0));
  }

  merge(player: Player) {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.matrix[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }

  sweep() {
    let rowCount = 1;
    let score = 0;
    const pointsPerLine = 10;
    for (let y = this.matrix.length - 1; y > 0; --y) {
      const isLineFull = !this.matrix[y].some((value) => value === 0);
      if (isLineFull) {
        const row = this.matrix.splice(y, 1)[0].fill(0);
        this.matrix.unshift(row);
        y++;
        score += rowCount * pointsPerLine;
        rowCount *= 2;
      }
    }
    return score;
  }
}

export default Arena;
